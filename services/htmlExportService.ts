import type { AnalysisResult, ConversationAnalysis, LogicalFallacy, PersuasiveTechnique, TextAnalysis } from '../types';
import { rhetoricalDevices, logicalFallacies } from './referenceData';

const simpleSanitize = (text: string | undefined): string => {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

const getHeatColor = (heat: number) => {
    const hue = (1 - (heat / 10)) * 120; // 120 (green) -> 0 (red)
    return `hsl(${hue}, 90%, 55%)`;
};

const getIntensityColor = (intensity: number): string => {
  const hue = 240 - (intensity - 1) * (240 / 9);
  return `hsla(${hue}, 70%, 50%, 0.6)`;
};


const generateStylesAndScript = (): string => `
<style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; background-color: #0f172a; color: #d1d5db; margin: 0; padding: 1rem; }
    .container { max-width: 900px; margin: auto; background-color: #1e293b; padding: 1rem 2rem 2rem 2rem; border-radius: 8px; border: 1px solid #374155; }
    h1 { font-size: 2.25rem; color: #a5b4fc; border-bottom: 2px solid #374155; padding-bottom: 0.5rem; margin: 1rem 0 2rem 0; text-align: center; }
    h2 { font-size: 1.5rem; color: #818cf8; margin-top: 0; margin-bottom: 1rem; }
    h3 { font-size: 1.25rem; color: #a5b4fc; margin-top: 1.5rem; }
    h4 { font-size: 1.1rem; color: #6ee7b7; margin-bottom: 0.5rem;}
    p, li { color: #d1d5db; }
    ul, ol { padding-left: 1.5rem; }
    details { background-color: #1e293b; border: 1px solid #374155; border-radius: 8px; margin-bottom: 1rem; }
    details[open] { background-color: #334155; }
    summary { font-size: 1.25rem; font-weight: 600; color: #c4b5fd; padding: 1rem; cursor: pointer; list-style-position: inside; }
    summary:hover { background-color: #475569; }
    .details-content { padding: 0 1rem 1rem 1rem; border-top: 1px solid #374155; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
    .card { background-color: #374155; padding: 1rem; border-radius: 8px; border: 1px solid #4b5563; }
    .quote { font-style: italic; color: #a5b4fc; border-left: 3px solid #6366f1; padding-left: 1rem; margin: 0.5rem 0; display: block; word-break: break-word; }
    .heatmap-item { margin-bottom: 0.5rem; padding: 0.75rem; border-radius: 6px; border: 1px solid; }
    .annotated-text-container { display: grid; grid-template-columns: 1fr 20px; gap: 1rem; }
    .annotated-text { background-color: #111827; padding: 1rem; border-radius: 8px; white-space: pre-wrap; word-wrap: break-word; line-height: 1.7; max-height: 70vh; overflow: auto;}
    .heat-bar { position: relative; height: 100%; background-color: #4b5563; border-radius: 9999px; }
    .heat-segment { position: absolute; width: 100%; border-radius: 9999px; }
    .highlight { border-radius: 0.25rem; padding: 0.1rem 0.2rem; }
</style>
`;

const renderHeatScore = (heat: number): string => {
    const hue = (1 - (heat / 10)) * 120;
    return `
        <div style="margin-top: 1rem;">
            <p style="font-size: 0.8rem; margin: 0 0 0.25rem 0;">Rhetorical Heat: ${heat}/10</p>
            <div style="width: 100%; background-color: #4b5563; border-radius: 9999px; height: 0.5rem;">
                <div style="height: 0.5rem; border-radius: 9999px; width: ${heat * 10}%; background-color: hsl(${hue}, 90%, 55%);"></div>
            </div>
        </div>
    `;
};


const renderTechniqueCard = (item: PersuasiveTechnique | LogicalFallacy): string => {
    const title = 'technique' in item ? item.technique : item.fallacy;
    return `
        <div class="card">
            <h4>${simpleSanitize(title)}</h4>
            <blockquote class="quote">${simpleSanitize(item.example)}</blockquote>
            <p>${simpleSanitize(item.explanation)}</p>
            ${renderHeatScore(item.rhetoricalHeat)}
        </div>
    `;
};

const renderAnnotatedText = (text: string, analysis: TextAnalysis): string => {
    const techniques = [...analysis.persuasiveTechniques, ...analysis.logicalFallacies];
    if (!text || techniques.length === 0) return `<div class="annotated-text">${simpleSanitize(text)}</div>`;

    const normalize = (txt: string) => txt.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ');

    const examples = techniques.map((t, i) => ({
        text: t.example,
        normalizedText: normalize(t.example),
        originalIndex: i,
        heat: t.rhetoricalHeat,
        tooltip: 'technique' in t ? `${t.technique}: ${t.explanation}` : `${t.fallacy}: ${t.explanation}`,
    })).filter(e => e.normalizedText.length > 0);

    const normalizedSource = normalize(text);
    let matches: { start: number, end: number, data: typeof examples[0] }[] = [];
    examples.forEach(example => {
        let lastIndex = -1;
        while ((lastIndex = normalizedSource.indexOf(example.normalizedText, lastIndex + 1)) !== -1) {
            matches.push({ start: lastIndex, end: lastIndex + example.normalizedText.length, data: example });
        }
    });

    matches.sort((a, b) => (b.end - b.start) - (a.end - a.start));
    const finalAnnotations: typeof matches = [];
    const covered = new Array(normalizedSource.length).fill(false);
    matches.forEach(match => {
        if (!covered.slice(match.start, match.end).some(v => v)) {
            finalAnnotations.push(match);
            for (let i = match.start; i < match.end; i++) covered[i] = true;
        }
    });
    finalAnnotations.sort((a, b) => a.start - b.start);

    let html = '';
    let lastIndex = 0;
    finalAnnotations.forEach(match => {
        html += simpleSanitize(text.substring(lastIndex, match.start));
        const originalExampleText = text.substring(match.start, match.end);
        html += `<span class="highlight" style="background-color: ${getHeatColor(match.data.heat)}33;" title="${simpleSanitize(match.data.tooltip)}">${simpleSanitize(originalExampleText)}</span>`;
        lastIndex = match.end;
    });
    html += simpleSanitize(text.substring(lastIndex));

    let heatBarHtml = '<div class="heat-bar">';
    finalAnnotations.forEach(annotation => {
        const top = (annotation.start / normalizedSource.length) * 100;
        const height = ((annotation.end - annotation.start) / normalizedSource.length) * 100;
        heatBarHtml += `<div class="heat-segment" style="top: ${top}%; height: ${height}%; background-color: ${getHeatColor(annotation.data.heat)};" title="${simpleSanitize(annotation.data.tooltip)}"></div>`;
    });
    heatBarHtml += '</div>';

    return `<div class="annotated-text-container"><div class="annotated-text">${html}</div>${heatBarHtml}</div>`;
};


const renderAccordionTab = (title: string, content: string, isOpen: boolean = false): string => `
<details ${isOpen ? 'open' : ''}>
    <summary>${title}</summary>
    <div class="details-content">
        ${content}
    </div>
</details>
`;

const renderTextAnalysis = (analysis: TextAnalysis): { detailedContent: string; simplifiedContent: string; plainContent: string; neuroContent: string; } => {
    let detailedContent = `
        <h2>Overall Thesis</h2><p>${simpleSanitize(analysis.overallThesis)}</p>
        <h2>Original Text Tone Assessment</h2>
        <div class="card-grid">
            ${Object.entries(analysis.initialSliderPositions).map(([key, value]) => `
                <div class="card" style="text-align: center;">
                    <p style="text-transform: capitalize; margin:0; color: #a5b4fc;">${key}</p>
                    <p style="font-size: 2rem; font-weight: bold; margin:0;">${value}</p>
                </div>
            `).join('')}
        </div>
    `;
    if (analysis.personalizedFeedback) {
        detailedContent += `
            <h2>Personalized Feedback</h2>
            <h4>General Observations</h4><p>${simpleSanitize(analysis.personalizedFeedback.generalObservations)}</p>
            <h4>Potential Triggers</h4><ul>${analysis.personalizedFeedback.potentialTriggers.map(t => `<li>${simpleSanitize(t)}</li>`).join('')}</ul>
            <h4>Identity Appeals</h4><ul>${analysis.personalizedFeedback.identityAppeals.map(a => `<li>${simpleSanitize(a)}</li>`).join('')}</ul>
        `;
    }
    detailedContent += `
        <h2>Persuasive Techniques</h2><div class="card-grid">${analysis.persuasiveTechniques.map(renderTechniqueCard).join('')}</div>
        <h2>Logical Fallacies</h2>${analysis.logicalFallacies.length > 0 ? `<div class="card-grid">${analysis.logicalFallacies.map(renderTechniqueCard).join('')}</div>` : '<p>No significant logical fallacies were detected.</p>'}
        <h2>Target Audience</h2><p>${simpleSanitize(analysis.targetAudience)}</p>
        <h2>Potential Biases</h2><ul>${analysis.potentialBiases.map(bias => `<li>${simpleSanitize(bias)}</li>`).join('')}</ul>
        <h2>Socratic Questions</h2><ul>${analysis.socraticQuestions.map(q => `<li>${simpleSanitize(q)}</li>`).join('')}</ul>
        <h2>Neutralized Version</h2><pre class="annotated-text" style="background-color: #111827;">${simpleSanitize(analysis.neutralizedText)}</pre>
    `;

    const simplifiedContent = `
        <h2>Key Takeaway 💡</h2><p>${simpleSanitize(analysis.simplifiedAnalysis.keyTakeaway)}</p>
        <h2>What's the Main Idea? 🤔</h2><p>${simpleSanitize(analysis.simplifiedAnalysis.simplifiedThesis)}</p>
        <h3>Tricky Ways the Text Tries to Convince You 🧐</h3>${analysis.simplifiedAnalysis.simplifiedTechniques.map(t => `<div class="card"><h4>${simpleSanitize(t.friendlyName)}</h4><p>${simpleSanitize(t.simpleExplanation)}</p><blockquote class="quote">${simpleSanitize(t.example)}</blockquote></div>`).join('')}
        <h3>Sneaky Arguments to Watch Out For! 🕵️‍♀️</h3>${analysis.simplifiedAnalysis.simplifiedFallacies.map(f => `<div class="card"><h4>${simpleSanitize(f.friendlyName)}</h4><p>${simpleSanitize(f.simpleExplanation)}</p><blockquote class="quote">${simpleSanitize(f.example)}</blockquote></div>`).join('')}
    `;

    const plainContent = `
        <h2>The Bottom Line</h2><p>${simpleSanitize(analysis.plainLanguageAnalysis.mainPoint)}</p>
        <h2>The Main Argument</h2><p>${simpleSanitize(analysis.plainLanguageAnalysis.plainThesis)}</p>
        <h3>Persuasion Methods Used</h3>${analysis.plainLanguageAnalysis.plainTechniques.map(t => `<div class="card"><h4>${simpleSanitize(t.name)}</h4><p>${simpleSanitize(t.explanation)}</p><blockquote class="quote">${simpleSanitize(t.example)}</blockquote></div>`).join('')}
        <h3>Arguments That Might Be Misleading</h3>${analysis.plainLanguageAnalysis.plainFallacies.map(f => `<div class="card"><h4>${simpleSanitize(f.name)}</h4><p>${simpleSanitize(f.explanation)}</p><blockquote class="quote">${simpleSanitize(f.example)}</blockquote></div>`).join('')}
    `;

    const neuroContent = `
        <h2>Summary of Unspoken Social Cues</h2><p>${simpleSanitize(analysis.neurodivergentAnalysis.socialCueSummary)}</p>
        <h2>The Literal Point of the Text</h2><p>${simpleSanitize(analysis.neurodivergentAnalysis.literalThesis)}</p>
        <h3>Explaining Non-Literal Language</h3>${analysis.neurodivergentAnalysis.explainedTechniques.map(t => `<div class="card"><h4>${simpleSanitize(t.name)}</h4><p>${simpleSanitize(t.literalExplanation)}</p><blockquote class="quote">${simpleSanitize(t.example)}</blockquote></div>`).join('')}
        <h3>Explaining Flaws in Logic</h3>${analysis.neurodivergentAnalysis.explainedFallacies.map(f => `<div class="card"><h4>${simpleSanitize(f.name)}</h4><p>${simpleSanitize(f.literalExplanation)}</p><blockquote class="quote">${simpleSanitize(f.example)}</blockquote></div>`).join('')}
    `;

    return { detailedContent, simplifiedContent, plainContent, neuroContent };
};

const renderConversationAnalysis = (analysis: ConversationAnalysis): string => `
    <div>${analysis.heatmap.map(point => `
        <div class="heatmap-item" style="background-color: ${getIntensityColor(point.intensity)}; border-color: ${getIntensityColor(point.intensity).replace('0.6', '1')};">
            <p style="font-weight: bold; margin: 0 0 0.5rem 0;">${simpleSanitize(point.speaker || 'Unknown Speaker')}:</p>
            <p style="margin: 0;">${simpleSanitize(point.segment)}</p>
            <p style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.75rem;"><em>Reasoning: ${simpleSanitize(point.reasoning)}</em></p>
        </div>
    `).join('')}</div>
`;

const renderReferenceGuides = (): string => {
    const devicesHtml = rhetoricalDevices.map(d => `<div class="card"><h4>${d.name}</h4><p><strong>Detailed:</strong> ${d.detailed}</p><p><strong>Plain Language:</strong> ${d.plain}</p><p><strong>For Students:</strong> ${d.student}</p></div>`).join('');
    const fallaciesHtml = logicalFallacies.map(f => `<div class="card"><h4>${f.name}</h4><p><strong>Detailed:</strong> ${f.detailed}</p><p><strong>Plain Language:</strong> ${f.plain}</p><p><strong>For Students:</strong> ${f.student}</p></div>`).join('');
    return `
        ${renderAccordionTab('Rhetorical Devices Guide', `<div class="card-grid">${devicesHtml}</div>`)}
        ${renderAccordionTab('Logical Fallacies Guide', `<div class="card-grid">${fallaciesHtml}</div>`)}
    `;
};

const renderAboutSection = () => `
    <p>This report was generated by the Rhetorical Analysis AI tool. It uses Google's Gemini AI to analyze how an argument is constructed, revealing the persuasive techniques, logical structures, and potential biases at play. Its goal is to foster critical thinking by showing you how a text works to convince you, not just what it says.</p>
    <h3>Important Limitations</h3>
    <ul>
        <li><strong>This is NOT a fact-checker.</strong> The tool analyzes the structure and style of an argument, not the truthfulness of its claims.</li>
        <li><strong>The AI is not infallible.</strong> Use its analysis as a starting point for your own critical thinking, not as a final, definitive judgment.</li>
        <li><strong>Context is key.</strong> The tool analyzes the text you provide in isolation. Always consider the broader context.</li>
    </ul>
`;


export const exportAnalysisToHtml = (analysis: AnalysisResult, originalText: string, title: string): string => {
    const sanitizedTitle = simpleSanitize(title || 'Rhetorical Analysis Report');
    let analysisContentHtml = '';

    if (analysis.isConversation && analysis.conversationAnalysis) {
        analysisContentHtml = renderAccordionTab('Conversation Heatmap', renderConversationAnalysis(analysis.conversationAnalysis), true);
    } else if (analysis.textAnalysis) {
        const { detailedContent, simplifiedContent, plainContent, neuroContent } = renderTextAnalysis(analysis.textAnalysis);
        const annotatedContent = renderAnnotatedText(originalText, analysis.textAnalysis);
        analysisContentHtml = `
            ${renderAccordionTab('Annotated Text & Heatmap', annotatedContent, true)}
            ${renderAccordionTab('Detailed Analysis', detailedContent)}
            ${renderAccordionTab('For Students', simplifiedContent)}
            ${renderAccordionTab('Plain Language', plainContent)}
            ${renderAccordionTab('Neurodivergent-Friendly', neuroContent)}
        `;
    } else {
        analysisContentHtml = '<p>No analysis data available.</p>';
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${sanitizedTitle}</title>
    ${generateStylesAndScript()}
</head>
<body>
    <div class="container">
        <h1>${sanitizedTitle}</h1>
        ${analysisContentHtml}
        ${renderReferenceGuides()}
        ${renderAccordionTab('About This Tool & Report', renderAboutSection())}
    </div>
</body>
</html>`;
};