'use strict';
import Promise from 'promise';
import 'core-js/es6/map';
import 'core-js/es6/set';
import assign from 'core-js/modules/es6.object.assign';

if (typeof window['Promise'] === 'undefined') {
	window['Promise'] = Promise;
}

if (!Object.assign) {
	Object.assign = assign;
}
