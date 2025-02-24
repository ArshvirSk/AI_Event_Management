import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const RevenueChart = ({ data, selectedMonth, onMonthChange }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Revenue</h3>
        <select 
          className="month-selector"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sales"
            stackId="1"
            stroke="#ff9f7f"
            fill="#ff9f7f"
            fillOpacity={0.5}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stackId="2"
            stroke="#b088f9"
            fill="#b088f9"
            fillOpacity={0.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
