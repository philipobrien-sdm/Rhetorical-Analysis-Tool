import React, { useState, useMemo } from 'react';
import type { AnalysisResult, TextAnalysis, PersuasiveTechnique, LogicalFallacy } from '../types';
import { ConversationHeatmap } from './ConversationHeatmap';
import { TextSculptor } from './TextSculptor';
import { exportAnalysisToHtml } from '../services/htmlExportService';

type TabName = 'annotated' | 'detailed' | 'simplified' | 'plain' | 'neuro' | 'sculpt';

const Tab: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; disabled?: boolean }> = ({ active, onClick, children, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
            active
                ? 'bg-slate-800 text-indigo-400 border-b-2 border-indigo-400'
                : 'text-slate-400 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent'
        }`}
    >
        {children}
    </button>
);

const HeatBarScore: React.FC<{ value: number, t: (key: string) => string }> = ({ value, t }) => {
    const percentage = Math.max(0, Math.min(100, (value / 10) * 100));
    const hue = (1 - percentage / 100) * 120; // 120 (green) -> 0 (red)
    return (
        <div className="w-full bg-slate-700 rounded-full h-2.5 my-1" title={`${t('rhetoricalHeat')}: ${value}/10`}>
            <div
                className="h-2.5 rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: `hsl(${hue}, 90%, 55%)` }}
            ></div>
        </div>
    );
};

const TechniqueCard: React.FC<{ item: PersuasiveTechnique | LogicalFallacy, t: (key: string) => string }> = ({ item, t }) => {
    const isTechnique = 'technique' in item;
    const title = isTechnique ? item.technique : item.fallacy;

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h4 className="font-bold text-indigo-300">{title}</h4>
            <p className="text-sm text-slate-400 mt-1 italic">"{item.example}"</p>
            <p className="text-sm mt-2">{item.explanation}</p>
            <div className="mt-2">
                <HeatBarScore value={item.rhetoricalHeat} t={t} />
            </div>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xl font-semibold text-indigo-400 mb-3">{title}</h3>
        <div className="text-slate-300 space-y-2">{children}</div>
    </div>
);


const normalizeText = (text: string) => {
    return text
      .replace(/[\u2018\u2019]/g, "'") // smart single quotes
      .replace(/[\u201C\u201D]/g, '"') // smart double quotes
      .replace(/[\u2013\u2014]/g, '-') // en/em dashes
      .replace(/\s+/g, ' '); // collapse whitespace
};

const AnnotatedText: React.FC<{ text: string; techniques: (PersuasiveTechnique | LogicalFallacy)[] }> = ({ text, techniques }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const segments = useMemo(() => {
        const examples = techniques
            .map((t, index) => ({
                text: t.example,
                normalizedText: normalizeText(t.example),
                originalIndex: index,
                heat: t.rhetoricalHeat,
                tooltip: 'technique' in t ? `${t.technique}: ${t.explanation}` : `${t.fallacy}: ${t.explanation}`,
            }))
            .filter(e => e.normalizedText.length > 0);

        const textLength = text.length;
        const normalizedSource = normalizeText(text);
        
        const matches: { start: number, end: number, data: typeof examples[0] }[] = [];
        examples.forEach(example => {
            let lastIndex = -1;
            while ((lastIndex = normalizedSource.indexOf(example.normalizedText, lastIndex + 1)) !== -1) {
                matches.push({
                    start: lastIndex,
                    end: lastIndex + example.normalizedText.length,
                    data: example
                });
            }
        });

        // Smart overlap handling: prioritize longer matches
        matches.sort((a, b) => (b.end - b.start) - (a.end - a.start));

        const finalAnnotations: typeof matches = [];
        const coveredIndices = new Array(normalizedSource.length).fill(false);
        matches.forEach(match => {
            let isOverlapped = false;
            for (let i = match.start; i < match.end; i++) {
                if (coveredIndices[i]) {
                    isOverlapped = true;
                    break;
                }
            }
            if (!isOverlapped) {
                finalAnnotations.push(match);
                for (let i = match.start; i < match.end; i++) {
                    coveredIndices[i] = true;
                }
            }
        });

        finalAnnotations.sort((a, b) => a.start - b.start);

        const parts: { text: string; highlight?: typeof examples[0], matchStart?: number, matchEnd?: number }[] = [];
        let lastIndex = 0;
        finalAnnotations.forEach(match => {
            if (match.start > lastIndex) {
                parts.push({ text: text.substring(lastIndex, match.start) });
            }
            // Find the original substring to preserve casing and whitespace
            const originalExampleText = text.substring(match.start, match.end);
            parts.push({ text: originalExampleText, highlight: match.data, matchStart: match.start, matchEnd: match.end });
            lastIndex = match.end;
        });

        if (lastIndex < text.length) {
            parts.push({ text: text.substring(lastIndex) });
        }
        
        return { parts, annotations: finalAnnotations, textLength };
    }, [text, techniques]);

    const getHeatColor = (heat: number) => {
        const hue = (1 - (heat / 10)) * 120;
        return `hsl(${hue}, 90%, 55%)`;
    };

    return (
        <div className="grid grid-cols-[1fr_20px] gap-4">
            <div
                className="prose prose-invert bg-slate-900/50 p-4 rounded-md border border-slate-700 whitespace-pre-wrap leading-relaxed max-h-[70vh] overflow-auto"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {segments.parts.map((part, index) =>
                    part.highlight ? (
                        <span
                            key={index}
                            className={`rounded px-1 transition-all duration-200 cursor-pointer ${hoveredIndex === part.highlight.originalIndex ? 'ring-2' : ''}`}
                            style={{ 
                                backgroundColor: `${getHeatColor(part.highlight.heat)}33`,
                                // @ts-ignore
                                '--tw-ring-color': getHeatColor(part.highlight.heat)
                            }}
                            title={part.highlight.tooltip}
                            onMouseEnter={() => setHoveredIndex(part.highlight.originalIndex)}
                        >
                            {part.text}
                        </span>
                    ) : (
                        <span key={index}>{part.text}</span>
                    )
                )}
            </div>
            <div className="relative h-full bg-slate-700 rounded-full" onMouseLeave={() => setHoveredIndex(null)}>
                {segments.annotations.map((annotation, index) => (
                    <div
                        key={index}
                        className="absolute w-full rounded-full transition-all duration-200 cursor-pointer"
                        style={{
                            top: `${(annotation.start / segments.textLength) * 100}%`,
                            height: `${Math.max(0.5, ((annotation.end - annotation.start) / segments.textLength) * 100)}%`,
                            backgroundColor: getHeatColor(annotation.data.heat),
                            boxShadow: hoveredIndex === annotation.data.originalIndex ? `0 0 8px ${getHeatColor(annotation.data.heat)}` : 'none',
                            transform: hoveredIndex === annotation.data.originalIndex ? 'scale(1.2)' : 'scale(1)',
                            zIndex: hoveredIndex === annotation.data.originalIndex ? 10 : 1,
                        }}
                        title={annotation.data.tooltip}
                        onMouseEnter={() => setHoveredIndex(annotation.data.originalIndex)}
                    ></div>
                ))}
            </div>
        </div>
    );
};


const TextAnalysisTabs: React.FC<{ analysis: TextAnalysis, originalText: string, t: (key: string) => string }> = ({ analysis, originalText, t }) => {
    const [activeTab, setActiveTab] = useState<TabName>('annotated');
    const allTechniques = [...analysis.persuasiveTechniques, ...analysis.logicalFallacies];

    const renderContent = () => {
        switch(activeTab) {
            case 'annotated': return (
                <div className="animate-fade-in">
                    <AnnotatedText text={originalText} techniques={allTechniques} />
                </div>
            );
            case 'detailed': return (
                <div className="animate-fade-in">
                    <Section title={t('overallThesis')}><p>{analysis.overallThesis}</p></Section>
                     <Section title={t('originalToneAssessment')}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            {Object.entries(analysis.initialSliderPositions).map(([key, value]) => (
                                <div key={key} className="p-2 bg-slate-800/50 rounded-lg">
                                    <div className="text-sm capitalize text-slate-400">{t(key)}</div>
                                    <div className="text-2xl font-bold text-indigo-300">{value}</div>
                                </div>
                            ))}
                        </div>
                    </Section>
                    {analysis.personalizedFeedback && (
                        <Section title={t('personalizedFeedback')}>
                             <p className="text-xs p-2 bg-yellow-900/20 rounded-md border border-yellow-700/50 text-yellow-300">{t('personalizedFeedbackNotice')}</p>
                             <div className="p-4 bg-slate-800/30 rounded-lg">
                                 <h4 className="font-semibold text-slate-200">{t('generalObservations')}</h4>
                                 <p className="text-sm mb-3">{analysis.personalizedFeedback.generalObservations}</p>
                                 <h4 className="font-semibold text-slate-200">{t('potentialTriggers')}</h4>
                                 <ul className="list-disc list-inside text-sm mb-3">{analysis.personalizedFeedback.potentialTriggers.map((tr, i) => <li key={i}>{tr}</li>)}</ul>
                                 <h4 className="font-semibold text-slate-200">{t('identityAppeals')}</h4>
                                 <ul className="list-disc list-inside text-sm">{analysis.personalizedFeedback.identityAppeals.map((a, i) => <li key={i}>{a}</li>)}</ul>
                             </div>
                        </Section>
                    )}
                    <Section title={t('persuasiveTechniques')}><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{analysis.persuasiveTechniques.map((tech, i) => <TechniqueCard key={i} item={tech} t={t} />)}</div></Section>
                    <Section title={t('logicalFallacies')}>
                      {analysis.logicalFallacies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{analysis.logicalFallacies.map((f, i) => <TechniqueCard key={i} item={f} t={t} />)}</div>
                      ) : (
                        <p className="text-sm text-slate-400">{t('noFallaciesDetected')}</p>
                      )}
                    </Section>
                    <Section title={t('targetAudience')}><p>{analysis.targetAudience}</p></Section>
                    <Section title={t('potentialBiases')}><ul className="list-disc list-inside">{analysis.potentialBiases.map((b, i) => <li key={i}>{b}</li>)}</ul></Section>
                    <Section title={t('socraticQuestions')}><ul className="list-disc list-inside">{analysis.socraticQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></Section>
                    <Section title={t('neutralizedVersion')}><p className="p-4 bg-slate-900/50 rounded-md border border-slate-700 whitespace-pre-wrap">{analysis.neutralizedText}</p></Section>
                </div>
            );
            case 'simplified': return (
                <div className="animate-fade-in">
                    <Section title={t('simplifiedKeyTakeaway')}><p className="p-4 bg-slate-800/30 rounded-lg">{analysis.simplifiedAnalysis.keyTakeaway}</p></Section>
                    <Section title={t('simplifiedMainIdea')}><p>{analysis.simplifiedAnalysis.simplifiedThesis}</p></Section>
                    <Section title={t('simplifiedTechniques')}>{analysis.simplifiedAnalysis.simplifiedTechniques.map((tech, i) => <div key={i} className="mb-3 p-3 bg-slate-800/30 rounded-lg"><strong>{tech.friendlyName}:</strong> {tech.simpleExplanation} <em className="block text-xs mt-1 text-slate-400">{t('example')}: "{tech.example}"</em></div>)}</Section>
                    <Section title={t('simplifiedFallacies')}>{analysis.simplifiedAnalysis.simplifiedFallacies.map((f, i) => <div key={i} className="mb-3 p-3 bg-slate-800/30 rounded-lg"><strong>{f.friendlyName}:</strong> {f.simpleExplanation} <em className="block text-xs mt-1 text-slate-400">{t('example')}: "{f.example}"</em></div>)}</Section>
                </div>
            );
            case 'plain': return (
                <div className="animate-fade-in">
                    <Section title={t('plainBottomLine')}><p>{analysis.plainLanguageAnalysis.mainPoint}</p></Section>
                    <Section title={t('plainMainArgument')}><p>{analysis.plainLanguageAnalysis.plainThesis}</p></Section>
                    <Section title={t('plainPersuasionMethods')}>
                        {analysis.plainLanguageAnalysis.plainTechniques.map((tech, i) => <div key={i} className="mb-3 p-3 bg-slate-800/30 rounded-lg"><strong>{tech.name}:</strong> {tech.explanation} <em className="block text-xs mt-1 text-slate-400">{t('example')}: "{tech.example}"</em></div>)}
                    </Section>
                    <Section title={t('plainMisleadingArguments')}>
                         {analysis.plainLanguageAnalysis.plainFallacies.map((f, i) => <div key={i} className="mb-3 p-3 bg-slate-800/30 rounded-lg"><strong>{f.name}:</strong> {f.explanation} <em className="block text-xs mt-1 text-slate-400">{t('example')}: "{f.example}"</em></div>)}
                    </Section>
                </div>
            );
            case 'neuro': return (
                <div className="animate-fade-in">
                    <Section title={t('neuroSocialCues')}><p>{analysis.neurodivergentAnalysis.socialCueSummary}</p></Section>
                    <Section title={t('neuroLiteralPoint')}><p>{analysis.neurodivergentAnalysis.literalThesis}</p></Section>
                    <Section title={t('neuroNonLiteralLanguage')}>{analysis.neurodivergentAnalysis.explainedTechniques.map((tech, i) => <div key={i} className="mb-3 p-3 bg-slate-800/30 rounded-lg"><strong>{tech.name}:</strong> {tech.literalExplanation} <em className="block text-xs mt-1 text-slate-400">{t('example')}: "{tech.example}"</em></div>)}</Section>
                    <Section title={t('neuroFlawsInLogic')}>{analysis.neurodivergentAnalysis.explainedFallacies.map((f, i) => <div key={i} className="mb-3 p-3 bg-slate-800/30 rounded-lg"><strong>{f.name}:</strong> {f.literalExplanation} <em className="block text-xs mt-1 text-slate-400">{t('example')}: "{f.example}"</em></div>)}</Section>
                </div>
            );
            case 'sculpt': return <TextSculptor originalText={originalText} initialPositions={analysis.initialSliderPositions} isConversation={false} t={t} />;
            default: return null;
        }
    }

    return (
        <div>
            <div className="border-b border-slate-700 overflow-x-auto">
                <nav className="flex -mb-px">
                    <Tab active={activeTab === 'annotated'} onClick={() => setActiveTab('annotated')}>{t('tabAnnotated')}</Tab>
                    <Tab active={activeTab === 'detailed'} onClick={() => setActiveTab('detailed')}>{t('tabDetailed')}</Tab>
                    <Tab active={activeTab === 'simplified'} onClick={() => setActiveTab('simplified')}>{t('tabSimplified')}</Tab>
                    <Tab active={activeTab === 'plain'} onClick={() => setActiveTab('plain')}>{t('tabPlain')}</Tab>
                    <Tab active={activeTab === 'neuro'} onClick={() => setActiveTab('neuro')}>{t('tabNeuro')}</Tab>
                    <Tab active={activeTab === 'sculpt'} onClick={() => setActiveTab('sculpt')}>{t('tabSculpt')}</Tab>
                </nav>
            </div>
            <div className="py-6">{renderContent()}</div>
        </div>
    );
};

export const AnalysisDisplay: React.FC<{
  analysis: AnalysisResult;
  originalText: string;
  onReset: () => void;
  title: string;
  t: (key: string) => string;
}> = ({ analysis, originalText, onReset, title, t }) => {
  const [showJson, setShowJson] = useState(false);

  const handleExport = () => {
    const htmlContent = exportAnalysisToHtml(analysis, originalText, title);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'analysis'}-report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 my-4 bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-200 mb-4">{title || t('analysisComplete')}</h2>

        {analysis.isConversation && analysis.conversationAnalysis ? (
            <div className="space-y-8">
              <ConversationHeatmap data={analysis.conversationAnalysis} t={t} />
              <div className="border-t border-slate-700 my-6"></div>
              <TextSculptor originalText={originalText} initialPositions={{ professionalism: 50, emotionality: 50, proximity: 50, intensity: 50 }} isConversation={true} t={t} />
            </div>
        ) : analysis.textAnalysis ? (
            <TextAnalysisTabs analysis={analysis.textAnalysis} originalText={originalText} t={t} />
        ) : null}

        <div className="mt-8 pt-6 border-t border-slate-700 flex flex-wrap gap-4 items-center justify-end">
            <button
                onClick={() => setShowJson(!showJson)}
                className="px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
            >
                {showJson ? t('hideJson') : t('viewJson')}
            </button>
            <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition-colors"
            >
                {t('exportHtml')}
            </button>
            <button 
                onClick={onReset}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
                {t('startNewAnalysis')}
            </button>
        </div>

        {showJson && (
            <div className="mt-4 p-4 bg-slate-900/70 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">{t('rawJsonResponse')}</h3>
                <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
                    {JSON.stringify(analysis, null, 2)}
                </pre>
            </div>
        )}
    </div>
  );
};