
import React, { useState } from 'react';
import { Sparkles, Send, X, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService.ts';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [vibe, setVibe] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vibe.trim()) return;
    
    setIsLoading(true);
    const advice = await geminiService.getDesignAdvice(vibe);
    setResponse(advice);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-fade-in" role="dialog" aria-label="AI Design Assistant">
          <div className="bg-stone-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-sm">Design Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70" aria-label="Close Assistant">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 flex-grow overflow-y-auto max-h-96">
            {!response ? (
              <div className="space-y-4">
                <p className="text-sm text-stone-600">Tell me about the "vibe" of your home, and I'll give you some styling advice!</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <textarea 
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                    placeholder="e.g. Minimalist japandi with lots of plants..."
                    aria-label="Your home's vibe"
                    className="w-full h-24 p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-stone-900 outline-none resize-none"
                  />
                  <button 
                    disabled={isLoading}
                    className="w-full bg-stone-900 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> Get Advice</>}
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <p className="text-xs text-stone-400 mb-1">Your Vibe:</p>
                  <p className="text-sm italic text-stone-700">"{vibe}"</p>
                </div>
                <div className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
                <button 
                  onClick={() => { setResponse(null); setVibe(''); }}
                  className="w-full bg-stone-100 text-stone-900 font-semibold py-2 rounded-xl text-xs hover:bg-stone-200 transition-colors"
                >
                  Ask another question
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          aria-label="Open Design Assistant"
          className="bg-stone-900 text-white p-4 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all flex items-center gap-2 group"
        >
          <Sparkles className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-sm pr-2">Design Advice</span>
        </button>
      )}
    </div>
  );
};
