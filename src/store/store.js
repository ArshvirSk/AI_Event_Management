import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import taskReducer from './slices/taskSlice';
import financeReducer from './slices/financeSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    tasks: taskReducer,
    finances: financeReducer,
  },
});
