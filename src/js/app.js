import "regenerator-runtime/runtime";
import * as bootstrap from 'bootstrap';
import Choices from "choices.js";
import axios from "axios";

document.addEventListener("DOMContentLoaded", function () {
	const period = document.getElementById('nemos-year');
	const name = document.getElementById('nemos-name');
	const find = document.getElementById('finding-nemo');

	// choices.js for period
	const periodChoices = new Choices(period, {
		classNames: {
			containerInner: period.className,
			input: 'form-control',
			inputCloned: 'form-control-sm',
			listDropdown: 'dropdown-menu',
			itemChoice: 'dropdown-item',
			activeState: 'show',
			selectedState: 'active',
		},
		shouldSort: false,
		searchEnabled: false,
	});

	// find button on click
	find.addEventListener('click', async function (evt) {
		let element = this;
		let icon = element.querySelector('#find-nemo-icon');

		// change search icon to loader
		icon.classList.remove('ti', 'ti-search');
		icon.classList.add('spinner-border', 'spinner-border-sm');

		// disable name & button section
		name.setAttribute('disabled', 'disabled');
		find.setAttribute('disabled', 'disabled');

		// hide period field
		period.parentNode.parentNode.parentNode.style.display = 'none';

		// process
		let url = `https://raw.githubusercontent.com/tecopro/certificate-generator/${period.value}/data.json`;
		axios.get(url).then(function ({ data }) {
			console.log(data);
		}).catch(function (error) {
			// set alert
			document.getElementById('alert').removeAttribute('style');
			document.getElementById('error-message').textContent = 'Maaf, data tidak dapat ditemukan.';

			// change loader icon to search
			icon.classList.remove('spinner-border', 'spinner-border-sm');
			icon.classList.add('ti', 'ti-search');

			// enable name & button section
			name.removeAttribute('disabled');
			find.removeAttribute('disabled');

			// hide period field
			period.parentNode.parentNode.parentNode.removeAttribute('style');
		});
	});

	// hide preloader if dom is ready
	const preloader = document.getElementById('preloader');
	preloader.style.transition = '.5s';
	preloader.style.opacity = '0';
	preloader.style.visibility = 'hidden';
});
