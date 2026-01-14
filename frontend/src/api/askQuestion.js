const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const askQuestion = async (question) => {
    try {
        const response = await fetch(`${API_URL}/api/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Contains { text: "...", audio: "..." }
    } catch (error) {
        console.error("Error asking question:", error);
        throw error;
    }
};
