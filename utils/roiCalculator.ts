import { CalculatorInputs, CalculatorResults } from '../types';

// Assumptions regarding automation costs (ZAR)
const ESTIMATED_MONTHLY_AUTOMATION_COST = 4500; // R4,500/pm base package
const ESTIMATED_SETUP_COST = 5000; // One-time setup fee

export const calculateROI = (inputs: CalculatorInputs): CalculatorResults => {
  // 1. Calculate Annual Manual Cost
  // Formula: Hours/week * 52 weeks * Hourly Rate
  const annualManualCost = inputs.adminHoursPerWeek * 52 * inputs.avgHourlyWage;

  // 2. Calculate Annual Automation Cost
  // Formula: (Monthly Cost * 12) + Setup Fee
  const annualAutomationCost = (ESTIMATED_MONTHLY_AUTOMATION_COST * 12) + ESTIMATED_SETUP_COST;

  // 3. Calculate Net Savings (Year 1)
  const annualSavings = annualManualCost - annualAutomationCost;

  // 4. Calculate ROI Percentage
  // Formula: (Net Savings / Cost of Investment) * 100
  const roiPercentage = (annualSavings / annualAutomationCost) * 100;

  // 5. Calculate Payback Period (Months)
  // Formula: Cost of Investment / Monthly Savings
  // Monthly Manual Cost = (Hours * 4.33 * Wage)
  const monthlyManualCost = inputs.adminHoursPerWeek * 4.33 * inputs.avgHourlyWage;
  const monthlySavings = monthlyManualCost - ESTIMATED_MONTHLY_AUTOMATION_COST;
  
  // Avoid division by zero
  const paybackPeriodMonths = monthlySavings > 0 
    ? ESTIMATED_SETUP_COST / monthlySavings 
    : 0;

  // 6. Three Year Savings (Assuming maintenance cost stays same, setup fee only in year 1)
  const subsequentYearSavings = annualManualCost - (ESTIMATED_MONTHLY_AUTOMATION_COST * 12);
  const threeYearSavings = annualSavings + (subsequentYearSavings * 2);

  return {
    annualManualCost,
    annualAutomationCost,
    annualSavings,
    roiPercentage: Math.round(roiPercentage),
    paybackPeriodMonths: parseFloat(paybackPeriodMonths.toFixed(1)),
    threeYearSavings,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount);
};