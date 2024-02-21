function openModal() {
	var modal = new bootstrap.Modal(document.querySelector("#LanguageModal"))
	modal.show()
}

function resetlang(lang) {
  let langs = {
	"en": 0,
	"id": 1,
	"es": 2,
  }
  document.getElementById('langselect').selectedIndex = langs[lang]
}

async function setLanguage(save) {
  let lang = document.getElementById('langselect').selectedIndex
  let langs = [
	"en",
	"id",
	"es",
  ]
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
	let response = await fetch("/set_language", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			'X-CSRFToken': csrftoken,
		},
		body: JSON.stringify({
			"lang": langs[lang],
			"save": save,
			"path": window.location.pathname,
		})
	})
	if (response.ok) {
		var myModalEl = document.querySelector('#LanguageModal')
		var modal = bootstrap.Modal.getOrCreateInstance(myModalEl)
		modal.hide()
		json = await response.json()
		document.documentElement.setAttribute('lang', langs[lang]);
		document.getElementById('app').innerHTML = json['app'];
		document.getElementById('nav').innerHTML = json['nav'];
		var head = document.getElementsByTagName('head')[0];
		document.getElementById('jsi18n').remove();
		var script = document.createElement('script');
		script.src = "/jsi18n/";
		script.id = "jsi18n";
		head.appendChild(script);

	} else {
		console.log("Language Preference Failed")
	}

}

function changeFontSize(action) {
if (document.body.style.zoom === "")
	document.body.style.zoom = "100%";
if (action === '+')
	document.body.style.zoom = Math.min(125, parseInt(document.body.style.zoom) + 5).toString() + "%";
else if (action === '-')
	document.body.style.zoom = Math.max(80, parseInt(document.body.style.zoom) - 5).toString() + "%";
}

