'use strict';

const chart = new Charty({
	title: "Month / Year",
	data: [
		{"Food & drinks": 24},
		{"Bills & Utilities": 7},
		{"Groceries":5},
		{"Travel": 29},
		{"Medical": 20},
		{"Others":20}
	],
	precision: false,
  selector: '#chart'
});
