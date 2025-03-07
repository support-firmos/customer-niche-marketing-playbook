// src/app/page.tsx
'use client';

import { useState } from 'react';
import ResearchForm from '@/components/ResearchForm';
import ResearchResult from '@/components/ResearchResult';

interface FormData {
  input: string;
}

export default function Home() {
  const [step1GeneratedResearch, setStep1GeneratedResearch] = useState<string | null>(null);
  const [step2EnhancedResearch, setstep2EnhancedResearch] = useState<string | null>(null);
  const [step3GeneratedSalesNav, setStep3GeneratedSalesNav] = useState<string | null>(null);
  //const [step3GeneratedDeepSegment, setStep3GeneratedDeepSegment] = useState<string | null>(null);
  //const [step4GeneratedPlaybook, setStep4GeneratedPlaybook] = useState<string | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingNextStep, setIsGeneratingNextStep] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState<string>("");
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateResearch = async (formData: FormData) => {
    setError(null);
    setIsGenerating(true);
    setStep1GeneratedResearch('');
    setstep2EnhancedResearch(null);
    setStep3GeneratedSalesNav(null);
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
        setStep1GeneratedResearch(null); // Hide the original research
        setstep2EnhancedResearch(enhancedData.result); // Show enhanced research
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
    setStep3GeneratedSalesNav('');
    setstep2EnhancedResearch(null);
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
      
      if (!data.result) {
        throw new Error('No result returned from strategy generation');
      }
      
      setStep3GeneratedSalesNav(data.result);
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError('An error occurred while generating the targeting strategy. Please try again.');
      setStep3GeneratedSalesNav(null);
    } finally {
      setIsGenerating(false);
      setProgressStatus('');
    }
  };


  const resetGenerator = () => {
    setStep1GeneratedResearch(null);
    setstep2EnhancedResearch(null);
    setError(null);
    setCurrentIndustry("");
  };

  // Determine which content to show
  const displayContent = step3GeneratedSalesNav || step2EnhancedResearch || step1GeneratedResearch;
  const isStep2Done = !!step2EnhancedResearch;
  const isStep3Done = !!step3GeneratedSalesNav;
  //const isStep4Done = !!step3GeneratedDeepSegment;
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
              resultType={step3GeneratedSalesNav ? 'salesNav' : step2EnhancedResearch ? 'enhanced' : 'segments'}
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