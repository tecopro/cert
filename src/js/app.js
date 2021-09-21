import "regenerator-runtime/runtime";
import Choices from "choices.js";
import axios from "axios";

document.addEventListener("DOMContentLoaded", function () {
	const period = document.getElementById("nemos-year");
	const name = document.getElementById("nemos-name");
	const find = document.getElementById("finding-nemo");
	const finder = document.getElementById("nemo-finder");
	const finded = document.getElementById("nemo-result");

	// choices.js for period
	const periodChoices = new Choices(period, {
		classNames: {
			containerInner: period.className,
			input: "form-control",
			inputCloned: "form-control-sm",
			listDropdown: "dropdown-menu",
			itemChoice: "dropdown-item",
			activeState: "show",
			selectedState: "active"
		},
		shouldSort: false,
		searchEnabled: false
	});

	const search = async (evt) => {
		evt.preventDefault();
		let element = this;
		let icon = element.querySelector("#find-nemo-icon");

		try {
			// change search icon to loader
			icon.classList.remove("ti", "ti-search");
			icon.classList.add("spinner-border", "spinner-border-sm");

			// disable name & button section
			name.setAttribute("disabled", "disabled");
			find.setAttribute("disabled", "disabled");

			// hide error message
			document.getElementById("alert").style.display = "none";

			// disable period field
			periodChoices.disable();

			if (name.value.trim() === "") {
				// if name is empty
				throw new Error("Kolom nama tidak boleh kosong.");
			}

			// process
			let url = `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/data.json`;
			let response = await axios.get(url).catch(function (error) {
				throw new Error("Terjadi kesalahan, silahkan coba beberapa saat lagi.");
			});

			// filter by name
			// and get first index
			let result = response.data.filter(function (row) {
				let thisname = (row?.name || "").toLowerCase();
				let nemoname = (name.value || "").toLowerCase();

				return thisname.includes(nemoname);
			}).shift();

			if (typeof result === "undefined") {
				// if data cannot be found
				throw new Error("Maaf, sertifikat yang kamu cari tidak dapat ditemukan.");
			}

			// if data can be found
			document.querySelectorAll("[nemo-result-name]").forEach(function (element) {
				element.textContent = result.name;
			});
			document.querySelector("[nemo-result-position]").textContent = result.position;
			document.querySelector("[nemo-result-predicate]").textContent = result.predicate;
			document.querySelector("[nemo-result-period]").textContent = result.period;

			let download = `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/certificate/${result.file}`;
			document.querySelector("[nemo-result-download]").setAttribute("href", download);

			// remove & display multiple sections
			finder.remove();
			finded.removeAttribute("style");
			find.parentNode.parentNode.remove();
			document.getElementById("refresh-the-nemo").removeAttribute("style");
		} catch (error) {
			// show error message
			document.getElementById("alert").removeAttribute("style");
			document.getElementById("error-message").textContent = error.message;

			// change loader icon to search
			icon.classList.remove("spinner-border", "spinner-border-sm");
			icon.classList.add("ti", "ti-search");

			// enable name & button section
			name.removeAttribute("disabled");
			find.removeAttribute("disabled");

			// enable period field
			periodChoices.enable();

			// focus to name field
			name.focus();
		}
	};

	// find button on click
	find.addEventListener("click", search);

	// hide preloader if dom is ready
	const preloader = document.getElementById("preloader");
	preloader.style.transition = ".5s";
	preloader.style.opacity = "0";
	preloader.style.visibility = "hidden";
}, {
	once: true
});
