import * as bootstrap from "bootstrap";
import autocomplete from "autocompleter";

const countries = [
	{ label: "Indonesia", value: "ID" },
	{ label: "Malaysia", value: "MY" },
	{ label: "Singapore", value: "SG" }
];

let input = document.getElementById("country");

autocomplete({
	input,
	fetch: function (text, update) {
		text = text.toLowerCase();

		let suggestions = countries.filter(n => n.label.toLowerCase(text));
		update(suggestions);
	},
	onSelect: function (item) {
		input.value = item.label;
		console.log(item);
	}
});
