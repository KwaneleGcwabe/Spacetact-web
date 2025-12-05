import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Calculator, X, Check } from 'lucide-react';
import { CalculatorInputs, CalculatorResults } from '../types';
import { calculateROI, formatCurrency } from '../utils/roiCalculator';

interface ROICalculatorProps {
  onClose: () => void;
  onBookDiscovery: (results: CalculatorResults) => void;
}

const steps = [
  { id: 'industry', title: "Industry Sector", description: "Select your primary field of operation." },
  { id: 'scale', title: "Operational Scale", description: "Benchmark your automation potential." },
  { id: 'workload', title: "Efficiency Analysis", description: "Quantify time loss due to manual tasks." },
  { id: 'contact', title: "Report Generation", description: "Where should we send the analysis?" },
];

const ROICalculator: React.FC<ROICalculatorProps> = ({ onClose, onBookDiscovery }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    industry: '',
    employeeCount: 0,
    monthlyRevenue: 0,
    painPoints: '',
    adminHoursPerWeek: 0,
    avgHourlyWage: 150,
    email: '',
  });
  const [results, setResults] = useState<CalculatorResults | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculate = () => {
    const calculatedResults = calculateROI(inputs);
    setResults(calculatedResults);
    setShowResults(true);
  };

  const updateInput = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Render Functions
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Industry</label>
              <select 
                value={inputs.industry}
                onChange={(e) => updateInput('industry', e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight"
              >
                <option value="" disabled className="text-gray-400">Select...</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Legal">Legal / Law</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial">Financial</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Agency">Agency</option>
                <option value="Logistics">Logistics</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Primary Bottleneck</label>
              <input 
                type="text"
                placeholder="e.g. Data Entry"
                value={inputs.painPoints}
                onChange={(e) => updateInput('painPoints', e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight placeholder-gray-300"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Employee Count</label>
              <input 
                type="number"
                min="1"
                value={inputs.employeeCount || ''}
                onChange={(e) => updateInput('employeeCount', parseInt(e.target.value))}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight placeholder-gray-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Monthly Revenue (ZAR)</label>
              <input 
                type="number"
                min="0"
                value={inputs.monthlyRevenue || ''}
                onChange={(e) => updateInput('monthlyRevenue', parseInt(e.target.value))}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight placeholder-gray-300"
                placeholder="0.00"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Manual Hours / Week</label>
              <input 
                type="number"
                min="1"
                value={inputs.adminHoursPerWeek || ''}
                onChange={(e) => updateInput('adminHoursPerWeek', parseInt(e.target.value))}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight placeholder-gray-300"
                placeholder="15"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Avg Hourly Wage (ZAR)</label>
              <input 
                type="number"
                min="20"
                value={inputs.avgHourlyWage || ''}
                onChange={(e) => updateInput('avgHourlyWage', parseInt(e.target.value))}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight placeholder-gray-300"
                placeholder="150"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-12">
            <div>
              <label className="block text-sm font-bold uppercase tracking-widest text-brand-primary mb-4">Work Email</label>
              <input 
                type="email"
                value={inputs.email}
                onChange={(e) => updateInput('email', e.target.value)}
                className="w-full bg-transparent border-b-2 border-gray-200 py-4 text-3xl md:text-4xl text-gray-900 focus:border-brand-primary outline-none transition-all font-bold tracking-tight placeholder-gray-300"
                placeholder="email@company.com"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // If results are ready, show dashboard
  if (showResults && results) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-50 text-gray-900 overflow-y-auto font-sans">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6 flex justify-between items-center sticky top-0 z-20 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary p-1.5 rounded text-white">
                <Calculator className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-[0.2em] text-gray-900">ROI ANALYSIS</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-gray-900">
                Projected Impact
              </h2>
              <p className="text-gray-500 text-xl max-w-2xl font-medium">
                Based on your operational data, here is the financial efficiency model.
              </p>
            </motion.div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-gray-200 p-10 flex flex-col justify-between h-64 rounded-xl shadow-sm"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Current Waste</p>
                <div>
                  <p className="text-5xl font-bold tracking-tighter text-gray-900 mb-2">{formatCurrency(results.annualManualCost)}</p>
                  <p className="text-sm text-gray-500 font-medium">Annual Manual Cost</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-brand-primary p-10 flex flex-col justify-between h-64 rounded-xl shadow-lg shadow-purple-500/20"
              >
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Net Savings</p>
                <div>
                  <p className="text-5xl font-bold tracking-tighter text-white mb-2">{formatCurrency(results.annualSavings)}</p>
                  <p className="text-sm text-white/80 font-medium">Projected Annual Profit</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white border border-gray-200 p-10 flex flex-col justify-between h-64 rounded-xl shadow-sm"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Efficiency</p>
                <div>
                  <p className="text-5xl font-bold tracking-tighter text-gray-900 mb-2">{results.paybackPeriodMonths} Mo</p>
                  <p className="text-sm text-gray-500 font-medium">Payback Period</p>
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <div className="flex flex-col md:flex-row items-center gap-12 border-t border-gray-200 pt-12">
              <div className="flex-1">
                 <p className="text-2xl font-bold tracking-tight mb-2 text-gray-900">3-Year Trajectory</p>
                 <p className="text-5xl font-bold text-brand-primary tracking-tighter">{formatCurrency(results.threeYearSavings)}</p>
                 <p className="text-gray-500 mt-2 text-sm font-medium">Cumulative Savings</p>
              </div>
              <button 
                onClick={() => onBookDiscovery(results)}
                className="px-10 py-5 bg-gray-900 text-white font-bold text-sm tracking-[0.1em] hover:bg-black transition-colors flex items-center gap-4 rounded-lg shadow-xl"
              >
                SCHEDULE FREE DISCOVERY CALL
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Wizard Flow
  return (
    <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl flex flex-col h-[80vh] bg-white shadow-2xl rounded-2xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-start p-8 md:p-12 pb-0">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-primary uppercase block mb-4">Step {currentStep + 1} / {steps.length}</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-500 text-lg font-medium">{steps[currentStep].description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center border-t border-gray-100 p-8 bg-gray-50">
          <button 
            onClick={currentStep === 0 ? onClose : handleBack}
            className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-[0.1em]"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !inputs.industry) ||
              (currentStep === 1 && (!inputs.employeeCount || !inputs.monthlyRevenue)) ||
              (currentStep === 2 && (!inputs.adminHoursPerWeek || !inputs.avgHourlyWage)) ||
              (currentStep === 3 && !inputs.email.includes('@'))
            }
            className="px-8 py-4 bg-brand-primary text-white rounded-lg font-bold text-sm tracking-[0.1em] hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-button"
          >
            {currentStep === steps.length - 1 ? 'CALCULATE' : 'NEXT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ROICalculator;