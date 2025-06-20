const baseUrl = 'https://bot-api-tbilisihc.vercel.app';

// --- Get Form and Input Elements from the HTML ---
const adminForm = document.getElementById('admin-form');
const passwordInput = document.getElementById('password');
const fileInput = document.getElementById('myFile');
const messageTextarea = document.getElementById('message');
const discordCheckbox = document.getElementById('discord');
const twitterCheckbox = document.getElementById('twitter');
const telegramCheckbox = document.getElementById('telegram');

// --- Get UI Elements for Feedback ---
const loader = document.getElementById('loader');
const messageContainer = document.getElementById('message-container');
const messageContent = document.getElementById('message-content');


// --- Helper functions for UI feedback ---
const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');

const showMessage = (message, isError = false) => {
    messageContent.textContent = message;
    messageContent.className = `w-full rounded-lg p-4 text-center text-white ${isError ? 'bg-red-500' : 'bg-green-500'}`;
    messageContainer.classList.remove('hidden');
};

const hideMessage = () => {
    messageContainer.classList.add('hidden');
};

// --- Add an Event Listener for the Form's 'submit' event ---
adminForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    hideMessage(); // Hide any previous messages
    showLoader(); // Show the loading spinner

    // --- 1. Get the current values from the form inputs ---
    const password = passwordInput.value;
    const imageFile = fileInput.files[0];
    const message = messageTextarea.value;
    const sendToDiscord = discordCheckbox.checked;
    const sendToTwitter = twitterCheckbox.checked;
    const sendToTelegram = telegramCheckbox.checked;

    // --- 2. Basic Input Validation ---
    if (!password) {
        hideLoader();
        showMessage('Please enter a password.', true);
        return;
    }

    if (!imageFile && !message) {
        hideLoader();
        showMessage('Please either write a message or select an image to upload.', true);
        return;
    }

    let endpointUrl;
    let requestBody;
    const requestHeaders = {};

    // --- 3. THE CORE LOGIC: Determine endpoint and prepare request body ---
    if (imageFile) {
        // SCENARIO A: An image IS present
        endpointUrl = `${baseUrl}/api/handler`;
        const formData = new FormData();
        formData.append('password', password);
        formData.append('image', imageFile, imageFile.name);
        formData.append('message', message);
        formData.append('discord', sendToDiscord);
        formData.append('twitter', sendToTwitter);
        formData.append('telegram', sendToTelegram);
        requestBody = formData;
    } else {
        // SCENARIO B: The image input IS EMPTY
        endpointUrl = `${baseUrl}/api/no-image`;
        const payload = {
            password: password,
            content: message,
            discord: sendToDiscord.toString(),
            twitter: sendToTwitter.toString(),
            telegram: sendToTelegram.toString(),
        };
        requestBody = JSON.stringify(payload);
        requestHeaders['Content-Type'] = 'application/json';
    }

    // --- 4. Send the data to the determined endpoint ---
    try {
        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody,
        });

        const result = await response.json();

        if (response.ok) {
            showMessage(`Success: ${result.message}`);
            adminForm.reset(); // Clear the form on success
        } else {
            showMessage(`Error: ${result.message || 'An unknown server error occurred.'}`, true);
        }
    } catch (error) {
        showMessage('A network error occurred. Please check your connection.', true);
    } finally {
        hideLoader(); // Hide the loader regardless of outcome
    }
});

// Hide the message when the user starts typing again
adminForm.addEventListener('input', hideMessage);