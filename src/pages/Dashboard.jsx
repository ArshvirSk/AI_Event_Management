import {
  Assignment,
  AttachMoney,
  Event,
  People,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/slices/dashboardSlice';
import seedDatabase from '../utils/seedDatabase';
import SignIn from '../components/SignIn';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import EventRegistrationChart from '../components/EventRegistrationChart';
import CommitteeDistributionChart from '../components/CommitteeDistributionChart';

const DashboardCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%", backgroundColor: color }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" color="white" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" color="white">
            {value}
          </Typography>
        </Box>
        <IconButton sx={{ color: "white" }}>{icon}</IconButton>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { metrics, chartData, loading, error } = useSelector((state) => state.dashboard);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
      if (user) {
        dispatch(fetchDashboardData());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleSignIn = (user) => {
    setUser(user);
    dispatch(fetchDashboardData());
  };

  const handleSeedDatabase = async () => {
    try {
      await seedDatabase();
      dispatch(fetchDashboardData());
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  if (!authChecked) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <SignIn onSignIn={handleSignIn} />;
  }

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

  const dashboardMetrics = [
    {
      title: "Total Participants",
      value: metrics.totalParticipants.toString(),
      icon: <People />,
      color: "#1976d2",
    },
    {
      title: "Upcoming Events",
      value: metrics.upcomingEvents.toString(),
      icon: <Event />,
      color: "#2e7d32",
    },
    {
      title: "Budget Utilized",
      value: `$${metrics.budgetUtilized.toLocaleString()}`,
      icon: <AttachMoney />,
      color: "#ed6c02",
    },
    {
      title: "Active Tasks",
      value: metrics.activeTasks.toString(),
      icon: <Assignment />,
      color: "#9c27b0",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Event Dashboard
        </Typography>
        {user?.email === 'admin@aievento.com' && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSeedDatabase}
            sx={{ mb: 2 }}
          >
            Seed Database
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {dashboardMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...metric} />
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Registration Trends
              </Typography>
              <Box sx={{ height: 'calc(100% - 32px)' }}>
                <EventRegistrationChart registrationData={chartData.registrationData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: "400px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Committee Distribution
              </Typography>
              <Box sx={{ height: 'calc(100% - 32px)' }}>
                <CommitteeDistributionChart tasks={chartData.tasks} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
