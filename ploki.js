(function() {
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
		arr.forEach(function(i) {
			var opt = document.createElement('option');
			opt.value = i;
			opt.innerText = i;
			select.appendChild(opt);
		});
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

	function Ploki(passlength, spelength) {
		var lengths = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
		var spelengths = [0, 1, 2, 3, 4, 5];

		this.all = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
		this.spe = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'.split('');

		this.$passlength = document.querySelector('#password-length');
		this.$spelength = document.querySelector('#special-length');
		this.$input = document.querySelector('#plokipass');

		initSelect(this.$passlength, lengths);
		initSelect(this.$spelength, spelengths);

		this.onChange = onChange.bind(this);

		this.$passlength.addEventListener('change', this.onChange);
		this.$spelength.addEventListener('change', this.onChange);
		this.$passlength.addEventListener('wheel', wheel.bind(this.$passlength, this));
		this.$spelength.addEventListener('wheel', wheel.bind(this.$spelength, this));

		document.querySelector('form').addEventListener('submit', this.onChange);

		window.addEventListener('hashchange', hashChanged.bind(this));

		this.$passlength.value = passlength;
		this.$spelength.value = spelength;

		if ( window.location.hash ) {
			hashChanged.bind(this)();
		} else {
			this.onChange();
		}
		
	}

	function onChange(event) {
		// this == ploki
		if ( event && event.type == "submit" ) {
			event.preventDefault();	
		}

		var i = 0,
			s = this.$spelength.value,
			l = this.$passlength.value - s,
			idx,
			pass = [];

	    for (i=0; i < l; i++) {
	        idx = (Math.random() * this.all.length) >>> 0;
	        pass.push(this.all[idx]);
	    }
	    for (i=s; i > 0; i--) {
	        idx = (Math.random() * this.spe.length) >>> 0;
	        pass.push(this.spe[idx]);
	    }

	    this.$input.value = shuffle(pass).join('');
	}

	function wheel(ploki, e) {
		e.preventDefault();

		var value = this.value;

		if ( e.deltaY > 0) {
			value++;
		} else if ( e.deltaY < 0) {
			value--;
		} else {
			return;
		}

		if ( setValue(this, value) ) {
			ploki.onChange();
		}
	}

	function hashChanged() {
		var hash = window.location.hash;
		if (!hash) {
	        return false;
	    }

	    var num, match, changed;

	    match = /l(\d+)/.exec(hash);
	    num = match && int(match[1])
	    changed = num && setValue(this.$passlength, num);

	    match = /s(\d+)/.exec(hash);
	    num = match && int(match[1]);
	    if ( num && setValue(this.$spelength, num) ) {
	        changed = true;
	    }

	    if ( changed ) {
	    	this.onChange();
	    }
	}

	var ploki = new Ploki(12, 0);
})();