import React, { useEffect, useRef } from 'react';
import type { ResultItem } from '../types/index';
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

    // Ensure scale and pointLabels are available
    if (!rScale?.pointLabels) return;

    const { xCenter, yCenter, drawingArea: radius } = rScale;
    const pointCount = rScale.pointLabels.length;

    if (pointCount === 0) return;

    // Define severity zones with corresponding colors
    // These represent Normal, Mild, Moderate, and Severe ranges
    const zones = [
      { threshold: 100, color: 'rgba(239, 68, 68, 0.15)' },   // Severe (75-100%)
      { threshold: 75, color: 'rgba(249, 115, 22, 0.15)' },  // Moderate (50-75%)
      { threshold: 50, color: 'rgba(245, 158, 11, 0.15)' }, // Mild (25-50%)
      { threshold: 25, color: 'rgba(34, 197, 94, 0.15)' },  // Normal (0-25%)
    ];

    const startAngle = -Math.PI / 2; // Start from the top

    ctx.save();
    // Draw zones from the largest (outermost) to the smallest (innermost)
    zones.forEach(zone => {
      const zoneRadius = (zone.threshold / 100) * radius;
      
      ctx.beginPath();
      // Move to the first point on the polygon
      ctx.moveTo(xCenter + zoneRadius * Math.cos(startAngle), yCenter + zoneRadius * Math.sin(startAngle));
      
      // Draw lines to the other points of the polygon
      for (let i = 1; i < pointCount; i++) {
        const currentAngle = startAngle + i * (2 * Math.PI / pointCount);
        ctx.lineTo(xCenter + zoneRadius * Math.cos(currentAngle), yCenter + zoneRadius * Math.sin(currentAngle));
      }
      
      ctx.closePath(); // Close the shape
      ctx.fillStyle = zone.color;
      ctx.fill();
    });
    ctx.restore();
  }
};

// Register Chart.js components and our custom plugin
// The guard ensures the plugin is not registered multiple times.
if (!Chart.registry.plugins.get('radarZonePlugin')) {
  Chart.register(...registerables, radarZonePlugin);
} else {
  // If plugin is already there, just register the basic components
  Chart.register(...registerables);
}

interface ResultsChartProps {
  results: ResultItem[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ results }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy the previous chart instance before creating a new one
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const labels = results.map(r => r.title);
        const data = results.map(r => (r.score / r.maxScore) * 100);
        
        const getPointColor = (level: string): string => {
          if (level.includes('중증')) return 'rgba(220, 38, 38, 1)';
          if (level === '중등도') return 'rgba(249, 115, 22, 1)';
          if (level === '경도') return 'rgba(245, 158, 11, 1)';
          return 'rgba(34, 197, 94, 1)'; // '정상'
        };

        const pointColors = results.map(r => getPointColor(r.interpretation.level));
        
        // Determine overall chart color based on the most severe level
        const getSeverityRank = (level: string): number => {
            if (level.includes('중증')) return 3;
            if (level === '중등도') return 2;
            if (level === '경도') return 1;
            return 0; // '정상'
        };

        const maxSeverityRank = Math.max(...results.map(r => getSeverityRank(r.interpretation.level)));
        
        const getLevelFromRank = (rank: number): string => {
            if (rank === 3) return '중증';
            if (rank === 2) return '중등도';
            if (rank === 1) return '경도';
            return '정상';
        }
        
        const mostSevereLevel = getLevelFromRank(maxSeverityRank);
        const mainBorderColor = getPointColor(mostSevereLevel);
        const mainBackgroundColor = mainBorderColor.replace('1)', '0.25)'); // Slightly more opaque background

        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels,
            datasets: [{
              label: '상태 점수 (백분율)',
              data,
              backgroundColor: mainBackgroundColor,
              borderColor: mainBorderColor,
              borderWidth: 2.5, // Thicker line
              pointBackgroundColor: pointColors,
              pointBorderColor: '#fff',
              pointBorderWidth: 1.5,
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: pointColors,
              pointRadius: 5, // Larger points
              pointHoverRadius: 8, // Larger points on hover
            }]
          },
          options: {
            scales: {
              r: {
                beginAtZero: true,
                max: 100,
                angleLines: {
                  color: 'rgba(0, 0, 0, 0.2)' // Made slightly darker for visibility
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.2)' // Made slightly darker for visibility
                },
                pointLabels: {
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  color: '#334155' // slate-700
                },
                ticks: {
                  backdropColor: 'rgba(255, 255, 255, 0.75)',
                  stepSize: 25,
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    if (context.parsed.r !== null) {
                      label += context.parsed.r.toFixed(2) + '%';
                    }
                    return label;
                  }
                }
              }
            }
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [results]);

  return <canvas ref={chartRef} />;
};

export default ResultsChart;