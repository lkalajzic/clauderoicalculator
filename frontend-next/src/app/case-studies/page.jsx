'use client';

import React, { useState, useEffect } from 'react';
import { useCaseApi } from '../../services/api';
import Link from 'next/link';
import RenaissanceBackground from '../../components/RenaissanceBackground';
import ClaudeLoader from '../../components/ClaudeLoader';

const CaseStudiesExplorer = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch case studies from API
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const response = await useCaseApi.getAllCaseStudies();
        
        // The response should have case_studies array from all_120_case_studies.json
        const caseStudiesArray = response.case_studies || [];
        
        setCaseStudies(caseStudiesArray);
        setError(null);
      } catch (err) {
        console.error('Error fetching case studies:', err);
        setError('Failed to load case study database. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  // Remove filtering - show all cases
  const filteredCases = caseStudies;

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50/20 via-white to-orange-50/20 relative">
      <RenaissanceBackground />
      
      <div className="max-w-7xl mx-auto px-8 pt-32 pb-20 relative z-10">
        {/* Header with Renaissance styling */}
        <div className="text-center space-y-6 mb-16">
          <div className="relative inline-block">
            {/* Renaissance frame corners */}
            <div className="absolute -top-8 -left-12 w-12 h-12 opacity-40">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <path d="M 0 0 L 48 0 L 48 12 L 12 12 L 12 48 L 0 48 Z" fill="none" stroke="#dc7454" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute -top-8 -right-12 w-12 h-12 opacity-40">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <path d="M 48 0 L 0 0 L 0 12 L 36 12 L 36 48 L 48 48 Z" fill="none" stroke="#dc7454" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute -bottom-8 -left-12 w-12 h-12 opacity-40">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <path d="M 0 48 L 48 48 L 48 36 L 12 36 L 12 0 L 0 0 Z" fill="none" stroke="#dc7454" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute -bottom-8 -right-12 w-12 h-12 opacity-40">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <path d="M 48 48 L 0 48 L 0 36 L 36 36 L 36 0 L 48 0 Z" fill="none" stroke="#dc7454" strokeWidth="2" />
              </svg>
            </div>
            
            <h1 className="text-7xl font-light tracking-tight text-gray-900 font-serif">
              Case Study Library
            </h1>
          </div>
          
          {/* Decorative divider */}
          <div className="flex items-center justify-center space-x-6 my-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-coral-500/60 to-coral-500/40"></div>
            <svg width="48" height="48" viewBox="0 0 48 48" className="transform hover:rotate-180 transition-transform duration-700">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#dc7454" strokeWidth="1" opacity="0.6" />
              <circle cx="24" cy="24" r="15" fill="none" stroke="#dc7454" strokeWidth="0.8" opacity="0.8" />
              <circle cx="24" cy="24" r="10" fill="none" stroke="#dc7454" strokeWidth="1" />
              <g transform="translate(24,24)">
                <path d="M -8 0 L 8 0 M 0 -8 L 0 8" stroke="#dc7454" strokeWidth="0.5" />
                <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" stroke="#dc7454" strokeWidth="0.3" />
                <circle cx="0" cy="0" r="3" fill="#dc7454" opacity="0.3" />
              </g>
            </svg>
            <div className="h-px w-24 bg-gradient-to-l from-transparent via-coral-500/60 to-coral-500/40"></div>
          </div>
          
          <p className="text-xl text-gray-700 font-light leading-relaxed max-w-3xl mx-auto">
            Explore 124 real-world implementations of Claude AI across industries,
            with documented outcomes and measurable business impact
          </p>
        </div>
        
        
        {/* Loading state */}
        {loading && (
          <div className="py-16">
            <ClaudeLoader message="Loading case studies..." />
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 text-red-700 text-center">
            {error}
          </div>
        )}
        
        {/* Case studies grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((caseStudy) => (
              <Link 
                href={`/case-studies/${caseStudy.id}`} 
                key={caseStudy.id}
                className="block group"
              >
                <div className="bg-white/80 backdrop-blur-sm border border-coral-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full relative overflow-hidden">
                  {/* Corner decorations */}
                  <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-coral-400/40"></div>
                  <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-coral-400/40"></div>
                  <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-coral-400/40"></div>
                  <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-coral-400/40"></div>
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-serif font-light text-gray-900 mb-3 group-hover:text-coral-600 transition-colors">
                      {caseStudy.companyName}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 font-light leading-relaxed">
                      {caseStudy.implementation?.useCase || caseStudy.companyDescription || ''}
                    </p>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="text-xs uppercase tracking-wider bg-coral-50 text-coral-700 px-3 py-1">
                        {caseStudy.industry}
                      </span>
                      <span className="text-xs uppercase tracking-wider bg-gray-100 text-gray-700 px-3 py-1">
                        {caseStudy.companySize}
                      </span>
                    </div>
                    
                    {caseStudy.results?.quantitativeMetrics?.length > 0 && (
                      <div className="border-t border-coral-100 pt-4">
                        <h3 className="text-xs uppercase tracking-[0.2em] text-coral-700 mb-2">Key Outcomes</h3>
                        <ul className="space-y-1">
                          {caseStudy.results.quantitativeMetrics.slice(0, 2).map((metric, idx) => (
                            <li key={idx} className="text-sm text-gray-600 font-light flex items-start">
                              <span className="text-coral-500 mr-2">•</span>
                              <span>{metric.metric}: {metric.value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="mt-6 text-center">
                      <span className="inline-flex items-center text-sm font-light text-coral-600 group-hover:text-coral-700 transition-colors">
                        <span className="uppercase tracking-wider">View Details</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudiesExplorer;
