import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Card,
  CardContent,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Help as HelpIcon } from '@mui/icons-material';
import { addTransaction } from '../store/slices/financeSlice';
import { Timestamp } from 'firebase/firestore';

const categories = [
  'venue',
  'catering',
  'marketing',
  'equipment',
  'sponsorship',
  'registration',
  'merchandise',
  'other'
];

const categoryTips = {
  venue: 'Includes rental fees, setup costs, and facility charges',
  catering: 'Food and beverage services, including staff costs',
  marketing: 'Advertising, promotional materials, and social media campaigns',
  equipment: 'Technical equipment, furniture rentals, and AV systems',
  sponsorship: 'Income from event sponsors and partners',
  registration: 'Ticket sales and participant registration fees',
  merchandise: 'Event-branded items and merchandise sales',
  other: 'Miscellaneous expenses not fitting other categories'
};

const AddTransactionForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const transaction = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: Timestamp.fromDate(new Date(formData.date))
      };
      await dispatch(addTransaction(transaction)).unwrap();
      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add New Transaction
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                helperText="Enter a clear, specific description of the transaction"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                helperText="Enter the amount in dollars"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                  required
                >
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    required
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category} sx={{ textTransform: 'capitalize' }}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {formData.category && (
                  <Tooltip title={categoryTips[formData.category]} placement="right">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Add Transaction
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
