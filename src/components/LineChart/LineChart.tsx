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
    }[];
  };
  title?: string;
}

export default function LineChart({ data, title }: LineChartProps) {
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
        labels: {
          color: 'rgba(75, 85, 99, 0.8)',
          font: {
            family: 'Plus Jakarta Sans',
            weight: 'bold',
          },
        },
      },
      title: {
        display: !!title,
        text: title || '',
        color: 'rgba(17, 24, 39, 0.9)',
        font: {
          size: 16,
          family: 'Plus Jakarta Sans',
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(75, 85, 99, 0.7)',
          font: { family: 'Plus Jakarta Sans' },
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(75, 85, 99, 0.7)',
          font: { family: 'Plus Jakarta Sans' },
          callback: function(value) {
            return new Intl.NumberFormat('id-ID', { notation: "compact", compactDisplay: "short" }).format(value as number);
          }
        },
        grid: {
          color: 'rgba(229, 231, 235, 0.8)',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
}
