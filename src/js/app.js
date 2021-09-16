import Choices from "choices.js";

const period = document.getElementById('nemos-year');
const name = document.getElementById('nemos-name');
const find = document.getElementById('finding-nemo');

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

find.addEventListener('click', function (evt) {
	let element = this;
	let icon = element.querySelector('#find-nemo-icon');

	// change search icon to loader
	icon.classList.remove('ti', 'ti-search');
	icon.classList.add('spinner-border', 'spinner-border-sm');

	// disable period & name field
	name.setAttribute('disabled', 'disabled');
	find.setAttribute('disabled', 'disabled');

	// hide period field
	period.parentNode.style.display = 'none';
});
