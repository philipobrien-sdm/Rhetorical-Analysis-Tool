# Rhetorical Analysis AI

**Uncover the art of persuasion in any text.**

Rhetorical Analysis AI is a powerful web application and browser extension that acts as a pair of "X-ray glasses" for text. It uses the Google Gemini API to dissect articles, speeches, or conversations, revealing the hidden machinery of persuasion. Instead of just telling you *what* a text says, this tool shows you *how* it's working to influence your opinion, fostering critical thinking and media literacy.

![Rhetorical Analysis AI Interface Showcase](https://storage.googleapis.com/aistudio-o-prd-public-visual-assets/readme_images/rhetorical-analysis-showcase.png)

---

## ✨ Key Features

*   **Comprehensive Rhetorical Analysis:** Identifies persuasive techniques (Metaphor, Anaphora, etc.) and logical fallacies (Ad Hominem, Straw Man, etc.) with verbatim examples from the text.
*   **Multiple Analytical Perspectives:** Presents the analysis through different "lenses":
    *   **Annotated Text:** Interactively highlights rhetorical devices directly in the original text.
    *   **Detailed Analysis:** An in-depth, expert-level breakdown.
    *   **For Students:** A simplified, engaging summary for younger learners.
    *   **Plain Language:** A clear, jargon-free version for the average reader.
    *   **Neurodivergent-Friendly:** A literal interpretation that explains unspoken social cues and non-literal language.
*   **Conversation Heatmap:** For dialogues, it generates a color-coded visualization to show where the rhetorical and emotional intensity rises and falls.
*   **Text Sculptor & Rewriter:** A generative AI feature to rewrite the original text by adjusting its tone (professionalism, emotionality) or by providing a "what if" scenario for conversations.
*   **Optional Personalization:** Users can optionally provide a demographic profile (stored locally) to receive feedback on how the text's rhetoric might specifically affect them.
*   **Browser Extension Mode:** Analyze any webpage with the click of a button.
*   **History & Export:** Automatically saves every analysis to local history and allows exporting a full, self-contained HTML report.

## ⚙️ How It Works

The application is built with **React** and **TypeScript**. Its core intelligence comes from the **Google Gemini API**.

-   **Analysis:** A sophisticated, multi-part prompt is sent to the `gemini-2.5-pro` model, requesting a structured JSON output that contains the entire analysis.
-   **Rewriting:** Simpler generative tasks are handled by the faster `gemini-2.5-flash` model.

All user data, including analysis history and optional personalization profiles, is stored **exclusively in the user's browser local storage**.

---

## 🚀 Installation and Setup in Google AI Studio

Follow these steps to download the code and run your own instance of the application in Google AI Studio.

### Prerequisites

1.  **Google Account:** You need a Google account to use Google AI Studio.
2.  **Gemini API Key:** The application requires your own Gemini API key to function.
    *   Go to [Google AI Studio](https://aistudio.google.com/).
    *   Click on **"Get API key"** in the top-left menu.
    *   Follow the instructions to create a new API key.
    *   **Copy and save this key somewhere safe.** You will need it in Step 3.

### Step 1: Download the Project from GitHub

1.  On this GitHub repository page, click the green **`< > Code`** button.
2.  In the dropdown menu, select **"Download ZIP"**.
3.  Save the ZIP file to your computer and unzip it. You will now have a folder named something like `rhetorical-analysis-ai-main`.

### Step 2: Prepare the ZIP for AI Studio

This is the most important step. AI Studio requires the `index.html` file to be at the top level of the zip file, but the GitHub download puts it inside a folder. You must re-zip the core files.

1.  **Open the folder.** Navigate *inside* the unzipped `rhetorical-analysis-ai-main` folder. You should see all the project files and folders (`index.html`, `App.tsx`, `components`, etc.).
2.  **Select the application files.** Select all the files and folders *inside this directory* that are needed for the app.
    *   **Include:**
        *   `App.tsx`
        *   `components/` (folder)
        *   `index.css`
        *   `index.html`
        *   `index.tsx`
        *   `manifest.json`
        *   `metadata.json`
        *   `services/` (folder)
        *   `types.ts`
        *   `README.md`
    *   **Do not** go back up and select the parent folder. Stay *inside* the `rhetorical-analysis-ai-main` folder.
3.  **Create the new ZIP file.** With all the app files selected, right-click and choose:
    *   **Windows:** "Send to" > "Compressed (zipped) folder".
    *   **Mac:** "Compress [X] items".
4.  Rename the new ZIP file to something clear, like `aistudio-rhetorical-analysis-upload.zip`.

> **CRITICAL:** By zipping the contents directly, you ensure that `index.html` is at the root of your new zip file, which is what AI Studio needs.

### Step 3: Upload and Run in AI Studio

1.  **Go to the Google AI Studio App Gallery:** Open your web browser and navigate to [aistudio.google.com/app](https://aistudio.google.com/app).
2.  **Create a New App:** Click **"Create new"** and select **"Zip upload"**.
3.  **Upload Your ZIP:** Select the `aistudio-rhetorical-analysis-upload.zip` file you created in the previous step. AI Studio will build the project and launch the application.
4.  **Add Your API Key:**
    *   Once the project is loaded, locate the **"Secrets"** panel on the left-hand side (it looks like a key icon 🔑).
    *   Click **"Add new secret"**.
    *   For the **Name**, enter `API_KEY` (this must be exact).
    *   For the **Value**, paste the Gemini API key you obtained in the Prerequisites step.
    *   Click **Save**.

Your application is now set up and ready to use! You can run it, test it, and share it using the options provided by AI Studio.

## 📖 Basic Usage

1.  **Input Text:** Either paste text directly into the text area or use one of the provided examples from the dropdown.
2.  **Analyze:** Click "Run Generic Analysis" to start.
3.  **Explore:** Use the tabs to view the analysis from different perspectives.
4.  **Rewrite:** Navigate to the "Sculpt & Rewrite" tab to experiment with generative text rewriting.

## 🔒 Privacy

-   **API Key:** Your API key is managed securely by Google AI Studio's secrets manager and is never exposed in the client-side code.
-   **User Data:** The optional user profile and all analysis history are stored **only** in your browser's local storage. This data is never transmitted to any server, except when you initiate a personalized analysis, where the profile is sent temporarily to the Gemini API for that single request.

## ⚖️ Disclaimer

This tool is designed to be an educational aid for fostering critical thinking.
-   **It is NOT a fact-checker.** It analyzes *how* an argument is made, not whether its claims are true.
-   **The AI is not infallible.** Use its analysis as a starting point for your own judgment, not as a definitive verdict.