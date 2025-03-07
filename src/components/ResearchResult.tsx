// components/ResearchResult.tsx
import { useState } from 'react';
import Button from './Button';

interface Segment {
  name: string;
  content: string;
}

interface ResearchResultProps {
  content: string;
  industry?: string;
  onReset: () => void;
  onNextSteps?: (content: string, selectedSegment?: Segment) => Promise<void>;
  currentStepDone?: boolean;
  isGeneratingNextStep?: boolean;
  nextStepButtonText?: string;
  resultType?: 'segments' | 'enhanced' | 'salesNav' | 'deepSegment' | 'playbook';
  segments?: Segment[];
}

export default function ResearchResult({ 
  content, 
  onReset, 
  onNextSteps,
  isGeneratingNextStep = false,
  nextStepButtonText,
  resultType,
  segments = []
}: ResearchResultProps) {
  const [copySuccess, setCopySuccess] = useState('');
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Failed to copy');
    }
  };
  
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'B2B_Segment_Analysis.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleNextStep = async () => {
    if (onNextSteps) {
      // If it's the Sales Navigator step and segments are available
      if (resultType === 'salesNav' && segments.length > 0 && selectedSegmentIndex !== null) {
        console.log('Selected segment index:', selectedSegmentIndex);
        console.log('Selected segment:', segments[selectedSegmentIndex]);
        await onNextSteps(content, segments[selectedSegmentIndex]);
      } else {
        await onNextSteps(content);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-[#f7f8f8]">
        {resultType === 'salesNav' 
          ? 'Sales Navigator Strategy' 
          : resultType === 'enhanced' 
            ? 'Enhanced Market Research' 
            : resultType === 'segments' ? 'Market Research' :
            resultType === 'deepSegment' ? 'Deep Segment Research' : 
            resultType === 'playbook' ? 'Marketing Playbook' : undefined}
      </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="text-[#f7f8f8] border border-[#8a8f98]/40 hover:bg-[#1A1A1A]"
          >
            {copySuccess || 'Copy'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="text-[#f7f8f8] border border-[#8a8f98]/40 hover:bg-[#1A1A1A]"
          >
            Download
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onReset}
            className="bg-[#1A1A1A] text-[#f7f8f8] border border-[#8a8f98]/20 hover:bg-[#202020]"
          >
            New Research
          </Button>
        </div>
      </div>
      
      <div className="bg-[#141414] p-5 rounded-xl border border-[#8a8f98]/20">
        <pre className="whitespace-pre-wrap text-[#f7f8f8] font-mono text-sm overflow-auto">
          {content}
        </pre>
      </div>

      {/* Segment selection for Sales Navigator step */}
            {resultType === 'salesNav' && segments && segments.length > 0 && (
        <div className="mt-6 bg-[#141414] p-5 rounded-xl border border-[#8a8f98]/20">
          <h3 className="text-lg font-bold text-[#f7f8f8] mb-3">Select a Segment for Deep Research</h3>
          <p className="text-[#8a8f98] mb-4">Choose one segment to analyze in-depth:</p>
          
          <div className="grid grid-cols-1 gap-3">
            {segments.map((segment, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-all 
                  ${selectedSegmentIndex === index 
                    ? 'border-blue-500 bg-blue-900/20' 
                    : 'border-[#8a8f98]/20 hover:border-[#8a8f98]/40'}`}
                onClick={() => setSelectedSegmentIndex(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center
                    ${selectedSegmentIndex === index 
                      ? 'bg-blue-500' 
                      : 'border border-[#8a8f98]/40'}`}
                  >
                    {selectedSegmentIndex === index && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <h4 className="text-[#f7f8f8] font-medium">{segment.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

{!isGeneratingNextStep && onNextSteps && (
        <div className="flex justify-center mt-4">
          <Button
            variant="primary"
            size="md"
            onClick={handleNextStep}
            disabled={resultType === 'salesNav' && segments.length > 0 && selectedSegmentIndex === null}
            className={`
              ${resultType === 'salesNav' && segments.length > 0 && selectedSegmentIndex === null
                ? 'bg-[#3B82F6]/50 text-white/70 cursor-not-allowed'
                : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
              } border-none
            `}
          >
            {resultType === 'salesNav' && segments.length > 0 && selectedSegmentIndex === null
              ? "Select a Segment to Continue"
              : nextStepButtonText || "Continue"}
          </Button>
        </div>
      )}

      {isGeneratingNextStep && (
        <div className="text-center mt-4">
          <p className="text-[#8a8f98]">
            {resultType === 'salesNav'  ?  'Deep Segment Research on-going...' 
              : resultType === 'segments' ? 'Enhancing segments...' 
              : resultType === 'enhanced' ? 'Creating LinkedIn Sales Navigator Strategy...' 
              : resultType === 'deepSegment' ? 'Creating Marketing Playbook...' : 'Processing' }
          </p>
        </div>
      )}
    </div>
  );
}