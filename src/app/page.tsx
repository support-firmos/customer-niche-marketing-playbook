// src/app/page.tsx
'use client';

import { useState } from 'react';
import ResearchForm from '@/components/ResearchForm';
import ResearchResult from '@/components/ResearchResult';

interface FormData {
  industry: string;
}

export default function Home() {
  const [generatedResearch, setGeneratedResearch] = useState<string | null>(null);
  const [enhancedResearch, setEnhancedResearch] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState<string>("");
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const generateResearch = async (formData: FormData) => {
    setError(null);
    setIsGenerating(true);
    setGeneratedResearch('');
    setEnhancedResearch(null);
    setProgressStatus('Identifying target segments...');
    setCurrentIndustry(formData.industry);

    try {
      // First prompt: Get initial target segments
      const initialResponse = await fetch('/api/generate-segments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: formData.industry }),
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
      setGeneratedResearch(initialSegments);
      
    } catch (error) {
      console.error('Error generating research:', error);
      setError('An error occurred while generating the market research. Please try again.');
      setGeneratedResearch(null);
    } finally {
      setIsGenerating(false);
      setProgressStatus('');
    }
  };

  const enhanceSegments = async (segments: string, industry: string) => {
    setError(null);
    setIsEnhancing(true);
    
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
        setGeneratedResearch(null); // Hide the original research
        setEnhancedResearch(enhancedData.result); // Show enhanced research
      } else {
        setError('Could not enhance the segments. Please try again.');
      }
    } catch (enhanceError) {
      console.error('Error enhancing segments:', enhanceError);
      setError('Could not enhance the segments. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const resetGenerator = () => {
    setGeneratedResearch(null);
    setEnhancedResearch(null);
    setError(null);
    setCurrentIndustry("");
  };

  // Determine which content to show
  const displayContent = enhancedResearch || generatedResearch;
  const isResultEnhanced = !!enhancedResearch;

  return (
    <div className="py-10 px-4 container mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#f7f8f8]">Market Segment Researcher</h1>
          <p className="text-[#8a8f98]">
            Find ideal Market Segments for Fractional CFO services
          </p>
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
              onEnhance={!isResultEnhanced ? enhanceSegments : undefined}
              isEnhanced={isResultEnhanced}
              isEnhancing={isEnhancing}
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