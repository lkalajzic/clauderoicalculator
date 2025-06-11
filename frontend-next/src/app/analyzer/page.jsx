"use client";

import React, { useState, useEffect } from "react";
import { companyAnalysisApi } from "../../services/api";
import AnalysisResults from "../../components/analysis/AnalysisResults";
import UseCaseMatchesV2 from "../../components/analysis/UseCaseMatchesV2";
import { FormReview } from "../../components/analysis/FormReview";
import SalaryAdjustmentForm from "../../components/analysis/SalaryAdjustmentForm";
import ClaudeLoader from "../../components/ClaudeLoader";
import RenaissanceBackground from "../../components/RenaissanceBackground";

const CompanyAnalyzer = () => {
  // Default template for company description
  const defaultTemplate = `We are a B2B SaaS company in the Information Technology industry with approximately 850 employees:

• Software Engineers/Developers: 200 engineers
• Customer Success & Support Reps: 180 support staff
• Sales Representatives: 120 sales professionals
• Marketing Professionals: 80 marketing team members
• Product Managers and Designers: 50 product team
• Data Analysts and Business Intelligence Team: 40 analysts
• HR and Recruiting Staff: 30 HR professionals
• Finance and Accounting Team: 25 finance professionals
• Legal and Compliance Officers: 20 legal team
• Executives and Senior Leadership: 15 C-suite and VPs
• Other Operations and Administrative Staff: 90 operations team

Our main products/services include:
We provide cloud-based enterprise resource planning (ERP) software for mid-market manufacturing companies. Our platform helps businesses manage inventory, supply chain, production scheduling, and financial operations through an integrated suite of tools.

Key challenges we face:
• Customer support ticket volume has doubled in the past year as we've scaled
• Sales team needs better tools for prospect research and personalized outreach
• Engineering team has a significant documentation backlog affecting onboarding
• Marketing content creation is a bottleneck for our growth initiatives
• HR is struggling to keep up with hiring and onboarding volume

Our headquarters is in San Francisco but we hire remotely in the US.`;

  // State for form inputs and workflow
  const [analysisType, setAnalysisType] = useState("description");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState(defaultTemplate);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [combinedResults, setCombinedResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState("input"); // 'input' | 'salary-adjust' | 'results'

  // Handle the complete analysis with corrected data
  const handleCompleteAnalysis = async (correctedData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the combined endpoint with original description and corrected data
      const result = await companyAnalysisApi.analyzeAndMatch(
        companyDescription,
        correctedData
      );
      setCombinedResults(result);
      setStage("results");
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to complete analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle initial form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous results and errors
    setAnalysisResults(null);
    setCombinedResults(null);
    setError(null);
    setIsLoading(true);

    try {
      // For the new flow, we'll use the combined endpoint directly
      if (analysisType === "description" && companyDescription) {
        // First call to get initial analysis with salary adjustments
        const results = await companyAnalysisApi.analyzeAndMatch(
          companyDescription
        );
        setAnalysisResults(results);
        setStage("salary-adjust");
      } else if (analysisType === "website" && websiteUrl) {
        // For website, we need to first get the description, then analyze
        setError(
          "Website analysis coming soon! Please use company description for now."
        );
      } else {
        setError(
          "Please enter " +
            (analysisType === "website"
              ? "a valid URL"
              : "a company description")
        );
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Error analyzing company. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle salary adjustment form submission
  const handleSalaryAdjustmentSubmit = (adjustedData) => {
    // Now make the final call with corrected data
    handleCompleteAnalysis(adjustedData);
  };

  // Handle salary adjustment cancellation
  const handleSalaryAdjustmentCancel = () => {
    setStage("input");
    setAnalysisResults(null);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-coral-50/20 via-white to-orange-50/20 relative w-full max-w-full"
      style={{ overflowX: "hidden", width: "100vw", maxWidth: "100vw" }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        {/* Blueprint-style grid */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <pattern
            id="blueprint-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="#dc7454"
              strokeWidth="0.5"
            />
            <path
              d="M 25 0 L 25 50 M 0 25 L 50 25"
              fill="none"
              stroke="#dc7454"
              strokeWidth="0.2"
              opacity="0.5"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>

        {/* Modern neural network overlay - contained */}
        <svg
          className="absolute bottom-0 right-0 w-1/2 h-1/2 max-w-[400px] max-h-[400px]"
          viewBox="0 0 400 400"
        >
          <g opacity="0.5">
            {/* Input layer */}
            <circle cx="50" cy="100" r="3" fill="#dc7454" opacity="0.3" />
            <circle cx="50" cy="150" r="3" fill="#dc7454" opacity="0.3" />
            <circle cx="50" cy="200" r="3" fill="#dc7454" opacity="0.3" />
            <circle cx="50" cy="250" r="3" fill="#dc7454" opacity="0.3" />

            {/* Hidden layer 1 */}
            <circle cx="150" cy="80" r="4" fill="#1a1a1a" />
            <circle cx="150" cy="130" r="4" fill="#1a1a1a" />
            <circle cx="150" cy="180" r="4" fill="#1a1a1a" />
            <circle cx="150" cy="230" r="4" fill="#1a1a1a" />
            <circle cx="150" cy="280" r="4" fill="#1a1a1a" />

            {/* Hidden layer 2 */}
            <circle cx="250" cy="100" r="4" fill="#1a1a1a" />
            <circle cx="250" cy="175" r="4" fill="#1a1a1a" />
            <circle cx="250" cy="250" r="4" fill="#1a1a1a" />

            {/* Output layer */}
            <circle cx="350" cy="150" r="3" fill="#dc7454" opacity="0.3" />
            <circle cx="350" cy="200" r="3" fill="#dc7454" opacity="0.3" />

            {/* Connections - only showing some for visual clarity */}
            <line
              x1="50"
              y1="100"
              x2="150"
              y2="80"
              stroke="#1a1a1a"
              strokeWidth="0.2"
            />
            <line
              x1="50"
              y1="150"
              x2="150"
              y2="130"
              stroke="#1a1a1a"
              strokeWidth="0.2"
            />
            <line
              x1="150"
              y1="130"
              x2="250"
              y2="100"
              stroke="#1a1a1a"
              strokeWidth="0.2"
            />
            <line
              x1="150"
              y1="180"
              x2="250"
              y2="175"
              stroke="#1a1a1a"
              strokeWidth="0.2"
            />
            <line
              x1="250"
              y1="175"
              x2="350"
              y2="150"
              stroke="#1a1a1a"
              strokeWidth="0.2"
            />
            <line
              x1="250"
              y1="250"
              x2="350"
              y2="200"
              stroke="#1a1a1a"
              strokeWidth="0.2"
            />
          </g>
        </svg>

        {/* Da Vinci style technical drawing elements */}
        <svg
          className="absolute top-10 right-10 w-32 h-32 opacity-20"
          viewBox="0 0 100 100"
        >
          {/* Vitruvian circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.3"
          />
          {/* Square inscribed */}
          <rect
            x="20"
            y="20"
            width="60"
            height="60"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.3"
            transform="rotate(45 50 50)"
          />
          {/* Golden ratio spiral hint */}
          <path
            d="M 50 50 Q 80 50 80 80 T 50 110"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.2"
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-8 pt-32 pb-20 relative z-10">
        {/* Initial Analysis Form */}
        {stage === "input" && (
          <div className="space-y-12">
            {/* Enhanced header with Renaissance majesty */}
            <div className="text-center space-y-6 relative">
              {/* Floating mathematical annotations - contained within bounds */}
              <div className="absolute left-4 top-8 opacity-20 font-serif italic text-sm text-coral-600 hidden lg:block">
                π ≈ 3.14159...
              </div>
              <div className="absolute right-4 top-16 opacity-20 font-serif italic text-sm text-coral-600 hidden lg:block">
                e ≈ 2.71828...
              </div>
              <div className="absolute left-8 bottom-8 opacity-20 font-serif italic text-sm text-coral-600 hidden lg:block">
                φ = (1+√5)/2
              </div>

              <div className="relative inline-block">
                {/* Enhanced Renaissance frame with more ornate corners */}
                <div className="absolute -top-8 -left-12 w-12 h-12 opacity-40">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path
                      d="M 0 0 L 48 0 L 48 12 L 12 12 L 12 48 L 0 48 Z"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="absolute -top-8 -right-12 w-12 h-12 opacity-40">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path
                      d="M 48 0 L 0 0 L 0 12 L 36 12 L 36 48 L 48 48 Z"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-8 -left-12 w-12 h-12 opacity-40">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path
                      d="M 0 48 L 48 48 L 48 36 L 12 36 L 12 0 L 0 0 Z"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-8 -right-12 w-12 h-12 opacity-40">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path
                      d="M 48 48 L 0 48 L 0 36 L 36 36 L 36 0 L 48 0 Z"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <h1 className="text-7xl font-light tracking-tight text-gray-900 font-serif">
                  Company Analyzer
                </h1>
              </div>

              {/* Enhanced decorative divider with Renaissance medallion */}
              <div className="flex items-center justify-center space-x-6 my-8">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-coral-500/60 to-coral-500/40"></div>

                {/* Central medallion */}
                <div className="relative">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    className="transform hover:rotate-180 transition-transform duration-700"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="15"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="0.8"
                      opacity="0.8"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="10"
                      fill="none"
                      stroke="#dc7454"
                      strokeWidth="1"
                    />

                    {/* Inner geometric pattern */}
                    <g transform="translate(24,24)">
                      <path
                        d="M -8 0 L 8 0 M 0 -8 L 0 8"
                        stroke="#dc7454"
                        strokeWidth="0.5"
                      />
                      <path
                        d="M -6 -6 L 6 6 M -6 6 L 6 -6"
                        stroke="#dc7454"
                        strokeWidth="0.3"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="3"
                        fill="#dc7454"
                        opacity="0.3"
                      />
                    </g>

                    {/* Outer decorative elements */}
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <g key={angle} transform={`rotate(${angle} 24 24)`}>
                        <path
                          d="M 24 4 L 26 8 L 24 12 L 22 8 Z"
                          fill="#dc7454"
                          opacity="0.4"
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="h-px w-24 bg-gradient-to-l from-transparent via-coral-500/60 to-coral-500/40"></div>
              </div>

              <div className="space-y-3">
                <p className="text-xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
                  Calculate the ROI of implementing Claude AI for your business
                  with 124 real case studies from Fortune 500 and startups
                  alike.
                </p>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm border border-coral-100 shadow-xl relative">
                {/* Corner decorations */}
                <div className="absolute -top-px -left-px w-16 h-16 border-t-2 border-l-2 border-coral-400/40"></div>
                <div className="absolute -top-px -right-px w-16 h-16 border-t-2 border-r-2 border-coral-400/40"></div>
                <div className="absolute -bottom-px -left-px w-16 h-16 border-b-2 border-l-2 border-coral-400/40"></div>
                <div className="absolute -bottom-px -right-px w-16 h-16 border-b-2 border-r-2 border-coral-400/40"></div>

                {/* Tab Selection - Website analysis commented out for MVP */}
                {/* <div className="flex border-b border-coral-100">
                  <button
                    type="button"
                    className={`flex-1 px-8 py-5 text-sm tracking-wide transition-all duration-300 relative ${
                      analysisType === "website"
                        ? "text-coral-800 bg-gradient-to-r from-coral-50 to-orange-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setAnalysisType("website")}
                    disabled={isLoading}
                  >
                    {analysisType === "website" && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-coral-500"></div>
                    )}
                    <span className="font-medium">Website Analysis</span>
                  </button>
                  <button
                    type="button"
                    className={`flex-1 px-8 py-5 text-sm tracking-wide transition-all duration-300 relative ${
                      analysisType === "description"
                        ? "text-coral-800 bg-gradient-to-r from-coral-50 to-orange-50"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => {
                      setAnalysisType("description");
                      if (!companyDescription) {
                        setCompanyDescription(defaultTemplate);
                      }
                    }}
                    disabled={isLoading}
                  >
                    {analysisType === "description" && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-coral-500"></div>
                    )}
                    <span className="font-medium">Written Description</span>
                  </button>
                </div> */}

                {/* Form Content */}
                <div className="p-10 relative">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-8 relative z-10"
                  >
                    <div className="space-y-3">
                      <label
                        className="block text-xs uppercase tracking-[0.2em] text-coral-700"
                        htmlFor="companyDescription"
                      >
                        Company Description
                      </label>

                      {/* Simplified helper text */}
                      <p className="text-sm text-gray-600 font-light italic">
                        Include industry classification, departmental headcount,
                        and operational challenges for optimal analysis.
                      </p>

                      {/* Textarea with line numbers */}
                      <div className="relative">
                        {/* Line numbers */}
                        <div className="absolute left-0 top-3 bottom-0 w-12 border-r border-gray-100 pointer-events-none">
                          {Array.from({ length: 20 }, (_, i) => (
                            <div
                              key={i}
                              className="text-xs text-gray-300 text-right pr-3 h-[1.875rem] flex items-center justify-end font-light"
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>

                        <textarea
                          id="companyDescription"
                          className="w-full pl-16 pr-4 py-3 text-base bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-400 leading-[1.875rem] resize-none font-mono"
                          placeholder="Describe your company..."
                          rows={20}
                          value={companyDescription}
                          onChange={(e) =>
                            setCompanyDescription(e.target.value)
                          }
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-center pt-8 relative">
                      <button
                        type="submit"
                        className={`group relative px-12 py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 transition-all duration-300 ${
                          isLoading ? "opacity-80" : ""
                        }`}
                        disabled={isLoading}
                      >
                        {/* Subtle border */}
                        <div className="absolute inset-0 border border-white/20"></div>

                        {/* Button content */}
                        <span className="relative z-10 flex items-center justify-center space-x-3 text-white">
                          {/* Renaissance-style gear icon */}
                          <svg
                            className={`w-6 h-6 ${
                              isLoading ? "animate-spin" : ""
                            }`}
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M12 2L13.09 7.26C13.18 7.67 13.64 7.87 13.99 7.65L18.24 5.24L16.97 10.01C16.85 10.42 17.18 10.8 17.6 10.73L22 10L19.59 14.41C19.36 14.76 19.56 15.22 19.97 15.31L24 16L19.73 18.09C19.32 18.18 19.13 18.64 19.35 18.99L21.76 23.24L16.99 21.97C16.58 21.85 16.2 22.18 16.27 22.6L17 27L14.59 22.59C14.24 22.36 13.78 22.56 13.69 22.97L13 27L12 22L10.91 16.74C10.82 16.33 10.36 16.13 10.01 16.35L5.76 18.76L7.03 13.99C7.15 13.58 6.82 13.2 6.4 13.27L2 14L4.41 9.59C4.64 9.24 4.44 8.78 4.03 8.69L0 8L4.27 5.91C4.68 5.82 4.87 5.36 4.65 5.01L2.24 0.76L7.01 2.03C7.42 2.15 7.8 1.82 7.73 1.4L7 -3L9.41 1.41C9.76 1.64 10.22 1.44 10.31 1.03L11 -3L12 2"
                              stroke="currentColor"
                              strokeWidth="1"
                              opacity="0.4"
                            />
                          </svg>
                          <span className="text-sm font-medium tracking-wider uppercase">
                            {isLoading ? "Analyzing..." : "Commence Analysis"}
                          </span>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <ClaudeLoader
              size={120}
              message={
                stage === "salary-adjust"
                  ? "Claude is analyzing your business and matching it against 124 case studies. This will take 1-3 minutes."
                  : "Claude is analyzing your business. This will take 1-2 minutes.\n\nIn the next step, please confirm and edit the estimated number of employees and their respective average salaries for a more accurate estimate."
              }
            />
          </div>
        )}

        {/* Salary Adjustment Form */}
        {stage === "salary-adjust" && !isLoading && analysisResults && (
          <div className="space-y-8">
            <button
              onClick={handleSalaryAdjustmentCancel}
              className="text-sm text-coral-600 hover:text-coral-700 transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Return to description</span>
            </button>

            <SalaryAdjustmentForm
              analysisData={analysisResults}
              onProceed={handleSalaryAdjustmentSubmit}
              onCancel={handleSalaryAdjustmentCancel}
            />
          </div>
        )}

        {/* Results Section */}
        {stage === "results" && combinedResults && (
          <div className="space-y-8">
            <button
              onClick={() => {
                setStage("input");
                setCombinedResults(null);
                setAnalysisResults(null);
              }}
              className="text-sm text-coral-600 hover:text-coral-700 transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>New Analysis</span>
            </button>

            {/* Company Summary with decorative frame */}
            <div className="bg-white/80 backdrop-blur-sm border border-coral-100 shadow-lg p-8 relative">
              <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-coral-400/40"></div>
              <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-coral-400/40"></div>
              <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-coral-400/40"></div>
              <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-coral-400/40"></div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-coral-700">
                    Company
                  </p>
                  <p className="mt-2 text-lg font-light">
                    {combinedResults.companyInfo?.name || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-coral-700">
                    Industry
                  </p>
                  <p className="mt-2 text-lg font-light">
                    {combinedResults.companyInfo?.industry}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-coral-700">
                    Employees
                  </p>
                  <p className="mt-2 text-lg font-light">
                    {combinedResults.companyInfo?.totalEmployees?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-coral-700">
                    Location
                  </p>
                  <p className="mt-2 text-lg font-light">
                    {combinedResults.companyInfo?.headquarters}
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Analysis */}
            <div className="pt-6">
              <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
                Artificial Intelligence Implementation Analysis
              </h2>
              <UseCaseMatchesV2 matches={combinedResults} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyAnalyzer;
