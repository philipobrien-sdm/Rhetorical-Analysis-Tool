# Rhetorical Analysis AI - Functional Specification

## 1. Introduction

This document describes the functional requirements of the Rhetorical Analysis AI tool. It defines the features, user interactions, and expected behaviors of the application from a user's perspective, without detailing the underlying technical implementation.

## 2. Core Functionality

### F1. Text Input & Analysis Initiation

-   **F1.1 Manual Text Input:** The user shall be able to paste text into a dedicated text area.
    -   **F1.1.1 Character Minimum:** Analysis buttons shall be disabled until a minimum of 200 characters of text is entered.
-   **F1.2 Extension-based Text Input:** When run as a browser extension, a button ("Analyze Current Page") shall be available.
    -   **F1.2.1:** Clicking this button shall extract the primary text content from the user's active browser tab and populate the text area.
-   **F1.3 Analysis Title:** The user shall be able to provide an optional title for their analysis in a dedicated text input field. If left blank, a title will be auto-generated for the history entry.
-   **F1.4 Analysis Triggers:** Two distinct buttons shall be available to initiate an analysis:
    -   **"Run Generic Analysis":** Initiates a standard analysis of the text.
    -   **"Run Personalized Analysis":** Initiates an analysis that considers the user's saved profile. This button shall be disabled if no user profile is saved.

### F2. Analysis Results Display

-   **F2.1 View Switching:** The application shall automatically switch from the input form to a results view upon successful completion of an analysis.
-   **F2.2 Context-Aware Display:** The results view shall adapt based on the type of text analyzed.
    -   **F2.2.1 Article/Monologue:** A multi-tabbed interface shall be displayed.
    -   **F2.2.2 Conversation/Dialogue:** A Conversation Heatmap view shall be displayed.

### F3. Article Analysis View (Multi-Tab Interface)

-   **F3.1 Detailed Analysis Tab:** This tab shall display a comprehensive breakdown of the text, including:
    -   Overall Thesis
    -   Key Claims
    -   Persuasive Techniques (with examples, explanations, and "Rhetorical Heat" scores)
    -   Logical Fallacies (with examples, explanations, and "Rhetorical Heat" scores)
    -   Target Audience
    -   Potential Biases
    -   Socratic Questions
    -   Neutralized Version of the text
    -   Personalized Feedback (if a personalized analysis was run)
-   **F3.2 For Students Tab:** This tab shall present the analysis in simplified, engaging language suitable for a younger audience.
-   **F3.3 Plain Language Tab:** This tab shall present the analysis using simple, direct language suitable for an average adult reader.
-   **F3.4 Neurodivergent-Friendly Tab:** This tab shall present the analysis using literal language, explicitly explaining idioms, non-literal phrases, and implied social cues.
-   **F3.5 Sculpt & Rewrite Tab:** This tab shall provide the generative text rewriting interface (see F5).

### F4. Conversation Analysis View

-   **F4.1 Conversation Heatmap:** A visual representation of the dialogue shall be displayed.
    -   **F4.1.1:** Each turn of the conversation shall be a distinct block.
    -   **F4.1.2:** The background color of each block shall represent its rhetorical/emotional intensity (cool colors for low, hot colors for high).
    -   **F4.1.3:** Hovering over a block shall display a tooltip with the AI's reasoning for the assigned intensity score.
-   **F4.2 Rewrite Interface:** Below the heatmap, the conversation-specific "Sculpt & Rewrite" interface shall be displayed (see F5).

### F5. Text Sculpting & Rewriting

-   **F5.1 Context-Aware Interface:** The rewrite interface shall change based on the text type.
    -   **F5.1.1 Article Rewriting:** The user shall be presented with four sliders (Professionalism, Emotionality, Proximity, Intensity) pre-populated with the AI's assessment of the original text. The user can adjust these sliders and click "Rewrite Text" to generate a new version.
    -   **F5.1.2 Conversation Rewriting:** The user shall be presented with a text input box to enter a "what if" scenario. Clicking "Rewrite Conversation" shall generate a new version of the dialogue based on the scenario.

### F6. User Personalization

-   **F6.1 Opt-In Panel:** A collapsible panel, hidden by default, shall allow users to access personalization settings.
-   **F6.2 Profile Form:** The user shall be able to enter and save demographic data (Age, Gender, etc.) into a form.
-   **F6.3 Local Storage:** All profile data shall be stored exclusively in the user's browser local storage. A clear privacy notice shall be displayed.
-   **F6.4 Data Management:** The user shall be able to save their profile or clear all saved data at any time.
-   **F6.5 Personalized Feedback:** When a personalized analysis is run, a dedicated "Personalized Feedback" section shall appear in the "Detailed Analysis" tab.

### F7. History Management

-   **F7.1 Automatic Saving:** Every successful analysis shall be automatically saved to the user's history.
-   **F7.2 History Panel:** A collapsible panel shall display a list of all saved analyses, sorted from newest to oldest.
-   **F7.3 History Actions:** From the history panel, the user shall be able to:
    -   **Load:** Instantly load a previous analysis result.
    -   **Rename:** Change the name of a saved analysis.
    -   **Delete:** Permanently remove an analysis from the history.

### F8. Reporting & Data Export

-   **F8.1 View Raw JSON:** A button shall be available in the results view to toggle the visibility of the raw JSON response received from the AI.
-   **F8.2 Export to HTML:** A button shall be available to generate and download a self-contained, interactive HTML report of the analysis.
    -   **F8.2.1:** The HTML report shall contain all analysis views (Detailed, Simplified, etc.) in a collapsible accordion format.
    -   **F8.2.2:** The report shall also include built-in reference guides for rhetorical devices and logical fallacies.

### F9. General UI/UX

-   **F9.1 Loading State:** The application shall display a clear loading indicator during AI processing.
-   **F9.2 Error State:** In case of an API or application error, a clear error message shall be displayed to the user.
-   **F9.3 Reset:** A "Start New Analysis" button in the results view shall allow the user to return to the main input form, clearing the current state.