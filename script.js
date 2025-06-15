// This script handles the form submission for uploading an image and password
// from the HTML page to the Go backend.

// --- Configuration ---
// Replace with your Vercel deployment URL
const backendUrl = 'https://bot-api-tbilisihc.vercel.app/api/handler';

// --- Get Form Elements ---
const adminForm = document.getElementById('admin-form');
const passwordInput = document.getElementById('password');
const fileInput = document.getElementById('myFile');
const messageTextarea = document.getElementById('message'); // Note: The Go backend doesn't process this yet.

// --- Add Event Listener for Form Submission ---
adminForm.addEventListener('submit', async (event) => {
  // Prevent the default browser action of reloading the page on form submission.
  event.preventDefault();

  // --- 1. Get User Input ---
  const password = passwordInput.value;
  const imageFile = fileInput.files[0]; // Get the first file selected by the user.

  // --- 2. Input Validation ---
  if (!password) {
    alert('Please enter a password.');
    return;
  }

  if (!imageFile) {
    alert('Please select an image to upload.');
    return;
  }

  // --- 3. Create FormData ---
  // FormData is the perfect tool for sending files and text in a single request.
  const formData = new FormData();

  // Append the data. The keys ("password", "image") must match what the Go backend expects.
  formData.append('password', password);
  formData.append('image', imageFile);
  formData.append('message', messageTextarea.value); 

  console.log('Sending data to the backend...');
  // You can also inspect the FormData object like this:
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }


  // --- 4. Send the request using the Fetch API ---
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData, // When you pass a FormData object, the browser automatically sets the correct 'Content-Type: multipart/form-data' header.
    });

    // Get the JSON response from the server
    const result = await response.json();

    if (response.ok) {
      // Server responded with a 2xx status code
      console.log('✅ Success!');
      alert(`Server says: ${result.message}`);
    } else {
      // Server responded with an error status code (4xx, 5xx)
      console.error('❌ Error from server:');
      console.error(`Status: ${response.status}`);
      console.error('Data:', result);
      alert(`Error: ${result.message || 'An unknown error occurred.'}`);
    }
  } catch (error) {
    // This catches network errors or issues with the fetch request itself.
    console.error('❌ Network or client-side error:', error);
    alert('Failed to send request. Check the console for details.');
  }
});
