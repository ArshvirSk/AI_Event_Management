import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Async thunk for fetching finance data
export const fetchFinances = createAsyncThunk(
  'finances/fetchFinances',
  async () => {
    const q = query(collection(db, 'budget'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const transactions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate().toISOString(),
    }));

    // Calculate summary statistics
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0 };
      }
      acc[t.category][t.type] += t.amount;
      return acc;
    }, {});

    return {
      transactions,
      summary: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        categoryTotals
      }
    };
  }
);

// Async thunk for adding a new transaction
export const addTransaction = createAsyncThunk(
  'finances/addTransaction',
  async (transaction) => {
    const docRef = await addDoc(collection(db, 'budget'), transaction);
    return {
      id: docRef.id,
      ...transaction,
      date: transaction.date.toDate().toISOString(),
    };
  }
);

const initialState = {
  transactions: [],
  summary: {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryTotals: {}
  },
  loading: false,
  error: null,
};

const financeSlice = createSlice({
  name: 'finances',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFinances.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.summary = action.payload.summary;
      })
      .addCase(fetchFinances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        // Update summary
        if (action.payload.type === 'income') {
          state.summary.totalIncome += action.payload.amount;
          state.summary.balance += action.payload.amount;
        } else {
          state.summary.totalExpenses += action.payload.amount;
          state.summary.balance -= action.payload.amount;
        }
        // Update category totals
        if (!state.summary.categoryTotals[action.payload.category]) {
          state.summary.categoryTotals[action.payload.category] = { income: 0, expense: 0 };
        }
        state.summary.categoryTotals[action.payload.category][action.payload.type] += action.payload.amount;
      });
  },
});

export default financeSlice.reducer;
