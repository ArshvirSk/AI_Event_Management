import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
  AccountBalance as BalanceIcon,
  PieChart as CategoryIcon,
} from '@mui/icons-material';
import { fetchFinances } from '../store/slices/financeSlice';
import AddTransactionForm from '../components/AddTransactionForm';
import FinancialInsights from '../components/FinancialInsights';

const SummaryCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">
            ${value.toLocaleString()}
          </Typography>
        </Box>
        {React.createElement(icon, { sx: { fontSize: 40, color } })}
      </Box>
    </CardContent>
  </Card>
);

const CategoryBreakdown = ({ categoryTotals }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <CategoryIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Category Breakdown</Typography>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Income</TableCell>
              <TableCell align="right">Expenses</TableCell>
              <TableCell align="right">Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(categoryTotals).map(([category, { income, expense }]) => (
              <TableRow key={category}>
                <TableCell>
                  <Chip 
                    label={category} 
                    size="small" 
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ color: 'success.main' }}>
                  ${income.toLocaleString()}
                </TableCell>
                <TableCell align="right" sx={{ color: 'error.main' }}>
                  ${expense.toLocaleString()}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: income - expense >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }}
                >
                  ${(income - expense).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

const FinanceTracker = () => {
  const dispatch = useDispatch();
  const { transactions, summary, loading, error } = useSelector((state) => state.finances);

  useEffect(() => {
    dispatch(fetchFinances());
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  const summaryCards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: IncomeIcon,
      color: '#4caf50'
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: ExpenseIcon,
      color: '#f44336'
    },
    {
      title: 'Balance',
      value: summary.balance,
      icon: BalanceIcon,
      color: '#2196f3'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Finance Tracker
      </Typography>

      <Grid container spacing={3}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} md={4} key={index}>
            <SummaryCard {...card} />
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <Chip 
                            label={transaction.category} 
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'income' ? 'success' : 'error'}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <AddTransactionForm />
        </Grid>

        <Grid item xs={12}>
          <FinancialInsights 
            transactions={transactions}
            summary={summary}
          />
        </Grid>

        <Grid item xs={12}>
          <CategoryBreakdown categoryTotals={summary.categoryTotals} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceTracker;
