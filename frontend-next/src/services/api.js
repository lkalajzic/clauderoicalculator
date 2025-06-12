import axios from "axios";

// Base URL for API calls - using Flask backend directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "http://localhost:5001/api";

// Backend URL (used for direct API calls if needed)
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Company Analysis API
export const companyAnalysisApi = {
  // Analyze a company website
  analyzeWebsite: async (url) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-website`, {
        url,
      });
      return response.data;
    } catch (error) {
      console.error("Error analyzing website:", error);
      throw error;
    }
  },

  // Analyze a company description
  analyzeDescription: async (description) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/analyze-description`, {
        description,
      });
      return response.data;
    } catch (error) {
      console.error("Error analyzing description:", error);
      throw error;
    }
  },

  // Match use cases to a company analysis
  matchUseCases: async (analysis) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/match-use-cases`, {
        analysis,
      });
      return response.data;
    } catch (error) {
      console.error("Error matching use cases:", error);
      throw error;
    }
  },

  // Analyze and match in one call (new combined endpoint)
  analyzeAndMatch: async (description, correctedData = null) => {
    try {
      const payload = { description };
      if (correctedData) {
        payload.correctedData = correctedData;
      }
      const response = await axios.post(
        `${API_BASE_URL}/analyze-and-match`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error("Error in combined analysis:", error);
      throw error;
    }
  },
};

// Use Case Database API
export const useCaseApi = {
  // Get the full use case database
  getUseCases: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/use-case-database`);
      return response.data;
    } catch (error) {
      console.error("Error retrieving use cases:", error);
      throw error;
    }
  },

  // Get a specific case study
  getCaseStudy: async (id) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/case-studies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error retrieving case study ${id}:`, error);
      throw error;
    }
  },

  // Get list of all case studies
  getAllCaseStudies: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/case-studies`);
      return response.data;
    } catch (error) {
      console.error("Error retrieving case studies:", error);
      throw error;
    }
  },
};

// ROI Calculator API
export const roiCalculatorApi = {
  // Calculate ROI based on use case and parameters
  calculateRoi: async (useCase, parameters) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/calculate-roi`, {
        useCase,
        ...parameters,
      });
      return response.data;
    } catch (error) {
      console.error("Error calculating ROI:", error);
      throw error;
    }
  },
};

// Benchmarks API
export const benchmarksApi = {
  // Get benchmark data for ROI calculations
  getBenchmarks: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/benchmarks`);
      return response.data;
    } catch (error) {
      console.error("Error retrieving benchmarks:", error);
      throw error;
    }
  },
};
