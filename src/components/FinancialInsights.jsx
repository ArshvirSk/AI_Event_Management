import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Warning,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from '@mui/icons-material';

const ActionDialog = ({ open, onClose, actions }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Recommended Actions</DialogTitle>
    <DialogContent>
      <List>
        {actions.map((action, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <CheckCircle color="primary" />
            </ListItemIcon>
            <ListItemText primary={action} />
          </ListItem>
        ))}
      </List>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

const FinancialInsights = ({ transactions, summary }) => {
  const [expandedInsight, setExpandedInsight] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState([]);

  const generateInsights = () => {
    const insights = [];

    // Calculate month-over-month growth
    const monthlyTotals = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      acc[month][t.type] += t.amount;
      return acc;
    }, {});

    const months = Object.keys(monthlyTotals).sort();
    if (months.length >= 2) {
      const lastMonth = monthlyTotals[months[months.length - 1]];
      const prevMonth = monthlyTotals[months[months.length - 2]];
      
      const expenseGrowth = ((lastMonth.expense - prevMonth.expense) / prevMonth.expense) * 100;
      if (expenseGrowth > 20) {
        insights.push({
          type: 'warning',
          text: `Expenses increased by ${expenseGrowth.toFixed(1)}% compared to last month.`,
          icon: <Warning color="warning" />,
          actions: [
            'Review all expenses over $1,000 from the last month',
            'Identify and eliminate any duplicate services or subscriptions',
            'Negotiate with vendors for better rates',
            'Consider bulk purchasing for frequently used items',
            'Implement a pre-approval process for expenses over a certain threshold'
          ]
        });
      }
    }

    // Analyze category spending
    const categoryExpenses = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    const totalExpenses = Object.values(categoryExpenses).reduce((a, b) => a + b, 0);
    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      const percentage = (amount / totalExpenses) * 100;
      if (percentage > 30) {
        insights.push({
          type: 'info',
          text: `${category.charAt(0).toUpperCase() + category.slice(1)} represents ${percentage.toFixed(1)}% of total expenses.`,
          icon: <TrendingUp color="info" />,
          actions: [
            `Research alternative ${category} providers and compare prices`,
            'Create a competitive bidding process for major expenses',
            'Consider package deals or annual contracts for better rates',
            'Analyze if some expenses can be shared with partner events',
            'Look for early-bird or bulk purchase discounts'
          ]
        });
      }
    });

    // Budget health check
    const budgetRatio = summary.totalExpenses / summary.totalIncome * 100;
    if (budgetRatio > 80) {
      insights.push({
        type: 'warning',
        text: `Expenses are ${budgetRatio.toFixed(1)}% of income.`,
        icon: <TrendingDown color="error" />,
        actions: [
          'Identify and cut non-essential expenses',
          'Look for additional sponsorship opportunities',
          'Consider early-bird ticket sales with special pricing',
          'Analyze the possibility of virtual or hybrid events to reduce costs',
          'Review and renegotiate existing contracts'
        ]
      });
    } else if (budgetRatio < 50) {
      insights.push({
        type: 'success',
        text: `Strong budget health with expenses at ${budgetRatio.toFixed(1)}% of income.`,
        icon: <TrendingUp color="success" />,
        actions: [
          'Consider upgrading event amenities or technology',
          'Invest in marketing to attract more participants',
          'Add value-added services for attendees',
          'Create an emergency fund for future events',
          'Consider offering scholarships or subsidized tickets'
        ]
      });
    }

    // Spending patterns
    const recentTransactions = transactions
      .filter(t => t.type === 'expense')
      .slice(0, 5);
    
    const averageRecentExpense = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;
    const allExpensesAverage = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / transactions.filter(t => t.type === 'expense').length;

    if (averageRecentExpense > allExpensesAverage * 1.3) {
      insights.push({
        type: 'info',
        text: 'Recent transactions show higher than average spending.',
        icon: <Lightbulb color="primary" />,
        actions: [
          'Create a detailed spending timeline for better planning',
          'Set up automated alerts for unusual spending patterns',
          'Implement a rolling budget review process',
          'Establish clear spending thresholds for different phases',
          'Document reasons for spending increases for future reference'
        ]
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const handleExpandClick = (index) => {
    setExpandedInsight(expandedInsight === index ? null : index);
  };

  const handleActionClick = (actions) => {
    setSelectedActions(actions);
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom display="flex" alignItems="center">
          <Lightbulb sx={{ mr: 1 }} color="primary" />
          AI Financial Insights
        </Typography>
        <List>
          {insights.map((insight, index) => (
            <React.Fragment key={index}>
              <ListItem 
                alignItems="flex-start"
                button
                onClick={() => handleExpandClick(index)}
              >
                <ListItemIcon>
                  {insight.icon}
                </ListItemIcon>
                <ListItemText
                  primary={insight.text}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        size="small"
                        label={insight.type}
                        color={
                          insight.type === 'warning' ? 'warning' :
                          insight.type === 'success' ? 'success' : 'primary'
                        }
                      />
                      {expandedInsight === index ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  }
                />
              </ListItem>
              <Collapse in={expandedInsight === index} timeout="auto" unmountOnExit>
                <Box sx={{ pl: 9, pr: 2, pb: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={() => handleActionClick(insight.actions)}
                  >
                    View Recommended Actions
                  </Button>
                </Box>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </CardContent>
      <ActionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        actions={selectedActions}
      />
    </Card>
  );
};

export default FinancialInsights;
