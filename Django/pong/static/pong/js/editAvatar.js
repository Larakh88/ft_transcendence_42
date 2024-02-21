let isEventListener = false;

function editAvatar() {
    document.getElementById('editAvatar').classList.remove('d-none');
    document.getElementById('avatar').classList.add('d-none');
    document.getElementById('camera').classList.add('d-none');
}

async function onSubmitHandler(e) {
    e.preventDefault();

    const newAvatar = document.getElementById('newAvatar').files[0];

    if (!newAvatar) {
        const messagesDiv = document.getElementById('avatar-messages');
        messagesDiv.innerHTML = '<span class="text-danger">No file was provided</span>';
        return;
    }
    const fileSizeLimit = 2 * 1024 * 1024;
    if (newAvatar.size > fileSizeLimit) {
        const messagesDiv = document.getElementById('avatar-messages');
        messagesDiv.innerHTML = '<span class="text-danger">File size must be no more than 2 MB</span>';
        document.getElementById('newAvatar').value = '';
        return;
    }

    const formData = new FormData(e.target);
    formData.append('file', newAvatar);

    const response = await fetch('/updateAvatar', {
        method: 'POST',
        headers: {
            'X-CSRFToken': '{{ csrf_token }}',
        },
        body: formData,
    });

    if (response.ok) {
        const responseData = await response.json();
        const newname = responseData.name;
        const messagesDiv = document.getElementById('avatar-messages');
        if (messagesDiv) {
            messagesDiv.innerHTML = '';
        }
        document.getElementById('newAvatar').value = '';
        const imageURL = `/media/${newname}`;
        document.getElementById('avatar').src = imageURL;
        document.getElementById('editAvatar').classList.add('d-none');
        document.getElementById('avatar').classList.remove('d-none');
        document.getElementById('camera').classList.remove('d-none');
    } else {
        const jsonResponse = await response.json();
        const errorMessage = jsonResponse.error;
        const messagesDiv = document.getElementById('avatar-messages');
        messagesDiv.innerHTML = `<span class="text-danger">${errorMessage}</span>`;
        document.getElementById('newAvatar').value = '';
    }
    isEventListener = false;
}

async function saveAvatar() {
    const form = document.getElementById('editAvatar');

    if (isEventListener) {
        form.removeEventListener('submit', onSubmitHandler);
    }

    form.addEventListener('submit', onSubmitHandler);
    isEventListener = true;
}

function cancelAvatarChange() {
    const messagesDiv = document.getElementById('avatar-messages');
    if (messagesDiv) {
        messagesDiv.innerHTML = '';
    }
    document.getElementById('newAvatar').value = '';
    document.getElementById('editAvatar').classList.add('d-none');
    document.getElementById('avatar').classList.remove('d-none');
    document.getElementById('camera').classList.remove('d-none');
    isEventListener = false;
}
