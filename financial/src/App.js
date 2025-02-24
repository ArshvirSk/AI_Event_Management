import React, { useState } from 'react';
import './App.css';
import FeatureCard from './components/FeatureCard';
import BudgetForm from './components/BudgetForm';
import ExpenseTracker from './components/ExpenseTracker';
import BudgetAnalysis from './components/BudgetAnalysis';

function App() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState(null);

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature);
  };

  const handleBudgetSubmit = (formData) => {
    setBudget(formData);
    setActiveFeature('tracking');
  };

  const handleExpenseUpdate = (expenseData) => {
    setExpenses(expenseData);
    setActiveFeature('analysis');
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'form':
        return <BudgetForm onSubmit={handleBudgetSubmit} />;
      case 'tracking':
        return budget ? (
          <ExpenseTracker 
            budget={budget} 
            onExpenseUpdate={handleExpenseUpdate}
          />
        ) : (
          <div className="message">Please submit the budget form first</div>
        );
      case 'analysis':
        return budget && expenses ? (
          <BudgetAnalysis 
            budget={budget}
            expenses={expenses}
          />
        ) : (
          <div className="message">Please complete budget and expense tracking first</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>College Event Budget Planner</h1>
      </header>

      <div className="features-container">
        <FeatureCard 
          title="Form" 
          onClick={() => handleFeatureClick('form')}
        />
        <FeatureCard 
          title="Tracking" 
          onClick={() => handleFeatureClick('tracking')}
        />
        <FeatureCard 
          title="Analysis" 
          onClick={() => handleFeatureClick('analysis')}
        />
      </div>

      {renderActiveFeature()}
    </div>
  );
}

export default App;
