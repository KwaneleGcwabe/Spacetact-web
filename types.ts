import React from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface Message {
  id: string | number;
  role: 'user' | 'model';
  text: string;
  type?: 'text' | 'carousel';
  carouselItems?: ServiceItem[];
}

export interface CalculatorInputs {
  industry: string;
  employeeCount: number;
  monthlyRevenue: number;
  painPoints: string;
  adminHoursPerWeek: number;
  avgHourlyWage: number;
  email: string;
}

export interface CalculatorResults {
  annualManualCost: number;
  annualAutomationCost: number;
  annualSavings: number;
  roiPercentage: number;
  paybackPeriodMonths: number;
  threeYearSavings: number;
}