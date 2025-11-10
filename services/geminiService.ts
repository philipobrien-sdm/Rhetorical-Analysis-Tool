import { GoogleGenAI } from "@google/genai";
import type {
  AnalysisResult,
  RewriteParams,
  UserProfile,
  TextAnalysis,
  ConversationAnalysis,
} from '../types';

// Per guidelines, initialize with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSystemInstruction = `
You are an expert in rhetoric, communication, and cognitive psychology. You are hyper-critical and exhaustive in your analysis.
Your task is to analyze a given text for its persuasive elements, logical structure, and potential biases.
First, you MUST determine if the text is a monologue/article OR a conversation/dialogue.
- A conversation has multiple speakers, usually indicated by labels like "Name:", "Speaker 1:", etc., and turn-taking.
- An article/monologue is a continuous piece of text from a single perspective.

For EVERY persuasive technique and logical fallacy you identify in ALL sections (detailed, simplified, plain language, neurodivergent), you MUST provide a direct, verbatim, non-empty "example" quote from the source text.

Based on your determination, you MUST return a single JSON object that strictly adheres to ONE of the two schemas provided in the user prompt. Do not add any extra text, preamble, or markdown formatting around the JSON object. Your entire output must be only the raw JSON.
`;

export const analyzeText = async (
  text: string,
  type: 'generic' | 'personalized',
  userProfile: UserProfile | null
): Promise<AnalysisResult> => {
    let personalizedPromptPart = '';
    if (type === 'personalized' && userProfile) {
        const profileString = Object.entries(userProfile)
            .filter(([, value]) => value && value.trim() !== '')
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');

        if (profileString) {
             personalizedPromptPart = `
                Additionally, because this is a personalized analysis, you MUST include a "personalizedFeedback" object within the text analysis JSON.
                Analyze how the text might specifically affect a person with the following profile: ${profileString}.
                Focus on potential emotional triggers, identity-based appeals, and manipulative language that could be particularly effective or alienating for this individual.
                IMPORTANT: Do NOT stereotype. Base your analysis on how the text's rhetoric might intersect with the provided identity markers, not on assumptions about the person.
                The "personalizedFeedback" object should contain: "potentialTriggers" (array of strings), "identityAppeals" (array of strings), and "generalObservations" (string).
            `;
        }
    }

    const prompt = `
    Analyze the provided text and determine if it is a conversation or an article/monologue.
    Based on that, return a single JSON object conforming to the appropriate structure. Be exhaustive and hyper-critical in your analysis, especially when looking for logical fallacies.

    ${personalizedPromptPart}

    **If the text is a conversation (multiple speakers):**
    Return JSON with a single key "heatmap", which is an array of objects. You MUST process the conversation sequentially and create a heatmap entry for EVERY single line of dialogue without skipping any. Each object must have:
    - "segment" (string): The verbatim quote from the dialogue turn.
    - "speaker" (string, optional): The speaker's name.
    - "intensity" (number 1-10): The rhetorical/emotional intensity of this specific segment.
    - "reasoning" (string): A brief justification for the assigned intensity score.

    **If the text is an article/monologue:**
    Return a large JSON object with the following keys. For EVERY technique/fallacy in EVERY analysis section, the "example" field MUST be a non-empty, verbatim quote from the source text.
    - "overallThesis" (string)
    - "keyClaims" (array of strings)
    - "persuasiveTechniques" (array of objects with "technique", "example", "explanation", "rhetoricalHeat" which is a number 1-10)
    - "logicalFallacies" (array of objects with "fallacy", "example", "explanation", "rhetoricalHeat" which is a number 1-10)
    - "targetAudience" (string)
    - "potentialBiases" (array of strings)
    - "socraticQuestions" (array of strings to challenge the text)
    - "neutralizedText" (string, a rewritten neutral version of the text. This version MUST include inline annotations in brackets, like this: [Suppressed: Name of technique]. These annotations should explain which specific rhetorical devices or biases from the original text were removed to achieve neutrality. For example: 'The policy was implemented [Suppressed: Loaded Language "disastrous"].')
    - "initialSliderPositions" (object with "professionalism", "emotionality", "proximity", "intensity" as numbers from 0-100)
    - "simplifiedAnalysis" (object with "simplifiedThesis", "simplifiedTechniques" array of objects with "friendlyName", "example", and "simpleExplanation", "simplifiedFallacies" array of objects with "friendlyName", "example", and "simpleExplanation", "keyTakeaway")
    - "plainLanguageAnalysis" (object with "plainThesis", "plainTechniques" array of objects with "name", "example", and "explanation", "plainFallacies" array of objects with "name", "example", and "explanation", "mainPoint")
    - "neurodivergentAnalysis" (object with "literalThesis", "explainedTechniques" array of objects with "name", "example", and "literalExplanation", "explainedFallacies" array of objects with "name", "example", and "literalExplanation", "socialCueSummary")
    ${
      personalizedPromptPart
        ? '- "personalizedFeedback" (object with "potentialTriggers", "identityAppeals", "generalObservations")'
        : ''
    }

    The text to analyze is below:
    ---
    ${text}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                systemInstruction: analysisSystemInstruction,
                responseMimeType: 'application/json'
            }
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        if (parsed.heatmap) {
            return {
                isConversation: true,
                conversationAnalysis: parsed as ConversationAnalysis,
                textAnalysis: undefined
            };
        } else if (parsed.overallThesis) {
            return {
                isConversation: false,
                textAnalysis: parsed as TextAnalysis,
                conversationAnalysis: undefined
            };
        } else {
            throw new Error("Analysis failed: AI response did not contain the expected 'heatmap' or 'overallThesis' keys.");
        }
    } catch (e: any) {
        console.error("Gemini API call or JSON parsing failed:", e);
        if (e.message.includes('JSON')) {
            throw new Error("Failed to get a valid analysis from the AI. The response was not valid JSON.");
        }
        throw new Error("An error occurred during AI analysis. The service may be temporarily unavailable.");
    }
};

export const rewriteText = async (
  originalText: string,
  params: RewriteParams
): Promise<string> => {
  const model = "gemini-2.5-flash"; // Rewriting is a less complex task.
  const prompt = `
    You are an expert editor. Rewrite the following text based on the provided parameters.
    Preserve the core meaning and key information, but adjust the tone, style, and delivery.

    Parameters (0-100 scale):
    - Professionalism: ${params.professionalism} (0=very casual, 100=highly formal, academic)
    - Emotionality: ${params.emotionality} (0=objective, detached, 100=passionate, emotive)
    - Proximity: ${params.proximity} (0=distant, third-person, 100=close, personal, first/second-person)
    - Intensity: ${params.intensity} (0=gentle, suggestive, 100=assertive, forceful)

    Original Text:
    ---
    ${originalText}
    ---

    Return ONLY the rewritten text, with no preamble or explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini rewrite API call failed:", error);
    throw new Error("Failed to rewrite the text.");
  }
};


export const rewriteConversationWithPrompt = async (
    originalConversation: string,
    scenarioPrompt: string
): Promise<string> => {
    const model = "gemini-2.5-flash";
    const prompt = `
        You are an expert scriptwriter. You will be given a conversation and a "what if" scenario.
        Your task is to rewrite the conversation to fit the new scenario.
        Try to keep the speakers' core personalities intact unless the scenario requires them to change.
        Maintain the format of the original conversation (e.g., "Speaker A:", "Speaker B:").

        Scenario: "${scenarioPrompt}"

        Original Conversation:
        ---
        ${originalConversation}
        ---

        Return ONLY the rewritten conversation script, with no preamble or explanation.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini conversation rewrite API call failed:", error);
        throw new Error("Failed to rewrite the conversation.");
    }
};