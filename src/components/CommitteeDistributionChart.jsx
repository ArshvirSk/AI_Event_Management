import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CommitteeDistributionChart = ({ tasks }) => {
  // Process tasks data to get committee distribution
  const committeeCount = tasks.reduce((acc, task) => {
    acc[task.committee] = (acc[task.committee] || 0) + 1;
    return acc;
  }, {});

  const committees = Object.keys(committeeCount);
  const counts = Object.values(committeeCount);

  // Color palette for committees
  const colors = [
    '#1976d2', // Blue
    '#2e7d32', // Green
    '#ed6c02', // Orange
    '#9c27b0', // Purple
    '#d32f2f', // Red
    '#0288d1', // Light Blue
    '#388e3c', // Light Green
    '#f57c00', // Dark Orange
  ];

  const data = {
    labels: committees.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [
      {
        data: counts,
        backgroundColor: colors.slice(0, committees.length),
        borderColor: colors.slice(0, committees.length).map(color => color + '88'),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    cutout: '60%',
  };

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          {tasks.length}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          Total Tasks
        </div>
      </div>
    </div>
  );
};

export default CommitteeDistributionChart;
