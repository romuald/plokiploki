(function() {
	"use strict";

	var LENGTHS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
		SPELENGTHS = [0, 1, 2, 3, 4, 5],
		ALL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(''),
		SPE = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'.split('');

	var $passlength, $spelength, $input, $copy;

	function initialize(passlength, spelength) {
		$passlength = document.getElementById('password-length');
		$spelength = document.getElementById('special-length');
		$input = document.getElementById('plokipass');
		$copy = document.getElementById('copy');

		initSelect($passlength, LENGTHS);
		initSelect($spelength, SPELENGTHS);

		$passlength.addEventListener('change', onChange);
		$spelength.addEventListener('change', onChange);
		$passlength.addEventListener('wheel', wheel);
		$spelength.addEventListener('wheel', wheel);

		$input.form.addEventListener('submit', onChange);
		$input.form.style.display = "block";

		$copy.firstChild.addEventListener('click', copyPass);
		copyShow()

		window.addEventListener('hashchange', hashChanged);

		setValue($passlength, passlength);
		setValue($spelength, spelength);

		if ( ! hashChanged() ) {
			onChange();
		}
	}

	function copyPass(e) {
		e.preventDefault();

		var el = document.createElement('textarea');
		el.value = $input.value;
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);

		$copy.firstChild.style.display = 'none';
		$copy.lastChild.style.display = '';
	}

	function copyShow() {
		$copy.firstChild.style.display = '';
		$copy.lastChild.style.display = 'none';
	}

	//+ Jonas Raoni Soares Silva
	//@ http://jsfromhell.com/array/shuffle [v1.0]
	function shuffle(o){ //v1.0
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};

	function int(i) {
		return parseInt(i, 10);
	}

	function initSelect(select, arr) {
		for ( var i=0; i < arr.length; i++) {
			var n = arr[i];
			var opt = document.createElement('option');
			opt.value = n;
			opt.innerText = n;
			select.appendChild(opt);
		}
	}

	function setValue(select, value) {
		var current = select.value;
		select.value = value;
		if ( int(select.value) !== value ) {
			select.value = current;
			return false;
		}
		return true;
	}

	function choice(arr) {
		var m = arr.length;
		if ( window.crypto === undefined ) {
			return arr[int(Math.random() * m)]
		}

		var max = 256 - (256 % m)
		var random = new Uint8Array([max]);
		while ( random >= max ) {
			window.crypto.getRandomValues(random);
		}

		return arr[random % m]

	}

	function onChange(event) {
		if ( event && event.type == "submit" ) {
			event.preventDefault();	
		}

		var i = 0,
			s = $spelength.value,
			l = $passlength.value - s,
			idx,
			pass = [];

		for (i=0; i < l; i++) {
			pass.push(choice(ALL));
		}
		for (i=s; i > 0; i--) {
			pass.push(choice(SPE));
		}

		$input.value = shuffle(pass).join('');
		copyShow();
	}

	function wheel(e) {
		e.preventDefault();

		var value = int(this.value);

		if ( e.deltaY > 0) {
			value++;
		} else if ( e.deltaY < 0) {
			value--;
		} else {
			return;
		}

		if ( setValue(this, value) ) {
			onChange();
		}
	}

	function hashChanged() {
		var hash = window.location.hash;
		if (!hash) {
			return false;
		}

		var num, match, changed;

		match = /(?:^|[^a-z])l(\d+)/i.exec(hash);
		num = match && int(match[1])
		changed = num && setValue($passlength, num);

		match = /(?:^|[^a-z])s(\d+)/i.exec(hash);
		num = match && int(match[1]);
		if ( num && setValue($spelength, num) ) {
			changed = true;
		}

		if ( changed ) {
			onChange();
			return true;
		}
		return false
	}

	initialize(12, 0);
})();