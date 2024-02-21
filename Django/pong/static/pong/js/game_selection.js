
function twoplayers() {
	if (!document.getElementById('multiplayers').classList.contains('d-none'))
		document.getElementById('multiplayers').classList.add('d-none');
	document.getElementById('twoplayers').classList.remove('d-none');
}

function multiplayers() {
	if (!document.getElementById('twoplayers').classList.contains('d-none'))
		document.getElementById('twoplayers').classList.add('d-none');
	document.getElementById('multiplayers').classList.remove('d-none');
}
