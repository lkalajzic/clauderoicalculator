"""
Company Analyzer

Uses Claude to analyze company websites and descriptions to identify industry,
size, challenges, and potential use cases for Claude API implementation.

Author: Luka
Date: February 25, 2025
"""

import anthropic
import requests
import json
import os
import time
import re
from bs4 import BeautifulSoup
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, Union


class CompanyAnalyzer:
    """
    Analyzes company websites and descriptions using Claude to extract valuable
    information for use case matching and ROI calculation.
    """
    
    def __init__(self, api_key=None):
        """
        Initialize the analyzer with API key and load templates
        """
        self.api_key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not self.api_key:
            raise ValueError("Anthropic API key is required. Set it in the environment or pass to the constructor.")
        
        # Initialize client with simpler configuration to avoid proxies issue
        try:
            # Try the older initialization method first
            self.client = anthropic.Anthropic(api_key=self.api_key)
        except TypeError:
            # If that fails, try the newer method
            print("Using alternate client initialization method...")
            self.client = anthropic.Client(api_key=self.api_key)
        
        self.templates_dir = os.path.join(os.path.dirname(__file__), "..", "data", "templates")
        
        # Ensure templates directory exists
        os.makedirs(self.templates_dir, exist_ok=True)
        
        # Create prompt templates if they don't exist yet
        self._ensure_prompt_templates()
    
    def _ensure_prompt_templates(self):
        """
        Create prompt templates if they don't exist
        """
        website_prompt_path = os.path.join(self.templates_dir, "company_website_prompt.txt")
        description_prompt_path = os.path.join(self.templates_dir, "company_description_prompt.txt")
        
        if not os.path.exists(website_prompt_path):
            with open(website_prompt_path, "w") as f:
                f.write(self._get_default_website_prompt())
        
        if not os.path.exists(description_prompt_path):
            with open(description_prompt_path, "w") as f:
                f.write(self._get_default_description_prompt())
    
    def _get_default_website_prompt(self) -> str:
        """
        Returns default prompt for analyzing company websites
        """
        return """# Company Website Analysis

You are an expert business analyst tasked with analyzing a company's website to extract information for potential AI implementation opportunities. Analyze the provided website content to identify key business characteristics.

## Instructions
Analyze the HTML content below and extract the following information:

1. Company Information:
   - Company name
   - Industry (be specific and use standardized categories)
   - Approximate company size (SMB, Mid-Market, Enterprise based on clues)
   - Geographic focus (global, regional, specific markets)
   - Founded year (if mentioned)

2. Business Focus:
   - Primary products or services
   - Target customer segments
   - Value proposition
   - Key differentiators

3. Technical Infrastructure Indicators:
   - Technologies mentioned
   - Digital maturity indicators
   - Current automation level
   - Integration capabilities mentioned

4. Business Challenges:
   - Pain points mentioned
   - Scaling challenges
   - Efficiency issues
   - Customer experience challenges
   - Market challenges

5. AI Implementation Opportunities:
   - Content generation needs
   - Customer service optimization
   - Data analysis requirements
   - Document processing volume
   - Research and information needs
   - Other potential Claude use cases

## Format Requirements
Return a JSON object with the structure below. Include confidence scores (1-5) for each section based on the information available. Provide "Not found" when information isn't available. Be factual and don't hallucinate information not present in the content.

```json
{
  "companyInfo": {
    "name": "Company name",
    "industry": {
      "primary": "Primary industry",
      "secondary": ["Additional sector 1", "Additional sector 2"],
      "confidence": 4
    },
    "size": {
      "category": "SMB/Mid-Market/Enterprise",
      "employeeEstimate": "Approximate number if mentioned",
      "signals": ["Signal 1", "Signal 2"],
      "confidence": 3
    },
    "geography": {
      "headquarters": "HQ location",
      "markets": ["Market 1", "Market 2"],
      "confidence": 4
    },
    "founded": "Year",
    "companyDescription": "Concise company description"
  },
  "businessFocus": {
    "products": ["Product 1", "Product 2"],
    "services": ["Service 1", "Service 2"],
    "targetCustomers": ["Customer segment 1", "Customer segment 2"],
    "valueProposition": "Core value proposition",
    "differentiators": ["Differentiator 1", "Differentiator 2"],
    "confidence": 4
  },
  "technicalProfile": {
    "technologies": ["Technology 1", "Technology 2"],
    "digitalMaturity": "Low/Medium/High",
    "automationLevel": "Low/Medium/High",
    "integrations": ["Integration 1", "Integration 2"],
    "confidence": 3
  },
  "businessChallenges": {
    "explicitChallenges": ["Challenge 1", "Challenge 2"],
    "impliedChallenges": ["Implied challenge 1", "Implied challenge 2"],
    "confidence": 3
  },
  "aiOpportunities": {
    "contentGeneration": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "customerService": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "dataAnalysis": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "documentProcessing": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "researchNeeds": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    }
  },
  "analysisMetadata": {
    "source": "Website URL",
    "contentQuality": "Assessment of how much useful information was available",
    "analysisDate": "Current date",
    "overallConfidence": 3
  }
}
```

Website URL: {url}
Content:
{content}
"""
    
    def _get_default_description_prompt(self) -> str:
        """
        Returns default prompt for analyzing company descriptions
        """
        return """# Company Description Analysis

You are an expert business analyst tasked with analyzing a company's description to extract information for potential AI implementation opportunities. Analyze the provided description to identify key business characteristics.

## Instructions
Analyze the text description below and extract the following information:

1. Company Information:
   - Company name
   - Industry (be specific and use standardized categories)
   - Approximate company size (SMB, Mid-Market, Enterprise based on clues)
   - Geographic focus (global, regional, specific markets)
   - Founded year (if mentioned)

2. Business Focus:
   - Primary products or services
   - Target customer segments
   - Value proposition
   - Key differentiators

3. Technical Infrastructure Indicators:
   - Technologies mentioned
   - Digital maturity indicators
   - Current automation level
   - Integration capabilities mentioned

4. Business Challenges:
   - Pain points mentioned
   - Scaling challenges
   - Efficiency issues
   - Customer experience challenges
   - Market challenges

5. AI Implementation Opportunities:
   - Content generation needs
   - Customer service optimization
   - Data analysis requirements
   - Document processing volume
   - Research and information needs
   - Other potential Claude use cases

## Format Requirements
Return a JSON object with the structure below. Include confidence scores (1-5) for each section based on the information available. Provide "Not found" when information isn't available. Be factual and don't hallucinate information not present in the description.

```json
{
  "companyInfo": {
    "name": "Company name",
    "industry": {
      "primary": "Primary industry",
      "secondary": ["Additional sector 1", "Additional sector 2"],
      "confidence": 4
    },
    "size": {
      "category": "SMB/Mid-Market/Enterprise",
      "employeeEstimate": "Approximate number if mentioned",
      "signals": ["Signal 1", "Signal 2"],
      "confidence": 3
    },
    "geography": {
      "headquarters": "HQ location",
      "markets": ["Market 1", "Market 2"],
      "confidence": 4
    },
    "founded": "Year",
    "companyDescription": "Concise company description"
  },
  "businessFocus": {
    "products": ["Product 1", "Product 2"],
    "services": ["Service 1", "Service 2"],
    "targetCustomers": ["Customer segment 1", "Customer segment 2"],
    "valueProposition": "Core value proposition",
    "differentiators": ["Differentiator 1", "Differentiator 2"],
    "confidence": 4
  },
  "technicalProfile": {
    "technologies": ["Technology 1", "Technology 2"],
    "digitalMaturity": "Low/Medium/High",
    "automationLevel": "Low/Medium/High",
    "integrations": ["Integration 1", "Integration 2"],
    "confidence": 3
  },
  "businessChallenges": {
    "explicitChallenges": ["Challenge 1", "Challenge 2"],
    "impliedChallenges": ["Implied challenge 1", "Implied challenge 2"],
    "confidence": 3
  },
  "aiOpportunities": {
    "contentGeneration": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "customerService": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "dataAnalysis": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "documentProcessing": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    },
    "researchNeeds": {
      "potential": "Low/Medium/High",
      "specificUses": ["Use 1", "Use 2"],
      "confidence": 3
    }
  },
  "analysisMetadata": {
    "source": "Company description",
    "contentQuality": "Assessment of how much useful information was available",
    "analysisDate": "Current date",
    "overallConfidence": 3
  }
}
```

Company Description:
{description}
"""
    
    def analyze_website(self, url: str) -> Dict[str, Any]:
        """
        Analyze a company website to extract business information
        """
        # Scrape the website content
        content = self._scrape_website(url)
        if not content:
            raise ValueError(f"Failed to retrieve content from {url}")
        
        # Load the prompt template
        prompt_path = os.path.join(self.templates_dir, "company_website_prompt.txt")
        with open(prompt_path, "r") as f:
            prompt_template = f.read()
        
        # Format the prompt with the website content
        prompt = prompt_template.format(url=url, content=content[:50000])  # Limit content to 50k chars
        
        # Process with Claude
        print(f"Analyzing website: {url}")
        try:
            # Try the newer API format first
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
        except AttributeError:
            # Fall back to older format if needed
            print("Using alternate message creation method...")
            response = self.client.completion(
                model="claude-3-5-haiku-20241022",
                max_tokens_to_sample=2000,
                prompt=f"\n\nHuman: {prompt}\n\nAssistant:"
            )
        
        # Extract completion result based on API version
        try:
            # For newer API
            result = response.content[0].text
            
            # Print token usage
            print(f"Token usage:")
            print(f"Input tokens: {response.usage.input_tokens}")
            print(f"Output tokens: {response.usage.output_tokens}")
            print(f"Total tokens: {response.usage.input_tokens + response.usage.output_tokens}")
            print(f"Estimated cost: ${(response.usage.input_tokens * 0.000003) + (response.usage.output_tokens * 0.000015):.4f}")
        except AttributeError:
            # For older API
            result = response.completion
            print("Token usage data not available in this API version")
        
        try:
            # Clean the result in case it has markdown code blocks
            cleaned_result = result.strip()
            
            # Find JSON block in the response
            if "```json" in cleaned_result:
                start_idx = cleaned_result.find("```json") + 7
                end_idx = cleaned_result.find("```", start_idx)
                if end_idx != -1:
                    cleaned_result = cleaned_result[start_idx:end_idx].strip()
            elif cleaned_result.startswith("```json"):
                cleaned_result = cleaned_result[7:]
                if cleaned_result.endswith("```"):
                    cleaned_result = cleaned_result[:-3]
            
            analysis = json.loads(cleaned_result.strip())
            return analysis
        except json.JSONDecodeError as e:
            print(f"Failed to parse analysis as JSON: {e}")
            print("Raw response:", result)
            raise
    
    def analyze_description(self, description: str) -> Dict[str, Any]:
        """
        Analyze a company description to extract business information
        """
        # Load the prompt template
        prompt_path = os.path.join(self.templates_dir, "company_description_prompt.txt")
        with open(prompt_path, "r") as f:
            prompt_template = f.read()
        
        # Format the prompt with the company description
        prompt = prompt_template.format(description=description)
        
        # Process with Claude
        print(f"Analyzing company description")
        try:
            # Try the newer API format first
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )
        except AttributeError:
            # Fall back to older format if needed
            print("Using alternate message creation method...")
            response = self.client.completion(
                model="claude-3-5-haiku-20241022",
                max_tokens_to_sample=2000,
                prompt=f"\n\nHuman: {prompt}\n\nAssistant:"
            )
        
        # Extract completion result based on API version
        try:
            # For newer API
            result = response.content[0].text
            
            # Print token usage
            print(f"Token usage:")
            print(f"Input tokens: {response.usage.input_tokens}")
            print(f"Output tokens: {response.usage.output_tokens}")
            print(f"Total tokens: {response.usage.input_tokens + response.usage.output_tokens}")
            print(f"Estimated cost: ${(response.usage.input_tokens * 0.000003) + (response.usage.output_tokens * 0.000015):.4f}")
        except AttributeError:
            # For older API
            result = response.completion
            print("Token usage data not available in this API version")
        
        try:
            # Clean the result in case it has markdown code blocks
            cleaned_result = result.strip()
            
            # Find JSON block in the response
            if "```json" in cleaned_result:
                start_idx = cleaned_result.find("```json") + 7
                end_idx = cleaned_result.find("```", start_idx)
                if end_idx != -1:
                    cleaned_result = cleaned_result[start_idx:end_idx].strip()
            elif cleaned_result.startswith("```json"):
                cleaned_result = cleaned_result[7:]
                if cleaned_result.endswith("```"):
                    cleaned_result = cleaned_result[:-3]
            
            analysis = json.loads(cleaned_result.strip())
            return analysis
        except json.JSONDecodeError as e:
            print(f"Failed to parse analysis as JSON: {e}")
            print("Raw response:", result[:500] + "...")
            raise
    
    def match_use_cases(self, company_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """
        Match company analysis to potential Claude use cases with confidence scores
        and provide role-specific recommendations based on case studies.
        """
        # Load enhanced case studies with business functions
        enhanced_path = os.path.join(os.path.dirname(__file__), "..", "data", "case_studies", "all_120_case_studies.json")
        try:
            with open(enhanced_path, "r") as f:
                case_studies_with_functions = json.load(f)
            print(f"Loaded {len(case_studies_with_functions)} enhanced case studies")
        except Exception as e:
            print(f"Error loading enhanced case studies: {e}")
            case_studies_with_functions = []
        
        # Define standardized business functions based on practical company organization
        standardized_functions = [
            "Executive/Leadership",  # C-suite, VPs, Directors
            "Sales & Marketing",     # Sales, Marketing, Customer Success, BD
            "Product & Engineering", # Product Management, Software Development, QA
            "Operations",           # Operations, Supply Chain, Procurement, Facilities
            "Finance & Accounting", # Finance, Accounting, FP&A, Treasury
            "Human Resources",      # HR, Recruiting, L&D, Compensation
            "Legal & Compliance",   # Legal, Compliance, Risk, IP
            "Customer Support",     # Support, Success, Implementation
            "Research & Development", # R&D, Innovation, Strategy
            "Information Technology" # IT, Security, Infrastructure, Data
        ]
        
        # Create a matching prompt with evidence-based approach
        matching_prompt = f"""
        You are an AI implementation expert tasked with recommending Claude AI use cases based on real-world evidence.
        
        ## Company Analysis
        ```json
        {json.dumps(company_analysis, indent=2)}
        ```
        
        ## Available Case Studies with Business Functions
        ```json
        {json.dumps(case_studies_with_functions, indent=2)}
        ```
        
        ## Standardized Business Functions
        Use ONLY these business functions (with their typical roles):
        - Executive/Leadership: C-suite, VPs, Directors
        - Sales: Sales teams, Account Executives, Business Development, Sales Operations
        - Marketing: Marketing teams, Content, Brand, Demand Gen, Growth, Customer Marketing
        - Product & Engineering: Product Management, Software Development, QA, DevOps, Data Science, IT, Security
        - Operations: Operations, Supply Chain, Procurement, Facilities, Business Operations
        - Finance & Accounting: Finance, Accounting, FP&A, Treasury, Financial Planning
        - Human Resources: HR, Recruiting, L&D, Compensation, People Operations
        - Legal & Compliance: Legal, Compliance, Risk, IP, Regulatory
        - Customer Support: Support, Customer Success, Implementation, Technical Support
        
        ## Your Task
        Based on the company analysis, recommend ALL relevant business functions and provide evidence-based examples from real companies.
        
        IMPORTANT: Each example MUST be specific and metric-focused:
        - Include SPECIFIC percentages or time savings (e.g. "40% reduction in ticket response time")
        - Mention the SPECIFIC task or process improved (e.g. "automated tier-1 support tickets")
        - Use action verbs (reduced, saved, automated, accelerated, etc.)
        
        CRITICAL INFORMATION FROM COMPANY ANALYSIS:
        Company location: """ + str(company_analysis.get('companyInfo', {}).get('geography', {}).get('headquarters', 'Unknown')) + """
        Total employees: """ + str(company_analysis.get('employeeRoles', {}).get('totalEmployees', {}).get('count', 0)) + """
        
        DEBUG - Geography info: """ + str(company_analysis.get('companyInfo', {}).get('geography', {})) + """
        
        ROLE DISTRIBUTION:
        """ + "\n        ".join([f"- {r['role']}: {r['count']} employees" for r in company_analysis.get('employeeRoles', {}).get('roleDistribution', [])]) + """
        
        IMPORTANT INSTRUCTIONS:
        1. Map the company's employee roles to the standardized business functions above
        2. YOU MUST include ALL 9 business functions for every company (Executive/Leadership, Sales, Marketing, Product & Engineering, Operations, Finance & Accounting, Human Resources, Legal & Compliance, Customer Support).
           Even if a function has low relevance or few employees, STILL INCLUDE IT with a lower relevance score.
           Sort by relevance score (high to low).
        
        3. For each business function:
           - Calculate relevance score (0-100) based on how many employees would benefit
           - Explain why this function is relevant to their specific situation
           - List 2-3 specific USE CASES within this function (aim for 3 use cases per function, sorted by impact)
           - For each use case, estimate hours/week spent on that specific task
           - Include implementation complexity and prerequisites
        
        4. For each USE CASE, provide:
           - Specific task name and description
           - Hours per week employees typically spend on this task
           - Expected time savings percentage
           - Implementation complexity (Low/Medium/High) and estimated weeks
           - Prerequisites required
           - 2 real company examples with metrics
        
        5. CRITICAL: Map roles correctly. For example:
           - "Customer Service Representatives" → Customer Support
           - "Software Engineers/Developers" → Product & Engineering
           - "Sales Team/Account Executives" → Sales
           - "Marketing Team/Content Creators" → Marketing
           - "HR/People Ops" → Human Resources
           - "CFO/Finance Team" → Finance & Accounting
           - "IT/DevOps/Security" → Product & Engineering
           - "Data Scientists/Analysts" → Product & Engineering
        
        Return ONLY a JSON object with this structure. Do not ask questions or provide explanations. Output ONLY valid JSON.
        
        CRITICAL: Your response MUST contain exactly 9 businessFunctions objects, one for each of these:
        - Executive/Leadership
        - Sales
        - Marketing
        - Product & Engineering
        - Operations
        - Finance & Accounting
        - Human Resources
        - Legal & Compliance
        - Customer Support
        
        Example structure (you must include ALL 9, not just this one):
        {{
          "businessFunctions": [
            {{
              "id": "customer_support",
              "name": "Customer Support",
              "totalEmployees": 150,
              "relevanceScore": 95,
              "whyRelevant": "You have 150 customer service reps handling high inquiry volume who could benefit from AI automation",
              "useCases": [
                {{
                  "id": "ai_support_agent",
                  "name": "AI Support Agent",
                  "description": "Automated first-line support for common customer queries",
                  "hoursPerWeek": 10,
                  "timeSavingsPercent": 25,
                  "impact": "High",
                  "complexity": "Medium",
                  "complexityWeeks": 8,
                  "prerequisites": ["API access", "Ticket system integration", "Historical ticket data"],
                  "readinessStatus": "requires_setup",
                  "examples": [
                    // MUST be real companies from the case studies list
                    // NO FAKE COMPANIES
                  ]
                }},
                {{
                  "id": "response_drafting",
                  "name": "Customer Response Drafting",
                  "description": "AI-assisted drafting of customer emails and chat responses",
                  "hoursPerWeek": 8,
                  "timeSavingsPercent": 30,
                  "impact": "High",
                  "complexity": "Low",
                  "complexityWeeks": 1,
                  "prerequisites": [],
                  "readinessStatus": "ready",
                  "examples": [
                    // MUST be real companies from the case studies list
                    // NO FAKE COMPANIES
                  ]
                }},
                {{
                  "id": "knowledge_base",
                  "name": "Knowledge Base Creation",
                  "description": "Generate and maintain customer-facing documentation",
                  "hoursPerWeek": 3,
                  "timeSavingsPercent": 25,
                  "impact": "Medium",
                  "complexity": "Low", 
                  "complexityWeeks": 2,
                  "prerequisites": ["Access to product documentation"],
                  "readinessStatus": "ready",
                  "examples": [
                    // MUST be real companies from the case studies list
                    // NO FAKE COMPANIES
                  ]
                }}
              ],
              "targetRoles": [
                {{
                  "role": "Customer Service/Support",
                  "employeeCount": 150,
                  "hourlyRate": 20,
                  "adjustedHourlyRate": 6,
                  "rateAdjustmentReason": "Eastern Europe (Croatia) - 0.3x US baseline"
                }}
              ],
              "totalApplicableHours": 30,
              "totalApplicablePercent": 75,
              "secondOrderBenefits": [
                {{
                  "benefit": "Improved Customer Satisfaction",
                  "description": "Faster, more consistent responses lead to happier customers"
                }},
                {{
                  "benefit": "Employee Retention", 
                  "description": "Less repetitive work reduces burnout"
                }}
              ]
            }}
          ]
        }}
        
        MANDATORY: You MUST return ALL 9 business functions in your response:
        1. Executive/Leadership
        2. Sales  
        3. Marketing
        4. Product & Engineering
        5. Operations
        6. Finance & Accounting
        7. Human Resources
        8. Legal & Compliance
        9. Customer Support
        
        Sort business functions by relevanceScore (highest first).
        Include ALL functions even if relevance score is low (show score as 10-30 for less relevant functions).
        For each use case, calculate quickWinScore = (hoursPerWeek * timeSavingsPercent * hourlyRate * employeeCount) / complexityWeeks
        Sort use cases within each function by quickWinScore (highest first).
        
        Common use cases by function:
        - Customer Support: AI agent, response drafting, knowledge base, ticket routing, sentiment analysis
        - Product & Engineering: Code generation, PR reviews, documentation, debugging, testing, infrastructure automation, security scanning, data pipeline creation
        - Sales: Lead research, email drafting, proposal generation, deal analysis, CRM automation
        - Marketing: Content creation, campaign copy, social media, SEO optimization, competitive analysis
        - Operations: Process documentation, data analysis, report generation, workflow automation
        - Finance & Accounting: Financial analysis, reporting automation, budget forecasting, invoice processing
        - Human Resources: Candidate screening, onboarding materials, policy Q&A, performance reviews
        - Legal & Compliance: Contract review, compliance monitoring, policy updates, risk assessment
        - Executive/Leadership: Strategic analysis, decision support, performance dashboards, meeting summaries
        
        Ensure examples come from the actual case studies provided.
        Match case study businessFunctions to our standardized list.
        Be realistic with hours/week estimates - not all work can be enhanced by AI.
        
        CRITICAL EMPLOYEE ALLOCATION RULES:
        - NOT all employees in a function use every use case
        - For each use case, estimate what PERCENTAGE of that function's employees would actually use it
        - Example: If you have 200 engineers, maybe only 150 write code (code generation use case), only 50 write documentation (documentation use case)
        - Be realistic: no use case should have 100% of employees unless truly universal
        
        MANDATORY GEOGRAPHIC ADJUSTMENT:
        The company is based in: """ + str(company_analysis.get('companyInfo', {}).get('geography', {}).get('headquarters', 'Unknown')) + """
        
        You MUST adjust hourly rates based on location:
        - United States/Canada: 1.0x (baseline)
        - Western Europe (UK, Germany, France): 0.9x for support, 0.8x for engineering
        - Eastern Europe (Poland, Romania, Croatia): 0.3x for support, 0.25x for engineering  
        - Latin America (Brazil, Mexico): 0.35x for support, 0.3x for engineering
        - India/Philippines: 0.15x for support, 0.2x for engineering
        - Asia Pacific (Australia, Singapore): 1.0x
        - Other regions: estimate based on local cost of living
        
        For India-based company:
        - Customer Support: $20/hr × 0.15 = $3/hr
        - Software Engineer: $60/hr × 0.2 = $12/hr
        - Sales: $50/hr × 0.2 = $10/hr
        - Marketing: $40/hr × 0.2 = $8/hr
        
        Include the adjusted hourly rates in your response for transparency.
        
        FINAL CHECKLIST (YOUR RESPONSE MUST HAVE):
        ✓ Exactly 9 businessFunctions objects
        ✓ Each function has exactly 4 use cases
        ✓ Each use case has exactly 3 examples
        ✓ Total: 9 functions × 4 use cases × 3 examples = 108 examples
        ✓ Geography-adjusted hourly rates (especially for India = 0.15-0.2x US rates)
        ✓ Realistic employee allocation per use case (not 100% for everything)
        
        CRITICAL: Even if a function has 0 employees, STILL INCLUDE IT with relevanceScore of 10-20.
        
        Your response MUST start with:
        {
          "businessFunctions": [
            ... all 9 functions here ...
          ]
        }
        """
        
        # Process with Claude
        print(f"Matching company profile to use cases")
        try:
            # Try the newer API format first
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=8192,  # Increased for Sonnet's richer output
                system="You are a JSON-only response bot. You must ONLY output valid JSON with no additional text, markdown, or explanations.",
                messages=[{"role": "user", "content": matching_prompt}]
            )
        except AttributeError:
            # Fall back to older format if needed
            print("Using alternate message creation method...")
            response = self.client.completion(
                model="claude-3-5-haiku-20241022",
                max_tokens_to_sample=4000,  # Increased max tokens
                prompt=f"\n\nHuman: {matching_prompt}\n\nAssistant:"
            )
        
        # Extract completion result based on API version
        try:
            # For newer API
            result = response.content[0].text
            
            # Print token usage
            print(f"Token usage:")
            print(f"Input tokens: {response.usage.input_tokens}")
            print(f"Output tokens: {response.usage.output_tokens}")
            print(f"Total tokens: {response.usage.input_tokens + response.usage.output_tokens}")
            print(f"Estimated cost: ${(response.usage.input_tokens * 0.000003) + (response.usage.output_tokens * 0.000015):.4f}")
        except AttributeError:
            # For older API
            result = response.completion
            print("Token usage data not available in this API version")
        
        try:
            # Clean the result in case it has markdown code blocks
            cleaned_result = result.strip()
            
            # Enhanced JSON parsing logic to handle various formats
            if cleaned_result.startswith("```json"):
                # Find the start and end of the JSON block
                start_idx = cleaned_result.find("```json")
                if start_idx != -1:
                    start_idx += 7  # Length of "```json"
                    end_idx = cleaned_result.find("```", start_idx)
                    if end_idx != -1:
                        cleaned_result = cleaned_result[start_idx:end_idx].strip()
            elif cleaned_result.startswith("```"):
                # Handle case where json keyword might be missing
                start_idx = cleaned_result.find("```")
                if start_idx != -1:
                    start_idx += 3  # Length of "```"
                    end_idx = cleaned_result.find("```", start_idx)
                    if end_idx != -1:
                        cleaned_result = cleaned_result[start_idx:end_idx].strip()

            # Attempt to find a valid JSON object even in messy text
            start_brace = cleaned_result.find("{")
            if start_brace != -1:
                # Find matching closing brace by counting opening and closing braces
                open_count = 0
                close_brace = -1
                for i in range(start_brace, len(cleaned_result)):
                    if cleaned_result[i] == "{":
                        open_count += 1
                    elif cleaned_result[i] == "}":
                        open_count -= 1
                        if open_count == 0:
                            close_brace = i
                            break
                
                if close_brace != -1:
                    cleaned_result = cleaned_result[start_brace:close_brace+1]
            
            print("Attempting to parse JSON:", cleaned_result[:100] + "...")
            
            # Try to parse the JSON
            matches = json.loads(cleaned_result)
            
            # Debug logging
            if "businessFunctions" in matches:
                print(f"✅ Received {len(matches.get('businessFunctions', []))} business functions")
                for func in matches.get('businessFunctions', []):
                    print(f"  - {func.get('name')}: {func.get('totalEmployees', 0)} employees, {len(func.get('useCases', []))} use cases")
            
            # Handle both old useCases format and new businessFunctions format
            if "businessFunctions" in matches:
                # New evidence-based format - add category mapping for backward compatibility
                role_to_category_mapping = {
                    "Engineering/Development": "coding",
                    "Software Engineer": "coding",
                    "Developer": "coding",
                    "Customer Service": "customer_service",
                    "Support": "customer_service",
                    "Marketing": "content_creation",
                    "Content": "content_creation",
                    "Sales": "productivity",
                    "Legal": "document_qa",
                    "Compliance": "document_qa",
                    "Research": "document_qa",
                    "Data Analysis": "document_qa",
                    "Operations": "productivity",
                    "Administration": "productivity",
                    "Executive": "productivity",
                    "Management": "productivity"
                }
                
                # Default hourly rates for ROI calculation (US baseline)
                # Based on 2024/2025 market data
                # Aligned with our 9 standardized business functions
                hourly_rates = {
                    "Executive/Leadership": 100,      # ~$200k/year = $100/hr
                    "Sales": 50,                      # ~$100k/year = $50/hr
                    "Marketing": 40,                  # ~$80k/year = $40/hr
                    "Product & Engineering": 60,      # ~$120k/year = $60/hr (includes IT/DevOps)
                    "Operations": 30,                 # ~$60k/year = $30/hr
                    "Finance & Accounting": 55,       # ~$110k/year = $55/hr
                    "Human Resources": 35,            # ~$70k/year = $35/hr
                    "Legal & Compliance": 75,         # ~$150k/year = $75/hr
                    "Customer Support": 20,           # $17-22/hr US average
                    "Other": 35                       # Generic professional fallback
                }
                
                for business_function in matches["businessFunctions"]:
                    # Calculate ROI for each use case if not provided
                    if "useCases" in business_function:
                        total_employees = business_function.get("totalEmployees", 0)
                        
                        # Get hourly rate for this function's roles
                        hourly_rate = 35  # default
                        if "targetRoles" in business_function and len(business_function["targetRoles"]) > 0:
                            first_role = business_function["targetRoles"][0]
                            
                            # Use adjusted rate if provided by Claude
                            if "adjustedHourlyRate" in first_role:
                                hourly_rate = first_role["adjustedHourlyRate"]
                            else:
                                # Fall back to default rates
                                role_name = first_role.get("role", "Other")
                                for rate_key, rate_value in hourly_rates.items():
                                    if rate_key.lower() in role_name.lower():
                                        hourly_rate = rate_value
                                        break
                        
                        total_applicable_hours = 0
                        for use_case in business_function["useCases"]:
                            hours_per_week = use_case.get("hoursPerWeek", 0)
                            time_savings_percent = use_case.get("timeSavingsPercent", 0) / 100
                            complexity_weeks = use_case.get("complexityWeeks", 1)
                            
                            # Calculate annual ROI for this use case
                            annual_hours_saved = hours_per_week * time_savings_percent * 50  # 50 weeks/year
                            annual_roi = annual_hours_saved * hourly_rate * total_employees
                            use_case["annualROI"] = int(annual_roi)
                            
                            # Calculate quick win score
                            if complexity_weeks > 0:
                                use_case["quickWinScore"] = int(annual_roi / (complexity_weeks * 1000))  # Divide by 1000 for readability
                            else:
                                use_case["quickWinScore"] = 0
                            
                            total_applicable_hours += hours_per_week
                        
                        # Sort use cases by quickWinScore
                        business_function["useCases"] = sorted(
                            business_function["useCases"],
                            key=lambda x: x.get("quickWinScore", 0),
                            reverse=True
                        )
                        
                        # Calculate total applicable percentage
                        if business_function.get("totalApplicableHours") is None:
                            business_function["totalApplicableHours"] = total_applicable_hours
                        if business_function.get("totalApplicablePercent") is None and total_applicable_hours > 0:
                            business_function["totalApplicablePercent"] = int((total_applicable_hours / 40) * 100)
                    
                    # Add category mapping for backward compatibility
                    if "targetRoles" in business_function:
                        for role_info in business_function["targetRoles"]:
                            role_name = role_info["role"]
                            # Find matching category
                            category = None
                            for key, value in role_to_category_mapping.items():
                                if key.lower() in role_name.lower():
                                    category = value
                                    break
                            role_info["category"] = category or "productivity"
            elif "useCases" in matches:
                # Old format - keep for backward compatibility
                role_to_category_mapping = {
                    "Engineering/Development": "coding",
                    "Software Engineer": "coding",
                    "Developer": "coding",
                    "Customer Service": "customer_service",
                    "Support": "customer_service",
                    "Marketing": "content_creation",
                    "Content": "content_creation",
                    "Sales": "productivity",
                    "Legal": "document_qa",
                    "Compliance": "document_qa",
                    "Research": "document_qa",
                    "Data Analysis": "document_qa",
                    "Operations": "productivity",
                    "Administration": "productivity",
                    "Executive": "productivity",
                    "Management": "productivity"
                }
                
                for use_case in matches["useCases"]:
                    if "targetRoles" in use_case:
                        for role_info in use_case["targetRoles"]:
                            role_name = role_info["role"]
                            # Find matching category
                            category = None
                            for key, value in role_to_category_mapping.items():
                                if key.lower() in role_name.lower():
                                    category = value
                                    break
                            role_info["category"] = category or "productivity"
            
            return matches
        
        except json.JSONDecodeError as e:
            print(f"Failed to parse matches as JSON: {e}")
            print("Raw response (first 500 chars):", result[:500] if 'result' in locals() else "No result")
            
            # Return a basic error response
            return {
                "error": "Failed to parse Claude response",
                "details": str(e)
            }
        except Exception as e:
            print(f"Error in match_use_cases: {e}")
            raise
    
    def analyze_and_match_combined(self, description: str, corrected_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        ONE METHOD that does EVERYTHING - Extract company info AND match use cases in a single Claude call
        Can optionally accept corrected_data from user review
        """
        # Standardized industries (GICS-based)
        STANDARDIZED_INDUSTRIES = [
            "Information Technology",
            "Health Care", 
            "Financials",
            "Consumer Discretionary",
            "Communication Services",
            "Industrials",
            "Consumer Staples",
            "Energy",
            "Utilities",
            "Real Estate",
            "Materials"
        ]
        
        # Explicit role mappings for compound roles
        ROLE_MAPPINGS = {
            "product managers and designers": "Product & Engineering",
            "data analysts and business intelligence team": "Product & Engineering",
            "customer success and support representatives": "Customer Support",
            "hr and recruiting staff": "Human Resources",
            "finance and accounting team": "Finance & Accounting",
            "legal and compliance officers": "Legal & Compliance",
            "executives and senior leadership": "Executive/Leadership",
            "other operations and administrative staff": "Operations",
        }
        
        # Load case studies for examples
        enhanced_path = os.path.join(os.path.dirname(__file__), "..", "data", "case_studies", "all_120_case_studies.json")
        try:
            with open(enhanced_path, "r") as f:
                case_studies = json.load(f)
            print(f"Loaded {len(case_studies)} case studies for examples")
        except FileNotFoundError:
            print(f"Warning: Case studies file not found at {enhanced_path}")
            print("Continuing without case study examples...")
            case_studies = []
        except json.JSONDecodeError as e:
            print(f"Error parsing case studies JSON: {e}")
            case_studies = []
        except Exception as e:
            print(f"Unexpected error loading case studies: {e}")
            case_studies = []
        
        # Create the mega prompt
        if corrected_data:
            # User has reviewed and corrected the data
            # Ensure corrected_data is a dict
            if not isinstance(corrected_data, dict):
                raise ValueError("corrected_data must be a dictionary")
            
            # Safely extract company info
            company_info = corrected_data.get('companyInfo', {}) if isinstance(corrected_data, dict) else {}
            company_name = company_info.get('name', 'Not specified') if isinstance(company_info, dict) else 'Not specified'
            industry = company_info.get('industry', 'Not specified') if isinstance(company_info, dict) else 'Not specified'
            total_employees = company_info.get('totalEmployees', 0) if isinstance(company_info, dict) else 0
            headquarters = company_info.get('headquarters', 'Not specified') if isinstance(company_info, dict) else 'Not specified'
            
            combined_prompt = f"""
        Analyze this company and provide a complete AI implementation roadmap.
        
        IMPORTANT: The user has reviewed and corrected the company data. You MUST use the correctedData values provided below, NOT the original description.
        The original description is provided for context only.
        
        ORIGINAL COMPANY DESCRIPTION (for context):
        {description}
        
        USER-VERIFIED DATA (USE THIS):
        {json.dumps(corrected_data, indent=2)}
        
        INSTRUCTIONS:
        
        1. USE THE CORRECTED DATA:
        - Company name: {company_name}
        - Industry: {industry} 
        - Total employees: {total_employees}
        - Headquarters: {headquarters}
        - Employee counts per function: USE THE PROVIDED businessFunctions data
        - Salaries: USE THE adjustedSalaryUSD values provided
        
        2. FOR EACH OF THE 9 BUSINESS FUNCTIONS:
        Use the employee counts and salaries from correctedData.businessFunctions.
        The user has already verified these numbers - DO NOT CHANGE THEM.
        
        3. FOR EACH FUNCTION, provide exactly 3 use cases with:
        - Name and description  
        - employeesUsing: realistic subset of that function's employees
        - hoursPerWeek: realistic hours spent on this task
        - timeSavingsPercent: 20-60% (be realistic)
        - complexity: Low/Medium/High
        - 3 real examples with metrics (MUST have exactly 3 examples per use case)
        
        OUTPUT FORMAT (MUST be valid JSON):
        {{
          "companyInfo": {{
            // Use values from correctedData.companyInfo
          }},
          "businessFunctions": [
            // Use the 9 functions from correctedData.businessFunctions
            // Add use cases to each function
          ]
        }}
        """
        else:
            # First-time analysis
            combined_prompt = f"""
        Analyze this company and provide a complete AI implementation roadmap in ONE response.
        
        COMPANY DESCRIPTION:
        {description}
        
        INSTRUCTIONS:
        
        1. EXTRACT COMPANY INFO:
        - Industry: MUST be one of these: {', '.join(STANDARDIZED_INDUSTRIES)}
        - Total employees: Extract the exact number stated
        - Headquarters: Location if mentioned (e.g., "India", "US", etc.)
        - Key challenges: List the main pain points mentioned
        
        2. MAP ALL EMPLOYEES TO EXACTLY THESE 9 FUNCTIONS:
        - Executive/Leadership
        - Sales
        - Marketing
        - Product & Engineering
        - Operations
        - Finance & Accounting
        - Human Resources
        - Legal & Compliance
        - Customer Support
        
        CRITICAL MAPPING RULES:
        - "software engineers" (200) → Product & Engineering
        - "product managers and designers" (50) → Product & Engineering
        - "data analysts and business intelligence team" (40) → Product & Engineering
        - "customer success and support representatives" (180) → Customer Support
        - "sales representatives" (120) → Sales
        - "marketing professionals" (80) → Marketing
        - "HR and recruiting staff" (30) → Human Resources
        - "finance and accounting team" (25) → Finance & Accounting
        - "legal and compliance officers" (20) → Legal & Compliance
        - "executives and senior leadership" (15) → Executive/Leadership
        - "other operations and administrative staff" (90) → Operations
        - ALL employees must be mapped, sum MUST equal total
        
        3. CALCULATE SALARY ADJUSTMENTS:
        Based on the headquarters location and industry, intelligently determine appropriate salary levels.
        Consider:
        - Cost of living in that specific region
        - Average salary levels for THIS SPECIFIC INDUSTRY in that region
        - Local purchasing power parity
        - Economic development level
        
        For example:
        - Software engineers in Bangalore, India (IT industry) might earn $24,000/year (0.2x US)
        - But doctors in Bangalore (Healthcare) might earn $40,000/year (0.3x US)
        - Manufacturing workers in Poland earn differently than tech workers in Poland
        
        BE SPECIFIC to both location AND industry when setting avgSalaryUSD.
        
        4. FOR EACH OF THE 9 FUNCTIONS (even if 0 employees):
        Provide exactly 3 use cases with:
        - Name and description
        - employeesUsing: ACTUAL NUMBER (not percentage!) of employees who would use this
        - hoursPerWeek: CONSERVATIVE hours spent on this task (typically 2-10 hours, rarely over 15)
        - timeSavingsPercent: CONSERVATIVE 15-40% (be realistic - most tasks see 20-30% improvement)
        - complexity: Low/Medium/High
        - For examples: YOU MUST ONLY USE COMPANIES FROM THE CASE STUDIES LIST PROVIDED AT THE BOTTOM
        
        CRITICAL: DO NOT MAKE UP COMPANY NAMES. DO NOT USE: GitHub, Replit, AppZen, Workiva, MindBridge, Kira Systems, Luminance, etc.
        ONLY USE REAL COMPANIES FROM THE CASE STUDIES LIST AT THE BOTTOM OF THIS PROMPT
        
        OUTPUT FORMAT:
        Return a JSON object with:
        - companyInfo: name, industry (from standard list), totalEmployees, headquarters, keyChallenges array
        - businessFunctions: array of ALL 9 functions, each with:
          - id, name, employeeCount, avgSalaryUSD, relevanceScore
          - useCases: array of 3 use cases, each with:
            - id, name, description, employeesUsing (number), hoursPerWeek, timeSavingsPercent, complexity
            - examples: array with company, metric, and caseStudyId
            
        For examples, ONLY use companies from the case studies list below.
        Each example must have: company (exact name from list), metric (from their data), caseStudyId (their id)
        
        HERE ARE THE ONLY COMPANIES YOU CAN USE:
        {', '.join([cs.get("companyName", cs.get("company", "")) for cs in case_studies])}
        
        FULL CASE STUDY DATA:
        {json.dumps([{
            "id": cs.get("id", ""),
            "company": cs.get("companyName", cs.get("company", "")),
            "businessFunctions": cs.get("businessFunctions", []),
            "metrics": cs.get("results", {}).get("quantitativeMetrics", [])
        } for cs in case_studies], indent=2)}
        
        ABSOLUTE REQUIREMENTS FOR EXAMPLES:
        1. ONLY use company names from the list above (e.g., TRY, Block, JetBrains, etc.)
        2. ONLY use metrics from those specific companies
        3. Use the correct caseStudyId (the "id" field from above)
        4. NEVER make up companies like GitHub, Replit, PayPal, Stripe, etc. unless they're in the list
        5. NEVER use generic descriptions like "Leading company" or "Major retailer"
        6. If you can't find 3 relevant examples for a use case, use fewer examples rather than making them up
        
        RETURN ONLY VALID JSON. Include ALL 9 business functions.
        """
        
        # Make the API call
        print("Making combined analysis request...")
        try:
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=8192,  # Sonnet 4 can handle more complex output
                system="You are a JSON-only response bot. Return ONLY valid JSON with no explanation.",
                messages=[{"role": "user", "content": combined_prompt}]
            )
            
            result = response.content[0].text
            
            # Clean the result in case it has markdown code blocks
            cleaned_result = result.strip()
            
            # Find JSON block in the response
            if "```json" in cleaned_result:
                start_idx = cleaned_result.find("```json") + 7
                end_idx = cleaned_result.find("```", start_idx)
                if end_idx != -1:
                    cleaned_result = cleaned_result[start_idx:end_idx].strip()
            elif cleaned_result.startswith("```"):
                cleaned_result = cleaned_result[3:]
                if cleaned_result.endswith("```"):
                    cleaned_result = cleaned_result[:-3]
            
            # Parse JSON
            parsed = json.loads(cleaned_result)
            
            # Validate no fake companies
            fake_companies = ["GitHub", "Replit", "AppZen", "Workiva", "MindBridge", "Kira Systems", "Luminance", "Freshdesk", "HubSpot", "Zendesk", "Asana", "Intercom", "Copy.ai", "Confluence", "GitBook"]
            valid_companies = [cs.get("companyName", cs.get("company", "")) for cs in case_studies]
            
            for func in parsed.get('businessFunctions', []):
                for use_case in func.get('useCases', []):
                    for example in use_case.get('examples', []):
                        company = example.get('company', '')
                        if company and company not in valid_companies and company in fake_companies:
                            print(f"❌ ERROR: Found fake company '{company}' - not in case studies!")
                            print(f"Valid companies include: {', '.join(valid_companies[:10])}...")
            
            # Validate employee count
            total_mapped = sum(f['employeeCount'] for f in parsed.get('businessFunctions', []))
            total_stated = parsed.get('companyInfo', {}).get('totalEmployees', 0)
            
            if total_mapped != total_stated:
                print(f"⚠️ WARNING: Mapped {total_mapped} employees but company states {total_stated}")
            
            # Validate we have all 9 functions
            if len(parsed.get('businessFunctions', [])) != 9:
                print(f"⚠️ WARNING: Expected 9 functions, got {len(parsed.get('businessFunctions', []))}")
            
            print(f"✅ Successfully analyzed company: {parsed.get('companyInfo', {}).get('name', 'Unknown')}")
            print(f"   Industry: {parsed.get('companyInfo', {}).get('industry')}")
            print(f"   Total Employees: {total_stated}")
            print(f"   Headquarters: {parsed.get('companyInfo', {}).get('headquarters')}")
            
            return parsed
            
        except json.JSONDecodeError as e:
            print(f"Failed to parse matches as JSON: {e}")
            print("Raw response (first 500 chars):", result[:500])
            print("Attempting to fix and salvage JSON...")
            
            # Try to fix common JSON errors
            try:
                # Remove any trailing commas before closing brackets/braces
                fixed_json = result.strip()
                fixed_json = re.sub(r',\s*}', '}', fixed_json)
                fixed_json = re.sub(r',\s*]', ']', fixed_json)
                
                # Try to parse the fixed JSON
                matches = json.loads(fixed_json)
                return matches
            except:
                pass
            
            # Try using regex to extract JSON-like structure
            try:
                import re
                json_pattern = r'\{(?:[^{}]|(?:\{[^{}]*\}))*\}'
                json_matches = re.findall(json_pattern, result, re.DOTALL)
                if json_matches:
                    for json_str in json_matches:
                        try:
                            matches = json.loads(json_str)
                            if "businessFunctions" in matches or "useCases" in matches:
                                return matches
                        except:
                            continue
            except:
                pass
            
            # Last resort: manually build valid JSON
            try:
                # Create a basic structure if parsing failed
                fallback_response = {
                    "businessFunctions": [{
                        "id": "general",
                        "name": "General Business Functions",
                        "relevanceScore": 75,
                        "whyRelevant": "Unable to parse specific recommendations, but Claude AI can benefit most knowledge workers",
                        "examples": [],
                        "targetRoles": [],
                        "totalEmployeesAffected": 0,
                        "estimatedROI": "$0",
                        "estimatedImplementationCost": {
                            "level": "Medium",
                            "range": "$10,000 - $50,000"
                        }
                    }],
                    "error": "Failed to parse Claude response completely",
                    "partial_response": result[:200] + "..." # Include the start of the response
                }
                
                return fallback_response
            except Exception as e2:
                print(f"Even fallback JSON creation failed: {e2}")
                raise
                
        except Exception as e:
            print(f"❌ Error in combined analysis: {e}")
            if hasattr(e, 'response'):
                print(f"   Response: {e.response}")
            raise
    
    def _scrape_website(self, url: str) -> str:
        """
        Scrape content from a website
        """
        try:
            # Add protocol if not present
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
                
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.extract()
            
            # Get text and clean it
            text = soup.get_text(separator='\n')
            
            # Clean up text (remove extra whitespace)
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            # Extract meta description for additional context
            meta_desc = ""
            meta_tag = soup.find("meta", attrs={"name": "description"})
            if meta_tag and "content" in meta_tag.attrs:
                meta_desc = f"META DESCRIPTION: {meta_tag['content']}\n\n"
            
            # Extract key pages: About Us, Products, Services
            about_links = soup.find_all("a", text=lambda t: t and any(x in t.lower() for x in ["about", "about us", "company"]))
            
            # Combine everything
            full_content = f"URL: {url}\n\n{meta_desc}MAIN PAGE CONTENT:\n{text}\n\n"
            
            return full_content
            
        except Exception as e:
            print(f"Error scraping {url}: {e}")
            return ""
    
    def _get_default_use_cases(self) -> Dict[str, Any]:
        """
        Return default use cases when database is not available
        """
        return {
            "customer_service": {
                "id": "customer_service",
                "name": "Customer Service Automation",
                "description": "Using Claude to handle customer inquiries, support tickets, and service requests.",
                "idealFit": {
                    "industries": ["Retail", "Technology", "Financial Services", "Telecommunications"],
                    "companySize": ["SMB", "Mid-Market", "Enterprise"],
                    "technicalRequirements": "Medium"
                },
                "examples": [
                    "24/7 customer support chatbot",
                    "Ticket triaging and routing",
                    "Self-service knowledge base assistance"
                ]
            },
            "content_generation": {
                "id": "content_generation",
                "name": "Content Generation & Repurposing",
                "description": "Using Claude to create, adapt, and transform content for marketing and communication.",
                "idealFit": {
                    "industries": ["Media", "Marketing", "Education", "Retail"],
                    "companySize": ["Sole Proprietor", "SMB", "Mid-Market"],
                    "technicalRequirements": "Low"
                },
                "examples": [
                    "Blog post creation and optimization",
                    "Social media content generation",
                    "Marketing copy adaptation for different channels"
                ]
            },
            "research_analysis": {
                "id": "research_analysis",
                "name": "Research & Data Analysis",
                "description": "Using Claude to process large volumes of information and extract insights.",
                "idealFit": {
                    "industries": ["Research", "Finance", "Healthcare", "Legal"],
                    "companySize": ["SMB", "Mid-Market", "Enterprise"],
                    "technicalRequirements": "Medium"
                },
                "examples": [
                    "Market research summarization",
                    "Competitive analysis",
                    "Literature reviews and synthesis"
                ]
            },
            "document_processing": {
                "id": "document_processing",
                "name": "Document Processing & Extraction",
                "description": "Using Claude to analyze documents, extract information, and generate metadata.",
                "idealFit": {
                    "industries": ["Legal", "Finance", "Healthcare", "Government"],
                    "companySize": ["Mid-Market", "Enterprise"],
                    "technicalRequirements": "Medium"
                },
                "examples": [
                    "Contract analysis and summarization",
                    "Form data extraction",
                    "Document classification and tagging"
                ]
            },
            "specialized_assistants": {
                "id": "specialized_assistants",
                "name": "Specialized Work Assistants",
                "description": "Creating domain-specific assistants powered by Claude to support professional work.",
                "idealFit": {
                    "industries": ["Legal", "Healthcare", "Engineering", "Finance"],
                    "companySize": ["SMB", "Mid-Market", "Enterprise"],
                    "technicalRequirements": "Medium"
                },
                "examples": [
                    "Legal research assistant",
                    "Medical documentation helper",
                    "Engineering design assistant"
                ]
            }
        }


# For testing
if __name__ == "__main__":
    # Get API key from environment or prompt user
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        api_key = input("Enter your Anthropic API key: ")
    
    analyzer = CompanyAnalyzer(api_key)
    
    test_mode = input("Run in 'website' or 'description' mode? ").lower()
    
    if test_mode == "website":
        test_url = input("Enter company website URL: ")
        result = analyzer.analyze_website(test_url)
    else:
        test_description = input("Enter company description: ")
        result = analyzer.analyze_description(test_description)
    
    print("\nAnalysis Result:")
    print(json.dumps(result, indent=2))
    
    # Match to use cases
    print("\nMatching to use cases...")
    matches = analyzer.match_use_cases(result)
    print("\nUse Case Matches:")
    print(json.dumps(matches, indent=2))