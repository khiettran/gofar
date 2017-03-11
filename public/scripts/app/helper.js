var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
var EMAIL_REGEXP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
var NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
var PHONE_NUMBER_REGEXP = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/;

//check input text empty
function isEmpty(text) {    
    return !text || (text.trim().length ? false : true);
}

//check format email
function isEmail(text) {
    return EMAIL_REGEXP.test(text);
    //return text && (text.trim().length && EMAIL_REGEXP.test(text));
}

//check format email
function isNumber(text) {
    return text !== "" && (text.trim().length > 0 && NUMBER_REGEXP.test(text));
}

function isPhoneNumber(text) {
    return text !== "" && (text.trim().length > 0 && PHONE_NUMBER_REGEXP.test(text));
}

/* ----- New Script-----*/
Array.prototype.indexOfObject = function arrayObjectIndexOf(property, value) {
	for (var i = 0, len = this.length; i < len; i++) {		
		if (this[i][property] === value) return i;
	}
	return -1;
}

Array.prototype.indexOfObjectLv2 = function arrayObjectIndexOf(property1, property2, value) {
	for (var i = 0, len = this.length; i < len; i++) {		
		if (this[i][property1][property2] === value) return i;
	}
	return -1;
}

String.prototype.endsWith = function (s) {
	return this.length >= s.length && this.substr(this.length - s.length) === s;
}

var dateFormat = function () {
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
        	val = String(val);
        	len = len || 2;
        	while (val.length < len) val = "0" + val;
        	return val;
        };

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) === "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
            	d: d,
            	dd: pad(d),
            	ddd: dF.i18n.dayNames[D],
            	dddd: dF.i18n.dayNames[D + 7],
            	m: m + 1,
            	mm: pad(m + 1),
            	mmm: dF.i18n.monthNames[m],
            	mmmm: dF.i18n.monthNames[m + 12],
            	yy: String(y).slice(2),
            	yyyy: y,
            	h: H % 12 || 12,
            	hh: pad(H % 12 || 12),
            	H: H,
            	HH: pad(H),
            	M: M,
            	MM: pad(M),
            	s: s,
            	ss: pad(s),
            	l: pad(L, 3),
            	L: pad(L > 99 ? Math.round(L / 10) : L),
            	t: H < 12 ? "a" : "p",
            	tt: H < 12 ? "am" : "pm",
            	T: H < 12 ? "A" : "P",
            	TT: H < 12 ? "AM" : "PM",
            	Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            	o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            	S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
            };

		var newDate = mask.replace(token, function ($0) {			
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
		
		// Triger return empty if there are minimum date
		if (flags.dd === "01" && flags.mm === "01" && flags.yyyy === 1)
			return "";
		return newDate;
	};
}();

var isoDateFormat = function() {
	
}

// Some common format strings
dateFormat.masks = {
	"default": "ddd mmm dd yyyy HH:MM:ss",
	shortDate: "m/d/yy",
	mediumDate: "mmm d, yyyy",
	longDate: "mmmm d, yyyy",
	fullDate: "dddd, mmmm d, yyyy",
	shortTime: "h:MM TT",
	mediumTime: "h:MM:ss TT",
	longTime: "h:MM:ss TT Z",
	isoDate: "yyyy-mm-dd",
	isoTime: "HH:MM:ss",
	isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

Date.prototype.addSeconds = function (seconds) {
	this.setSeconds(this.getSeconds() + seconds);
	return this;
};

Date.prototype.addMinutes = function (minutes) {
	this.setMinutes(this.getMinutes() + minutes);
	return this;
};

Date.prototype.addHours = function (hours) {
	this.setHours(this.getHours() + hours);
	return this;
};

Date.prototype.addDays = function (days) {
	this.setDate(this.getDate() + days);
	return this;
};

Date.prototype.addWeeks = function (weeks) {
	this.addDays(weeks * 7);
	return this;
};

Date.prototype.addMonths = function (months) {
	var dt = this.getDate();

	this.setMonth(this.getMonth() + months);
	var currDt = this.getDate();

	if (dt !== currDt) {
		this.addDays(-currDt);
	}

	return this;
};

Date.prototype.addYears = function (years) {
	var dt = this.getDate();

	this.setFullYear(this.getFullYear() + years);

	var currDt = this.getDate();

	if (dt !== currDt) {
		this.addDays(-currDt);
	}

	return this;
};


function getEndOfDay(day) {
	if (day instanceof Date)
		return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);
	return day;
}

function getAgeInYears(jsonDate) {
	if (jsonDate == null) {
		return "";
	}
	var substringedDate = jsonDate.substring(6);
	var parsedIntDate = parseInt(substringedDate);
	var date = new Date(parsedIntDate);
	var now = new Date();
	return now.getFullYear() - date.getFullYear();
}

function diffBetweenTwoDate(date1, date2) {    
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
}

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}