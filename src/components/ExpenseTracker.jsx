import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';

const ExpenseTracker = ({ budget, onExpenseUpdate }) => {
  const [expenses, setExpenses] = useState({
    foodExpense: '',
    decorationExpense: '',
    equipmentExpense: '',
    marketingExpense: '',
    securityExpense: '',
    miscExpense: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenses(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onExpenseUpdate(expenses);
  };

  const calculateVariance = (budgeted, actual) => {
    const variance = budgeted - actual;
    return {
      amount: Math.abs(variance),
      type: variance >= 0 ? 'Under Budget' : 'Over Budget',
      color: variance >= 0 ? 'success.main' : 'error.main'
    };
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Track Actual Expenses
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Budgeted Amount (₹)</TableCell>
                    <TableCell align="right">Actual Expense (₹)</TableCell>
                    <TableCell align="right">Variance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { label: 'Food', budget: 'foodBudget', expense: 'foodExpense' },
                    { label: 'Decoration', budget: 'decorationBudget', expense: 'decorationExpense' },
                    { label: 'Equipment', budget: 'equipmentBudget', expense: 'equipmentExpense' },
                    { label: 'Marketing', budget: 'marketingBudget', expense: 'marketingExpense' },
                    { label: 'Security', budget: 'securityBudget', expense: 'securityExpense' },
                    { label: 'Miscellaneous', budget: 'miscBudget', expense: 'miscExpense' }
                  ].map((item) => {
                    const variance = calculateVariance(
                      budget[item.budget] || 0,
                      Number(expenses[item.expense]) || 0
                    );
                    
                    return (
                      <TableRow key={item.label}>
                        <TableCell>{item.label}</TableCell>
                        <TableCell align="right">
                          {(budget[item.budget] || 0).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            type="number"
                            name={item.expense}
                            value={expenses[item.expense]}
                            onChange={handleChange}
                            size="small"
                            sx={{ width: 120 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography color={variance.color}>
                            {variance.amount.toLocaleString()} ({variance.type})
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Update Expenses
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ExpenseTracker;
