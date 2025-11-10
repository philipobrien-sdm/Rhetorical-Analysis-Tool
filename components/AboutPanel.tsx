import React, { useState } from 'react';

interface AboutPanelProps {
  t: (key: string) => string;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-3 text-left font-semibold text-slate-300 bg-slate-900/50 hover:bg-slate-700/50 transition-colors ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
        aria-expanded={isOpen}
      >
        <span>{t('aboutThisTool')}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 md:p-6 text-slate-300 space-y-4 text-sm leading-relaxed">
          <h3 className="text-lg font-semibold text-indigo-400">{t('aboutHeading1')}</h3>
          <p>{t('aboutParagraph1')}</p>

          <h4 className="font-semibold text-slate-200">{t('aboutCoreFeatures')}</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>{t('aboutFeature1Title')}:</strong> {t('aboutFeature1Desc')}</li>
            <li><strong>{t('aboutFeature2Title')}:</strong> {t('aboutFeature2Desc')}</li>
            <li><strong>{t('aboutFeature3Title')}:</strong> {t('aboutFeature3Desc')}</li>
            <li><strong>{t('aboutFeature4Title')}:</strong> {t('aboutFeature4Desc')}</li>
          </ul>

          <h3 className="text-lg font-semibold text-indigo-400 mt-6">{t('aboutHowToUse')}</h3>
          <p><strong>{t('aboutHowToStep1')}</strong></p>
          <ul className="list-disc list-inside space-y-1">
              <li><strong>{t('aboutHowToStep1aTitle')}:</strong> {t('aboutHowToStep1aDesc')}</li>
              <li><strong>{t('aboutHowToStep1bTitle')}:</strong> {t('aboutHowToStep1bDesc')}</li>
          </ul>
          <p><strong>{t('aboutHowToStep2')}</strong> {t('aboutHowToStep2Desc')}</p>
          <p><strong>{t('aboutHowToStep3')}</strong> {t('aboutHowToStep3Desc')}</p>

          <h3 className="text-lg font-semibold text-indigo-400 mt-6">{t('aboutLimitations')}</h3>
          <ul className="list-disc list-inside space-y-1">
              <li><strong>{t('aboutLimitation1Title')}</strong> {t('aboutLimitation1Desc')}</li>
              <li><strong>{t('aboutLimitation2Title')}</strong> {t('aboutLimitation2Desc')}</li>
              <li><strong>{t('aboutLimitation3Title')}</strong> {t('aboutLimitation3Desc')}</li>
          </ul>
          
          <h3 className="text-lg font-semibold text-indigo-400 mt-6">{t('aboutGoal')}</h3>
          <p>{t('aboutGoalDesc')}</p>
        </div>
      )}
    </div>
  );
};