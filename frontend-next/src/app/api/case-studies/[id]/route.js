import { NextResponse } from 'next/server';
import axios from 'axios';

// API endpoint for retrieving a specific case study
export async function GET(request, { params }) {
  try {
    // Convert underscores to hyphens for file names
    const caseStudyId = params.id.replace(/_/g, '-');
    
    // Call the Python backend API
    const response = await axios.get(`http://localhost:5001/api/case-studies/${caseStudyId}`);
    
    // Return the case study
    return NextResponse.json(response.data);
  } catch (error) {
    console.error(`Error retrieving case study ${params.id}:`, error);
    
    // If the hyphenated version fails, try the original ID
    try {
      const response = await axios.get(`http://localhost:5001/api/case-studies/${params.id}`);
      return NextResponse.json(response.data);
    } catch (secondError) {
      // Return an error response
      return NextResponse.json(
        { error: `Case study ${params.id} not found or unavailable` }, 
        { status: 404 }
      );
    }
  }
}
