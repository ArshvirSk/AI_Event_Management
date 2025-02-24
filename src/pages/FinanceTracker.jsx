import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import BudgetAnalysis from "../components/BudgetAnalysis";
import BudgetForm from "../components/BudgetForm";
import ExpenseTracker from "../components/ExpenseTracker";

const steps = ["Budget Form", "Expense Tracking", "Budget Analysis"];

const FinanceTracker = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleBudgetSubmit = (formData) => {
    setBudget(formData);
    handleNext();
  };

  const handleExpenseUpdate = (expenseData) => {
    setExpenses(expenseData);
    handleNext();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BudgetForm onSubmit={handleBudgetSubmit} />;
      case 1:
        return budget ? (
          <ExpenseTracker
            budget={budget}
            onExpenseUpdate={handleExpenseUpdate}
          />
        ) : (
          <Typography variant="body1" className="message">
            Please submit the budget form first
          </Typography>
        );
      case 2:
        return budget && expenses ? (
          <BudgetAnalysis budget={budget} expenses={expenses} />
        ) : (
          <Typography variant="body1" className="message">
            Please complete budget and expense tracking first
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="mt-32 mx-auto px-4">
      <Paper elevation={3} className="p-8">
        <h1 className="text-center mb-8 font-bold text-4xl">
          College Event Budget Planner
        </h1>

        <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <div className="mt-8">
          {activeStep === steps.length ? (
            <div>
              <Typography className="mb-4">
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={() => setActiveStep(0)} className="mt-4">
                Reset
              </Button>
            </div>
          ) : (
            <div>
              {getStepContent(activeStep)}
              <Box className="flex justify-between mt-8">
                <Button
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className="mr-4"
                >
                  Back
                </Button>
                {activeStep !== steps.length - 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={
                      (activeStep === 0 && !budget) ||
                      (activeStep === 1 && !expenses)
                    }
                  >
                    Next
                  </Button>
                )}
              </Box>
            </div>
          )}
        </div>
      </Paper>
    </Box>
  );
};

export default FinanceTracker;
