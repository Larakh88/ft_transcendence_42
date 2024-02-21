
let EventListenerAdded = false;

async function addFriend() {
	var addButtons = document.querySelectorAll('.addButton');
	addButtons.forEach(function (button) {
		button.removeEventListener('click', addFriendHandler);
		button.addEventListener('click', addFriendHandler);
		button.removeEventListener('keydown', searchFriendsEnterKey);
        button.addEventListener('keydown', searchFriendsEnterKey);
    });
}

function searchFriendsEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addFriendHandler(event);
    }
}

async function addFriendHandler(event) {
	var friendId = event.currentTarget.getAttribute('data-friend-id');
	const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;


	const response = await fetch(`/addFriend/${friendId}/`, {
		method: 'POST',
		headers: {
			'X-CSRFToken': csrfToken,
		},
	});

	if (response.ok) {
		var notiAlert = document.getElementById('alert-container');
        var responseData = await response.json();

		if (responseData.success) {
			createAlert(notiAlert, responseData.success, 'alert-success');
		} else if (responseData.no_action_true) {
			createAlert(notiAlert, responseData.no_action_true, 'alert-info');
		} else if (responseData.no_action_false) {
			createAlert(notiAlert, responseData.no_action_false, 'alert-warning');
		} else if (responseData.error) {
			createAlert(notiAlert, responseData.error, 'alert-danger');
		}
	} else {
		var responseData = await response.json();
		throw new Error(responseData.error);
	}

}

function createAlert (container, message, type) {
	var alertElement = document.createElement('div');
    alertElement.classList.add('alert', type, 'alert-dismissible', 'show');
    alertElement.role = 'alert';
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    container.appendChild(alertElement);

    setTimeout(function () {
        alertElement.remove();
    }, 3000);
}

async function searchFriendsHandler (e) {
	e.preventDefault();
	const formData = new FormData(e.target);
	const friendName = document.getElementById('friendName').value;
	formData.append('friendName', friendName);

	const response = await fetch('/searchFriends', {
	method: 'POST',
	headers: {
		'X-CSRFToken': '{{ csrf_token }}',
	},
	body: formData,
	})
	if (response.ok) {
		const jsonResponse = await response.json();
		const translations = jsonResponse.translations;
		const friends = JSON.parse(jsonResponse.friends);
		const messagesDiv = document.getElementById('search-messages');
		messagesDiv.innerHTML = "";
		const tbody = document.querySelector('#searchFriends-table tbody');
		tbody.innerHTML = '';
		friends.forEach(friend => {
			const row = document.createElement('tr');
			row.classList.add('align-middle');

			const avatarHTML = `<td class="colorfy fs-6 avatar-text-table"><img alt="${translations.playerAvatar}" src="${friend.avatar_url}" class="small-avatar"></td>`;
			const usernameHTML = `<td class="colorfy fs-6">${friend.display_name}</td>`;
			const profileHTML = `<td class="colorfy"><a onclick="showSection('profile/${friend.display_name}')" 
								onkeypress="SearchFriendProfileEvent(event, 'profile/${friend.display_name}')">
								<i class="bi bi-eye icons" title="${translations.viewPlayerProfile}" tabindex='0'></i></a></td>`;
			const addFriendHTML = `<td class="colorfy"><a class="addButton" data-friend-id=${friend.id}><i class="bi bi-person-plus-fill icons" title="${translations.sendFriendRequest}" tabindex='0'></i></a></td>`;
			
			row.innerHTML = `${avatarHTML}${usernameHTML}${profileHTML}${addFriendHTML}`;
			tbody.appendChild(row);
			document.getElementById('friendName').value = '';
		});
		addFriend();
	} else {
		const jsonResponse = await response.json();  
		const tbody = document.querySelector('#searchFriends-table tbody');
		tbody.innerHTML = '';
		const errorMessage = jsonResponse.error;
		const messagesDiv = document.getElementById('search-messages');
		messagesDiv.innerHTML = `<span class="text-danger">${errorMessage}</span>`;
		document.getElementById('friendName').value = '';
	}
	EventListenerAdded = false;
}

async function searchFriends() {
	const form = document.getElementById('searchFriends');

	if (EventListenerAdded) {
		form.removeEventListener('submit', searchFriendsHandler);
	}

	form.addEventListener('submit', searchFriendsHandler);
	EventListenerAdded = true;
}
