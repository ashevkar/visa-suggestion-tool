// src/api/generateUI.ts

export async function generateUI(prompt: string) {
    const schema = {
        type: "OBJECT",
        properties: {
            suggestedComponents: { type: "ARRAY", items: { type: "STRING" } },
            codeSnippet: { type: "STRING" }
        },
        required: ["suggestedComponents", "codeSnippet"]
    };

    const fullPrompt = `
        You are an expert in React and the @visa/nova-react component library from the Visa Product Design System.
        A developer wants to build a UI.
        
        Developer's description: "${prompt}"

        Your task:
        1.  Analyze the developer's request and identify the most relevant components from the @visa/nova-react library.
        2.  Generate a single, complete, and runnable React functional component using these components.
        3.  The generated code must include the necessary import statements from '@visa/nova-react'.
        4.  Use Tailwind CSS for styling to create a modern and clean layout.
        5.  The generated code should be a single string.
        
        Return your response as a JSON object matching this schema:
        {
            "suggestedComponents": ["Component1", "Component2"],
            "codeSnippet": "import React from 'react';\\nimport { Button, TextInput } from '@visa/nova-react';\\n..."
        }
    `;

    const payload = {
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        }
    };

    const apiUrl = `https://openrouter.ai/api/v1/chat/completions`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({ "model": "deepseek/deepseek-chat-v3-0324:free", payload})
});

if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
}

const data = await response.json();

if (data.candidates?.length) {
    const rawJson = data.candidates[0].content.parts[0].text;
    const cleanJson = rawJson.replace(/^```json\n?/, '').replace(/```$/, '');
    return JSON.parse(cleanJson);
} else {
    throw new Error("No valid response from API.");
}
}
