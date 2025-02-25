import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { fetchTasks, updateTaskStatus } from '../store/slices/taskSlice';

const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return '#f44336';
    case 'medium':
      return '#ff9800';
    case 'low':
      return '#4caf50';
    default:
      return '#757575';
  }
};

const TaskManager = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleStatusChange = (taskId, completed) => {
    dispatch(updateTaskStatus({ taskId, completed }));
  };

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Task Manager
      </Typography>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} key={task.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TaskIcon sx={{ mr: 1 }} />
                      <Typography variant="h6" component="div">
                        {task.title}
                      </Typography>
                    </Box>
                    
                    <Typography color="textSecondary" gutterBottom>
                      {task.description}
                    </Typography>

                    <Box display="flex" alignItems="center" mt={2}>
                      <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2" sx={{ mr: 2 }}>
                        {task.assignedTo}
                      </Typography>
                      
                      <ScheduleIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        {new Date(task.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mt={2} gap={1}>
                      <Chip
                        label={task.committee}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        sx={{
                          backgroundColor: getPriorityColor(task.priority),
                          color: 'white',
                          textTransform: 'capitalize'
                        }}
                      />
                    </Box>
                  </Box>

                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleStatusChange(task.id, e.target.checked)}
                    color="primary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskManager;
