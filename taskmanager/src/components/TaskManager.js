import React, { useState } from 'react';
import { generateTasks } from '../utils/geminiService';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Paper,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon
} from '@mui/icons-material';

const TaskManager = () => {
  const [projectDetails, setProjectDetails] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    objectives: [],
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTeamMember = () => {
    setTeamMembers(prev => [...prev, {
      name: '',
      email: '',
      role: '',
      expertise: [],
      currentWorkload: 0
    }]);
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const handleTeamMemberChange = (index, field, value) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'expertise' ? value.split(',').map(s => s.trim()) : value
      };
      return updated;
    });
  };

  const handleGenerateTasks = async () => {
    try {
      // Validate project details
      if (!projectDetails.title || !projectDetails.description || !projectDetails.startDate || !projectDetails.endDate) {
        setError('Please fill in all project details (title, description, start date, end date)');
        return;
      }

      // Validate team members
      if (teamMembers.length === 0) {
        setError('Please add at least one team member');
        return;
      }

      // Validate team member details
      const invalidMember = teamMembers.find(member => !member.name || !member.email || !member.role);
      if (invalidMember) {
        setError('Please fill in all required team member details (name, email, role)');
        return;
      }

      setError('');
      setLoading(true);

      console.log('Generating tasks with:', {
        projectDetails,
        teamMembers
      });

      const generatedTasks = await generateTasks(projectDetails, teamMembers);
      
      console.log('Generated tasks:', generatedTasks);
      
      if (!generatedTasks || !generatedTasks.tasks) {
        setError('Failed to generate valid tasks. Please try again.');
        return;
      }

      setTasks(generatedTasks.tasks);
    } catch (error) {
      console.error('Error in handleGenerateTasks:', error);
      setError(error.message || 'Failed to generate tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskProgressUpdate = (taskId, progress) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, progress } : t
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        <AssignmentIcon sx={{ mr: 2, fontSize: 40 }} />
        AI Task Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Project Details Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Project Details
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Project Title"
                name="title"
                value={projectDetails.title}
                onChange={handleProjectDetailsChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={projectDetails.description}
                onChange={handleProjectDetailsChange}
                multiline
                rows={4}
                variant="outlined"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    name="startDate"
                    value={projectDetails.startDate}
                    onChange={handleProjectDetailsChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    name="endDate"
                    value={projectDetails.endDate}
                    onChange={handleProjectDetailsChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        {/* Team Members Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">
                Team Members
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTeamMember}
              >
                Add Member
              </Button>
            </Box>
            <Stack spacing={3}>
              {teamMembers.map((member, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Name"
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={member.email}
                          onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Role"
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Expertise"
                          value={member.expertise.join(', ')}
                          onChange={(e) => handleTeamMemberChange(index, 'expertise', e.target.value)}
                          helperText="Comma-separated values"
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveTeamMember(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Generate Tasks Button */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateTasks}
              disabled={loading}
              sx={{ px: 4, py: 1.5 }}
            >
              {loading ? 'Generating Tasks...' : 'Generate Tasks'}
            </Button>
          </Box>
        </Grid>

        {/* Tasks List */}
        {tasks.length > 0 && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Generated Tasks
              </Typography>
              <Grid container spacing={3}>
                {tasks.map(task => (
                  <Grid item xs={12} md={6} key={task.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {task.title}
                        </Typography>
                        <Typography color="textSecondary" paragraph>
                          {task.description}
                        </Typography>
                        <Stack spacing={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon color="action" />
                            <Typography variant="body2">
                              {task.assignedTo}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <ScheduleIcon color="action" />
                            <Typography variant="body2">
                              Due: {task.deadline}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <PriorityIcon color="action" />
                            <Chip
                              label={task.priority}
                              color={getPriorityColor(task.priority)}
                              size="small"
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              Progress: {task.progress || 0}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={task.progress || 0}
                              sx={{ height: 8, borderRadius: 2 }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              Required Skills:
                            </Typography>
                            <Box display="flex" gap={1} flexWrap="wrap">
                              {task.requiredSkills.map((skill, index) => (
                                <Chip
                                  key={index}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default TaskManager;
