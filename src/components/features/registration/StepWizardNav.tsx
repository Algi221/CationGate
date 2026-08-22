"use client";

import React from "react";

interface StepWizardNavProps {
  wizardStep: number;
  furthestStep: number;
  goToStep: (step: number) => void;
  getStepLabel: (step: number) => string;
}

export const StepWizardNav: React.FC<StepWizardNavProps> = ({
  wizardStep,
  furthestStep,
  goToStep,
  getStepLabel
}) => {
  return (
    <>
      {/* Desktop Stepper */}
      <div className="hidden md:flex justify-between items-center mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-[#1e293b]/80 -translate-y-1/2 z-0 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-1 bg-primary dark:bg-blue-500 -translate-y-1/2 z-0 rounded-full transition-all duration-500"
          style={{ width: `${((wizardStep - 1) / 13) * 100}%` }}
        ></div>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((step) => {
          const isCompleted = wizardStep > step;
          const isCurrent = wizardStep === step;
          const isUnlocked = step <= furthestStep;
          return (
            <div
              key={step}
              onClick={() => goToStep(step)}
              title={`Tahap ${step}: ${getStepLabel(step)}`}
              className={`rounded-full z-10 transition-all duration-500 ease-out select-none relative flex items-center justify-center font-bold text-[10px] ${
                isCurrent
                  ? "w-7 h-7 bg-primary dark:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.65)] scale-125 ring-[6px] ring-primary/20 cursor-pointer"
                  : isCompleted
                    ? "w-6 h-6 bg-primary dark:bg-blue-500 text-white hover:bg-primary/90 ring-[3px] ring-primary/10 cursor-pointer"
                    : isUnlocked
                      ? "w-6 h-6 bg-white dark:bg-[#0f172a] text-primary border-2 border-blue-400 hover:border-primary cursor-pointer"
                      : "w-6 h-6 bg-white dark:bg-[#0f172a] text-slate-400 border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary cursor-pointer"
              }`}
            >
              {step}
            </div>
          );
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="block md:hidden mb-8 bg-background dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs font-black uppercase text-primary dark:text-blue-500 tracking-wider">
            Tahap {wizardStep} dari 14
          </span>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {getStepLabel(wizardStep)}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary dark:bg-blue-550 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(wizardStep / 14) * 100}%` }}
          ></div>
        </div>
      </div>
    </>
  );
};
