// components/ResearchForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from './Button';

const formSchema = z.object({
  input: z.string().min(2, 'Industry name is required'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ResearchForm({ onSubmit }: { onSubmit: (values: FormValues) => Promise<void> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  const submitHandler = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div>
        <label htmlFor="industry" className="block text-[#f7f8f8] font-medium mb-2">
          Target Industry
        </label>
        <input
          id="input"
          type="text"
          className="input-field text-lg"
          placeholder="e.g., Healthcare, Manufacturing, SaaS, Finance"
          {...register('input')}
        />
        {errors.input && (
          <p className="mt-2 text-red-400 text-sm">{errors.input.message}</p>
        )}
      </div>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          isLoading={isSubmitting} 
          size="lg" 
          className="w-full"
        >
          Find Target Segments
        </Button>
      </div>
    </form>
  );
}