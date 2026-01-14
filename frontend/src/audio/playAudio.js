export const playAudio = (base64Audio) => {
    return new Promise((resolve, reject) => {
        try {
            const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
            audio.play();
            audio.onended = () => {
                resolve();
            };
            audio.onerror = (e) => {
                console.error("Error playing audio:", e);
                reject(e);
            };
        } catch (error) {
            console.error("Failed to create or play audio:", error);
            reject(error);
        }
    });
};
