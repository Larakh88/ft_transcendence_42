let isEventListenerAdded = false;

function editUsername() {
	document.getElementById('editName').classList.remove('d-none');
	document.getElementById('display-name').classList.add('d-none');
	document.getElementById('edit').classList.add('d-none');
}

async function Handler(e) {
	e.preventDefault();
	const formData = new FormData(e.target);
	const newUsername = document.getElementById('newUsername').value;
	formData.append('newUsername', newUsername);

	const response = await fetch('/updateUsername', {
	method: 'POST',
	headers: {
		'X-CSRFToken': '{{ csrf_token }}',
	},
	body: formData,
	})
	if (response.ok) {
		const messagesDiv = document.getElementById('username-messages');
		if (messagesDiv) {
			messagesDiv.innerHTML = '';
		}
		document.getElementById('newUsername').value = '';
		document.getElementById('display-name').textContent = newUsername;
		document.getElementById('editName').classList.add('d-none');
		document.getElementById('display-name').classList.remove('d-none');
		document.getElementById('edit').classList.remove('d-none');
	} else {
		const jsonResponse = await response.json();
		const errorMessage = jsonResponse.error;
		const messagesDiv = document.getElementById('username-messages');
		messagesDiv.innerHTML = `<span class="text-danger">${errorMessage}</span>`;
		document.getElementById('newUsername').value = '';
	}
	isEventListenerAdded = false;
}

async function saveUsername() {
	const form = document.getElementById('editName');

	if (isEventListenerAdded) {
		form.removeEventListener('submit', Handler);
	}

	form.addEventListener('submit', Handler);
	isEventListenerAdded = true;
}

function cancelChange() {
	const messagesDiv = document.getElementById('username-messages');
	if (messagesDiv) {
		messagesDiv.innerHTML = '';
	}
	document.getElementById('newUsername').value = '';
	document.getElementById('editName').classList.add('d-none');
	document.getElementById('display-name').classList.remove('d-none');
	document.getElementById('edit').classList.remove('d-none');
	isEventListenerAdded = false;
}