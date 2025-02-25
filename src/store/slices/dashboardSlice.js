import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Helper function to convert Firestore timestamps to ISO strings
const convertTimestamps = (doc) => {
  const data = doc.data();
  const converted = { ...data };
  // Convert any timestamp fields to ISO strings
  if (data.date && typeof data.date.toDate === 'function') {
    converted.date = data.date.toDate().toISOString();
  }
  if (data.registrationDate && typeof data.registrationDate.toDate === 'function') {
    converted.registrationDate = data.registrationDate.toDate().toISOString();
  }
  if (data.deadline && typeof data.deadline.toDate === 'function') {
    converted.deadline = data.deadline.toDate().toISOString();
  }
  return converted;
};

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    // Fetch all collections
    const [eventsSnap, participantsSnap, tasksSnap, budgetSnap] = await Promise.all([
      getDocs(collection(db, 'events')),
      getDocs(query(collection(db, 'participants'), orderBy('registrationDate'))),
      getDocs(collection(db, 'tasks')),
      getDocs(collection(db, 'budget')),
    ]);

    // Process events
    const events = eventsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Process participants
    const participants = participantsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      registrationDate: doc.data().registrationDate.toDate().toISOString(),
    }));

    // Process tasks
    const tasks = tasksSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Process budget
    const budget = budgetSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Calculate metrics
    const upcomingEvents = events.filter(event => 
      event.status === 'upcoming'
    ).length;

    const totalParticipants = participants.length;

    const activeTasks = tasks.filter(task => 
      !task.completed
    ).length;

    const budgetUtilized = budget
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      metrics: {
        upcomingEvents,
        totalParticipants,
        activeTasks,
        budgetUtilized,
      },
      chartData: {
        registrationData: participants,
        tasks,
      }
    };
  }
);

const initialState = {
  metrics: {
    totalParticipants: 0,
    upcomingEvents: 0,
    budgetUtilized: 0,
    activeTasks: 0,
  },
  chartData: {
    registrationData: [],
    tasks: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.chartData = action.payload.chartData;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dashboardSlice.reducer;
