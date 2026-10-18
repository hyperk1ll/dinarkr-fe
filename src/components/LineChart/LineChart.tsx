import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill?: boolean;
      tension?: number;
      pointRadius?: number;
      pointHoverRadius?: number;
      borderWidth?: number;
    }[];
  };
  title?: string;
  isDark?: boolean;
}

export default function LineChart({ data, title, isDark = false }: LineChartProps) {
  const textColor = isDark ? 'rgba(209, 213, 219, 0.8)' : 'rgba(55, 65, 81, 0.8)';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(229, 231, 235, 0.7)';

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: textColor,
          boxWidth: 12,
          boxHeight: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 12,
            weight: 600,
          },
        },
      },
      title: {
        display: !!title,
        text: title || '',
        color: isDark ? '#ffffff' : '#111827',
        font: {
          size: 16,
          family: "'Plus Jakarta Sans', sans-serif",
          weight: 700,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#e2e8f0',
        bodyColor: '#f8fafc',
        borderColor: 'rgba(212, 168, 23, 0.4)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 10,
        titleFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          weight: 700,
          size: 13,
        },
        bodyFont: {
          family: "'Plus Jakarta Sans', sans-serif",
          weight: 600,
          size: 12,
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += 'Rp ' + Number(context.parsed.y).toLocaleString('id-ID');
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          maxTicksLimit: 8,
          font: { 
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        }
      },
      y: {
        position: 'right',
        ticks: {
          color: textColor,
          font: { 
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11
          },
          callback: function(value) {
            const num = value as number;
            if (num >= 1000000) {
              return (num / 1000000).toFixed(1).replace('.0', '') + ' jt';
            } else if (num >= 1000) {
              return (num / 1000).toFixed(0) + ' rb';
            }
            return num;
          }
        },
        grid: {
          color: gridColor,
        },
        border: {
          dash: [4, 4],
          display: false,
        }
      },
    },
  };

  return <Line data={data} options={options} />;
}
