import React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarchartProps {
    data: { label: string; value: number }[];
  }

  export default function Barchart({ data }: BarchartProps) {
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Jumlah (IDR)',
        data: data.map((item) => item.value),
        backgroundColor: [
          'rgba(39, 150, 95, 0.7)',   // emerald green
          'rgba(212, 168, 23, 0.7)',  // gold
          'rgba(230, 192, 64, 0.7)', // lighter gold
        ],
        borderColor: [
          'rgba(39, 150, 95, 1)',
          'rgba(212, 168, 23, 1)',
          'rgba(230, 192, 64, 1)',
        ],
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(183, 220, 196, 0.7)',
          font: {
            family: 'Plus Jakarta Sans',
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Total Pembelian, Penjualan, dan Selisih',
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 14,
          family: 'Plus Jakarta Sans',
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(183, 220, 196, 0.6)',
          font: { family: 'Plus Jakarta Sans' },
        },
        grid: {
          color: 'rgba(39, 150, 95, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(183, 220, 196, 0.6)',
          font: { family: 'Plus Jakarta Sans' },
        },
        grid: {
          color: 'rgba(39, 150, 95, 0.1)',
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
