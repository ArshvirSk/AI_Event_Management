import React from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const BudgetDisplay = ({ budget }) => {
  if (!budget) return null;

  const chartData = {
    labels: Object.keys(budget.breakdown),
    datasets: [
      {
        data: Object.values(budget.breakdown),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Generated Budget Breakdown
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Total Budget: ₹{budget.totalBudget.toLocaleString('en-IN')}
        </Typography>
      </Box>

      <Box sx={{ height: 300, mb: 3 }}>
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      </Box>

      <List>
        {Object.entries(budget.breakdown).map(([category, amount], index) => (
          <React.Fragment key={category}>
            <ListItem>
              <ListItemText
                primary={category}
                secondary={`₹${amount.toLocaleString('en-IN')}`}
              />
            </ListItem>
            {index < Object.entries(budget.breakdown).length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {budget.recommendations && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>
          <List>
            {budget.recommendations.map((rec, index) => (
              <ListItem key={index}>
                <ListItemText primary={rec} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default BudgetDisplay;
