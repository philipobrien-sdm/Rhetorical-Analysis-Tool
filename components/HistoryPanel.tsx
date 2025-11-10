import React, { useState } from 'react';
import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

const HistoryItem: React.FC<{ entry: HistoryEntry; onRename: () => void; onDelete: () => void; onLoad: () => void; t: (key: string) => string; }> = ({ entry, onRename, onDelete, onLoad, t }) => {
  return (
    <li className="flex items-center justify-between p-2 rounded-md hover:bg-slate-700/50 transition-colors group">
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onLoad}>
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-indigo-300">{entry.name}</p>
        <p className="text-xs text-slate-400">
          {new Date(entry.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center ml-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onRename} title={t('rename')} className="p-1 rounded hover:bg-slate-600 text-slate-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
        </button>
        <button onClick={onDelete} title={t('delete')} className="p-1 rounded hover:bg-slate-600 text-red-400 hover:text-red-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </li>
  );
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onLoad, onRename, onDelete, t }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleRename = (id: string, currentName: string) => {
    const newName = window.prompt(t('renamePrompt'), currentName);
    if (newName && newName.trim() !== "") {
      onRename(id, newName.trim());
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteConfirm'))) {
      onDelete(id);
    }
  };

  if (history.length === 0) {
    return null; // Don't render the panel if there's no history
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-3 text-left font-semibold text-slate-300 bg-slate-900/50 hover:bg-slate-700/50 transition-colors ${isOpen ? 'rounded-t-lg' : 'rounded-lg'}`}
        aria-expanded={isOpen}
      >
        <span>{t('analysisHistory')} ({history.length})</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-2 max-h-60 overflow-y-auto">
          <ul className="space-y-1">
            {history.map(entry => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onLoad={() => onLoad(entry)}
                onRename={() => handleRename(entry.id, entry.name)}
                onDelete={() => handleDelete(entry.id)}
                t={t}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};