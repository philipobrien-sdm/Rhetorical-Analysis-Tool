// services/i18n.ts
export const translations = {
    // App.tsx
    appTitle: {
        en: 'Rhetorical Analysis AI',
        es: 'IA de Análisis Retórico'
    },
    appSubtitle: {
        en: 'Uncover the art of persuasion in any text.',
        es: 'Descubre el arte de la persuasión en cualquier texto.'
    },
    analyzeCurrentPage: {
        en: 'Analyze Current Page',
        es: 'Analizar Página Actual'
    },
    footerDisclaimer: {
        en: 'Powered by Google Gemini. Analysis may not be 100% accurate. Always use critical thinking.',
        es: 'Impulsado por Google Gemini. El análisis puede no ser 100% preciso. Usa siempre el pensamiento crítico.'
    },
    analysisOf: {
        en: 'Analysis of',
        es: 'Análisis de'
    },
    unknownError: {
        en: 'An unknown error occurred during analysis.',
        es: 'Ocurrió un error desconocido durante el análisis.'
    },
    currentPageAnalysis: {
        en: 'Current Page Analysis',
        es: 'Análisis de la Página Actual'
    },
    couldNotExtractText: {
        en: 'Could not extract text from the page.',
        es: 'No se pudo extraer texto de la página.'
    },
    
    // ArticleInputForm.tsx
    analysisTitleLabel: {
        en: 'Analysis Title (Optional)',
        es: 'Título del Análisis (Opcional)'
    },
    analysisTitlePlaceholder: {
        en: "e.g., 'Smart Cities Article Analysis'",
        es: "p. ej., 'Análisis del Artículo de Ciudades Inteligentes'"
    },
    pasteTextPlaceholder: {
        en: 'Paste an article, essay, or conversation here... (minimum 200 characters)',
        es: 'Pega un artículo, ensayo o conversación aquí... (mínimo 200 caracteres)'
    },
    analyzing: {
        en: 'Analyzing...',
        es: 'Analizando...'
    },
    runGenericAnalysis: {
        en: 'Run Generic Analysis',
        es: 'Análisis Genérico'
    },
    runPersonalizedAnalysis: {
        en: 'Run Personalized Analysis',
        es: 'Análisis Personalizado'
    },
    enablePersonalizedAnalysisTooltip: {
        en: 'Save a user profile below to enable personalized analysis.',
        es: 'Guarda un perfil de usuario abajo para habilitar el análisis personalizado.'
    },
    characterMinimumWarning: {
        en: 'Please enter at least {{count}} more characters.',
        es: 'Por favor, introduce al menos {{count}} caracteres más.'
    },
    personalizeAnalysisLabel: {
        en: 'Personalize Analysis (Optional)',
        es: 'Personalizar Análisis (Opcional)'
    },

    // AnalysisDisplay.tsx
    analysisComplete: {
        en: 'Analysis Complete',
        es: 'Análisis Completo'
    },
    tabAnnotated: { en: 'Annotated Text', es: 'Texto Anotado' },
    tabDetailed: { en: 'Detailed Analysis', es: 'Análisis Detallado' },
    tabSimplified: { en: 'For Students', es: 'Para Estudiantes' },
    tabPlain: { en: 'Plain Language', es: 'Lenguaje Sencillo' },
    tabNeuro: { en: 'Neurodivergent-Friendly', es: 'Apto para Neurodivergentes' },
    tabSculpt: { en: 'Sculpt & Rewrite', es: 'Esculpir y Reescribir' },
    overallThesis: { en: 'Overall Thesis', es: 'Tesis General' },
    originalToneAssessment: { en: 'Original Text Tone Assessment', es: 'Evaluación del Tono del Texto Original' },
    professionalism: { en: 'Professionalism', es: 'Profesionalismo' },
    emotionality: { en: 'Emotionality', es: 'Emotividad' },
    proximity: { en: 'Proximity', es: 'Proximidad' },
    intensity: { en: 'Intensity', es: 'Intensidad' },
    personalizedFeedback: { en: 'Personalized Feedback', es: 'Feedback Personalizado' },
    personalizedFeedbackNotice: { en: 'This feedback is generated based on the optional profile you provided. It analyzes how the text\'s rhetoric might intersect with your background and should be seen as an interpretation, not a definitive judgment.', es: 'Este feedback se genera en base al perfil opcional que proporcionaste. Analiza cómo la retórica del texto podría cruzarse con tu trasfondo y debe ser visto como una interpretación, no como un juicio definitivo.' },
    generalObservations: { en: 'General Observations', es: 'Observaciones Generales' },
    potentialTriggers: { en: 'Potential Triggers', es: 'Potenciales Detonantes' },
    identityAppeals: { en: 'Identity Appeals', es: 'Apelaciones a la Identidad' },
    persuasiveTechniques: { en: 'Persuasive Techniques', es: 'Técnicas Persuasivas' },
    logicalFallacies: { en: 'Logical Fallacies', es: 'Falacias Lógicas' },
    noFallaciesDetected: { en: 'No significant logical fallacies were detected in this text.', es: 'No se detectaron falacias lógicas significativas en este texto.' },
    targetAudience: { en: 'Target Audience', es: 'Público Objetivo' },
    potentialBiases: { en: 'Potential Biases', es: 'Posibles Sesgos' },
    socraticQuestions: { en: 'Socratic Questions', es: 'Preguntas Socráticas' },
    neutralizedVersion: { en: 'Neutralized Version', es: 'Versión Neutralizada' },
    simplifiedKeyTakeaway: { en: 'Key Takeaway 💡', es: 'Conclusión Clave 💡' },
    simplifiedMainIdea: { en: "What's the Main Idea? 🤔", es: '¿Cuál es la Idea Principal? 🤔' },
    simplifiedTechniques: { en: 'Tricky Ways the Text Tries to Convince You 🧐', es: 'Formas Astutas en que el Texto Intenta Convencerte 🧐' },
    example: { en: 'Example', es: 'Ejemplo' },
    simplifiedFallacies: { en: 'Sneaky Arguments to Watch Out For! 🕵️‍♀️', es: '¡Argumentos Engañosos a Tener en Cuenta! 🕵️‍♀️' },
    plainBottomLine: { en: 'The Bottom Line', es: 'En Resumen' },
    plainMainArgument: { en: 'The Main Argument', es: 'El Argumento Principal' },
    plainPersuasionMethods: { en: 'Persuasion Methods Used', es: 'Métodos de Persuasión Usados' },
    plainMisleadingArguments: { en: 'Arguments That Might Be Misleading', es: 'Argumentos que Podrían Ser Engañosos' },
    neuroSocialCues: { en: 'Summary of Unspoken Social Cues', es: 'Resumen de Pistas Sociales Implícitas' },
    neuroLiteralPoint: { en: 'The Literal Point of the Text', es: 'El Significado Literal del Texto' },
    neuroNonLiteralLanguage: { en: 'Explaining Non-Literal Language', es: 'Explicación del Lenguaje No Literal' },
    neuroFlawsInLogic: { en: 'Explaining Flaws in Logic', es: 'Explicación de Fallos en la Lógica' },
    hideJson: { en: 'Hide Raw JSON', es: 'Ocultar JSON' },
    viewJson: { en: 'View Raw JSON', es: 'Ver JSON' },
    exportHtml: { en: 'Export to HTML', es: 'Exportar a HTML' },
    startNewAnalysis: { en: 'Start New Analysis', es: 'Nuevo Análisis' },
    rawJsonResponse: { en: 'Raw AI Response (JSON)', es: 'Respuesta de la IA (JSON)' },
    rhetoricalHeat: { en: 'Rhetorical Heat', es: 'Intensidad Retórica' },

    // ConversationHeatmap.tsx
    conversationHeatmap: { en: 'Conversation Heatmap', es: 'Mapa de Calor de la Conversación' },
    heatmapDescription: { en: 'This visualization highlights segments of the conversation with high rhetorical or emotional intensity. Colors range from cool blue (low intensity) to hot red (high intensity). Hover over a segment for the AI\'s reasoning.', es: 'Esta visualización resalta segmentos de la conversación con alta intensidad retórica o emocional. Los colores van de azul frío (baja intensidad) a rojo cálido (alta intensidad). Pasa el cursor sobre un segmento para ver el razonamiento de la IA.' },
    lowIntensity: { en: 'Low Intensity', es: 'Baja Intensidad' },
    highIntensity: { en: 'High Intensity', es: 'Alta Intensidad' },
    unknownSpeaker: { en: 'Unknown Speaker', es: 'Interlocutor Desconocido' },

    // TextSculptor.tsx
    rewriteConversation: { en: 'Rewrite Conversation', es: 'Reescribir Conversación' },
    rewriteConversationDescription: { en: 'Propose a "what if" scenario to rewrite the dialogue. The AI will act as a scriptwriter to modify the conversation while trying to maintain the speakers\' core personalities.', es: 'Propón un escenario hipotético para reescribir el diálogo. La IA actuará como un guionista para modificar la conversación intentando mantener las personalidades centrales de los interlocutores.' },
    scenarioPromptLabel: { en: 'Scenario Prompt', es: 'Escenario Propuesto' },
    scenarioPromptPlaceholder: { en: 'e.g., What if Speaker A was more apologetic? What if Speaker B revealed a secret?', es: 'p. ej., ¿Qué pasaría si el Interlocutor A se disculpara más? ¿Y si el Interlocutor B revelara un secreto?' },
    scenarioPromptError: { en: 'Please enter a "what if" scenario to guide the rewrite.', es: 'Por favor, introduce un escenario hipotético para guiar la reescritura.' },
    rewriting: { en: 'Rewriting...', es: 'Reescribiendo...' },
    rewrittenVersion: { en: 'Rewritten Version', es: 'Versión Reescribida' },
    textSculptor: { en: 'Text Sculptor', es: 'Escultor de Texto' },
    textSculptorDescription: { en: 'Adjust the sliders to rewrite the original text with a different tone and style. The AI will attempt to preserve the core meaning while changing the delivery.', es: 'Ajusta los deslizadores para reescribir el texto original con un tono y estilo diferentes. La IA intentará preservar el significado central mientras cambia la forma de expresarlo.' },
    professionalismDescription: { en: 'Adjusts the formality. Low is casual, high is formal.', es: 'Ajusta la formalidad. Bajo es casual, alto es formal.' },
    emotionalityDescription: { en: 'Adjusts emotional content. Low is logical/detached, high is passionate.', es: 'Ajusta el contenido emocional. Bajo es lógico/distante, alto es apasionado.' },
    proximityDescription: { en: 'Adjusts closeness to the reader. Low is distant/impersonal, high is close/personal.', es: 'Ajusta la cercanía al lector. Bajo es distante/impersonal, alto es cercano/personal.' },
    intensityDescription: { en: 'Adjusts the forcefulness of the language. Low is gentle, high is assertive/aggressive.', es: 'Ajusta la contundencia del lenguaje. Bajo es suave, alto es asertivo/agresivo.' },
    reset: { en: 'Reset', es: 'Reiniciar' },
    rewriteText: { en: 'Rewrite Text', es: 'Reescribir Texto' },

    // HistoryPanel.tsx
    analysisHistory: { en: 'Analysis History', es: 'Historial de Análisis' },
    rename: { en: 'Rename', es: 'Renombrar' },
    delete: { en: 'Delete', es: 'Eliminar' },
    renamePrompt: { en: 'Enter a new name for this analysis:', es: 'Introduce un nuevo nombre para este análisis:' },
    deleteConfirm: { en: 'Are you sure you want to delete this analysis? This action cannot be undone.', es: '¿Estás seguro de que quieres eliminar este análisis? Esta acción no se puede deshacer.' },

    // AboutPanel.tsx
    aboutThisTool: { en: 'About This Tool', es: 'Sobre esta Herramienta' },
    aboutHeading1: { en: 'What is this Tool?', es: '¿Qué es esta Herramienta?' },
    aboutParagraph1: { en: 'Rhetorical Analysis AI is a powerful tool designed to help you look "under the hood" of any text. It uses Google\'s Gemini AI to analyze how an argument is constructed, revealing the persuasive techniques, logical structures, and potential biases at play. Its goal is to foster critical thinking by showing you how a text works to convince you, not just what it says.', es: 'IA de Análisis Retórico es una herramienta poderosa diseñada para ayudarte a mirar "bajo el capó" de cualquier texto. Utiliza la IA Gemini de Google para analizar cómo se construye un argumento, revelando las técnicas persuasivas, estructuras lógicas y posibles sesgos en juego. Su objetivo es fomentar el pensamiento crítico mostrándote cómo funciona un texto para convencerte, no solo lo que dice.' },
    aboutCoreFeatures: { en: 'Core Features:', es: 'Características Principales:' },
    aboutFeature1Title: { en: 'Detailed Analysis', es: 'Análisis Detallado' },
    aboutFeature1Desc: { en: 'A comprehensive breakdown of the text\'s thesis, key claims, persuasive techniques, and logical fallacies, complete with a "Rhetorical Heat" score and an interactive heat bar.', es: 'Un desglose completo de la tesis del texto, afirmaciones clave, técnicas persuasivas y falacias lógicas, con una puntuación de "Intensidad Retórica" y una barra de calor interactiva.' },
    aboutFeature2Title: { en: 'Multiple Perspectives', es: 'Múltiples Perspectivas' },
    aboutFeature2Desc: { en: 'Special tabs translate the analysis into simple terms for students, plain language for the average adult, and a neurodivergent-friendly format that uses literal language to explain social cues.', es: 'Pestañas especiales traducen el análisis a términos sencillos para estudiantes, lenguaje llano para el adulto promedio, y un formato amigable para neurodivergentes que utiliza lenguaje literal para explicar señales sociales.' },
    aboutFeature3Title: { en: 'Conversation Heatmap', es: 'Mapa de Calor de Conversación' },
    aboutFeature3Desc: { en: 'If the text is a dialogue, the tool generates a visual heatmap to show where the conversation\'s intensity and persuasive pressure change.', es: 'Si el texto es un diálogo, la herramienta genera un mapa de calor visual para mostrar dónde cambia la intensidad y la presión persuasiva de la conversación.' },
    aboutFeature4Title: { en: 'Sculpt & Rewrite', es: 'Esculpir y Reescribir' },
    aboutFeature4Desc: { en: 'A generative feature that lets you rewrite the original text by adjusting sliders for tone, emotionality, and style.', es: 'Una función generativa que te permite reescribir el texto original ajustando deslizadores de tono, emotividad y estilo.' },
    aboutHowToUse: { en: 'How to Use This Tool', es: 'Cómo Usar esta Herramienta' },
    aboutHowToStep1: { en: '1. Get Your Text:', es: '1. Obtén tu Texto:' },
    aboutHowToStep1aTitle: { en: 'As a Browser Extension (Recommended):', es: 'Como Extensión de Navegador (Recomendado):' },
    aboutHowToStep1aDesc: { en: 'Navigate to any article or webpage and click the "Analyze Current Page" button. The tool will automatically extract the text content from the page.', es: 'Navega a cualquier artículo o página web y haz clic en el botón "Analizar Página Actual". La herramienta extraerá automáticamente el contenido de texto de la página.' },
    aboutHowToStep1bTitle: { en: 'Manual Input:', es: 'Entrada Manual:' },
    aboutHowToStep1bDesc: { en: 'You can also copy and paste any text (at least 200 characters) directly into the text area.', es: 'También puedes copiar y pegar cualquier texto (de al menos 200 caracteres) directamente en el área de texto.' },
    aboutHowToStep2: { en: '2. Analyze:', es: '2. Analiza:' },
    aboutHowToStep2Desc: { en: 'Click the "Analyze Rhetoric" button. The AI will process the text and generate a multi-tabbed report.', es: 'Haz clic en el botón "Análisis Genérico". La IA procesará el texto y generará un informe con múltiples pestañas.' },
    aboutHowToStep3: { en: '3. Explore the Report:', es: '3. Explora el Informe:' },
    aboutHowToStep3Desc: { en: 'Use the tabs to explore the different analysis views, from the in-depth technical breakdown to the simplified explanations.', es: 'Usa las pestañas para explorar las diferentes vistas de análisis, desde el desglose técnico profundo hasta las explicaciones simplificadas.' },
    aboutLimitations: { en: 'Important Limitations: What This Tool Does NOT Do', es: 'Limitaciones Importantes: Lo que esta Herramienta NO Hace' },
    aboutLimitation1Title: { en: 'It is NOT a fact-checker.', es: 'NO es un verificador de hechos.' },
    aboutLimitation1Desc: { en: 'The tool analyzes the structure and style of an argument, not the truthfulness of its claims. A well-argued piece can still contain factual errors, and a poorly argued one may be factually correct.', es: 'La herramienta analiza la estructura y el estilo de un argumento, no la veracidad de sus afirmaciones. Un texto bien argumentado puede contener errores fácticos, y uno mal argumentado puede ser fácticamente correcto.' },
    aboutLimitation2Title: { en: 'The AI is not infallible.', es: 'La IA no es infalible.' },
    aboutLimitation2Desc: { en: 'While powerful, the AI can make mistakes, misinterpret nuance, or miss certain techniques. Use its analysis as a starting point for your own critical thinking, not as a final, definitive judgment.', es: 'Aunque es poderosa, la IA puede cometer errores, malinterpretar matices o pasar por alto ciertas técnicas. Usa su análisis como punto de partida para tu propio pensamiento crítico, no como un juicio final y definitivo.' },
    aboutLimitation3Title: { en: 'Context is key.', es: 'El contexto es clave.' },
    aboutLimitation3Desc: { en: 'The tool analyzes the text you provide in isolation. The broader context of who the author is, where it was published, and the ongoing cultural conversation is something you must still consider.', es: 'La herramienta analiza el texto que proporcionas de forma aislada. El contexto más amplio de quién es el autor, dónde se publicó y la conversación cultural en curso es algo que aún debes considerar.' },
    aboutGoal: { en: 'Our Goal', es: 'Nuestro Objetivo' },
    aboutGoalDesc: { en: 'The purpose of this tool is to empower you with the skills of critical consumption. By making the machinery of persuasion visible, we hope to help you become a more discerning reader, a more effective communicator, and a more engaged citizen.', es: 'El propósito de esta herramienta es empoderarte con las habilidades de consumo crítico. Al hacer visible la maquinaria de la persuasión, esperamos ayudarte a convertirte en un lector más exigente, un comunicador más eficaz y un ciudadano más comprometido.' },

    // UserProfileForm.tsx
    privacyNotice: { en: 'Privacy Notice', es: 'Aviso de Privacidad' },
    privacyNoticeDesc: { en: "This information is stored ONLY in your browser's local storage and is never sent to our servers. It is included in the temporary, on-demand request to the AI to generate tailored feedback. You can clear this data at any time.", es: "Esta información se almacena ÚNICAMENTE en el almacenamiento local de tu navegador y nunca se envía a nuestros servidores. Se incluye en la solicitud temporal y bajo demanda a la IA para generar feedback personalizado. Puedes borrar estos datos en cualquier momento." },
    profileAge: { en: 'Age', es: 'Edad' },
    profileGender: { en: 'Gender / Identity', es: 'Género / Identidad' },
    profileNationality: { en: 'Nationality / Cultural Background', es: 'Nacionalidad / Origen Cultural' },
    profileReligion: { en: 'Religion / Worldview', es: 'Religión / Visión del Mundo' },
    profileOther: { en: 'Other Relevant Identities (e.g., profession, political leaning)', es: 'Otras Identidades Relevantes (p. ej., profesión, inclinación política)' },
    clearProfile: { en: 'Clear Profile', es: 'Borrar Perfil' },
    saved: { en: 'Saved!', es: '¡Guardado!' },
    saveProfile: { en: 'Save Profile', es: 'Guardar Perfil' },
    clearProfileConfirm: { en: 'Are you sure you want to clear your saved profile? This data is only stored in your browser.', es: '¿Estás seguro de que quieres borrar tu perfil guardado? Estos datos solo se almacenan en tu navegador.' },
    
    // ErrorMessage.tsx
    errorOccurred: {
        en: 'An Error Occurred',
        es: 'Ocurrió un Error'
    }
};