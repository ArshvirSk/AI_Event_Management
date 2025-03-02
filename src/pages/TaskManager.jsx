import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Checkbox,
  IconButton,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as AIIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { autoAllocateTasksWithAI } from "../config/taskAllocation";

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
  const [tasks, setTasks] = useState([
    {
      id: "task1",
      title: "Venue Selection and Booking",
      description: "Research and book an appropriate venue for the event. Consider capacity, location, and amenities.",
      assignedTo: "",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "high",
      category: "logistics"
    },
    {
      id: "task2",
      title: "Budget Planning",
      description: "Create detailed budget breakdown including venue, catering, marketing, and miscellaneous costs.",
      assignedTo: "",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "high",
      category: "finance"
    },
    {
      id: "task3",
      title: "Marketing Strategy",
      description: "Develop comprehensive marketing plan including social media, email campaigns, and promotional materials.",
      assignedTo: "",
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "medium",
      category: "marketing"
    },
    {
      id: "task4",
      title: "Speaker/Performer Outreach",
      description: "Contact and confirm speakers or performers. Collect their requirements and presentation materials.",
      assignedTo: "",
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "medium",
      category: "programming"
    },
    {
      id: "task5",
      title: "Catering Arrangements",
      description: "Select menu options, get quotes from caterers, and plan meal schedules.",
      assignedTo: "",
      deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "medium",
      category: "logistics"
    },
    {
      id: "task6",
      title: "Technical Setup Planning",
      description: "Plan AV equipment, lighting, and technical requirements. Coordinate with venue and vendors.",
      assignedTo: "",
      deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "high",
      category: "technical"
    },
    {
      id: "task7",
      title: "Registration System Setup",
      description: "Set up online registration platform, configure payment processing, and create registration forms.",
      assignedTo: "",
      deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "high",
      category: "technical"
    },
    {
      id: "task8",
      title: "Sponsorship Coordination",
      description: "Identify potential sponsors, prepare sponsorship packages, and manage sponsor relationships.",
      assignedTo: "",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "medium",
      category: "finance"
    },
    {
      id: "task9",
      title: "Event Schedule Creation",
      description: "Create detailed event timeline including setup, activities, breaks, and teardown.",
      assignedTo: "",
      deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "medium",
      category: "programming"
    },
    {
      id: "task10",
      title: "Safety and Security Planning",
      description: "Develop emergency procedures, coordinate with security personnel, and ensure venue safety compliance.",
      assignedTo: "",
      deadline: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: "pending",
      priority: "high",
      category: "logistics"
    }
  ]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [committeeMembers, setCommitteeMembers] = useState([
    { id: 1, name: "John Doe", role: "Technical Lead", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "Marketing Manager", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", role: "Logistics Coordinator", email: "mike@example.com" }
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    name: '',
    date: '',
    description: '',
    budget: '',
    venue: '',
    expectedAttendees: '',
  });
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    experience: '',
  });
  const [isAssigningTasks, setIsAssigningTasks] = useState(false);
  const [isAutoAllocating, setIsAutoAllocating] = useState(false);
  const [createTaskDialogOpen, setCreateTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'logistics',
    priority: 'medium',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTo: ''
  });

  const taskCategories = ['logistics', 'finance', 'marketing', 'programming', 'technical'];
  const priorityLevels = ['low', 'medium', 'high'];

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setAssignmentDialogOpen(true);
  };

  const handleAssignTask = () => {
    if (!selectedMember) return;

    setTasks(tasks.map(task => 
      task.id === selectedTask.id 
        ? { ...task, assignedTo: selectedMember, status: 'in-progress' }
        : task
    ));

    setAssignmentDialogOpen(false);
    setSelectedTask(null);
    setSelectedMember('');
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.email) {
      setCommitteeMembers([...committeeMembers, { ...newMember, id: Date.now() }]);
      setNewMember({ name: '', role: '', email: '', experience: '' });
    }
  };

  const handleRemoveMember = (id) => {
    setCommitteeMembers(committeeMembers.filter(member => member.id !== id));
  };

  const handleStatusChange = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const generateAITasks = () => {
    if (!eventDetails.name || committeeMembers.length === 0) {
      alert('Please fill in event details and add committee members');
      return;
    }

    setIsAssigningTasks(true);
    try {
      // Generate tasks based on roles
      const newTasks = committeeMembers.map((member) => {
        const baseTask = {
          id: Date.now() + Math.random(),
          assignedTo: member.name,
          assignedToEmail: member.email,
          committee: member.role,
          eventId: eventDetails.name.toLowerCase().replace(/\s+/g, '-'),
          status: 'pending',
          completed: false,
          deadline: new Date(eventDetails.date)
        };

        // Generate tasks based on role
        switch (member.role.toLowerCase()) {
          case 'logistics':
            return {
              ...baseTask,
              title: 'Venue Setup Planning',
              description: `Create detailed venue setup plan for ${eventDetails.venue}`,
              priority: 'high'
            };
          case 'marketing':
            return {
              ...baseTask,
              title: 'Social Media Campaign',
              description: 'Design and execute social media marketing campaign',
              priority: 'high'
            };
          case 'technical':
            return {
              ...baseTask,
              title: 'Technical Requirements',
              description: 'Setup and manage technical equipment and requirements',
              priority: 'high'
            };
          case 'finance':
            return {
              ...baseTask,
              title: 'Budget Management',
              description: `Manage event budget of ${eventDetails.budget}`,
              priority: 'high'
            };
          case 'content':
            return {
              ...baseTask,
              title: 'Content Creation',
              description: 'Create and manage event content and materials',
              priority: 'medium'
            };
          case 'sponsorship':
            return {
              ...baseTask,
              title: 'Sponsor Outreach',
              description: 'Contact and manage potential sponsors',
              priority: 'high'
            };
          default:
            return {
              ...baseTask,
              title: `${member.role} Planning`,
              description: `Plan and execute ${member.role} responsibilities for ${eventDetails.name}`,
              priority: 'medium'
            };
        }
      });

      setTasks([...tasks, ...newTasks]);
      setOpenDialog(false);
      setEventDetails({
        name: '',
        date: '',
        description: '',
        budget: '',
        venue: '',
        expectedAttendees: '',
      });
      setCommitteeMembers([]);
    } catch (error) {
      console.error('Error generating tasks:', error);
      alert('Error generating tasks. Please try again.');
    } finally {
      setIsAssigningTasks(false);
    }
  };

  const handleAutoAllocate = async () => {
    if (tasks.filter(task => !task.assignedTo).length === 0) {
      alert("No tasks available for allocation!");
      return;
    }
    if (committeeMembers.length === 0) {
      alert("No committee members available!");
      return;
    }

    setIsAutoAllocating(true);
    try {
      const allocations = await autoAllocateTasksWithAI(tasks, committeeMembers);
      
      if (allocations.length > 0) {
        setTasks(tasks.map(task => {
          const allocation = allocations.find(a => a.taskId === task.id);
          if (allocation) {
            return {
              ...task,
              assignedTo: allocation.assignedTo,
              status: 'in-progress'
            };
          }
          return task;
        }));
      }
    } catch (error) {
      console.error("Error in auto allocation:", error);
      alert("Failed to auto-allocate tasks. Please try again.");
    } finally {
      setIsAutoAllocating(false);
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      alert("Please fill in all required fields");
      return;
    }

    const task = {
      id: `task${Date.now()}`,
      ...newTask,
      status: newTask.assignedTo ? 'in-progress' : 'pending'
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      category: 'logistics',
      priority: 'medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: ''
    });
    setCreateTaskDialogOpen(false);
  };

  // Filter tasks based on assignment status
  const unassignedTasks = tasks.filter(task => !task.assignedTo);
  const assignedTasks = tasks.filter(task => task.assignedTo);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Task Manager</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateTaskDialogOpen(true)}
        >
          Create Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Unassigned Tasks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Available Tasks
                </Typography>
                <Button
                  variant="contained"
                  startIcon={isAutoAllocating ? <CircularProgress size={20} color="inherit" /> : <AIIcon />}
                  onClick={handleAutoAllocate}
                  disabled={isAutoAllocating || unassignedTasks.length === 0}
                  sx={{ 
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                >
                  {isAutoAllocating ? "Allocating..." : "Auto Allocate"}
                </Button>
              </Box>
              <Box sx={{ mt: 2 }}>
                {unassignedTasks.map((task) => (
                  <Card
                    key={task.id}
                    sx={{
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        borderColor: 'primary.main',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {task.title}
                        </Typography>
                        <Chip
                          label={task.priority}
                          size="small"
                          color={task.priority === 'high' ? 'error' : 'default'}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {task.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={task.category}
                          size="small"
                          sx={{ backgroundColor: '#e0e0e0' }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                {unassignedTasks.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    No available tasks
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Assigned Tasks */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assigned Tasks
              </Typography>
              <Box sx={{ mt: 2 }}>
                {assignedTasks.map((task) => (
                  <Card
                    key={task.id}
                    sx={{
                      mb: 2,
                      border: '1px solid #e0e0e0',
                      backgroundColor: task.status === 'completed' ? '#f5f5f5' : 'white',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          }}
                        >
                          {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={task.priority}
                            size="small"
                            color={task.priority === 'high' ? 'error' : 'default'}
                          />
                          <Chip
                            label={task.status}
                            size="small"
                            color={task.status === 'completed' ? 'success' : 'default'}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {task.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2">
                          Assigned to: {task.assignedTo}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={task.category}
                          size="small"
                          sx={{ backgroundColor: '#e0e0e0' }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                          <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                {assignedTasks.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    No assigned tasks
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Task Assignment Dialog */}
      <Dialog 
        open={assignmentDialogOpen} 
        onClose={() => {
          setAssignmentDialogOpen(false);
          setSelectedTask(null);
          setSelectedMember('');
        }}
      >
        <DialogTitle>
          Assign Task
        </DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {selectedTask.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedTask.description}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Assign to Committee Member</InputLabel>
                <Select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  label="Assign to Committee Member"
                >
                  {committeeMembers.map((member) => (
                    <MenuItem key={member.id} value={member.name}>
                      <Box>
                        <Typography variant="body1">
                          {member.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {member.role}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setAssignmentDialogOpen(false);
              setSelectedTask(null);
              setSelectedMember('');
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAssignTask}
            disabled={!selectedMember}
          >
            Assign Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Task Dialog */}
      <Dialog 
        open={createTaskDialogOpen} 
        onClose={() => setCreateTaskDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Task Title"
              required
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            
            <TextField
              label="Description"
              required
              fullWidth
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newTask.category}
                label="Category"
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              >
                {taskCategories.map((category) => (
                  <MenuItem key={category} value={category} sx={{ textTransform: 'capitalize' }}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                {priorityLevels.map((level) => (
                  <MenuItem key={level} value={level} sx={{ textTransform: 'capitalize' }}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Deadline"
              type="date"
              fullWidth
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Assign To (Optional)</InputLabel>
              <Select
                value={newTask.assignedTo}
                label="Assign To (Optional)"
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              >
                <MenuItem value="">
                  <em>Unassigned</em>
                </MenuItem>
                {committeeMembers.map((member) => (
                  <MenuItem key={member.id} value={member.name}>
                    <Box>
                      <Typography variant="body1">
                        {member.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.role}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateTaskDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateTask}
            disabled={!newTask.title || !newTask.description}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Creation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Event & Assign Tasks</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Event Details Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Event Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Event Name"
                    value={eventDetails.name}
                    onChange={(e) => setEventDetails({ ...eventDetails, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Event Date"
                    InputLabelProps={{ shrink: true }}
                    value={eventDetails.date}
                    onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Event Description"
                    value={eventDetails.description}
                    onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Venue"
                    value={eventDetails.venue}
                    onChange={(e) => setEventDetails({ ...eventDetails, venue: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Expected Attendees"
                    value={eventDetails.expectedAttendees}
                    onChange={(e) => setEventDetails({ ...eventDetails, expectedAttendees: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Budget"
                    value={eventDetails.budget}
                    onChange={(e) => setEventDetails({ ...eventDetails, budget: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Committee Members Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Committee Members</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Experience (years)"
                    type="number"
                    value={newMember.experience}
                    onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddMember}
                  >
                    Add Member
                  </Button>
                </Grid>
              </Grid>

              <List>
                {committeeMembers.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText
                      primary={member.name}
                      secondary={`${member.role} | ${member.email} | ${member.experience} years`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => handleRemoveMember(member.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={generateAITasks}
            disabled={isAssigningTasks || !eventDetails.name || committeeMembers.length === 0}
          >
            {isAssigningTasks ? 'Generating Tasks...' : 'Generate Tasks'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManager;
