'use strict';

document.addEventListener('DOMContentLoaded', async function() {
	if (location.pathname == '/') {
		let page = new URLSearchParams(location.search).get('page');
		if (page && page > 0) {
			let data = await fetch(`${location.origin}/public/data/articles/${page}.json`);
			let json = await data.json();
			processPage(page, json);
		} else {
			document.querySelectorAll('main.root > .pagination > a')[0].classList.add('active');
		}

		handlers.articles();
	}

	if (document.body.getAttribute('id') != 'article') {
		let request = await fetch(`${location.origin}/public/data/articles/contents.json`);
		let articles = await request.json();
		document.querySelector('input[type="search"]').oninput = (event) => handlers.search(event, articles);
	}


	// Theme
	let themeColor = window.localStorage.getItem('themeColor') || 'light';
	document.body.dataset.theme = themeColor;

	if (themeColor == 'light') {
		document.querySelector('[name="theme-color"]').setAttribute('content', '#fff');
	} else {
		document.querySelector('[name="theme-color"]').setAttribute('content', '#222');
	}

	if (document.body.getAttribute('id') != 'article') {
		let changeTheme = document.querySelector('.change_theme');
		changeTheme.classList.add(themeColor);
		changeTheme.onclick = function(event) {
			if (document.body.dataset.theme == 'light') {
				event.target.classList.remove('light');
				event.target.classList.add('dark');
				window.localStorage.setItem('themeColor', 'dark');
				document.body.dataset.theme = 'dark';
				document.querySelector('[name="theme-color"]').setAttribute('content', '#222');
			} else {
				event.target.classList.remove('dark');
				event.target.classList.add('light');
				window.localStorage.setItem('themeColor', 'light');
				document.body.dataset.theme = 'light';
				document.querySelector('[name="theme-color"]').setAttribute('content', '#fff');
			}
		};
	}

	// Offers
	// if (document.body.getAttribute('id') == 'article') {
	// 	let script = document.createElement('script');
	// 	script.src = '/public/js/getOffers.js';
	// 	script.defer = true;
	// 	script.onload = function() {
	// 		let lang = document.querySelector('html').getAttribute('lang'),
	// 			keys = document.querySelector('[itemprop="keywords"]').getAttribute('content');
	// 		let offers = getOffers(lang, keys.split(',').map(key => key.trim()));
	// 		// console.log(offers);

	// 		let offer = offers.shuffle()[0];
	// 		if (offer) {
	// 			let element = document.createElement('div');
	// 			element.classList.add('offer');
	// 			element.innerHTML = `<span>${offer.title}</span><p>${offer.text}</p><a href="${offer.link}" target="_blank">${offer.anchor}</a>`;
	// 			document.querySelector('article.root').append(element);
	// 		}
	// 	};
	// 	document.body.append(script);
	// }
});

Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}

	return this;
};

// Handlers
let handlers = {};
handlers.articles = function() {
	let pages = document.querySelectorAll('.pagination > a');

	for (let page of pages) {
		page.onclick = async function(event) {
			event.preventDefault();

			let page = new URLSearchParams(new URL(event.target.href).search).get('page');
			
			let data = await fetch(`${location.origin}/public/data/articles/${page}.json`);
			if (data.status == 200) {
		        history.pushState(null, null, event.target.href);
			}
			let json = await data.json();
			processPage(page, json);
		};
	}
};


// Search
handlers.search = async function(event, articles) {
	articles = articles.filter(article => new RegExp(event.target.value, 'gim').test(article.title));

	let input = document.querySelector('.header.root > div');
	let results = document.querySelector('.header.root > .results');

	if (event.target.value.trim().length == 0 || articles.length == 0) {
		input.classList.remove('active');
		results.classList.remove('active');
		[...results.children].forEach(child => child.remove());
		return;
	}

	let as = '';
	for (let article of articles) {
		as += `<a href="${location.origin}/${article.path}/">${article.title}</a><hr>`;
	}

	input.classList.add('active');
	results.classList.add('active');
	results.innerHTML = as;
};

function processPage(page, items) {
	let response = '';
	for (let item of items) {
		response +=`
<article>
	<h3><a href="${item.path}">${item.title}</a></h3>
	<div class="main">
		<p>${item.annotation}</p>
	</div>
</article>
`;
	}

	[...document.querySelectorAll('main.root > .pagination > a')].forEach(item => item.classList.remove('active'));
	if (page && page > 0) {
		[...document.querySelectorAll('main.root > .pagination > a')].find(a => a.href.indexOf(`?page=${page}`) > -1).classList.add('active');
	}

	[...document.querySelector('.articles .main').children].forEach(child => child.remove());
	document.querySelector('.articles .main').innerHTML = response;
	window.scroll(0, 0);
}

window.onpopstate = async function(event) {
	let page = new URLSearchParams(new URL(location.href).search).get('page') || 1;

	let data = await fetch(`${location.origin}/public/data/articles/${page}.json`);
	let json = await data.json();
	processPage(page, json);
};