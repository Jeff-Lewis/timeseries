/** 
    Array.map polyfill
 */
if (!Array.prototype.map) {
    Array.prototype.map = function (fun /*, thisArg */) {
        'use strict';

        if (this === void 0 || this === null) {
            throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== 'function') {
            throw new TypeError();
        }

        var res = new Array(len);
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                res[i] = fun.call(thisArg, t[i], i, t);
            }
        }

        return res;
    };
}

(function (global) {
	// Establish the root object, window in the browser, or exports on the server
	var root = this;

    if (!moment && (typeof require !== 'undefined')) {
        moment = require('moment');
    }

    /**TODO
     */
    function isArray (obj) {
		return !!(obj && obj.constructor === Array);
	};

    /**TODO
        Two ways of specifying the series...
         i) Provide nested [data, times] Arrays
        ii) Provide [data] Array and start time, interval size, and interval type
     */
	function TimeSeries (series, start, interval, units) {
        var i, t0, t1;

        if (interval !== undefined) {
            if (typeof interval !== 'number') {
                throw TypeError('Expected "interval" argument to be a Number');
            }
        }

        if (isArray(series[0])) {
            this._data = series[0];
            this._time = series[1];

            if (this._time[0]._isAMomentObject !== true) {
                this._time.map(function (t) {
                    return moment.utc(t);
                });
            }

        } else {
            t0 = moment.utc(start);
            t1 = t0.clone();
            this._data = series;
            this._time = [t0];

            i = 1;
            while (i < this._data.length) {
                t1.add(interval, units);
                this._time.push(t1.clone());
                i += 1;
            }

        }

        if (this._data.length !== this._time.length) {
            throw Error('There is not a time for every data value; data and time Arrays are not the same length');
        }
	};

	// Following Underscore module pattern (http://underscorejs.org/docs/underscore.html)
	if (typeof exports !== 'undefined') {
		exports.TimeSeries = TimeSeries;
	} else {
		root.TimeSeries = TimeSeries;
	}

	global.TimeSeries = TimeSeries;
	return this;
}(this));
