import React from 'react';
import { Database, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Ocean Data Found',
  description = 'No active ARGO float records match the current filter spatial bounds.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl bg-[#06283D]/40 border border-[#5EE6FF]/15 backdrop-blur-md gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[#00B4FF]/10 flex items-center justify-center border border-[#00B4FF]/30">
        <Database className="w-7 h-7 text-[#00B4FF]" />
      </div>
      <div>
        <h4 className="text-lg font-bold font-heading text-white">{title}</h4>
        <p className="text-xs text-[#A8C7D8] max-w-sm mt-1">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Reset Query Filters
        </Button>
      )}
    </div>
  );
};
