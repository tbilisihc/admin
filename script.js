const baseUrl = 'https://bot-api-tbilisihc.vercel.app';

// --- Get Form and Input Elements from the HTML ---
const adminForm = document.getElementById('admin-form');
const passwordInput = document.getElementById('password');
const fileInput = document.getElementById('myFile');
const messageTextarea = document.getElementById('message');
const discordCheckbox = document.getElementById('discord');
const twitterCheckbox = document.getElementById('twitter');
const telegramCheckbox = document.getElementById('telegram');


// --- Add an Event Listener for the Form's 'submit' event ---
adminForm.addEventListener('submit', async (event) => {
  // This prevents the browser from reloading the page, allowing our script to handle the submission.
  event.preventDefault();

  // --- 1. Get the current values from the form inputs ---
  const password = passwordInput.value;
  const imageFile = fileInput.files[0]; // .files is a list; [0] gets the first (and only) file.
  const message = messageTextarea.value;
  // Get the boolean value from checkboxes and convert to a string "true" or "false"
  const sendToDiscord = discordCheckbox.checked.toString();
  const sendToTwitter = twitterCheckbox.checked.toString();
  const sendToTelegram = telegramCheckbox.checked.toString();

  // --- 2. Basic Input Validation ---
  if (!password) {
    alert('Please enter a password.');
    return; // Stop the function if validation fails.
  }

  // Check if BOTH the message and the image are missing.
  if (!imageFile && !message) {
    alert('Please either write a message or select an image to upload.');
    return; // Stop the function.
  }

  let endpointUrl;
  let requestBody;
  const requestHeaders = {};

  // --- 3. THE CORE LOGIC: Check if an image file was selected ---
  if (imageFile) {
    // --- SCENARIO A: An image IS present ---
    console.log('An image was selected. Preparing to upload file.');

    // Set the URL for the image-handling endpoint.
    endpointUrl = `${baseUrl}/api/handler`;

    // Use FormData to package the file and password together.
    const formData = new FormData();
    formData.append('password', password);
    formData.append('image', imageFile, imageFile.name);
    formData.append('message', message);
    formData.append('discord', JSON.stringify(sendToDiscord));
    formData.append('twitter', JSON.stringify(sendToTwitter));
    formData.append('telegram', JSON.stringify(sendToTelegram));


    requestBody = formData;

  } else {
    // --- SCENARIO B: The image input IS EMPTY ---
    console.log('No image selected. Preparing to send text message as JSON.');

    // Set the URL for the text-only endpoint.
    endpointUrl = `${baseUrl}/api/no-image`;

    // Create a plain JavaScript object for the payload.
    const payload = {
      password: password,
      content: message,
      discord: sendToDiscord,
      twitter: sendToTwitter,
      telegram: sendToTelegram,
    };
    
    // Convert the JavaScript object into a JSON string.
    requestBody = JSON.stringify(payload);
    
    // Explicitly set the header to tell the server we are sending JSON.
    requestHeaders['Content-Type'] = 'application/json';
  }


  // --- 4. Send the data to the determined endpoint using the Fetch API ---
  console.log(`Sending request to: ${endpointUrl}`);
  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody,
    });

    const result = await response.json(); // Parse the JSON response from the server.

    if (response.ok) {
      // The server responded with a success status (e.g., 200)
      console.log('✅ Success!', result);
      alert(`Server Response: ${result.message}`);
    } else {
      // The server responded with an error status (e.g., 401, 500)
      console.error('❌ Server Error:', result);
      alert(`Error: ${result.message || 'An unknown server error occurred.'}`);
    }
  } catch (error) {
    // This catches network failures or other errors that prevent the request from completing.
    console.error('❌ Network or Client-Side Error:', error);
    alert('A network error occurred. Please check your connection and the console for details.');
  }
});