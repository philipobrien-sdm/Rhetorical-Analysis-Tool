import React, { useState, useEffect, useCallback } from 'react';
import type { SliderPositions, RewriteParams } from '../types';
import { rewriteText, rewriteConversationWithPrompt } from '../services/geminiService';
import { Loader } from './Loader';

interface TextSculptorProps {
  originalText: string;
  initialPositions: SliderPositions;
  isConversation: boolean;
  t: (key: string) => string;
}

const Slider: React.FC<{ label: string; value: number; onChange: (value: number) => void; disabled: boolean; description: string; }> = ({ label, value, onChange, disabled, description }) => {
    return (
      <div className="space-y-2" title={description}>
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">{label}</label>
          <span className="text-xs font-mono px-2 py-1 bg-slate-700 rounded-md">{value}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          disabled={disabled}
        />
      </div>
    );
};

export const TextSculptor: React.FC<TextSculptorProps> = ({ originalText, initialPositions, isConversation, t }) => {
    // State for sliders
    const [sliderPositions, setSliderPositions] = useState<SliderPositions>(initialPositions);
    
    // State for conversation prompt
    const [scenarioPrompt, setScenarioPrompt] = useState<string>('');
    
    // Common state
    const [rewrittenText, setRewrittenText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- SLIDER-BASED REWRITE LOGIC ---
    const handleSliderChange = (key: keyof SliderPositions, value: number) => {
        setSliderPositions(prev => ({ ...prev, [key]: value }));
    };

    const handleSliderRewrite = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: RewriteParams = sliderPositions;
            const result = await rewriteText(originalText, params);
            setRewrittenText(result);
        } catch (err: any) {
            setError(err.message || 'Failed to rewrite text.');
        } finally {
            setIsLoading(false);
        }
    }, [originalText, sliderPositions]);

    // This useEffect hook syncs the sliders if the underlying analysis changes (e.g., loading from history)
    useEffect(() => {
        setSliderPositions(initialPositions);
    }, [initialPositions]);
    
    const handleResetSliders = () => {
        setSliderPositions(initialPositions);
    };

    // --- CONVERSATION-BASED REWRITE LOGIC ---
    const handleConversationRewrite = async () => {
        if (!scenarioPrompt.trim()) {
            setError(t('scenarioPromptError'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setRewrittenText(''); // Clear previous results
        try {
            const result = await rewriteConversationWithPrompt(originalText, scenarioPrompt);
            setRewrittenText(result);
        } catch (err: any) {
            setError(err.message || 'Failed to rewrite conversation.');
        } finally {
            setIsLoading(false);
        }
    };


    if (isConversation) {
        // --- RENDER CONVERSATION UI ---
        return (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h3 className="text-xl font-semibold text-indigo-400 mb-3">{t('rewriteConversation')}</h3>
                    <p className="text-slate-400 text-sm">
                        {t('rewriteConversationDescription')}
                    </p>
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="scenario-prompt" className="text-sm font-medium text-slate-300">
                        {t('scenarioPromptLabel')}
                    </label>
                    <textarea
                        id="scenario-prompt"
                        value={scenarioPrompt}
                        onChange={(e) => setScenarioPrompt(e.target.value)}
                        placeholder={t('scenarioPromptPlaceholder')}
                        className="w-full h-24 p-3 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors text-slate-200 resize-y"
                        disabled={isLoading}
                    />
                </div>

                <button
                    onClick={handleConversationRewrite}
                    disabled={isLoading}
                    className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-500 flex items-center justify-center transition-colors"
                >
                     {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t('rewriting')}
                        </>
                      ) : (
                        t('rewriteConversation')
                      )}
                </button>

                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                {isLoading && !rewrittenText && <Loader t={t} />}
                
                {rewrittenText && (
                     <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                        <h4 className="text-lg font-semibold text-slate-300 mb-2">{t('rewrittenVersion')}</h4>
                        <p className="text-slate-200 whitespace-pre-wrap">{rewrittenText}</p>
                     </div>
                )}
            </div>
        );
    }
    
    // --- RENDER SLIDER UI ---
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h3 className="text-xl font-semibold text-indigo-400 mb-3">{t('textSculptor')}</h3>
                <p className="text-slate-400 text-sm">
                {t('textSculptorDescription')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-900/50 rounded-lg">
                <Slider label={t('professionalism')} value={sliderPositions.professionalism} onChange={(v) => handleSliderChange('professionalism', v)} disabled={isLoading} description={t('professionalismDescription')} />
                <Slider label={t('emotionality')} value={sliderPositions.emotionality} onChange={(v) => handleSliderChange('emotionality', v)} disabled={isLoading} description={t('emotionalityDescription')} />
                <Slider label={t('proximity')} value={sliderPositions.proximity} onChange={(v) => handleSliderChange('proximity', v)} disabled={isLoading} description={t('proximityDescription')} />
                <Slider label={t('intensity')} value={sliderPositions.intensity} onChange={(v) => handleSliderChange('intensity', v)} disabled={isLoading} description={t('intensityDescription')} />
            </div>
            
            <div className="flex gap-4">
                 <button
                    onClick={handleResetSliders}
                    disabled={isLoading}
                    className="px-6 py-3 font-semibold text-slate-200 bg-slate-600/50 rounded-lg hover:bg-slate-500/50 transition-colors disabled:opacity-50"
                >
                    {t('reset')}
                </button>
                <button
                    onClick={handleSliderRewrite}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-500 flex items-center justify-center transition-colors"
                >
                    {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          {t('rewriting')}
                        </>
                      ) : (
                        t('rewriteText')
                      )}
                </button>
            </div>
            
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            
            {rewrittenText ? (
                 <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-slate-300 mb-2">{t('rewrittenVersion')}</h4>
                    <p className="text-slate-200 whitespace-pre-wrap">{rewrittenText}</p>
                 </div>
            ) : isLoading ? (
                <Loader t={t} />
            ) : null}
        </div>
    );
};