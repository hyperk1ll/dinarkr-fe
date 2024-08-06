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
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Pembelian, Penjualan, dan Selisih',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
