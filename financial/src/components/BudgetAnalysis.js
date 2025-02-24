import React from 'react';
import { 
  Paper, 
  Typography,
  Box
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const BudgetAnalysis = ({ budget, expenses }) => {
  const categories = [
    { key: 'food', label: 'Food' },
    { key: 'decoration', label: 'Decoration' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'security', label: 'Security' },
    { key: 'misc', label: 'Miscellaneous' }
  ];

  const analysisData = categories.map(category => ({
    name: category.label,
    Budgeted: budget[`${category.key}Budget`] || 0,
    Actual: expenses[`${category.key}Expense`] || 0,
    Variance: (budget[`${category.key}Budget`] || 0) - (expenses[`${category.key}Expense`] || 0)
  }));

  const totalBudgeted = categories.reduce((sum, category) => 
    sum + (budget[`${category.key}Budget`] || 0), 0
  );

  const totalActual = categories.reduce((sum, category) => 
    sum + (expenses[`${category.key}Expense`] || 0), 0
  );

  const totalVariance = totalBudgeted - totalActual;
  const variancePercentage = ((totalVariance / totalBudgeted) * 100).toFixed(2);
  const varianceType = totalVariance >= 0 ? 'Under Budget' : 'Over Budget';
  const varianceColor = totalVariance >= 0 ? 'success.main' : 'error.main';

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Budget Analysis
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Overall Summary
        </Typography>
        <Typography variant="body1">
          Total Budgeted: ₹{totalBudgeted.toLocaleString()}
        </Typography>
        <Typography variant="body1">
          Total Actual Expense: ₹{totalActual.toLocaleString()}
        </Typography>
        <Typography variant="body1" color={varianceColor}>
          Total Variance: ₹{Math.abs(totalVariance).toLocaleString()} ({varianceType})
        </Typography>
        <Typography variant="body1" color={varianceColor}>
          Variance Percentage: {Math.abs(variancePercentage)}%
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom>
        Category-wise Comparison
      </Typography>
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analysisData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Budgeted" fill="#8884d8" />
            <Bar dataKey="Actual" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Key Insights
      </Typography>
      {analysisData.map((item) => {
        const variance = item.Variance;
        const varPercent = ((variance / item.Budgeted) * 100).toFixed(2);
        const varType = variance >= 0 ? 'under' : 'over';
        return (
          <Typography 
            key={item.name} 
            variant="body2" 
            color={variance >= 0 ? 'success.main' : 'error.main'}
            sx={{ mb: 1 }}
          >
            {item.name}: {Math.abs(varPercent)}% {varType} budget 
            (₹{Math.abs(variance).toLocaleString()})
          </Typography>
        );
      })}
    </Paper>
  );
};

export default BudgetAnalysis;
