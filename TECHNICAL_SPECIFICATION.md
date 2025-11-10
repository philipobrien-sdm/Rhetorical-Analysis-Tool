# Rhetorical Analysis AI - Technical Specification

## 1. Overview

This document outlines the technical architecture, components, and AI integration for the Rhetorical Analysis AI application. The tool is a web-based application, designed to function as a browser extension, that uses the Google Gemini API to perform deep rhetorical and psychological analysis on user-provided text. It offers multiple analytical perspectives, generative text rewriting, and optional user personalization.

## 2. Core Technologies

-   **Frontend:** React (with JSX), TypeScript
-   **Styling:** Tailwind CSS (via CDN)
-   **AI Model:** Google Gemini API (`gemini-2.5-pro` for analysis, `gemini-2.5-flash` for rewriting)
-   **Local Storage:** Used for persisting analysis history and optional user profiles.

## 3. Application Flow

1.  **Input:** The user provides text by pasting it directly or, when run as an extension, by using the "Analyze Current Page" button. An optional title can be provided.
2.  **Personalization (Optional):** The user can expand a hidden panel to enter and save a demographic profile to their browser's local storage.
3.  **Analysis Request:** The user clicks either "Run Generic Analysis" or "Run Personalized Analysis." The latter is only enabled if a profile is saved.
4.  **API Call:** The frontend's `geminiService.ts` constructs a detailed prompt and schema. It sends the text (and optionally, the user profile) to the Gemini API.
5.  **AI Processing:** The Gemini API processes the text and returns a single, structured JSON object containing a comprehensive analysis tailored to the request.
6.  **Display:** The application receives the JSON, parses it, and renders the results. The UI adapts based on the content (article vs. conversation).
7.  **History:** The complete analysis result is saved to local storage for future access.
8.  **Interaction:** The user can explore different analysis tabs, interact with the conversation heatmap, or use the "Sculpt & Rewrite" feature to generate new versions of the text.
9.  **Export:** The user can export the full report as a self-contained, interactive HTML file.

## 4. Component Architecture

-   **`App.tsx` (Root Component):**
    -   Manages global state: `isLoading`, `error`, `analysisResult`, `history`, `userProfile`.
    -   Orchestrates the main application flow, switching between the input form and the results display.
    -   Handles logic for history management and browser extension interaction.

-   **`ArticleInputForm.tsx`:**
    -   Provides the main UI for text and title input.
    -   Contains the collapsible panel for the `UserProfileForm`.
    -   Renders two distinct analysis buttons ("Generic" and "Personalized").

-   **`UserProfileForm.tsx`:**
    -   A form for users to optionally enter and save personal demographic data.
    -   Interacts with `userService.ts` to persist data in local storage.
    -   Includes clear disclaimers about data privacy.

-   **`AnalysisDisplay.tsx`:**
    -   The main component for rendering analysis results.
    -   Conditionally renders specialized components (`ConversationHeatmap`) or a tabbed interface based on `analysisResult.isConversation`.
    -   The tabbed interface provides multiple views: Detailed, For Students, Plain Language, Neurodivergent-Friendly, and Sculpt & Rewrite.
    -   Contains action buttons for starting a new analysis, exporting to HTML, and viewing the raw JSON.

-   **`ConversationHeatmap.tsx`:**
    -   A specialized component for visualizing the rhetorical/emotional intensity of a dialogue, with interactive tooltips.

-   **`TextSculptor.tsx`:**
    -   A context-aware component for generative text rewriting.
    -   Renders sliders for standard text and a free-text "what if" prompt for conversations.

-   **`HistoryPanel.tsx` & `AboutPanel.tsx`:**
    -   Collapsible UI panels for displaying analysis history and information about the tool.

## 5. Services

-   **`geminiService.ts`:**
    -   The sole interface with the Google Gemini API.
    -   Contains the master system prompt and logic for dynamically constructing user prompts based on analysis type (generic/personalized, article/conversation).
    -   Defines the strict JSON schema that the AI's response must follow via `responseMimeType: 'application/json'`.
    -   Handles API errors and JSON parsing.

-   **`historyService.ts`:**
    -   Encapsulates all CRUD (Create, Read, Update, Delete) operations for the analysis history stored in `localStorage`.

-   **`userService.ts`:**
    -   Manages saving, retrieving, and clearing the user's demographic profile in `localStorage`.

-   **`htmlExportService.ts`:**
    -   Generates a self-contained, interactive HTML report string from the analysis data, including embedded CSS and JavaScript for interactivity (e.g., accordion tabs).

## 6. AI Prompt & Schema Engineering

The application's core intelligence relies on a highly-engineered system prompt sent to the `gemini-2.5-pro` model.

### 6.1. Analysis Prompt Strategy

The prompt is dynamically constructed and contains several key instructions:
1.  **Role Assignment:** The AI is assigned the persona of an expert in rhetoric, psychology, and communication, and is instructed to be "hyper-critical and exhaustive."
2.  **Primary Task:** The first step is to determine if the input is a conversation or an article. This dictates which JSON schema to use.
3.  **Strict Output Format:** The AI is commanded to return **only** a raw JSON object conforming to one of the provided structures, with no markdown or preamble.
4.  **Verbatim Examples:** A crucial instruction is that for every technique and fallacy identified in **all** analysis views, the `example` field must be a non-empty, verbatim quote from the source text. This is critical for the annotation feature.
5.  **Schema Definition:** The prompt details the entire JSON structure, including all keys and expected data types for both article and conversation analyses.
6.  **Personalization (Conditional):** If a `UserProfile` is provided, the prompt is appended with instructions to generate a `personalizedFeedback` object. This section includes a **critical warning** to the AI to avoid stereotyping and focus only on how the text's rhetoric might intersect with the user's stated identity markers.

### 6.2. Rewrite Prompts

-   **Slider-based (`gemini-2.5-flash`):** A straightforward prompt that provides the original text and a list of tonal parameters (e.g., "Professionalism: 80") and asks for a rewrite while preserving the core meaning.
-   **Conversation-based (`gemini-2.5-flash`):** A more creative prompt that frames the AI as a "scriptwriter," providing the original dialogue and a "what if" scenario from the user.

## 7. Data Models (`types.ts`)

-   **`AnalysisResult`:** A container object with `isConversation` (boolean) and two optional fields, `textAnalysis` and `conversationAnalysis`, ensuring only one is present.
-   **`TextAnalysis`:** A rich object containing all analytical data for an article, including nested objects for the different audience perspectives (`simplifiedAnalysis`, etc.) and an optional `personalizedFeedback` field.
-   **`UserProfile`:** A simple object structure for storing user demographic data. All fields are strings.
-   **`HistoryEntry`:** Encapsulates a single saved analysis, including the input text, title, and the resulting `AnalysisResult`.

## 8. Privacy & Security

-   **User Profile Data:** All personal information entered by the user is stored **exclusively in the browser's local storage**. It is never transmitted to any server or third party, with the sole exception of being included in the on-demand, temporary API call to Google Gemini for the purpose of generating a personalized analysis. The user has the ability to clear this data at any time.
-   **API Key:** The Gemini API key is managed by the execution environment (`process.env.API_KEY`) and is not stored or handled by the frontend application code.
-   **Extension Permissions:** The browser extension requests minimal permissions (`activeTab`, `scripting`) required to extract text from the user's current page.