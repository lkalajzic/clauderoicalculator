"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

// Default hourly rates by role (US baseline)
const DEFAULT_HOURLY_RATES = {
  "Executive/Leadership": 100,
  Sales: 50,
  Marketing: 40,
  "Product & Engineering": 60,
  Operations: 30,
  "Finance & Accounting": 55,
  "Human Resources": 35,
  "Legal & Compliance": 75,
  "Customer Support": 20,
};

// Claude API subscription pricing
const CLAUDE_PRICING = {
  monthlySeatCost: 100, // ~$100 per user per month (estimated)
};

// Helper function to format currency
const formatCurrency = (amount) => {
  const absAmount = Math.abs(amount);
  const negative = amount < 0 ? "-" : "";

  if (absAmount >= 1000000) {
    return `${negative}$${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `${negative}$${(absAmount / 1000).toFixed(0)}K`;
  }
  return `${negative}$${absAmount.toFixed(0)}`;
};

// Helper function to format percentages with commas
const formatPercent = (percent) => {
  return percent.toLocaleString("en-US", { maximumFractionDigits: 0 });
};

// Helper function to get complexity color
const getComplexityColor = (complexity) => {
  switch (complexity?.toLowerCase()) {
    case "low":
      return "text-green-600 bg-green-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "high":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

// Helper function to get readiness status icon
const getReadinessIcon = (status) => {
  switch (status) {
    case "ready":
      return <span className="text-green-500">✅</span>;
    case "requires_setup":
      return <span className="text-yellow-500">⚠️</span>;
    case "depends_on_other":
      return <span className="text-orange-500">🔒</span>;
    default:
      return <span className="text-gray-400">❓</span>;
  }
};

// Component for individual use case
const UseCaseCard = ({
  useCase,
  functionData,
  onHoursChange,
  onEmployeeCountChange,
  enabled,
}) => {
  const [hours, setHours] = useState(useCase.hoursPerWeek || 5);
  const [employeeCount, setEmployeeCount] = useState(
    useCase.employeesUsing || 0
  );

  // Calculate ROI for this specific use case
  const roi = useMemo(() => {
    if (!enabled) return { annual: 0, perEmployee: 0 };

    const timeSavings = (useCase.timeSavingsPercent || 20) / 100;
    // Convert annual salary to hourly rate (assuming 2000 hours/year)
    const annualSalary =
      functionData.adjustedSalaryUSD ||
      functionData.avgSalaryUSD ||
      DEFAULT_HOURLY_RATES[functionData.name] * 2000 ||
      80000;
    const hourlyRate = annualSalary / 2000;

    // Annual savings = employees × hours/week × 52 weeks × time savings × hourly rate
    const annualSavings = employeeCount * hours * 52 * timeSavings * hourlyRate;
    const perEmployee = employeeCount > 0 ? annualSavings / employeeCount : 0;

    return {
      annual: annualSavings,
      perEmployee: perEmployee,
    };
  }, [hours, employeeCount, useCase, functionData, enabled]);

  const quickWinBadge = useCase.quickWinScore > 500 && (
    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
      Quick Win
    </span>
  );

  return (
    <div
      className={`border rounded-lg p-4 ${
        enabled ? "bg-white" : "bg-gray-50 opacity-60"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 flex items-center">
            {getReadinessIcon(useCase.readinessStatus)}
            <span className="ml-2">{useCase.name}</span>
            {quickWinBadge}
          </h4>
          <p className="text-sm text-gray-600 mt-1">{useCase.description}</p>
        </div>
        <div className="text-right ml-4">
          <div className="text-lg font-semibold text-green-600">
            {formatCurrency(roi.annual)}/yr
          </div>
          <div className="text-xs text-gray-500">
            {formatCurrency(roi.perEmployee)}/employee
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <span
            className={`px-2 py-1 rounded-full ${getComplexityColor(
              useCase.complexity
            )}`}
          >
            {useCase.complexity || "Medium"} complexity
          </span>
          <span className="text-gray-500">
            ~{useCase.complexityWeeks || 4} weeks
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Employees affected:</label>
            <input
              type="number"
              min="0"
              max={functionData.totalEmployees}
              value={employeeCount}
              onChange={(e) => {
                const newCount = parseInt(e.target.value) || 0;
                setEmployeeCount(newCount);
                onEmployeeCountChange(useCase.id, newCount);
              }}
              className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-coral-500"
              disabled={!enabled}
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Hours/week:</label>
            <input
              type="number"
              min="0"
              max="40"
              value={hours}
              onChange={(e) => {
                const newHours = parseInt(e.target.value) || 0;
                setHours(newHours);
                onHoursChange(useCase.id, newHours);
              }}
              className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-coral-500"
              disabled={!enabled}
            />
          </div>
        </div>
      </div>

      {useCase.examples && useCase.examples.length > 0 && (
        <div className="mt-3">
          <div className="text-sm text-gray-700 font-medium mb-2">
            Real-world examples:
          </div>
          <div className="space-y-2">
            {useCase.examples.map((example, idx) => (
              <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                <Link
                  href={`/case-studies/${example.caseStudyId}`}
                  className="font-medium text-coral-600 hover:text-coral-700 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {example.company}
                </Link>
                <span className="text-gray-600">: {example.metric}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {useCase.prerequisites && useCase.prerequisites.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Prerequisites: {useCase.prerequisites.join(", ")}
        </div>
      )}
    </div>
  );
};

// Main component
const UseCaseMatchesV2 = ({ matches }) => {
  const hasBusinessFunctions = matches?.businessFunctions?.length > 0;

  if (!hasBusinessFunctions) {
    return (
      <div className="text-center py-4 bg-gray-50 rounded-md">
        <p className="text-gray-500">
          No suitable use cases found. Try providing more company information.
        </p>
      </div>
    );
  }

  // Calculate initial ROI for each function to sort by annual savings
  const functionsWithRoi = matches.businessFunctions.map((func) => {
    let totalAnnualSavings = 0;

    if (func.useCases && func.useCases.length > 0) {
      func.useCases.forEach((uc) => {
        const hours = uc.hoursPerWeek || 5;
        const timeSavings = (uc.timeSavingsPercent || 20) / 100;
        const annualSalary =
          func.adjustedSalaryUSD ||
          func.avgSalaryUSD ||
          DEFAULT_HOURLY_RATES[func.name] * 2000 ||
          80000;
        const hourlyRate = annualSalary / 2000;
        const employees =
          uc.employeesUsing || Math.floor(func.employeeCount * 0.3); // Default to 30% of function employees

        totalAnnualSavings += employees * hours * 52 * timeSavings * hourlyRate;
      });
    }

    return {
      ...func,
      estimatedAnnualSavings: totalAnnualSavings,
    };
  });

  // Sort business functions by estimated annual savings (highest first)
  const sortedFunctions = [...functionsWithRoi].sort(
    (a, b) => b.estimatedAnnualSavings - a.estimatedAnnualSavings
  );

  // State for enabled functions and use cases
  const [enabledFunctions, setEnabledFunctions] = useState(
    sortedFunctions.reduce((acc, func) => {
      acc[func.id] = true;
      return acc;
    }, {})
  );

  const [enabledUseCases, setEnabledUseCases] = useState(
    sortedFunctions.reduce((acc, func) => {
      if (func.useCases) {
        func.useCases.forEach((uc) => {
          acc[uc.id] = true;
        });
      }
      return acc;
    }, {})
  );

  const [useCaseHours, setUseCaseHours] = useState(
    sortedFunctions.reduce((acc, func) => {
      if (func.useCases) {
        func.useCases.forEach((uc) => {
          acc[uc.id] = uc.hoursPerWeek || 5;
        });
      }
      return acc;
    }, {})
  );

  const [useCaseEmployees, setUseCaseEmployees] = useState(
    sortedFunctions.reduce((acc, func) => {
      if (func.useCases) {
        func.useCases.forEach((uc) => {
          acc[uc.id] = uc.employeesUsing || 0;
        });
      }
      return acc;
    }, {})
  );

  const [expandedFunctions, setExpandedFunctions] = useState({});
  const [showAllUseCases, setShowAllUseCases] = useState({});

  // Calculate total ROI
  const totalMetrics = useMemo(() => {
    let totalAnnualSavings = 0;
    let totalEmployees = 0;
    let totalImplementationWeeks = 0;
    let implementationCosts = 0;
    let uniqueEmployeeIds = new Set();

    sortedFunctions.forEach((func) => {
      if (!enabledFunctions[func.id] || !func.useCases) return;

      func.useCases.forEach((uc) => {
        if (!enabledUseCases[uc.id]) return;

        const hours = useCaseHours[uc.id] || uc.hoursPerWeek || 5;
        const timeSavings = (uc.timeSavingsPercent || 20) / 100;
        // Convert annual salary to hourly rate (assuming 2000 hours/year)
        const annualSalary =
          func.adjustedSalaryUSD ||
          func.avgSalaryUSD ||
          DEFAULT_HOURLY_RATES[func.name] * 2000 ||
          80000;
        const hourlyRate = annualSalary / 2000;
        const employees = useCaseEmployees[uc.id] || 0;

        // Track unique employees for accurate Claude cost calculation
        if (employees > 0) {
          uniqueEmployeeIds.add(`${func.id}_${uc.id}`);
        }

        totalAnnualSavings += employees * hours * 52 * timeSavings * hourlyRate;
        totalImplementationWeeks = Math.max(
          totalImplementationWeeks,
          uc.complexityWeeks || 4
        );
      });
    });

    // Calculate total unique employees across all enabled use cases
    sortedFunctions.forEach((func) => {
      if (!enabledFunctions[func.id]) return;
      let maxEmployeesInFunction = 0;
      func.useCases?.forEach((uc) => {
        if (enabledUseCases[uc.id]) {
          maxEmployeesInFunction = Math.max(
            maxEmployeesInFunction,
            useCaseEmployees[uc.id] || 0
          );
        }
      });
      totalEmployees += maxEmployeesInFunction;
    });

    // Claude subscription cost
    const annualClaudeCost =
      totalEmployees * CLAUDE_PRICING.monthlySeatCost * 12;

    // Simple ROI calculation - just Claude subscription cost
    const netAnnual = totalAnnualSavings - annualClaudeCost;

    // ROI = Annual Savings / Annual Claude Cost
    const roiMultiplier =
      annualClaudeCost > 0 ? totalAnnualSavings / annualClaudeCost : 0;
    const roiPercent =
      annualClaudeCost > 0
        ? ((totalAnnualSavings - annualClaudeCost) / annualClaudeCost) * 100
        : 0;

    return {
      totalAnnualSavings,
      annualClaudeCost,
      netAnnual,
      roiPercent,
      roiMultiplier,
      totalEmployees,
    };
  }, [
    sortedFunctions,
    enabledFunctions,
    enabledUseCases,
    useCaseHours,
    useCaseEmployees,
  ]);

  return (
    <div className="space-y-6" id="roi-results">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-coral-100">
          <h3 className="text-sm text-gray-600 mb-1">Annual Savings</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalMetrics.totalAnnualSavings)}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-coral-100">
          <h3 className="text-sm text-gray-600 mb-1">Claude Cost (Annual)</h3>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalMetrics.annualClaudeCost)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalMetrics.totalEmployees} users × $100/mo
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-coral-100">
          <h3 className="text-sm text-gray-600 mb-1">Net Annual Savings</h3>
          <p className="text-2xl font-bold text-coral-600">
            {formatCurrency(totalMetrics.netAnnual)}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm border border-coral-100">
          <h3 className="text-sm text-gray-600 mb-1">ROI Multiple</h3>
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(totalMetrics.roiMultiplier)}x
          </p>
          <p className="text-xs text-gray-500 mt-1">return on investment</p>
        </div>
      </div>

      {/* Pricing disclaimer */}
      <div className="text-xs text-gray-500 text-center -mt-2">
        Pricing estimate based on ~$100/seat/month.
        <Link
          href="https://anthropic.com/enterprise"
          className="text-coral-600 hover:text-coral-700 ml-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Contact Anthropic for accurate pricing
        </Link>
      </div>

      {/* 2nd Order Benefits */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-coral-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Second-Order Benefits
        </h3>
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-900 font-medium">
            This calculator measures productivity gains, not necessarily
            economic gains. For example, if customer service saves 30% of their
            time with AI, this doesn't mean 30% of the staff get fired, but
            rather has more time for other tasks.
          </p>
        </div>
        <div className="space-y-2 text-sm text-gray-700">
          {(() => {
            const benefits = [];
            const enabledFunctionsList = sortedFunctions.filter(
              (f) => enabledFunctions[f.id] && f.employeeCount > 0
            );

            // Build benefits based on enabled functions
            const hasSupport = enabledFunctionsList.find(
              (f) => f.name === "Customer Support"
            );
            const hasSales = enabledFunctionsList.find(
              (f) => f.name === "Sales"
            );
            const hasEngineering = enabledFunctionsList.find(
              (f) => f.name === "Product & Engineering"
            );
            const hasMarketing = enabledFunctionsList.find(
              (f) => f.name === "Marketing"
            );
            const hasOps = enabledFunctionsList.find(
              (f) => f.name === "Operations"
            );

            // Proactive outreach capability
            if (hasSupport || hasSales) {
              const teams = [];
              if (hasSupport) teams.push("support");
              if (hasSales) teams.push("sales");
              benefits.push(
                `Enable ${teams.join(
                  " and "
                )} teams to shift from reactive to proactive - reaching out to customers before issues arise, identifying upsell opportunities, and building deeper relationships through personalized communication at scale`
              );
            }

            // Product excellence capability
            if (hasEngineering) {
              benefits.push(
                `Product teams can finally tackle long-standing technical debt, implement proper documentation, and most importantly - spend significantly more time talking to customers and understanding their needs rather than fighting fires`
              );
            }

            // Strategic planning capability
            if (hasMarketing || hasOps || enabledFunctionsList.length >= 3) {
              benefits.push(
                `Transform from a company constantly catching up to one that plans ahead - with teams having bandwidth for strategic initiatives, experimentation, and building systems that prevent problems rather than just solving them`
              );
            }

            // Default benefits if needed
            if (benefits.length === 0) {
              benefits.push(
                `Enable teams to move from reactive firefighting to proactive value creation`,
                `Create capacity for strategic initiatives that were previously impossible due to daily operational demands`,
                `Build a culture of innovation by freeing talented employees from repetitive tasks`
              );
            }

            return benefits.slice(0, 3).map((benefit, idx) => (
              <div key={idx} className="flex items-start">
                <span className="text-gray-400 mr-3">•</span>
                <p>{benefit}</p>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* ROI Calculator Instructions */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-coral-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          How to Use This Calculator
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-900 font-medium">
            The results are split by 9 standard business functions. Each
            function shows the top 3 Claude AI use cases with real company
            examples. Claude estimates the complexity and implementation time in
            weeks.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">Toggle Functions</p>
              <p className="text-gray-600 text-xs">
                Enable/disable business functions and use cases
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">
              2
            </span>
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">Set Employees</p>
              <p className="text-gray-600 text-xs">
                How many employees do this task
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <span className="flex-shrink-0 w-6 h-6 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center text-xs font-bold">
              3
            </span>
            <div className="text-sm">
              <p className="font-medium text-gray-900 mb-1">Set Hours</p>
              <p className="text-gray-600 text-xs">
                Hours/week spent on this task
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Functions */}
      {sortedFunctions.map((func) => {
        const isExpanded = expandedFunctions[func.id] !== false;
        const functionEnabled = enabledFunctions[func.id];
        const hasUseCases = func.useCases && func.useCases.length > 0;

        // Calculate function-specific ROI
        const functionRoi = useMemo(() => {
          if (!functionEnabled || !hasUseCases) return 0;

          let total = 0;
          func.useCases.forEach((uc) => {
            if (!enabledUseCases[uc.id]) return;

            const hours = useCaseHours[uc.id] || uc.hoursPerWeek || 10;
            const timeSavings = (uc.timeSavingsPercent || 30) / 100;
            // Convert annual salary to hourly rate (assuming 2000 hours/year)
            const annualSalary =
              func.adjustedSalaryUSD ||
              func.avgSalaryUSD ||
              DEFAULT_HOURLY_RATES[func.name] * 2000 ||
              80000;
            const hourlyRate = annualSalary / 2000;
            const employees = useCaseEmployees[uc.id] || 0;

            total += employees * hours * 52 * timeSavings * hourlyRate;
          });

          return total;
        }, [
          func,
          functionEnabled,
          enabledUseCases,
          useCaseHours,
          useCaseEmployees,
        ]);

        return (
          <div
            key={func.id}
            className={`border rounded-lg transition-all duration-200 ${
              functionEnabled ? "border-coral-200 shadow-sm" : "border-gray-200"
            }`}
          >
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={functionEnabled}
                    onChange={(e) => {
                      setEnabledFunctions((prev) => ({
                        ...prev,
                        [func.id]: e.target.checked,
                      }));
                      // Also toggle all use cases in this function
                      if (func.useCases) {
                        const newUseCases = { ...enabledUseCases };
                        func.useCases.forEach((uc) => {
                          newUseCases[uc.id] = e.target.checked;
                        });
                        setEnabledUseCases(newUseCases);
                      }
                    }}
                    className="h-5 w-5 text-coral-600 rounded focus:ring-coral-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold flex items-center">
                      {func.name}
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({Math.round(func.relevanceScore)}% relevance)
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {func.employeeCount} employees
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {functionEnabled && (
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(functionRoi)}/yr
                      </div>
                      <div className="text-xs text-gray-500">Total ROI</div>
                    </div>
                  )}

                  {hasUseCases && (
                    <button
                      onClick={() =>
                        setExpandedFunctions((prev) => ({
                          ...prev,
                          [func.id]: !isExpanded,
                        }))
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className={`w-5 h-5 transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {func.whyRelevant && (
                <p className="mt-2 text-sm text-gray-700 italic">
                  "{func.whyRelevant}"
                </p>
              )}
            </div>

            {isExpanded && hasUseCases && (
              <div className="p-4 space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Use Cases (
                  {showAllUseCases[func.id]
                    ? `showing all ${func.useCases.length}`
                    : `showing top ${Math.min(3, func.useCases.length)} of ${
                        func.useCases.length
                      }`}
                  ):
                </div>

                {func.useCases
                  .slice(0, showAllUseCases[func.id] ? func.useCases.length : 3)
                  .map((useCase) => (
                    <div
                      key={useCase.id}
                      className="flex items-start space-x-3"
                    >
                      <input
                        type="checkbox"
                        checked={enabledUseCases[useCase.id]}
                        onChange={(e) => {
                          setEnabledUseCases((prev) => ({
                            ...prev,
                            [useCase.id]: e.target.checked,
                          }));
                        }}
                        disabled={!functionEnabled}
                        className="mt-1 h-4 w-4 text-coral-600 rounded focus:ring-coral-500"
                      />
                      <div className="flex-1">
                        <UseCaseCard
                          useCase={useCase}
                          functionData={func}
                          enabled={
                            functionEnabled && enabledUseCases[useCase.id]
                          }
                          onHoursChange={(id, hours) => {
                            setUseCaseHours((prev) => ({
                              ...prev,
                              [id]: hours,
                            }));
                          }}
                          onEmployeeCountChange={(id, count) => {
                            setUseCaseEmployees((prev) => ({
                              ...prev,
                              [id]: count,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}

                {func.useCases.length > 3 && !showAllUseCases[func.id] && (
                  <button
                    onClick={() =>
                      setShowAllUseCases((prev) => ({
                        ...prev,
                        [func.id]: true,
                      }))
                    }
                    className="text-sm text-coral-600 hover:text-coral-700 mt-2 font-medium"
                  >
                    Show {func.useCases.length - 3} more use cases
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UseCaseMatchesV2;
