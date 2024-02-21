document.addEventListener('keydown', function (event) {
	if (event.key === 'Enter') {
		const focusedElement = document.activeElement;
		if (focusedElement.classList.contains('nav-link')) {
			focusedElement.click();
		}
	}
  });
