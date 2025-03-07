// src/app/page.tsx
'use client';

import { useState } from 'react';
import ResearchForm from '@/components/ResearchForm';
import ResearchResult from '@/components/ResearchResult';

interface FormData {
  input: string;
}

interface Segment {
  name: string;
  content: string;
}

export default function Home() {
  const [step1GeneratedResearch, setStep1GeneratedResearch] = useState<string | null>(null);
  const [step2EnhancedResearch, setStep2EnhancedResearch] = useState<string | null>(null);
  const [step3GeneratedSalesNav, setStep3GeneratedSalesNav] = useState<string | null>(null);
  const [step3Segments, setStep3Segments] = useState<Segment[] | null>(null);
  const [step4DeepSegmentResearch, setStep4DeepSegmentResearch] = useState<string | null>(null);
  const [step5GeneratedPlaybook, setStep5GeneratedPlaybook] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingNextStep, setIsGeneratingNextStep] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState<string>("");
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateResearch = async (formData: FormData) => {
    setError(null);
    setIsGenerating(true);
    setStep1GeneratedResearch('');
    setStep2EnhancedResearch(null);
    setStep3GeneratedSalesNav(null);
    setStep3Segments(null);
    setStep4DeepSegmentResearch(null);
    setStep5GeneratedPlaybook(null);
    setProgressStatus('Identifying target segments...');
    setCurrentIndustry(formData.input);

    try {
      // First prompt: Get initial target segments
      const initialResponse = await fetch('/api/generate-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: formData.input }),
      });

      if (!initialResponse.ok) {
        throw new Error(`Failed to generate initial segments: ${initialResponse.status}`);
      }

      const initialData = await initialResponse.json();
      
      if (!initialData.result) {
        throw new Error('No result returned from segment generation');
      }
      
      const initialSegments = initialData.result;
      
      // Display initial results
      setStep1GeneratedResearch(initialSegments);
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError('An error occurred while generating the market research. Please try again.');
      setStep1GeneratedResearch(null);
    } finally {
      setIsGenerating(false);
      setProgressStatus('');
    }
  };

  const enhanceSegments = async (segments: string, industry: string) => {
    setError(null);
    setIsGeneratingNextStep(true);
    
    try {
      const enhancedResponse = await fetch('/api/enhance-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          industry,
          segments
        }),
      });

      if (!enhancedResponse.ok) {
        throw new Error(`Failed to enhance segments: ${enhancedResponse.status}`);
      }

      const enhancedData = await enhancedResponse.json();
      
      if (enhancedData.result) {
        //setStep1GeneratedResearch(null); // Hide the original research
        setStep2EnhancedResearch(enhancedData.result); // Show enhanced research
      } else {
        setError('Could not enhance the segments. Please try again.');
      }
    } catch (enhanceError) {
      console.error('Error enhancing segments:', enhanceError);
      setError('Could not enhance the segments. Please try again.');
    } finally {
      setIsGeneratingNextStep(false);
    }
  };

  const generateSalesNav = async (segments: string) => {
    setError(null);
    setIsGenerating(true);
    setIsGeneratingNextStep(true);
    setStep3GeneratedSalesNav('');
    //setStep2EnhancedResearch(null);
    setProgressStatus('Creating LinkedIn Sales Navigator strategy...');

    try {
      const response = await fetch('/api/sales-nav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentInfo: segments }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate strategy: ${response.status}`);
      }

      const data = await response.json();

      console.log('Sales nav response:', data);

      if (!data.result) {
        throw new Error('No result returned from strategy generation');
      }
      
      // Check if there's an error in the response
      if (data.error) {
        console.warn('Warning from sales-nav API:', data.error);
      }
      
      // The result should now be a readable text format
      const displayContent = data.result.trim();
      console.log("Display content preview:", displayContent.substring(0, 100) + "...");
      
      // Set the display content
      setStep3GeneratedSalesNav(displayContent);
      
      // Set the segments for selection (these are already parsed in the API)
      if (data.segments && Array.isArray(data.segments)) {
        console.log('Segments from API:', data.segments.length);
        setStep3Segments(data.segments);
      } else {
        console.error('No valid segments in API response');
        setError('Failed to get valid segments. Please try again.');
      }
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError('An error occurred while generating the targeting strategy. Please try again.');
      setStep3GeneratedSalesNav(null);
    } finally {
      setIsGenerating(false);
      setProgressStatus('');
      setIsGeneratingNextStep(false);
    }
  };

  const generateDeepSegmentResearch = async (selectedSegment?: Segment) => {
    if (!selectedSegment) {
      setError('No segment selected for deep research');
      return;
    }
    
    console.log('Selected segment for deep research:', selectedSegment);
    
    setError(null);
    setIsGeneratingNextStep(true);
    setProgressStatus('Creating deep segment research...');
    
    try {
      const response = await fetch('/api/deep-segment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentInfo: selectedSegment })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate deep segment research: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Deep segment research response:', data);
      
      if (!data.result) {
        throw new Error('No result returned from deep segment research');
      }
      
      // The API now returns a clean, readable format
      const resultContent = data.result;
      console.log('Deep segment research content preview:',
        typeof resultContent === 'string'
          ? resultContent.substring(0, 100) + '...'
          : String(resultContent).substring(0, 100) + '...'
      );
      
      //setStep3GeneratedSalesNav(null); // Hide sales nav
      setStep3Segments(null);
      setStep4DeepSegmentResearch(resultContent);
      
      console.log('Deep segment research set:',
        typeof resultContent === 'string'
          ? resultContent.substring(0, 100) + '...'
          : JSON.stringify(resultContent).substring(0, 100) + '...'
      );
      
    } catch (error) {
      console.error('Error generating deep segment research:', error);
      setError('An error occurred while generating the deep segment research. Please try again.');
    } finally {
      setIsGeneratingNextStep(false);
      setProgressStatus('');
    }
  };

  const generateMarketingPlaybook = async (input: string) => {
    setError(null);
    setIsGenerating(true);
    setStep5GeneratedPlaybook('');
    //setStep2EnhancedResearch(null);
    setProgressStatus('Creating Marketing Playbook...');
    setIsGeneratingNextStep(true);

    try {
      const response = await fetch('/api/playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segmentInfo: input }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate playbook: ${response.status}`);
      }

      const data = await response.json();

      console.log('Marketing Playbook response:', data);

      if (!data.result) {
        throw new Error('No result returned from playbook generation');
      }
      
      // Check if there's an error in the response
      if (data.error) {
        console.warn('Warning from Marketing Playbook API:', data.error);
      }
      
      // The result should now be a readable text format
      const displayContent = data.result.trim();
      console.log("Display content preview:", displayContent.substring(0, 100) + "...");
      
      // Set the display content
      setStep5GeneratedPlaybook(displayContent);
      
    } catch (error) {
      console.error('Error generating playbook:', error);
      setError('An error occurred while generating the marketing playbook. Please try again.');
      setStep5GeneratedPlaybook(null);
    } finally {
      setIsGeneratingNextStep(false);
      setProgressStatus('');
    }
  };


  const resetGenerator = () => {
    setStep1GeneratedResearch(null);
    setStep2EnhancedResearch(null);
    setStep3GeneratedSalesNav(null);
    setStep3Segments(null);
    setStep4DeepSegmentResearch(null);
    setStep5GeneratedPlaybook(null);
    setError(null);
    setCurrentIndustry("");
  };

  // Determine which content to show
  
  const displayContent = step5GeneratedPlaybook || step4DeepSegmentResearch || step3GeneratedSalesNav || step2EnhancedResearch || step1GeneratedResearch;
  const isStep2Done = !!step2EnhancedResearch;
  const isStep3Done = !!step3GeneratedSalesNav;
  const isStep4Done = !!step4DeepSegmentResearch;
  const isStep5Done = !!step5GeneratedPlaybook;
  //const isStep5Done = !!step4GeneratedPlaybook;

const handleSteps = () => {
  if (!isStep2Done) {
    return {
      action: (content: string) => enhanceSegments(content, currentIndustry),
      buttonText: "Enhance Segments"
    };
  }
  if (!isStep3Done) {
    return {
      action: (content: string) => generateSalesNav(content),
      buttonText: "Generate Sales Navigator Strategy"
    };
  }
  if (!isStep4Done) {
    return {
      action: (content: string, selectedSegment?: Segment) => 
        generateDeepSegmentResearch(selectedSegment),
      buttonText: "Generate Deep Segment Research"
    };
  }
  if (!isStep5Done) {
    return {
      action: (content: string) => 
        generateMarketingPlaybook(content),
      buttonText: "Generate Marketing Playbook"
    };
  }
  return undefined;
};

  return (
    <div className="py-10 px-4 container mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7f8f8]">Customer Niche Marketing Playbook</h1>
          {/*<p className="text-[#8a8f98]">
            Find ideal Market Segments for Fractional CFO services
          </p>*/}
        </div>
        
        {error && (
          <div className="bg-red-900/30 border border-red-700/30 text-red-300 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}
        
        <div className="card">
          {displayContent ? (
            <ResearchResult 
              content={displayContent} 
              industry={currentIndustry}
              onReset={resetGenerator}
              onNextSteps={handleSteps()?.action}
              nextStepButtonText={handleSteps()?.buttonText}
              isGeneratingNextStep={isGeneratingNextStep}
              resultType={step5GeneratedPlaybook ? 'playbook' : step4DeepSegmentResearch ? 'deepSegment' : step3GeneratedSalesNav ? 'salesNav' : step2EnhancedResearch ? 'enhanced' : 'segments'}
              segments={step3Segments || []}
            />
          ) : (
            <ResearchForm onSubmit={generateResearch} />
          )}
        </div>
        
        {isGenerating && (
          <div className="text-center mt-4">
            <p className="text-[#8a8f98]">
              {progressStatus || 'Generating segments...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}