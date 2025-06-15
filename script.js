const form = document.getElementById("admin-form");
	if (form) {
		form.addEventListener("submit", function (event) {
			event.preventDefault();
			const passwordInput = document.getElementById("password") 
			const password = passwordInput.value ? passwordInput.value : "";
			const contents = document.getElementById("message").value ? document.getElementById("message").value : "";
			const vercelWebhookUrl = 'bot-api-tbilisihc.vercel.app/api/handler';
			async function sendPOST(message, password) {
				try {
					const response = await fetch(vercelWebhookUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ Content: message, Password: password }),
					});

					if (response.ok) {
						const data = await response.json();
						console.log('Webhook sent successfully:', data);
					} else {
						console.error('Error sending webhook:', response.status, response.statusText);
						try {
							const errorData = await response.json();
							console.error('Error details:', errorData);
						} catch (jsonError) {
							console.error('Could not parse error JSON:', jsonError);
						}
					}
				} catch (error) {
					console.error('Fetch error:', error);
				}
			}
			sendPOST(contents, password);
			alert('Sending...')
			location.href="/"
		});}