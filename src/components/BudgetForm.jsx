import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography, MenuItem } from '@mui/material';

const BudgetForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    expectedAttendees: '',
    venue: '',
    date: '',
    duration: '',
    foodBudget: '',
    decorationBudget: '',
    equipmentBudget: '',
    marketingBudget: '',
    securityBudget: '',
    miscBudget: '',
    sponsorshipTarget: ''
  });

  const eventTypes = [
    'Technical Conference',
    'Cultural Festival',
    'Workshop',
    'Sports Event',
    'Academic Seminar',
    'Career Fair',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Event Budget Details
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Event Name"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Event Type"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
            >
              {eventTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Expected Attendees"
              name="expectedAttendees"
              value={formData.expectedAttendees}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Venue"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Event Date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Duration (hours)"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Budget Breakdown
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Food Budget (₹)"
              name="foodBudget"
              value={formData.foodBudget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Decoration Budget (₹)"
              name="decorationBudget"
              value={formData.decorationBudget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Equipment Budget (₹)"
              name="equipmentBudget"
              value={formData.equipmentBudget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Marketing Budget (₹)"
              name="marketingBudget"
              value={formData.marketingBudget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="number"
              label="Security Budget (₹)"
              name="securityBudget"
              value={formData.securityBudget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Miscellaneous Budget (₹)"
              name="miscBudget"
              value={formData.miscBudget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              type="number"
              label="Sponsorship Target (₹)"
              name="sponsorshipTarget"
              value={formData.sponsorshipTarget}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Generate Budget Plan
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BudgetForm;
