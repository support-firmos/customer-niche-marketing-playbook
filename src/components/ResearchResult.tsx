// components/ResearchResult.tsx
import { useState } from 'react';
import Button from './Button';

interface ResearchResultProps {
  content: string;
  industry?: string;
  onReset: () => void;
  onNextSteps?: (content: string) => Promise<void>;
  currentStepDone?: boolean;
  isGeneratingNextStep?: boolean;
  nextStepButtonText?: string;
  resultType?: 'segments' | 'enhanced' | 'salesNav';
}

export default function ResearchResult({ 
  content, 
  industry = "", 
  onReset, 
  onNextSteps,
  currentStepDone = false,
  isGeneratingNextStep = false,
  nextStepButtonText,
  resultType
}: ResearchResultProps) {
  const [copySuccess, setCopySuccess] = useState('');
  
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
      await onNextSteps(content);
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
            : 'Market Research'}
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

      {!isGeneratingNextStep && onNextSteps && (
        <div className="flex justify-center mt-4">
          <Button
            variant="primary"
            size="md"
            onClick={handleNextStep}
            className="bg-[#3B82F6] text-white hover:bg-[#2563EB] border-none"
          >
            { nextStepButtonText || "Continue"}
          </Button>
        </div>
      )}

      {isGeneratingNextStep && (
        <div className="text-center mt-4">
          <p className="text-[#8a8f98]">Enhancing segments...</p>
        </div>
      )}
    </div>
  );
}