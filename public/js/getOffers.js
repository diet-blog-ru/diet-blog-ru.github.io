'use strict';

let offersData = {
	'ru': [
		/* Диета и похудение */
		{
			active: true,
			keywords: 'диет, похудение, потеря веса',
			title: 'Colleskin - капсулы для волос, кожи, ногтей',
			text: 'Colleskin — это 100% натуральная и безопасная добавка, поддерживающая ваш организм красивым и здоровым. Основным ингредиентом является коллаген - основной строительный материал для кожи, волос и ногтей, обеспечивающий их упругость и эластичность. Colleskin - ваш путь к красоте и здоровью!',
			anchor: 'Узнать больше',
			link: '#',
			images: [],
			videos: []
		},
		{
			active: true,
			keywords: 'придурок',
			title: 'Пластырь для похудения - 5 шт в комплекте',
			text: 'Уникальное средство для получения стройной фигуры. После того, как патч оказывается на коже, запускается процесс жиросжигания, питания кожи полезными микроэлементами, а также вывода шлаков и токсинов. Регулярно используя такой пластырь вы увидите поразительный результат: бедра станут гладкими, ноги стройными, а живот идеально плоским.',
			anchor: 'Узнать больше',
			link: '#',
			images: [],
			videos: []
		},
		/* */

		/* Иммунитет */
		{
			active: true,
			keywords: 'иммунитет, витамин, минерал',
			name: 'Изделие №1',
			link: 'https://',
			description: '',
			button: 'Поддержать иммунитет',
			images: [],
			videos: []
		}
		/* */
	]
};


// let offers = getOffers('ru', ['диета', 'похудение', 'потеря веса', 'фигура']);
function getOffers(lang, keywords) {
	let response = [];
	for (let offer of offersData[lang]) {
		let offerKeywords = offer.keywords.split(',').map(key => key.trim());
		
		if (offerKeywords.containsArray(keywords)) {
			response.push(offer);
		}
	}

	return response;
}

Array.prototype.containsArray = function(array) {
	for (let item of this) {
		for (let elem of array) {
			if (new RegExp(item, 'g').test(elem)) return true;
		}
	}

	return false;
};