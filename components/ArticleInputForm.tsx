
import React, { useState } from 'react';
import { UserProfileForm } from './UserProfileForm';
import { examples } from '../services/exampleData';
import type { UserProfile } from '../types';

interface ArticleInputFormProps {
  onAnalyze: (text: string, title: string, type: 'generic' | 'personalized') => void;
  isLoading: boolean;
  userProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile | null) => void;
  text: string;
  setText: (text: string) => void;
  title: string;
  setTitle: (title: string) => void;
  onExampleLoad: (name: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const ArticleInputForm: React.FC<ArticleInputFormProps> = ({ 
  onAnalyze, isLoading, userProfile, onProfileUpdate,
  text, setText, title, setTitle, onExampleLoad, t
}) => {
  const [isPersonalizationVisible, setIsPersonalizationVisible] = useState(false);
  const canAnalyze = text.trim().length >= 200;

  const handleSubmit = (type: 'generic' | 'personalized') => {
    if (canAnalyze && !isLoading) {
      onAnalyze(text, title, type);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in space-y-4">
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-xl space-y-4">
        <div className="space-y-1">
          <label htmlFor="example-selector" className="text-sm font-medium text-slate-300">{t('loadExampleLabel')}</label>
          <select
            id="example-selector"
            onChange={(e) => {
              onExampleLoad(e.target.value);
              e.target.value = ''; // Reset selector to allow re-selection
            }}
            className="w-full p-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors text-slate-200"
            disabled={isLoading}
            aria-label={t('loadExampleLabel')}
            defaultValue=""
          >
            <option value="">{t('selectExampleOption')}</option>
            {examples.map(ex => (
              <option key={ex.name} value={ex.name}>{ex.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium text-slate-300">{t('analysisTitleLabel')}</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('analysisTitlePlaceholder')}
            className="w-full p-2 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors text-slate-200"
            disabled={isLoading}
          />
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('pasteTextPlaceholder')}
          className="w-full h-48 p-3 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-indigo-500 transition-colors text-slate-200 resize-y"
          disabled={isLoading}
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => handleSubmit('generic')}
            disabled={!canAnalyze || isLoading}
            className="flex-1 px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? t('analyzing') : t('runGenericAnalysis')}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('personalized')}
            disabled={!canAnalyze || isLoading || !userProfile}
            title={!userProfile ? t('enablePersonalizedAnalysisTooltip') : ""}
            className="flex-1 px-6 py-3 font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? t('analyzing') : t('runPersonalizedAnalysis')}
          </button>
        </div>
        
        {!canAnalyze && text.length > 0 && (
          <p className="text-xs text-center text-yellow-400">
            {t('characterMinimumWarning', { count: 200 - text.trim().length })}
          </p>
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl">
        <button
          onClick={() => setIsPersonalizationVisible(!isPersonalizationVisible)}
          className={`w-full flex justify-between items-center p-3 text-left font-semibold text-slate-300 bg-slate-900/50 hover:bg-slate-700/50 transition-colors ${isPersonalizationVisible ? 'rounded-t-lg' : 'rounded-lg'}`}
          aria-expanded={isPersonalizationVisible}
        >
          <span>{t('personalizeAnalysisLabel')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isPersonalizationVisible ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isPersonalizationVisible && <UserProfileForm onProfileUpdate={onProfileUpdate} t={t} />}
      </div>
    </div>
  );
};
