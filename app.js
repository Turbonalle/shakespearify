const API_URL = "https://suo5l0ms3b.execute-api.eu-north-1.amazonaws.com/translate";

document.addEventListener('DOMContentLoaded', () => {
    const translateBtn = document.getElementById('translateBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.getElementById('btnLoader');
    const userInput = document.getElementById('userInput');
    const outputGroup = document.getElementById('outputGroup');
    const responseText = document.getElementById('responseText');
    const errorBox = document.getElementById('errorBox');

    translateBtn.addEventListener('click', async () => {
        const textToTranslate = userInput.value.trim();

        // Basic validation
        if (!textToTranslate) {
            showError("Prithee, enter some text first!");
            return;
        }

        if (API_URL === "YOUR_API_GATEWAY_INVOKE_URL_HERE/translate") {
            showError("Developer! Thou hast forgotten to add the API_URL in app.js!");
            return;
        }

        // Prepare UI for loading
        hideError();
        outputGroup.classList.add('hidden');
        translateBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');

        try {
            // Make the request to our AWS API Gateway!
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ 
                    text: textToTranslate
                })
            });

            if (response.status === 429) {
                throw new Error("Thou hast exhausted thy daily three requests! Come back tomorrow.");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Alas, an unknown error occurred.");
            }

            // Success! Display the result
            responseText.innerText = data.translation;
            outputGroup.classList.remove('hidden');

        } catch (error) {
            console.error("API Error:", error);
            showError(`Fetch failed: ${error.message}`);
        } finally {
            // Reset UI
            translateBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
        }
    });

    function showError(message) {
        errorBox.innerText = message;
        errorBox.classList.remove('hidden');
    }

    function hideError() {
        errorBox.classList.add('hidden');
        errorBox.innerText = "";
    }
});
