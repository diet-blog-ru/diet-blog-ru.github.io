'use strict';

document.addEventListener('DOMContentLoaded', async function() {
	if (location.pathname == '/articles/') {
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
});


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

function processPage(page, items) {
	let response = '';
	for (let item of items) {
		response +=`
<article>
	<h3><a href="${item.path}" target="_blank">${item.title}</a></h3>
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