import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
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

const EventRegistrationChart = ({ registrationData }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Process registration data
  const dates = registrationData.map(item => 
    new Date(item.registrationDate).toLocaleDateString()
  );
  
  const cumulativeRegistrations = registrationData.reduce((acc, curr, index) => {
    const prevCount = index > 0 ? acc[index - 1] : 0;
    acc.push(prevCount + 1);
    return acc;
  }, []);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Total Registrations',
        data: cumulativeRegistrations,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default EventRegistrationChart;
