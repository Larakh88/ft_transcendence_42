
async function friends() {

	const response = await fetch ('update_users', {
		method: 'GET',
		headers: {
			'X-CSRFToken': '{{ csrf_token }}',
		},
	});

	if (response.ok) {
		const jsonResponse = await response.json();
		const translations = jsonResponse.translations;
		const friendships = JSON.parse(jsonResponse.friendships);
		const tbody = document.querySelector('#friends-table tbody');
		const errordiv = document.getElementById('error-message');
		errordiv.innerHTML = "";
		tbody.innerHTML = "";
		friendships.forEach(friendship => {
			const row = document.createElement('tr');
			row.classList.add('align-middle');

			const avatarHTML = `<td class="colorfy avatar-text-table"><img alt="${translations.playerAvatar}" src="${friendship.avatar_url}" class="small-avatar"></td>`;
			const usernameHTML = `<td class="colorfy">${friendship.display_name}</td>`;
			const profileHTML = `<td class="colorfy"><a onclick="showSection('profile/${friendship.display_name}')" 
				onkeypress="friendProfileEvent(event, 'profile/${friendship.display_name}')">
				<i class="bi bi-eye icons" title="${translations.viewPlayerProfile}" tabindex='0'></i></a></td>`;
			const unFriendHTML = `<td class="colorfy"><a class="unfriendButton" data-friendship-id=${friendship.friendship_id}><i class="bi bi-person-dash-fill icons" title="${translations.Unfriend}" tabindex='0'></i></a></td>`;
			row.innerHTML = `${avatarHTML}${usernameHTML}${profileHTML}${unFriendHTML}`;
			tbody.appendChild(row);
		});
		unfriends();
	} else {
		const tbody = document.querySelector('#friends-table tbody');
		tbody.innerHTML = "";
		const jsonResponse = await response.json();
		const errorMessage = jsonResponse.error;
		const errorMessageContainer = document.getElementById('error-message');
		errorMessageContainer.textContent = errorMessage;
	}
}

async function unfriends() {
	var unfriendButtons = document.querySelectorAll('.unfriendButton');
	unfriendButtons.forEach(function (button) {
		button.removeEventListener('click', friendHandler);
		button.addEventListener('click', friendHandler);
		button.removeEventListener('keydown', friendsEnterKey);
        button.addEventListener('keydown', friendsEnterKey);
	});
}

function friendsEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        friendHandler(event);
    }
}

async function friendHandler(event) {
	var friendshipId = event.currentTarget.getAttribute('data-friendship-id');
	var button = event.currentTarget;
	const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

	const response = await fetch(`/unfriend/${friendshipId}/`, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken,
		},
	});

	if (response.ok) {
		var notiAlert = document.getElementById('alert-container');
		var responseData = await response.json();

		if (responseData.success) {
			var tableRow = button.closest('tr');
			tableRow.remove();
			createAlert(notiAlert, responseData.success, 'alert-success');
		} else {
			createAlert(notiAlert, responseData.error, 'alert-danger');
		}
	} else {
		var responseData = await response.json();
        throw new Error(responseData.error);
    }

}
