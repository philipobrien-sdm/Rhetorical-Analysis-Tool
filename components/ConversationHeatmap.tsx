import React from 'react';
import type { ConversationAnalysis } from '../types';

interface ConversationHeatmapProps {
  data: ConversationAnalysis;
  t: (key: string) => string;
}

// Function to get color based on intensity score (1-10)
const getIntensityColor = (intensity: number) => {
  // We'll map intensity to a hue value.
  // Lower intensity (1) should be cool (e.g., blue, hue ~240)
  // Higher intensity (10) should be hot (e.g., red, hue ~0)
  const hue = 240 - (intensity - 1) * (240 / 9); // Scale from 240 down to 0
  
  // Using HSL for better color control.
  // We keep saturation high and lightness around 50% for vibrant colors.
  // We'll add some transparency.
  return `hsla(${hue}, 70%, 50%, 0.6)`;
};

export const ConversationHeatmap: React.FC<ConversationHeatmapProps> = ({ data, t }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-semibold text-indigo-400 mb-3">{t('conversationHeatmap')}</h3>
        <p className="text-slate-400 text-sm">
          {t('heatmapDescription')}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 p-3 bg-slate-900/50 rounded-md text-xs text-slate-300">
        <span>{t('lowIntensity')}</span>
        <div className="flex-1 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #4338ca, #15803d, #facc15, #dc2626)' }}></div>
        <span>{t('highIntensity')}</span>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto p-1">
        {data.heatmap.map((point, index) => (
          <div
            key={index}
            className="p-3 rounded-lg transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg hover:scale-[1.01]"
            style={{
              backgroundColor: getIntensityColor(point.intensity),
              border: `1px solid ${getIntensityColor(point.intensity).replace('0.6', '1')}`,
            }}
            title={`[${t('intensity')}: ${point.intensity}/10] ${point.reasoning}`}
          >
            <p className="font-bold text-slate-100">
              {point.speaker || t('unknownSpeaker')}:
            </p>
            <p className="text-slate-200">{point.segment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};