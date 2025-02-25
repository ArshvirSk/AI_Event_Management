import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async () => {
    const q = query(collection(db, 'tasks'), orderBy('deadline'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deadline: doc.data().deadline.toDate().toISOString(),
    }));
  }
);

// Async thunk for updating task status
export const updateTaskStatus = createAsyncThunk(
  'tasks/updateStatus',
  async ({ taskId, completed }) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, { completed });
    return { taskId, completed };
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const task = state.tasks.find(t => t.id === action.payload.taskId);
        if (task) {
          task.completed = action.payload.completed;
        }
      });
  },
});

export default taskSlice.reducer;
