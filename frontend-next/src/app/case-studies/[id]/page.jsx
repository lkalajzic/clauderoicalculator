'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCaseApi } from '../../../services/api';
import RenaissanceBackground from '../../../components/RenaissanceBackground';
import ClaudeLoader from '../../../components/ClaudeLoader';

const CaseStudyDetail = (props) => {
  // Safely unwrap params to get the ID
  const { id } = React.use(props.params);
  const router = useRouter();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch case study from API
    const fetchCaseStudy = async () => {
      try {
        setLoading(true);
        const caseStudyData = await useCaseApi.getCaseStudy(id);
        setCaseStudy(caseStudyData);
        setError(null);
      } catch (err) {
        console.error('Error fetching case study:', err);
        setError('Failed to load case study. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCaseStudy();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coral-50/20 via-white to-orange-50/20 relative">
        <RenaissanceBackground />
        <div className="max-w-5xl mx-auto p-8 pt-32 relative z-10">
          <ClaudeLoader message="Loading case study..." />
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coral-50/20 via-white to-orange-50/20 relative">
        <RenaissanceBackground />
        <div className="max-w-5xl mx-auto p-8 pt-32 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-coral-100 shadow-lg p-8 relative">
            <div className="absolute -top-px -left-px w-8 h-8 border-t-2 border-l-2 border-coral-400/40"></div>
            <div className="absolute -top-px -right-px w-8 h-8 border-t-2 border-r-2 border-coral-400/40"></div>
            <div className="absolute -bottom-px -left-px w-8 h-8 border-b-2 border-l-2 border-coral-400/40"></div>
            <div className="absolute -bottom-px -right-px w-8 h-8 border-b-2 border-r-2 border-coral-400/40"></div>
            
            <div className="p-4 bg-red-50 text-red-600 rounded-md mb-6">
              {error || 'Case study not found'}
            </div>
            <Link href="/case-studies" className="text-coral-600 hover:text-coral-700 font-medium">
              &larr; Back to Case Studies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract data from the case study with safe defaults
  const companyName = caseStudy?.companyName || 'Unknown Company';
  const industry = caseStudy?.industry || 'Unknown';
  const companySize = caseStudy?.companySize || '';
  const region = caseStudy?.region || '';
  const implementation = caseStudy?.implementation || {};
  const results = caseStudy?.results || { quantitativeMetrics: [], qualitativeBenefits: [] };
  const technicalDetails = caseStudy?.technicalDetails || {};
  const metadata = caseStudy?.metadata || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-coral-50/20 via-white to-orange-50/20 relative">
      <RenaissanceBackground />
      
      <div className="max-w-6xl mx-auto px-8 pt-32 pb-20 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm border border-coral-100 shadow-lg p-8 relative">
          {/* Corner decorations */}
          <div className="absolute -top-px -left-px w-12 h-12 border-t-2 border-l-2 border-coral-400/40"></div>
          <div className="absolute -top-px -right-px w-12 h-12 border-t-2 border-r-2 border-coral-400/40"></div>
          <div className="absolute -bottom-px -left-px w-12 h-12 border-b-2 border-l-2 border-coral-400/40"></div>
          <div className="absolute -bottom-px -right-px w-12 h-12 border-b-2 border-r-2 border-coral-400/40"></div>
          
          <Link href="/case-studies" className="text-coral-600 hover:text-coral-700 font-medium mb-6 inline-flex items-center text-sm uppercase tracking-wider">
            <span className="mr-2">←</span>
            Back to Case Studies
          </Link>
        
        <div className="border-b border-coral-100 pb-6 mb-8">
          <h1 className="text-5xl font-serif font-light text-gray-900 mb-4">{companyName}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="text-xs uppercase tracking-wider bg-coral-50 text-coral-700 px-4 py-2">
              {industry}
            </span>
            {companySize && (
              <span className="text-xs uppercase tracking-wider bg-gray-100 text-gray-700 px-4 py-2">
                {companySize}
              </span>
            )}
            {region && (
              <span className="text-xs uppercase tracking-wider bg-blue-50 text-blue-700 px-4 py-2">
                {region}
              </span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-6 pb-2 border-b border-coral-100">Implementation</h2>
              
              {implementation.useCase && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Use Case</h3>
                  <p className="text-gray-600">{implementation.useCase}</p>
                </div>
              )}
              
              {implementation.problem && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Problem</h3>
                  <p className="text-gray-600">{implementation.problem}</p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {implementation.model && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Claude Model</h4>
                      <p className="text-gray-600">{implementation.model}</p>
                    </div>
                  )}
                  
                  {implementation.integrationMethod && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Integration Method</h4>
                      <p className="text-gray-600">{implementation.integrationMethod}</p>
                    </div>
                  )}
                  
                  {implementation.implementationTime && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Implementation Time</h4>
                      <p className="text-gray-600">{implementation.implementationTime}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-6 pb-2 border-b border-coral-100">Technical Details</h2>
              
              <div className="space-y-4">
                {technicalDetails?.architecture && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Architecture</h3>
                    <p className="text-gray-600">{technicalDetails.architecture}</p>
                  </div>
                )}
                
                {technicalDetails?.scale && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Scale</h3>
                    <p className="text-gray-600">{technicalDetails.scale}</p>
                  </div>
                )}
                
                {technicalDetails?.promptEngineering && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Prompt Engineering</h3>
                    <p className="text-gray-600">{technicalDetails.promptEngineering}</p>
                  </div>
                )}
                
                {technicalDetails?.challenges && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Challenges</h3>
                    <p className="text-gray-600">{technicalDetails.challenges}</p>
                  </div>
                )}
                
                {technicalDetails?.solutions && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Solutions</h3>
                    <p className="text-gray-600">{technicalDetails.solutions}</p>
                  </div>
                )}
                
                {implementation?.timeline && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Timeline</h3>
                    <p className="text-gray-600">{implementation.timeline}</p>
                  </div>
                )}
                
                {implementation?.cost && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Implementation Cost</h3>
                    <p className="text-gray-600">{implementation.cost}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
          
          <div>
            <section className="bg-gradient-to-r from-coral-50 to-orange-50 p-6 border border-coral-100 mb-6">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-6">Outcomes</h2>
              
              {results.quantitativeMetrics && results.quantitativeMetrics.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Key Metrics</h3>
                  <ul className="space-y-3">
                    {results.quantitativeMetrics.map((metric, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-coral-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-gray-600">
                            <span className="font-medium">{metric.value}</span> {metric.metric}
                          </p>
                          {metric.sourceText && (
                            <p className="text-xs text-gray-500 mt-1 italic">"{metric.sourceText}"</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {results.qualitativeBenefits && results.qualitativeBenefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Key Benefits</h3>
                  <ul className="space-y-3">
                    {results.qualitativeBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-gray-600">
                            <span className="font-medium">{benefit.benefit}</span>
                            {benefit.detail && `: ${benefit.detail}`}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Business Functions Affected */}
              {caseStudy?.businessFunctions && caseStudy.businessFunctions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Business Functions</h3>
                  <div className="space-y-3">
                    {caseStudy.businessFunctions.map((func, idx) => {
                      // Handle both old schema (string) and new schema (object)
                      if (typeof func === 'string') {
                        return (
                          <span key={idx} className="inline-block text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full mr-2">
                            {func}
                          </span>
                        );
                      } else {
                        // New schema with more details
                        return (
                          <div key={idx} className={`p-3 rounded-lg ${func.isPrimary ? 'bg-coral-50 border border-coral-200' : 'bg-gray-50'}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className={`text-sm font-semibold ${func.isPrimary ? 'text-coral-700' : 'text-gray-700'}`}>
                                  {func.function || 'Unknown Function'}
                                  {func.isPrimary && <span className="ml-2 text-xs bg-coral-200 text-coral-800 px-2 py-0.5 rounded">Primary</span>}
                                </h4>
                                {func.description && (
                                  <p className="text-xs text-gray-600 mt-1">{func.description}</p>
                                )}
                                {func.useCaseTypes && func.useCaseTypes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {func.useCaseTypes.map((type, typeIdx) => (
                                      <span key={typeIdx} className="text-xs px-2 py-0.5 bg-white text-gray-600 rounded border border-gray-200">
                                        {type}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </section>
            
            {/* Additional Info */}
            {(implementation?.usageNotes || implementation?.businessImpact) && (
              <section className="bg-blue-50 p-6 border border-blue-100 mb-6">
                <h2 className="text-xl font-serif font-light text-gray-900 mb-4">Implementation Insights</h2>
                
                {implementation.usageNotes && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Usage Notes</h3>
                    <p className="text-sm text-gray-600">{implementation.usageNotes}</p>
                  </div>
                )}
                
                {implementation.businessImpact && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Business Impact</h3>
                    <p className="text-sm text-gray-600">{implementation.businessImpact}</p>
                  </div>
                )}
              </section>
            )}
            
            <div className="text-center">
              <a 
                href={metadata.source || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative px-12 py-4 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 transition-all duration-300 w-full inline-block"
              >
                <div className="absolute inset-0 border border-white/20"></div>
                <span className="relative z-10 text-white text-sm font-medium tracking-wider uppercase">
                  View on Anthropic's Website
                </span>
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;
