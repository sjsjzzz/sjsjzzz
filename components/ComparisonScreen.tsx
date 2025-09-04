import React, { useState, useEffect, useRef } from 'react';
import type { SurveyResult } from '../types';
import Card from './Card';
import { Chart, registerables } from 'chart.js';
import type { Plugin } from 'chart.js';

// Custom plugin to draw background zones for severity levels
const radarZonePlugin: Plugin<'radar'> = {
  id: 'radarZonePlugin',
  beforeDraw: (chart) => {
    // FIX: The `chart.type` check was causing a TypeScript error. It's also redundant because this plugin
    // is specifically for 'radar' charts due to `Plugin<'radar'>`, so the check is removed.
    const { ctx } = chart;
    const rScale = (chart.scales as any).r;

    if (!rScale?.pointLabels) return;

    const { xCenter, yCenter, drawingArea: radius } = rScale;
    const pointCount = rScale.pointLabels.length;

    if (pointCount === 0) return;
    
    // Define severity zones with corresponding colors
    const zones = [
      { threshold: 100, color: 'rgba(239, 68, 68, 0.15)' },   // Severe
      { threshold: 75, color: 'rgba(249, 115, 22, 0.15)' },  // Moderate
      { threshold: 50, color: 'rgba(245, 158, 11, 0.15)' }, // Mild
      { threshold: 25, color: 'rgba(34, 197, 94, 0.15)' },  // Normal
    ];

    const startAngle = -Math.PI / 2;

    ctx.save();
    zones.forEach(zone => {
      const zoneRadius = (zone.threshold / 100) * radius;
      
      ctx.beginPath();
      ctx.moveTo(xCenter + zoneRadius * Math.cos(startAngle), yCenter + zoneRadius * Math.sin(startAngle));
      
      for (let i = 1; i < pointCount; i++) {
        const currentAngle = startAngle + i * (2 * Math.PI / pointCount);
        ctx.lineTo(xCenter + zoneRadius * Math.cos(currentAngle), yCenter + zoneRadius * Math.sin(currentAngle));
      }
      
      ctx.closePath();
      ctx.fillStyle = zone.color;
      ctx.fill();
    });
    ctx.restore();
  }
};

// Register Chart.js components and our custom plugin
if (!Chart.registry.plugins.get('radarZonePlugin')) {
  Chart.register(...registerables, radarZonePlugin);
} else {
  Chart.register(...registerables);
}


interface ComparisonScreenProps {
  resultIds: string[];
  onBack: () => void;
}

const ComparisonScreen: React.FC<ComparisonScreenProps> = ({ resultIds, onBack }) => {
  const [results, setResults] = useState<SurveyResult[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    try {
      const savedResults: SurveyResult[] = JSON.parse(localStorage.getItem('surveyResults') || '[]');
      // Preserve order from selection
      const selectedResults = resultIds.map(id => savedResults.find(r => r.id === id)).filter(Boolean) as SurveyResult[];
      setResults(selectedResults);
    } catch (error) {
      console.error("결과를 불러오는 데 실패했습니다.", error);
    }
  }, [resultIds]);

  useEffect(() => {
    if (chartRef.current && results.length === 2) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const labels = results[0].results.map(r => r.title);
        
        const datasets = results.map((result, index) => ({
          label: `${result.patientInfo.name} (${result.date})`,
          data: result.results.map(r => (r.score / r.maxScore) * 100),
          backgroundColor: index === 0 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(34, 197, 94, 0.2)',
          borderColor: index === 0 ? 'rgba(59, 130, 246, 1)' : 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
        }));

        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: { labels, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                angleLines: { color: 'rgba(0, 0, 0, 0.2)' },
                grid: { color: 'rgba(0, 0, 0, 0.2)' },
                pointLabels: {
                  font: { size: 14, weight: 'bold' },
                  color: '#334155'
                },
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
            }
          }
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results]);
  
  if (results.length < 2) {
    return (
      <Card>
        <p className="text-center text-slate-500">결과를 불러오는 중이거나, 비교할 데이터가 부족합니다.</p>
        <div className="mt-4 text-center">
            <button onClick={onBack} className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-300">
                뒤로가기
            </button>
        </div>
      </Card>
    );
  }

  const [resultA, resultB] = results;

  return (
    <Card>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">결과 비교</h1>
        <p className="mt-2 text-slate-600">
          {resultA.date}와 {resultB.date}의 결과를 비교합니다.
        </p>
      </div>

      <div className="mb-8 relative" style={{ height: '400px' }}>
        <canvas ref={chartRef} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[resultA, resultB].map(result => (
          <div key={result.id} className="p-4 border rounded-lg bg-slate-50">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-3">{result.patientInfo.name} ({result.date})</h2>
            <div className="space-y-3">
              {result.results.map(item => (
                <div key={item.section}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold">{item.displayTitle}</h4>
                    <span className={`px-2 py-0.5 text-xs font-semibold text-white rounded-full ${item.interpretation.color}`}>
                      {item.interpretation.level}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.score} / {item.maxScore}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button onClick={onBack} className="px-10 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors duration-300 shadow-lg">
          기록 목록으로 돌아가기
        </button>
      </div>
    </Card>
  );
};

export default ComparisonScreen;