
async function friendRequest() {
	var acceptButtons = document.querySelectorAll('.acceptButton');
	var rejectButtons = document.querySelectorAll('.rejectButton');
	acceptButtons.forEach(function (button) {
		button.removeEventListener('click', acceptRequestHandler);
		button.addEventListener('click', acceptRequestHandler);
		button.removeEventListener('keydown', acceptRequestEnterKey);
        button.addEventListener('keydown', acceptRequestEnterKey);
	});

	rejectButtons.forEach(function (button) {
		button.removeEventListener('click', rejectRequestHandler);
		button.addEventListener('click', rejectRequestHandler);
		button.removeEventListener('keydown', rejectRequestEnterKey);
        button.addEventListener('keydown', rejectRequestEnterKey);
	});
}

function acceptRequestEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        acceptRequestHandler(event);
    }
}

function rejectRequestEnterKey(event) {
	if (event.key === 'Enter') {
        event.preventDefault();
        rejectRequestHandler(event);
    }
}

async function acceptRequestHandler(event) {
    var requestId = event.currentTarget.getAttribute('data-request-id');
    var button = event.currentTarget;
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;


    const response = await fetch(`/acceptFriend/${requestId}/`, {
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

async function rejectRequestHandler(event) {
    var requestId = event.currentTarget.getAttribute('data-request-id');
    var button = event.currentTarget;
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    const response = await fetch(`/rejectFriend/${requestId}/`, {
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
