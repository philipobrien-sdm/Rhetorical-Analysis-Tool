import React, { useState, useEffect, useCallback } from 'react';
import { ArticleInputForm } from './components/ArticleInputForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutPanel } from './components/AboutPanel';
import { LanguageSelector } from './components/LanguageSelector';
import { analyzeText } from './services/geminiService';
import { getHistory, addAnalysis, updateAnalysisName, deleteAnalysis } from './services/historyService';
import { getUserProfile } from './services/userService';
import { translations } from './services/i18n';

import type { AnalysisResult, HistoryEntry, UserProfile } from './types';

// Type declarations for browser extension APIs
declare namespace chrome {
  namespace tabs {
    function query(queryInfo: any, callback: (results: any[]) => void): void;
  }
  namespace scripting {
    function executeScript(injection: any, callback: (results: any[]) => void): void;
  }
}

function App() {
  const [text, setText] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentAnalysisInput, setCurrentAnalysisInput] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    return (localStorage.getItem('appLanguage') as 'en' | 'es') || 'en';
  });
  
  const isExtension = typeof chrome !== 'undefined' && chrome.tabs;

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const t = useCallback((key: keyof typeof translations, vars?: Record<string, string | number>) => {
    let translation = translations[key]?.[language] || translations[key]?.['en'] || key;
    if (vars) {
      Object.keys(vars).forEach(varKey => {
        translation = translation.replace(`{{${varKey}}}`, String(vars[varKey]));
      });
    }
    return translation;
  }, [language]);


  useEffect(() => {
    setHistory(getHistory());
    setUserProfile(getUserProfile());
  }, []);

  const handleProfileUpdate = useCallback((profile: UserProfile | null) => {
    setUserProfile(profile);
  }, []);

  const handleAnalyze = async (inputText: string, inputTitle: string, type: 'generic' | 'personalized') => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentAnalysisInput(inputText);

    try {
      const result = await analyzeText(inputText, type, userProfile);
      setAnalysisResult(result);

      const newEntry: HistoryEntry = {
        id: new Date().toISOString(),
        name: inputTitle || `${t('analysisOf')} "${inputText.substring(0, 30)}..."`,
        input: inputText,
        analysis: result,
        createdAt: new Date().toISOString(),
      };
      const updatedHistory = addAnalysis(newEntry);
      setHistory(updatedHistory);
    } catch (err: any)      {
      setError(err.message || t('unknownError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadFromHistory = (entry: HistoryEntry) => {
    setText(entry.input);
    setTitle(entry.name);
    setAnalysisResult(entry.analysis);
    setCurrentAnalysisInput(entry.input);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleRenameHistory = (id: string, newName: string) => {
    const updatedHistory = updateAnalysisName(id, newName);
    setHistory(updatedHistory);
  };
  
  const handleDeleteHistory = (id: string) => {
    const updatedHistory = deleteAnalysis(id);
    setHistory(updatedHistory);
  };
  
  const handleReset = () => {
      setAnalysisResult(null);
      setError(null);
      setText('');
      setTitle('');
      setCurrentAnalysisInput('');
  };

  const handleAnalyzePage = () => {
    if (!isExtension) return;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: activeTab.id },
                    func: () => ({ text: document.body.innerText, title: document.title }),
                },
                (injectionResults) => {
                    if (injectionResults && injectionResults[0] && injectionResults[0].result) {
                        const { text, title } = injectionResults[0].result;
                        setText(text as string);
                        setTitle(title || t('currentPageAnalysis'));
                    } else {
                        setError(t('couldNotExtractText'));
                    }
                }
            );
        }
    });
  };


  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
            {t('appTitle')}
          </h1>
          <p className="mt-2 text-slate-400">{t('appSubtitle')}</p>
          <div className="absolute top-0 right-0">
             <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
          </div>
        </header>

        {analysisResult === null ? (
            <>
              {isExtension && (
                 <div className="text-center mb-4">
                     <button
                        onClick={handleAnalyzePage}
                        className="px-5 py-2 font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
                     >
                        {t('analyzeCurrentPage')}
                    </button>
                 </div>
              )}
              <ArticleInputForm
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                userProfile={userProfile}
                onProfileUpdate={handleProfileUpdate}
                text={text}
                setText={setText}
                title={title}
                setTitle={setTitle}
                t={t}
              />
            </>
        ) : (
             <AnalysisDisplay analysis={analysisResult} originalText={currentAnalysisInput} onReset={handleReset} title={title} t={t} />
        )}
        
        <div className="my-8">
          {isLoading && <Loader t={t} />}
          {error && <ErrorMessage message={error} t={t} />}
        </div>

        <HistoryPanel
          history={history}
          onLoad={handleLoadFromHistory}
          onRename={handleRenameHistory}
          onDelete={handleDeleteHistory}
          t={t}
        />
        
        <AboutPanel t={t} />
      </main>
      <footer className="text-center py-4 text-xs text-slate-500">
        <p>{t('footerDisclaimer')}</p>
      </footer>
    </div>
  );
}

export default App;