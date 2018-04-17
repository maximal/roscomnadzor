/**
 *
 * @author MaximAL
 * @since 2018-04-16
 * @date 2018-04-16
 * @time 16:16
 * @copyright © MaximAL, Sijeko 2018
 */

// 64 108 34
// 59 100 32
// Ванилла
document.addEventListener('DOMContentLoaded', function () {

	// Жёсткий, мужицкий стрикт
	'use strict';

	// Поехали!
	var tds = document.querySelectorAll('td');
	var countElement = document.querySelector('strong');

	var telegrams = [];
	var lastBlocked = -1;
	var countBlocked = 0;


	forEach(tds, function (td, index) {
		var divParent = document.createElement('div');

		var holeTop = document.createElement('img');
		holeTop.setAttribute('src', 'img/hole-top.svg');
		holeTop.setAttribute('class', 'hole-top');
		holeTop.setAttribute('width', 100+'%');
		divParent.appendChild(holeTop);

		var image = document.createElement('img');
		image.setAttribute('src', 'img/telegram.png');
		image.setAttribute('class', 'telegram hidden');
		image.setAttribute('id', 'telegram-' + index);
		image.setAttribute('data-id', index);
		image.setAttribute('width', 59 + '%');
		divParent.appendChild(image);
		telegrams.push(image);

		var holeBottom = document.createElement('img');
		holeBottom.setAttribute('src', 'img/hole-bottom.svg');
		holeBottom.setAttribute('class', 'hole-bottom');
		holeBottom.setAttribute('width', 100 + '%');
		divParent.appendChild(holeBottom);

		td.appendChild(divParent);
	})


	var timerDelay = 3000;
	//var timer = setInterval(timerStep, timerDelay);
	var timer = setTimeout(timerStep, timerDelay);
	var lastStep = null;
	timerStep();

	function timerStep() {
		var date = new Date();
		if (date - lastStep < timerDelay) {
			return;
		}
		var indices = [];
		forEach(telegrams, function (item, index) {
			item.classList.remove('visible');
			item.classList.add('hidden');
			if (index !== lastBlocked) {
				indices.push(index);
			}
		});

		var count = getRandomInt(2, 4);
		var toShow = shuffle(indices).slice(0, count);
		forEach(toShow, function (index) {
			var telegram = telegrams[index];
			telegram.classList.remove('hidden');
			telegram.classList.add('visible');
		});

		lastStep = date;
	}

	on(telegrams, 'click', function (event) {
		var target = event.target;
		//if (target.classList.contains('visible')) {
		lastBlocked = parseInt(target.getAttribute('data-id'));
		target.classList.remove('visible');
		target.classList.add('hidden');
		countBlocked++;
		countElement.innerText = countBlocked;

		timerDelay *= 0.99;
		if (timerDelay < 300) {
			timerDelay = 300;
		}
		console.info('New interval: ' + timerDelay);
		clearInterval(timer);
		setInterval(timerStep, timerDelay)
		//}
	});

	function forEach(arr, callback) {
		for (var i in arr) {
			if (!arr.hasOwnProperty(i)) {
				continue;
			}
			callback(arr[i], i);
		}
	}

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
});


//// Фреймворк «Минимал»
/**
 * Навесить событие на элементы ДОМа.
 *
 * @example
 * // Один элемент
 * var button = document.body.querySelector('#one-button');
 * on(button, 'click', listener);
 *
 * // Много элементов
 * var buttons = document.body.querySelectorAll('.j-button');
 * on(buttons, 'click', listener);
 *
 *
 * @param {Document|Element|NodeList} elements Элементы ДОМа
 * @param {String|String[]} eventName Название события (click, keypress и т. п.)
 * @param {EventListener|Function} callback Выполняемая функция
 *
 * @since 2016-10-24
 * @author MaximAL
 */
function on(elements, eventName, callback) {
	if (eventName instanceof String || typeof eventName === 'string') {
		eventName = [eventName];
	}
	if (elements instanceof NodeList || elements instanceof Array) {
		for (var i in elements) {
			if (!elements.hasOwnProperty(i)) {
				continue;
			}
			for (var j in eventName) {
				if (!eventName.hasOwnProperty(j)) {
					continue;
				}
				elements[i].addEventListener(eventName[j], callback);
			}
		}
	} else if (elements !== null) {
		for (var e in eventName) {
			if (!eventName.hasOwnProperty(e)) {
				continue;
			}
			elements.addEventListener(eventName[e], callback);
		}
	} else {
		//console.info('Info: no element for `' + eventName + '`event.');
	}
}

/**
 * Ебануть Аякс
 *
 * @example
 * // GET
 * ajax('/api', function (response) {
 *     var data = response.data;
 *     // ...
 * }
 *
 * // PUT
 * ajax('/api', {method: 'PUT', data: {key: value}, function (response) {
 *     var data = response.data;
 *     // ...
 * }
 *
 * @param {String} url Урл
 * @param {Object|Function} params Объект вида `{method: method, async: true, data: data}`
 * @param {String} params.method HTTP-метод
 * @param {String|Object} params.data Данные для передачи
 * @param {Boolean} [params.async] Асинхронный вызов?
 * @param {Function} [params.onLoad] Что вызвать при загрузке
 * @param {Function} [params.onProgress] Что вызвать при изменении прогресса
 * @param {Function} [params.onError] Что вызвать при ошибке
 * @param {Function} [callback] Выполнить по завершению аякс-вызова
 */
function ajax(url, params, callback) {
	if (!url) {
		throw new Error('Error: `url` parameter is required!');
	}

	params = params || {};

	if (params instanceof Function) {
		callback = params;
	}

	var request = new XMLHttpRequest();

	if (params.onProgress) {
		request.onprogress = params.onProgress;
	}

	request.open(params.method ? params.method : 'GET', url, params.async ? params.async : true);

	if (params.onLoad) {
		request.onload = params.onLoad;
	}

	if (params.onError) {
		request.onerror = params.onError;
	}

	request.onreadystatechange = function () {
		if (request.readyState === 4) {
			if (callback) {
				var data;
				try {
					var type = request.getResponseHeader('Content-Type');
					data = type.match(/^application\/json/i) ?
						JSON.parse(request.response.toString()) :
						request.response;
				} catch (err) {
					data = null;
				}
				callback({
					ok: request.status >= 200 && request.status <= 299,
					status: request.status,
					statusText: request.statusText,
					body: request.response,
					data: data
				});
			}
		}
	};

	//request.setRequestHeader('Content-Type', 'multipart/form-data');
	if (params.data) {
		// String or JSON payload
		//console.log(params.data instanceof String);
		if (params.data instanceof String) {
			request.send(params.data);
		} else {
			request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
			request.send(JSON.stringify(params.data));
		}
	} else {
		request.send(null);
	}
}
