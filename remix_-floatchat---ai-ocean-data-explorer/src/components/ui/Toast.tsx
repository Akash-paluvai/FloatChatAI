import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'info' | 'success' | 'warning' | 'phase2';
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  isOpen,
  onClose,
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-[#00B4FF]" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    phase2: <Sparkles className="w-5 h-5 text-purple-400" />,
  };

  const borders = {
    info: 'border-[#00B4FF]/40',
    success: 'border-emerald-500/40',
    warning: 'border-amber-500/40',
    phase2: 'border-purple-500/40',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-2xl bg-[#06283D]/90 border ${borders[type]} backdrop-blur-xl shadow-2xl max-w-sm`}
        >
          <div className="shrink-0 mt-0.5">{icons[type]}</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            {message && <p className="text-xs text-[#A8C7D8] mt-0.5">{message}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#A8C7D8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
