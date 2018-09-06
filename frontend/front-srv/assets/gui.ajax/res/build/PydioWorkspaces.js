(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PydioWorkspaces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.10.1';

  /** Used to compose bitmasks for wrapper metadata. */
  var BIND_FLAG = 1,
      BIND_KEY_FLAG = 2,
      CURRY_BOUND_FLAG = 4,
      CURRY_FLAG = 8,
      CURRY_RIGHT_FLAG = 16,
      PARTIAL_FLAG = 32,
      PARTIAL_RIGHT_FLAG = 64,
      ARY_FLAG = 128,
      REARG_FLAG = 256;

  /** Used as default options for `_.trunc`. */
  var DEFAULT_TRUNC_LENGTH = 30,
      DEFAULT_TRUNC_OMISSION = '...';

  /** Used to detect when a function becomes hot. */
  var HOT_COUNT = 150,
      HOT_SPAN = 16;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /** Used to indicate the type of lazy iteratees. */
  var LAZY_FILTER_FLAG = 1,
      LAZY_MAP_FLAG = 2;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /** Used as the internal argument placeholder. */
  var PLACEHOLDER = '__lodash_placeholder__';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match empty string literals in compiled template source. */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /** Used to match HTML entities and HTML characters. */
  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
      reUnescapedHtml = /[&<>"'`]/g,
      reHasEscapedHtml = RegExp(reEscapedHtml.source),
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to match template delimiters. */
  var reEscape = /<%-([\s\S]+?)%>/g,
      reEvaluate = /<%([\s\S]+?)%>/g,
      reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/,
      rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */
  var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */
  var reComboMark = /[\u0300-\u036f\ufe20-\ufe23]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect hexadecimal string values. */
  var reHasHexPrefix = /^0[xX]/;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /** Used to match latin-1 supplementary letters (excluding mathematical operators). */
  var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

  /** Used to ensure capturing order of template delimiters. */
  var reNoMatch = /($^)/;

  /** Used to match unescaped characters in compiled string literals. */
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

  /** Used to match words to create compound words. */
  var reWords = (function() {
    var upper = '[A-Z\\xc0-\\xd6\\xd8-\\xde]',
        lower = '[a-z\\xdf-\\xf6\\xf8-\\xff]+';

    return RegExp(upper + '+(?=' + upper + lower + ')|' + upper + '?' + lower + '|' + upper + '+|[0-9]+', 'g');
  }());

  /** Used to assign default `context` object properties. */
  var contextProps = [
    'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
    'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
    'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'isFinite',
    'parseFloat', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
    'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap'
  ];

  /** Used to make template sourceURLs easier to identify. */
  var templateCounter = -1;

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to map latin-1 supplementary letters to basic latin letters. */
  var deburredLetters = {
    '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
    '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
    '\xc7': 'C',  '\xe7': 'c',
    '\xd0': 'D',  '\xf0': 'd',
    '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
    '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
    '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
    '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
    '\xd1': 'N',  '\xf1': 'n',
    '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
    '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
    '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
    '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
    '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
    '\xc6': 'Ae', '\xe6': 'ae',
    '\xde': 'Th', '\xfe': 'th',
    '\xdf': 'ss'
  };

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Used to map HTML entities to characters. */
  var htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#96;': '`'
  };

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /** Used to escape characters for inclusion in compiled regexes. */
  var regexpEscapes = {
    '0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
    '5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
    'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
    'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
    'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
  };

  /** Used to escape characters for inclusion in compiled string literals. */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  /** Detect free variable `self`. */
  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  /** Detect free variable `window`. */
  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */
  function baseCompareAscending(value, other) {
    if (value !== other) {
      var valIsNull = value === null,
          valIsUndef = value === undefined,
          valIsReflexive = value === value;

      var othIsNull = other === null,
          othIsUndef = other === undefined,
          othIsReflexive = other === other;

      if ((value > other && !othIsNull) || !valIsReflexive ||
          (valIsNull && !othIsUndef && othIsReflexive) ||
          (valIsUndef && othIsReflexive)) {
        return 1;
      }
      if ((value < other && !valIsNull) || !othIsReflexive ||
          (othIsNull && !valIsUndef && valIsReflexive) ||
          (othIsUndef && valIsReflexive)) {
        return -1;
      }
    }
    return 0;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromRight) {
    var length = array.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN(array, fromIndex);
    }
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */
  function baseIsFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */
  function charsLeftIndex(string, chars) {
    var index = -1,
        length = string.length;

    while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */
  function charsRightIndex(string, chars) {
    var index = string.length;

    while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
    return index;
  }

  /**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareAscending(object, other) {
    return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
  }

  /**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */
  function compareMultiple(object, other, orders) {
    var index = -1,
        objCriteria = object.criteria,
        othCriteria = other.criteria,
        length = objCriteria.length,
        ordersLength = orders.length;

    while (++index < length) {
      var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * ((order === 'asc' || order === true) ? 1 : -1);
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to provide the same value for
    // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
    // for more details.
    //
    // This also ensures a stable sort in V8 and other engines.
    // See https://code.google.com/p/v8/issues/detail?id=90 for more details.
    return object.index - other.index;
  }

  /**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */
  function deburrLetter(letter) {
    return deburredLetters[letter];
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */
  function escapeRegExpChar(chr, leadingChar, whitespaceChar) {
    if (leadingChar) {
      chr = regexpEscapes[chr];
    } else if (whitespaceChar) {
      chr = stringEscapes[chr];
    }
    return '\\' + chr;
  }

  /**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(chr) {
    return '\\' + stringEscapes[chr];
  }

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */
  function isSpace(charCode) {
    return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 ||
      (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
  }

  /**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */
  function replaceHolders(array, placeholder) {
    var index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      if (array[index] === placeholder) {
        array[index] = PLACEHOLDER;
        result[++resIndex] = index;
      }
    }
    return result;
  }

  /**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */
  function sortedUniq(array, iteratee) {
    var seen,
        index = -1,
        length = array.length,
        resIndex = -1,
        result = [];

    while (++index < length) {
      var value = array[index],
          computed = iteratee ? iteratee(value, index, array) : value;

      if (!index || seen !== computed) {
        seen = computed;
        result[++resIndex] = value;
      }
    }
    return result;
  }

  /**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */
  function trimmedLeftIndex(string) {
    var index = -1,
        length = string.length;

    while (++index < length && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedRightIndex(string) {
    var index = string.length;

    while (index-- && isSpace(string.charCodeAt(index))) {}
    return index;
  }

  /**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */
  function unescapeHtmlChar(chr) {
    return htmlUnescapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See https://es5.github.io/#x11.1.5 for more details.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references. */
    var Array = context.Array,
        Date = context.Date,
        Error = context.Error,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /** Used for native method references. */
    var arrayProto = Array.prototype,
        objectProto = Object.prototype,
        stringProto = String.prototype;

    /** Used to resolve the decompiled source of functions. */
    var fnToString = Function.prototype.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to generate unique IDs. */
    var idCounter = 0;

    /**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objToString = objectProto.toString;

    /** Used to restore the original `_` reference in `_.noConflict`. */
    var oldDash = root._;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Native method references. */
    var ArrayBuffer = context.ArrayBuffer,
        clearTimeout = context.clearTimeout,
        parseFloat = context.parseFloat,
        pow = Math.pow,
        propertyIsEnumerable = objectProto.propertyIsEnumerable,
        Set = getNative(context, 'Set'),
        setTimeout = context.setTimeout,
        splice = arrayProto.splice,
        Uint8Array = context.Uint8Array,
        WeakMap = getNative(context, 'WeakMap');

    /* Native method references for those with the same name as other `lodash` methods. */
    var nativeCeil = Math.ceil,
        nativeCreate = getNative(Object, 'create'),
        nativeFloor = Math.floor,
        nativeIsArray = getNative(Array, 'isArray'),
        nativeIsFinite = context.isFinite,
        nativeKeys = getNative(Object, 'keys'),
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeNow = getNative(Date, 'now'),
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used as references for `-Infinity` and `Infinity`. */
    var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY,
        POSITIVE_INFINITY = Number.POSITIVE_INFINITY;

    /** Used as references for the maximum length and index of an array. */
    var MAX_ARRAY_LENGTH = 4294967295,
        MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
        HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

    /**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** Used to store function metadata. */
    var metaMap = WeakMap && new WeakMap;

    /** Used to lookup unminified function names. */
    var realNames = {};

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
        if (value instanceof LodashWrapper) {
          return value;
        }
        if (hasOwnProperty.call(value, '__chain__') && hasOwnProperty.call(value, '__wrapped__')) {
          return wrapperClone(value);
        }
      }
      return new LodashWrapper(value);
    }

    /**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */
    function baseLodash() {
      // No operation performed.
    }

    /**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */
    function LodashWrapper(value, chainAll, actions) {
      this.__wrapped__ = value;
      this.__actions__ = actions || [];
      this.__chain__ = !!chainAll;
    }

    /**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': reEscape,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': reEvaluate,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*------------------------------------------------------------------------*/

    /**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */
    function LazyWrapper(value) {
      this.__wrapped__ = value;
      this.__actions__ = [];
      this.__dir__ = 1;
      this.__filtered__ = false;
      this.__iteratees__ = [];
      this.__takeCount__ = POSITIVE_INFINITY;
      this.__views__ = [];
    }

    /**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */
    function lazyClone() {
      var result = new LazyWrapper(this.__wrapped__);
      result.__actions__ = arrayCopy(this.__actions__);
      result.__dir__ = this.__dir__;
      result.__filtered__ = this.__filtered__;
      result.__iteratees__ = arrayCopy(this.__iteratees__);
      result.__takeCount__ = this.__takeCount__;
      result.__views__ = arrayCopy(this.__views__);
      return result;
    }

    /**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */
    function lazyReverse() {
      if (this.__filtered__) {
        var result = new LazyWrapper(this);
        result.__dir__ = -1;
        result.__filtered__ = true;
      } else {
        result = this.clone();
        result.__dir__ *= -1;
      }
      return result;
    }

    /**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */
    function lazyValue() {
      var array = this.__wrapped__.value(),
          dir = this.__dir__,
          isArr = isArray(array),
          isRight = dir < 0,
          arrLength = isArr ? array.length : 0,
          view = getView(0, arrLength, this.__views__),
          start = view.start,
          end = view.end,
          length = end - start,
          index = isRight ? end : (start - 1),
          iteratees = this.__iteratees__,
          iterLength = iteratees.length,
          resIndex = 0,
          takeCount = nativeMin(length, this.__takeCount__);

      if (!isArr || arrLength < LARGE_ARRAY_SIZE || (arrLength == length && takeCount == length)) {
        return baseWrapperValue((isRight && isArr) ? array.reverse() : array, this.__actions__);
      }
      var result = [];

      outer:
      while (length-- && resIndex < takeCount) {
        index += dir;

        var iterIndex = -1,
            value = array[index];

        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex],
              iteratee = data.iteratee,
              type = data.type,
              computed = iteratee(value);

          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
      return result;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */
    function MapCache() {
      this.__data__ = {};
    }

    /**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */
    function mapDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */
    function mapGet(key) {
      return key == '__proto__' ? undefined : this.__data__[key];
    }

    /**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapHas(key) {
      return key != '__proto__' && hasOwnProperty.call(this.__data__, key);
    }

    /**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */
    function mapSet(key, value) {
      if (key != '__proto__') {
        this.__data__[key] = value;
      }
      return this;
    }

    /*------------------------------------------------------------------------*/

    /**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var length = values ? values.length : 0;

      this.data = { 'hash': nativeCreate(null), 'set': new Set };
      while (length--) {
        this.push(values[length]);
      }
    }

    /**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */
    function cacheIndexOf(cache, value) {
      var data = cache.data,
          result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

      return result ? 0 : -1;
    }

    /**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */
    function cachePush(value) {
      var data = this.data;
      if (typeof value == 'string' || isObject(value)) {
        data.set.add(value);
      } else {
        data.hash[value] = true;
      }
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */
    function arrayConcat(array, other) {
      var index = -1,
          length = array.length,
          othIndex = -1,
          othLength = other.length,
          result = Array(length + othLength);

      while (++index < length) {
        result[index] = array[index];
      }
      while (++othIndex < othLength) {
        result[index++] = other[othIndex];
      }
      return result;
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function arrayCopy(source, array) {
      var index = -1,
          length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEachRight(array, iteratee) {
      var length = array.length;

      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */
    function arrayEvery(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (!predicate(array[index], index, array)) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function arrayExtremum(array, iteratee, comparator, exValue) {
      var index = -1,
          length = array.length,
          computed = exValue,
          result = computed;

      while (++index < length) {
        var value = array[index],
            current = +iteratee(value);

        if (comparator(current, computed)) {
          computed = current;
          result = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initFromArray) {
      var index = -1,
          length = array.length;

      if (initFromArray && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
      var length = array.length;
      if (initFromArray && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }

    /**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function arraySum(array, iteratee) {
      var length = array.length,
          result = 0;

      while (length--) {
        result += +iteratee(array[length]) || 0;
      }
      return result;
    }

    /**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : objectValue;
    }

    /**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function assignOwnDefaults(objectValue, sourceValue, key, object) {
      return (objectValue === undefined || !hasOwnProperty.call(object, key))
        ? sourceValue
        : objectValue;
    }

    /**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */
    function assignWith(object, source, customizer) {
      var index = -1,
          props = keys(source),
          length = props.length;

      while (++index < length) {
        var key = props[index],
            value = object[key],
            result = customizer(value, source[key], key, object, source);

        if ((result === result ? (result !== value) : (value === value)) ||
            (value === undefined && !(key in object))) {
          object[key] = result;
        }
      }
      return object;
    }

    /**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return source == null
        ? object
        : baseCopy(source, keys(source), object);
    }

    /**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */
    function baseAt(collection, props) {
      var index = -1,
          isNil = collection == null,
          isArr = !isNil && isArrayLike(collection),
          length = isArr ? collection.length : 0,
          propsLength = props.length,
          result = Array(propsLength);

      while(++index < propsLength) {
        var key = props[index];
        if (isArr) {
          result[index] = isIndex(key, length) ? collection[key] : undefined;
        } else {
          result[index] = isNil ? undefined : collection[key];
        }
      }
      return result;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */
    function baseCopy(source, props, object) {
      object || (object = {});

      var index = -1,
          length = props.length;

      while (++index < length) {
        var key = props[index];
        object[key] = source[key];
      }
      return object;
    }

    /**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function baseCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (type == 'function') {
        return thisArg === undefined
          ? func
          : bindCallback(func, thisArg, argCount);
      }
      if (func == null) {
        return identity;
      }
      if (type == 'object') {
        return baseMatches(func);
      }
      return thisArg === undefined
        ? property(func)
        : baseMatchesProperty(func, thisArg);
    }

    /**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
      var result;
      if (customizer) {
        result = object ? customizer(value, key, object) : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return arrayCopy(value, result);
        }
      } else {
        var tag = objToString.call(value),
            isFunc = tag == funcTag;

        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return baseAssign(result, value);
          }
        } else {
          return cloneableTags[tag]
            ? initCloneByTag(value, tag, isDeep)
            : (object ? value : {});
        }
      }
      // Check for circular references and return its corresponding clone.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == value) {
          return stackB[length];
        }
      }
      // Add the source value to the stack of traversed objects and associate it with its clone.
      stackA.push(value);
      stackB.push(result);

      // Recursively populate clone (susceptible to call stack limits).
      (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
        result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    var baseCreate = (function() {
      function object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          object.prototype = prototype;
          var result = new object;
          object.prototype = undefined;
        }
        return result || {};
      };
    }());

    /**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */
    function baseDelay(func, wait, args) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values) {
      var length = array ? array.length : 0,
          result = [];

      if (!length) {
        return result;
      }
      var index = -1,
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
          valuesLength = values.length;

      if (cache) {
        indexOf = cacheIndexOf;
        isCommon = false;
        values = cache;
      }
      outer:
      while (++index < length) {
        var value = array[index];

        if (isCommon && value === value) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === value) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (indexOf(values, value, 0) < 0) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEach = createBaseEach(baseForOwn);

    /**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */
    var baseEachRight = createBaseEach(baseForOwnRight, true);

    /**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */
    function baseEvery(collection, predicate) {
      var result = true;
      baseEach(collection, function(value, index, collection) {
        result = !!predicate(value, index, collection);
        return result;
      });
      return result;
    }

    /**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */
    function baseExtremum(collection, iteratee, comparator, exValue) {
      var computed = exValue,
          result = computed;

      baseEach(collection, function(value, index, collection) {
        var current = +iteratee(value, index, collection);
        if (comparator(current, computed) || (current === exValue && current === result)) {
          computed = current;
          result = value;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */
    function baseFill(array, value, start, end) {
      var length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : (end >>> 0);
      start >>>= 0;

      while (start < length) {
        array[start++] = value;
      }
      return array;
    }

    /**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function baseFilter(collection, predicate) {
      var result = [];
      baseEach(collection, function(value, index, collection) {
        if (predicate(value, index, collection)) {
          result.push(value);
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */
    function baseFind(collection, predicate, eachFunc, retKey) {
      var result;
      eachFunc(collection, function(value, key, collection) {
        if (predicate(value, key, collection)) {
          result = retKey ? key : value;
          return false;
        }
      });
      return result;
    }

    /**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, isDeep, isStrict, result) {
      result || (result = []);

      var index = -1,
          length = array.length;

      while (++index < length) {
        var value = array[index];
        if (isObjectLike(value) && isArrayLike(value) &&
            (isStrict || isArray(value) || isArguments(value))) {
          if (isDeep) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, isDeep, isStrict, result);
          } else {
            arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    /**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseFor = createBaseFor();

    /**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */
    var baseForRight = createBaseFor(true);

    /**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForIn(object, iteratee) {
      return baseFor(object, iteratee, keysIn);
    }

    /**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwn(object, iteratee) {
      return baseFor(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */
    function baseForOwnRight(object, iteratee) {
      return baseForRight(object, iteratee, keys);
    }

    /**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */
    function baseFunctions(object, props) {
      var index = -1,
          length = props.length,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var key = props[index];
        if (isFunction(object[key])) {
          result[++resIndex] = key;
        }
      }
      return result;
    }

    /**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path, pathKey) {
      if (object == null) {
        return;
      }
      if (pathKey !== undefined && pathKey in toObject(object)) {
        path = [pathKey];
      }
      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[path[index++]];
      }
      return (index && index == length) ? object : undefined;
    }

    /**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objIsArr = isArray(object),
          othIsArr = isArray(other),
          objTag = arrayTag,
          othTag = arrayTag;

      if (!objIsArr) {
        objTag = objToString.call(object);
        if (objTag == argsTag) {
          objTag = objectTag;
        } else if (objTag != objectTag) {
          objIsArr = isTypedArray(object);
        }
      }
      if (!othIsArr) {
        othTag = objToString.call(other);
        if (othTag == argsTag) {
          othTag = objectTag;
        } else if (othTag != objectTag) {
          othIsArr = isTypedArray(other);
        }
      }
      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && !(objIsArr || objIsObj)) {
        return equalByTag(object, other, objTag);
      }
      if (!isLoose) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
        }
      }
      if (!isSameTag) {
        return false;
      }
      // Assume cyclic values are equal.
      // For more information on detecting circular references see https://es5.github.io/#JO.
      stackA || (stackA = []);
      stackB || (stackB = []);

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == object) {
          return stackB[length] == other;
        }
      }
      // Add `object` and `other` to the stack of traversed objects.
      stackA.push(object);
      stackB.push(other);

      var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

      stackA.pop();
      stackB.pop();

      return result;
    }

    /**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = toObject(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var result = customizer ? customizer(objValue, srcValue, key) : undefined;
          if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
            return false;
          }
        }
      }
      return true;
    }

    /**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function baseMap(collection, iteratee) {
      var index = -1,
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value, key, collection) {
        result[++index] = iteratee(value, key, collection);
      });
      return result;
    }

    /**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        var key = matchData[0][0],
            value = matchData[0][1];

        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === value && (value !== undefined || (key in toObject(object)));
        };
      }
      return function(object) {
        return baseIsMatch(object, matchData);
      };
    }

    /**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */
    function baseMatchesProperty(path, srcValue) {
      var isArr = isArray(path),
          isCommon = isKey(path) && isStrictComparable(srcValue),
          pathKey = (path + '');

      path = toPath(path);
      return function(object) {
        if (object == null) {
          return false;
        }
        var key = pathKey;
        object = toObject(object);
        if ((isArr || !isCommon) && !(key in object)) {
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          if (object == null) {
            return false;
          }
          key = last(path);
          object = toObject(object);
        }
        return object[key] === srcValue
          ? (srcValue !== undefined || (key in object))
          : baseIsEqual(srcValue, object[key], undefined, true);
      };
    }

    /**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */
    function baseMerge(object, source, customizer, stackA, stackB) {
      if (!isObject(object)) {
        return object;
      }
      var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
          props = isSrcArr ? undefined : keys(source);

      arrayEach(props || source, function(srcValue, key) {
        if (props) {
          key = srcValue;
          srcValue = source[key];
        }
        if (isObjectLike(srcValue)) {
          stackA || (stackA = []);
          stackB || (stackB = []);
          baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
        }
        else {
          var value = object[key],
              result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
              isCommon = result === undefined;

          if (isCommon) {
            result = srcValue;
          }
          if ((result !== undefined || (isSrcArr && !(key in object))) &&
              (isCommon || (result === result ? (result !== value) : (value === value)))) {
            object[key] = result;
          }
        }
      });
      return object;
    }

    /**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
      var length = stackA.length,
          srcValue = source[key];

      while (length--) {
        if (stackA[length] == srcValue) {
          object[key] = stackB[length];
          return;
        }
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
        if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
          result = isArray(value)
            ? value
            : (isArrayLike(value) ? arrayCopy(value) : []);
        }
        else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          result = isArguments(value)
            ? toPlainObject(value)
            : (isPlainObject(value) ? value : {});
        }
        else {
          isCommon = false;
        }
      }
      // Add the source value to the stack of traversed objects and associate
      // it with its merged value.
      stackA.push(srcValue);
      stackB.push(result);

      if (isCommon) {
        // Recursively merge objects and arrays (susceptible to call stack limits).
        object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
      } else if (result === result ? (result !== value) : (value === value)) {
        object[key] = result;
      }
    }

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */
    function basePropertyDeep(path) {
      var pathKey = (path + '');
      path = toPath(path);
      return function(object) {
        return baseGet(object, path, pathKey);
      };
    }

    /**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0;
      while (length--) {
        var index = indexes[length];
        if (index != previous && isIndex(index)) {
          var previous = index;
          splice.call(array, index, 1);
        }
      }
      return array;
    }

    /**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */
    function baseRandom(min, max) {
      return min + nativeFloor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */
    function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
      eachFunc(collection, function(value, index, collection) {
        accumulator = initFromCollection
          ? (initFromCollection = false, value)
          : iteratee(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var baseSetData = !metaMap ? identity : function(func, data) {
      metaMap.set(func, data);
      return func;
    };

    /**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseSlice(array, start, end) {
      var index = -1,
          length = array.length;

      start = start == null ? 0 : (+start || 0);
      if (start < 0) {
        start = -start > length ? 0 : (length + start);
      }
      end = (end === undefined || end > length) ? length : (+end || 0);
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : ((end - start) >>> 0);
      start >>>= 0;

      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }

    /**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function baseSome(collection, predicate) {
      var result;

      baseEach(collection, function(value, index, collection) {
        result = predicate(value, index, collection);
        return !result;
      });
      return !!result;
    }

    /**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */
    function baseSortBy(array, comparer) {
      var length = array.length;

      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }

    /**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */
    function baseSortByOrder(collection, iteratees, orders) {
      var callback = getCallback(),
          index = -1;

      iteratees = arrayMap(iteratees, function(iteratee) { return callback(iteratee); });

      var result = baseMap(collection, function(value) {
        var criteria = arrayMap(iteratees, function(iteratee) { return iteratee(value); });
        return { 'criteria': criteria, 'index': ++index, 'value': value };
      });

      return baseSortBy(result, function(object, other) {
        return compareMultiple(object, other, orders);
      });
    }

    /**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */
    function baseSum(collection, iteratee) {
      var result = 0;
      baseEach(collection, function(value, index, collection) {
        result += +iteratee(value, index, collection) || 0;
      });
      return result;
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */
    function baseUniq(array, iteratee) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array.length,
          isCommon = indexOf == baseIndexOf,
          isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
          seen = isLarge ? createCache() : null,
          result = [];

      if (seen) {
        indexOf = cacheIndexOf;
        isCommon = false;
      } else {
        isLarge = false;
        seen = iteratee ? [] : result;
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee ? iteratee(value, index, array) : value;

        if (isCommon && value === value) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        }
        else if (indexOf(seen, computed, 0) < 0) {
          if (iteratee || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */
    function baseValues(object, props) {
      var index = -1,
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */
    function baseWhile(array, predicate, isDrop, fromRight) {
      var length = array.length,
          index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {}
      return isDrop
        ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
        : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
    }

    /**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */
    function baseWrapperValue(value, actions) {
      var result = value;
      if (result instanceof LazyWrapper) {
        result = result.value();
      }
      var index = -1,
          length = actions.length;

      while (++index < length) {
        var action = actions[index];
        result = action.func.apply(action.thisArg, arrayPush([result], action.args));
      }
      return result;
    }

    /**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndex(array, value, retHighest) {
      var low = 0,
          high = array ? array.length : low;

      if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
        while (low < high) {
          var mid = (low + high) >>> 1,
              computed = array[mid];

          if ((retHighest ? (computed <= value) : (computed < value)) && computed !== null) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return high;
      }
      return binaryIndexBy(array, value, identity, retHighest);
    }

    /**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */
    function binaryIndexBy(array, value, iteratee, retHighest) {
      value = iteratee(value);

      var low = 0,
          high = array ? array.length : 0,
          valIsNaN = value !== value,
          valIsNull = value === null,
          valIsUndef = value === undefined;

      while (low < high) {
        var mid = nativeFloor((low + high) / 2),
            computed = iteratee(array[mid]),
            isDef = computed !== undefined,
            isReflexive = computed === computed;

        if (valIsNaN) {
          var setLow = isReflexive || retHighest;
        } else if (valIsNull) {
          setLow = isReflexive && isDef && (retHighest || computed != null);
        } else if (valIsUndef) {
          setLow = isReflexive && (retHighest || isDef);
        } else if (computed == null) {
          setLow = false;
        } else {
          setLow = retHighest ? (computed <= value) : (computed < value);
        }
        if (setLow) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return nativeMin(high, MAX_ARRAY_INDEX);
    }

    /**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */
    function bindCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      if (thisArg === undefined) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
        case 5: return function(value, other, key, object, source) {
          return func.call(thisArg, value, other, key, object, source);
        };
      }
      return function() {
        return func.apply(thisArg, arguments);
      };
    }

    /**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function bufferClone(buffer) {
      var result = new ArrayBuffer(buffer.byteLength),
          view = new Uint8Array(result);

      view.set(new Uint8Array(buffer));
      return result;
    }

    /**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgs(args, partials, holders) {
      var holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          leftIndex = -1,
          leftLength = partials.length,
          result = Array(leftLength + argsLength);

      while (++leftIndex < leftLength) {
        result[leftIndex] = partials[leftIndex];
      }
      while (++argsIndex < holdersLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
      while (argsLength--) {
        result[leftIndex++] = args[argsIndex++];
      }
      return result;
    }

    /**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */
    function composeArgsRight(args, partials, holders) {
      var holdersIndex = -1,
          holdersLength = holders.length,
          argsIndex = -1,
          argsLength = nativeMax(args.length - holdersLength, 0),
          rightIndex = -1,
          rightLength = partials.length,
          result = Array(argsLength + rightLength);

      while (++argsIndex < argsLength) {
        result[argsIndex] = args[argsIndex];
      }
      var offset = argsIndex;
      while (++rightIndex < rightLength) {
        result[offset + rightIndex] = partials[rightIndex];
      }
      while (++holdersIndex < holdersLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
      return result;
    }

    /**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter, initializer) {
      return function(collection, iteratee, thisArg) {
        var result = initializer ? initializer() : {};
        iteratee = getCallback(iteratee, thisArg, 3);

        if (isArray(collection)) {
          var index = -1,
              length = collection.length;

          while (++index < length) {
            var value = collection[index];
            setter(result, value, iteratee(value, index, collection), collection);
          }
        } else {
          baseEach(collection, function(value, key, collection) {
            setter(result, value, iteratee(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */
    function createAssigner(assigner) {
      return restParam(function(object, sources) {
        var index = -1,
            length = object == null ? 0 : sources.length,
            customizer = length > 2 ? sources[length - 2] : undefined,
            guard = length > 2 ? sources[2] : undefined,
            thisArg = length > 1 ? sources[length - 1] : undefined;

        if (typeof customizer == 'function') {
          customizer = bindCallback(customizer, thisArg, 5);
          length -= 2;
        } else {
          customizer = typeof thisArg == 'function' ? thisArg : undefined;
          length -= (customizer ? 1 : 0);
        }
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? undefined : customizer;
          length = 1;
        }
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, customizer);
          }
        }
        return object;
      });
    }

    /**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        var length = collection ? getLength(collection) : 0;
        if (!isLength(length)) {
          return eachFunc(collection, iteratee);
        }
        var index = fromRight ? length : -1,
            iterable = toObject(collection);

        while ((fromRight ? index-- : ++index < length)) {
          if (iteratee(iterable[index], index, iterable) === false) {
            break;
          }
        }
        return collection;
      };
    }

    /**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var iterable = toObject(object),
            props = keysFunc(object),
            length = props.length,
            index = fromRight ? length : -1;

        while ((fromRight ? index-- : ++index < length)) {
          var key = props[index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */
    function createBindWrapper(func, thisArg) {
      var Ctor = createCtorWrapper(func);

      function wrapper() {
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(thisArg, arguments);
      }
      return wrapper;
    }

    /**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */
    function createCache(values) {
      return (nativeCreate && Set) ? new SetCache(values) : null;
    }

    /**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */
    function createCompounder(callback) {
      return function(string) {
        var index = -1,
            array = words(deburr(string)),
            length = array.length,
            result = '';

        while (++index < length) {
          result = callback(result, array[index], index);
        }
        return result;
      };
    }

    /**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */
    function createCtorWrapper(Ctor) {
      return function() {
        // Use a `switch` statement to work with class constructors.
        // See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
        // for more details.
        var args = arguments;
        switch (args.length) {
          case 0: return new Ctor;
          case 1: return new Ctor(args[0]);
          case 2: return new Ctor(args[0], args[1]);
          case 3: return new Ctor(args[0], args[1], args[2]);
          case 4: return new Ctor(args[0], args[1], args[2], args[3]);
          case 5: return new Ctor(args[0], args[1], args[2], args[3], args[4]);
          case 6: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
          case 7: return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        }
        var thisBinding = baseCreate(Ctor.prototype),
            result = Ctor.apply(thisBinding, args);

        // Mimic the constructor's `return` behavior.
        // See https://es5.github.io/#x13.2.2 for more details.
        return isObject(result) ? result : thisBinding;
      };
    }

    /**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */
    function createCurry(flag) {
      function curryFunc(func, arity, guard) {
        if (guard && isIterateeCall(func, arity, guard)) {
          arity = undefined;
        }
        var result = createWrapper(func, flag, undefined, undefined, undefined, undefined, undefined, arity);
        result.placeholder = curryFunc.placeholder;
        return result;
      }
      return curryFunc;
    }

    /**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */
    function createDefaults(assigner, customizer) {
      return restParam(function(args) {
        var object = args[0];
        if (object == null) {
          return object;
        }
        args.push(customizer);
        return assigner.apply(undefined, args);
      });
    }

    /**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */
    function createExtremum(comparator, exValue) {
      return function(collection, iteratee, thisArg) {
        if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
          iteratee = undefined;
        }
        iteratee = getCallback(iteratee, thisArg, 3);
        if (iteratee.length == 1) {
          collection = isArray(collection) ? collection : toIterable(collection);
          var result = arrayExtremum(collection, iteratee, comparator, exValue);
          if (!(collection.length && result === exValue)) {
            return result;
          }
        }
        return baseExtremum(collection, iteratee, comparator, exValue);
      };
    }

    /**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFind(eachFunc, fromRight) {
      return function(collection, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        if (isArray(collection)) {
          var index = baseFindIndex(collection, predicate, fromRight);
          return index > -1 ? collection[index] : undefined;
        }
        return baseFind(collection, predicate, eachFunc);
      };
    }

    /**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */
    function createFindIndex(fromRight) {
      return function(array, predicate, thisArg) {
        if (!(array && array.length)) {
          return -1;
        }
        predicate = getCallback(predicate, thisArg, 3);
        return baseFindIndex(array, predicate, fromRight);
      };
    }

    /**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */
    function createFindKey(objectFunc) {
      return function(object, predicate, thisArg) {
        predicate = getCallback(predicate, thisArg, 3);
        return baseFind(object, predicate, objectFunc, true);
      };
    }

    /**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */
    function createFlow(fromRight) {
      return function() {
        var wrapper,
            length = arguments.length,
            index = fromRight ? length : -1,
            leftIndex = 0,
            funcs = Array(length);

        while ((fromRight ? index-- : ++index < length)) {
          var func = funcs[leftIndex++] = arguments[index];
          if (typeof func != 'function') {
            throw new TypeError(FUNC_ERROR_TEXT);
          }
          if (!wrapper && LodashWrapper.prototype.thru && getFuncName(func) == 'wrapper') {
            wrapper = new LodashWrapper([], true);
          }
        }
        index = wrapper ? -1 : length;
        while (++index < length) {
          func = funcs[index];

          var funcName = getFuncName(func),
              data = funcName == 'wrapper' ? getData(func) : undefined;

          if (data && isLaziable(data[0]) && data[1] == (ARY_FLAG | CURRY_FLAG | PARTIAL_FLAG | REARG_FLAG) && !data[4].length && data[9] == 1) {
            wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
          } else {
            wrapper = (func.length == 1 && isLaziable(func)) ? wrapper[funcName]() : wrapper.thru(func);
          }
        }
        return function() {
          var args = arguments,
              value = args[0];

          if (wrapper && args.length == 1 && isArray(value) && value.length >= LARGE_ARRAY_SIZE) {
            return wrapper.plant(value).value();
          }
          var index = 0,
              result = length ? funcs[index].apply(this, args) : value;

          while (++index < length) {
            result = funcs[index].call(this, result);
          }
          return result;
        };
      };
    }

    /**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createForEach(arrayFunc, eachFunc) {
      return function(collection, iteratee, thisArg) {
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee)
          : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
      };
    }

    /**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForIn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee, keysIn);
      };
    }

    /**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */
    function createForOwn(objectFunc) {
      return function(object, iteratee, thisArg) {
        if (typeof iteratee != 'function' || thisArg !== undefined) {
          iteratee = bindCallback(iteratee, thisArg, 3);
        }
        return objectFunc(object, iteratee);
      };
    }

    /**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */
    function createObjectMapper(isMapKeys) {
      return function(object, iteratee, thisArg) {
        var result = {};
        iteratee = getCallback(iteratee, thisArg, 3);

        baseForOwn(object, function(value, key, object) {
          var mapped = iteratee(value, key, object);
          key = isMapKeys ? mapped : key;
          value = isMapKeys ? value : mapped;
          result[key] = value;
        });
        return result;
      };
    }

    /**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */
    function createPadDir(fromRight) {
      return function(string, length, chars) {
        string = baseToString(string);
        return (fromRight ? string : '') + createPadding(string, length, chars) + (fromRight ? '' : string);
      };
    }

    /**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */
    function createPartial(flag) {
      var partialFunc = restParam(function(func, partials) {
        var holders = replaceHolders(partials, partialFunc.placeholder);
        return createWrapper(func, flag, undefined, partials, holders);
      });
      return partialFunc;
    }

    /**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */
    function createReduce(arrayFunc, eachFunc) {
      return function(collection, iteratee, accumulator, thisArg) {
        var initFromArray = arguments.length < 3;
        return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
          ? arrayFunc(collection, iteratee, accumulator, initFromArray)
          : baseReduce(collection, getCallback(iteratee, thisArg, 4), accumulator, initFromArray, eachFunc);
      };
    }

    /**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createHybridWrapper(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & ARY_FLAG,
          isBind = bitmask & BIND_FLAG,
          isBindKey = bitmask & BIND_KEY_FLAG,
          isCurry = bitmask & CURRY_FLAG,
          isCurryBound = bitmask & CURRY_BOUND_FLAG,
          isCurryRight = bitmask & CURRY_RIGHT_FLAG,
          Ctor = isBindKey ? undefined : createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it to other functions.
        var length = arguments.length,
            index = length,
            args = Array(length);

        while (index--) {
          args[index] = arguments[index];
        }
        if (partials) {
          args = composeArgs(args, partials, holders);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight);
        }
        if (isCurry || isCurryRight) {
          var placeholder = wrapper.placeholder,
              argsHolders = replaceHolders(args, placeholder);

          length -= argsHolders.length;
          if (length < arity) {
            var newArgPos = argPos ? arrayCopy(argPos) : undefined,
                newArity = nativeMax(arity - length, 0),
                newsHolders = isCurry ? argsHolders : undefined,
                newHoldersRight = isCurry ? undefined : argsHolders,
                newPartials = isCurry ? args : undefined,
                newPartialsRight = isCurry ? undefined : args;

            bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
            bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);

            if (!isCurryBound) {
              bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
            }
            var newData = [func, bitmask, thisArg, newPartials, newsHolders, newPartialsRight, newHoldersRight, newArgPos, ary, newArity],
                result = createHybridWrapper.apply(undefined, newData);

            if (isLaziable(func)) {
              setData(result, newData);
            }
            result.placeholder = placeholder;
            return result;
          }
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        if (argPos) {
          args = reorder(args, argPos);
        }
        if (isAry && ary < args.length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtorWrapper(func);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }

    /**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */
    function createPadding(string, length, chars) {
      var strLength = string.length;
      length = +length;

      if (strLength >= length || !nativeIsFinite(length)) {
        return '';
      }
      var padLength = length - strLength;
      chars = chars == null ? ' ' : (chars + '');
      return repeat(chars, nativeCeil(padLength / chars.length)).slice(0, padLength);
    }

    /**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */
    function createPartialWrapper(func, bitmask, thisArg, partials) {
      var isBind = bitmask & BIND_FLAG,
          Ctor = createCtorWrapper(func);

      function wrapper() {
        // Avoid `arguments` object use disqualifying optimizations by
        // converting it to an array before providing it `func`.
        var argsIndex = -1,
            argsLength = arguments.length,
            leftIndex = -1,
            leftLength = partials.length,
            args = Array(leftLength + argsLength);

        while (++leftIndex < leftLength) {
          args[leftIndex] = partials[leftIndex];
        }
        while (argsLength--) {
          args[leftIndex++] = arguments[++argsIndex];
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return fn.apply(isBind ? thisArg : this, args);
      }
      return wrapper;
    }

    /**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */
    function createRound(methodName) {
      var func = Math[methodName];
      return function(number, precision) {
        precision = precision === undefined ? 0 : (+precision || 0);
        if (precision) {
          precision = pow(10, precision);
          return func(number * precision) / precision;
        }
        return func(number);
      };
    }

    /**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */
    function createSortedIndex(retHighest) {
      return function(array, value, iteratee, thisArg) {
        var callback = getCallback(iteratee);
        return (iteratee == null && callback === baseCallback)
          ? binaryIndex(array, value, retHighest)
          : binaryIndexBy(array, value, callback(iteratee, thisArg, 1), retHighest);
      };
    }

    /**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrapper(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(PARTIAL_FLAG | PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      length -= (holders ? holders.length : 0);
      if (bitmask & PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func),
          newData = [func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity];

      if (data) {
        mergeData(newData, data);
        bitmask = newData[1];
        arity = newData[9];
      }
      newData[9] = arity == null
        ? (isBindKey ? 0 : func.length)
        : (nativeMax(arity - length, 0) || 0);

      if (bitmask == BIND_FLAG) {
        var result = createBindWrapper(newData[0], newData[2]);
      } else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !newData[4].length) {
        result = createPartialWrapper.apply(undefined, newData);
      } else {
        result = createHybridWrapper.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setter(result, newData);
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var index = -1,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
        return false;
      }
      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index],
            result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

        if (result !== undefined) {
          if (result) {
            continue;
          }
          return false;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (isLoose) {
          if (!arraySome(other, function(othValue) {
                return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
              })) {
            return false;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
          return false;
        }
      }
      return true;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag) {
      switch (tag) {
        case boolTag:
        case dateTag:
          // Coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
          return +object == +other;

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case numberTag:
          // Treat `NaN` vs. `NaN` as equal.
          return (object != +object)
            ? other != +other
            : object == +other;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings primitives and string
          // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
          return object == (other + '');
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
      var objProps = keys(object),
          objLength = objProps.length,
          othProps = keys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isLoose) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var skipCtor = isLoose;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key],
            result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;

        // Recursively compare objects (susceptible to call stack limits).
        if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
          return false;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (!skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          return false;
        }
      }
      return true;
    }

    /**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */
    function getCallback(func, thisArg, argCount) {
      var result = lodash.callback || callback;
      result = result === callback ? baseCallback : result;
      return argCount ? result(func, thisArg, argCount) : result;
    }

    /**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */
    var getData = !metaMap ? noop : function(func) {
      return metaMap.get(func);
    };

    /**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */
    function getFuncName(func) {
      var result = func.name,
          array = realNames[result],
          length = array ? array.length : 0;

      while (length--) {
        var data = array[length],
            otherFunc = data.func;
        if (otherFunc == null || otherFunc == func) {
          return data.name;
        }
      }
      return result;
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */
    function getIndexOf(collection, target, fromIndex) {
      var result = lodash.indexOf || indexOf;
      result = result === indexOf ? baseIndexOf : result;
      return collection ? result(collection, target, fromIndex) : result;
    }

    /**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */
    var getLength = baseProperty('length');

    /**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = pairs(object),
          length = result.length;

      while (length--) {
        result[length][2] = isStrictComparable(result[length][1]);
      }
      return result;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = object == null ? undefined : object[key];
      return isNative(value) ? value : undefined;
    }

    /**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */
    function getView(start, end, transforms) {
      var index = -1,
          length = transforms.length;

      while (++index < length) {
        var data = transforms[index],
            size = data.size;

        switch (data.type) {
          case 'drop':      start += size; break;
          case 'dropRight': end -= size; break;
          case 'take':      end = nativeMin(end, start + size); break;
          case 'takeRight': start = nativeMax(start, end - size); break;
        }
      }
      return { 'start': start, 'end': end };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
          result = new array.constructor(length);

      // Add array properties assigned by `RegExp#exec`.
      if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      var Ctor = object.constructor;
      if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
        Ctor = Object;
      }
      return new Ctor;
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return bufferClone(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case float32Tag: case float64Tag:
        case int8Tag: case int16Tag: case int32Tag:
        case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
          var buffer = object.buffer;
          return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          var result = new Ctor(object.source, reFlags.exec(object));
          result.lastIndex = object.lastIndex;
      }
      return result;
    }

    /**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */
    function invokePath(object, path, args) {
      if (object != null && !isKey(path, object)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        path = last(path);
      }
      var func = object == null ? object : object[path];
      return func == null ? undefined : func.apply(object, args);
    }

    /**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */
    function isArrayLike(value) {
      return value != null && isLength(getLength(value));
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return value > -1 && value % 1 == 0 && value < length;
    }

    /**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == 'number'
          ? (isArrayLike(object) && isIndex(index, object.length))
          : (type == 'string' && index in object)) {
        var other = object[index];
        return value === value ? (value === other) : (other !== other);
      }
      return false;
    }

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      var type = typeof value;
      if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
        return true;
      }
      if (isArray(value)) {
        return false;
      }
      var result = !reIsDeepProp.test(value);
      return result || (object != null && value in toObject(object));
    }

    /**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */
    function isLaziable(func) {
      var funcName = getFuncName(func);
      if (!(funcName in LazyWrapper.prototype)) {
        return false;
      }
      var other = lodash[funcName];
      if (func === other) {
        return true;
      }
      var data = getData(other);
      return !!data && func === data[0];
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */
    function isLength(value) {
      return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }

    /**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */
    function mergeData(data, source) {
      var bitmask = data[1],
          srcBitmask = source[1],
          newBitmask = bitmask | srcBitmask,
          isCommon = newBitmask < ARY_FLAG;

      var isCombo =
        (srcBitmask == ARY_FLAG && bitmask == CURRY_FLAG) ||
        (srcBitmask == ARY_FLAG && bitmask == REARG_FLAG && data[7].length <= source[8]) ||
        (srcBitmask == (ARY_FLAG | REARG_FLAG) && bitmask == CURRY_FLAG);

      // Exit early if metadata can't be merged.
      if (!(isCommon || isCombo)) {
        return data;
      }
      // Use source `thisArg` if available.
      if (srcBitmask & BIND_FLAG) {
        data[2] = source[2];
        // Set when currying a bound function.
        newBitmask |= (bitmask & BIND_FLAG) ? 0 : CURRY_BOUND_FLAG;
      }
      // Compose partial arguments.
      var value = source[3];
      if (value) {
        var partials = data[3];
        data[3] = partials ? composeArgs(partials, value, source[4]) : arrayCopy(value);
        data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : arrayCopy(source[4]);
      }
      // Compose partial right arguments.
      value = source[5];
      if (value) {
        partials = data[5];
        data[5] = partials ? composeArgsRight(partials, value, source[6]) : arrayCopy(value);
        data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : arrayCopy(source[6]);
      }
      // Use source `argPos` if available.
      value = source[7];
      if (value) {
        data[7] = arrayCopy(value);
      }
      // Use source `ary` if it's smaller.
      if (srcBitmask & ARY_FLAG) {
        data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
      }
      // Use source `arity` if one is not provided.
      if (data[9] == null) {
        data[9] = source[9];
      }
      // Use source `func` and merge bitmasks.
      data[0] = source[0];
      data[1] = newBitmask;

      return data;
    }

    /**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */
    function mergeDefaults(objectValue, sourceValue) {
      return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */
    function pickByArray(object, props) {
      object = toObject(object);

      var index = -1,
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        if (key in object) {
          result[key] = object[key];
        }
      }
      return result;
    }

    /**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */
    function pickByCallback(object, predicate) {
      var result = {};
      baseForIn(object, function(value, key, object) {
        if (predicate(value, key, object)) {
          result[key] = value;
        }
      });
      return result;
    }

    /**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */
    function reorder(array, indexes) {
      var arrLength = array.length,
          length = nativeMin(indexes.length, arrLength),
          oldArray = arrayCopy(array);

      while (length--) {
        var index = indexes[length];
        array[length] = isIndex(index, arrLength) ? oldArray[index] : undefined;
      }
      return array;
    }

    /**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */
    var setData = (function() {
      var count = 0,
          lastCalled = 0;

      return function(key, value) {
        var stamp = now(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return key;
          }
        } else {
          count = 0;
        }
        return baseSetData(key, value);
      };
    }());

    /**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function shimKeys(object) {
      var props = keysIn(object),
          propsLength = props.length,
          length = propsLength && object.length;

      var allowIndexes = !!length && isLength(length) &&
        (isArray(object) || isArguments(object));

      var index = -1,
          result = [];

      while (++index < propsLength) {
        var key = props[index];
        if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */
    function toIterable(value) {
      if (value == null) {
        return [];
      }
      if (!isArrayLike(value)) {
        return values(value);
      }
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */
    function toObject(value) {
      return isObject(value) ? value : Object(value);
    }

    /**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */
    function toPath(value) {
      if (isArray(value)) {
        return value;
      }
      var result = [];
      baseToString(value).replace(rePropName, function(match, number, quote, string) {
        result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    }

    /**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */
    function wrapperClone(wrapper) {
      return wrapper instanceof LazyWrapper
        ? wrapper.clone()
        : new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__, arrayCopy(wrapper.__actions__));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */
    function chunk(array, size, guard) {
      if (guard ? isIterateeCall(array, size, guard) : size == null) {
        size = 1;
      } else {
        size = nativeMax(nativeFloor(size) || 1, 1);
      }
      var index = 0,
          length = array ? array.length : 0,
          resIndex = -1,
          result = Array(nativeCeil(length / size));

      while (index < length) {
        result[++resIndex] = baseSlice(array, index, (index += size));
      }
      return result;
    }

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          resIndex = -1,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[++resIndex] = value;
        }
      }
      return result;
    }

    /**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */
    var difference = restParam(function(array, values) {
      return (isObjectLike(array) && isArrayLike(array))
        ? baseDifference(array, baseFlatten(values, false, true))
        : [];
    });

    /**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function drop(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */
    function dropRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true, true)
        : [];
    }

    /**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function dropWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), true)
        : [];
    }

    /**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */
    function fill(array, value, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (start && typeof start != 'number' && isIterateeCall(array, value, start)) {
        start = 0;
        end = length;
      }
      return baseFill(array, value, start, end);
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */
    var findIndex = createFindIndex();

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */
    var findLastIndex = createFindIndex(true);

    /**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */
    function first(array) {
      return array ? array[0] : undefined;
    }

    /**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */
    function flatten(array, isDeep, guard) {
      var length = array ? array.length : 0;
      if (guard && isIterateeCall(array, isDeep, guard)) {
        isDeep = false;
      }
      return length ? baseFlatten(array, isDeep) : [];
    }

    /**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */
    function flattenDeep(array) {
      var length = array ? array.length : 0;
      return length ? baseFlatten(array, true) : [];
    }

    /**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      if (typeof fromIndex == 'number') {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
      } else if (fromIndex) {
        var index = binaryIndex(array, value);
        if (index < length &&
            (value === value ? (value === array[index]) : (array[index] !== array[index]))) {
          return index;
        }
        return -1;
      }
      return baseIndexOf(array, value, fromIndex || 0);
    }

    /**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */
    function initial(array) {
      return dropRight(array, 1);
    }

    /**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */
    var intersection = restParam(function(arrays) {
      var othLength = arrays.length,
          othIndex = othLength,
          caches = Array(length),
          indexOf = getIndexOf(),
          isCommon = indexOf == baseIndexOf,
          result = [];

      while (othIndex--) {
        var value = arrays[othIndex] = isArrayLike(value = arrays[othIndex]) ? value : [];
        caches[othIndex] = (isCommon && value.length >= 120) ? createCache(othIndex && value) : null;
      }
      var array = arrays[0],
          index = -1,
          length = array ? array.length : 0,
          seen = caches[0];

      outer:
      while (++index < length) {
        value = array[index];
        if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
          var othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(arrays[othIndex], value, 0)) < 0) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(value);
          }
          result.push(value);
        }
      }
      return result;
    });

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array ? array.length : 0;
      return length ? array[length - 1] : undefined;
    }

    /**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */
    function lastIndexOf(array, value, fromIndex) {
      var length = array ? array.length : 0;
      if (!length) {
        return -1;
      }
      var index = length;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(length + fromIndex, 0) : nativeMin(fromIndex || 0, length - 1)) + 1;
      } else if (fromIndex) {
        index = binaryIndex(array, value, true) - 1;
        var other = array[index];
        if (value === value ? (value === other) : (other !== other)) {
          return index;
        }
        return -1;
      }
      if (value !== value) {
        return indexOfNaN(array, index, true);
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull() {
      var args = arguments,
          array = args[0];

      if (!(array && array.length)) {
        return array;
      }
      var index = 0,
          indexOf = getIndexOf(),
          length = args.length;

      while (++index < length) {
        var fromIndex = 0,
            value = args[index];

        while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
          splice.call(array, fromIndex, 1);
        }
      }
      return array;
    }

    /**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */
    var pullAt = restParam(function(array, indexes) {
      indexes = baseFlatten(indexes);

      var result = baseAt(array, indexes);
      basePullAt(array, indexes.sort(baseCompareAscending));
      return result;
    });

    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */
    function remove(array, predicate, thisArg) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getCallback(predicate, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }

    /**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */
    function rest(array) {
      return drop(array, 1);
    }

    /**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */
    function slice(array, start, end) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (end && typeof end != 'number' && isIterateeCall(array, start, end)) {
        start = 0;
        end = length;
      }
      return baseSlice(array, start, end);
    }

    /**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */
    var sortedIndex = createSortedIndex();

    /**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */
    var sortedLastIndex = createSortedIndex(true);

    /**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */
    function take(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      return baseSlice(array, 0, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */
    function takeRight(array, n, guard) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (guard ? isIterateeCall(array, n, guard) : n == null) {
        n = 1;
      }
      n = length - (+n || 0);
      return baseSlice(array, n < 0 ? 0 : n);
    }

    /**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */
    function takeRightWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3), false, true)
        : [];
    }

    /**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */
    function takeWhile(array, predicate, thisArg) {
      return (array && array.length)
        ? baseWhile(array, getCallback(predicate, thisArg, 3))
        : [];
    }

    /**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */
    var union = restParam(function(arrays) {
      return baseUniq(baseFlatten(arrays, false, true));
    });

    /**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      if (isSorted != null && typeof isSorted != 'boolean') {
        thisArg = iteratee;
        iteratee = isIterateeCall(array, isSorted, thisArg) ? undefined : isSorted;
        isSorted = false;
      }
      var callback = getCallback();
      if (!(iteratee == null && callback === baseCallback)) {
        iteratee = callback(iteratee, thisArg, 3);
      }
      return (isSorted && getIndexOf() == baseIndexOf)
        ? sortedUniq(array, iteratee)
        : baseUniq(array, iteratee);
    }

    /**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */
    function unzip(array) {
      if (!(array && array.length)) {
        return [];
      }
      var index = -1,
          length = 0;

      array = arrayFilter(array, function(group) {
        if (isArrayLike(group)) {
          length = nativeMax(group.length, length);
          return true;
        }
      });
      var result = Array(length);
      while (++index < length) {
        result[index] = arrayMap(array, baseProperty(index));
      }
      return result;
    }

    /**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */
    function unzipWith(array, iteratee, thisArg) {
      var length = array ? array.length : 0;
      if (!length) {
        return [];
      }
      var result = unzip(array);
      if (iteratee == null) {
        return result;
      }
      iteratee = bindCallback(iteratee, thisArg, 4);
      return arrayMap(result, function(group) {
        return arrayReduce(group, iteratee, undefined, true);
      });
    }

    /**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */
    var without = restParam(function(array, values) {
      return isArrayLike(array)
        ? baseDifference(array, values)
        : [];
    });

    /**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArrayLike(array)) {
          var result = result
            ? arrayPush(baseDifference(result, array), baseDifference(array, result))
            : array;
        }
      }
      return result ? baseUniq(result) : [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    var zip = restParam(unzip);

    /**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(props, values) {
      var index = -1,
          length = props ? props.length : 0,
          result = {};

      if (length && !values && !isArray(props[0])) {
        values = [];
      }
      while (++index < length) {
        var key = props[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */
    var zipWith = restParam(function(arrays) {
      var length = arrays.length,
          iteratee = length > 2 ? arrays[length - 2] : undefined,
          thisArg = length > 1 ? arrays[length - 1] : undefined;

      if (length > 2 && typeof iteratee == 'function') {
        length -= 2;
      } else {
        iteratee = (length > 1 && typeof thisArg == 'function') ? (--length, thisArg) : undefined;
        thisArg = undefined;
      }
      arrays.length = length;
      return unzipWith(arrays, iteratee, thisArg);
    });

    /*------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      var result = lodash(value);
      result.__chain__ = true;
      return result;
    }

    /**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */
    function tap(value, interceptor, thisArg) {
      interceptor.call(thisArg, value);
      return value;
    }

    /**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */
    function thru(value, interceptor, thisArg) {
      return interceptor.call(thisArg, value);
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */
    function wrapperChain() {
      return chain(this);
    }

    /**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */
    function wrapperCommit() {
      return new LodashWrapper(this.value(), this.__chain__);
    }

    /**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */
    var wrapperConcat = restParam(function(values) {
      values = baseFlatten(values);
      return this.thru(function(array) {
        return arrayConcat(isArray(array) ? array : [toObject(array)], values);
      });
    });

    /**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */
    function wrapperPlant(value) {
      var result,
          parent = this;

      while (parent instanceof baseLodash) {
        var clone = wrapperClone(parent);
        if (result) {
          previous.__wrapped__ = clone;
        } else {
          result = clone;
        }
        var previous = clone;
        parent = parent.__wrapped__;
      }
      previous.__wrapped__ = value;
      return result;
    }

    /**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */
    function wrapperReverse() {
      var value = this.__wrapped__;

      var interceptor = function(value) {
        return (wrapped && wrapped.__dir__ < 0) ? value : value.reverse();
      };
      if (value instanceof LazyWrapper) {
        var wrapped = value;
        if (this.__actions__.length) {
          wrapped = new LazyWrapper(this);
        }
        wrapped = wrapped.reverse();
        wrapped.__actions__.push({ 'func': thru, 'args': [interceptor], 'thisArg': undefined });
        return new LodashWrapper(wrapped, this.__chain__);
      }
      return this.thru(interceptor);
    }

    /**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return (this.value() + '');
    }

    /**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */
    function wrapperValue() {
      return baseWrapperValue(this.__wrapped__, this.__actions__);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */
    var at = restParam(function(collection, props) {
      return baseAt(collection, baseFlatten(props));
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
    });

    /**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */
    function every(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayEvery : baseEvery;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */
    function filter(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, predicate);
    }

    /**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */
    var find = createFind(baseEach);

    /**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */
    var findLast = createFind(baseEachRight, true);

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */
    function findWhere(collection, source) {
      return find(collection, baseMatches(source));
    }

    /**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */
    var forEach = createForEach(arrayEach, baseEach);

    /**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */
    var forEachRight = createForEach(arrayEachRight, baseEachRight);

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      if (hasOwnProperty.call(result, key)) {
        result[key].push(value);
      } else {
        result[key] = [value];
      }
    });

    /**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */
    function includes(collection, target, fromIndex, guard) {
      var length = collection ? getLength(collection) : 0;
      if (!isLength(length)) {
        collection = values(collection);
        length = collection.length;
      }
      if (typeof fromIndex != 'number' || (guard && isIterateeCall(target, fromIndex, guard))) {
        fromIndex = 0;
      } else {
        fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
      }
      return (typeof collection == 'string' || !isArray(collection) && isString(collection))
        ? (fromIndex <= length && collection.indexOf(target, fromIndex) > -1)
        : (!!length && getIndexOf(collection, target, fromIndex) > -1);
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    var invoke = restParam(function(collection, path, args) {
      var index = -1,
          isFunc = typeof path == 'function',
          isProp = isKey(path),
          result = isArrayLike(collection) ? Array(collection.length) : [];

      baseEach(collection, function(value) {
        var func = isFunc ? path : ((isProp && value != null) ? value[path] : undefined);
        result[++index] = func ? func.apply(value, args) : invokePath(value, path, args);
      });
      return result;
    });

    /**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */
    function map(collection, iteratee, thisArg) {
      var func = isArray(collection) ? arrayMap : baseMap;
      iteratee = getCallback(iteratee, thisArg, 3);
      return func(collection, iteratee);
    }

    /**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */
    var partition = createAggregator(function(result, value, key) {
      result[key ? 0 : 1].push(value);
    }, function() { return [[], []]; });

    /**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */
    function pluck(collection, path) {
      return map(collection, property(path));
    }

    /**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */
    var reduce = createReduce(arrayReduce, baseEach);

    /**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    var reduceRight = createReduce(arrayReduceRight, baseEachRight);

    /**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */
    function reject(collection, predicate, thisArg) {
      var func = isArray(collection) ? arrayFilter : baseFilter;
      predicate = getCallback(predicate, thisArg, 3);
      return func(collection, function(value, index, collection) {
        return !predicate(value, index, collection);
      });
    }

    /**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (guard ? isIterateeCall(collection, n, guard) : n == null) {
        collection = toIterable(collection);
        var length = collection.length;
        return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
      }
      var index = -1,
          result = toArray(collection),
          length = result.length,
          lastIndex = length - 1;

      n = nativeMin(n < 0 ? 0 : (+n || 0), length);
      while (++index < n) {
        var rand = baseRandom(index, lastIndex),
            value = result[rand];

        result[rand] = result[index];
        result[index] = value;
      }
      result.length = n;
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */
    function shuffle(collection) {
      return sample(collection, POSITIVE_INFINITY);
    }

    /**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? getLength(collection) : 0;
      return isLength(length) ? length : keys(collection).length;
    }

    /**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */
    function some(collection, predicate, thisArg) {
      var func = isArray(collection) ? arraySome : baseSome;
      if (thisArg && isIterateeCall(collection, predicate, thisArg)) {
        predicate = undefined;
      }
      if (typeof predicate != 'function' || thisArg !== undefined) {
        predicate = getCallback(predicate, thisArg, 3);
      }
      return func(collection, predicate);
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */
    function sortBy(collection, iteratee, thisArg) {
      if (collection == null) {
        return [];
      }
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      var index = -1;
      iteratee = getCallback(iteratee, thisArg, 3);

      var result = baseMap(collection, function(value, key, collection) {
        return { 'criteria': iteratee(value, key, collection), 'index': ++index, 'value': value };
      });
      return baseSortBy(result, compareAscending);
    }

    /**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    var sortByAll = restParam(function(collection, iteratees) {
      if (collection == null) {
        return [];
      }
      var guard = iteratees[2];
      if (guard && isIterateeCall(iteratees[0], iteratees[1], guard)) {
        iteratees.length = 1;
      }
      return baseSortByOrder(collection, baseFlatten(iteratees), []);
    });

    /**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */
    function sortByOrder(collection, iteratees, orders, guard) {
      if (collection == null) {
        return [];
      }
      if (guard && isIterateeCall(iteratees, orders, guard)) {
        orders = undefined;
      }
      if (!isArray(iteratees)) {
        iteratees = iteratees == null ? [] : [iteratees];
      }
      if (!isArray(orders)) {
        orders = orders == null ? [] : [orders];
      }
      return baseSortByOrder(collection, iteratees, orders);
    }

    /**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */
    function where(collection, source) {
      return filter(collection, baseMatches(source));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */
    var now = nativeNow || function() {
      return new Date().getTime();
    };

    /*------------------------------------------------------------------------*/

    /**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */
    function after(n, func) {
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      n = nativeIsFinite(n = +n) ? n : 0;
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */
    function ary(func, n, guard) {
      if (guard && isIterateeCall(func, n, guard)) {
        n = undefined;
      }
      n = (func && n == null) ? func.length : nativeMax(+n || 0, 0);
      return createWrapper(func, ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }

    /**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */
    function before(n, func) {
      var result;
      if (typeof func != 'function') {
        if (typeof n == 'function') {
          var temp = n;
          n = func;
          func = temp;
        } else {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
      }
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = undefined;
        }
        return result;
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */
    var bind = restParam(function(func, thisArg, partials) {
      var bitmask = BIND_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bind.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(func, bitmask, thisArg, partials, holders);
    });

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */
    var bindAll = restParam(function(object, methodNames) {
      methodNames = methodNames.length ? baseFlatten(methodNames) : functions(object);

      var index = -1,
          length = methodNames.length;

      while (++index < length) {
        var key = methodNames[index];
        object[key] = createWrapper(object[key], BIND_FLAG, object);
      }
      return object;
    });

    /**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */
    var bindKey = restParam(function(object, key, partials) {
      var bitmask = BIND_FLAG | BIND_KEY_FLAG;
      if (partials.length) {
        var holders = replaceHolders(partials, bindKey.placeholder);
        bitmask |= PARTIAL_FLAG;
      }
      return createWrapper(key, bitmask, object, partials, holders);
    });

    /**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */
    var curry = createCurry(CURRY_FLAG);

    /**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */
    var curryRight = createCurry(CURRY_RIGHT_FLAG);

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    /**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    var defer = restParam(function(func, args) {
      return baseDelay(func, 1, args);
    });

    /**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */
    var delay = restParam(function(func, wait, args) {
      return baseDelay(func, wait, args);
    });

    /**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */
    var flow = createFlow();

    /**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */
    var flowRight = createFlow(true);

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new memoize.Cache;
      return memoized;
    }

    /**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */
    var modArgs = restParam(function(func, transforms) {
      transforms = baseFlatten(transforms);
      if (typeof func != 'function' || !arrayEvery(transforms, baseIsFunction)) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = transforms.length;
      return restParam(function(args) {
        var index = nativeMin(args.length, length);
        while (index--) {
          args[index] = transforms[index](args[index]);
        }
        return func.apply(this, args);
      });
    });

    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function() {
        return !predicate.apply(this, arguments);
      };
    }

    /**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */
    function once(func) {
      return before(2, func);
    }

    /**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */
    var partial = createPartial(PARTIAL_FLAG);

    /**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */
    var partialRight = createPartial(PARTIAL_RIGHT_FLAG);

    /**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */
    var rearg = restParam(function(func, indexes) {
      return createWrapper(func, REARG_FLAG, undefined, undefined, undefined, baseFlatten(indexes));
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */
    function restParam(func, start) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            rest = Array(length);

        while (++index < length) {
          rest[index] = args[start + index];
        }
        switch (start) {
          case 0: return func.call(this, rest);
          case 1: return func.call(this, args[0], rest);
          case 2: return func.call(this, args[0], args[1], rest);
        }
        var otherArgs = Array(start + 1);
        index = -1;
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = rest;
        return func.apply(this, otherArgs);
      };
    }

    /**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */
    function spread(func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      return function(array) {
        return func.apply(this, array);
      };
    }

    /**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */
    function wrap(value, wrapper) {
      wrapper = wrapper == null ? identity : wrapper;
      return createWrapper(wrapper, PARTIAL_FLAG, undefined, [value], []);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, customizer, thisArg) {
      if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
        isDeep = false;
      }
      else if (typeof isDeep == 'function') {
        thisArg = customizer;
        customizer = isDeep;
        isDeep = false;
      }
      return typeof customizer == 'function'
        ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 1))
        : baseClone(value, isDeep);
    }

    /**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */
    function cloneDeep(value, customizer, thisArg) {
      return typeof customizer == 'function'
        ? baseClone(value, true, bindCallback(customizer, thisArg, 1))
        : baseClone(value, true);
    }

    /**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */
    function gt(value, other) {
      return value > other;
    }

    /**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */
    function gte(value, other) {
      return value >= other;
    }

    /**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return isObjectLike(value) && isArrayLike(value) &&
        hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */
    var isArray = nativeIsArray || function(value) {
      return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
    };

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false || (isObjectLike(value) && objToString.call(value) == boolTag);
    }

    /**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */
    function isDate(value) {
      return isObjectLike(value) && objToString.call(value) == dateTag;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */
    function isElement(value) {
      return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
    }

    /**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */
    function isEmpty(value) {
      if (value == null) {
        return true;
      }
      if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
          (isObjectLike(value) && isFunction(value.splice)))) {
        return !value.length;
      }
      return !keys(value).length;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */
    function isEqual(value, other, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      var result = customizer ? customizer(value, other) : undefined;
      return  result === undefined ? baseIsEqual(value, other, customizer) : !!result;
    }

    /**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */
    function isError(value) {
      return isObjectLike(value) && typeof value.message == 'string' && objToString.call(value) == errorTag;
    }

    /**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return typeof value == 'number' && nativeIsFinite(value);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return isObject(value) && objToString.call(value) == funcTag;
    }

    /**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    /**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */
    function isMatch(object, source, customizer, thisArg) {
      customizer = typeof customizer == 'function' ? bindCallback(customizer, thisArg, 3) : undefined;
      return baseIsMatch(object, getMatchData(source), customizer);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // An `NaN` primitive is the only value that is not equal to itself.
      // Perform the `toStringTag` check first to avoid errors with some host objects in IE.
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */
    function isNative(value) {
      if (value == null) {
        return false;
      }
      if (isFunction(value)) {
        return reIsNative.test(fnToString.call(value));
      }
      return isObjectLike(value) && reIsHostCtor.test(value);
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */
    function isNumber(value) {
      return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag);
    }

    /**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */
    function isPlainObject(value) {
      var Ctor;

      // Exit early for non `Object` objects.
      if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
          (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
        return false;
      }
      // IE < 9 iterates inherited properties before own properties. If the first
      // iterated property is an object's own property then there are no inherited
      // enumerable properties.
      var result;
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      baseForIn(value, function(subValue, key) {
        result = key;
      });
      return result === undefined || hasOwnProperty.call(value, result);
    }

    /**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */
    function isRegExp(value) {
      return isObject(value) && objToString.call(value) == regexpTag;
    }

    /**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */
    function isString(value) {
      return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    function isTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */
    function isUndefined(value) {
      return value === undefined;
    }

    /**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */
    function lt(value, other) {
      return value < other;
    }

    /**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */
    function lte(value, other) {
      return value <= other;
    }

    /**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */
    function toArray(value) {
      var length = value ? getLength(value) : 0;
      if (!isLength(length)) {
        return values(value);
      }
      if (!length) {
        return [];
      }
      return arrayCopy(value);
    }

    /**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */
    function toPlainObject(value) {
      return baseCopy(value, keysIn(value));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */
    var merge = createAssigner(baseMerge);

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var assign = createAssigner(function(object, source, customizer) {
      return customizer
        ? assignWith(object, source, customizer)
        : baseAssign(object, source);
    });

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties, guard) {
      var result = baseCreate(prototype);
      if (guard && isIterateeCall(prototype, properties, guard)) {
        properties = undefined;
      }
      return properties ? baseAssign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */
    var defaults = createDefaults(assign, assignDefaults);

    /**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */
    var defaultsDeep = createDefaults(merge, mergeDefaults);

    /**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */
    var findKey = createFindKey(baseForOwn);

    /**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */
    var findLastKey = createFindKey(baseForOwnRight);

    /**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */
    var forIn = createForIn(baseFor);

    /**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */
    var forInRight = createForIn(baseForRight);

    /**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */
    var forOwn = createForOwn(baseForOwn);

    /**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */
    var forOwnRight = createForOwn(baseForOwnRight);

    /**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */
    function functions(object) {
      return baseFunctions(object, keysIn(object));
    }

    /**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : baseGet(object, toPath(path), path + '');
      return result === undefined ? defaultValue : result;
    }

    /**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */
    function has(object, path) {
      if (object == null) {
        return false;
      }
      var result = hasOwnProperty.call(object, path);
      if (!result && !isKey(path)) {
        path = toPath(path);
        object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
        if (object == null) {
          return false;
        }
        path = last(path);
        result = hasOwnProperty.call(object, path);
      }
      return result || (isLength(object.length) && isIndex(path, object.length) &&
        (isArray(object) || isArguments(object)));
    }

    /**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */
    function invert(object, multiValue, guard) {
      if (guard && isIterateeCall(object, multiValue, guard)) {
        multiValue = undefined;
      }
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index],
            value = object[key];

        if (multiValue) {
          if (hasOwnProperty.call(result, value)) {
            result[value].push(key);
          } else {
            result[value] = [key];
          }
        }
        else {
          result[value] = key;
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      var Ctor = object == null ? undefined : object.constructor;
      if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
          (typeof object != 'function' && isArrayLike(object))) {
        return shimKeys(object);
      }
      return isObject(object) ? nativeKeys(object) : [];
    };

    /**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */
    function keysIn(object) {
      if (object == null) {
        return [];
      }
      if (!isObject(object)) {
        object = Object(object);
      }
      var length = object.length;
      length = (length && isLength(length) &&
        (isArray(object) || isArguments(object)) && length) || 0;

      var Ctor = object.constructor,
          index = -1,
          isProto = typeof Ctor == 'function' && Ctor.prototype === object,
          result = Array(length),
          skipIndexes = length > 0;

      while (++index < length) {
        result[index] = (index + '');
      }
      for (var key in object) {
        if (!(skipIndexes && isIndex(key, length)) &&
            !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */
    var mapKeys = createObjectMapper(true);

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */
    var mapValues = createObjectMapper();

    /**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */
    var omit = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      if (typeof props[0] != 'function') {
        var props = arrayMap(baseFlatten(props), String);
        return pickByArray(object, baseDifference(keysIn(object), props));
      }
      var predicate = bindCallback(props[0], props[1], 3);
      return pickByCallback(object, function(value, key, object) {
        return !predicate(value, key, object);
      });
    });

    /**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */
    function pairs(object) {
      object = toObject(object);

      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */
    var pick = restParam(function(object, props) {
      if (object == null) {
        return {};
      }
      return typeof props[0] == 'function'
        ? pickByCallback(object, bindCallback(props[0], props[1], 3))
        : pickByArray(object, baseFlatten(props));
    });

    /**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */
    function result(object, path, defaultValue) {
      var result = object == null ? undefined : object[path];
      if (result === undefined) {
        if (object != null && !isKey(path, object)) {
          path = toPath(path);
          object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
          result = object == null ? undefined : object[last(path)];
        }
        result = result === undefined ? defaultValue : result;
      }
      return isFunction(result) ? result.call(object) : result;
    }

    /**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */
    function set(object, path, value) {
      if (object == null) {
        return object;
      }
      var pathKey = (path + '');
      path = (object[pathKey] != null || isKey(path, object)) ? [pathKey] : toPath(path);

      var index = -1,
          length = path.length,
          lastIndex = length - 1,
          nested = object;

      while (nested != null && ++index < length) {
        var key = path[index];
        if (isObject(nested)) {
          if (index == lastIndex) {
            nested[key] = value;
          } else if (nested[key] == null) {
            nested[key] = isIndex(path[index + 1]) ? [] : {};
          }
        }
        nested = nested[key];
      }
      return object;
    }

    /**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */
    function transform(object, iteratee, accumulator, thisArg) {
      var isArr = isArray(object) || isTypedArray(object);
      iteratee = getCallback(iteratee, thisArg, 4);

      if (accumulator == null) {
        if (isArr || isObject(object)) {
          var Ctor = object.constructor;
          if (isArr) {
            accumulator = isArray(object) ? new Ctor : [];
          } else {
            accumulator = baseCreate(isFunction(Ctor) ? Ctor.prototype : undefined);
          }
        } else {
          accumulator = {};
        }
      }
      (isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
        return iteratee(accumulator, value, index, object);
      });
      return accumulator;
    }

    /**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */
    function values(object) {
      return baseValues(object, keys(object));
    }

    /**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */
    function valuesIn(object) {
      return baseValues(object, keysIn(object));
    }

    /*------------------------------------------------------------------------*/

    /**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */
    function inRange(value, start, end) {
      start = +start || 0;
      if (end === undefined) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      return value >= nativeMin(start, end) && value < nativeMax(start, end);
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      if (floating && isIterateeCall(min, max, floating)) {
        max = floating = undefined;
      }
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (noMax && typeof min == 'boolean') {
          floating = min;
          min = 1;
        }
        else if (typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
        noMax = false;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand + '').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /*------------------------------------------------------------------------*/

    /**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */
    var camelCase = createCompounder(function(result, word, index) {
      word = word.toLowerCase();
      return result + (index ? (word.charAt(0).toUpperCase() + word.slice(1)) : word);
    });

    /**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */
    function capitalize(string) {
      string = baseToString(string);
      return string && (string.charAt(0).toUpperCase() + string.slice(1));
    }

    /**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */
    function deburr(string) {
      string = baseToString(string);
      return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
    }

    /**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */
    function endsWith(string, target, position) {
      string = baseToString(string);
      target = (target + '');

      var length = string.length;
      position = position === undefined
        ? length
        : nativeMin(position < 0 ? 0 : (+position || 0), length);

      position -= target.length;
      return position >= 0 && string.indexOf(target, position) == position;
    }

    /**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */
    function escape(string) {
      // Reset `lastIndex` because in IE < 9 `String#replace` does not.
      string = baseToString(string);
      return (string && reHasUnescapedHtml.test(string))
        ? string.replace(reUnescapedHtml, escapeHtmlChar)
        : string;
    }

    /**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */
    function escapeRegExp(string) {
      string = baseToString(string);
      return (string && reHasRegExpChars.test(string))
        ? string.replace(reRegExpChars, escapeRegExpChar)
        : (string || '(?:)');
    }

    /**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */
    var kebabCase = createCompounder(function(result, word, index) {
      return result + (index ? '-' : '') + word.toLowerCase();
    });

    /**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */
    function pad(string, length, chars) {
      string = baseToString(string);
      length = +length;

      var strLength = string.length;
      if (strLength >= length || !nativeIsFinite(length)) {
        return string;
      }
      var mid = (length - strLength) / 2,
          leftLength = nativeFloor(mid),
          rightLength = nativeCeil(mid);

      chars = createPadding('', rightLength, chars);
      return chars.slice(0, leftLength) + string + chars;
    }

    /**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */
    var padLeft = createPadDir();

    /**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */
    var padRight = createPadDir(true);

    /**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */
    function parseInt(string, radix, guard) {
      // Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
      // Chrome fails to trim leading <BOM> whitespace characters.
      // See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
      if (guard ? isIterateeCall(string, radix, guard) : radix == null) {
        radix = 0;
      } else if (radix) {
        radix = +radix;
      }
      string = trim(string);
      return nativeParseInt(string, radix || (reHasHexPrefix.test(string) ? 16 : 10));
    }

    /**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */
    function repeat(string, n) {
      var result = '';
      string = baseToString(string);
      n = +n;
      if (n < 1 || !string || !nativeIsFinite(n)) {
        return result;
      }
      // Leverage the exponentiation by squaring algorithm for a faster repeat.
      // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
      do {
        if (n % 2) {
          result += string;
        }
        n = nativeFloor(n / 2);
        string += string;
      } while (n);

      return result;
    }

    /**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */
    var snakeCase = createCompounder(function(result, word, index) {
      return result + (index ? '_' : '') + word.toLowerCase();
    });

    /**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */
    var startCase = createCompounder(function(result, word, index) {
      return result + (index ? ' ' : '') + (word.charAt(0).toUpperCase() + word.slice(1));
    });

    /**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */
    function startsWith(string, target, position) {
      string = baseToString(string);
      position = position == null
        ? 0
        : nativeMin(position < 0 ? 0 : (+position || 0), string.length);

      return string.lastIndexOf(target, position) == position;
    }

    /**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(string, options, otherOptions) {
      // Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
      // and Laura Doktorova's doT.js (https://github.com/olado/doT).
      var settings = lodash.templateSettings;

      if (otherOptions && isIterateeCall(string, options, otherOptions)) {
        options = otherOptions = undefined;
      }
      string = baseToString(string);
      options = assignWith(baseAssign({}, otherOptions || options), settings, assignOwnDefaults);

      var imports = assignWith(baseAssign({}, options.imports), settings.imports, assignOwnDefaults),
          importsKeys = keys(imports),
          importsValues = baseValues(imports, importsKeys);

      var isEscaping,
          isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // Compile the regexp to match each delimiter.
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      // Use a sourceURL for easier debugging.
      var sourceURL = '//# sourceURL=' +
        ('sourceURL' in options
          ? options.sourceURL
          : ('lodash.templateSources[' + (++templateCounter) + ']')
        ) + '\n';

      string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // Escape characters that can't be included in string literals.
        source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // Replace delimiters with snippets.
        if (escapeValue) {
          isEscaping = true;
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // The JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value.
        return match;
      });

      source += "';\n";

      // If `variable` is not specified wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain.
      var variable = options.variable;
      if (!variable) {
        source = 'with (obj) {\n' + source + '\n}\n';
      }
      // Cleanup code by stripping empty strings.
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // Frame code as the function body.
      source = 'function(' + (variable || 'obj') + ') {\n' +
        (variable
          ? ''
          : 'obj || (obj = {});\n'
        ) +
        "var __t, __p = ''" +
        (isEscaping
           ? ', __e = _.escape'
           : ''
        ) +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      var result = attempt(function() {
        return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
      });

      // Provide the compiled function's source by its `toString` method or
      // the `source` property as a convenience for inlining compiled templates.
      result.source = source;
      if (isError(result)) {
        throw result;
      }
      return result;
    }

    /**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */
    function trim(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
      }
      chars = (chars + '');
      return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
    }

    /**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */
    function trimLeft(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(trimmedLeftIndex(string));
      }
      return string.slice(charsLeftIndex(string, (chars + '')));
    }

    /**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */
    function trimRight(string, chars, guard) {
      var value = string;
      string = baseToString(string);
      if (!string) {
        return string;
      }
      if (guard ? isIterateeCall(value, chars, guard) : chars == null) {
        return string.slice(0, trimmedRightIndex(string) + 1);
      }
      return string.slice(0, charsRightIndex(string, (chars + '')) + 1);
    }

    /**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */
    function trunc(string, options, guard) {
      if (guard && isIterateeCall(string, options, guard)) {
        options = undefined;
      }
      var length = DEFAULT_TRUNC_LENGTH,
          omission = DEFAULT_TRUNC_OMISSION;

      if (options != null) {
        if (isObject(options)) {
          var separator = 'separator' in options ? options.separator : separator;
          length = 'length' in options ? (+options.length || 0) : length;
          omission = 'omission' in options ? baseToString(options.omission) : omission;
        } else {
          length = +options || 0;
        }
      }
      string = baseToString(string);
      if (length >= string.length) {
        return string;
      }
      var end = length - omission.length;
      if (end < 1) {
        return omission;
      }
      var result = string.slice(0, end);
      if (separator == null) {
        return result + omission;
      }
      if (isRegExp(separator)) {
        if (string.slice(end).search(separator)) {
          var match,
              newEnd,
              substring = string.slice(0, end);

          if (!separator.global) {
            separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
          }
          separator.lastIndex = 0;
          while ((match = separator.exec(substring))) {
            newEnd = match.index;
          }
          result = result.slice(0, newEnd == null ? end : newEnd);
        }
      } else if (string.indexOf(separator, end) != end) {
        var index = result.lastIndexOf(separator);
        if (index > -1) {
          result = result.slice(0, index);
        }
      }
      return result + omission;
    }

    /**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */
    function unescape(string) {
      string = baseToString(string);
      return (string && reHasEscapedHtml.test(string))
        ? string.replace(reEscapedHtml, unescapeHtmlChar)
        : string;
    }

    /**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */
    function words(string, pattern, guard) {
      if (guard && isIterateeCall(string, pattern, guard)) {
        pattern = undefined;
      }
      string = baseToString(string);
      return string.match(pattern || reWords) || [];
    }

    /*------------------------------------------------------------------------*/

    /**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */
    var attempt = restParam(function(func, args) {
      try {
        return func.apply(undefined, args);
      } catch(e) {
        return isError(e) ? e : new Error(e);
      }
    });

    /**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */
    function callback(func, thisArg, guard) {
      if (guard && isIterateeCall(func, thisArg, guard)) {
        thisArg = undefined;
      }
      return isObjectLike(func)
        ? matches(func)
        : baseCallback(func, thisArg);
    }

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */
    function matches(source) {
      return baseMatches(baseClone(source, true));
    }

    /**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */
    function matchesProperty(path, srcValue) {
      return baseMatchesProperty(path, baseClone(srcValue, true));
    }

    /**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    var method = restParam(function(path, args) {
      return function(object) {
        return invokePath(object, path, args);
      };
    });

    /**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */
    var methodOf = restParam(function(object, args) {
      return function(path) {
        return invokePath(object, path, args);
      };
    });

    /**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */
    function mixin(object, source, options) {
      if (options == null) {
        var isObj = isObject(source),
            props = isObj ? keys(source) : undefined,
            methodNames = (props && props.length) ? baseFunctions(source, props) : undefined;

        if (!(methodNames ? methodNames.length : isObj)) {
          methodNames = false;
          options = source;
          source = object;
          object = this;
        }
      }
      if (!methodNames) {
        methodNames = baseFunctions(source, keys(source));
      }
      var chain = true,
          index = -1,
          isFunc = isFunction(object),
          length = methodNames.length;

      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      while (++index < length) {
        var methodName = methodNames[index],
            func = source[methodName];

        object[methodName] = func;
        if (isFunc) {
          object.prototype[methodName] = (function(func) {
            return function() {
              var chainAll = this.__chain__;
              if (chain || chainAll) {
                var result = object(this.__wrapped__),
                    actions = result.__actions__ = arrayCopy(this.__actions__);

                actions.push({ 'func': func, 'args': arguments, 'thisArg': object });
                result.__chain__ = chainAll;
                return result;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }(func));
        }
      }
      return object;
    }

    /**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      root._ = oldDash;
      return this;
    }

    /**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // No operation performed.
    }

    /**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */
    function property(path) {
      return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
    }

    /**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */
    function propertyOf(object) {
      return function(path) {
        return baseGet(object, toPath(path), path + '');
      };
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      if (step && isIterateeCall(start, end, step)) {
        end = step = undefined;
      }
      start = +start || 0;
      step = step == null ? 1 : (+step || 0);

      if (end == null) {
        end = start;
        start = 0;
      } else {
        end = +end || 0;
      }
      // Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
      // See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
      var index = -1,
          length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */
    function times(n, iteratee, thisArg) {
      n = nativeFloor(n);

      // Exit early to avoid a JSC JIT bug in Safari 8
      // where `Array(0)` is treated as `Array(1)`.
      if (n < 1 || !nativeIsFinite(n)) {
        return [];
      }
      var index = -1,
          result = Array(nativeMin(n, MAX_ARRAY_LENGTH));

      iteratee = bindCallback(iteratee, thisArg, 1);
      while (++index < n) {
        if (index < MAX_ARRAY_LENGTH) {
          result[index] = iteratee(index);
        } else {
          iteratee(index);
        }
      }
      return result;
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return baseToString(prefix) + id;
    }

    /*------------------------------------------------------------------------*/

    /**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */
    function add(augend, addend) {
      return (+augend || 0) + (+addend || 0);
    }

    /**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */
    var ceil = createRound('ceil');

    /**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */
    var floor = createRound('floor');

    /**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */
    var max = createExtremum(gt, NEGATIVE_INFINITY);

    /**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */
    var min = createExtremum(lt, POSITIVE_INFINITY);

    /**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */
    var round = createRound('round');

    /**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */
    function sum(collection, iteratee, thisArg) {
      if (thisArg && isIterateeCall(collection, iteratee, thisArg)) {
        iteratee = undefined;
      }
      iteratee = getCallback(iteratee, thisArg, 3);
      return iteratee.length == 1
        ? arraySum(isArray(collection) ? collection : toIterable(collection), iteratee)
        : baseSum(collection, iteratee);
    }

    /*------------------------------------------------------------------------*/

    // Ensure wrappers are instances of `baseLodash`.
    lodash.prototype = baseLodash.prototype;

    LodashWrapper.prototype = baseCreate(baseLodash.prototype);
    LodashWrapper.prototype.constructor = LodashWrapper;

    LazyWrapper.prototype = baseCreate(baseLodash.prototype);
    LazyWrapper.prototype.constructor = LazyWrapper;

    // Add functions to the `Map` cache.
    MapCache.prototype['delete'] = mapDelete;
    MapCache.prototype.get = mapGet;
    MapCache.prototype.has = mapHas;
    MapCache.prototype.set = mapSet;

    // Add functions to the `Set` cache.
    SetCache.prototype.push = cachePush;

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    // Add functions that return wrapped values when chaining.
    lodash.after = after;
    lodash.ary = ary;
    lodash.assign = assign;
    lodash.at = at;
    lodash.before = before;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.callback = callback;
    lodash.chain = chain;
    lodash.chunk = chunk;
    lodash.compact = compact;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.curry = curry;
    lodash.curryRight = curryRight;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defaultsDeep = defaultsDeep;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.drop = drop;
    lodash.dropRight = dropRight;
    lodash.dropRightWhile = dropRightWhile;
    lodash.dropWhile = dropWhile;
    lodash.fill = fill;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.flattenDeep = flattenDeep;
    lodash.flow = flow;
    lodash.flowRight = flowRight;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.keysIn = keysIn;
    lodash.map = map;
    lodash.mapKeys = mapKeys;
    lodash.mapValues = mapValues;
    lodash.matches = matches;
    lodash.matchesProperty = matchesProperty;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.method = method;
    lodash.methodOf = methodOf;
    lodash.mixin = mixin;
    lodash.modArgs = modArgs;
    lodash.negate = negate;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.partition = partition;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.propertyOf = propertyOf;
    lodash.pull = pull;
    lodash.pullAt = pullAt;
    lodash.range = range;
    lodash.rearg = rearg;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.restParam = restParam;
    lodash.set = set;
    lodash.shuffle = shuffle;
    lodash.slice = slice;
    lodash.sortBy = sortBy;
    lodash.sortByAll = sortByAll;
    lodash.sortByOrder = sortByOrder;
    lodash.spread = spread;
    lodash.take = take;
    lodash.takeRight = takeRight;
    lodash.takeRightWhile = takeRightWhile;
    lodash.takeWhile = takeWhile;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.thru = thru;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.toPlainObject = toPlainObject;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.unzip = unzip;
    lodash.unzipWith = unzipWith;
    lodash.values = values;
    lodash.valuesIn = valuesIn;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;
    lodash.zipWith = zipWith;

    // Add aliases.
    lodash.backflow = flowRight;
    lodash.collect = map;
    lodash.compose = flowRight;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.iteratee = callback;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;

    // Add functions to `lodash.prototype`.
    mixin(lodash, lodash);

    /*------------------------------------------------------------------------*/

    // Add functions that return unwrapped values when chaining.
    lodash.add = add;
    lodash.attempt = attempt;
    lodash.camelCase = camelCase;
    lodash.capitalize = capitalize;
    lodash.ceil = ceil;
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.deburr = deburr;
    lodash.endsWith = endsWith;
    lodash.escape = escape;
    lodash.escapeRegExp = escapeRegExp;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.findWhere = findWhere;
    lodash.first = first;
    lodash.floor = floor;
    lodash.get = get;
    lodash.gt = gt;
    lodash.gte = gte;
    lodash.has = has;
    lodash.identity = identity;
    lodash.includes = includes;
    lodash.indexOf = indexOf;
    lodash.inRange = inRange;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isError = isError;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isMatch = isMatch;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.kebabCase = kebabCase;
    lodash.last = last;
    lodash.lastIndexOf = lastIndexOf;
    lodash.lt = lt;
    lodash.lte = lte;
    lodash.max = max;
    lodash.min = min;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.pad = pad;
    lodash.padLeft = padLeft;
    lodash.padRight = padRight;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.repeat = repeat;
    lodash.result = result;
    lodash.round = round;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.snakeCase = snakeCase;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.sortedLastIndex = sortedLastIndex;
    lodash.startCase = startCase;
    lodash.startsWith = startsWith;
    lodash.sum = sum;
    lodash.template = template;
    lodash.trim = trim;
    lodash.trimLeft = trimLeft;
    lodash.trimRight = trimRight;
    lodash.trunc = trunc;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;
    lodash.words = words;

    // Add aliases.
    lodash.all = every;
    lodash.any = some;
    lodash.contains = includes;
    lodash.eq = isEqual;
    lodash.detect = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.head = first;
    lodash.include = includes;
    lodash.inject = reduce;

    mixin(lodash, (function() {
      var source = {};
      baseForOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }()), false);

    /*------------------------------------------------------------------------*/

    // Add functions capable of returning wrapped and unwrapped values when chaining.
    lodash.sample = sample;

    lodash.prototype.sample = function(n) {
      if (!this.__chain__ && n == null) {
        return sample(this.value());
      }
      return this.thru(function(value) {
        return sample(value, n);
      });
    };

    /*------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = VERSION;

    // Assign default placeholders.
    arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
      lodash[methodName].placeholder = lodash;
    });

    // Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
    arrayEach(['drop', 'take'], function(methodName, index) {
      LazyWrapper.prototype[methodName] = function(n) {
        var filtered = this.__filtered__;
        if (filtered && !index) {
          return new LazyWrapper(this);
        }
        n = n == null ? 1 : nativeMax(nativeFloor(n) || 0, 0);

        var result = this.clone();
        if (filtered) {
          result.__takeCount__ = nativeMin(result.__takeCount__, n);
        } else {
          result.__views__.push({ 'size': n, 'type': methodName + (result.__dir__ < 0 ? 'Right' : '') });
        }
        return result;
      };

      LazyWrapper.prototype[methodName + 'Right'] = function(n) {
        return this.reverse()[methodName](n).reverse();
      };
    });

    // Add `LazyWrapper` methods that accept an `iteratee` value.
    arrayEach(['filter', 'map', 'takeWhile'], function(methodName, index) {
      var type = index + 1,
          isFilter = type != LAZY_MAP_FLAG;

      LazyWrapper.prototype[methodName] = function(iteratee, thisArg) {
        var result = this.clone();
        result.__iteratees__.push({ 'iteratee': getCallback(iteratee, thisArg, 1), 'type': type });
        result.__filtered__ = result.__filtered__ || isFilter;
        return result;
      };
    });

    // Add `LazyWrapper` methods for `_.first` and `_.last`.
    arrayEach(['first', 'last'], function(methodName, index) {
      var takeName = 'take' + (index ? 'Right' : '');

      LazyWrapper.prototype[methodName] = function() {
        return this[takeName](1).value()[0];
      };
    });

    // Add `LazyWrapper` methods for `_.initial` and `_.rest`.
    arrayEach(['initial', 'rest'], function(methodName, index) {
      var dropName = 'drop' + (index ? '' : 'Right');

      LazyWrapper.prototype[methodName] = function() {
        return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
      };
    });

    // Add `LazyWrapper` methods for `_.pluck` and `_.where`.
    arrayEach(['pluck', 'where'], function(methodName, index) {
      var operationName = index ? 'filter' : 'map',
          createCallback = index ? baseMatches : property;

      LazyWrapper.prototype[methodName] = function(value) {
        return this[operationName](createCallback(value));
      };
    });

    LazyWrapper.prototype.compact = function() {
      return this.filter(identity);
    };

    LazyWrapper.prototype.reject = function(predicate, thisArg) {
      predicate = getCallback(predicate, thisArg, 1);
      return this.filter(function(value) {
        return !predicate(value);
      });
    };

    LazyWrapper.prototype.slice = function(start, end) {
      start = start == null ? 0 : (+start || 0);

      var result = this;
      if (result.__filtered__ && (start > 0 || end < 0)) {
        return new LazyWrapper(result);
      }
      if (start < 0) {
        result = result.takeRight(-start);
      } else if (start) {
        result = result.drop(start);
      }
      if (end !== undefined) {
        end = (+end || 0);
        result = end < 0 ? result.dropRight(-end) : result.take(end - start);
      }
      return result;
    };

    LazyWrapper.prototype.takeRightWhile = function(predicate, thisArg) {
      return this.reverse().takeWhile(predicate, thisArg).reverse();
    };

    LazyWrapper.prototype.toArray = function() {
      return this.take(POSITIVE_INFINITY);
    };

    // Add `LazyWrapper` methods to `lodash.prototype`.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var checkIteratee = /^(?:filter|map|reject)|While$/.test(methodName),
          retUnwrapped = /^(?:first|last)$/.test(methodName),
          lodashFunc = lodash[retUnwrapped ? ('take' + (methodName == 'last' ? 'Right' : '')) : methodName];

      if (!lodashFunc) {
        return;
      }
      lodash.prototype[methodName] = function() {
        var args = retUnwrapped ? [1] : arguments,
            chainAll = this.__chain__,
            value = this.__wrapped__,
            isHybrid = !!this.__actions__.length,
            isLazy = value instanceof LazyWrapper,
            iteratee = args[0],
            useLazy = isLazy || isArray(value);

        if (useLazy && checkIteratee && typeof iteratee == 'function' && iteratee.length != 1) {
          // Avoid lazy use if the iteratee has a "length" value other than `1`.
          isLazy = useLazy = false;
        }
        var interceptor = function(value) {
          return (retUnwrapped && chainAll)
            ? lodashFunc(value, 1)[0]
            : lodashFunc.apply(undefined, arrayPush([value], args));
        };

        var action = { 'func': thru, 'args': [interceptor], 'thisArg': undefined },
            onlyLazy = isLazy && !isHybrid;

        if (retUnwrapped && !chainAll) {
          if (onlyLazy) {
            value = value.clone();
            value.__actions__.push(action);
            return func.call(value);
          }
          return lodashFunc.call(undefined, this.value())[0];
        }
        if (!retUnwrapped && useLazy) {
          value = onlyLazy ? value : new LazyWrapper(this);
          var result = func.apply(value, args);
          result.__actions__.push(action);
          return new LodashWrapper(result, chainAll);
        }
        return this.thru(interceptor);
      };
    });

    // Add `Array` and `String` methods to `lodash.prototype`.
    arrayEach(['join', 'pop', 'push', 'replace', 'shift', 'sort', 'splice', 'split', 'unshift'], function(methodName) {
      var func = (/^(?:replace|split)$/.test(methodName) ? stringProto : arrayProto)[methodName],
          chainName = /^(?:push|sort|unshift)$/.test(methodName) ? 'tap' : 'thru',
          retUnwrapped = /^(?:join|pop|replace|shift)$/.test(methodName);

      lodash.prototype[methodName] = function() {
        var args = arguments;
        if (retUnwrapped && !this.__chain__) {
          return func.apply(this.value(), args);
        }
        return this[chainName](function(value) {
          return func.apply(value, args);
        });
      };
    });

    // Map minified function names to their real names.
    baseForOwn(LazyWrapper.prototype, function(func, methodName) {
      var lodashFunc = lodash[methodName];
      if (lodashFunc) {
        var key = lodashFunc.name,
            names = realNames[key] || (realNames[key] = []);

        names.push({ 'name': methodName, 'func': lodashFunc });
      }
    });

    realNames[createHybridWrapper(undefined, BIND_KEY_FLAG).name] = [{ 'name': 'wrapper', 'func': undefined }];

    // Add functions to the lazy wrapper.
    LazyWrapper.prototype.clone = lazyClone;
    LazyWrapper.prototype.reverse = lazyReverse;
    LazyWrapper.prototype.value = lazyValue;

    // Add chaining functions to the `lodash` wrapper.
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.commit = wrapperCommit;
    lodash.prototype.concat = wrapperConcat;
    lodash.prototype.plant = wrapperPlant;
    lodash.prototype.reverse = wrapperReverse;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.run = lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = wrapperValue;

    // Add function aliases to the `lodash` wrapper.
    lodash.prototype.collect = lodash.prototype.map;
    lodash.prototype.head = lodash.prototype.first;
    lodash.prototype.select = lodash.prototype.filter;
    lodash.prototype.tail = lodash.prototype.rest;

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // Export lodash.
  var _ = runInContext();

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = _;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return _;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // Export for Rhino with CommonJS support.
    else {
      freeExports._ = _;
    }
  }
  else {
    // Export for a browser or Rhino.
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
/**
* @license nested-property https://github.com/cosmosio/nested-property
*
* The MIT License (MIT)
*
* Copyright (c) 2014-2015 Olivier Scherrer <pode.fr@gmail.com>
*/
"use strict";

module.exports = {
  set: setNestedProperty,
  get: getNestedProperty,
  has: hasNestedProperty,
  hasOwn: function (object, property, options) {
      return this.has(object, property, options || {own: true});
  },
  isIn: isInNestedProperty
};

/**
 * Get the property of an object nested in one or more objects
 * given an object such as a.b.c.d = 5, getNestedProperty(a, "b.c.d") will return 5.
 * @param {Object} object the object to get the property from
 * @param {String} property the path to the property as a string
 * @returns the object or the the property value if found
 */
function getNestedProperty(object, property) {
    if (object && typeof object == "object") {
        if (typeof property == "string" && property !== "") {
            var split = property.split(".");
            return split.reduce(function (obj, prop) {
                return obj && obj[prop];
            }, object);
        } else if (typeof property == "number") {
            return object[property];
        } else {
            return object;
        }
    } else {
        return object;
    }
}

/**
 * Tell if a nested object has a given property (or array a given index)
 * given an object such as a.b.c.d = 5, hasNestedProperty(a, "b.c.d") will return true.
 * It also returns true if the property is in the prototype chain.
 * @param {Object} object the object to get the property from
 * @param {String} property the path to the property as a string
 * @param {Object} options:
 *  - own: set to reject properties from the prototype
 * @returns true if has (property in object), false otherwise
 */
function hasNestedProperty(object, property, options) {
    options = options || {};

    if (object && typeof object == "object") {
        if (typeof property == "string" && property !== "") {
            var split = property.split(".");
            return split.reduce(function (obj, prop, idx, array) {
                if (idx == array.length - 1) {
                    if (options.own) {
                        return !!(obj && obj.hasOwnProperty(prop));
                    } else {
                        return !!(obj !== null && typeof obj == "object" && prop in obj);
                    }
                }
                return obj && obj[prop];
            }, object);
        } else if (typeof property == "number") {
            return property in object;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * Set the property of an object nested in one or more objects
 * If the property doesn't exist, it gets created.
 * @param {Object} object
 * @param {String} property
 * @param value the value to set
 * @returns object if no assignment was made or the value if the assignment was made
 */
function setNestedProperty(object, property, value) {
    if (object && typeof object == "object") {
        if (typeof property == "string" && property !== "") {
            var split = property.split(".");
            return split.reduce(function (obj, prop, idx) {
                obj[prop] = obj[prop] || {};
                if (split.length == (idx + 1)) {
                    obj[prop] = value;
                }
                return obj[prop];
            }, object);
        } else if (typeof property == "number") {
            object[property] = value;
            return object[property];
        } else {
            return object;
        }
    } else {
        return object;
    }
}

/**
 * Tell if an object is on the path to a nested property
 * If the object is on the path, and the path exists, it returns true, and false otherwise.
 * @param {Object} object to get the nested property from
 * @param {String} property name of the nested property
 * @param {Object} objectInPath the object to check
 * @param {Object} options:
 *  - validPath: return false if the path is invalid, even if the object is in the path
 * @returns {boolean} true if the object is on the path
 */
function isInNestedProperty(object, property, objectInPath, options) {
    options = options || {};

    if (object && typeof object == "object") {
        if (typeof property == "string" && property !== "") {
            var split = property.split("."),
                isIn = false,
                pathExists;

            pathExists = !!split.reduce(function (obj, prop) {
                isIn = isIn || obj === objectInPath || (!!obj && obj[prop] === objectInPath);
                return obj && obj[prop];
            }, object);

            if (options.validPath) {
                return isIn && pathExists;
            } else {
                return isIn;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

},{}],5:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],6:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))

},{"_process":1}],7:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var printWarning = function() {};

if ("production" !== 'production') {
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
  var loggedTypeFailures = {};

  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if ("production" !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            var err = Error(
              (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
              'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
            );
            err.name = 'Invariant Violation';
            throw err;
          }
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        if (error && !(error instanceof Error)) {
          printWarning(
            (componentName || 'React class') + ': type specification of ' +
            location + ' `' + typeSpecName + '` is invalid; the type checker ' +
            'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
            'You may have forgotten to pass an argument to the type checker ' +
            'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
            'shape all require an argument).'
          )

        }
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          printWarning(
            'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
          );
        }
      }
    }
  }
}

module.exports = checkPropTypes;

},{"./lib/ReactPropTypesSecret":11}],8:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');

function emptyFunction() {}

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./lib/ReactPropTypesSecret":11}],9:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var assign = require('object-assign');

var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');
var checkPropTypes = require('./checkPropTypes');

var printWarning = function() {};

if ("production" !== 'production') {
  printWarning = function(text) {
    var message = 'Warning: ' + text;
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };
}

function emptyFunctionThatReturnsNull() {
  return null;
}

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if ("production" !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          var err = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
          err.name = 'Invariant Violation';
          throw err;
        } else if ("production" !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            printWarning(
              'You are manually calling a React.PropTypes validation ' +
              'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunctionThatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      "production" !== 'production' ? printWarning('Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      "production" !== 'production' ? printWarning('Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunctionThatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        printWarning(
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
        );
        return emptyFunctionThatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

},{"./checkPropTypes":7,"./lib/ReactPropTypesSecret":11,"object-assign":5}],10:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if ("production" !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

},{"./factoryWithThrowingShims":8,"./factoryWithTypeCheckers":9}],11:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;

},{}],12:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"performance-now":13}],13:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);



}).call(this,require('_process'))

},{"_process":1}],14:[function(require,module,exports){
var global = require('global')

/**
 * `requestAnimationFrame()`
 */

var request = global.requestAnimationFrame
  || global.webkitRequestAnimationFrame
  || global.mozRequestAnimationFrame
  || fallback

var prev = +new Date
function fallback (fn) {
  var curr = +new Date
  var ms = Math.max(0, 16 - (curr - prev))
  var req = setTimeout(fn, ms)
  return prev = curr, req
}

/**
 * `cancelAnimationFrame()`
 */

var cancel = global.cancelAnimationFrame
  || global.webkitCancelAnimationFrame
  || global.mozCancelAnimationFrame
  || clearTimeout

if (Function.prototype.bind) {
  request = request.bind(global)
  cancel = cancel.bind(global)
}

exports = module.exports = request
exports.cancel = cancel

},{"global":2}],15:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isTouch = false;

/* istanbul ignore else */
if (typeof window !== 'undefined') {
  isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
}

var JoyrideBeacon = function (_React$Component) {
  _inherits(JoyrideBeacon, _React$Component);

  function JoyrideBeacon() {
    _classCallCheck(this, JoyrideBeacon);

    return _possibleConstructorReturn(this, (JoyrideBeacon.__proto__ || Object.getPrototypeOf(JoyrideBeacon)).apply(this, arguments));
  }

  _createClass(JoyrideBeacon, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          eventType = _props.eventType,
          onTrigger = _props.onTrigger,
          step = _props.step,
          xPos = _props.xPos,
          yPos = _props.yPos;

      var styles = {
        beacon: {
          left: xPos,
          position: step.isFixed === true ? 'fixed' : 'absolute',
          top: yPos
        },
        inner: {},
        outer: {}
      };
      var stepStyles = step.style || {};
      var rgb = void 0;

      /* istanbul ignore else */
      if (stepStyles.beacon) {
        if (typeof stepStyles.beacon === 'string') {
          rgb = (0, _utils.hexToRGB)(stepStyles.beacon);

          styles.inner.backgroundColor = stepStyles.beacon;
          styles.outer = {
            backgroundColor: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.2)',
            borderColor: stepStyles.beacon
          };
        } else {
          if (stepStyles.beacon.inner) {
            styles.inner.backgroundColor = stepStyles.beacon.inner;
          }

          if (stepStyles.beacon.outer) {
            rgb = (0, _utils.hexToRGB)(stepStyles.beacon.outer);

            styles.outer = {
              backgroundColor: 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.4)',
              borderColor: stepStyles.beacon.outer
            };
          }
        }
      }

      return _react2.default.createElement(
        'button',
        {
          className: 'joyride-beacon',
          style: styles.beacon,
          onClick: eventType === 'click' || isTouch ? onTrigger : null,
          onMouseEnter: eventType === 'hover' && !isTouch ? onTrigger : null },
        _react2.default.createElement('span', { className: 'joyride-beacon__inner', style: styles.inner }),
        _react2.default.createElement('span', { className: 'joyride-beacon__outer', style: styles.outer })
      );
    }
  }]);

  return JoyrideBeacon;
}(_react2.default.Component);

JoyrideBeacon.propTypes = {
  eventType: _propTypes2.default.string.isRequired,
  onTrigger: _propTypes2.default.func.isRequired,
  step: _propTypes2.default.object.isRequired,
  xPos: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
  yPos: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired
};
JoyrideBeacon.defaultProps = {
  xPos: -1000,
  yPos: -1000
};
exports.default = JoyrideBeacon;
},{"./utils":18,"prop-types":10,"react":"react"}],16:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var JoyrideTooltip = function (_React$Component) {
  _inherits(JoyrideTooltip, _React$Component);

  function JoyrideTooltip(props) {
    _classCallCheck(this, JoyrideTooltip);

    var _this = _possibleConstructorReturn(this, (JoyrideTooltip.__proto__ || Object.getPrototypeOf(JoyrideTooltip)).call(this, props));

    _this.handleMouseMove = function (e) {
      var event = e || window.e;
      var hole = _this.state.styles.hole;

      var offsetY = hole.position === 'fixed' ? event.clientY : event.pageY;
      var offsetX = hole.position === 'fixed' ? event.clientX : event.pageX;
      var inHoleHeight = offsetY >= hole.top && offsetY <= hole.top + hole.height;
      var inHoleWidth = offsetX >= hole.left && offsetX <= hole.left + hole.width;
      var inHole = inHoleWidth && inHoleHeight;

      if (inHole && !_this.state.mouseOverHole) {
        _this.setState({ mouseOverHole: true });
      }

      if (!inHole && _this.state.mouseOverHole) {
        _this.setState({ mouseOverHole: false });
      }
    };

    _this.state = {};
    return _this;
  }

  _createClass(JoyrideTooltip, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var opts = this.setOpts();
      var styles = this.setStyles(this.props.step.style, opts, this.props);
      this.setState({ styles: styles, opts: opts });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          allowClicksThruHole = _props.allowClicksThruHole,
          onRender = _props.onRender,
          showOverlay = _props.showOverlay;


      this.forceUpdate();
      onRender();

      if (showOverlay && allowClicksThruHole) {
        document.addEventListener('mousemove', this.handleMouseMove, false);
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var nextAllowClicksThruHole = nextProps.allowClicksThruHole,
          nextAnimate = nextProps.animate,
          nextStandalone = nextProps.standalone,
          nextStep = nextProps.step,
          nextHolePadding = nextProps.holePadding,
          nextPosition = nextProps.position,
          nextXPos = nextProps.xPos,
          nextYPos = nextProps.yPos,
          nextShowOverlay = nextProps.showOverlay;
      var _props2 = this.props,
          allowClicksThruHole = _props2.allowClicksThruHole,
          animate = _props2.animate,
          standalone = _props2.standalone,
          step = _props2.step,
          holePadding = _props2.holePadding,
          position = _props2.position,
          xPos = _props2.xPos,
          yPos = _props2.yPos,
          showOverlay = _props2.showOverlay;

      /* istanbul ignore else */

      if (nextAnimate !== animate || nextStandalone !== standalone || nextStep !== step || nextHolePadding !== holePadding || nextPosition !== position || nextXPos !== xPos || nextYPos !== yPos) {
        var opts = this.setOpts(nextProps);
        var styles = this.setStyles(nextProps.step.style, opts, nextProps);
        this.setState({ styles: styles, opts: opts });
      }

      // If showOverlay changed, we might need to allow clicks in the overlay hole
      if (nextShowOverlay !== showOverlay) {
        if (nextShowOverlay && nextAllowClicksThruHole) {
          document.addEventListener('mousemove', this.handleMouseMove, false);
        } else {
          document.removeEventListener('mousemove', this.handleMouseMove, false);
        }
      }

      // If allowClickInHole changed, we need to enable or disable clicking in the overlay hole
      if (nextAllowClicksThruHole !== allowClicksThruHole) {
        if (nextAllowClicksThruHole) {
          document.addEventListener('mousemove', this.handleMouseMove, false);
        } else {
          document.removeEventListener('mousemove', this.handleMouseMove, false);
        }
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _props3 = this.props,
          onRender = _props3.onRender,
          selector = _props3.selector;


      if (prevProps.selector !== selector) {
        this.forceUpdate();
        onRender();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mousemove', this.handleMouseMove, false);
    }
  }, {
    key: 'getArrowPosition',
    value: function getArrowPosition(position) {
      var arrowPosition = position;

      if (window.innerWidth < 480) {
        if (position < 8) {
          arrowPosition = 8;
        } else if (position > 92) {
          arrowPosition = 92;
        }
      } else if (window.innerWidth < 1024) {
        if (position < 6) {
          arrowPosition = 6;
        } else if (position > 94) {
          arrowPosition = 94;
        }
      } else if (position < 5) {
        arrowPosition = 5;
      } else if (position > 95) {
        arrowPosition = 95;
      }

      return arrowPosition;
    }
  }, {
    key: 'generateArrow',
    value: function generateArrow() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      opts.location = opts.location || 'top';
      opts.color = opts.color || '#f04';
      opts.color = opts.color.replace('#', '%23');

      opts.width = opts.width || 36;
      opts.height = opts.width / 2;
      opts.scale = opts.width / 16;
      opts.rotate = '0';

      var height = opts.height,
          rotate = opts.rotate,
          width = opts.width;


      if (opts.location === 'bottom') {
        rotate = '180 8 4';
      } else if (opts.location === 'left') {
        height = opts.width;
        width = opts.height;
        rotate = '270 8 8';
      } else if (opts.location === 'right') {
        height = opts.width;
        width = opts.height;
        rotate = '90 4 4';
      }

      return 'data:image/svg+xml,%3Csvg%20width%3D%22' + width + '%22%20height%3D%22' + height + '%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpolygon%20points%3D%220%2C%200%208%2C%208%2016%2C0%22%20fill%3D%22' + opts.color + '%22%20transform%3D%22scale%28' + opts.scale + '%29%20rotate%28' + rotate + '%29%22%3E%3C%2Fpolygon%3E%3C%2Fsvg%3E';
    }

    /**
     * Calculate styles based on those passed in with the step, or calculated opts, or props
     *
     * @param {Object} stepStyles              Style object provided with step
     * @param {Object} opts                    Options object calculated from this.setOpts
     * @param {string} opts.arrowPosition      Used for left/right positioing of arrow when on bottom or top
     * @param {Object} opts.rect               BoundingClientRect of target element
     * @param {string} opts.positonBaseClass   Base position of tooltip (top, bottom, left, right)
     * @param {Object} props                   Positioning properties: cssPosition, xPos, and yPos
     * @returns {Object}                       Calculated styles for arrow, buttons, header, main, footer, hole, and tooltip
     */

  }, {
    key: 'setStyles',
    value: function setStyles(stepStyles, opts, props) {
      var holePadding = props.holePadding,
          step = props.step,
          xPos = props.xPos,
          yPos = props.yPos;

      var isFixed = step.isFixed === true;

      var styles = {
        arrow: {
          left: opts.arrowPosition
        },
        buttons: {},
        header: {},
        main: {},
        footer: {},
        hole: {},
        tooltip: {
          position: isFixed ? 'fixed' : 'absolute',
          top: Math.round(yPos),
          left: Math.round(xPos)
        }
      };

      styles.hole = {
        top: Math.round(opts.rect.top - (isFixed ? 0 : document.body.getBoundingClientRect().top) - holePadding),
        left: Math.round(opts.rect.left - holePadding),
        width: Math.round(opts.rect.width + holePadding * 2),
        height: Math.round(opts.rect.height + holePadding * 2)
      };
      if (isFixed) {
        styles.hole.position = 'fixed';
      }

      styles.buttons = {
        back: {},
        close: {},
        primary: {},
        skip: {}
      };

      /* Styling */
      /* istanbul ignore else */
      if (stepStyles) {
        if (stepStyles.backgroundColor) {
          styles.arrow.backgroundImage = 'url("' + this.generateArrow({
            location: opts.positonBaseClass,
            color: stepStyles.backgroundColor
          }) + '")';
          styles.tooltip.backgroundColor = stepStyles.backgroundColor;
        }

        if (stepStyles.borderRadius) {
          styles.tooltip.borderRadius = stepStyles.borderRadius;
        }

        if (stepStyles.color) {
          styles.buttons.primary.color = stepStyles.color;
          styles.buttons.close.color = stepStyles.color;
          styles.buttons.skip.color = stepStyles.color;
          styles.header.color = stepStyles.color;
          styles.tooltip.color = stepStyles.color;

          if (stepStyles.mainColor && stepStyles.mainColor === stepStyles.color) {
            styles.buttons.primary.color = stepStyles.backgroundColor;
          }
        }

        if (stepStyles.mainColor) {
          styles.buttons.primary.backgroundColor = stepStyles.mainColor;
          styles.buttons.back.color = stepStyles.mainColor;
          styles.header.borderColor = stepStyles.mainColor;
        }

        if (stepStyles.textAlign) {
          styles.tooltip.textAlign = stepStyles.textAlign;
        }

        if (stepStyles.width) {
          styles.tooltip.width = stepStyles.width;
        }

        if (stepStyles.header) {
          styles.header = _extends({}, styles.header, stepStyles.header);
        }

        if (stepStyles.main) {
          styles.main = _extends({}, styles.main, stepStyles.main);
        }

        if (stepStyles.footer) {
          styles.footer = _extends({}, styles.footer, stepStyles.footer);
        }

        if (stepStyles.back) {
          styles.buttons.back = _extends({}, styles.buttons.back, stepStyles.back);
        }

        if (stepStyles.arrow) {
          styles.arrow = _extends({}, styles.arrow, stepStyles.arrow);
        }

        if (stepStyles.button) {
          styles.buttons.primary = _extends({}, styles.buttons.primary, stepStyles.button);
        }

        if (stepStyles.close) {
          styles.buttons.close = _extends({}, styles.buttons.close, stepStyles.close);
        }

        if (stepStyles.skip) {
          styles.buttons.skip = _extends({}, styles.buttons.skip, stepStyles.skip);
        }

        if (stepStyles.hole) {
          styles.hole = _extends({}, stepStyles.hole, styles.hole);
        }
      }

      return styles;
    }
  }, {
    key: 'setOpts',
    value: function setOpts() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var animate = props.animate,
          offsetParentSelector = props.offsetParentSelector,
          position = props.position,
          standalone = props.standalone,
          target = props.target,
          xPos = props.xPos;

      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));
      var tooltip = document.querySelector('.joyride-tooltip');

      var opts = {
        classes: ['joyride-tooltip'],
        rect: (0, _utils.getOffsetBoundingClientRect)(target, offsetParent),
        positionClass: position
      };

      opts.positonBaseClass = opts.positionClass.match(/-/) ? opts.positionClass.split('-')[0] : opts.positionClass;

      if ((/^bottom$/.test(opts.positionClass) || /^top$/.test(opts.positionClass)) && xPos > -1) {
        opts.tooltip = { width: 450 };

        /* istanbul ignore else */
        if (tooltip) {
          opts.tooltip = (0, _utils.getOffsetBoundingClientRect)(tooltip, offsetParent);
        }

        opts.targetMiddle = opts.rect.left + opts.rect.width / 2;
        opts.arrowPosition = ((opts.targetMiddle - xPos) / opts.tooltip.width * 100).toFixed(2);
        opts.arrowPosition = this.getArrowPosition(opts.arrowPosition) + '%';
      }

      if (standalone) {
        opts.classes.push('joyride-tooltip--standalone');
      }

      if (opts.positonBaseClass !== opts.positionClass) {
        opts.classes.push(opts.positonBaseClass);
      }

      opts.classes.push(opts.positionClass);

      if (animate) {
        opts.classes.push('joyride-tooltip--animate');
      }

      return opts;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          buttons = _props4.buttons,
          disableOverlay = _props4.disableOverlay,
          onClick = _props4.onClick,
          selector = _props4.selector,
          showOverlay = _props4.showOverlay,
          step = _props4.step,
          target = _props4.target,
          type = _props4.type;


      if (!target) {
        return undefined;
      }

      var _state = this.state,
          opts = _state.opts,
          styles = _state.styles;

      var output = {};

      if (step.title) {
        output.header = _react2.default.createElement(
          'div',
          { className: 'joyride-tooltip__header', style: styles.header },
          step.title
        );
      }

      if (buttons.skip) {
        output.skip = _react2.default.createElement(
          'button',
          {
            className: 'joyride-tooltip__button joyride-tooltip__button--skip',
            style: styles.buttons.skip,
            'data-type': 'skip',
            onClick: onClick },
          buttons.skip
        );
      }

      // Why is this here?
      if (!step.text || typeof step.text === 'string') {
        output.main = _react2.default.createElement('div', {
          className: 'joyride-tooltip__main',
          style: styles.main,
          dangerouslySetInnerHTML: { __html: step.text || '' } });
      } else {
        output.main = _react2.default.createElement(
          'div',
          { className: 'joyride-tooltip__main', style: styles.main },
          step.text
        );
      }

      if (buttons.secondary) {
        output.secondary = _react2.default.createElement(
          'button',
          {
            className: 'joyride-tooltip__button joyride-tooltip__button--secondary',
            style: styles.buttons.back,
            'data-type': 'back',
            onClick: onClick },
          buttons.secondary
        );
      }

      if (step.event === 'hover') {
        styles.buttons.close.opacity = 0;
      }

      output.tooltipComponent = _react2.default.createElement(
        'div',
        { className: opts.classes.join(' '), style: styles.tooltip, 'data-target': selector },
        _react2.default.createElement('div', {
          className: 'joyride-tooltip__triangle joyride-tooltip__triangle-' + opts.positionClass,
          style: styles.arrow }),
        _react2.default.createElement('button', {
          className: 'joyride-tooltip__close' + (output.header ? ' joyride-tooltip__close--header' : ''),
          style: styles.buttons.close,
          'data-type': 'close',
          onClick: onClick }),
        output.header,
        output.main,
        _react2.default.createElement(
          'div',
          { className: 'joyride-tooltip__footer', style: styles.footer },
          output.skip,
          output.secondary,
          _react2.default.createElement(
            'button',
            {
              className: 'joyride-tooltip__button joyride-tooltip__button--primary',
              style: styles.buttons.primary,
              'data-type': ['single', 'casual'].includes(type) ? 'close' : 'next',
              onClick: onClick },
            buttons.primary
          )
        )
      );

      if (showOverlay) {
        // Empty onClick handler is for iOS touch devices (https://github.com/gilbarbara/react-joyride/issues/204)
        output.hole = _react2.default.createElement('div', { className: 'joyride-hole ' + _utils.browser, style: styles.hole, onClick: function onClick() {} });
      }

      if (!showOverlay) {
        return output.tooltipComponent;
      }

      var overlayStyles = {
        cursor: disableOverlay ? 'default' : 'pointer',
        height: document.body.clientHeight,
        pointerEvents: this.state.mouseOverHole ? 'none' : 'auto'
      };

      return _react2.default.createElement(
        'div',
        {
          className: 'joyride-overlay',
          style: overlayStyles,
          'data-type': 'close',
          onClick: !disableOverlay ? onClick : undefined },
        output.hole,
        output.tooltipComponent
      );
    }
  }]);

  return JoyrideTooltip;
}(_react2.default.Component);

JoyrideTooltip.propTypes = {
  allowClicksThruHole: _propTypes2.default.bool.isRequired,
  animate: _propTypes2.default.bool.isRequired,
  buttons: _propTypes2.default.object.isRequired,
  disableOverlay: _propTypes2.default.bool,
  holePadding: _propTypes2.default.number,
  offsetParentSelector: _propTypes2.default.string, //eslint-disable-line react/no-unused-prop-types
  onClick: _propTypes2.default.func.isRequired,
  onRender: _propTypes2.default.func.isRequired,
  // position of tooltip with respect to target
  position: _propTypes2.default.oneOf(['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'right', 'left']).isRequired,
  // sanitized selector string
  selector: _propTypes2.default.string.isRequired,
  showOverlay: _propTypes2.default.bool.isRequired,
  standalone: _propTypes2.default.bool,
  step: _propTypes2.default.object.isRequired,
  // DOM element to target
  target: _propTypes2.default.object.isRequired,
  type: _propTypes2.default.string.isRequired,
  xPos: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired,
  yPos: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]).isRequired
};
JoyrideTooltip.defaultProps = {
  buttons: {
    primary: 'Close'
  },
  step: {},
  xPos: -1000,
  yPos: -1000
};
exports.default = JoyrideTooltip;
},{"./utils":18,"prop-types":10,"react":"react"}],17:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _scroll = require('scroll');

var _scroll2 = _interopRequireDefault(_scroll);

var _nestedProperty = require('nested-property');

var _nestedProperty2 = _interopRequireDefault(_nestedProperty);

var _utils = require('./utils');

var _Beacon = require('./Beacon');

var _Beacon2 = _interopRequireDefault(_Beacon);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultState = {
  action: '',
  index: 0,
  isRunning: false,
  isTourSkipped: false,
  shouldRedraw: true,
  shouldRenderTooltip: false,
  shouldRun: false,
  standaloneData: false, // The standalone tooltip data
  xPos: -1000,
  yPos: -1000
};

var callbackTypes = {
  STEP_BEFORE: 'step:before',
  BEACON_BEFORE: 'beacon:before',
  BEACON_TRIGGER: 'beacon:trigger',
  TOOLTIP_BEFORE: 'tooltip:before',
  STEP_AFTER: 'step:after',
  STANDALONE_BEFORE: 'standalone:before',
  STANDALONE_AFTER: 'standalone:after',
  OVERLAY: 'overlay:click',
  HOLE: 'hole:click',
  FINISHED: 'finished',
  TARGET_NOT_FOUND: 'error:target_not_found'
};

var DEFAULTS = {
  position: 'top',
  minWidth: 290
};

var hasTouch = false;

var Joyride = function (_React$Component) {
  _inherits(Joyride, _React$Component);

  function Joyride(props) {
    _classCallCheck(this, Joyride);

    var _this = _possibleConstructorReturn(this, (Joyride.__proto__ || Object.getPrototypeOf(Joyride)).call(this, props));

    _this.handleKeyboardNavigation = function (e) {
      var _this$state = _this.state,
          index = _this$state.index,
          shouldRenderTooltip = _this$state.shouldRenderTooltip;
      var steps = _this.props.steps;

      var intKey = window.Event ? e.which : e.keyCode;
      var hasSteps = void 0;

      if (shouldRenderTooltip) {
        if ([32, 38, 40].includes(intKey)) {
          e.preventDefault();
        }

        if (intKey === 27) {
          _this.toggleTooltip({ show: false, index: index + 1, action: 'esc' });
        } else if ([13, 32].includes(intKey)) {
          hasSteps = Boolean(steps[index + 1]);
          _this.toggleTooltip({ show: hasSteps, index: index + 1, action: 'next' });
        }
      }
    };

    _this.handleClickStandaloneTrigger = function (e) {
      e.preventDefault();
      var _this$state2 = _this.state,
          isRunning = _this$state2.isRunning,
          standaloneData = _this$state2.standaloneData;

      var tooltipData = e.currentTarget.dataset.tooltip;

      if (['mouseenter', 'mouseleave'].includes(e.type) && hasTouch) {
        return;
      }

      /* istanbul ignore else */
      if (tooltipData) {
        tooltipData = JSON.parse(tooltipData);

        if (!standaloneData || standaloneData.selector !== tooltipData.selector) {
          _this.setState({
            isRunning: false,
            shouldRenderTooltip: false,
            shouldRun: isRunning,
            standaloneData: tooltipData,
            xPos: -1000,
            yPos: -1000
          });
        } else {
          document.querySelector('.joyride-tooltip__close').click();
        }
      }
    };

    _this.handleClickBeacon = function (e) {
      e.preventDefault();
      var index = _this.state.index;
      var steps = _this.props.steps;


      _this.triggerCallback({
        action: e.type,
        index: index,
        type: callbackTypes.BEACON_TRIGGER,
        step: steps[index]
      });

      _this.toggleTooltip({ show: true, index: index, action: 'beacon:' + e.type });
    };

    _this.handleClickTooltip = function (e) {
      var _this$state3 = _this.state,
          index = _this$state3.index,
          shouldRun = _this$state3.shouldRun;
      var _this$props = _this.props,
          steps = _this$props.steps,
          type = _this$props.type;

      var el = e.currentTarget.className.includes('joyride-') && ['A', 'BUTTON'].includes(e.currentTarget.tagName) ? e.currentTarget : e.target;
      var dataType = el.dataset.type;

      /* istanbul ignore else */
      if (typeof el.className === 'string' && el.className.startsWith('joyride-')) {
        e.preventDefault();
        e.stopPropagation();
        var tooltip = document.querySelector('.joyride-tooltip');
        var newIndex = index + (dataType === 'back' ? -1 : 1);

        if (dataType === 'skip') {
          _this.setState({
            isTourSkipped: true
          });
          newIndex = steps.length + 1;
        }

        /* istanbul ignore else */
        if (tooltip.classList.contains('joyride-tooltip--standalone')) {
          _this.setState({
            isRunning: shouldRun,
            shouldRedraw: true,
            shouldRun: false,
            standaloneData: false
          });
        } else if (dataType) {
          var shouldDisplay = ['continuous', 'guided'].includes(type) && !['close', 'skip'].includes(dataType) && Boolean(steps[newIndex]);

          _this.toggleTooltip({ show: shouldDisplay, index: newIndex, action: dataType });
        }

        if (e.target.className === 'joyride-overlay') {
          _this.triggerCallback({
            action: 'click',
            type: callbackTypes.OVERLAY,
            step: steps[index]
          });
        }

        if (e.target.classList.contains('joyride-hole')) {
          _this.triggerCallback({
            action: 'click',
            type: callbackTypes.HOLE,
            step: steps[index]
          });
        }
      }
    };

    _this.handleRenderTooltip = function () {
      _this.calcPlacement();
    };

    _this.state = _extends({}, defaultState);

    _this.listeners = {
      tooltips: {}
    };
    return _this;
  }

  _createClass(Joyride, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          autoStart = _props.autoStart,
          keyboardNavigation = _props.keyboardNavigation,
          resizeDebounce = _props.resizeDebounce,
          resizeDebounceDelay = _props.resizeDebounceDelay,
          run = _props.run,
          steps = _props.steps,
          type = _props.type;


      (0, _utils.logger)({
        type: 'joyride:initialized',
        msg: [this.props],
        debug: this.props.debug
      });

      var stepsAreValid = this.checkStepsValidity(steps);
      if (steps && stepsAreValid && run) {
        this.start(autoStart);
      }

      if (resizeDebounce) {
        var timeoutId = void 0;

        this.listeners.resize = function () {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(function () {
            timeoutId = null;
            _this2.calcPlacement();
          }, resizeDebounceDelay);
        };
      } else {
        this.listeners.resize = function () {
          _this2.calcPlacement();
        };
      }
      window.addEventListener('resize', this.listeners.resize);

      /* istanbul ignore else */
      if (keyboardNavigation && type === 'continuous') {
        this.listeners.keyboard = this.handleKeyboardNavigation;
        document.body.addEventListener('keydown', this.listeners.keyboard);
      }

      window.addEventListener('touchstart', function setHasTouch() {
        hasTouch = true;
        // Remove event listener once fired, otherwise it'll kill scrolling
        // performance
        window.removeEventListener('touchstart', setHasTouch);
      }, false);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      (0, _utils.logger)({
        type: 'joyride:willReceiveProps',
        msg: [nextProps],
        debug: nextProps.debug
      });

      var _state = this.state,
          isRunning = _state.isRunning,
          shouldRun = _state.shouldRun,
          standaloneData = _state.standaloneData;
      var _props2 = this.props,
          keyboardNavigation = _props2.keyboardNavigation,
          run = _props2.run,
          steps = _props2.steps,
          stepIndex = _props2.stepIndex;

      var stepsChanged = nextProps.steps !== steps;
      var stepIndexChanged = nextProps.stepIndex !== stepIndex && nextProps.stepIndex !== this.state.index;
      var runChanged = nextProps.run !== run;
      var shouldStart = false;
      var didStop = false;

      if (stepsChanged && this.checkStepsValidity(nextProps.steps)) {
        // Removed all steps, so reset
        if (!nextProps.steps || !nextProps.steps.length) {
          this.reset();
        }
        // Start the joyride if steps were added for the first time, and run prop is true
        else if (!steps.length && nextProps.run) {
            shouldStart = true;
          }
      }

      /* istanbul ignore else */
      if (runChanged) {
        // run prop was changed to off, so stop the joyride
        if (run && !nextProps.run) {
          this.stop();
          didStop = true;
        }
        // run prop was changed to on, so start the joyride
        else if (!run && nextProps.run) {
            shouldStart = true;
          }
          // Was not playing, but should, and isn't a standaloneData
          else if (!isRunning && shouldRun && !standaloneData) {
              shouldStart = true;
            }
      }

      /* istanbul ignore else */
      if (stepIndexChanged) {
        var hasStep = nextProps.steps[nextProps.stepIndex];
        var shouldDisplay = hasStep && nextProps.autoStart;
        if (runChanged && shouldStart) {
          this.start(nextProps.autoStart, nextProps.steps, nextProps.stepIndex);
        }
        // Next prop is set to run, and the index has changed, but for some reason joyride is not running
        // (maybe this is because of a target not mounted, and the app wants to skip to another step)
        else if (nextProps.run && !isRunning) {
            this.start(nextProps.autoStart, nextProps.steps, nextProps.stepIndex);
          } else if (!didStop) {
            this.toggleTooltip({ show: shouldDisplay, index: nextProps.stepIndex, steps: nextProps.steps, action: 'jump' });
          }
      }
      // Did not change the index, but need to start up the joyride
      else if (shouldStart) {
          this.start(nextProps.autoStart, nextProps.steps);
        }

      // Update keyboard listeners if necessary
      /* istanbul ignore else */
      if (!this.listeners.keyboard && (!keyboardNavigation && nextProps.keyboardNavigation || keyboardNavigation) && nextProps.type === 'continuous') {
        this.listeners.keyboard = this.handleKeyboardNavigation;
        document.body.addEventListener('keydown', this.listeners.keyboard);
      } else if (this.listeners.keyboard && keyboardNavigation && (!nextProps.keyboardNavigation || nextProps.type !== 'continuous')) {
        document.body.removeEventListener('keydown', this.listeners.keyboard);
        delete this.listeners.keyboard;
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _state2 = this.state,
          index = _state2.index,
          isRunning = _state2.isRunning,
          shouldRenderTooltip = _state2.shouldRenderTooltip,
          standaloneData = _state2.standaloneData;
      var steps = this.props.steps;
      var nextSteps = nextProps.steps;

      var step = steps[index];
      var nextStep = nextSteps[nextState.index];
      var hasRenderedTarget = Boolean(this.getStepTargetElement(nextStep));

      // Standalone tooltip is being turned on
      if (!standaloneData && nextState.standaloneData) {
        this.triggerCallback({
          type: callbackTypes.STANDALONE_BEFORE,
          step: nextState.standaloneData
        });
      }
      // Standalone tooltip is being turned off
      else if (standaloneData && !nextState.standaloneData) {
          this.triggerCallback({
            type: callbackTypes.STANDALONE_AFTER,
            step: standaloneData
          });
        }

      // Tried to start, but something went wrong and we're not actually running
      if (nextState.action === 'start' && !nextState.isRunning) {
        // There's a step to use, but there's no target in the DOM
        if (nextStep && !hasRenderedTarget) {
          console.warn('Target not mounted', nextStep, nextState.action); //eslint-disable-line no-console
          this.triggerCallback({
            action: 'start',
            index: nextState.index,
            type: callbackTypes.TARGET_NOT_FOUND,
            step: nextStep
          });
        }
      }

      // Started running from the beginning (the current index is 0)
      if (!isRunning && nextState.isRunning && nextState.index === 0) {
        this.triggerCallback({
          action: 'start',
          index: nextState.index,
          type: callbackTypes.STEP_BEFORE,
          step: nextStep
        });

        // Not showing a tooltip yet, so we're going to show a beacon instead
        /* istanbul ignore else */
        if (!nextState.shouldRenderTooltip) {
          this.triggerCallback({
            action: 'start',
            index: nextState.index,
            type: callbackTypes.BEACON_BEFORE,
            step: nextStep
          });
        }
      }

      // Joyride was running (it might still be), and the index has been changed
      if (isRunning && nextState.index !== index) {
        this.triggerCallback({
          action: nextState.action,
          index: index,
          type: callbackTypes.STEP_AFTER,
          step: step
        });

        // Attempted to advance to a step with a target that cannot be found
        /* istanbul ignore else */
        if (nextStep && !hasRenderedTarget) {
          console.warn('Target not mounted', nextStep, nextState.action); //eslint-disable-line no-console
          this.triggerCallback({
            action: nextState.action,
            index: nextState.index,
            type: callbackTypes.TARGET_NOT_FOUND,
            step: nextStep
          });
        }
        // There's a next step and the index is > 0
        // (which means STEP_BEFORE wasn't sent as part of the start handler above)
        else if (nextStep && nextState.index) {
            this.triggerCallback({
              action: nextState.action,
              index: nextState.index,
              type: callbackTypes.STEP_BEFORE,
              step: nextStep
            });
          }
      }

      // Running, and a tooltip is being turned on/off or the index is changing
      if (nextState.isRunning && (shouldRenderTooltip !== nextState.shouldRenderTooltip || nextState.index !== index)) {
        // Going to show a tooltip
        if (nextState.shouldRenderTooltip) {
          this.triggerCallback({
            action: nextState.action || (nextState.index === 0 ? 'autostart' : ''),
            index: nextState.index,
            type: callbackTypes.TOOLTIP_BEFORE,
            step: nextStep
          });
        }
        // Going to show a beacon
        else {
            this.triggerCallback({
              action: nextState.action,
              index: nextState.index,
              type: callbackTypes.BEACON_BEFORE,
              step: nextStep
            });
          }
      }

      // Joyride was changed to a step index which doesn't exist (hit the end)
      if (!nextState.isRunning && nextSteps.length && index !== nextState.index && !nextStep) {
        this.triggerCallback({
          action: nextState.action,
          type: callbackTypes.FINISHED,
          steps: nextSteps,
          isTourSkipped: nextState.isTourSkipped
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _state3 = this.state,
          index = _state3.index,
          shouldRedraw = _state3.shouldRedraw,
          isRunning = _state3.isRunning,
          shouldRun = _state3.shouldRun,
          standaloneData = _state3.standaloneData;
      var _props3 = this.props,
          scrollToFirstStep = _props3.scrollToFirstStep,
          scrollToSteps = _props3.scrollToSteps,
          steps = _props3.steps;

      var step = steps[index];
      var scrollTop = this.getScrollTop();
      var shouldScroll = (scrollToFirstStep || index > 0 || prevState.index > index) && step && !step.isFixed; // fixed steps don't need to scroll

      if (shouldRedraw && step) {
        this.calcPlacement();
      }

      if (isRunning && scrollToSteps && shouldScroll && scrollTop >= 0) {
        _scroll2.default.top((0, _utils.getRootEl)(), this.getScrollTop());
      }

      if (steps.length && !isRunning && shouldRun && !standaloneData) {
        this.start();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      window.removeEventListener('resize', this.listeners.resize);

      /* istanbul ignore else */
      if (this.listeners.keyboard) {
        document.body.removeEventListener('keydown', this.listeners.keyboard);
      }

      /* istanbul ignore else */
      if (Object.keys(this.listeners.tooltips).length) {
        Object.keys(this.listeners.tooltips).map(function (key) {
          return {
            el: document.querySelector(key),
            event: _this3.listeners.tooltips[key].event,
            cb: _this3.listeners.tooltips[key].cb,
            key: key
          };
        }).filter(function (_ref) {
          var el = _ref.el;
          return !!el;
        }).forEach(function (_ref2) {
          var el = _ref2.el,
              event = _ref2.event,
              cb = _ref2.cb,
              key = _ref2.key;

          el.removeEventListener(event, cb);
          delete _this3.listeners.tooltips[key];
        });
      }
    }

    /**
     * Starts the tour
     *
     * @private
     *
     * @param {boolean} [autorun] - Starts with the first tooltip opened
     * @param {Array} [steps] - Array of steps, defaults to this.props.steps
     * @param {number} [startIndex] - Optional step index to start joyride at
     */

  }, {
    key: 'start',
    value: function start(autorun) {
      var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.steps;
      var startIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.state.index;

      var hasMountedTarget = Boolean(this.getStepTargetElement(steps[startIndex]));
      var shouldRenderTooltip = autorun === true && hasMountedTarget;

      (0, _utils.logger)({
        type: 'joyride:start',
        msg: ['autorun:', autorun === true],
        debug: this.props.debug
      });

      this.setState({
        action: 'start',
        index: startIndex,
        isRunning: Boolean(steps.length) && hasMountedTarget,
        shouldRenderTooltip: shouldRenderTooltip,
        shouldRun: !steps.length
      });
    }

    /**
     * Stop the tour
     *
     * @private
     */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _utils.logger)({
        type: 'joyride:stop',
        debug: this.props.debug
      });

      this.setState({
        isRunning: false,
        shouldRenderTooltip: false
      });
    }

    /**
     * Move to the next step, if there is one.  If there is no next step, hide the tooltip.
     */

  }, {
    key: 'next',
    value: function next() {
      var _state4 = this.state,
          index = _state4.index,
          shouldRenderTooltip = _state4.shouldRenderTooltip;
      var steps = this.props.steps;

      var nextIndex = index + 1;

      var shouldDisplay = Boolean(steps[nextIndex]) && shouldRenderTooltip;

      (0, _utils.logger)({
        type: 'joyride:next',
        msg: ['new index:', nextIndex],
        debug: this.props.debug
      });
      this.toggleTooltip({ show: shouldDisplay, index: nextIndex, action: 'next' });
    }

    /**
     * Move to the previous step, if there is one.  If there is no previous step, hide the tooltip.
     */

  }, {
    key: 'back',
    value: function back() {
      var _state5 = this.state,
          index = _state5.index,
          shouldRenderTooltip = _state5.shouldRenderTooltip;
      var steps = this.props.steps;

      var previousIndex = index - 1;

      var shouldDisplay = Boolean(steps[previousIndex]) && shouldRenderTooltip;

      (0, _utils.logger)({
        type: 'joyride:back',
        msg: ['new index:', previousIndex],
        debug: this.props.debug
      });
      this.toggleTooltip({ show: shouldDisplay, index: previousIndex, action: 'next' });
    }

    /**
     * Reset Tour
     *
     * @param {boolean} [restart] - Starts the new tour right away
     */

  }, {
    key: 'reset',
    value: function reset(restart) {
      var _state6 = this.state,
          index = _state6.index,
          isRunning = _state6.isRunning;

      var shouldRestart = restart === true;

      var newState = _extends({}, defaultState, {
        isRunning: shouldRestart,
        shouldRenderTooltip: this.props.autoStart
      });

      (0, _utils.logger)({
        type: 'joyride:reset',
        msg: ['restart:', shouldRestart],
        debug: this.props.debug
      });
      // Force a re-render if necessary
      if (shouldRestart && isRunning === shouldRestart && index === 0) {
        this.forceUpdate();
      }

      this.setState(newState);
    }

    /**
     * Retrieve the current progress of your tour
     *
     * @returns {{index: number, percentageComplete: number, step: (object|null)}}
     */

  }, {
    key: 'getProgress',
    value: function getProgress() {
      var index = this.state.index;
      var steps = this.props.steps;


      (0, _utils.logger)({
        type: 'joyride:getProgress',
        msg: ['steps:', steps],
        debug: this.props.debug
      });

      return {
        index: index,
        percentageComplete: parseFloat((index / steps.length * 100).toFixed(2).replace('.00', '')),
        step: steps[index]
      };
    }

    /**
     * Add standalone tooltip events
     *
     * @param {Object} data - Similar shape to a 'step', but for a single tooltip
     */

  }, {
    key: 'addTooltip',
    value: function addTooltip(data) {
      if (!this.checkStepValidity(data)) {
        (0, _utils.logger)({
          type: 'joyride:addTooltip:FAIL',
          msg: ['data:', data],
          debug: this.props.debug
        });

        return;
      }

      (0, _utils.logger)({
        type: 'joyride:addTooltip',
        msg: ['data:', data],
        debug: this.props.debug
      });

      var key = data.trigger || (0, _utils.sanitizeSelector)(data.selector);
      var el = document.querySelector(key);

      if (!el) {
        return;
      }

      el.setAttribute('data-tooltip', JSON.stringify(data));
      var eventType = data.event || 'click';

      /* istanbul ignore else */
      if (eventType === 'hover') {
        this.listeners.tooltips[key + 'mouseenter'] = { event: 'mouseenter', cb: this.handleClickStandaloneTrigger };
        this.listeners.tooltips[key + 'mouseleave'] = { event: 'mouseleave', cb: this.handleClickStandaloneTrigger };

        el.addEventListener('mouseenter', this.listeners.tooltips[key + 'mouseenter'].cb);
        el.addEventListener('mouseleave', this.listeners.tooltips[key + 'mouseleave'].cb);
      }

      this.listeners.tooltips[key + 'click'] = { event: 'click', cb: this.handleClickStandaloneTrigger };
      el.addEventListener('click', this.listeners.tooltips[key + 'click'].cb);
    }

    /**
     * Parse the incoming steps
     *
     * @deprecated
     *
     * @param {Array|Object} steps
     * @returns {Array}
     */

  }, {
    key: 'parseSteps',
    value: function parseSteps(steps) {
      console.warn('joyride.parseSteps() is deprecated.  It is no longer necessary to parse steps before providing them to Joyride'); //eslint-disable-line no-console

      return steps;
    }

    /**
     * Verify that a step is valid
     *
     * @param {Object} step - A step object
     * @returns {boolean} - True if the step is valid, false otherwise
     */

  }, {
    key: 'checkStepValidity',
    value: function checkStepValidity(step) {
      var _this4 = this;

      // Check that the step is the proper type
      if (!step || (typeof step === 'undefined' ? 'undefined' : _typeof(step)) !== 'object' || Array.isArray(step)) {
        (0, _utils.logger)({
          type: 'joyride:checkStepValidity',
          msg: 'Did not provide a step object.',
          warn: true,
          debug: this.props.debug
        });

        return false;
      }

      // Check that all required step fields are present
      var requiredFields = ['selector'];
      var hasRequiredField = function hasRequiredField(requiredField) {
        var hasField = Boolean(step[requiredField]);

        if (!hasField) {
          (0, _utils.logger)({
            type: 'joyride:checkStepValidity',
            msg: ['Provided a step without the required ' + requiredField + ' property.', 'Step:', step],
            warn: true,
            debug: _this4.props.debug
          });
        }

        return hasField;
      };

      return requiredFields.every(hasRequiredField);
    }

    /**
     * Check one or more steps are valid
     *
     * @param {Object|Array} steps - A step object or array of step objects
     * @returns {boolean} - True if one or more stpes, and all steps are valid, false otherwise
     */

  }, {
    key: 'checkStepsValidity',
    value: function checkStepsValidity(steps) {
      /* istanbul ignore else */
      if (!Array.isArray(steps) && (typeof steps === 'undefined' ? 'undefined' : _typeof(steps)) === 'object') {
        return this.checkStepValidity(steps);
      } else if (steps.length > 0) {
        return steps.every(this.checkStepValidity);
      }

      return false;
    }

    /**
     * Find and return the targeted DOM element based on a step's 'selector'.
     *
     * @private
     * @param {Object} step - A step object
     * @returns {Element} - A DOM element (if found)
     */

  }, {
    key: 'getStepTargetElement',
    value: function getStepTargetElement(step) {
      var isValidStep = this.checkStepValidity(step);
      if (!isValidStep) {
        return null;
      }

      var el = document.querySelector((0, _utils.sanitizeSelector)(step.selector));

      if (!el) {
        (0, _utils.logger)({
          type: 'joyride:getStepTargetElement',
          msg: 'Target not rendered. For best results only add steps after they are mounted.',
          warn: true,
          debug: this.props.debug
        });

        return null;
      }

      return el;
    }

    /**
     * Get an element actual dimensions with margin
     *
     * @private
     * @returns {{height: number, width: number}}
     */

  }, {
    key: 'getElementDimensions',
    value: function getElementDimensions() {
      var _state7 = this.state,
          shouldRenderTooltip = _state7.shouldRenderTooltip,
          standaloneData = _state7.standaloneData;

      var displayTooltip = standaloneData ? true : shouldRenderTooltip;
      var el = document.querySelector(displayTooltip ? '.joyride-tooltip' : '.joyride-beacon');

      var height = 0;
      var width = 0;

      if (el) {
        var styles = window.getComputedStyle(el);
        height = el.clientHeight + parseInt(styles.marginTop || 0, 10) + parseInt(styles.marginBottom || 0, 10);
        width = el.clientWidth + parseInt(styles.marginLeft || 0, 10) + parseInt(styles.marginRight || 0, 10);
      }

      return {
        height: height,
        width: width
      };
    }

    /**
     * Get the scrollTop position
     *
     * @private
     * @returns {number}
     */

  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      var _state8 = this.state,
          index = _state8.index,
          yPos = _state8.yPos;
      var _props4 = this.props,
          offsetParentSelector = _props4.offsetParentSelector,
          scrollOffset = _props4.scrollOffset,
          steps = _props4.steps;

      var step = steps[index];
      var target = this.getStepTargetElement(step);
      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));

      if (!target) {
        return 0;
      }

      var rect = (0, _utils.getOffsetBoundingClientRect)(target, offsetParent);
      var targetTop = rect.top + (window.pageYOffset || document.documentElement.scrollTop);
      var position = this.calcPosition(step);
      var scrollTo = 0;

      /* istanbul ignore else */
      if (/^top/.test(position)) {
        scrollTo = Math.floor(yPos - scrollOffset);
      } else if (/^bottom|^left|^right/.test(position)) {
        scrollTo = Math.floor(targetTop - scrollOffset);
      }

      return scrollTo;
    }

    /**
     * Trigger the callback.
     *
     * @private
     * @param {Object} options
     */

  }, {
    key: 'triggerCallback',
    value: function triggerCallback(options) {
      var callback = this.props.callback;

      /* istanbul ignore else */

      if (typeof callback === 'function') {
        (0, _utils.logger)({
          type: 'joyride:triggerCallback',
          msg: [options],
          debug: this.props.debug
        });

        callback(options);
      }
    }

    /**
     * Keydown event listener
     *
     * @private
     * @param {Event} e - Keyboard event
     */


    /**
     * Tooltip event listener
     *
     * @private
     * @param {Event} e - Click event
     */


    /**
     * Beacon click event listener
     *
     * @private
     * @param {Event} e - Click event
     */


    /**
     * Tooltip click event listener
     *
     * @private
     * @param {Event} e - Click event
     */

  }, {
    key: 'toggleTooltip',


    /**
     * Toggle Tooltip's visibility
     *
     * @private
     * @param {Object} options - Immediately destructured argument object
     * @param {Boolean} options.show - Render the tooltip or the beacon
     * @param {Number} options.index - The tour's new index
     * @param {string} [options.action] - The action being undertaken.
     * @param {Array} [options.steps] - The array of step objects that is going to be rendered
     */
    value: function toggleTooltip(_ref3) {
      var show = _ref3.show,
          _ref3$index = _ref3.index,
          index = _ref3$index === undefined ? this.state.index : _ref3$index,
          action = _ref3.action,
          _ref3$steps = _ref3.steps,
          steps = _ref3$steps === undefined ? this.props.steps : _ref3$steps;

      var nextStep = steps[index];
      var hasMountedTarget = Boolean(this.getStepTargetElement(nextStep));

      this.setState({
        action: action,
        index: index,
        // Stop playing if there is no next step or can't find the target
        isRunning: nextStep && hasMountedTarget ? this.state.isRunning : false,
        // If we are not showing now, or there is no target, we'll need to redraw eventually
        shouldRedraw: !show || !hasMountedTarget,
        shouldRenderTooltip: show && hasMountedTarget,
        xPos: -1000,
        yPos: -1000
      });
    }

    /**
     * Position absolute elements next to its target
     *
     * @private
     */

  }, {
    key: 'calcPlacement',
    value: function calcPlacement() {
      var _state9 = this.state,
          index = _state9.index,
          isRunning = _state9.isRunning,
          standaloneData = _state9.standaloneData,
          shouldRenderTooltip = _state9.shouldRenderTooltip;
      var _props5 = this.props,
          offsetParentSelector = _props5.offsetParentSelector,
          steps = _props5.steps,
          tooltipOffset = _props5.tooltipOffset;

      var step = standaloneData || steps[index] || {};
      var displayTooltip = standaloneData ? true : shouldRenderTooltip;
      var target = this.getStepTargetElement(step);
      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));

      (0, _utils.logger)({
        type: 'joyride:calcPlacement' + this.getRenderStage(),
        msg: ['step:', step],
        debug: this.props.debug
      });

      /* istanbul ignore else */
      if (!target) {
        return;
      }

      var placement = {
        x: -1000,
        y: -1000
      };

      /* istanbul ignore else */
      if (step && (standaloneData || isRunning && steps[index])) {
        var offsetX = _nestedProperty2.default.get(step, 'style.beacon.offsetX') || 0;
        var offsetY = _nestedProperty2.default.get(step, 'style.beacon.offsetY') || 0;
        var position = this.calcPosition(step);
        var scrollingElement = (0, _utils.getRootEl)().getBoundingClientRect();
        var scrollTop = step.isFixed === true ? 0 : scrollingElement.top;
        var component = this.getElementDimensions();
        var rect = (0, _utils.getOffsetBoundingClientRect)(target, offsetParent);

        // Calculate x position
        if (/^left/.test(position)) {
          placement.x = rect.left - (displayTooltip ? component.width + tooltipOffset : component.width / 2 + offsetX);
        } else if (/^right/.test(position)) {
          placement.x = rect.left + rect.width - (displayTooltip ? -tooltipOffset : component.width / 2 - offsetX);
        } else {
          placement.x = rect.left + (rect.width / 2 - component.width / 2);
        }

        // Calculate y position
        if (/^top/.test(position)) {
          placement.y = rect.top - scrollTop - (displayTooltip ? component.height + tooltipOffset : component.height / 2 + offsetY);
        } else if (/^bottom/.test(position)) {
          placement.y = rect.top - scrollTop + (rect.height - (displayTooltip ? -tooltipOffset : component.height / 2 - offsetY));
        } else {
          placement.y = rect.top - scrollTop;
        }

        /* istanbul ignore else */
        if (/^bottom|^top/.test(position)) {
          if (/left/.test(position)) {
            placement.x = rect.left - (displayTooltip ? tooltipOffset : component.width / 2);
          } else if (/right/.test(position)) {
            placement.x = rect.left + (rect.width - (displayTooltip ? component.width - tooltipOffset : component.width / 2));
          }
        }

        this.setState({
          shouldRedraw: false,
          xPos: this.preventWindowOverflow(Math.ceil(placement.x), 'x', component.width, component.height),
          yPos: this.preventWindowOverflow(Math.ceil(placement.y), 'y', component.width, component.height)
        });
      }
    }

    /**
     * Update position for overflowing elements.
     *
     * @private
     * @param {Object} step
     *
     * @returns {string}
     */

  }, {
    key: 'calcPosition',
    value: function calcPosition(step) {
      var _props6 = this.props,
          offsetParentSelector = _props6.offsetParentSelector,
          tooltipOffset = _props6.tooltipOffset;

      var scrollingElement = (0, _utils.getRootEl)();
      var scrollingElementRect = scrollingElement.getBoundingClientRect();
      var target = this.getStepTargetElement(step);
      var offsetParent = document.querySelector((0, _utils.sanitizeSelector)(offsetParentSelector));
      var rect = (0, _utils.getOffsetBoundingClientRect)(target, offsetParent);

      var _getElementDimensions = this.getElementDimensions(),
          height = _getElementDimensions.height,
          _getElementDimensions2 = _getElementDimensions.width,
          width = _getElementDimensions2 === undefined ? DEFAULTS.minWidth : _getElementDimensions2;

      var position = step.position || DEFAULTS.position;

      if (/^left/.test(position) && rect.left - (width + tooltipOffset) < 0) {
        position = 'top';
      } else if (/^right/.test(position) && rect.left + rect.width + (width + tooltipOffset) > scrollingElementRect.width) {
        position = 'bottom';
      }

      if (/^top/.test(position) && (rect.top + scrollingElement.scrollTop - (height + tooltipOffset) < 0 || step.isFixed && rect.top - height < 0)) {
        position = 'bottom';
      } else if (/^bottom/.test(position) && (rect.top + scrollingElement.scrollTop + (height + tooltipOffset) > (0, _utils.getDocHeight)() || step.isFixed && rect.top + rect.height + height > scrollingElementRect.height)) {
        position = 'top';
      }

      return position;
    }

    /**
     * Get the render stage.
     *
     * @private
     * @returns {string}
     */

  }, {
    key: 'getRenderStage',
    value: function getRenderStage() {
      var _state10 = this.state,
          shouldRedraw = _state10.shouldRedraw,
          xPos = _state10.xPos;


      if (shouldRedraw) {
        return ':redraw';
      } else if (xPos < 0) {
        return ':pre-render';
      }

      return '';
    }

    /**
     * Prevent tooltip to render outside the window
     *
     * @private
     * @param {Number} value - The axis position
     * @param {String} axis - The Axis X or Y
     * @param {Number} elWidth - The target element width
     * @param {Number} elHeight - The target element height
     * @returns {Number}
     */

  }, {
    key: 'preventWindowOverflow',
    value: function preventWindowOverflow(value, axis, elWidth, elHeight) {
      var winWidth = window.innerWidth;
      var docHeight = (0, _utils.getDocHeight)();
      var newValue = value;

      /* istanbul ignore else */
      if (axis === 'x') {
        if (value + elWidth >= winWidth) {
          newValue = winWidth - elWidth - 15;
        } else if (value < 15) {
          newValue = 15;
        }
      } else if (axis === 'y') {
        if (value + elHeight >= docHeight) {
          newValue = docHeight - elHeight - 15;
        } else if (value < 15) {
          newValue = 15;
        }
      }

      return newValue;
    }

    /**
     * Create a React Element
     *
     * @private
     * @returns {boolean|ReactComponent}
     */

  }, {
    key: 'createComponent',
    value: function createComponent() {
      var _state11 = this.state,
          index = _state11.index,
          shouldRedraw = _state11.shouldRedraw,
          shouldRenderTooltip = _state11.shouldRenderTooltip,
          standaloneData = _state11.standaloneData,
          xPos = _state11.xPos,
          yPos = _state11.yPos;
      var _props7 = this.props,
          disableOverlay = _props7.disableOverlay,
          holePadding = _props7.holePadding,
          locale = _props7.locale,
          offsetParentSelector = _props7.offsetParentSelector,
          showBackButton = _props7.showBackButton,
          showOverlay = _props7.showOverlay,
          showSkipButton = _props7.showSkipButton,
          showStepsProgress = _props7.showStepsProgress,
          steps = _props7.steps,
          type = _props7.type;

      var currentStep = standaloneData || steps[index];
      var step = _extends({}, currentStep);

      var target = this.getStepTargetElement(step);
      var component = void 0;

      var allowClicksThruHole = step && step.allowClicksThruHole || this.props.allowClicksThruHole;
      var shouldShowOverlay = standaloneData ? false : showOverlay;
      var buttons = {
        primary: locale.close
      };

      (0, _utils.logger)({
        type: 'joyride:createComponent' + this.getRenderStage(),
        msg: ['component:', shouldRenderTooltip || standaloneData ? 'Tooltip' : 'Beacon', 'animate:', xPos > -1 && !shouldRedraw, 'step:', step],
        debug: this.props.debug,
        warn: !target
      });

      if (!target) {
        return false;
      }

      if (shouldRenderTooltip || standaloneData) {
        var position = this.calcPosition(step);

        /* istanbul ignore else */
        if (!standaloneData) {
          /* istanbul ignore else */
          if (['continuous', 'guided'].includes(type)) {
            buttons.primary = locale.last;

            /* istanbul ignore else */
            if (steps[index + 1]) {
              if (showStepsProgress) {
                var next = locale.next;


                if (typeof locale.next === 'string') {
                  next = _react2.default.createElement(
                    'span',
                    null,
                    locale.next
                  );
                }

                buttons.primary = _react2.default.createElement(
                  'span',
                  null,
                  next,
                  ' ',
                  _react2.default.createElement(
                    'span',
                    null,
                    index + 1 + '/' + steps.length
                  )
                );
              } else {
                buttons.primary = locale.next;
              }
            }

            if (showBackButton && index > 0) {
              buttons.secondary = locale.back;
            }
          }

          if (showSkipButton) {
            buttons.skip = locale.skip;
          }
        }

        component = _react2.default.createElement(_Tooltip2.default, {
          allowClicksThruHole: allowClicksThruHole,
          animate: xPos > -1 && !shouldRedraw,
          buttons: buttons,
          disableOverlay: disableOverlay,
          holePadding: holePadding,
          offsetParentSelector: offsetParentSelector,
          position: position,
          selector: (0, _utils.sanitizeSelector)(step.selector),
          showOverlay: shouldShowOverlay,
          step: step,
          standalone: Boolean(standaloneData),
          target: target,
          type: type,
          xPos: xPos,
          yPos: yPos,
          onClick: this.handleClickTooltip,
          onRender: this.handleRenderTooltip
        });
      } else {
        component = _react2.default.createElement(_Beacon2.default, {
          step: step,
          xPos: xPos,
          yPos: yPos,
          onTrigger: this.handleClickBeacon,
          eventType: step.type || 'click'
        });
      }

      return component;
    }
  }, {
    key: 'render',
    value: function render() {
      var _state12 = this.state,
          index = _state12.index,
          isRunning = _state12.isRunning,
          standaloneData = _state12.standaloneData;
      var steps = this.props.steps;

      var hasStep = Boolean(steps[index]);
      var component = void 0;
      var standaloneComponent = void 0;

      if (isRunning && hasStep) {
        (0, _utils.logger)({
          type: 'joyride:render' + this.getRenderStage(),
          msg: ['step:', steps[index]],
          debug: this.props.debug
        });
      } else if (!isRunning && standaloneData) {
        (0, _utils.logger)({
          type: 'joyride:render',
          msg: ['tooltip:', standaloneData],
          debug: this.props.debug
        });
      }

      if (standaloneData) {
        standaloneComponent = this.createComponent();
      } else if (isRunning && hasStep) {
        component = this.createComponent();
      }

      return _react2.default.createElement(
        'div',
        { className: 'joyride' },
        component,
        standaloneComponent
      );
    }
  }]);

  return Joyride;
}(_react2.default.Component);

Joyride.propTypes = {
  allowClicksThruHole: _propTypes2.default.bool,
  autoStart: _propTypes2.default.bool,
  callback: _propTypes2.default.func,
  debug: _propTypes2.default.bool,
  disableOverlay: _propTypes2.default.bool,
  holePadding: _propTypes2.default.number,
  keyboardNavigation: _propTypes2.default.bool,
  locale: _propTypes2.default.object,
  offsetParentSelector: _propTypes2.default.string,
  resizeDebounce: _propTypes2.default.bool,
  resizeDebounceDelay: _propTypes2.default.number,
  run: _propTypes2.default.bool,
  scrollOffset: _propTypes2.default.number,
  scrollToFirstStep: _propTypes2.default.bool,
  scrollToSteps: _propTypes2.default.bool,
  showBackButton: _propTypes2.default.bool,
  showOverlay: _propTypes2.default.bool,
  showSkipButton: _propTypes2.default.bool,
  showStepsProgress: _propTypes2.default.bool,
  stepIndex: _propTypes2.default.number,
  steps: _propTypes2.default.array,
  tooltipOffset: _propTypes2.default.number,
  type: _propTypes2.default.string
};
Joyride.defaultProps = {
  allowClicksThruHole: false,
  autoStart: false,
  debug: false,
  disableOverlay: false,
  holePadding: 5,
  keyboardNavigation: true,
  locale: {
    back: 'Back',
    close: 'Close',
    last: 'Last',
    next: 'Next',
    skip: 'Skip'
  },
  offsetParentSelector: 'body',
  resizeDebounce: false,
  resizeDebounceDelay: 200,
  run: false,
  scrollOffset: 20,
  scrollToFirstStep: false,
  scrollToSteps: true,
  showBackButton: true,
  showOverlay: true,
  showSkipButton: false,
  showStepsProgress: false,
  stepIndex: 0,
  steps: [],
  tooltipOffset: 15,
  type: 'single'
};
exports.default = Joyride;
},{"./Beacon":15,"./Tooltip":16,"./utils":18,"nested-property":4,"prop-types":10,"react":"react","scroll":31}],18:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.hexToRGB = hexToRGB;
exports.getDocHeight = getDocHeight;
exports.getRootEl = getRootEl;
exports.logger = logger;
exports.sanitizeSelector = sanitizeSelector;
exports.getOffsetBoundingClientRect = getOffsetBoundingClientRect;
/*eslint-disable no-nested-ternary */

/**
 * Convert hex to RGB
 *
 * @param {string} hex
 * @returns {Object}
 */
function hexToRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var newHex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newHex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Get the current browser
 *
 * @returns {String}
 */
function getBrowser() {
  /* istanbul ignore if */
  if (typeof window === 'undefined') {
    return 'node';
  }

  // Opera 8.0+
  var isOpera = Boolean(window.opera) || navigator.userAgent.indexOf(' OPR/') >= 0;
  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';
  // Chrome 1+
  var isChrome = !!window.chrome && !!window.chrome.webstore;
  // Safari <= 9 "[object HTMLElementConstructor]"
  var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 || !isChrome) && !isOpera && window.webkitAudioContext !== undefined;
  // Internet Explorer 6-11
  var isIE = Boolean(document.documentMode); // At least IE6

  return isOpera ? 'opera' : isFirefox ? 'firefox' : isChrome ? 'chrome' : isSafari ? 'safari' : isIE ? 'ie' : '';
}

var browser = exports.browser = getBrowser();

/**
 * Helper function to get the browser-normalized "document height"
 * @returns {Number}
 */
function getDocHeight() {
  var _document = document,
      body = _document.body,
      html = _document.documentElement;


  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

/**
 * Get DOM document root element
 * @returns {Element}
 */
function getRootEl() {
  var _document2 = document,
      scrollingElement = _document2.scrollingElement;


  if (!scrollingElement) {
    return ['ie', 'firefox'].indexOf(browser) > -1 ? document.documentElement : document.body;
  }

  return scrollingElement;
}

/**
 * Log method calls if debug is enabled
 *
 * @private
 * @param {Object}       arg         - Immediately destructured option argument
 * @param {string}       arg.type    - The method the logger was called from
 * @param {string|Array} [arg.msg]   - The message to be logged
 * @param {boolean}      [arg.warn]  - If true, the message will be a warning
 * @param {boolean}      [arg.debug] - Nothing will be logged unless debug is true
 */
function logger(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === undefined ? 'joyride' : _ref$type,
      msg = _ref.msg,
      _ref$warn = _ref.warn,
      warn = _ref$warn === undefined ? false : _ref$warn,
      _ref$debug = _ref.debug,
      debug = _ref$debug === undefined ? false : _ref$debug;

  var loggingFunction = warn ? console.warn || console.error : console.log; //eslint-disable-line no-console
  if (debug) {
    console.log('%c' + type, 'color: #760bc5; font-weight: bold; font-size: 12px;'); //eslint-disable-line no-console
    /* istanbul ignore else */
    if (msg) {
      if (Array.isArray(msg)) {
        loggingFunction.apply(console, msg);
      } else {
        loggingFunction.apply(console, [msg]);
      }
    }
  }
}

/**
 * Check for deprecated selector styles, return stringified, safer versions
 *
 * @param   {string|Object} selector - The selector provided in a step object
 * @returns {string}                   A cleaned-up selector string
 */
function sanitizeSelector(selector) {
  if (selector.dataset && selector.dataset.reactid) {
    console.warn('Deprecation warning: React 15.0 removed reactid. Update your code.'); //eslint-disable-line no-console
    return '[data-reactid="' + selector.dataset.reactid + '"]';
  } else if (selector.dataset) {
    console.error('Unsupported error: React 15.0+ doesn’t write reactid to the DOM anymore, please use a plain class in your step.', selector); //eslint-disable-line no-console

    /* istanbul ignore else */
    if (selector.className) {
      return '.' + selector.className.replace(' ', '.');
    }
  }
  return selector;
}

/**
 * Find the bounding client rect
 *
 * @private
 * @param {Object} element - The target element
 * @param {string} [offsetParent] - The parent element to calculate offsets from
 * @returns {DOMRect}
 */
function getOffsetBoundingClientRect(element, offsetParent) {
  var elementRect = element.getBoundingClientRect();

  if (!offsetParent) {
    return elementRect;
  }

  var offsetParentRect = offsetParent.getBoundingClientRect();

  var offsetTop = offsetParentRect.top > 0 ? elementRect.top - offsetParentRect.top : elementRect.top;
  var offsetLeft = offsetParentRect.left > 0 ? elementRect.left - offsetParentRect.left : elementRect.left;
  var offsetRight = offsetParentRect.right > 0 ? offsetParentRect.right - elementRect.right : elementRect.right;
  var offsetBottom = offsetParentRect.bottom > 0 ? offsetParentRect.bottom - elementRect.bottom : elementRect.bottom;

  return {
    top: offsetTop,
    left: offsetLeft,
    right: offsetRight,
    bottom: offsetBottom,
    x: offsetLeft,
    y: offsetTop,
    width: elementRect.width,
    height: elementRect.height
  };
}
},{}],19:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var msPerFrame = 1000 / 60;

var Motion = (function (_React$Component) {
  _inherits(Motion, _React$Component);

  _createClass(Motion, null, [{
    key: 'propTypes',
    value: {
      // TOOD: warn against putting a config in here
      defaultStyle: _propTypes2['default'].objectOf(_propTypes2['default'].number),
      style: _propTypes2['default'].objectOf(_propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].object])).isRequired,
      children: _propTypes2['default'].func.isRequired,
      onRest: _propTypes2['default'].func
    },
    enumerable: true
  }]);

  function Motion(props) {
    var _this = this;

    _classCallCheck(this, Motion);

    _React$Component.call(this, props);
    this.wasAnimating = false;
    this.animationID = null;
    this.prevTime = 0;
    this.accumulatedTime = 0;
    this.unreadPropStyle = null;

    this.clearUnreadPropStyle = function (destStyle) {
      var dirty = false;
      var _state = _this.state;
      var currentStyle = _state.currentStyle;
      var currentVelocity = _state.currentVelocity;
      var lastIdealStyle = _state.lastIdealStyle;
      var lastIdealVelocity = _state.lastIdealVelocity;

      for (var key in destStyle) {
        if (!Object.prototype.hasOwnProperty.call(destStyle, key)) {
          continue;
        }

        var styleValue = destStyle[key];
        if (typeof styleValue === 'number') {
          if (!dirty) {
            dirty = true;
            currentStyle = _extends({}, currentStyle);
            currentVelocity = _extends({}, currentVelocity);
            lastIdealStyle = _extends({}, lastIdealStyle);
            lastIdealVelocity = _extends({}, lastIdealVelocity);
          }

          currentStyle[key] = styleValue;
          currentVelocity[key] = 0;
          lastIdealStyle[key] = styleValue;
          lastIdealVelocity[key] = 0;
        }
      }

      if (dirty) {
        _this.setState({ currentStyle: currentStyle, currentVelocity: currentVelocity, lastIdealStyle: lastIdealStyle, lastIdealVelocity: lastIdealVelocity });
      }
    };

    this.startAnimationIfNecessary = function () {
      // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
      // call cb? No, otherwise accidental parent rerender causes cb trigger
      _this.animationID = _raf2['default'](function (timestamp) {
        // check if we need to animate in the first place
        var propsStyle = _this.props.style;
        if (_shouldStopAnimation2['default'](_this.state.currentStyle, propsStyle, _this.state.currentVelocity)) {
          if (_this.wasAnimating && _this.props.onRest) {
            _this.props.onRest();
          }

          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.wasAnimating = false;
          _this.accumulatedTime = 0;
          return;
        }

        _this.wasAnimating = true;

        var currentTime = timestamp || _performanceNow2['default']();
        var timeDelta = currentTime - _this.prevTime;
        _this.prevTime = currentTime;
        _this.accumulatedTime = _this.accumulatedTime + timeDelta;
        // more than 10 frames? prolly switched browser tab. Restart
        if (_this.accumulatedTime > msPerFrame * 10) {
          _this.accumulatedTime = 0;
        }

        if (_this.accumulatedTime === 0) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.startAnimationIfNecessary();
          return;
        }

        var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
        var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

        var newLastIdealStyle = {};
        var newLastIdealVelocity = {};
        var newCurrentStyle = {};
        var newCurrentVelocity = {};

        for (var key in propsStyle) {
          if (!Object.prototype.hasOwnProperty.call(propsStyle, key)) {
            continue;
          }

          var styleValue = propsStyle[key];
          if (typeof styleValue === 'number') {
            newCurrentStyle[key] = styleValue;
            newCurrentVelocity[key] = 0;
            newLastIdealStyle[key] = styleValue;
            newLastIdealVelocity[key] = 0;
          } else {
            var newLastIdealStyleValue = _this.state.lastIdealStyle[key];
            var newLastIdealVelocityValue = _this.state.lastIdealVelocity[key];
            for (var i = 0; i < framesToCatchUp; i++) {
              var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              newLastIdealStyleValue = _stepper[0];
              newLastIdealVelocityValue = _stepper[1];
            }

            var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

            var nextIdealX = _stepper2[0];
            var nextIdealV = _stepper2[1];

            newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
            newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
            newLastIdealStyle[key] = newLastIdealStyleValue;
            newLastIdealVelocity[key] = newLastIdealVelocityValue;
          }
        }

        _this.animationID = null;
        // the amount we're looped over above
        _this.accumulatedTime -= framesToCatchUp * msPerFrame;

        _this.setState({
          currentStyle: newCurrentStyle,
          currentVelocity: newCurrentVelocity,
          lastIdealStyle: newLastIdealStyle,
          lastIdealVelocity: newLastIdealVelocity
        });

        _this.unreadPropStyle = null;

        _this.startAnimationIfNecessary();
      });
    };

    this.state = this.defaultState();
  }

  Motion.prototype.defaultState = function defaultState() {
    var _props = this.props;
    var defaultStyle = _props.defaultStyle;
    var style = _props.style;

    var currentStyle = defaultStyle || _stripStyle2['default'](style);
    var currentVelocity = _mapToZero2['default'](currentStyle);
    return {
      currentStyle: currentStyle,
      currentVelocity: currentVelocity,
      lastIdealStyle: currentStyle,
      lastIdealVelocity: currentVelocity
    };
  };

  // it's possible that currentStyle's value is stale: if props is immediately
  // changed from 0 to 400 to spring(0) again, the async currentStyle is still
  // at 0 (didn't have time to tick and interpolate even once). If we naively
  // compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
  // In reality currentStyle should be 400

  Motion.prototype.componentDidMount = function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  };

  Motion.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.unreadPropStyle != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyle);
    }

    this.unreadPropStyle = props.style;
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  };

  Motion.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  };

  Motion.prototype.render = function render() {
    var renderedChildren = this.props.children(this.state.currentStyle);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  };

  return Motion;
})(_react2['default'].Component);

exports['default'] = Motion;
module.exports = exports['default'];

// after checking for unreadPropStyle != null, we manually go set the
// non-interpolating values (those that are a number, without a spring
// config)
},{"./mapToZero":22,"./shouldStopAnimation":27,"./stepper":29,"./stripStyle":30,"performance-now":6,"prop-types":10,"raf":12,"react":"react"}],20:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var msPerFrame = 1000 / 60;

function shouldStopAnimationAll(currentStyles, styles, currentVelocities) {
  for (var i = 0; i < currentStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], styles[i], currentVelocities[i])) {
      return false;
    }
  }
  return true;
}

var StaggeredMotion = (function (_React$Component) {
  _inherits(StaggeredMotion, _React$Component);

  _createClass(StaggeredMotion, null, [{
    key: 'propTypes',
    value: {
      // TOOD: warn against putting a config in here
      defaultStyles: _propTypes2['default'].arrayOf(_propTypes2['default'].objectOf(_propTypes2['default'].number)),
      styles: _propTypes2['default'].func.isRequired,
      children: _propTypes2['default'].func.isRequired
    },
    enumerable: true
  }]);

  function StaggeredMotion(props) {
    var _this = this;

    _classCallCheck(this, StaggeredMotion);

    _React$Component.call(this, props);
    this.animationID = null;
    this.prevTime = 0;
    this.accumulatedTime = 0;
    this.unreadPropStyles = null;

    this.clearUnreadPropStyle = function (unreadPropStyles) {
      var _state = _this.state;
      var currentStyles = _state.currentStyles;
      var currentVelocities = _state.currentVelocities;
      var lastIdealStyles = _state.lastIdealStyles;
      var lastIdealVelocities = _state.lastIdealVelocities;

      var someDirty = false;
      for (var i = 0; i < unreadPropStyles.length; i++) {
        var unreadPropStyle = unreadPropStyles[i];
        var dirty = false;

        for (var key in unreadPropStyle) {
          if (!Object.prototype.hasOwnProperty.call(unreadPropStyle, key)) {
            continue;
          }

          var styleValue = unreadPropStyle[key];
          if (typeof styleValue === 'number') {
            if (!dirty) {
              dirty = true;
              someDirty = true;
              currentStyles[i] = _extends({}, currentStyles[i]);
              currentVelocities[i] = _extends({}, currentVelocities[i]);
              lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
              lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
            }
            currentStyles[i][key] = styleValue;
            currentVelocities[i][key] = 0;
            lastIdealStyles[i][key] = styleValue;
            lastIdealVelocities[i][key] = 0;
          }
        }
      }

      if (someDirty) {
        _this.setState({ currentStyles: currentStyles, currentVelocities: currentVelocities, lastIdealStyles: lastIdealStyles, lastIdealVelocities: lastIdealVelocities });
      }
    };

    this.startAnimationIfNecessary = function () {
      // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
      // call cb? No, otherwise accidental parent rerender causes cb trigger
      _this.animationID = _raf2['default'](function (timestamp) {
        var destStyles = _this.props.styles(_this.state.lastIdealStyles);

        // check if we need to animate in the first place
        if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities)) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.accumulatedTime = 0;
          return;
        }

        var currentTime = timestamp || _performanceNow2['default']();
        var timeDelta = currentTime - _this.prevTime;
        _this.prevTime = currentTime;
        _this.accumulatedTime = _this.accumulatedTime + timeDelta;
        // more than 10 frames? prolly switched browser tab. Restart
        if (_this.accumulatedTime > msPerFrame * 10) {
          _this.accumulatedTime = 0;
        }

        if (_this.accumulatedTime === 0) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.startAnimationIfNecessary();
          return;
        }

        var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
        var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

        var newLastIdealStyles = [];
        var newLastIdealVelocities = [];
        var newCurrentStyles = [];
        var newCurrentVelocities = [];

        for (var i = 0; i < destStyles.length; i++) {
          var destStyle = destStyles[i];
          var newCurrentStyle = {};
          var newCurrentVelocity = {};
          var newLastIdealStyle = {};
          var newLastIdealVelocity = {};

          for (var key in destStyle) {
            if (!Object.prototype.hasOwnProperty.call(destStyle, key)) {
              continue;
            }

            var styleValue = destStyle[key];
            if (typeof styleValue === 'number') {
              newCurrentStyle[key] = styleValue;
              newCurrentVelocity[key] = 0;
              newLastIdealStyle[key] = styleValue;
              newLastIdealVelocity[key] = 0;
            } else {
              var newLastIdealStyleValue = _this.state.lastIdealStyles[i][key];
              var newLastIdealVelocityValue = _this.state.lastIdealVelocities[i][key];
              for (var j = 0; j < framesToCatchUp; j++) {
                var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

                newLastIdealStyleValue = _stepper[0];
                newLastIdealVelocityValue = _stepper[1];
              }

              var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              var nextIdealX = _stepper2[0];
              var nextIdealV = _stepper2[1];

              newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
              newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
              newLastIdealStyle[key] = newLastIdealStyleValue;
              newLastIdealVelocity[key] = newLastIdealVelocityValue;
            }
          }

          newCurrentStyles[i] = newCurrentStyle;
          newCurrentVelocities[i] = newCurrentVelocity;
          newLastIdealStyles[i] = newLastIdealStyle;
          newLastIdealVelocities[i] = newLastIdealVelocity;
        }

        _this.animationID = null;
        // the amount we're looped over above
        _this.accumulatedTime -= framesToCatchUp * msPerFrame;

        _this.setState({
          currentStyles: newCurrentStyles,
          currentVelocities: newCurrentVelocities,
          lastIdealStyles: newLastIdealStyles,
          lastIdealVelocities: newLastIdealVelocities
        });

        _this.unreadPropStyles = null;

        _this.startAnimationIfNecessary();
      });
    };

    this.state = this.defaultState();
  }

  StaggeredMotion.prototype.defaultState = function defaultState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;

    var currentStyles = defaultStyles || styles().map(_stripStyle2['default']);
    var currentVelocities = currentStyles.map(function (currentStyle) {
      return _mapToZero2['default'](currentStyle);
    });
    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: currentStyles,
      lastIdealVelocities: currentVelocities
    };
  };

  StaggeredMotion.prototype.componentDidMount = function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  };

  StaggeredMotion.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.unreadPropStyles != null) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    this.unreadPropStyles = props.styles(this.state.lastIdealStyles);
    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  };

  StaggeredMotion.prototype.componentWillUnmount = function componentWillUnmount() {
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  };

  StaggeredMotion.prototype.render = function render() {
    var renderedChildren = this.props.children(this.state.currentStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  };

  return StaggeredMotion;
})(_react2['default'].Component);

exports['default'] = StaggeredMotion;
module.exports = exports['default'];

// it's possible that currentStyle's value is stale: if props is immediately
// changed from 0 to 400 to spring(0) again, the async currentStyle is still
// at 0 (didn't have time to tick and interpolate even once). If we naively
// compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
// In reality currentStyle should be 400

// after checking for unreadPropStyles != null, we manually go set the
// non-interpolating values (those that are a number, without a spring
// config)
},{"./mapToZero":22,"./shouldStopAnimation":27,"./stepper":29,"./stripStyle":30,"performance-now":6,"prop-types":10,"raf":12,"react":"react"}],21:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _mapToZero = require('./mapToZero');

var _mapToZero2 = _interopRequireDefault(_mapToZero);

var _stripStyle = require('./stripStyle');

var _stripStyle2 = _interopRequireDefault(_stripStyle);

var _stepper3 = require('./stepper');

var _stepper4 = _interopRequireDefault(_stepper3);

var _mergeDiff = require('./mergeDiff');

var _mergeDiff2 = _interopRequireDefault(_mergeDiff);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

var _raf = require('raf');

var _raf2 = _interopRequireDefault(_raf);

var _shouldStopAnimation = require('./shouldStopAnimation');

var _shouldStopAnimation2 = _interopRequireDefault(_shouldStopAnimation);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var msPerFrame = 1000 / 60;

// the children function & (potential) styles function asks as param an
// Array<TransitionPlainStyle>, where each TransitionPlainStyle is of the format
// {key: string, data?: any, style: PlainStyle}. However, the way we keep
// internal states doesn't contain such a data structure (check the state and
// TransitionMotionState). So when children function and others ask for such
// data we need to generate them on the fly by combining mergedPropsStyles and
// currentStyles/lastIdealStyles
function rehydrateStyles(mergedPropsStyles, unreadPropStyles, plainStyles) {
  // Copy the value to a `const` so that Flow understands that the const won't
  // change and will be non-nullable in the callback below.
  var cUnreadPropStyles = unreadPropStyles;
  if (cUnreadPropStyles == null) {
    return mergedPropsStyles.map(function (mergedPropsStyle, i) {
      return {
        key: mergedPropsStyle.key,
        data: mergedPropsStyle.data,
        style: plainStyles[i]
      };
    });
  }
  return mergedPropsStyles.map(function (mergedPropsStyle, i) {
    for (var j = 0; j < cUnreadPropStyles.length; j++) {
      if (cUnreadPropStyles[j].key === mergedPropsStyle.key) {
        return {
          key: cUnreadPropStyles[j].key,
          data: cUnreadPropStyles[j].data,
          style: plainStyles[i]
        };
      }
    }
    return { key: mergedPropsStyle.key, data: mergedPropsStyle.data, style: plainStyles[i] };
  });
}

function shouldStopAnimationAll(currentStyles, destStyles, currentVelocities, mergedPropsStyles) {
  if (mergedPropsStyles.length !== destStyles.length) {
    return false;
  }

  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (mergedPropsStyles[i].key !== destStyles[i].key) {
      return false;
    }
  }

  // we have the invariant that mergedPropsStyles and
  // currentStyles/currentVelocities/last* are synced in terms of cells, see
  // mergeAndSync comment for more info
  for (var i = 0; i < mergedPropsStyles.length; i++) {
    if (!_shouldStopAnimation2['default'](currentStyles[i], destStyles[i].style, currentVelocities[i])) {
      return false;
    }
  }

  return true;
}

// core key merging logic

// things to do: say previously merged style is {a, b}, dest style (prop) is {b,
// c}, previous current (interpolating) style is {a, b}
// **invariant**: current[i] corresponds to merged[i] in terms of key

// steps:
// turn merged style into {a?, b, c}
//    add c, value of c is destStyles.c
//    maybe remove a, aka call willLeave(a), then merged is either {b, c} or {a, b, c}
// turn current (interpolating) style from {a, b} into {a?, b, c}
//    maybe remove a
//    certainly add c, value of c is willEnter(c)
// loop over merged and construct new current
// dest doesn't change, that's owner's
function mergeAndSync(willEnter, willLeave, didLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldLastIdealStyles, oldLastIdealVelocities) {
  var newMergedPropsStyles = _mergeDiff2['default'](oldMergedPropsStyles, destStyles, function (oldIndex, oldMergedPropsStyle) {
    var leavingStyle = willLeave(oldMergedPropsStyle);
    if (leavingStyle == null) {
      didLeave({ key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data });
      return null;
    }
    if (_shouldStopAnimation2['default'](oldCurrentStyles[oldIndex], leavingStyle, oldCurrentVelocities[oldIndex])) {
      didLeave({ key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data });
      return null;
    }
    return { key: oldMergedPropsStyle.key, data: oldMergedPropsStyle.data, style: leavingStyle };
  });

  var newCurrentStyles = [];
  var newCurrentVelocities = [];
  var newLastIdealStyles = [];
  var newLastIdealVelocities = [];
  for (var i = 0; i < newMergedPropsStyles.length; i++) {
    var newMergedPropsStyleCell = newMergedPropsStyles[i];
    var foundOldIndex = null;
    for (var j = 0; j < oldMergedPropsStyles.length; j++) {
      if (oldMergedPropsStyles[j].key === newMergedPropsStyleCell.key) {
        foundOldIndex = j;
        break;
      }
    }
    // TODO: key search code
    if (foundOldIndex == null) {
      var plainStyle = willEnter(newMergedPropsStyleCell);
      newCurrentStyles[i] = plainStyle;
      newLastIdealStyles[i] = plainStyle;

      var velocity = _mapToZero2['default'](newMergedPropsStyleCell.style);
      newCurrentVelocities[i] = velocity;
      newLastIdealVelocities[i] = velocity;
    } else {
      newCurrentStyles[i] = oldCurrentStyles[foundOldIndex];
      newLastIdealStyles[i] = oldLastIdealStyles[foundOldIndex];
      newCurrentVelocities[i] = oldCurrentVelocities[foundOldIndex];
      newLastIdealVelocities[i] = oldLastIdealVelocities[foundOldIndex];
    }
  }

  return [newMergedPropsStyles, newCurrentStyles, newCurrentVelocities, newLastIdealStyles, newLastIdealVelocities];
}

var TransitionMotion = (function (_React$Component) {
  _inherits(TransitionMotion, _React$Component);

  _createClass(TransitionMotion, null, [{
    key: 'propTypes',
    value: {
      defaultStyles: _propTypes2['default'].arrayOf(_propTypes2['default'].shape({
        key: _propTypes2['default'].string.isRequired,
        data: _propTypes2['default'].any,
        style: _propTypes2['default'].objectOf(_propTypes2['default'].number).isRequired
      })),
      styles: _propTypes2['default'].oneOfType([_propTypes2['default'].func, _propTypes2['default'].arrayOf(_propTypes2['default'].shape({
        key: _propTypes2['default'].string.isRequired,
        data: _propTypes2['default'].any,
        style: _propTypes2['default'].objectOf(_propTypes2['default'].oneOfType([_propTypes2['default'].number, _propTypes2['default'].object])).isRequired
      }))]).isRequired,
      children: _propTypes2['default'].func.isRequired,
      willEnter: _propTypes2['default'].func,
      willLeave: _propTypes2['default'].func,
      didLeave: _propTypes2['default'].func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      willEnter: function willEnter(styleThatEntered) {
        return _stripStyle2['default'](styleThatEntered.style);
      },
      // recall: returning null makes the current unmounting TransitionStyle
      // disappear immediately
      willLeave: function willLeave() {
        return null;
      },
      didLeave: function didLeave() {}
    },
    enumerable: true
  }]);

  function TransitionMotion(props) {
    var _this = this;

    _classCallCheck(this, TransitionMotion);

    _React$Component.call(this, props);
    this.unmounting = false;
    this.animationID = null;
    this.prevTime = 0;
    this.accumulatedTime = 0;
    this.unreadPropStyles = null;

    this.clearUnreadPropStyle = function (unreadPropStyles) {
      var _mergeAndSync = mergeAndSync(_this.props.willEnter, _this.props.willLeave, _this.props.didLeave, _this.state.mergedPropsStyles, unreadPropStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

      var mergedPropsStyles = _mergeAndSync[0];
      var currentStyles = _mergeAndSync[1];
      var currentVelocities = _mergeAndSync[2];
      var lastIdealStyles = _mergeAndSync[3];
      var lastIdealVelocities = _mergeAndSync[4];

      for (var i = 0; i < unreadPropStyles.length; i++) {
        var unreadPropStyle = unreadPropStyles[i].style;
        var dirty = false;

        for (var key in unreadPropStyle) {
          if (!Object.prototype.hasOwnProperty.call(unreadPropStyle, key)) {
            continue;
          }

          var styleValue = unreadPropStyle[key];
          if (typeof styleValue === 'number') {
            if (!dirty) {
              dirty = true;
              currentStyles[i] = _extends({}, currentStyles[i]);
              currentVelocities[i] = _extends({}, currentVelocities[i]);
              lastIdealStyles[i] = _extends({}, lastIdealStyles[i]);
              lastIdealVelocities[i] = _extends({}, lastIdealVelocities[i]);
              mergedPropsStyles[i] = {
                key: mergedPropsStyles[i].key,
                data: mergedPropsStyles[i].data,
                style: _extends({}, mergedPropsStyles[i].style)
              };
            }
            currentStyles[i][key] = styleValue;
            currentVelocities[i][key] = 0;
            lastIdealStyles[i][key] = styleValue;
            lastIdealVelocities[i][key] = 0;
            mergedPropsStyles[i].style[key] = styleValue;
          }
        }
      }

      // unlike the other 2 components, we can't detect staleness and optionally
      // opt out of setState here. each style object's data might contain new
      // stuff we're not/cannot compare
      _this.setState({
        currentStyles: currentStyles,
        currentVelocities: currentVelocities,
        mergedPropsStyles: mergedPropsStyles,
        lastIdealStyles: lastIdealStyles,
        lastIdealVelocities: lastIdealVelocities
      });
    };

    this.startAnimationIfNecessary = function () {
      if (_this.unmounting) {
        return;
      }

      // TODO: when config is {a: 10} and dest is {a: 10} do we raf once and
      // call cb? No, otherwise accidental parent rerender causes cb trigger
      _this.animationID = _raf2['default'](function (timestamp) {
        // https://github.com/chenglou/react-motion/pull/420
        // > if execution passes the conditional if (this.unmounting), then
        // executes async defaultRaf and after that component unmounts and after
        // that the callback of defaultRaf is called, then setState will be called
        // on unmounted component.
        if (_this.unmounting) {
          return;
        }

        var propStyles = _this.props.styles;
        var destStyles = typeof propStyles === 'function' ? propStyles(rehydrateStyles(_this.state.mergedPropsStyles, _this.unreadPropStyles, _this.state.lastIdealStyles)) : propStyles;

        // check if we need to animate in the first place
        if (shouldStopAnimationAll(_this.state.currentStyles, destStyles, _this.state.currentVelocities, _this.state.mergedPropsStyles)) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.accumulatedTime = 0;
          return;
        }

        var currentTime = timestamp || _performanceNow2['default']();
        var timeDelta = currentTime - _this.prevTime;
        _this.prevTime = currentTime;
        _this.accumulatedTime = _this.accumulatedTime + timeDelta;
        // more than 10 frames? prolly switched browser tab. Restart
        if (_this.accumulatedTime > msPerFrame * 10) {
          _this.accumulatedTime = 0;
        }

        if (_this.accumulatedTime === 0) {
          // no need to cancel animationID here; shouldn't have any in flight
          _this.animationID = null;
          _this.startAnimationIfNecessary();
          return;
        }

        var currentFrameCompletion = (_this.accumulatedTime - Math.floor(_this.accumulatedTime / msPerFrame) * msPerFrame) / msPerFrame;
        var framesToCatchUp = Math.floor(_this.accumulatedTime / msPerFrame);

        var _mergeAndSync2 = mergeAndSync(_this.props.willEnter, _this.props.willLeave, _this.props.didLeave, _this.state.mergedPropsStyles, destStyles, _this.state.currentStyles, _this.state.currentVelocities, _this.state.lastIdealStyles, _this.state.lastIdealVelocities);

        var newMergedPropsStyles = _mergeAndSync2[0];
        var newCurrentStyles = _mergeAndSync2[1];
        var newCurrentVelocities = _mergeAndSync2[2];
        var newLastIdealStyles = _mergeAndSync2[3];
        var newLastIdealVelocities = _mergeAndSync2[4];

        for (var i = 0; i < newMergedPropsStyles.length; i++) {
          var newMergedPropsStyle = newMergedPropsStyles[i].style;
          var newCurrentStyle = {};
          var newCurrentVelocity = {};
          var newLastIdealStyle = {};
          var newLastIdealVelocity = {};

          for (var key in newMergedPropsStyle) {
            if (!Object.prototype.hasOwnProperty.call(newMergedPropsStyle, key)) {
              continue;
            }

            var styleValue = newMergedPropsStyle[key];
            if (typeof styleValue === 'number') {
              newCurrentStyle[key] = styleValue;
              newCurrentVelocity[key] = 0;
              newLastIdealStyle[key] = styleValue;
              newLastIdealVelocity[key] = 0;
            } else {
              var newLastIdealStyleValue = newLastIdealStyles[i][key];
              var newLastIdealVelocityValue = newLastIdealVelocities[i][key];
              for (var j = 0; j < framesToCatchUp; j++) {
                var _stepper = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

                newLastIdealStyleValue = _stepper[0];
                newLastIdealVelocityValue = _stepper[1];
              }

              var _stepper2 = _stepper4['default'](msPerFrame / 1000, newLastIdealStyleValue, newLastIdealVelocityValue, styleValue.val, styleValue.stiffness, styleValue.damping, styleValue.precision);

              var nextIdealX = _stepper2[0];
              var nextIdealV = _stepper2[1];

              newCurrentStyle[key] = newLastIdealStyleValue + (nextIdealX - newLastIdealStyleValue) * currentFrameCompletion;
              newCurrentVelocity[key] = newLastIdealVelocityValue + (nextIdealV - newLastIdealVelocityValue) * currentFrameCompletion;
              newLastIdealStyle[key] = newLastIdealStyleValue;
              newLastIdealVelocity[key] = newLastIdealVelocityValue;
            }
          }

          newLastIdealStyles[i] = newLastIdealStyle;
          newLastIdealVelocities[i] = newLastIdealVelocity;
          newCurrentStyles[i] = newCurrentStyle;
          newCurrentVelocities[i] = newCurrentVelocity;
        }

        _this.animationID = null;
        // the amount we're looped over above
        _this.accumulatedTime -= framesToCatchUp * msPerFrame;

        _this.setState({
          currentStyles: newCurrentStyles,
          currentVelocities: newCurrentVelocities,
          lastIdealStyles: newLastIdealStyles,
          lastIdealVelocities: newLastIdealVelocities,
          mergedPropsStyles: newMergedPropsStyles
        });

        _this.unreadPropStyles = null;

        _this.startAnimationIfNecessary();
      });
    };

    this.state = this.defaultState();
  }

  TransitionMotion.prototype.defaultState = function defaultState() {
    var _props = this.props;
    var defaultStyles = _props.defaultStyles;
    var styles = _props.styles;
    var willEnter = _props.willEnter;
    var willLeave = _props.willLeave;
    var didLeave = _props.didLeave;

    var destStyles = typeof styles === 'function' ? styles(defaultStyles) : styles;

    // this is special. for the first time around, we don't have a comparison
    // between last (no last) and current merged props. we'll compute last so:
    // say default is {a, b} and styles (dest style) is {b, c}, we'll
    // fabricate last as {a, b}
    var oldMergedPropsStyles = undefined;
    if (defaultStyles == null) {
      oldMergedPropsStyles = destStyles;
    } else {
      oldMergedPropsStyles = defaultStyles.map(function (defaultStyleCell) {
        // TODO: key search code
        for (var i = 0; i < destStyles.length; i++) {
          if (destStyles[i].key === defaultStyleCell.key) {
            return destStyles[i];
          }
        }
        return defaultStyleCell;
      });
    }
    var oldCurrentStyles = defaultStyles == null ? destStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _stripStyle2['default'](s.style);
    });
    var oldCurrentVelocities = defaultStyles == null ? destStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    }) : defaultStyles.map(function (s) {
      return _mapToZero2['default'](s.style);
    });

    var _mergeAndSync3 = mergeAndSync(
    // Because this is an old-style createReactClass component, Flow doesn't
    // understand that the willEnter and willLeave props have default values
    // and will always be present.
    willEnter, willLeave, didLeave, oldMergedPropsStyles, destStyles, oldCurrentStyles, oldCurrentVelocities, oldCurrentStyles, // oldLastIdealStyles really
    oldCurrentVelocities);

    var mergedPropsStyles = _mergeAndSync3[0];
    var currentStyles = _mergeAndSync3[1];
    var currentVelocities = _mergeAndSync3[2];
    var lastIdealStyles = _mergeAndSync3[3];
    var lastIdealVelocities = _mergeAndSync3[4];
    // oldLastIdealVelocities really

    return {
      currentStyles: currentStyles,
      currentVelocities: currentVelocities,
      lastIdealStyles: lastIdealStyles,
      lastIdealVelocities: lastIdealVelocities,
      mergedPropsStyles: mergedPropsStyles
    };
  };

  // after checking for unreadPropStyles != null, we manually go set the
  // non-interpolating values (those that are a number, without a spring
  // config)

  TransitionMotion.prototype.componentDidMount = function componentDidMount() {
    this.prevTime = _performanceNow2['default']();
    this.startAnimationIfNecessary();
  };

  TransitionMotion.prototype.componentWillReceiveProps = function componentWillReceiveProps(props) {
    if (this.unreadPropStyles) {
      // previous props haven't had the chance to be set yet; set them here
      this.clearUnreadPropStyle(this.unreadPropStyles);
    }

    var styles = props.styles;
    if (typeof styles === 'function') {
      this.unreadPropStyles = styles(rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.lastIdealStyles));
    } else {
      this.unreadPropStyles = styles;
    }

    if (this.animationID == null) {
      this.prevTime = _performanceNow2['default']();
      this.startAnimationIfNecessary();
    }
  };

  TransitionMotion.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unmounting = true;
    if (this.animationID != null) {
      _raf2['default'].cancel(this.animationID);
      this.animationID = null;
    }
  };

  TransitionMotion.prototype.render = function render() {
    var hydratedStyles = rehydrateStyles(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.currentStyles);
    var renderedChildren = this.props.children(hydratedStyles);
    return renderedChildren && _react2['default'].Children.only(renderedChildren);
  };

  return TransitionMotion;
})(_react2['default'].Component);

exports['default'] = TransitionMotion;
module.exports = exports['default'];

// list of styles, each containing interpolating values. Part of what's passed
// to children function. Notice that this is
// Array<ActualInterpolatingStyleObject>, without the wrapper that is {key: ...,
// data: ... style: ActualInterpolatingStyleObject}. Only mergedPropsStyles
// contains the key & data info (so that we only have a single source of truth
// for these, and to save space). Check the comment for `rehydrateStyles` to
// see how we regenerate the entirety of what's passed to children function

// the array that keeps track of currently rendered stuff! Including stuff
// that you've unmounted but that's still animating. This is where it lives

// it's possible that currentStyle's value is stale: if props is immediately
// changed from 0 to 400 to spring(0) again, the async currentStyle is still
// at 0 (didn't have time to tick and interpolate even once). If we naively
// compare currentStyle with destVal it'll be 0 === 0 (no animation, stop).
// In reality currentStyle should be 400
},{"./mapToZero":22,"./mergeDiff":23,"./shouldStopAnimation":27,"./stepper":29,"./stripStyle":30,"performance-now":6,"prop-types":10,"raf":12,"react":"react"}],22:[function(require,module,exports){


// currently used to initiate the velocity style object to 0
'use strict';

exports.__esModule = true;
exports['default'] = mapToZero;

function mapToZero(obj) {
  var ret = {};
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      ret[key] = 0;
    }
  }
  return ret;
}

module.exports = exports['default'];
},{}],23:[function(require,module,exports){


// core keys merging algorithm. If previous render's keys are [a, b], and the
// next render's [c, b, d], what's the final merged keys and ordering?

// - c and a must both be before b
// - b before d
// - ordering between a and c ambiguous

// this reduces to merging two partially ordered lists (e.g. lists where not
// every item has a definite ordering, like comparing a and c above). For the
// ambiguous ordering we deterministically choose to place the next render's
// item after the previous'; so c after a

// this is called a topological sorting. Except the existing algorithms don't
// work well with js bc of the amount of allocation, and isn't optimized for our
// current use-case bc the runtime is linear in terms of edges (see wiki for
// meaning), which is huge when two lists have many common elements
'use strict';

exports.__esModule = true;
exports['default'] = mergeDiff;

function mergeDiff(prev, next, onRemove) {
  // bookkeeping for easier access of a key's index below. This is 2 allocations +
  // potentially triggering chrome hash map mode for objs (so it might be faster

  var prevKeyIndex = {};
  for (var i = 0; i < prev.length; i++) {
    prevKeyIndex[prev[i].key] = i;
  }
  var nextKeyIndex = {};
  for (var i = 0; i < next.length; i++) {
    nextKeyIndex[next[i].key] = i;
  }

  // first, an overly elaborate way of merging prev and next, eliminating
  // duplicates (in terms of keys). If there's dupe, keep the item in next).
  // This way of writing it saves allocations
  var ret = [];
  for (var i = 0; i < next.length; i++) {
    ret[i] = next[i];
  }
  for (var i = 0; i < prev.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(nextKeyIndex, prev[i].key)) {
      // this is called my TM's `mergeAndSync`, which calls willLeave. We don't
      // merge in keys that the user desires to kill
      var fill = onRemove(i, prev[i]);
      if (fill != null) {
        ret.push(fill);
      }
    }
  }

  // now all the items all present. Core sorting logic to have the right order
  return ret.sort(function (a, b) {
    var nextOrderA = nextKeyIndex[a.key];
    var nextOrderB = nextKeyIndex[b.key];
    var prevOrderA = prevKeyIndex[a.key];
    var prevOrderB = prevKeyIndex[b.key];

    if (nextOrderA != null && nextOrderB != null) {
      // both keys in next
      return nextKeyIndex[a.key] - nextKeyIndex[b.key];
    } else if (prevOrderA != null && prevOrderB != null) {
      // both keys in prev
      return prevKeyIndex[a.key] - prevKeyIndex[b.key];
    } else if (nextOrderA != null) {
      // key a in next, key b in prev

      // how to determine the order between a and b? We find a "pivot" (term
      // abuse), a key present in both prev and next, that is sandwiched between
      // a and b. In the context of our above example, if we're comparing a and
      // d, b's (the only) pivot
      for (var i = 0; i < next.length; i++) {
        var pivot = next[i].key;
        if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
          continue;
        }

        if (nextOrderA < nextKeyIndex[pivot] && prevOrderB > prevKeyIndex[pivot]) {
          return -1;
        } else if (nextOrderA > nextKeyIndex[pivot] && prevOrderB < prevKeyIndex[pivot]) {
          return 1;
        }
      }
      // pluggable. default to: next bigger than prev
      return 1;
    }
    // prevOrderA, nextOrderB
    for (var i = 0; i < next.length; i++) {
      var pivot = next[i].key;
      if (!Object.prototype.hasOwnProperty.call(prevKeyIndex, pivot)) {
        continue;
      }
      if (nextOrderB < nextKeyIndex[pivot] && prevOrderA > prevKeyIndex[pivot]) {
        return 1;
      } else if (nextOrderB > nextKeyIndex[pivot] && prevOrderA < prevKeyIndex[pivot]) {
        return -1;
      }
    }
    // pluggable. default to: next bigger than prev
    return -1;
  });
}

module.exports = exports['default'];
// to loop through and find a key's index each time), but I no longer care
},{}],24:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports["default"] = {
  noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
  gentle: { stiffness: 120, damping: 14 },
  wobbly: { stiffness: 180, damping: 12 },
  stiff: { stiffness: 210, damping: 20 }
};
module.exports = exports["default"];
},{}],25:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _Motion = require('./Motion');

exports.Motion = _interopRequire(_Motion);

var _StaggeredMotion = require('./StaggeredMotion');

exports.StaggeredMotion = _interopRequire(_StaggeredMotion);

var _TransitionMotion = require('./TransitionMotion');

exports.TransitionMotion = _interopRequire(_TransitionMotion);

var _spring = require('./spring');

exports.spring = _interopRequire(_spring);

var _presets = require('./presets');

exports.presets = _interopRequire(_presets);

var _stripStyle = require('./stripStyle');

exports.stripStyle = _interopRequire(_stripStyle);

// deprecated, dummy warning function

var _reorderKeys = require('./reorderKeys');

exports.reorderKeys = _interopRequire(_reorderKeys);
},{"./Motion":19,"./StaggeredMotion":20,"./TransitionMotion":21,"./presets":24,"./reorderKeys":26,"./spring":28,"./stripStyle":30}],26:[function(require,module,exports){
(function (process){
'use strict';

exports.__esModule = true;
exports['default'] = reorderKeys;

var hasWarned = false;

function reorderKeys() {
  if (process.env.NODE_ENV === 'development') {
    if (!hasWarned) {
      hasWarned = true;
      console.error('`reorderKeys` has been removed, since it is no longer needed for TransitionMotion\'s new styles array API.');
    }
  }
}

module.exports = exports['default'];
}).call(this,require('_process'))

},{"_process":1}],27:[function(require,module,exports){


// usage assumption: currentStyle values have already been rendered but it says
// nothing of whether currentStyle is stale (see unreadPropStyle)
'use strict';

exports.__esModule = true;
exports['default'] = shouldStopAnimation;

function shouldStopAnimation(currentStyle, style, currentVelocity) {
  for (var key in style) {
    if (!Object.prototype.hasOwnProperty.call(style, key)) {
      continue;
    }

    if (currentVelocity[key] !== 0) {
      return false;
    }

    var styleValue = typeof style[key] === 'number' ? style[key] : style[key].val;
    // stepper will have already taken care of rounding precision errors, so
    // won't have such thing as 0.9999 !=== 1
    if (currentStyle[key] !== styleValue) {
      return false;
    }
  }

  return true;
}

module.exports = exports['default'];
},{}],28:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = spring;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _presets = require('./presets');

var _presets2 = _interopRequireDefault(_presets);

var defaultConfig = _extends({}, _presets2['default'].noWobble, {
  precision: 0.01
});

function spring(val, config) {
  return _extends({}, defaultConfig, config, { val: val });
}

module.exports = exports['default'];
},{"./presets":24}],29:[function(require,module,exports){


// stepper is used a lot. Saves allocation to return the same array wrapper.
// This is fine and danger-free against mutations because the callsite
// immediately destructures it and gets the numbers inside without passing the
"use strict";

exports.__esModule = true;
exports["default"] = stepper;

var reusedTuple = [0, 0];

function stepper(secondPerFrame, x, v, destX, k, b, precision) {
  // Spring stiffness, in kg / s^2

  // for animations, destX is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  var Fspring = -k * (x - destX);

  // Damping, in kg / s
  var Fdamper = -b * v;

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass;
  var a = Fspring + Fdamper;

  var newV = v + a * secondPerFrame;
  var newX = x + newV * secondPerFrame;

  if (Math.abs(newV) < precision && Math.abs(newX - destX) < precision) {
    reusedTuple[0] = destX;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newX;
  reusedTuple[1] = newV;
  return reusedTuple;
}

module.exports = exports["default"];
// array reference around.
},{}],30:[function(require,module,exports){

// turn {x: {val: 1, stiffness: 1, damping: 2}, y: 2} generated by
// `{x: spring(1, {stiffness: 1, damping: 2}), y: 2}` into {x: 1, y: 2}

'use strict';

exports.__esModule = true;
exports['default'] = stripStyle;

function stripStyle(style) {
  var ret = {};
  for (var key in style) {
    if (!Object.prototype.hasOwnProperty.call(style, key)) {
      continue;
    }
    ret[key] = typeof style[key] === 'number' ? style[key] : style[key].val;
  }
  return ret;
}

module.exports = exports['default'];
},{}],31:[function(require,module,exports){
var raf = require('rafl')
var E_NOSCROLL = new Error('Element already at target scroll position')
var E_CANCELLED = new Error('Scroll cancelled')
var min = Math.min

module.exports = {
  left: make('scrollLeft'),
  top: make('scrollTop')
}

function make (prop) {
  return function scroll (el, to, opts, cb) {
    opts = opts || {}

    if (typeof opts == 'function') cb = opts, opts = {}
    if (typeof cb != 'function') cb = noop

    var start = +new Date
    var from = el[prop]
    var ease = opts.ease || inOutSine
    var duration = !isNaN(opts.duration) ? +opts.duration : 350
    var cancelled = false

    return from === to ?
      cb(E_NOSCROLL, el[prop]) :
      raf(animate), cancel

    function cancel () {
      cancelled = true
    }

    function animate (timestamp) {
      if (cancelled) return cb(E_CANCELLED, el[prop])

      var now = +new Date
      var time = min(1, ((now - start) / duration))
      var eased = ease(time)

      el[prop] = (eased * (to - from)) + from

      time < 1 ? raf(animate) : raf(function () {
        cb(null, el[prop])
      })
    }
  }
}

function inOutSine (n) {
  return 0.5 * (1 - Math.cos(Math.PI * n))
}

function noop () {}

},{"rafl":14}],32:[function(require,module,exports){
"use strict";

/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

//export const onSave = () => console.log("In HOC actions onSave ")

},{}],33:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

// EDITOR actions
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var EDITOR_SET_ACTIVE_TAB = 'EDITOR_SET_ACTIVE_TAB';
exports.EDITOR_SET_ACTIVE_TAB = EDITOR_SET_ACTIVE_TAB;
var editorSetActiveTab = function editorSetActiveTab(activeTabId) {
    return {
        type: EDITOR_SET_ACTIVE_TAB,
        activeTabId: activeTabId
    };
};

exports.editorSetActiveTab = editorSetActiveTab;
var EDITOR_MODIFY = 'EDITOR_MODIFY';
exports.EDITOR_MODIFY = EDITOR_MODIFY;
var editorModify = function editorModify(data) {
    return _extends({
        type: EDITOR_MODIFY
    }, data);
};

exports.editorModify = editorModify;
// TABS action
var TAB_CREATE = 'TAB_CREATE';
exports.TAB_CREATE = TAB_CREATE;
var tabCreate = function tabCreate(data) {
    return _extends({
        type: TAB_CREATE
    }, data);
};

exports.tabCreate = tabCreate;
var TAB_MODIFY = 'TAB_MODIFY';
exports.TAB_MODIFY = TAB_MODIFY;
var tabModify = function tabModify(data) {
    return _extends({
        type: TAB_MODIFY
    }, data);
};

exports.tabModify = tabModify;
var TAB_ADD_CONTROLS = 'TAB_ADD_CONTROLS';
exports.TAB_ADD_CONTROLS = TAB_ADD_CONTROLS;
var tabAddControls = function tabAddControls(data) {
    return _extends({
        type: TAB_ADD_CONTROLS
    }, data);
};

exports.tabAddControls = tabAddControls;
var TAB_DELETE = 'TAB_DELETE';
exports.TAB_DELETE = TAB_DELETE;
var tabDelete = function tabDelete(id) {
    return {
        type: TAB_DELETE,
        id: id
    };
};

exports.tabDelete = tabDelete;
var TAB_DELETE_ALL = 'TAB_DELETE_ALL';
exports.TAB_DELETE_ALL = TAB_DELETE_ALL;
var tabDeleteAll = function tabDeleteAll() {
    return {
        type: TAB_DELETE_ALL
    };
};
exports.tabDeleteAll = tabDeleteAll;

},{}],34:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;

var _utils = require('../utils');

// Actions definitions
var onLocate = function onLocate(_ref) {
    var node = _ref.node;

    var editors = pydio.Registry.findEditorsForMime("ol_layer");

    if (editors.length) {
        pydio.UI.openCurrentSelectionInEditor(editors[0], node);
    }
};
exports.onLocate = onLocate;

},{"../utils":38}],35:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;

var _utils = require('../utils');

var onToggleResolution = function onToggleResolution(_ref) {
  var dispatch = _ref.dispatch;
  var resolution = _ref.resolution;
  return dispatch(_utils.EditorActions.editorModify({ resolution: resolution === "hi" ? "lo" : "hi" }));
};
exports.onToggleResolution = onToggleResolution;

},{"../utils":38}],36:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

// Actions definitions
var onSelectionChange = function onSelectionChange(_ref) {
  var dispatch = _ref.dispatch;
  var tab = _ref.tab;
  return function (node) {
    return dispatch(_utils.EditorActions.tabModify({ id: tab.id, title: node.getLabel(), node: node }));
  };
};
exports.onSelectionChange = onSelectionChange;
var onTogglePlaying = function onTogglePlaying(_ref2) {
  var dispatch = _ref2.dispatch;
  var tab = _ref2.tab;
  return function (playing) {
    return dispatch(_utils.EditorActions.tabModify({ id: tab.id, playing: playing }));
  };
};
exports.onTogglePlaying = onTogglePlaying;

},{"../utils":38}],37:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _utils = require('../utils');

// Actions definitions
var onSizeChange = function onSizeChange(_ref) {
  var dispatch = _ref.dispatch;
  return function (data) {
    return dispatch(_utils.EditorActions.editorModify(data));
  };
};
exports.onSizeChange = onSizeChange;

},{"../utils":38}],38:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _editorActions = require('./editor/actions');

var EditorActions = _interopRequireWildcard(_editorActions);

var _contentActions = require('./content/actions');

var contentActions = _interopRequireWildcard(_contentActions);

var _resolutionActions = require('./resolution/actions');

var resolutionActions = _interopRequireWildcard(_resolutionActions);

var _selectionActions = require('./selection/actions');

var selectionActions = _interopRequireWildcard(_selectionActions);

var _sizeActions = require('./size/actions');

var sizeActions = _interopRequireWildcard(_sizeActions);

var _localisationActions = require('./localisation/actions');

var localisationActions = _interopRequireWildcard(_localisationActions);

exports.EditorActions = EditorActions;

var defaultActions = _extends({}, contentActions, resolutionActions, selectionActions, sizeActions, localisationActions);

// Helper functions
var getActions = function getActions(_ref) {
    var editorData = _ref.editorData;
    return editorData.editorActions && _extends({}, defaultActions, FuncUtils.getFunctionByName(editorData.editorActions, window)) || _extends({}, defaultActions);
};
var handler = function handler(func, props) {
    return getActions(props)[func](props);
};

exports.handler = handler;
var toTitleCase = function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return '' + txt.charAt(0).toUpperCase() + txt.substr(1);
    });
};

exports.toTitleCase = toTitleCase;
var getDisplayName = function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
};

exports.getDisplayName = getDisplayName;
var getRatio = {
    cover: function cover(_ref2) {
        var widthRatio = _ref2.widthRatio;
        var heightRatio = _ref2.heightRatio;
        return Math.max(widthRatio, heightRatio);
    },
    contain: function contain(_ref3) {
        var widthRatio = _ref3.widthRatio;
        var heightRatio = _ref3.heightRatio;
        return Math.min(widthRatio, heightRatio);
    },
    auto: function auto(_ref4) {
        var scale = _ref4.scale;
        return scale;
    }
};

exports.getRatio = getRatio;
var getBoundingRect = function getBoundingRect(element) {

    var style = window.getComputedStyle(element);
    var keys = ["left", "right", "top", "bottom"];

    var margin = keys.reduce(function (current, key) {
        var _extends2;

        return _extends({}, current, (_extends2 = {}, _extends2[key] = parseInt(style['margin-' + key]) || 0, _extends2));
    }, {});
    var padding = keys.reduce(function (current, key) {
        var _extends3;

        return _extends({}, current, (_extends3 = {}, _extends3[key] = parseInt(style['padding-' + key]) || 0, _extends3));
    }, {});
    var border = keys.reduce(function (current, key) {
        var _extends4;

        return _extends({}, current, (_extends4 = {}, _extends4[key] = parseInt(style['border-' + key]) || 0, _extends4));
    }, {});

    var rect = element.getBoundingClientRect();

    var res = {
        left: rect.left - margin.left,
        right: rect.right - margin.right - padding.left - padding.right,
        top: rect.top - margin.top,
        bottom: rect.bottom - margin.bottom - padding.top - padding.bottom - border.bottom
    };

    return _extends({}, res, {
        width: res.right - res.left,
        height: res.bottom - res.top
    });
};
exports.getBoundingRect = getBoundingRect;

},{"./content/actions":32,"./editor/actions":33,"./localisation/actions":34,"./resolution/actions":35,"./selection/actions":36,"./size/actions":37}],39:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;
exports["default"] = {

    childContextTypes: {
        messages: React.PropTypes.object,
        getMessage: React.PropTypes.func
    },

    getChildContext: function getChildContext() {
        var messages = this.props.pydio.MessageHash;
        return {
            messages: messages,
            getMessage: function getMessage(messageId) {
                try {
                    return messages[messageId] || messageId;
                } catch (e) {
                    return messageId;
                }
            }
        };
    }

};
module.exports = exports["default"];

},{}],40:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OpenNodesModel = (function (_Observable) {
    _inherits(OpenNodesModel, _Observable);

    function OpenNodesModel() {
        _classCallCheck(this, OpenNodesModel);

        _Observable.call(this);
        this._openNodes = [];
        this._updatedTitles = new Map();
        pydio.UI.registerEditorOpener(this);
        pydio.observe("repository_list_refreshed", (function () {
            this._openNodes = [];
        }).bind(this));
    }

    OpenNodesModel.getInstance = function getInstance() {
        if (!OpenNodesModel.__INSTANCE) {
            OpenNodesModel.__INSTANCE = new OpenNodesModel();
        }
        return OpenNodesModel.__INSTANCE;
    };

    OpenNodesModel.prototype.openEditorForNode = function openEditorForNode(selectedNode, editorData) {
        this.pushNode(selectedNode, editorData);
    };

    OpenNodesModel.prototype.updateNodeTitle = function updateNodeTitle(object, newTitle) {
        this._updatedTitles.set(object, newTitle);
        this.notify('titlesUpdated');
    };

    OpenNodesModel.prototype.getObjectLabel = function getObjectLabel(object) {
        if (this._updatedTitles.has(object)) {
            return this._updatedTitles.get(object);
        } else {
            return object.node.getLabel();
        }
    };

    OpenNodesModel.prototype.pushNode = function pushNode(node, editorData) {
        var found = false;
        var editorClass = editorData ? editorData.editorClass : null;
        var object = { node: node, editorData: editorData };
        this.notify('willPushNode', object);
        this._openNodes.map(function (o) {
            if (o.node === node && o.editorData && o.editorData.editorClass == editorClass || !o.editorData && !editorClass) {
                found = true;
                object = o;
            }
        });
        if (!found) {
            this._openNodes.push(object);
        }
        this.notify('nodePushed', object);
        this.notify('update', this._openNodes);
    };

    OpenNodesModel.prototype.removeNode = function removeNode(object) {
        this.notify('willRemoveNode', object);
        var index = this._openNodes.indexOf(object);
        if (this._updatedTitles.has(object)) {
            this._updatedTitles['delete'](object);
        }
        this._openNodes = LangUtils.arrayWithout(this._openNodes, index);
        this.notify('nodeRemovedAtIndex', index);
        this.notify('update', this._openNodes);
    };

    OpenNodesModel.prototype.getNodes = function getNodes() {
        return this._openNodes;
    };

    return OpenNodesModel;
})(Observable);

exports['default'] = OpenNodesModel;
module.exports = exports['default'];

},{}],41:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _InfoPanelCard = require('./InfoPanelCard');

var _InfoPanelCard2 = _interopRequireDefault(_InfoPanelCard);

var _Pydio$requireLib = _pydio2['default'].requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib.PydioContextConsumer;

var FileInfoCard = (function (_React$Component) {
    _inherits(FileInfoCard, _React$Component);

    function FileInfoCard() {
        _classCallCheck(this, FileInfoCard);

        _React$Component.apply(this, arguments);
    }

    FileInfoCard.prototype.render = function render() {
        var _props = this.props;
        var node = _props.node;
        var getMessage = _props.getMessage;

        var meta = node.getMetadata();

        var size = meta.get('bytesize');
        var hSize = PathUtils.roundFileSize(parseInt(size));
        var time = meta.get('ajxp_modiftime');
        var date = new Date();
        date.setTime(parseInt(meta.get('ajxp_modiftime')) * 1000);
        var formattedDate = PathUtils.formatModifDate(date);

        var data = [{ key: 'size', label: getMessage('2'), value: hSize }, { key: 'date', label: getMessage('4'), value: formattedDate }];

        var w = meta.get('image_width');
        var h = meta.get('image_height');
        if (w && h) {
            data = [].concat(data, [{ key: 'image', label: getMessage('135'), value: w + 'px X ' + h + 'px' }]);
        }

        return _react2['default'].createElement(_InfoPanelCard2['default'], _extends({}, this.props, {
            identifier: "file-info",
            title: getMessage('341'),
            standardData: data,
            contentStyle: { paddingBottom: 10 },
            icon: 'information-outline',
            iconColor: '#2196f3'
        }));
    };

    return FileInfoCard;
})(_react2['default'].Component);

exports['default'] = FileInfoCard = PydioContextConsumer(FileInfoCard);
exports['default'] = FileInfoCard;
module.exports = exports['default'];

},{"./InfoPanelCard":44,"pydio":"pydio","react":"react"}],42:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InfoPanelCard = require('./InfoPanelCard');

var _InfoPanelCard2 = _interopRequireDefault(_InfoPanelCard);

var _viewsFilePreview = require('../views/FilePreview');

var _viewsFilePreview2 = _interopRequireDefault(_viewsFilePreview);

var GenericInfoCard = (function (_React$Component) {
    _inherits(GenericInfoCard, _React$Component);

    function GenericInfoCard(props) {
        _classCallCheck(this, GenericInfoCard);

        _React$Component.call(this, props);
        this.state = this.build(props);
    }

    GenericInfoCard.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.setState(this.build(nextProps));
    };

    GenericInfoCard.prototype.build = function build(props) {
        var isMultiple = undefined,
            isLeaf = undefined,
            isDir = undefined;

        // Determine if we have a multiple selection or a single
        var node = props.node;
        var nodes = props.nodes;

        if (nodes) {
            isMultiple = true;
        } else if (node) {
            isLeaf = node.isLeaf();
            isDir = !isLeaf;
        } else {
            return { ready: false };
        }
        return {
            isMultiple: isMultiple,
            isLeaf: isLeaf,
            isDir: isDir,
            ready: true
        };
    };

    GenericInfoCard.prototype.render = function render() {

        if (!this.state.ready) {
            return null;
        }

        if (this.state.isMultiple) {
            var nodes = this.props.nodes;
            var more = undefined;
            if (nodes.length > 10) {
                var moreNumber = nodes.length - 10;
                nodes = nodes.slice(0, 10);
                more = _react2['default'].createElement(
                    'div',
                    null,
                    '... and ',
                    moreNumber,
                    ' more.'
                );
            }
            return _react2['default'].createElement(
                _InfoPanelCard2['default'],
                _extends({}, this.props, { primaryToolbars: ["info_panel", "info_panel_share"] }),
                _react2['default'].createElement(
                    'div',
                    { style: { padding: '0' } },
                    nodes.map(function (node) {
                        return _react2['default'].createElement(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', borderBottom: '1px solid #eeeeee' } },
                            _react2['default'].createElement(_viewsFilePreview2['default'], {
                                key: node.getPath(),
                                style: { height: 50, width: 50, fontSize: 25, flexShrink: 0 },
                                node: node,
                                loadThumbnail: true,
                                richPreview: false
                            }),
                            _react2['default'].createElement(
                                'div',
                                { style: { flex: 1, fontSize: 14, marginLeft: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
                                node.getLabel()
                            )
                        );
                    }),
                    more
                )
            );
        } else {
            var processing = !!this.props.node.getMetadata().get('Processing');
            return _react2['default'].createElement(
                _InfoPanelCard2['default'],
                _extends({}, this.props, { primaryToolbars: ["info_panel", "info_panel_share"] }),
                _react2['default'].createElement(_viewsFilePreview2['default'], {
                    key: this.props.node.getPath(),
                    style: { backgroundColor: 'white', height: 200, padding: 0 },
                    node: this.props.node,
                    loadThumbnail: this.state.isLeaf && !processing,
                    richPreview: this.state.isLeaf,
                    processing: processing
                })
            );
        }

        return null;
    };

    return GenericInfoCard;
})(_react2['default'].Component);

exports['default'] = GenericInfoCard;
module.exports = exports['default'];

},{"../views/FilePreview":81,"./InfoPanelCard":44,"react":"react"}],43:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _require$requireLib = require('pydio').requireLib('hoc');

var Animations = _require$requireLib.Animations;
var withVerticalScroll = _require$requireLib.withVerticalScroll;

var originStyles = { translateX: 600 };
var targetStyles = { translateX: 0 };

var Template = function Template(_ref) {
    var id = _ref.id;
    var style = _ref.style;
    var children = _ref.children;

    return _react2['default'].createElement(
        'div',
        { id: id, style: style },
        children
    );
};

/*
Template = compose(
    Animations.makeAsync,
    Animations.makeTransition(originStyles, targetStyles),
)(Template)
*/

var InfoPanel = (function (_React$Component) {
    _inherits(InfoPanel, _React$Component);

    function InfoPanel(props) {
        _classCallCheck(this, InfoPanel);

        _React$Component.call(this, props);

        var initTemplates = ConfigsParser.parseConfigs();
        this._updateExpected = true;

        this.state = {
            templates: initTemplates,
            displayData: this.selectionToTemplates(initTemplates)
        };
    }

    InfoPanel.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return this._updateExpected;
    };

    InfoPanel.prototype.componentDidMount = function componentDidMount() {
        var _this = this;

        var scrollerRefresh = function scrollerRefresh() {
            try {
                _this.context.scrollArea.refresh();
            } catch (e) {}
        };
        this._updateHandler = function () {
            _this._updateExpected = true;
            _this.setState({ displayData: _this.selectionToTemplates() }, function () {
                _this._updateExpected = false;
                if (_this.context.scrollArea) setTimeout(scrollerRefresh, 750);
            });
        };
        this._componentConfigHandler = function () {
            _this._updateExpected = true;
            _this.setState({ templates: ConfigsParser.parseConfigs() }, function () {
                _this._updateExpected = false;
                if (_this.context.scrollArea) setTimeout(scrollerRefresh, 750);
            });
        };

        this.props.pydio.observe("actions_refreshed", this._updateHandler);
        this.props.pydio.observe("selection_reloaded", this._updateHandler);
        this.props.pydio.observe("registry_loaded", this._componentConfigHandler);

        // Trigger contentChange
        if (this.state.displayData && this.state.displayData.TEMPLATES && this.props.onContentChange) {
            this.props.onContentChange(this.state.displayData.TEMPLATES.length);
        }
    };

    InfoPanel.prototype.componentWillUnmount = function componentWillUnmount() {
        this.props.pydio.stopObserving("actions_refreshed", this._updateHandler);
        this.props.pydio.observe("selection_reloaded", this._updateHandler);
        this.props.pydio.stopObserving("registry_loaded", this._componentConfigHandler);
    };

    InfoPanel.prototype.selectionToTemplates = function selectionToTemplates() {
        var initTemplates = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        var refTemplates = initTemplates || this.state.templates;
        var dataModel = this.props.dataModel;

        var selection = dataModel.getSelectedNodes();
        if ((!selection || !selection.length) && dataModel.getContextNode() === dataModel.getRootNode()) {
            selection = [dataModel.getContextNode()];
        }
        var primaryMime = undefined,
            templates = [],
            uniqueNode = undefined;
        var data = {};
        if (!selection || selection.length < 1) {
            primaryMime = 'no_selection';
        } else if (selection.length > 1) {
            primaryMime = 'generic_multiple';
            data.nodes = selection;
        } else {
            uniqueNode = selection[0];
            if (uniqueNode.isLeaf()) {
                primaryMime = 'generic_file';
            } else {
                primaryMime = 'generic_dir';
                if (this.props.dataModel.getRootNode() === uniqueNode) {
                    primaryMime = 'ajxp_root_node';
                }
            }
            data.node = uniqueNode;
        }
        if (refTemplates.has(primaryMime)) {
            templates = templates.concat(refTemplates.get(primaryMime));
        }
        if (uniqueNode) {
            refTemplates.forEach(function (list, mimeName) {
                if (mimeName === primaryMime) return;
                if (mimeName.indexOf('meta:') === 0 && uniqueNode.getMetadata().has(mimeName.substr(5))) {
                    templates = templates.concat(list);
                } else if (uniqueNode.getAjxpMime() === mimeName) {
                    templates = templates.concat(list);
                }
            });
        }

        if (this.props.onContentChange && !initTemplates) {
            this.props.onContentChange(templates.length);
        }
        templates.sort(function (a, b) {
            return a.WEIGHT === b.WEIGHT ? 0 : a.WEIGHT > b.WEIGHT ? 1 : -1;
        });
        return { TEMPLATES: templates, DATA: data };
    };

    InfoPanel.prototype.render = function render() {
        var _this2 = this;

        var templates = this.state.displayData.TEMPLATES.map(function (tpl, i) {
            var component = tpl.COMPONENT;

            var _component$split = component.split('.', 2);

            var namespace = _component$split[0];
            var name = _component$split[1];

            return _react2['default'].createElement(PydioReactUI.AsyncComponent, _extends({}, _this2.state.displayData.DATA, _this2.props, {
                key: "ip_" + component,
                namespace: namespace,
                componentName: name
            }));
        });
        return _react2['default'].createElement(
            Template,
            { style: this.props.style },
            templates
        );
    };

    return InfoPanel;
})(_react2['default'].Component);

InfoPanel.propTypes = {
    dataModel: _react2['default'].PropTypes.instanceOf(PydioDataModel).isRequired,
    pydio: _react2['default'].PropTypes.instanceOf(Pydio).isRequired,
    style: _react2['default'].PropTypes.object
};

InfoPanel.contextTypes = {
    scrollArea: _react2['default'].PropTypes.object
};

exports['default'] = InfoPanel = withVerticalScroll(InfoPanel, { id: "info_panel" });

var ConfigsParser = (function () {
    function ConfigsParser() {
        _classCallCheck(this, ConfigsParser);
    }

    ConfigsParser.parseConfigs = function parseConfigs() {

        var configs = new Map();
        var panelsNodes = XMLUtils.XPathSelectNodes(pydio.getXmlRegistry(), 'client_configs/component_config[@component="InfoPanel"]/infoPanel');
        var panels = new Map();
        panelsNodes.forEach(function (node) {
            if (!node.getAttribute('reactComponent')) {
                return;
            }
            var mimes = node.getAttribute('mime').split(',');
            var component = node.getAttribute('reactComponent');
            mimes.map(function (mime) {
                if (!panels.has(mime)) panels.set(mime, []);
                panels.get(mime).push({
                    COMPONENT: component,
                    THEME: node.getAttribute('theme'),
                    ATTRIBUTES: node.getAttribute('attributes'),
                    WEIGHT: node.getAttribute('weight') ? parseInt(node.getAttribute('weight')) : 0
                });
            });
        });
        return panels;
    };

    return ConfigsParser;
})();

exports['default'] = InfoPanel;
module.exports = exports['default'];

},{"pydio":"pydio","react":"react","redux":"redux"}],44:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var styles = {
    card: {
        backgroundColor: 'white'
    }
};

var CardsStates = {};

/**
 * Default InfoPanel Card
 */

var InfoPanelCard = (function (_React$Component) {
    _inherits(InfoPanelCard, _React$Component);

    function InfoPanelCard(props) {
        _classCallCheck(this, InfoPanelCard);

        _React$Component.call(this, props);
        if (props.identifier && CardsStates[props.identifier] !== undefined) {
            this.state = { open: CardsStates[props.identifier] };
        } else {
            this.state = { open: true };
        }
    }

    InfoPanelCard.prototype.toggle = function toggle() {
        var newState = !this.state.open;
        this.setState({ open: newState });
        if (this.props.identifier) {
            CardsStates[this.props.identifier] = newState;
        }
    };

    InfoPanelCard.prototype.render = function render() {
        var _this = this;

        var open = this.state.open;

        var icon = _react2['default'].createElement(
            'div',
            { className: 'panelIcon', style: { position: 'absolute', right: 2, top: open ? 8 : 2 } },
            _react2['default'].createElement(_materialUi.IconButton, { onClick: function () {
                    _this.toggle();
                }, iconClassName: "mdi mdi-chevron-" + (open ? 'up' : 'down') })
        );

        var openStyle = undefined;
        if (!open) {
            openStyle = { paddingTop: 16 };
        }
        var title = this.props.title ? _react2['default'].createElement(
            _materialUi.Paper,
            { zDepth: 0, className: 'panelHeader', style: _extends({ position: 'relative' }, openStyle) },
            icon,
            this.props.title
        ) : null;
        var actions = this.props.actions ? _react2['default'].createElement(
            'div',
            { className: 'panelActions' },
            this.props.actions
        ) : null;
        var rows = undefined,
            toolBar = undefined;
        if (this.props.standardData) {
            rows = this.props.standardData.map(function (object) {
                return _react2['default'].createElement(
                    'div',
                    { className: 'infoPanelRow', key: object.key },
                    _react2['default'].createElement(
                        'div',
                        { className: 'infoPanelLabel' },
                        object.label
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'infoPanelValue' },
                        object.value
                    )
                );
            });
        }
        if (this.props.primaryToolbars) {
            var themePalette = this.props.muiTheme.palette;
            var tBarStyle = {
                backgroundColor: themePalette.accent2Color,
                justifyContent: 'flex-end',
                position: 'relative'
            };
            toolBar = _react2['default'].createElement(PydioComponents.Toolbar, {
                toolbarStyle: tBarStyle,
                flatButtonStyle: { minWidth: 0 },
                buttonStyle: { color: 'white', paddingRight: 8, paddingLeft: 8 },
                className: 'primaryToolbar',
                renderingType: 'button',
                toolbars: this.props.primaryToolbars,
                controller: this.props.pydio.getController(),
                fabAction: "share_react",
                buttonMenuNoLabel: true,
                buttonMenuPopoverDirection: "right"
            });
        }

        return _react2['default'].createElement(
            _materialUi.Paper,
            { zDepth: 1, className: 'panelCard', style: _extends({}, this.props.style, styles.card) },
            title,
            open && _react2['default'].createElement(
                'div',
                { className: 'panelContent', style: this.props.contentStyle },
                this.props.children,
                rows,
                toolBar
            ),
            open && actions
        );
    };

    return InfoPanelCard;
})(_react2['default'].Component);

InfoPanelCard.PropTypes = {
    identifier: _react2['default'].PropTypes.string,
    title: _react2['default'].PropTypes.string,
    actions: _react2['default'].PropTypes.array
};

exports['default'] = InfoPanelCard = MaterialUI.Style.muiThemeable()(InfoPanelCard);

exports['default'] = InfoPanelCard;
module.exports = exports['default'];

},{"material-ui":"material-ui","react":"react"}],45:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InfoPanelCard = require('./InfoPanelCard');

var _InfoPanelCard2 = _interopRequireDefault(_InfoPanelCard);

exports['default'] = _react2['default'].createClass({
    displayName: 'RootNode',

    getInitialState: function getInitialState() {
        return {
            repoKey: null
        };
    },

    componentDidMount: function componentDidMount() {
        this.loadData(this.props);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.pydio.user && nextProps.pydio.user.activeRepository !== this.state.repoKey) {
            this.loadData(nextProps);
        }
    },

    loadData: function loadData(props) {
        if (!props.pydio.user) {
            return;
        }
        var cacheService = MetaCacheService.getInstance();
        cacheService.registerMetaStream('workspace.info', 'MANUAL_TRIGGER');
        var oThis = this;
        var render = function render(data) {
            oThis.setState(_extends({}, data['core.users']));
        };
        var repoKey = pydio.user.getActiveRepository();
        this.setState({ repoKey: repoKey });
        if (cacheService.hasKey('workspace.info', repoKey)) {
            render(cacheService.getByKey('workspace.info', repoKey));
        } else {
            FuncUtils.bufferCallback("ajxp_load_repo_info_timer", 700, function () {
                if (!oThis.isMounted()) return;
                // Todo: load info about workspace
            });
        }
    },

    render: function render() {
        var messages = this.props.pydio.MessageHash;
        var internal = messages[528];
        var external = messages[530];
        var shared = messages[527];

        var content = undefined,
            panelData = undefined;

        if (this.state && this.state.users) {
            panelData = [{ key: 'internal', label: internal, value: this.state.users }, { key: 'external', label: external, value: this.state.groups }];
        }

        return _react2['default'].createElement(
            _InfoPanelCard2['default'],
            { identifier: "file-info", title: messages[249], style: this.props.style, standardData: panelData, icon: 'account-multiple-outline', iconColor: '00838f' },
            content
        );
    }

});
module.exports = exports['default'];

},{"./InfoPanelCard":44,"react":"react"}],46:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _reactRedux = require('react-redux');

var _componentsEditor = require('./components/editor');

var _componentsMenu = require('./components/menu');

var _makeEditorOpen = require('./make-editor-open');

var _makeEditorOpen2 = _interopRequireDefault(_makeEditorOpen);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

var App = (function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        var _this = this;

        _classCallCheck(this, App);

        _React$Component.call(this, props);

        var editorModify = props.editorModify;
        var editorSetActiveTab = props.editorSetActiveTab;

        editorModify({ open: false });
        editorSetActiveTab(null);

        this.onEditorMinimise = function () {
            return _this.setState({ editorMinimised: !_this.props.displayPanel });
        };

        this.state = {
            editorMinimised: false,
            fullBrowserScreen: pydio.UI.MOBILE_EXTENSIONS || false
        };

        this.onFullBrowserScreen = function () {
            return _this.setState({ fullBrowserScreen: !_this.state.fullBrowserScreen });
        };
    }

    App.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var editorModify = nextProps.editorModify;
        var tabs = nextProps.tabs;
        var displayPanel = nextProps.displayPanel;
        var positionOrigin = nextProps.positionOrigin;
        var positionTarget = nextProps.positionTarget;

        editorModify({ open: tabs.filter(function (_ref) {
                var editorData = _ref.editorData;
                return editorData;
            }).length > 0 });

        if (displayPanel) {

            this.setState({
                editorMinimised: false
            });

            var transformOrigin = "";
            if (positionOrigin && positionTarget) {
                var x = parseInt(positionTarget.left - positionOrigin.left + (positionTarget.right - positionTarget.left) / 2);
                var y = parseInt(positionTarget.top - positionOrigin.top + (positionTarget.bottom - positionTarget.top) / 2);

                this.setState({
                    transformOrigin: x + 'px ' + y + 'px'
                });
            }
        }
    };

    App.prototype.render = function render() {
        var _props = this.props;
        var display = _props.display;
        var displayPanel = _props.displayPanel;
        var _state = this.state;
        var editorMinimised = _state.editorMinimised;
        var fullBrowserScreen = _state.fullBrowserScreen;

        var editorStyle = {
            display: "none"
        };

        var overlayStyle = {
            display: "none"
        };

        if (!editorMinimised) {
            editorStyle = {
                position: "fixed",
                top: fullBrowserScreen ? 0 : "1%",
                left: fullBrowserScreen ? 0 : "1%",
                right: fullBrowserScreen ? 0 : "15%",
                bottom: fullBrowserScreen ? 0 : "1%",
                transformOrigin: this.state.transformOrigin
            };

            overlayStyle = { position: "fixed", top: 0, bottom: 0, right: 0, left: 0, background: "#000000", opacity: "0.5", transition: "opacity .5s ease-in" };
        }

        if (!displayPanel) {
            overlayStyle = { opacity: 0, transition: "opacity .5s ease-in" };
        }

        var menuStyle = {
            position: "fixed",
            bottom: "50px",
            right: "50px",
            cursor: "pointer",
            transform: "translate(50%, 50%)",
            zIndex: 5
        };

        return React.createElement(
            'div',
            null,
            display ? React.createElement('div', { style: overlayStyle }) : null,
            React.createElement(
                AnimationGroup,
                null,
                display ? React.createElement(_componentsEditor.Editor, { style: editorStyle, onFullBrowserScreen: this.onFullBrowserScreen.bind(this), onMinimise: this.onEditorMinimise.bind(this) }) : null,
                display ? React.createElement(_componentsMenu.Menu, { style: menuStyle }) : null
            )
        );
    };

    return App;
})(React.Component);

var Animation = function Animation(props) {
    return React.createElement('div', props);
};

var AnimationGroup = _makeEditorOpen2['default'](Animation);

// REDUX - Then connect the redux store
function mapStateToProps(state, ownProps) {
    var editor = state.editor;
    var tabs = state.tabs;

    return _extends({}, ownProps, {
        tabs: tabs,
        display: editor.open,
        displayPanel: editor.isPanelActive,
        displayMenu: editor.isMenuActive,
        positionOrigin: editor.panel && editor.panel.rect,
        positionTarget: editor.menu && editor.menu.rect
    });
}
var ConnectedApp = _reactRedux.connect(mapStateToProps, EditorActions)(App);

exports['default'] = ConnectedApp;
module.exports = exports['default'];

},{"./components/editor":50,"./components/menu":57,"./make-editor-open":61,"pydio":"pydio","react-redux":"react-redux"}],47:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

// IMPORT
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

//import FullScreen from 'react-fullscreen';

var _reactDraggable = require('react-draggable');

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

var _reactRedux = require('react-redux');

var _materialUi = require('material-ui');

var _EditorTab = require('./EditorTab');

var _EditorTab2 = _interopRequireDefault(_EditorTab);

var _EditorToolbar = require('./EditorToolbar');

var _EditorToolbar2 = _interopRequireDefault(_EditorToolbar);

var _makeMinimise = require('./make-minimise');

var _makeMinimise2 = _interopRequireDefault(_makeMinimise);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

var MAX_ITEMS = 4;

// MAIN COMPONENT

var Editor = (function (_React$Component) {
    _inherits(Editor, _React$Component);

    function Editor(props) {
        var _this = this;

        _classCallCheck(this, Editor);

        _React$Component.call(this, props);

        var tabDelete = props.tabDelete;
        var tabDeleteAll = props.tabDeleteAll;
        var editorModify = props.editorModify;
        var editorSetActiveTab = props.editorSetActiveTab;

        this.state = {
            minimisable: false
        };

        this.minimise = function () {
            return editorModify({ isPanelActive: false });
        };
        this.setFullScreen = function () {
            return editorModify({ fullscreen: typeof (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) !== 'undefined' });
        };

        this.closeActiveTab = function (e) {
            var activeTab = _this.props.activeTab;

            editorSetActiveTab(null);
            tabDelete(activeTab.id);
        };

        this.close = function (e) {
            editorModify({ open: false });
            tabDeleteAll();
        };

        // By default, open it up
        editorModify({ isPanelActive: true });
    }

    Editor.prototype.componentDidMount = function componentDidMount() {
        DOMUtils.observeWindowResize(this.setFullScreen);
    };

    Editor.prototype.componentWillUnmount = function componentWillUnmount() {
        DOMUtils.stopObservingWindowResize(this.setFullScreen);
    };

    Editor.prototype.enterFullScreen = function enterFullScreen() {
        if (this.props.onFullBrowserScreen) {
            this.props.onFullBrowserScreen();
            return;
        }

        if (this.container.requestFullscreen) {
            this.container.requestFullscreen();
        } else if (this.container.mozRequestFullScreen) {
            this.container.mozRequestFullScreen();
        } else if (this.container.webkitRequestFullscreen) {
            this.container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    };

    Editor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

        if (this.state.minimisable) return;

        var translated = nextProps.translated;

        if (!translated) return;

        this.recalculate();

        this.setState({ minimisable: true });
    };

    Editor.prototype.recalculate = function recalculate() {
        var editorModify = this.props.editorModify;

        if (!this.container) return;

        editorModify({
            panel: {
                rect: this.container.getBoundingClientRect()
            }
        });
    };

    Editor.prototype.renderChild = function renderChild() {
        var _props = this.props;
        var activeTab = _props.activeTab;
        var tabs = _props.tabs;
        var editorSetActiveTab = _props.editorSetActiveTab;

        var filteredTabs = tabs.filter(function (_ref) {
            var editorData = _ref.editorData;
            return editorData;
        });

        return filteredTabs.map(function (tab, index) {
            var style = {
                display: "flex",
                width: 100 / MAX_ITEMS + "%",
                height: "40%",
                margin: "10px",
                overflow: "scroll",
                whiteSpace: "nowrap"
            };

            if (filteredTabs.length > MAX_ITEMS) {
                if (index < MAX_ITEMS) {
                    style.flex = 1;
                } else {
                    style.flex = 0;
                    style.margin = 0;
                }
            }

            if (activeTab) {
                if (tab.id === activeTab.id) {
                    style.margin = 0;
                    style.flex = 1;
                } else {
                    style.flex = 0;
                    style.margin = 0;
                }
            }

            return React.createElement(_EditorTab2['default'], { key: 'editortab' + tab.id, id: tab.id, style: _extends({}, style) });
        });
    };

    Editor.prototype.render = function render() {
        var _this2 = this;

        var _props2 = this.props;
        var style = _props2.style;
        var activeTab = _props2.activeTab;
        var isActive = _props2.isActive;
        var displayToolbar = _props2.displayToolbar;
        var minimisable = this.state.minimisable;

        var title = activeTab ? activeTab.title : "";
        var onClose = activeTab ? this.closeActiveTab : this.close;
        var onMinimise = minimisable ? this.minimise : null;
        var onMaximise = this.maximise;

        var parentStyle = {
            display: "flex",
            flex: 1,
            overflow: "hidden",
            width: "100%",
            height: "100%",
            position: "relative"
        };

        if (!activeTab) {
            parentStyle = _extends({}, parentStyle, {
                alignItems: "center", // To fix a bug in Safari, we only set it when height not = 100% (aka when there is no active tab)
                justifyContent: "center"
            });
        }

        return React.createElement(
            'div',
            { style: _extends({ display: "flex" }, style) },
            React.createElement(
                AnimatedPaper,
                { ref: function (container) {
                        return _this2.container = ReactDOM.findDOMNode(container);
                    }, onMinimise: this.props.onMinimise, minimised: !isActive, zDepth: 5, style: { display: "flex", flexDirection: "column", overflow: "hidden", width: "100%", height: "100%", transformOrigin: style.transformOrigin } },
                displayToolbar && React.createElement(_EditorToolbar2['default'], { style: { flexShrink: 0 }, title: title, onClose: onClose, onFullScreen: function () {
                        return _this2.enterFullScreen();
                    }, onMinimise: onMinimise }),
                React.createElement(
                    'div',
                    { className: 'body', style: parentStyle },
                    this.renderChild()
                )
            )
        );
    };

    return Editor;
})(React.Component);

;

// ANIMATIONS
var AnimatedPaper = _makeMinimise2['default'](_materialUi.Paper);

// REDUX - Then connect the redux store
function mapStateToProps(state, ownProps) {
    var editor = state.editor;
    var tabs = state.tabs;

    var activeTab = tabs.filter(function (tab) {
        return tab.id === editor.activeTabId;
    })[0];

    return _extends({
        style: {},
        displayToolbar: !editor.fullscreen
    }, ownProps, {
        activeTab: activeTab,
        tabs: tabs,
        isActive: editor.isPanelActive
    });
}
var ConnectedEditor = _reactRedux.connect(mapStateToProps, EditorActions)(Editor);

// EXPORT
exports['default'] = ConnectedEditor;
module.exports = exports['default'];

},{"./EditorTab":48,"./EditorToolbar":49,"./make-minimise":52,"material-ui":"material-ui","pydio":"pydio","react-draggable":"react-draggable","react-redux":"react-redux"}],48:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _materialUi = require('material-ui');

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _makeMaximise = require('./make-maximise');

var _makeMaximise2 = _interopRequireDefault(_makeMaximise);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;
var ResolutionActions = _Pydio$requireLib.ResolutionActions;
var ContentActions = _Pydio$requireLib.ContentActions;
var SizeActions = _Pydio$requireLib.SizeActions;
var SelectionActions = _Pydio$requireLib.SelectionActions;
var LocalisationActions = _Pydio$requireLib.LocalisationActions;
var withMenu = _Pydio$requireLib.withMenu;

var Tab = (function (_React$Component) {
    _inherits(Tab, _React$Component);

    function Tab() {
        _classCallCheck(this, Tab);

        _React$Component.apply(this, arguments);
    }

    Tab.prototype.renderControls = function renderControls(Controls, Actions) {
        var _props = this.props;
        var node = _props.node;
        var editorData = _props.editorData;
        var SelectionControls = Controls.SelectionControls;
        var ResolutionControls = Controls.ResolutionControls;
        var SizeControls = Controls.SizeControls;
        var ContentControls = Controls.ContentControls;
        var ContentSearchControls = Controls.ContentSearchControls;
        var LocalisationControls = Controls.LocalisationControls;

        var actions = _extends({}, SizeActions, SelectionActions, ResolutionActions, ContentActions, LocalisationActions);

        if (editorData.editorActions) {
            actions = _extends({}, actions, Actions);
        }

        var boundActionCreators = _redux.bindActionCreators(actions);

        var controls = function controls(Controls) {
            return Object.keys(Controls).filter(function (key) {
                return typeof Controls[key] === 'function';
            }).map(function (key) {
                var Control = Controls[key];
                return React.createElement(Control, _extends({ editorData: editorData, node: node }, boundActionCreators));
            });
        };

        return React.createElement(
            _materialUi.Toolbar,
            { style: Tab.styles.toolbar },
            SelectionControls && React.createElement(
                _materialUi.ToolbarGroup,
                null,
                controls(SelectionControls)
            ),
            ResolutionControls && React.createElement(
                _materialUi.ToolbarGroup,
                null,
                controls(ResolutionControls)
            ),
            SizeControls && React.createElement(
                _materialUi.ToolbarGroup,
                null,
                controls(SizeControls)
            ),
            ContentControls && React.createElement(
                _materialUi.ToolbarGroup,
                null,
                controls(ContentControls)
            ),
            ContentSearchControls && React.createElement(
                _materialUi.ToolbarGroup,
                null,
                controls(ContentSearchControls)
            ),
            LocalisationControls && React.createElement(
                _materialUi.ToolbarGroup,
                null,
                controls(LocalisationControls)
            )
        );
    };

    Tab.prototype.render = function render() {
        var _props2 = this.props;
        var node = _props2.node;
        var editorData = _props2.editorData;
        var Editor = _props2.Editor;
        var Controls = _props2.Controls;
        var Actions = _props2.Actions;
        var id = _props2.id;
        var isActive = _props2.isActive;
        var editorSetActiveTab = _props2.editorSetActiveTab;
        var style = _props2.style;

        var select = function select() {
            return editorSetActiveTab(id);
        };

        return !isActive ? React.createElement(
            AnimatedCard,
            { style: style, containerStyle: Tab.styles.container, maximised: isActive, expanded: isActive, onExpandChange: !isActive ? select : null },
            React.createElement(_materialUi.CardHeader, { title: id, actAsExpander: true, showExpandableButton: true }),
            React.createElement(
                _materialUi.CardMedia,
                { style: Tab.styles.child, mediaStyle: Tab.styles.child },
                React.createElement(Editor, { pydio: pydio, node: node, editorData: editorData })
            )
        ) : React.createElement(
            AnimatedCard,
            { style: style, containerStyle: Tab.styles.container, maximised: true, expanded: isActive, onExpandChange: !isActive ? select : null },
            Controls && this.renderControls(Controls, Actions),
            React.createElement(Editor, { pydio: pydio, node: node, editorData: editorData })
        );
    };

    _createClass(Tab, null, [{
        key: 'styles',
        get: function get() {
            return {
                container: {
                    display: "flex",
                    flex: 1,
                    flexFlow: "column nowrap",
                    overflow: "auto"
                },
                child: {
                    display: "flex",
                    flex: 1
                },
                toolbar: {
                    backgroundColor: "#eeeeee",
                    flexShrink: 0
                }
            };
        }
    }]);

    return Tab;
})(React.Component);

function mapStateToProps(state, ownProps) {
    var editor = state.editor;
    var tabs = state.tabs;

    var current = tabs.filter(function (tab) {
        return tab.id === ownProps.id;
    })[0];

    return _extends({}, ownProps, current, {
        isActive: editor.activeTabId === current.id
    });
}

var AnimatedCard = _makeMaximise2['default'](_materialUi.Card);

var EditorTab = _reactRedux.connect(mapStateToProps, EditorActions)(Tab);

exports['default'] = EditorTab;
module.exports = exports['default'];

},{"./make-maximise":51,"material-ui":"material-ui","pydio":"pydio","react-redux":"react-redux","redux":"redux"}],49:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;
var _PydioComponents = PydioComponents;
var ModalAppBar = _PydioComponents.ModalAppBar;

var _require = require('material-ui');

var ToolbarGroup = _require.ToolbarGroup;
var IconButton = _require.IconButton;

// Display components
var EditorToolbar = function EditorToolbar(_ref) {
    var title = _ref.title;
    var className = _ref.className;
    var style = _ref.style;
    var onFullScreen = _ref.onFullScreen;
    var onMinimise = _ref.onMinimise;
    var onClose = _ref.onClose;

    var innerStyle = { color: "#FFFFFF", fill: "#FFFFFF" };

    return React.createElement(ModalAppBar, {
        className: className,
        style: style,
        title: React.createElement(
            "span",
            null,
            title
        ),
        titleStyle: innerStyle,
        iconElementLeft: React.createElement(IconButton, { iconClassName: "mdi mdi-close", iconStyle: innerStyle, disabled: typeof onClose !== "function", touch: true, onTouchTap: onClose }),
        iconElementRight: React.createElement(
            ToolbarGroup,
            null,
            React.createElement(IconButton, { iconClassName: "mdi mdi-window-minimize", iconStyle: innerStyle, disabled: typeof onMinimise !== "function", touch: true, onTouchTap: onMinimise }),
            !pydio.UI.MOBILE_EXTENSIONS && React.createElement(IconButton, { iconClassName: "mdi mdi-window-maximize", iconStyle: innerStyle,
                disabled: typeof onFullScreen !== "function", touch: true, onTouchTap: onFullScreen })
        )
    });
};

exports["default"] = EditorToolbar;
module.exports = exports["default"];

},{"material-ui":"material-ui"}],50:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _Editor = require('./Editor');

exports.Editor = _interopRequire(_Editor);

var _EditorTab = require('./EditorTab');

exports.EditorTab = _interopRequire(_EditorTab);

},{"./Editor":47,"./EditorTab":48}],51:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactMotion = require('react-motion');

var _HOCsUtils = require('../../../../HOCs/utils');

var ANIMATION = { stiffness: 400, damping: 30 };
var TARGET = 100;

var makeMaximise = function makeMaximise(Target) {
    return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
            _classCallCheck(this, _class);

            _React$Component.call(this, props);
            this.state = { maximised: props.maximised };
        }

        _class.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
            this.setState({
                maximised: nextProps.maximised
            });
        };

        _class.prototype.render = function render() {
            var _this = this;

            var maximised = this.state.maximised;

            var motionStyle = {
                width: maximised ? _reactMotion.spring(TARGET, ANIMATION) : _reactMotion.spring(parseInt(this.props.style.width.replace(/%$/, '')), ANIMATION),
                height: maximised ? _reactMotion.spring(TARGET, ANIMATION) : _reactMotion.spring(parseInt(this.props.style.height.replace(/%$/, '')), ANIMATION)
            };

            var _ref = this.props || { style: {} };

            var style = _ref.style;

            return React.createElement(
                _reactMotion.Motion,
                { style: motionStyle },
                function (_ref2) {
                    var width = _ref2.width;
                    var height = _ref2.height;

                    return React.createElement(Target, _extends({}, _this.props, {
                        style: _extends({}, _this.props.style, {
                            width: width + '%',
                            height: height + '%',
                            transition: "none"
                        })
                    }));
                }
            );
        };

        _createClass(_class, null, [{
            key: 'displayName',
            get: function get() {
                return 'MakeMaximise(' + _HOCsUtils.getDisplayName(Target) + ')';
            }
        }]);

        return _class;
    })(React.Component);
};

exports['default'] = makeMaximise;
module.exports = exports['default'];

},{"../../../../HOCs/utils":38,"lodash":3,"react-motion":25}],52:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactMotion = require('react-motion');

var ANIMATION = { stiffness: 300, damping: 40 };
var ORIGIN = 0;
var TARGET = 100;

var makeEditorMinimise = function makeEditorMinimise(Target) {
    return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
            _classCallCheck(this, _class);

            _React$Component.call(this, props);
            this.state = {};
        }

        _class.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
            this.setState({
                minimised: nextProps.minimised
            });
        };

        _class.prototype.render = function render() {
            var _this = this;

            var minimised = this.state.minimised;

            var motionStyle = {
                scale: minimised ? _reactMotion.spring(ORIGIN, ANIMATION) : TARGET
            };

            var transform = this.props.style.transform || "";

            return React.createElement(
                _reactMotion.Motion,
                { style: motionStyle, onRest: this.props.onMinimise },
                function (_ref) {
                    var scale = _ref.scale;

                    var float = scale / 100;

                    return React.createElement(Target, _extends({}, _this.props, {
                        scale: scale,
                        style: _extends({}, _this.props.style, {
                            transition: "none",
                            transform: transform + ' scale(' + float + ')'
                        })
                    }));
                }
            );
        };

        return _class;
    })(React.Component);
};

exports['default'] = makeEditorMinimise;
module.exports = exports['default'];

},{"lodash":3,"react-motion":25}],53:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _reactRedux = require('react-redux');

var _materialUi = require('material-ui');

var _makeRotate = require('./make-rotate');

var _makeRotate2 = _interopRequireDefault(_makeRotate);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

var Button = (function (_React$Component) {
    _inherits(Button, _React$Component);

    function Button() {
        _classCallCheck(this, Button);

        _React$Component.apply(this, arguments);
    }

    Button.prototype.render = function render() {
        var rotated = this.props.rotated;

        var iconClassName = 'mdi mdi-close';
        if (!rotated) {
            iconClassName = 'mdi mdi-animation';
        }

        return React.createElement(_materialUi.FloatingActionButton, _extends({}, this.props, { iconClassName: iconClassName }));
    };

    return Button;
})(React.Component);

;

var AnimatedButton = _makeRotate2['default'](Button);

function mapStateToProps(state, ownProps) {
    var editor = state.editor;

    return _extends({}, editor.menu);
}

var ConnectedButton = _reactRedux.connect(mapStateToProps, EditorActions)(AnimatedButton);

exports['default'] = ConnectedButton;
module.exports = exports['default'];

},{"./make-rotate":59,"material-ui":"material-ui","pydio":"pydio","react-redux":"react-redux"}],54:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _reactRedux = require('react-redux');

var _MainButton = require('./MainButton');

var _MainButton2 = _interopRequireDefault(_MainButton);

var _MenuGroup = require('./MenuGroup');

var _MenuGroup2 = _interopRequireDefault(_MenuGroup);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

// Components

var Menu = (function (_React$Component) {
    _inherits(Menu, _React$Component);

    function Menu(props) {
        var _this = this;

        _classCallCheck(this, Menu);

        _React$Component.call(this, props);

        this.state = {
            ready: false
        };

        var editorModify = props.editorModify;

        this.toggle = function () {
            return editorModify({ isMenuActive: !_this.props.isActive });
        };
        this.recalculate = this.recalculate.bind(this);
    }

    Menu.prototype.componentDidMount = function componentDidMount() {
        window.addEventListener('resize', this.recalculate);
    };

    Menu.prototype.componentWillUnmount = function componentWillUnmount() {
        window.removeEventListener('resize', this.recalculate);
    };

    Menu.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {

        if (this.state.ready) return;

        var translated = nextProps.translated;

        if (!translated) return;

        this.recalculate();

        this.setState({ ready: true });
    };

    Menu.prototype.recalculate = function recalculate() {
        var editorModify = this.props.editorModify;

        var element = ReactDOM.findDOMNode(this.refs.button);

        if (!element) return;

        editorModify({
            menu: {
                rect: element.getBoundingClientRect()
            }
        });
    };

    Menu.prototype.renderChild = function renderChild() {
        var _props = this.props;
        var isActive = _props.isActive;
        var tabs = _props.tabs;

        if (!isActive) return null;

        return tabs.map(function (tab) {
            var style = {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                transition: "transform 0.3s ease-in"
            };

            return React.createElement(_MenuItem2['default'], { key: tab.id, id: tab.id, style: _extends({}, style) });
        });
    };

    Menu.prototype.render = function render() {
        var _props2 = this.props;
        var style = _props2.style;
        var isActive = _props2.isActive;

        return React.createElement(
            'div',
            null,
            React.createElement(
                _MenuGroup2['default'],
                { style: style },
                this.renderChild()
            ),
            React.createElement(_MainButton2['default'], { ref: 'button', open: isActive, style: style, onClick: this.toggle })
        );
    };

    return Menu;
})(React.Component);

;

// REDUX - Then connect the redux store
function mapStateToProps(state, ownProps) {
    var editor = state.editor;
    var tabs = state.tabs;

    var activeTab = tabs.filter(function (tab) {
        return tab.id === editor.activeTabId;
    })[0];

    return _extends({}, editor, {
        activeTab: activeTab,
        tabs: tabs,
        isActive: editor.isMenuActive
    });
}
var ConnectedMenu = _reactRedux.connect(mapStateToProps, EditorActions)(Menu);

// EXPORT
exports['default'] = ConnectedMenu;
module.exports = exports['default'];

},{"./MainButton":53,"./MenuGroup":55,"./MenuItem":56,"pydio":"pydio","react-redux":"react-redux"}],55:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _makeMenuTransition = require('./make-menu-transition');

var _makeMenuTransition2 = _interopRequireDefault(_makeMenuTransition);

var MenuGroup = function MenuGroup(props) {
    return React.createElement(
        'div',
        props,
        props.children
    );
};

var AnimatedMenuGroup = _makeMenuTransition2['default'](MenuGroup);
exports['default'] = AnimatedMenuGroup;
module.exports = exports['default'];

},{"./make-menu-transition":58}],56:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _reactRedux = require('react-redux');

var _materialUi = require('material-ui');

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

var MenuItem = (function (_React$PureComponent) {
    _inherits(MenuItem, _React$PureComponent);

    function MenuItem(props) {
        var _this = this;

        _classCallCheck(this, MenuItem);

        _React$PureComponent.call(this, props);

        var editorSetActiveTab = props.editorSetActiveTab;
        var editorModify = props.editorModify;

        this.onClick = function () {
            editorModify({ isPanelActive: true });
            editorSetActiveTab(_this.props.id);
        };
    }

    MenuItem.prototype.render = function render() {
        var _props = this.props;
        var style = _props.style;
        var tab = _props.tab;

        if (!tab) return null;

        var textStyle = {
            position: "absolute",
            top: 0,
            bottom: 0,
            width: 100,
            maxWidth: 100,
            textAlign: "center",
            left: -120,
            lineHeight: "30px",
            margin: "5px 0",
            padding: "0 5px",
            borderRadius: 4,
            background: "#000000",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            color: "#ffffff",
            opacity: "0.7"
        };

        return React.createElement(
            'div',
            { style: style, onClick: this.onClick },
            React.createElement(
                'span',
                { style: textStyle },
                tab.title
            ),
            React.createElement(
                _materialUi.FloatingActionButton,
                { mini: true, ref: 'container', backgroundColor: '#FFFFFF', zDepth: 2, iconStyle: { backgroundColor: "#FFFFFF" } },
                React.createElement(tab.icon, _extends({}, this.props.tab, { style: { fill: "#000000", flex: 1, alignItems: "center", justifyContent: "center", fontSize: 28, color: "#607d8b" }, loadThumbnail: true }))
            )
        );
    };

    return MenuItem;
})(React.PureComponent);

function mapStateToProps(state, ownProps) {
    var tabs = state.tabs;

    var current = tabs.filter(function (tab) {
        return tab.id === ownProps.id;
    })[0];

    return _extends({}, ownProps, {
        tab: current
    });
}

var ConnectedMenuItem = _reactRedux.connect(mapStateToProps, EditorActions)(MenuItem);

exports['default'] = ConnectedMenuItem;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","react-redux":"react-redux"}],57:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _Menu = require('./Menu');

exports.Menu = _interopRequire(_Menu);

},{"./Menu":54}],58:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactMotion = require('react-motion');

var OPACITY_ORIGIN = 0;
var OPACITY_TARGET = 1;
var TRANSLATEY_ORIGIN = 0;
var TRANSLATEY_TARGET = 70;
var ANIMATION = { stifness: 500, damping: 20 };

var makeMenuTransition = function makeMenuTransition(Target) {
    return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
            _classCallCheck(this, _class);

            _React$Component.apply(this, arguments);
        }

        _class.prototype.getStyles = function getStyles() {
            if (!this.props.children) return [];

            var counter = 0;
            return React.Children.map(this.props.children, function (child) {
                return {
                    key: "t" + counter++,
                    data: { element: child },
                    style: {
                        opacity: _reactMotion.spring(OPACITY_TARGET, ANIMATION),
                        y: _reactMotion.spring(TRANSLATEY_TARGET * counter, ANIMATION)
                    }
                };
            });
        };

        _class.prototype.willEnter = function willEnter() {
            return {
                opacity: OPACITY_ORIGIN,
                y: TRANSLATEY_ORIGIN
            };
        };

        _class.prototype.willLeave = function willLeave() {
            return {
                opacity: _reactMotion.spring(OPACITY_ORIGIN, ANIMATION),
                y: _reactMotion.spring(TRANSLATEY_ORIGIN, ANIMATION)
            };
        };

        _class.prototype.render = function render() {
            var _this = this;

            return React.createElement(
                _reactMotion.TransitionMotion,
                {
                    styles: this.getStyles(),
                    willLeave: this.willLeave,
                    willEnter: this.willEnter },
                function (styles) {
                    return React.createElement(
                        Target,
                        _this.props,
                        styles.map(function (_ref) {
                            var key = _ref.key;
                            var style = _ref.style;
                            var data = _ref.data;

                            var loaded = style.opacity === 1 || style.opacity === 0;

                            var childStyle = {
                                position: "absolute",
                                opacity: style.opacity,
                                transition: "none",
                                transform: "translate3d(-50%, -50%, 0) translateY(-" + style.y + "px)"
                            };

                            var child = React.cloneElement(data.element, { key: key, loaded: loaded, style: childStyle });

                            return child;
                        })
                    );
                }
            );
        };

        return _class;
    })(React.Component);
};

exports["default"] = makeMenuTransition;
module.exports = exports["default"];

},{"react-motion":25}],59:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactMotion = require('react-motion');

var ANIMATION = { stifness: 500, damping: 20 };
var ORIGIN = -720;
var TARGET = 0;

var makeRotate = function makeRotate(Target) {
    return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
            _classCallCheck(this, _class);

            _React$Component.call(this, props);
            this.state = {
                rotate: false
            };
        }

        _class.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
            this.setState({
                rotate: nextProps.open
            });
        };

        _class.prototype.render = function render() {
            var _this = this;

            var style = {
                rotate: this.state.rotate ? ORIGIN : TARGET
            };
            return React.createElement(
                _reactMotion.Motion,
                { style: style },
                function (_ref) {
                    var rotate = _ref.rotate;

                    var rotated = rotate === ORIGIN;

                    return React.createElement(Target, _extends({}, _this.props, {
                        rotated: rotated,
                        style: _extends({}, _this.props.style, {
                            transform: _this.props.style.transform + ' rotate(' + rotate + 'deg)'
                        })
                    }));
                }
            );
        };

        return _class;
    })(React.Component);
};

exports['default'] = makeRotate;
module.exports = exports['default'];

},{"react-motion":25}],60:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _App = require('./App');

exports.Editor = _interopRequire(_App);

},{"./App":46}],61:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

"use strict";

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactMotion = require('react-motion');

var ANIMATION = { stiffness: 200, damping: 22, precision: 1 };
var TRANSLATEY_ORIGIN = 800;
var TRANSLATEY_TARGET = 0;

var makeEditorOpen = function makeEditorOpen(Target) {
    return (function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class() {
            _classCallCheck(this, _class);

            _React$Component.apply(this, arguments);
        }

        _class.prototype.getStyles = function getStyles() {
            if (!this.props.children) return [];

            var counter = 0;

            return React.Children.toArray(this.props.children).filter(function (child) {
                return child;
            }) // Removing null values
            .map(function (child) {
                return {
                    key: "t" + counter++,
                    data: { element: child },
                    style: {
                        y: _reactMotion.spring(TRANSLATEY_TARGET * counter, ANIMATION)
                    }
                };
            });
        };

        _class.prototype.willEnter = function willEnter() {
            return {
                y: TRANSLATEY_ORIGIN
            };
        };

        _class.prototype.willLeave = function willLeave() {
            return {
                y: TRANSLATEY_ORIGIN
            };
        };

        _class.prototype.render = function render() {
            var _this = this;

            return React.createElement(
                _reactMotion.TransitionMotion,
                {
                    styles: this.getStyles(),
                    willLeave: this.willLeave,
                    willEnter: this.willEnter
                },
                function (styles) {
                    return React.createElement(
                        Target,
                        _this.props,
                        styles.map(function (_ref) {
                            var key = _ref.key;
                            var style = _ref.style;
                            var data = _ref.data;

                            // During the transition, we handle the style
                            if (style.y !== TRANSLATEY_TARGET) {

                                // Retrieve previous transform
                                var transform = data.element.props.style.transform || "";

                                return React.cloneElement(data.element, {
                                    key: key,
                                    translated: false,
                                    style: _extends({}, data.element.props.style, {
                                        transition: "none",
                                        transformOrigin: "none",
                                        transform: transform + " translateY(" + style.y + "px)"
                                    })
                                });
                            }

                            return React.cloneElement(data.element, {
                                key: key,
                                translated: true
                            });
                        })
                    );
                }
            );
        };

        return _class;
    })(React.Component);
};

exports["default"] = makeEditorOpen;
module.exports = exports["default"];

},{"react-motion":25}],62:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _OpenNodesModel = require('./OpenNodesModel');

var _OpenNodesModel2 = _interopRequireDefault(_OpenNodesModel);

var _viewsMainFilesList = require('./views/MainFilesList');

var _viewsMainFilesList2 = _interopRequireDefault(_viewsMainFilesList);

var _viewsBreadcrumb = require('./views/Breadcrumb');

var _viewsBreadcrumb2 = _interopRequireDefault(_viewsBreadcrumb);

var _viewsFilePreview = require('./views/FilePreview');

var _viewsFilePreview2 = _interopRequireDefault(_viewsFilePreview);

var _viewsFSTemplate = require('./views/FSTemplate');

var _viewsFSTemplate2 = _interopRequireDefault(_viewsFSTemplate);

var _viewsEditionPanel = require('./views/EditionPanel');

var _viewsEditionPanel2 = _interopRequireDefault(_viewsEditionPanel);

var _search = require('./search');

var _wslistWorkspacesList = require('./wslist/WorkspacesList');

var _wslistWorkspacesList2 = _interopRequireDefault(_wslistWorkspacesList);

var _wslistWorkspacesListMaterial = require('./wslist/WorkspacesListMaterial');

var _wslistWorkspacesListMaterial2 = _interopRequireDefault(_wslistWorkspacesListMaterial);

var _leftnavLeftPanel = require('./leftnav/LeftPanel');

var _leftnavLeftPanel2 = _interopRequireDefault(_leftnavLeftPanel);

var _leftnavDynamicLeftPanel = require('./leftnav/DynamicLeftPanel');

var _leftnavDynamicLeftPanel2 = _interopRequireDefault(_leftnavDynamicLeftPanel);

var _leftnavUserWidget = require('./leftnav/UserWidget');

var _leftnavUserWidget2 = _interopRequireDefault(_leftnavUserWidget);

var _viewsTourGuide = require('./views/TourGuide');

var _viewsTourGuide2 = _interopRequireDefault(_viewsTourGuide);

var _detailpanesInfoPanel = require('./detailpanes/InfoPanel');

var _detailpanesInfoPanel2 = _interopRequireDefault(_detailpanesInfoPanel);

var _detailpanesInfoPanelCard = require('./detailpanes/InfoPanelCard');

var _detailpanesInfoPanelCard2 = _interopRequireDefault(_detailpanesInfoPanelCard);

var _detailpanesRootNode = require('./detailpanes/RootNode');

var _detailpanesRootNode2 = _interopRequireDefault(_detailpanesRootNode);

var _detailpanesGenericInfoCard = require('./detailpanes/GenericInfoCard');

var _detailpanesGenericInfoCard2 = _interopRequireDefault(_detailpanesGenericInfoCard);

var _detailpanesFileInfoCard = require('./detailpanes/FileInfoCard');

var _detailpanesFileInfoCard2 = _interopRequireDefault(_detailpanesFileInfoCard);

var _editorComponentsEditor = require('./editor/components/editor');

var classes = {
    OpenNodesModel: _OpenNodesModel2['default'],
    MainFilesList: _viewsMainFilesList2['default'],
    EditionPanel: _viewsEditionPanel2['default'],
    Breadcrumb: _viewsBreadcrumb2['default'],
    SearchForm: _search.SearchForm,
    FilePreview: _viewsFilePreview2['default'],
    FSTemplate: _viewsFSTemplate2['default'],
    WorkspacesList: _wslistWorkspacesList2['default'],
    WorkspacesListMaterial: _wslistWorkspacesListMaterial2['default'],
    LeftPanel: _leftnavLeftPanel2['default'],
    DynamicLeftPanel: _leftnavDynamicLeftPanel2['default'],
    UserWidget: _leftnavUserWidget2['default'],
    TourGuide: _viewsTourGuide2['default'],

    InfoPanel: _detailpanesInfoPanel2['default'],
    InfoPanelCard: _detailpanesInfoPanelCard2['default'],
    InfoRootNode: _detailpanesRootNode2['default'],
    FileInfoCard: _detailpanesFileInfoCard2['default'],
    GenericInfoCard: _detailpanesGenericInfoCard2['default'],

    Editor: _editorComponentsEditor.Editor
};

exports['default'] = classes;
module.exports = exports['default'];

},{"./OpenNodesModel":40,"./detailpanes/FileInfoCard":41,"./detailpanes/GenericInfoCard":42,"./detailpanes/InfoPanel":43,"./detailpanes/InfoPanelCard":44,"./detailpanes/RootNode":45,"./editor/components/editor":50,"./leftnav/DynamicLeftPanel":64,"./leftnav/LeftPanel":65,"./leftnav/UserWidget":66,"./search":74,"./views/Breadcrumb":76,"./views/EditionPanel":79,"./views/FSTemplate":80,"./views/FilePreview":81,"./views/MainFilesList":82,"./views/TourGuide":83,"./wslist/WorkspacesList":87,"./wslist/WorkspacesListMaterial":88}],63:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _viewsFilePreview = require('../views/FilePreview');

var _viewsFilePreview2 = _interopRequireDefault(_viewsFilePreview);

var _materialUiStyles = require('material-ui/styles');

var _pydioUtilPath = require('pydio/util/path');

var _pydioUtilPath2 = _interopRequireDefault(_pydioUtilPath);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _materialUi = require('material-ui');

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _pydioHttpApi = require('pydio/http/api');

var _pydioHttpApi2 = _interopRequireDefault(_pydioHttpApi);

var _pydioHttpRestApi = require('pydio/http/rest-api');

var _pydioModelNode = require('pydio/model/node');

var _pydioModelNode2 = _interopRequireDefault(_pydioModelNode);

var _Pydio$requireLib = _pydio2['default'].requireLib("components");

var EmptyStateView = _Pydio$requireLib.EmptyStateView;

var BookmarksList = (function (_React$Component) {
    _inherits(BookmarksList, _React$Component);

    function BookmarksList(props) {
        _classCallCheck(this, BookmarksList);

        _React$Component.call(this, props);
        this.state = {
            open: false,
            loading: false,
            bookmarks: null
        };
    }

    BookmarksList.prototype.load = function load() {
        var _this = this;

        this.setState({ loading: true });
        var api = new _pydioHttpRestApi.UserMetaServiceApi(_pydioHttpApi2['default'].getRestClient());
        return api.userBookmarks(new _pydioHttpRestApi.RestUserBookmarksRequest()).then(function (collection) {
            _this.setState({ bookmarks: collection.Nodes, loading: false });
        })['catch'](function (reason) {
            _this.setState({ loading: false });
        });
    };

    BookmarksList.prototype.handleTouchTap = function handleTouchTap(event) {
        // This prevents ghost click.
        event.preventDefault();
        this.load();
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    };

    BookmarksList.prototype.handleRequestClose = function handleRequestClose() {
        this.setState({
            open: false
        });
    };

    BookmarksList.prototype.renderIcon = function renderIcon(node) {
        return _react2['default'].createElement(_viewsFilePreview2['default'], {
            loadThumbnail: true,
            node: node,
            pydio: this.props.pydio,
            rounded: true
        });
    };

    BookmarksList.prototype.renderSecondLine = function renderSecondLine(node) {
        return node.getPath();
    };

    BookmarksList.prototype.entryClicked = function entryClicked(node) {
        this.handleRequestClose();
        this.props.pydio.goTo(node);
    };

    BookmarksList.prototype.render = function render() {
        var _props = this.props;
        var pydio = _props.pydio;
        var muiTheme = _props.muiTheme;
        var _state = this.state;
        var loading = _state.loading;
        var open = _state.open;
        var anchorEl = _state.anchorEl;
        var bookmarks = _state.bookmarks;

        if (!pydio.user.activeRepository) {
            return null;
        }
        var mainColor = _color2['default'](muiTheme.palette.primary1Color);
        var items = undefined;
        if (bookmarks) {
            items = bookmarks.map(function (n) {
                return _react2['default'].createElement(_materialUi.ListItem, {
                    primaryText: _pydioUtilPath2['default'].getBasename(n.Path),
                    secondaryText: "Appears in:" + n.AppearsIn.map(function (ws) {
                        return ws.WsLabel;
                    }).join(', '),
                    onTouchTap: function () {
                        var path = n.AppearsIn[0].Path;
                        if (!path) {
                            path = '/';
                        }
                        var fakeNode = new _pydioModelNode2['default'](path, n.Type === 'LEAF');
                        fakeNode.getMetadata().set('repository_id', n.AppearsIn[0].WsUuid);
                        pydio.goTo(fakeNode);
                    }
                });
            });
        }

        return _react2['default'].createElement(
            'span',
            null,
            _react2['default'].createElement(_materialUi.IconButton, {
                onTouchTap: this.handleTouchTap.bind(this),
                iconClassName: "userActionIcon mdi mdi-bookmark-check",
                tooltip: pydio.MessageHash['147'],
                className: 'userActionButton'
            }),
            _react2['default'].createElement(
                _materialUi.Popover,
                {
                    open: open,
                    anchorEl: anchorEl,
                    anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
                    targetOrigin: { horizontal: 'left', vertical: 'top' },
                    onRequestClose: this.handleRequestClose.bind(this),
                    style: { width: 320 },
                    zDepth: 2

                },
                loading && _react2['default'].createElement(
                    'div',
                    { style: { height: 200, backgroundColor: mainColor.lightness(97).rgb().toString() } },
                    _react2['default'].createElement(_materialUi.RefreshIndicator, {
                        size: 40,
                        left: 140,
                        top: 40,
                        status: 'loading',
                        style: {}
                    })
                ),
                !loading && items && items.length && _react2['default'].createElement(
                    _materialUi.List,
                    null,
                    items
                ),
                !loading && (!items || !items.length) && _react2['default'].createElement(EmptyStateView, {
                    pydio: pydio,
                    iconClassName: 'mdi mdi-bookmark-outline',
                    primaryTextId: '145',
                    secondaryTextId: "482",
                    style: { minHeight: 260 }
                })
            )
        );
    };

    return BookmarksList;
})(_react2['default'].Component);

exports['default'] = BookmarksList = _materialUiStyles.muiThemeable()(BookmarksList);
exports['default'] = BookmarksList;
module.exports = exports['default'];

},{"../views/FilePreview":81,"color":"color","material-ui":"material-ui","material-ui/styles":"material-ui/styles","pydio":"pydio","pydio/http/api":"pydio/http/api","pydio/http/rest-api":"pydio/http/rest-api","pydio/model/node":"pydio/model/node","pydio/util/path":"pydio/util/path","react":"react"}],64:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _wslistWorkspacesList = require('../wslist/WorkspacesList');

var _wslistWorkspacesList2 = _interopRequireDefault(_wslistWorkspacesList);

exports['default'] = React.createClass({
    displayName: 'DynamicLeftPanel',

    propTypes: {
        pydio: React.PropTypes.instanceOf(Pydio).isRequired,
        pydioId: React.PropTypes.string.isRequired
    },

    childContextTypes: {
        messages: React.PropTypes.object,
        getMessage: React.PropTypes.func
    },

    getChildContext: function getChildContext() {
        var messages = this.props.pydio.MessageHash;
        return {
            messages: messages,
            getMessage: function getMessage(messageId) {
                var namespace = arguments.length <= 1 || arguments[1] === undefined ? 'ajxp_admin' : arguments[1];

                try {
                    return messages[namespace + (namespace ? "." : "") + messageId] || messageId;
                } catch (e) {
                    return messageId;
                }
            }
        };
    },

    parseComponentConfigs: function parseComponentConfigs() {
        var reg = this.props.pydio.Registry.getXML();
        //Does not work on IE 11
        //var contentNodes = XMLUtils.XPathSelectNodes(reg, 'client_configs/component_config[@className="AjxpReactComponent::'+this.props.pydioId+'"]/additional_content');
        var contentNodes = XMLUtils.XPathSelectNodes(reg, 'client_configs/component_config/additional_content');
        var result = [];
        var compId = "AjxpReactComponent::" + this.props.pydioId;
        contentNodes.map(function (node) {
            if (node.parentNode.getAttribute('className') == compId) {
                result.push({
                    id: node.getAttribute('id'),
                    position: parseInt(node.getAttribute('position')),
                    type: node.getAttribute('type'),
                    options: JSON.parse(node.getAttribute('options'))
                });
            }
        });
        result.sort(function (a, b) {
            return a.position >= b.position ? 1 : -1;
        });
        return result;
    },

    getInitialState: function getInitialState() {
        return {
            statusOpen: true,
            blinkingBell: false,
            additionalContents: this.parseComponentConfigs(),
            workspaces: this.props.pydio.user.getRepositoriesList()
        };
    },

    componentDidMount: function componentDidMount() {
        if (this._timer) global.clearTimeout(this._timer);
        this._timer = global.setTimeout(this.closeNavigation, 3000);

        this._reloadObserver = (function () {
            try {
                if (this.isMounted()) {
                    this.setState({
                        workspaces: this.props.pydio.user ? this.props.pydio.user.getRepositoriesList() : []
                    });
                }
            } catch (e) {
                if (global.console) {
                    console.error('Error while setting state on LeftPanel component - Probably height error on IE8', e);
                }
            }
        }).bind(this);

        this.props.pydio.observe('repository_list_refreshed', this._reloadObserver);
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this._reloadObserver) {
            this.props.pydio.stopObserving('repository_list_refreshed', this._reloadObserver);
        }
    },

    openNavigation: function openNavigation() {
        if (!this.state.statusOpen) {
            this.setState({ statusOpen: true });
        }
    },

    closeNavigation: function closeNavigation() {
        this.setState({ statusOpen: false });
    },

    listNodeClicked: function listNodeClicked(node) {
        this.props.pydio.goTo(node);
        this.closeNavigation();
    },

    closeMouseover: function closeMouseover() {
        if (this._timer) global.clearTimeout(this._timer);
    },

    closeMouseout: function closeMouseout() {
        if (this._timer) global.clearTimeout(this._timer);
        this._timer = global.setTimeout(this.closeNavigation, 300);
    },

    onAlertPanelBadgeChange: function onAlertPanelBadgeChange(paneData, newValue, oldValue, memoData) {
        if (paneData.id !== 'navigation_alerts') {
            return;
        }
        if (newValue) {
            this.setState({ blinkingBell: newValue, blinkingBellClass: paneData.options['titleClassName'] });
        } else {
            this.setState({ blinkingBell: false });
        }

        if (newValue && newValue !== oldValue) {
            if (Object.isNumber(newValue)) {
                if (oldValue !== '' && newValue > oldValue) {
                    var notifText = 'Something happened!';
                    if (memoData instanceof PydioDataModel) {
                        var node = memoData.getRootNode().getFirstChildIfExists();
                        if (node) {
                            if (paneData.options['tipAttribute']) {
                                notifText = node.getMetadata().get(paneData.options['tipAttribute']);
                            } else {
                                notifText = node.getLabel();
                            }
                        }
                    }
                    if (PydioTasks) {
                        PydioTasks.AlertTask.setCloser(this.openNavigation.bind(this));
                        var title = global.pydio.MessageHash[paneData.options.title] || paneData.options.title;
                        var _alert = new PydioTasks.AlertTask(title, notifText);
                        _alert.show();
                    }
                }
            }
        }
    },

    render: function render() {
        var additional = this.state.additionalContents.map((function (paneData) {
            if (paneData.type == 'ListProvider') {
                return React.createElement(PydioComponents.CollapsableListProvider, {
                    pydio: this.props.pydio,
                    paneData: paneData,
                    nodeClicked: this.listNodeClicked,
                    onBadgeChange: this.onAlertPanelBadgeChange
                });
            } else {
                return null;
            }
        }).bind(this));

        var badge = undefined;
        if (this.state.blinkingBell) {
            badge = React.createElement('span', { className: "badge-icon icon-bell-alt" });
        }

        return React.createElement(
            'span',
            null,
            React.createElement(
                'div',
                { id: 'repo_chooser', onClick: this.openNavigation, onMouseOver: this.openNavigation, className: this.state.statusOpen ? "open" : "" },
                React.createElement('span', { className: 'icon-reorder' }),
                badge
            ),
            React.createElement(
                'div',
                { className: "left-panel" + (this.state.statusOpen ? '' : ' hidden'), onMouseOver: this.closeMouseover, onMouseOut: this.closeMouseout },
                additional,
                React.createElement(UserWorkspacesList, {
                    pydio: this.props.pydio,
                    workspaces: this.state.workspaces
                })
            )
        );
    }
});
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../wslist/WorkspacesList":87}],65:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _UserWidget = require('./UserWidget');

var _UserWidget2 = _interopRequireDefault(_UserWidget);

var _wslistWorkspacesList = require('../wslist/WorkspacesList');

var _wslistWorkspacesList2 = _interopRequireDefault(_wslistWorkspacesList);

var React = require('react');
var Pydio = require('pydio');

var _require = require('material-ui/styles');

var muiThemeable = _require.muiThemeable;

var LeftPanel = function LeftPanel(_ref) {
    var muiTheme = _ref.muiTheme;
    var _ref$style = _ref.style;
    var style = _ref$style === undefined ? {} : _ref$style;
    var userWidgetProps = _ref.userWidgetProps;
    var workspacesListProps = _ref.workspacesListProps;
    var pydio = _ref.pydio;

    var palette = muiTheme.palette;
    var Color = require('color');
    var colorHue = Color(palette.primary1Color).hsl().array()[0];
    var lightBg = new Color({ h: colorHue, s: 35, l: 98 });

    style = _extends({
        backgroundColor: lightBg.toString()
    }, style);
    var widgetStyle = {
        backgroundColor: Color(palette.primary1Color).darken(0.2).toString(),
        width: '100%'
    };
    var wsListStyle = {
        backgroundColor: lightBg.toString(),
        color: Color(palette.primary1Color).darken(0.1).alpha(0.87).toString()
    };
    var wsSectionTitleStyle = {
        color: Color(palette.primary1Color).darken(0.1).alpha(0.50).toString()
    };
    var uWidgetProps = userWidgetProps || {};
    var wsListProps = workspacesListProps || {};

    return React.createElement(
        'div',
        { className: 'left-panel vertical_fit vertical_layout', style: style },
        React.createElement(_UserWidget2['default'], _extends({
            pydio: pydio,
            style: widgetStyle
        }, uWidgetProps)),
        React.createElement(_wslistWorkspacesList2['default'], _extends({
            className: "vertical_fit",
            style: wsListStyle,
            sectionTitleStyle: wsSectionTitleStyle,
            pydio: pydio,
            showTreeForWorkspace: pydio.user ? pydio.user.activeRepository : false
        }, wsListProps))
    );
};

LeftPanel.propTypes = {
    pydio: React.PropTypes.instanceOf(Pydio).isRequired,
    userWidgetProps: React.PropTypes.object,
    workspacesListProps: React.PropTypes.object,
    style: React.PropTypes.object
};

exports['default'] = LeftPanel = muiThemeable()(LeftPanel);

exports['default'] = LeftPanel;
module.exports = exports['default'];

},{"../wslist/WorkspacesList":87,"./UserWidget":66,"color":"color","material-ui/styles":"material-ui/styles","pydio":"pydio","react":"react"}],66:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _BookmarksList = require('./BookmarksList');

var _BookmarksList2 = _interopRequireDefault(_BookmarksList);

var React = require('react');

var _require$requireLib = require('pydio/http/resources-manager').requireLib('boot');

var AsyncComponent = _require$requireLib.AsyncComponent;

var _require$requireLib2 = require('pydio/http/resources-manager').requireLib('components');

var UserAvatar = _require$requireLib2.UserAvatar;
var IconButtonMenu = _require$requireLib2.IconButtonMenu;
var Toolbar = _require$requireLib2.Toolbar;

var _require = require('material-ui');

var IconButton = _require.IconButton;
var Paper = _require.Paper;
exports['default'] = React.createClass({
    displayName: 'UserWidget',

    propTypes: {
        pydio: React.PropTypes.instanceOf(Pydio),
        style: React.PropTypes.object,
        avatarStyle: React.PropTypes.object,
        actionBarStyle: React.PropTypes.object
    },

    applyAction: function applyAction(actionName) {
        switch (actionName) {
            case 'home':
                this.props.pydio.triggerRepositoryChange('homepage');
                break;
            case 'settings':
                this.props.pydio.triggerRepositoryChange('settings');
                break;
            case 'about_pydio':
                this.props.pydio.getController().fireAction('splash');
                break;
            default:
                break;
        }
    },

    render: function render() {

        var messages = this.props.pydio.MessageHash;

        var avatar = undefined;
        var homeButton = undefined,
            notificationsButton = undefined,
            currentIsSettings = undefined,
            bookmarksButton = undefined;
        var avatarStyle = this.props.avatarStyle || {};
        if (this.props.pydio.user) {
            var user = this.props.pydio.user;
            currentIsSettings = user.activeRepository === 'settings';
            avatar = React.createElement(
                UserAvatar,
                {
                    pydio: this.props.pydio,
                    userId: user.id,
                    style: avatarStyle,
                    className: 'user-display',
                    labelClassName: 'userLabel',
                    labelStyle: { flex: 1, marginLeft: 5 }
                },
                React.createElement(IconButtonMenu, _extends({}, this.props, {
                    buttonClassName: 'mdi mdi-dots-vertical',
                    buttonStyle: { color: 'white' },
                    buttonTitle: messages['165'],
                    toolbars: ["user", "zlogin"],
                    controller: this.props.pydio.Controller,
                    popoverDirection: "left",
                    popoverTargetPosition: "top",
                    menuProps: { display: 'right', width: 160, desktop: true }
                }))
            );

            if (user.getRepositoriesList().has('homepage')) {
                homeButton = React.createElement(IconButton, {
                    onTouchTap: this.applyAction.bind(this, 'home'),
                    iconClassName: 'userActionIcon mdi mdi-home-variant',
                    className: 'userActionButton backToHomeButton',
                    tooltip: user.activeRepository === 'homepage' ? null : messages['305'],
                    tooltipPosition: 'bottom-right',
                    disabled: user.activeRepository === 'homepage'
                });
            }
            if (!this.props.hideNotifications && !(this.props.pydio.user && this.props.pydio.user.activeRepository === 'inbox')) {
                notificationsButton = React.createElement(AsyncComponent, _extends({
                    namespace: 'PydioActivityStreams',
                    componentName: 'UserPanel',
                    noLoader: true,
                    iconClassName: 'userActionIcon mdi mdi-bell-outline'
                }, this.props));
            }
            bookmarksButton = React.createElement(_BookmarksList2['default'], { pydio: this.props.pydio });
        }

        var aboutButton = React.createElement(IconButton, {
            onTouchTap: this.applyAction.bind(this, 'about_pydio'),
            iconClassName: 'userActionIcon icomoon-cells',
            className: 'userActionButton backToHomeButton',
            tooltip: messages['166'],
            tooltipPosition: 'bottom-left'
        });

        // Do not display Home Button here for the moment
        var actionBarStyle = this.props.actionBarStyle || {};
        var actionBar = undefined;
        if (currentIsSettings) {
            actionBar = React.createElement(
                'div',
                { className: 'action_bar', style: _extends({ display: 'flex' }, actionBarStyle) },
                homeButton
            );
        } else {
            actionBar = React.createElement(
                'div',
                { className: 'action_bar', style: _extends({ display: 'flex' }, actionBarStyle) },
                homeButton,
                React.createElement(Toolbar, _extends({}, this.props, {
                    toolbars: ['user-widget'],
                    renderingType: 'icon',
                    toolbarStyle: { display: 'inline' },
                    buttonStyle: { color: 'rgba(255,255,255,255.93)', fontSize: 18 },
                    tooltipPosition: 'bottom-right',
                    className: 'user-widget-toolbar'
                })),
                notificationsButton,
                bookmarksButton,
                React.createElement('span', { style: { flex: 1 } }),
                aboutButton
            );
        }

        if (this.props.children) {
            return React.createElement(
                Paper,
                { zDepth: 1, rounded: false, style: _extends({}, this.props.style, { display: 'flex' }), className: 'user-widget primaryColorDarkerPaper' },
                React.createElement(
                    'div',
                    { style: { flex: 1 } },
                    avatar,
                    actionBar
                ),
                this.props.children
            );
        } else {
            return React.createElement(
                Paper,
                { zDepth: 1, rounded: false, style: this.props.style, className: 'user-widget primaryColorDarkerPaper' },
                avatar,
                actionBar
            );
        }
    }
});
module.exports = exports['default'];

},{"./BookmarksList":63,"material-ui":"material-ui","pydio/http/resources-manager":"pydio/http/resources-manager","react":"react"}],67:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _materialUi = require('material-ui');

var _DatePanel = require('./DatePanel');

var _DatePanel2 = _interopRequireDefault(_DatePanel);

var _FileFormatPanel = require('./FileFormatPanel');

var _FileFormatPanel2 = _interopRequireDefault(_FileFormatPanel);

var _FileSizePanel = require('./FileSizePanel');

var _FileSizePanel2 = _interopRequireDefault(_FileSizePanel);

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var AdvancedSearch = (function (_Component) {
    _inherits(AdvancedSearch, _Component);

    _createClass(AdvancedSearch, null, [{
        key: 'styles',
        get: function get() {
            return {
                text: {
                    width: "calc(100% - 32px)",
                    margin: "0 16px"
                }
            };
        }
    }]);

    function AdvancedSearch(props) {
        _classCallCheck(this, AdvancedSearch);

        _Component.call(this, props);

        this.state = {
            value: props.values['basename'] || ''
        };
    }

    AdvancedSearch.prototype.onChange = function onChange(values) {
        if (values.hasOwnProperty('basename')) {
            this.setState({
                value: values.basename
            });
        }
        this.props.onChange(values);
    };

    AdvancedSearch.prototype.renderField = function renderField(key, val) {
        var _this = this;

        var text = AdvancedSearch.styles.text;

        var fieldname = key === 'basename' ? key : 'ajxp_meta_' + key;
        var value = this.props.values[fieldname];

        if (typeof val === 'object') {
            var label = val.label;
            var renderComponent = val.renderComponent;

            // The field might have been assigned a method already
            if (renderComponent) {
                var component = renderComponent(_extends({}, this.props, {
                    label: label,
                    value: value,
                    fieldname: key,
                    onChange: function onChange(object) {
                        _this.onChange(object);
                    }
                }));
                return _react2['default'].createElement(
                    'div',
                    { style: { margin: '0 16px' } },
                    _react2['default'].createElement(
                        'div',
                        { style: { color: 'rgba(0,0,0,0.33)', fontSize: 12, marginBottom: -10, marginTop: 10 } },
                        label
                    ),
                    component
                );
            }
        }

        return _react2['default'].createElement(_materialUi.TextField, {
            key: fieldname,
            value: this.state.value || '',
            style: text,
            className: 'mui-text-field',
            floatingLabelFixed: true,
            floatingLabelText: val,
            hintText: val,
            onChange: function (e, v) {
                var _onChange;

                _this.onChange((_onChange = {}, _onChange[fieldname] = v, _onChange));
            }
        });
    };

    AdvancedSearch.prototype.render = function render() {
        var _this2 = this;

        var text = AdvancedSearch.styles.text;
        var _props = this.props;
        var pydio = _props.pydio;
        var onChange = _props.onChange;
        var getMessage = _props.getMessage;
        var values = _props.values;

        var headerStyle = { fontSize: 18, color: 'rgba(0,0,0,0.87)', fontWeight: 400, marginBottom: -10, marginTop: 10 };

        return _react2['default'].createElement(
            'div',
            { className: 'search-advanced' },
            _react2['default'].createElement(
                _materialUi.Subheader,
                { style: _extends({}, headerStyle, { marginTop: 0 }) },
                getMessage(489)
            ),
            _react2['default'].createElement(
                AdvancedMetaFields,
                this.props,
                function (fields) {
                    return _react2['default'].createElement(
                        'div',
                        null,
                        Object.keys(fields).map(function (key) {
                            return _this2.renderField(key, fields[key]);
                        })
                    );
                }
            ),
            _react2['default'].createElement(
                _materialUi.Subheader,
                { style: headerStyle },
                getMessage(490)
            ),
            _react2['default'].createElement(_DatePanel2['default'], { values: values, pydio: pydio, inputStyle: text, onChange: function (values) {
                    return _this2.onChange(values);
                } }),
            _react2['default'].createElement(
                _materialUi.Subheader,
                { style: _extends({}, headerStyle, { marginBottom: 10 }) },
                getMessage(498)
            ),
            _react2['default'].createElement(_FileFormatPanel2['default'], { values: values, pydio: pydio, inputStyle: text, onChange: function (values) {
                    return _this2.onChange(values);
                } }),
            _react2['default'].createElement(
                _materialUi.Subheader,
                { style: headerStyle },
                getMessage(503)
            ),
            _react2['default'].createElement(_FileSizePanel2['default'], { values: values, pydio: pydio, inputStyle: text, onChange: function (values) {
                    return _this2.onChange(values);
                } })
        );
    };

    return AdvancedSearch;
})(_react.Component);

AdvancedSearch = PydioContextConsumer(AdvancedSearch);

var AdvancedMetaFields = (function (_Component2) {
    _inherits(AdvancedMetaFields, _Component2);

    function AdvancedMetaFields(props) {
        _classCallCheck(this, AdvancedMetaFields);

        _Component2.call(this, props);

        var pydio = props.pydio;

        var registry = pydio.getXmlRegistry();

        // Parse client configs
        var options = JSON.parse(XMLUtils.XPathGetSingleNodeText(registry, 'client_configs/template_part[@ajxpClass="SearchEngine" and @theme="material"]/@ajxpOptions'));

        this.build = _lodash2['default'].debounce(this.build, 500);

        this.state = {
            options: options,
            fields: {}
        };
    }

    AdvancedMetaFields.prototype.componentWillMount = function componentWillMount() {
        this.build();
    };

    AdvancedMetaFields.prototype.build = function build() {
        var _this3 = this;

        var options = this.state.options;

        var _extends2 = _extends({}, options);

        var metaColumns = _extends2.metaColumns;
        var reactColumnsRenderers = _extends2.reactColumnsRenderers;

        if (!metaColumns) {
            metaColumns = {};
        }
        if (!reactColumnsRenderers) {
            reactColumnsRenderers = {};
        }

        var generic = { basename: this.props.getMessage(1) };

        // Looping through the options to check if we have a special renderer for any
        var specialRendererKeys = Object.keys(_extends({}, reactColumnsRenderers));
        var standardRendererKeys = Object.keys(_extends({}, metaColumns)).filter(function (key) {
            return specialRendererKeys.indexOf(standardRendererKeys) > -1;
        });

        var columns = standardRendererKeys.map(function (key) {
            key: metaColumns[key];
        }).reduce(function (obj, current) {
            return obj = _extends({}, obj, current);
        }, []);

        var renderers = Object.keys(_extends({}, reactColumnsRenderers)).map(function (key) {
            var _ref;

            var renderer = reactColumnsRenderers[key];
            var namespace = renderer.split('.', 1).shift();

            // If the renderer is not loaded in memory, we trigger the load and send to rebuild
            if (!window[namespace]) {
                ResourcesManager.detectModuleToLoadAndApply(renderer, function () {
                    return _this3.build();
                }, true);
                return;
            }

            return _ref = {}, _ref[key] = {
                label: metaColumns[key],
                renderComponent: FuncUtils.getFunctionByName(renderer, global)
            }, _ref;
        }).reduce(function (obj, current) {
            return obj = _extends({}, obj, current);
        }, []);

        var fields = _extends({}, generic, columns, renderers);

        this.setState({
            fields: fields
        });
    };

    AdvancedMetaFields.prototype.render = function render() {
        return this.props.children(this.state.fields);
    };

    return AdvancedMetaFields;
})(_react.Component);

AdvancedMetaFields.propTypes = {
    children: _react2['default'].PropTypes.func.isRequired
};

exports['default'] = AdvancedSearch;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./DatePanel":68,"./FileFormatPanel":69,"./FileSizePanel":70,"lodash":3,"material-ui":"material-ui","pydio":"pydio","react":"react"}],68:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var SearchDatePanel = (function (_React$Component) {
    _inherits(SearchDatePanel, _React$Component);

    _createClass(SearchDatePanel, null, [{
        key: 'styles',
        get: function get() {
            return {
                dropdownLabel: {
                    padding: 0
                },
                dropdownUnderline: {
                    marginLeft: 0,
                    marginRight: 0
                },
                dropdownIcon: {
                    right: 0
                },
                datePickerGroup: {
                    display: "flex",
                    justifyContent: "space-between"
                },
                datePicker: {
                    flex: 1
                },
                dateInput: {
                    width: "auto",
                    flex: 1
                },
                dateClose: {
                    lineHeight: "48px",
                    right: 5,
                    position: "relative"
                }
            };
        }
    }]);

    function SearchDatePanel(props) {
        _classCallCheck(this, SearchDatePanel);

        _React$Component.call(this, props);

        this.state = {
            value: 'custom',
            startDate: null,
            endDate: null
        };
    }

    SearchDatePanel.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        if (prevState !== this.state) {
            var _state = this.state;
            var value = _state.value;
            var startDate = _state.startDate;
            var endDate = _state.endDate;

            if (value === 'custom' && !startDate && !endDate) {
                this.props.onChange({ ajxp_modiftime: null });
            }
            var startDay = function startDay(date) {
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(1);
                return date;
            };
            var endDay = function endDay(date) {
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(59);
                return date;
            };

            if (value === 'custom') {
                if (!startDate) {
                    startDate = new Date(0);
                }
                if (!endDate) {
                    // Next year
                    endDate = new Date();
                    endDate.setFullYear(endDate.getFullYear() + 1);
                }
                this.props.onChange({ ajxp_modiftime: { from: startDate, to: endDate } });
            } else if (value === 'PYDIO_SEARCH_RANGE_TODAY') {
                this.props.onChange({ ajxp_modiftime: {
                        from: startDay(new Date()),
                        to: endDay(new Date())
                    } });
            } else if (value === 'PYDIO_SEARCH_RANGE_YESTERDAY') {
                var y = new Date();
                y.setDate(y.getDate() - 1);
                var e = new Date();
                e.setDate(e.getDate() - 1);
                this.props.onChange({ ajxp_modiftime: {
                        from: startDay(y),
                        to: endDay(e)
                    } });
            } else if (value === 'PYDIO_SEARCH_RANGE_LAST_WEEK') {
                var s = new Date();
                s.setDate(s.getDate() - 7);
                var e = new Date();
                this.props.onChange({ ajxp_modiftime: {
                        from: s,
                        to: e
                    } });
            } else if (value === 'PYDIO_SEARCH_RANGE_LAST_MONTH') {
                var s = new Date();
                s.setMonth(s.getMonth() - 1);
                var e = new Date();
                this.props.onChange({ ajxp_modiftime: {
                        from: s,
                        to: e
                    } });

                this.props.onChange({ ajxp_modiftime: { from: startDate, to: endDate } });
            } else if (value === 'PYDIO_SEARCH_RANGE_LAST_YEAR') {
                var s = new Date();
                s.setFullYear(s.getFullYear() - 1);
                var e = new Date();
                this.props.onChange({ ajxp_modiftime: {
                        from: s,
                        to: e
                    } });
            }
        }
    };

    SearchDatePanel.prototype.render = function render() {
        var _this = this;

        var today = new Date();

        var _SearchDatePanel$styles = SearchDatePanel.styles;
        var dropdownLabel = _SearchDatePanel$styles.dropdownLabel;
        var dropdownUnderline = _SearchDatePanel$styles.dropdownUnderline;
        var dropdownIcon = _SearchDatePanel$styles.dropdownIcon;
        var datePickerGroup = _SearchDatePanel$styles.datePickerGroup;
        var datePicker = _SearchDatePanel$styles.datePicker;
        var dateInput = _SearchDatePanel$styles.dateInput;
        var dateClose = _SearchDatePanel$styles.dateClose;
        var _props = this.props;
        var inputStyle = _props.inputStyle;
        var getMessage = _props.getMessage;
        var _state2 = this.state;
        var value = _state2.value;
        var startDate = _state2.startDate;
        var endDate = _state2.endDate;

        return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(
                DatePickerFeed,
                { pydio: this.props.pydio },
                function (items) {
                    return _react2['default'].createElement(
                        _materialUi.DropDownMenu,
                        { autoWidth: false, labelStyle: dropdownLabel, underlineStyle: dropdownUnderline, iconStyle: dropdownIcon, style: inputStyle, value: value, onChange: function (e, index, value) {
                                return _this.setState({ value: value });
                            } },
                        items.map(function (item) {
                            return _react2['default'].createElement(_materialUi.MenuItem, { value: item.payload, label: item.text, primaryText: item.text });
                        })
                    );
                }
            ),
            value === 'custom' && _react2['default'].createElement(
                'div',
                { style: _extends({}, datePickerGroup, inputStyle) },
                _react2['default'].createElement(_materialUi.DatePicker, {
                    textFieldStyle: dateInput,
                    style: datePicker,
                    value: startDate,
                    onChange: function (e, date) {
                        return _this.setState({ startDate: date });
                    },
                    hintText: getMessage(491),
                    autoOk: true,
                    maxDate: endDate || today,
                    defaultDate: startDate
                }),
                _react2['default'].createElement('span', { className: 'mdi mdi-close', style: dateClose, onClick: function () {
                        return _this.setState({ startDate: null });
                    } }),
                _react2['default'].createElement(_materialUi.DatePicker, {
                    textFieldStyle: dateInput,
                    style: datePicker,
                    value: endDate,
                    onChange: function (e, date) {
                        return _this.setState({ endDate: date });
                    },
                    hintText: getMessage(492),
                    autoOk: true,
                    minDate: startDate,
                    maxDate: today,
                    defaultDate: endDate
                }),
                _react2['default'].createElement('span', { className: 'mdi mdi-close', style: dateClose, onClick: function () {
                        return _this.setState({ endDate: null });
                    } })
            )
        );
    };

    return SearchDatePanel;
})(_react2['default'].Component);

var DatePickerFeed = function DatePickerFeed(_ref) {
    var pydio = _ref.pydio;
    var getMessage = _ref.getMessage;
    var children = _ref.children;

    var items = [{ payload: 'custom', text: getMessage('612') }, { payload: 'PYDIO_SEARCH_RANGE_TODAY', text: getMessage('493') }, { payload: 'PYDIO_SEARCH_RANGE_YESTERDAY', text: getMessage('494') }, { payload: 'PYDIO_SEARCH_RANGE_LAST_WEEK', text: getMessage('495') }, { payload: 'PYDIO_SEARCH_RANGE_LAST_MONTH', text: getMessage('496') }, { payload: 'PYDIO_SEARCH_RANGE_LAST_YEAR', text: getMessage('497') }];

    return children(items);
};

SearchDatePanel = PydioContextConsumer(SearchDatePanel);
DatePickerFeed = PydioContextConsumer(DatePickerFeed);
exports['default'] = SearchDatePanel;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","react":"react"}],69:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var SearchFileFormatPanel = (function (_Component) {
    _inherits(SearchFileFormatPanel, _Component);

    function SearchFileFormatPanel(props) {
        _classCallCheck(this, SearchFileFormatPanel);

        _Component.call(this, props);

        this.state = {
            folder: this.props.values['ajxp_mime'] && this.props.values['ajxp_mime'] === 'ajxp_folder' ? true : undefined,
            ext: this.props.values['ajxp_mime'] && this.props.values['ajxp_mime'] !== 'ajxp_folder' ? this.props.values['ajxp_mime'] : undefined
        };
    }

    SearchFileFormatPanel.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        if (prevState === this.state) return;

        var _state = this.state;
        var folder = _state.folder;
        var ext = _state.ext;

        this.props.onChange({
            ajxp_mime: folder ? 'ajxp_folder' : ext
        });
    };

    SearchFileFormatPanel.prototype.render = function render() {
        var _this = this;

        var _props = this.props;
        var inputStyle = _props.inputStyle;
        var getMessage = _props.getMessage;

        var props = _objectWithoutProperties(_props, ['inputStyle', 'getMessage']);

        return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(_materialUi.Toggle, {
                style: inputStyle,
                name: 'toggleFolder',
                value: 'ajxp_folder',
                label: getMessage(502),
                toggled: this.state.folder,
                onToggle: function (e, toggled) {
                    return _this.setState({ folder: toggled });
                }
            }),
            !this.state.folder && _react2['default'].createElement(_materialUi.TextField, {
                style: inputStyle,
                className: 'mui-text-field',
                hintText: getMessage(500),
                floatingLabelFixed: true,
                floatingLabelText: getMessage(500),
                value: this.state.ext,
                onChange: function (e) {
                    return _this.setState({ ext: e.target.value });
                }
            })
        );
    };

    return SearchFileFormatPanel;
})(_react.Component);

SearchFileFormatPanel = PydioContextConsumer(SearchFileFormatPanel);
exports['default'] = SearchFileFormatPanel;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","react":"react"}],70:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var SearchFileSizePanel = (function (_React$Component) {
    _inherits(SearchFileSizePanel, _React$Component);

    function SearchFileSizePanel(props) {
        _classCallCheck(this, SearchFileSizePanel);

        _React$Component.call(this, props);

        this.state = {
            from: false,
            to: null
        };
    }

    SearchFileSizePanel.prototype.onChange = function onChange() {
        this.setState({
            from: this.refs.from.getValue() || 0,
            to: this.refs.to.getValue() || 1099511627776
        });
    };

    SearchFileSizePanel.prototype.componentWillUpdate = function componentWillUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return;
        }

        var from = nextState.from;
        var to = nextState.to;

        this.props.onChange({
            ajxp_bytesize: from || to ? { from: from, to: to } : null
        });
    };

    SearchFileSizePanel.prototype.render = function render() {
        var _props = this.props;
        var inputStyle = _props.inputStyle;
        var getMessage = _props.getMessage;

        var props = _objectWithoutProperties(_props, ['inputStyle', 'getMessage']);

        return _react2['default'].createElement(
            'div',
            null,
            _react2['default'].createElement(_materialUi.TextField, {
                ref: 'from',
                style: inputStyle,
                hintText: getMessage(504),
                floatingLabelFixed: true,
                floatingLabelText: getMessage(613),
                onChange: this.onChange.bind(this)
            }),
            _react2['default'].createElement(_materialUi.TextField, {
                ref: 'to',
                style: inputStyle,
                hintText: getMessage(504),
                floatingLabelFixed: true,
                floatingLabelText: getMessage(614),
                onChange: this.onChange.bind(this)
            })
        );
    };

    return SearchFileSizePanel;
})(_react2['default'].Component);

SearchFileSizePanel = PydioContextConsumer(SearchFileSizePanel);
exports['default'] = SearchFileSizePanel;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","react":"react"}],71:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _SearchScopeSelector = require('./SearchScopeSelector');

var _SearchScopeSelector2 = _interopRequireDefault(_SearchScopeSelector);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _materialUiStyles = require('material-ui/styles');

/**
 * Subpane for search form
 */

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var MainSearch = (function (_Component) {
    _inherits(MainSearch, _Component);

    _createClass(MainSearch, null, [{
        key: 'propTypes',
        get: function get() {
            return {
                title: _react.PropTypes.string,
                mode: _react.PropTypes.string,
                onOpen: _react.PropTypes.func,
                onAdvanced: _react.PropTypes.func,
                onMore: _react.PropTypes.func,
                onClose: _react.PropTypes.func,
                hintText: _react.PropTypes.string,
                loading: _react.PropTypes.bool,
                scopeSelectorProps: _react.PropTypes.object,
                showAdvanced: _react.PropTypes.bool
            };
        }
    }, {
        key: 'styles',
        get: function get() {
            return {
                main: {
                    background: "#ffffff",
                    width: "100%",
                    height: 36,
                    border: "none",
                    transition: 'all .25s',
                    display: 'flex'
                },
                input: {
                    padding: "0 4px",
                    border: 0
                },
                hint: {
                    transition: 'all .25s',
                    width: "100%",
                    padding: "0 4px",
                    bottom: 0,
                    lineHeight: "36px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                },
                magnifier: {
                    padding: '7px 0 0 8px',
                    fontSize: 23,
                    color: 'rgba(0, 0, 0, 0.33)'
                },
                underline: {
                    display: "none"
                },
                closedMode: {
                    main: {
                        background: 'rgba(255,255,255,.1)',
                        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
                        borderRadius: 2
                    },
                    magnifier: {
                        fontSize: 18,
                        color: 'rgba(255, 255, 255, 0.64)'
                    },
                    input: {
                        color: 'rgba(255, 255, 255, 0.64)'
                    },
                    hint: {
                        color: 'rgba(255, 255, 255, 0.64)'
                    }
                }
            };
        }
    }]);

    function MainSearch(props) {
        _classCallCheck(this, MainSearch);

        _Component.call(this, props);

        this.state = {
            mode: props.mode,
            value: props.value || ''
        };

        // Making sure we don't send too many requests
        // this.onChange = _.debounce(this.onChange, 500)
    }

    MainSearch.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.setState({
            mode: nextProps.mode
        });
        if (nextProps.value && !this.state.value) {
            this.setState({ value: nextProps.value });
        }
    };

    MainSearch.prototype.componentDidUpdate = function componentDidUpdate() {
        if (this.state.mode !== 'closed') {
            this.input && this.input.focus();
        }
    };

    MainSearch.prototype.onChange = function onChange(value) {
        var _this = this;

        this.setState({ value: value }, function () {
            _this.props.onChange({ 'basename': value });
        });
    };

    MainSearch.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props;
        var title = _props.title;
        var mode = _props.mode;
        var onOpen = _props.onOpen;
        var onAdvanced = _props.onAdvanced;
        var onMore = _props.onMore;
        var onClose = _props.onClose;
        var hintText = _props.hintText;
        var loading = _props.loading;
        var scopeSelectorProps = _props.scopeSelectorProps;
        var showAdvanced = _props.showAdvanced;
        var getMessage = _props.getMessage;
        var _MainSearch$styles = MainSearch.styles;
        var main = _MainSearch$styles.main;
        var input = _MainSearch$styles.input;
        var hint = _MainSearch$styles.hint;
        var underline = _MainSearch$styles.underline;
        var magnifier = _MainSearch$styles.magnifier;
        var closedMode = _MainSearch$styles.closedMode;

        if (mode === 'closed') {
            main = _extends({}, main, closedMode.main);
            hint = _extends({}, hint, closedMode.hint);
            input = _extends({}, input, closedMode.input);
            magnifier = _extends({}, magnifier, closedMode.magnifier);
        }
        var topStyle = {};
        if (mode !== 'closed') {
            topStyle = { backgroundColor: this.props.muiTheme.palette.accent2Color };
        }

        return _react2['default'].createElement(
            'div',
            { className: 'search-input', style: topStyle },
            _react2['default'].createElement(
                'div',
                { className: 'panel-header', style: { display: 'flex' } },
                scopeSelectorProps && _react2['default'].createElement(
                    'span',
                    null,
                    _react2['default'].createElement(_SearchScopeSelector2['default'], _extends({ style: { marginTop: -16, marginLeft: -26 }, labelStyle: { color: 'white' } }, scopeSelectorProps))
                ),
                _react2['default'].createElement('span', { style: { flex: 1 } }),
                showAdvanced && _react2['default'].createElement(
                    _materialUi.FlatButton,
                    { style: { textTransform: 'none', color: 'white', fontSize: 15, marginTop: -5, padding: '0 16px' }, onTouchTap: mode === 'advanced' ? onMore : onAdvanced },
                    mode === 'advanced' ? '- ' + getMessage(606) : '+ ' + getMessage(605)
                ),
                mode === 'advanced' && loading && _react2['default'].createElement(
                    'div',
                    { style: { marginRight: 10 } },
                    _react2['default'].createElement(_materialUi.CircularProgress, { size: 20, thickness: 3 })
                ),
                _react2['default'].createElement('span', { className: 'panel-header-close mdi mdi-close', onClick: this.props.onClose })
            ),
            mode !== 'advanced' && _react2['default'].createElement(
                'div',
                { style: main },
                _react2['default'].createElement(_materialUi.FontIcon, { className: 'mdi mdi-magnify', style: magnifier }),
                _react2['default'].createElement(_materialUi.TextField, {
                    ref: function (input) {
                        return _this2.input = input;
                    },
                    style: { flex: 1, height: main.height },
                    inputStyle: input,
                    hintStyle: hint,
                    fullWidth: true,
                    underlineShow: false,
                    onFocus: onOpen,
                    onBlur: mode === 'small' ? onClose : null,
                    hintText: hintText,
                    value: this.state.value || '',
                    onChange: function (e, v) {
                        return _this2.onChange(v);
                    },
                    onKeyPress: function (e) {
                        return e.key === 'Enter' ? _this2.onChange(e.target.value) : null;
                    }
                }),
                loading && _react2['default'].createElement(
                    'div',
                    { style: { marginTop: 9, marginRight: 9 } },
                    _react2['default'].createElement(_materialUi.CircularProgress, { size: 20, thickness: 3 })
                )
            )
        );
    };

    return MainSearch;
})(_react.Component);

exports['default'] = MainSearch = PydioContextConsumer(_materialUiStyles.muiThemeable()(MainSearch));
exports['default'] = MainSearch;
module.exports = exports['default'];

},{"./SearchScopeSelector":73,"lodash":3,"material-ui":"material-ui","material-ui/styles":"material-ui/styles","pydio":"pydio","react":"react"}],72:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _viewsFilePreview = require('../../views/FilePreview');

var _viewsFilePreview2 = _interopRequireDefault(_viewsFilePreview);

var _AdvancedSearch = require('./AdvancedSearch');

var _AdvancedSearch2 = _interopRequireDefault(_AdvancedSearch);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _pydioUtilLang = require('pydio/util/lang');

var _pydioUtilLang2 = _interopRequireDefault(_pydioUtilLang);

var _pydioHttpSearchApi = require('pydio/http/search-api');

var _pydioHttpSearchApi2 = _interopRequireDefault(_pydioHttpSearchApi);

var _SearchScopeSelector = require('./SearchScopeSelector');

var _SearchScopeSelector2 = _interopRequireDefault(_SearchScopeSelector);

var _MainSearch = require('./MainSearch');

var _MainSearch2 = _interopRequireDefault(_MainSearch);

var _materialUi = require('material-ui');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

/**
 * Multi-state search component
 */

var _Pydio$requireLib = _pydio2['default'].requireLib('components');

var EmptyStateView = _Pydio$requireLib.EmptyStateView;

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var SearchForm = (function (_Component) {
    _inherits(SearchForm, _Component);

    function SearchForm(props) {
        var _this = this;

        _classCallCheck(this, SearchForm);

        _Component.call(this, props);

        // Create Fake DM
        this._basicDataModel = new PydioDataModel(true);
        var rNodeProvider = new EmptyNodeProvider();
        this._basicDataModel.setAjxpNodeProvider(rNodeProvider);
        var rootNode = new AjxpNode("/", false, '', '', rNodeProvider);
        this._basicDataModel.setRootNode(rootNode);

        this.state = {
            values: {},
            display: 'closed',
            dataModel: this._basicDataModel,
            empty: true,
            loading: false,
            searchScope: props.uniqueSearchScope || 'folder'
        };

        this.setMode = _lodash2['default'].debounce(this.setMode, 250);
        this.update = _lodash2['default'].debounce(this.update, 500);
        this.submit = _lodash2['default'].debounce(this.submit, 500);

        this.props.pydio.observe('repository_list_refreshed', function () {
            _this.setState({
                values: {},
                display: 'closed',
                dataModel: _this._basicDataModel,
                empty: true,
                loading: false
            });
        });
    }

    SearchForm.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        var _this2 = this;

        if (this.refs.results && this.refs.results.refs.list) {
            this.refs.results.refs.list.updateInfiniteContainerHeight();
            FuncUtils.bufferCallback('search_results_resize_list', 550, function () {
                try {
                    _this2.refs.results.refs.list.updateInfiniteContainerHeight();
                } catch (e) {}
            });
        }
    };

    SearchForm.prototype.setMode = function setMode(mode) {
        if (mode === 'small' && this.state.display !== 'closed') return; // we can only set to small when the previous state was closed
        if (mode === 'more' && this.state.display === 'advanced') {
            var _state$values = this.state.values;
            var basename = _state$values.basename;

            var otherValues = _objectWithoutProperties(_state$values, ['basename']);

            if (basename) this.setState({ values: { basename: basename } }, this.submit);else this.setState({ values: {} }, this.submit);
        } else if (mode === 'small' && this.state.display === 'closed') {
            var _state$values2 = this.state.values;
            var basename = _state$values2.basename;

            var otherValues = _objectWithoutProperties(_state$values2, ['basename']);

            if (otherValues && Object.keys(otherValues).length) {
                mode = 'advanced';
            }
        }
        this.setState({
            display: mode
        });
    };

    SearchForm.prototype.update = function update(newValues) {
        var values = _extends({}, this.state.values, newValues);

        // Removing empty values
        Object.keys(values).forEach(function (key) {
            return !values[key] && delete values[key];
        });

        this.setState({ values: values }, this.submit);
    };

    SearchForm.prototype.submit = function submit() {
        var _this3 = this;

        var _state = this.state;
        var display = _state.display;
        var values = _state.values;
        var searchScope = _state.searchScope;
        var dataModel = _state.dataModel;
        var crossWorkspace = this.props.crossWorkspace;

        var limit = crossWorkspace || searchScope === 'all' ? 6 : display === 'small' ? 9 : 100;
        var rootNode = dataModel.getRootNode();
        rootNode.setChildren([]);
        rootNode.setLoaded(true);

        var keys = Object.keys(values);
        if (keys.length === 0 || keys.length === 1 && keys[0] === 'basename' && !values['basename']) {
            this.setState({ loading: false, empty: true });
            return;
        }
        this.setState({ loading: true, empty: false });

        var api = new _pydioHttpSearchApi2['default'](this.props.pydio);
        api.search(values, crossWorkspace ? 'all' : searchScope, limit).then(function (results) {
            rootNode.setChildren(results);
            rootNode.setLoaded(true);
            _this3.setState({ loading: false });
        });
    };

    SearchForm.prototype.render = function render() {
        var _this4 = this;

        var _props = this.props;
        var crossWorkspace = _props.crossWorkspace;
        var pydio = _props.pydio;
        var getMessage = _props.getMessage;
        var _state2 = this.state;
        var searchScope = _state2.searchScope;
        var display = _state2.display;
        var loading = _state2.loading;
        var dataModel = _state2.dataModel;
        var empty = _state2.empty;
        var values = _state2.values;

        var renderSecondLine = null,
            renderIcon = null,
            elementHeight = 49;
        if (display !== 'small' && display !== 'closed') {
            elementHeight = PydioComponents.SimpleList.HEIGHT_TWO_LINES + 10;
            renderSecondLine = function (node) {
                var path = node.getPath();
                if (searchScope === 'folder') {
                    var crtFolder = pydio.getContextHolder().getContextNode().getPath();
                    if (path.indexOf(crtFolder) === 0) {
                        path = './' + _pydioUtilLang2['default'].trimLeft(path.substr(crtFolder.length), '/');
                    }
                }
                return _react2['default'].createElement(
                    'div',
                    null,
                    path
                );
            };
            renderIcon = function (node) {
                var entryProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                return _react2['default'].createElement(_viewsFilePreview2['default'], { loadThumbnail: !entryProps['parentIsScrolling'], node: node });
            };
        } else {
            renderIcon = function (node) {
                var entryProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

                return _react2['default'].createElement(_viewsFilePreview2['default'], { loadThumbnail: false, richPreview: false, node: node,
                    style: { width: 30, height: 30, borderRadius: '50%', margin: '9px 6px' },
                    mimeFontStyle: { fontSize: 16, display: 'block', padding: '4px 7px' }
                });
            };
        }

        var nodeClicked = function nodeClicked(node) {
            pydio.goTo(node);
            _this4.setMode('closed');
        };

        var searchScopeChanged = function searchScopeChanged(value) {
            if (display === 'small') {
                setTimeout(function () {
                    return _this4.setMode('small');
                }, 250);
            }
            _this4.setState({ searchScope: value });
            _this4.submit();
        };

        var style = this.props.style;
        var zDepth = 2;
        if (display === 'closed') {
            zDepth = 0;
            style = _extends({}, style, { backgroundColor: 'transparent' });
        } else {
            style = _extends({}, style, { backgroundColor: '#f5f5f5' });
        }

        return _react2['default'].createElement(
            _materialUi.Paper,
            { ref: 'root', zDepth: zDepth, className: "top_search_form " + display, style: style },
            _react2['default'].createElement(_MainSearch2['default'], {
                mode: display,
                value: values.basename,
                title: display === 'advanced' ? 'Advanced Search' : null,
                onOpen: function () {
                    return _this4.setMode("small");
                },
                showAdvanced: !this.props.crossWorkspace,
                onAdvanced: function () {
                    return _this4.setMode("advanced");
                },
                onClose: function () {
                    return _this4.setMode("closed");
                },
                onMore: function () {
                    return _this4.setMode("more");
                },
                onChange: function (values) {
                    return _this4.update(values);
                },
                onSubmit: function () {
                    return _this4.submit();
                },
                hintText: getMessage(this.props.crossWorkspace || searchScope === 'all' ? 607 : 87) + "...",
                loading: loading,
                scopeSelectorProps: this.props.crossWorkspace || this.props.uniqueSearchScope ? null : {
                    value: searchScope,
                    onChange: searchScopeChanged
                }
            }),
            display === 'advanced' && _react2['default'].createElement(_AdvancedSearch2['default'], _extends({}, this.props, {
                values: values,
                onChange: function (values) {
                    return _this4.update(values);
                },
                onSubmit: function () {
                    return _this4.submit();
                }
            })),
            _react2['default'].createElement(
                'div',
                { className: 'search-results', style: display === 'small' ? { backgroundColor: 'white' } : null },
                empty && _react2['default'].createElement(EmptyStateView, {
                    iconClassName: '',
                    primaryTextId: 611,
                    style: { minHeight: 180, backgroundColor: 'transparent', padding: '0 20px' }
                }),
                _react2['default'].createElement(PydioComponents.NodeListCustomProvider, {
                    ref: 'results',
                    className: display !== 'small' ? 'files-list' : null,
                    elementHeight: elementHeight,
                    entryRenderIcon: renderIcon,
                    entryRenderActions: function () {
                        return null;
                    },
                    entryRenderSecondLine: renderSecondLine,
                    presetDataModel: dataModel,
                    heightAutoWithMax: display === 'small' ? 500 : display === 'advanced' ? 512 : 412,
                    openCollection: nodeClicked,
                    nodeClicked: nodeClicked,
                    defaultGroupBy: crossWorkspace || searchScope === 'all' ? 'repository_id' : null,
                    groupByLabel: crossWorkspace || searchScope === 'all' ? 'repository_display' : null,
                    emptyStateProps: {
                        iconClassName: "",
                        primaryTextId: 478,
                        style: {
                            minHeight: display === 'small' ? 180 : display === 'advanced' ? 512 : 412,
                            backgroundColor: 'transparent',
                            padding: '0 20px'
                        },
                        secondaryTextId: searchScope === 'ws' ? 620 : searchScope === 'folder' ? 619 : null,
                        actionLabelId: searchScope === 'ws' ? 610 : searchScope === 'folder' ? 609 : null,
                        actionCallback: searchScope !== 'all' ? function () {
                            searchScopeChanged(searchScope === 'ws' ? 'all' : 'ws');
                        } : null,
                        actionStyle: { marginTop: 10 }
                    }
                }),
                display === 'small' && _react2['default'].createElement(
                    'div',
                    { style: { display: 'flex', alignItems: 'center', padding: 5, paddingLeft: 0, backgroundColor: '#f5f5f5' } },
                    !this.props.crossWorkspace && !this.props.uniqueSearchScope && _react2['default'].createElement(_SearchScopeSelector2['default'], { style: { flex: 1, maxWidth: 162 }, labelStyle: { paddingLeft: 8 }, value: searchScope, onChange: searchScopeChanged, onTouchTap: function () {
                            return _this4.setMode('small');
                        } }),
                    _react2['default'].createElement(_materialUi.FlatButton, { style: { marginTop: 4 }, primary: true, label: getMessage(456), onFocus: function () {
                            return _this4.setMode("small");
                        }, onTouchTap: function () {
                            return _this4.setMode("more");
                        }, onClick: function () {
                            return _this4.setMode("more");
                        } })
                )
            )
        );
    };

    return SearchForm;
})(_react.Component);

SearchForm = PydioContextConsumer(SearchForm);
exports['default'] = SearchForm;
module.exports = exports['default'];

},{"../../views/FilePreview":81,"./AdvancedSearch":67,"./MainSearch":71,"./SearchScopeSelector":73,"lodash":3,"material-ui":"material-ui","pydio":"pydio","pydio/http/search-api":"pydio/http/search-api","pydio/util/lang":"pydio/util/lang","react":"react"}],73:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _materialUi = require('material-ui');

var _require$requireLib = require('pydio').requireLib('boot');

var PydioContextConsumer = _require$requireLib.PydioContextConsumer;

var SearchScopeSelector = (function (_Component) {
    _inherits(SearchScopeSelector, _Component);

    function SearchScopeSelector() {
        _classCallCheck(this, SearchScopeSelector);

        _Component.apply(this, arguments);
    }

    SearchScopeSelector.prototype.render = function render() {
        var _this = this;

        var getMessage = this.props.getMessage;

        return _react2['default'].createElement(
            _materialUi.DropDownMenu,
            {
                value: this.props.value,
                onChange: function (e, i, v) {
                    _this.props.onChange(v);
                },
                onTouchTap: this.props.onTouchTap,
                autoWidth: true,
                style: this.props.style,
                underlineStyle: { display: 'none' },
                labelStyle: this.props.labelStyle
            },
            _react2['default'].createElement(_materialUi.MenuItem, { value: 'folder', primaryText: getMessage(608) }),
            _react2['default'].createElement(_materialUi.MenuItem, { value: 'ws', primaryText: getMessage(609) }),
            _react2['default'].createElement(_materialUi.MenuItem, { value: 'all', primaryText: getMessage(610) })
        );
    };

    _createClass(SearchScopeSelector, null, [{
        key: 'propTypes',
        get: function get() {
            return {
                value: _react.PropTypes.string,
                onChange: _react.PropTypes.func.isRequired,
                onTouchTap: _react.PropTypes.func.isRequired,
                style: _react.PropTypes.object,
                labelStyle: _react.PropTypes.object
            };
        }
    }]);

    return SearchScopeSelector;
})(_react.Component);

exports['default'] = SearchScopeSelector = PydioContextConsumer(SearchScopeSelector);
exports['default'] = SearchScopeSelector;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","react":"react"}],74:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

var _componentsSearchForm = require('./components/SearchForm');

exports.SearchForm = _interopRequire(_componentsSearchForm);

},{"./components/SearchForm":72}],75:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _materialUi = require('material-ui');

var _pydioModelIdmObjectHelper = require('pydio/model/idm-object-helper');

var _pydioModelIdmObjectHelper2 = _interopRequireDefault(_pydioModelIdmObjectHelper);

var _pydioUtilDom = require('pydio/util/dom');

var _pydioUtilDom2 = _interopRequireDefault(_pydioUtilDom);

var _Pydio$requireLib = _pydio2['default'].requireLib('components');

var AddressBook = _Pydio$requireLib.AddressBook;
var UserAvatar = _Pydio$requireLib.UserAvatar;
var CellActionsRenderer = _Pydio$requireLib.CellActionsRenderer;

var AddressBookPanel = (function (_React$Component) {
    _inherits(AddressBookPanel, _React$Component);

    function AddressBookPanel(props) {
        var _this = this;

        _classCallCheck(this, AddressBookPanel);

        _React$Component.call(this, props);
        this.state = { noCell: false, cellModel: null };
        this._observer = function () {
            _this.forceUpdate();
        };
    }

    AddressBookPanel.prototype.componentDidMount = function componentDidMount() {
        this.loadCell();
    };

    AddressBookPanel.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.state.cellModel) {
            this.state.cellModel.stopObserving('update', this._observer);
        }
    };

    AddressBookPanel.prototype.loadCell = function loadCell() {
        var _this2 = this;

        var pydio = this.props.pydio;

        pydio.user.getActiveRepositoryAsCell().then(function (cell) {
            if (cell) {
                cell.observe('update', _this2._observer);
                _this2.setState({ cellModel: cell, noCell: false, cellId: pydio.user.activeRepository });
            } else {
                _this2.setState({ noCell: true, cellId: pydio.user.activeRepository });
            }
        });
    };

    AddressBookPanel.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.pydio.user.activeRepository !== this.state.cellId) {
            if (this.state.cellModel) {
                this.state.cellModel.stopObserving('update', this._observer);
            }
            this.loadCell();
        }
    };

    AddressBookPanel.prototype.renderListItem = function renderListItem(acl) {
        var pydio = this.props.pydio;
        var cellModel = this.state.cellModel;

        var label = _pydioModelIdmObjectHelper2['default'].extractLabel(pydio, acl);
        var userAvatar = undefined,
            avatarIcon = undefined,
            userType = undefined,
            userId = undefined;
        if (acl.User && acl.User.Attributes && acl.User.Attributes['avatar']) {
            userAvatar = acl.User.Attributes['avatar'];
        }
        if (acl.User) {
            userType = 'user';
            userId = acl.User.Login;
        } else if (acl.Group) {
            userType = 'group';
            userId = acl.Group.Uuid;
        } else {
            userId = acl.Role.Uuid;
            userType = 'team';
        }

        var avatar = _react2['default'].createElement(UserAvatar, {
            avatarSize: 36,
            pydio: pydio,
            userType: userType,
            userId: userId,
            userLabel: label,
            avatar: userAvatar,
            avatarOnly: true,
            useDefaultAvatar: true
        });

        var rightMenu = undefined;
        var menuItems = new CellActionsRenderer(pydio, cellModel, acl).renderItems();
        if (menuItems.length) {
            rightMenu = _react2['default'].createElement(
                _materialUi.IconMenu,
                {
                    iconButtonElement: _react2['default'].createElement(_materialUi.IconButton, { iconClassName: 'mdi mdi-dots-vertical', iconStyle: { color: 'rgba(0,0,0,.33)' } }),
                    targetOrigin: { horizontal: 'right', vertical: 'top' },
                    anchorOrigin: { horizontal: 'right', vertical: 'top' }
                },
                menuItems
            );
        }

        return _react2['default'].createElement(_materialUi.ListItem, { primaryText: label, leftAvatar: avatar, rightIconButton: rightMenu });
    };

    AddressBookPanel.prototype.render = function render() {
        var _this3 = this;

        var pydio = this.props.pydio;
        var _state = this.state;
        var cellModel = _state.cellModel;
        var noCell = _state.noCell;

        var cellInfo = undefined;
        if (!noCell && cellModel) {
            (function () {
                var acls = cellModel.getAcls();
                var items = [];
                Object.keys(acls).map(function (roleId) {
                    items.push(_this3.renderListItem(acls[roleId]));
                    items.push(_react2['default'].createElement(_materialUi.Divider, { inset: true }));
                });
                items.pop();
                cellInfo = _react2['default'].createElement(
                    'div',
                    { style: { borderBottom: '1px solid #e0e0e0' } },
                    _react2['default'].createElement(
                        _materialUi.List,
                        null,
                        _react2['default'].createElement(
                            _materialUi.Subheader,
                            null,
                            pydio.MessageHash['639']
                        ),
                        items
                    )
                );
            })();
        }
        var columnStyle = {
            position: 'absolute',
            width: 270,
            top: 110,
            bottom: 0,
            backgroundColor: '#fafafa',
            borderLeft: '1px solid #e0e0e0',
            transition: _pydioUtilDom2['default'].getBeziersTransition()
        };

        return _react2['default'].createElement(
            'div',
            { id: "info_panel", style: _extends({}, columnStyle, { display: 'flex', flexDirection: 'column' }) },
            cellInfo,
            _react2['default'].createElement(AddressBook, {
                mode: 'selector',
                bookColumn: true,
                pydio: pydio,
                disableSearch: false,
                style: { height: null, flex: 1 },
                actionsForCell: !noCell && cellModel ? cellModel : true
            })
        );
    };

    return AddressBookPanel;
})(_react2['default'].Component);

exports['default'] = AddressBookPanel;
module.exports = exports['default'];

},{"material-ui":"material-ui","pydio":"pydio","pydio/model/idm-object-helper":"pydio/model/idm-object-helper","pydio/util/dom":"pydio/util/dom","react":"react"}],76:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var PydioNode = require('pydio/model/node');

var _require = require('material-ui/styles');

var muiThemeable = _require.muiThemeable;

var LangUtils = require('pydio/util/lang');

var _require2 = require('react-textfit');

var Textfit = _require2.Textfit;

var Breadcrumb = React.createClass({
    displayName: 'Breadcrumb',

    getInitialState: function getInitialState() {
        return { node: null };
    },

    componentDidMount: function componentDidMount() {
        var n = this.props.pydio.getContextHolder().getContextNode();
        if (n) {
            this.setState({ node: n });
        }
        this._observer = (function (event) {
            this.setState({ node: event.memo });
        }).bind(this);
        this.props.pydio.getContextHolder().observe("context_changed", this._observer);
    },

    componentWillUnmount: function componentWillUnmount() {
        this.props.pydio.getContextHolder().stopObserving("context_changed", this._observer);
    },

    goTo: function goTo(target, event) {
        var targetNode = new PydioNode(target);
        this.props.pydio.getContextHolder().requireContextChange(targetNode);
    },

    render: function render() {
        var pydio = this.props.pydio;
        var styles = {
            main: {
                fontSize: 22,
                lineHeight: '24px',
                padding: 20,
                color: this.props.muiTheme.appBar.textColor,
                maxWidth: '70%',
                flex: 1
            }
        };
        if (!pydio.user) {
            return React.createElement('span', { className: 'react_breadcrumb' });
        }
        var repoLabel = ' ';
        if (pydio.user && pydio.user.activeRepository && pydio.user.repositories.has(pydio.user.activeRepository)) {
            repoLabel = pydio.user.repositories.get(pydio.user.activeRepository).getLabel();
        }
        var segments = [];
        var path = this.state.node ? LangUtils.trimLeft(this.state.node.getPath(), '/') : '';
        var label = this.state.node ? this.state.node.getLabel() : '';
        var rebuilt = '';
        var mainStyle = this.props.rootStyle || {};
        mainStyle = _extends({}, styles.main, mainStyle);
        var parts = path.split('/');
        parts.forEach((function (seg, i) {
            if (!seg) return;
            rebuilt += '/' + seg;
            segments.push(React.createElement(
                'span',
                { key: 'bread_sep_' + i, className: 'separator' },
                ' / '
            ));
            segments.push(React.createElement(
                'span',
                { key: 'bread_' + i, className: 'segment', onClick: this.goTo.bind(this, rebuilt) },
                i === parts.length - 1 ? label : seg
            ));
        }).bind(this));
        return React.createElement(
            Textfit,
            { mode: 'single', perfectFit: false, min: 12, max: 22, className: 'react_breadcrumb', style: mainStyle },
            this.props.startWithSeparator && React.createElement(
                'span',
                { className: 'separator' },
                ' / '
            ),
            React.createElement(
                'span',
                { className: 'segment first', onClick: this.goTo.bind(this, '/') },
                repoLabel
            ),
            segments
        );
    }

});

exports['default'] = Breadcrumb = muiThemeable()(Breadcrumb);

exports['default'] = Breadcrumb;
module.exports = exports['default'];

},{"material-ui/styles":"material-ui/styles","pydio/model/node":"pydio/model/node","pydio/util/lang":"pydio/util/lang","react":"react","react-textfit":"react-textfit"}],77:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _Pydio$requireLib = _pydio2['default'].requireLib('components');

var Chat = _Pydio$requireLib.Chat;

var CellChat = (function (_React$Component) {
    _inherits(CellChat, _React$Component);

    function CellChat(props) {
        _classCallCheck(this, CellChat);

        _React$Component.call(this, props);
        this.state = { cellModel: null, cellId: '' };
    }

    CellChat.prototype.loadRoomData = function loadRoomData() {
        var _this = this;

        var user = this.props.pydio.user;
        user.getActiveRepositoryAsCell().then(function (c) {
            _this.setState({ cellModel: c, cellId: c ? user.activeRepository : '' });
        });
    };

    CellChat.prototype.componentWillMount = function componentWillMount() {
        this.loadRoomData();
    };

    CellChat.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.pydio.user.activeRepository !== this.state.cellId) {
            this.loadRoomData();
        }
    };

    CellChat.prototype.render = function render() {
        var _props = this.props;
        var pydio = _props.pydio;
        var style = _props.style;
        var _state = this.state;
        var cellModel = _state.cellModel;
        var cellId = _state.cellId;

        var chatRoomType = 'WORKSPACE';
        return _react2['default'].createElement(
            'div',
            { id: 'info_panel', style: _extends({ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e0e0e0' }, style) },
            _react2['default'].createElement(Chat, {
                pydio: pydio,
                roomType: chatRoomType,
                roomObjectId: cellId,
                style: { flex: 1, display: 'flex', flexDirection: 'column' },
                msgContainerStyle: { maxHeight: null, flex: 1, paddingTop: '10px !important', backgroundColor: '#FAFAFA' },
                fieldHint: pydio.MessageHash['636'],
                pushMessagesToBottom: true,
                emptyStateProps: {
                    iconClassName: 'mdi mdi-comment-account-outline',
                    primaryTextId: pydio.MessageHash['637'],
                    style: { padding: '0 10px', backgroundColor: 'transparent' }
                },
                computePresenceFromACLs: cellModel ? cellModel.getAcls() : {}
            })
        );
    };

    return CellChat;
})(_react2['default'].Component);

exports['default'] = CellChat;
module.exports = exports['default'];

},{"pydio":"pydio","react":"react"}],78:[function(require,module,exports){
/*
 * Copyright 2018 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio Cells.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydioUtilDom = require('pydio/util/dom');

var _pydioUtilDom2 = _interopRequireDefault(_pydioUtilDom);

var CellsMessageToolbar = (function (_React$Component) {
    _inherits(CellsMessageToolbar, _React$Component);

    function CellsMessageToolbar(props) {
        _classCallCheck(this, CellsMessageToolbar);

        _React$Component.call(this, props);
        var pydio = props.pydio;

        var node = pydio.getContextHolder().getContextNode();
        if (node && node.getMetadata().has("virtual_root")) {
            this.state = { display: true };
        } else {
            this.state = { display: false };
        }
    }

    CellsMessageToolbar.prototype.componentDidMount = function componentDidMount() {
        var _this = this;

        var pydio = this.props.pydio;

        this._observer = function () {
            var node = pydio.getContextHolder().getContextNode();
            if (node && node.getMetadata().has("virtual_root")) {
                _this.setState({ display: true });
            } else {
                _this.setState({ display: false });
            }
        };
        pydio.observe('context_changed', this._observer);
    };

    CellsMessageToolbar.prototype.componentWillUnmount = function componentWillUnmount() {
        var pydio = this.props.pydio;

        pydio.stopObserving('context_changed', this._observer);
    };

    /**
     *
     * @return {*}
     */

    CellsMessageToolbar.prototype.render = function render() {
        var display = this.state.display;
        var pydio = this.props.pydio;

        if (!display) {
            return null;
        }
        var s = { padding: 16, color: '#9E9E9E', borderBottom: '1px solid #F5F5F5' };
        return _react2['default'].createElement(
            'div',
            { style: s },
            pydio.MessageHash['638']
        );
    };

    return CellsMessageToolbar;
})(_react2['default'].Component);

exports['default'] = CellsMessageToolbar;
module.exports = exports['default'];

},{"pydio/util/dom":"pydio/util/dom","react":"react"}],79:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _OpenNodesModel = require('../OpenNodesModel');

var _OpenNodesModel2 = _interopRequireDefault(_OpenNodesModel);

var _reactRedux = require('react-redux');

var _editor = require('../editor');

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var EditorActions = _Pydio$requireLib.EditorActions;

var EditionPanel = (function (_React$Component) {
    _inherits(EditionPanel, _React$Component);

    function EditionPanel(props) {
        _classCallCheck(this, EditionPanel);

        _React$Component.call(this, props);
    }

    EditionPanel.prototype.componentDidMount = function componentDidMount() {
        var _this = this;

        this._nodesModelObserver = function (node) {
            return _this._handleNodePushed(node);
        };
        this._nodesRemoveObserver = function (index) {
            return _this._handleNodeRemoved(index);
        };
        this._titlesObserver = function () {
            return _this.forceUpdate();
        };

        _OpenNodesModel2['default'].getInstance().observe("nodePushed", this._nodesModelObserver);
        _OpenNodesModel2['default'].getInstance().observe("nodeRemovedAtIndex", this._nodesRemoveObserver);
        _OpenNodesModel2['default'].getInstance().observe("titlesUpdated", this._titlesObserver);
    };

    EditionPanel.prototype.componentWillUnmount = function componentWillUnmount() {
        _OpenNodesModel2['default'].getInstance().stopObserving("nodePushed", this._nodesModelObserver);
        _OpenNodesModel2['default'].getInstance().stopObserving("nodeRemovedAtIndex", this._nodesRemoveObserver);
        _OpenNodesModel2['default'].getInstance().stopObserving("titlesUpdated", this._titlesObserver);
    };

    EditionPanel.prototype._handleNodePushed = function _handleNodePushed(object) {
        var _this2 = this;

        var _props = this.props;
        var pydio = _props.pydio;
        var tabCreate = _props.tabCreate;
        var editorModify = _props.editorModify;
        var editorSetActiveTab = _props.editorSetActiveTab;
        var _object$node = object.node;
        var node = _object$node === undefined ? {} : _object$node;
        var editorData = object.editorData;

        pydio.Registry.loadEditorResources(editorData.resourcesManager, function () {
            var EditorClass = null;

            if (!(EditorClass = FuncUtils.getFunctionByName(editorData.editorClass, window))) {
                _this2.setState({
                    error: "Cannot find editor component (" + editorData.editorClass + ")!"
                });
                return;
            }

            var tabId = tabCreate({
                id: node.getLabel(),
                title: node.getLabel(),
                url: node.getPath(),
                icon: PydioWorkspaces.FilePreview,
                Editor: EditorClass.Editor,
                Controls: EditorClass.Controls,
                pydio: pydio,
                node: node,
                editorData: editorData,
                registry: pydio.Registry
            }).id;

            editorSetActiveTab(tabId);

            editorModify({
                open: true,
                isPanelActive: true
            });
        });
    };

    EditionPanel.prototype._handleNodeRemoved = function _handleNodeRemoved(index) {};

    /*componentDidMount() {
        const {editorData, registry} = this.props
         registry.loadEditorResources(
            editorData.resourcesManager,
            () => this.setState({ready: true})
        );
    }
     render() {
        const {editorData} = this.props
        const {ready} = this.state
         if (!ready) return null
         let EditorClass = null
        if (!(EditorClass = FuncUtils.getFunctionByName(editorData.editorClass, window))) {
            return <div>{"Cannot find editor component (" + editorData.editorClass + ")!"}</div>
        }
         // Getting HOC of the class
        return <EditorClass.Editor {...this.props} />
    }*/

    EditionPanel.prototype.render = function render() {
        var style = {
            position: "fixed",
            bottom: "50px",
            right: "100px",
            cursor: "pointer",
            transform: "translate(50%, 50%)",
            zIndex: 1400
        };

        return React.createElement(
            'div',
            { style: { position: "relative", zIndex: 1400 } },
            React.createElement(_editor.Editor, null)
        );
    };

    return EditionPanel;
})(React.Component);

EditionPanel.PropTypes = {
    pydio: React.PropTypes.instanceOf(_pydio2['default'])
};

exports['default'] = _reactRedux.connect(null, EditorActions)(EditionPanel);
module.exports = exports['default'];

},{"../OpenNodesModel":40,"../editor":60,"pydio":"pydio","react-redux":"react-redux"}],80:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _pydioModelAction = require('pydio/model/action');

var _pydioModelAction2 = _interopRequireDefault(_pydioModelAction);

var _MessagesProviderMixin = require('../MessagesProviderMixin');

var _MessagesProviderMixin2 = _interopRequireDefault(_MessagesProviderMixin);

var _Breadcrumb = require('./Breadcrumb');

var _Breadcrumb2 = _interopRequireDefault(_Breadcrumb);

var _search = require('../search');

var _MainFilesList = require('./MainFilesList');

var _MainFilesList2 = _interopRequireDefault(_MainFilesList);

var _EditionPanel = require('./EditionPanel');

var _EditionPanel2 = _interopRequireDefault(_EditionPanel);

var _detailpanesInfoPanel = require('../detailpanes/InfoPanel');

var _detailpanesInfoPanel2 = _interopRequireDefault(_detailpanesInfoPanel);

var _leftnavLeftPanel = require('../leftnav/LeftPanel');

var _leftnavLeftPanel2 = _interopRequireDefault(_leftnavLeftPanel);

var _WelcomeTour = require('./WelcomeTour');

var _WelcomeTour2 = _interopRequireDefault(_WelcomeTour);

var _CellChat = require('./CellChat');

var _CellChat2 = _interopRequireDefault(_CellChat);

var _materialUi = require('material-ui');

var _AddressBookPanel = require('./AddressBookPanel');

var _AddressBookPanel2 = _interopRequireDefault(_AddressBookPanel);

var _materialUiStyles = require('material-ui/styles');

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var withContextMenu = _Pydio$requireLib.withContextMenu;
var dropProvider = _Pydio$requireLib.dropProvider;

var _Pydio$requireLib2 = _pydio2['default'].requireLib('components');

var ButtonMenu = _Pydio$requireLib2.ButtonMenu;
var Toolbar = _Pydio$requireLib2.Toolbar;
var ListPaginator = _Pydio$requireLib2.ListPaginator;
var ContextMenu = _Pydio$requireLib2.ContextMenu;

var FSTemplate = _react2['default'].createClass({
    displayName: 'FSTemplate',

    mixins: [_MessagesProviderMixin2['default']],

    propTypes: {
        pydio: _react2['default'].PropTypes.instanceOf(_pydio2['default'])
    },

    statics: {
        INFO_PANEL_WIDTH: 270
    },

    openRightPanel: function openRightPanel(name) {
        var _this = this;

        this.setState({ rightColumnState: name }, function () {
            var infoPanelOpen = _this.state.infoPanelOpen;

            if (name !== 'info-panel') {
                infoPanelOpen = true;
            }
            _this.setState({ infoPanelToggle: true, infoPanelOpen: infoPanelOpen }, function () {
                return _this.resizeAfterTransition();
            });
        });
    },

    closeRightPanel: function closeRightPanel() {
        var _this2 = this;

        this.setState({ infoPanelToggle: false }, function () {
            _this2.resizeAfterTransition();
        });
    },

    getInitialState: function getInitialState() {
        return {
            infoPanelOpen: false,
            infoPanelToggle: true,
            drawerOpen: false,
            rightColumnState: 'info-panel'
        };
    },

    resizeAfterTransition: function resizeAfterTransition() {
        var _this3 = this;

        setTimeout(function () {
            if (_this3.refs.list) {
                _this3.refs.list.resize();
            }
            if (!_this3.state.infoPanelToggle) {
                _this3.setState({ rightColumnState: null });
            }
        }, 500);
    },

    infoPanelContentChange: function infoPanelContentChange(numberOfCards) {
        var _this4 = this;

        this.setState({ infoPanelOpen: numberOfCards > 0 }, function () {
            return _this4.resizeAfterTransition();
        });
    },

    openDrawer: function openDrawer(event) {
        event.stopPropagation();
        this.setState({ drawerOpen: true });
    },

    closeDrawer: function closeDrawer() {
        if (!this.state.drawerOpen) {
            return;
        }
        this.setState({ drawerOpen: false });
    },

    render: function render() {
        var _this5 = this;

        var connectDropTarget = this.props.connectDropTarget || function (c) {
            return c;
        };
        var mobile = this.props.pydio.UI.MOBILE_EXTENSIONS;

        /*
        var isOver = this.props.isOver;
        var canDrop = this.props.canDrop;
        */

        var Color = MaterialUI.Color;
        var appBarColor = Color(this.props.muiTheme.appBar.color);

        var styles = {
            appBarStyle: {
                zIndex: 1,
                backgroundColor: this.props.muiTheme.appBar.color
            },
            buttonsStyle: {
                color: this.props.muiTheme.appBar.textColor
            },
            iconButtonsStyle: {
                color: appBarColor.darken(0.5).toString()
            },
            rightButtonStyle: {
                //color: 'rgba(255,255,255,0.73)'
                color: appBarColor.darken(0.5).toString()
            },
            activeButtonStyle: {
                borderBottom: '2px solid rgba(255,255,255,0.97)'
            },
            activeButtonIconStyle: {
                color: 'rgba(255,255,255,0.97)'
            },
            raisedButtonStyle: {
                height: 30,
                minWidth: 0
            },
            raisedButtonLabelStyle: {
                height: 30,
                lineHeight: '30px'
            },
            infoPanelStyle: {
                //backgroundColor: appBarColor.lightness(95).rgb().toString()
                backgroundColor: '#fafafa',
                borderLeft: '1px solid #e0e0e0'
            }
        };

        var _state = this.state;
        var infoPanelOpen = _state.infoPanelOpen;
        var drawerOpen = _state.drawerOpen;
        var infoPanelToggle = _state.infoPanelToggle;
        var rightColumnState = this.state.rightColumnState;

        var classes = ['vertical_layout', 'vertical_fit', 'react-fs-template'];
        if (infoPanelOpen && infoPanelToggle) {
            classes.push('info-panel-open');
        }
        if (drawerOpen) {
            classes.push('drawer-open');
        }

        var mainToolbars = ["info_panel", "info_panel_share"];
        var mainToolbarsOthers = ["change", "other"];
        if (infoPanelOpen && infoPanelToggle) {
            mainToolbars = ["change_main"];
            mainToolbarsOthers = ["get", "change", "other"];
        }

        var pydio = this.props.pydio;

        var guiPrefs = pydio.user ? pydio.user.getPreference('gui_preferences', true) : [];
        var wTourEnabled = pydio.getPluginConfigs('gui.ajax').get('ENABLE_WELCOME_TOUR');

        var showChatTab = true;
        var showAddressBook = true;
        var repo = pydio.user.getRepositoriesList().get(pydio.user.activeRepository);
        if (repo && !repo.getOwner()) {
            showChatTab = false;
            if (rightColumnState === 'chat') {
                rightColumnState = 'info-panel';
            }
        }
        if (pydio.getPluginConfigs("action.advanced_settings").get("GLOBAL_DISABLE_CHATS")) {
            showChatTab = false;
        }
        if (pydio.getPluginConfigs("action.user").get("DASH_DISABLE_ADDRESS_BOOK")) {
            showAddressBook = false;
        }

        // Making sure we only pass the style to the parent element
        var _props = this.props;
        var style = _props.style;

        var props = _objectWithoutProperties(_props, ['style']);

        return connectDropTarget(_react2['default'].createElement(
            'div',
            { style: style, className: classes.join(' '), onTouchTap: this.closeDrawer, onContextMenu: this.props.onContextMenu },
            wTourEnabled && !guiPrefs['WelcomeComponent.Pydio8.TourGuide.FSTemplate'] && _react2['default'].createElement(_WelcomeTour2['default'], { ref: 'welcome', pydio: this.props.pydio }),
            _react2['default'].createElement(_leftnavLeftPanel2['default'], { className: 'left-panel', pydio: props.pydio }),
            _react2['default'].createElement(
                'div',
                { className: 'desktop-container vertical_layout vertical_fit' },
                _react2['default'].createElement(
                    _materialUi.Paper,
                    { zDepth: 1, style: styles.appBarStyle, rounded: false },
                    _react2['default'].createElement(
                        'div',
                        { id: 'workspace_toolbar', style: { display: 'flex' } },
                        _react2['default'].createElement(
                            'span',
                            { className: 'drawer-button' },
                            _react2['default'].createElement(_materialUi.IconButton, { style: { color: 'white' }, iconClassName: 'mdi mdi-menu', onTouchTap: this.openDrawer })
                        ),
                        _react2['default'].createElement(_Breadcrumb2['default'], _extends({}, props, { startWithSeparator: false })),
                        _react2['default'].createElement('span', { style: { flex: 1 } }),
                        _react2['default'].createElement(_search.SearchForm, props)
                    ),
                    _react2['default'].createElement(
                        'div',
                        { id: 'main_toolbar' },
                        _react2['default'].createElement(ButtonMenu, _extends({}, props, {
                            buttonStyle: styles.raisedButtonStyle,
                            buttonLabelStyle: styles.raisedButtonLabelStyle,
                            id: 'create-button-menu',
                            toolbars: ["upload", "create"],
                            buttonTitle: this.props.pydio.MessageHash['198'],
                            raised: true,
                            secondary: true,
                            controller: props.pydio.Controller,
                            openOnEvent: 'tutorial-open-create-menu'
                        })),
                        !mobile && _react2['default'].createElement(Toolbar, _extends({}, props, {
                            id: 'main-toolbar',
                            toolbars: mainToolbars,
                            groupOtherList: mainToolbarsOthers,
                            renderingType: 'button',
                            buttonStyle: styles.buttonsStyle
                        })),
                        mobile && _react2['default'].createElement('span', { style: { flex: 1 } }),
                        _react2['default'].createElement(ListPaginator, {
                            id: 'paginator-toolbar',
                            dataModel: props.pydio.getContextHolder(),
                            toolbarDisplay: true
                        }),
                        _react2['default'].createElement(Toolbar, _extends({}, props, {
                            id: 'display-toolbar',
                            toolbars: ["display_toolbar"],
                            renderingType: 'icon-font',
                            buttonStyle: styles.iconButtonsStyle
                        })),
                        _react2['default'].createElement('div', { style: { borderLeft: '1px solid ' + styles.iconButtonsStyle.color, margin: '0 10px' } }),
                        _react2['default'].createElement(
                            'div',
                            { style: { marginTop: -8, display: 'flex' } },
                            _react2['default'].createElement(_materialUi.IconButton, {
                                iconClassName: "mdi mdi-information",
                                style: rightColumnState === 'info-panel' ? styles.activeButtonStyle : { borderBottom: 0 },
                                iconStyle: rightColumnState === 'info-panel' ? styles.activeButtonIconStyle : styles.rightButtonStyle,
                                onTouchTap: function () {
                                    _this5.openRightPanel('info-panel');
                                },
                                tooltip: pydio.MessageHash['341']
                            }),
                            showChatTab && _react2['default'].createElement(_materialUi.IconButton, {
                                iconClassName: "mdi mdi-message-text",
                                style: rightColumnState === 'chat' ? styles.activeButtonStyle : { borderBottom: 0 },
                                iconStyle: rightColumnState === 'chat' ? styles.activeButtonIconStyle : styles.rightButtonStyle,
                                onTouchTap: function () {
                                    _this5.openRightPanel('chat');
                                },
                                tooltip: pydio.MessageHash['635']
                            }),
                            showAddressBook && _react2['default'].createElement(_materialUi.IconButton, {
                                iconClassName: "mdi mdi-account-card-details",
                                style: rightColumnState === 'address-book' ? styles.activeButtonStyle : { borderBottom: 0 },
                                iconStyle: rightColumnState === 'address-book' ? styles.activeButtonIconStyle : styles.rightButtonStyle,
                                onTouchTap: function () {
                                    _this5.openRightPanel('address-book');
                                },
                                tooltip: pydio.MessageHash['592']
                            }),
                            _react2['default'].createElement(_materialUi.IconButton, {
                                iconClassName: "mdi mdi-close",
                                iconStyle: styles.rightButtonStyle,
                                onTouchTap: function () {
                                    _this5.closeRightPanel();
                                },
                                disabled: !rightColumnState,
                                tooltip: pydio.MessageHash['86']
                            })
                        )
                    )
                ),
                _react2['default'].createElement(_MainFilesList2['default'], { ref: 'list', pydio: this.props.pydio })
            ),
            rightColumnState === 'info-panel' && _react2['default'].createElement(_detailpanesInfoPanel2['default'], _extends({}, props, {
                dataModel: props.pydio.getContextHolder(),
                onContentChange: this.infoPanelContentChange,
                style: styles.infoPanelStyle
            })),
            rightColumnState === 'chat' && _react2['default'].createElement(_CellChat2['default'], { pydio: pydio }),
            rightColumnState === 'address-book' && _react2['default'].createElement(_AddressBookPanel2['default'], { pydio: pydio }),
            _react2['default'].createElement(_EditionPanel2['default'], props),
            _react2['default'].createElement(
                'span',
                { className: 'context-menu' },
                _react2['default'].createElement(ContextMenu, { pydio: this.props.pydio })
            )
        ));
    }
});

exports['default'] = FSTemplate = dropProvider(FSTemplate);
exports['default'] = FSTemplate = withContextMenu(FSTemplate);
exports['default'] = FSTemplate = _materialUiStyles.muiThemeable()(FSTemplate);

exports['default'] = FSTemplate;
module.exports = exports['default'];

},{"../MessagesProviderMixin":39,"../detailpanes/InfoPanel":43,"../leftnav/LeftPanel":65,"../search":74,"./AddressBookPanel":75,"./Breadcrumb":76,"./CellChat":77,"./EditionPanel":79,"./MainFilesList":82,"./WelcomeTour":84,"material-ui":"material-ui","material-ui/styles":"material-ui/styles","pydio":"pydio","pydio/model/action":"pydio/model/action","react":"react"}],81:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _materialUiStyles = require('material-ui/styles');

var _materialUi = require('material-ui');

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var FilePreview = (function (_PureComponent) {
    _inherits(FilePreview, _PureComponent);

    _createClass(FilePreview, null, [{
        key: 'propTypes',
        get: function get() {
            return {
                node: _react.PropTypes.instanceOf(AjxpNode).isRequired,
                loadThumbnail: _react.PropTypes.bool,
                richPreview: _react.PropTypes.bool,
                processing: _react.PropTypes.bool,
                // Additional styling
                style: _react.PropTypes.object,
                mimeFontStyle: _react.PropTypes.object,
                mimeClassName: _react.PropTypes.string
            };
        }
    }, {
        key: 'defaultProps',
        get: function get() {
            return { richPreview: false };
        }
    }]);

    function FilePreview(props) {
        _classCallCheck(this, FilePreview);

        _PureComponent.call(this, props);

        this.state = {
            loading: false
        };
    }

    FilePreview.prototype.getStyles = function getStyles() {
        var _props = this.props;
        var style = _props.style;
        var mimeFontStyle = _props.mimeFontStyle;

        var color = new _color2['default'](this.props.muiTheme.palette.primary1Color).saturationl(18).lightness(44).toString();
        var light = new _color2['default'](this.props.muiTheme.palette.primary1Color).saturationl(15).lightness(94).toString();

        var rootStyle = _extends({
            backgroundColor: light,
            alignItems: "initial"
        }, style);

        var mimefontStyle = _extends({
            color: color
        }, mimeFontStyle);

        return { rootStyle: rootStyle, mimeFontStyle: mimefontStyle };
    };

    FilePreview.prototype.insertPreviewNode = function insertPreviewNode(previewNode) {
        this._previewNode = previewNode;
        var containerNode = this.refs.container;
        containerNode.innerHTML = '';
        containerNode.className = 'richPreviewContainer';
        containerNode.appendChild(this._previewNode);
    };

    FilePreview.prototype.destroyPreviewNode = function destroyPreviewNode() {
        if (this._previewNode) {
            this._previewNode.destroyElement();
            if (this._previewNode.parentNode) {
                this._previewNode.parentNode.removeChild(this._previewNode);
            }
            this._previewNode = null;
        }
    };

    FilePreview.prototype.componentDidMount = function componentDidMount() {
        this.loadCoveringImage();
    };

    FilePreview.prototype.componentWillUnmount = function componentWillUnmount() {
        this.destroyPreviewNode();
    };

    FilePreview.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.node.getPath() !== this.props.node.getPath()) {
            this.destroyPreviewNode();
            this.loadCoveringImage();
            return;
        }

        if (this._previewNode) {
            return;
        }

        if (nextProps.loadThumbnail !== this.props.loadThumbnail && nextProps.loadThumbnail) {
            this.loadCoveringImage(true);
        }
    };

    FilePreview.prototype.loadCoveringImage = function loadCoveringImage() {
        var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (!this.props.loadThumbnail && !force) {
            return;
        }
        var pydio = window.pydio,
            node = this.props.node;
        var editors = window.pydio.Registry.findEditorsForMime(node.isLeaf() ? node.getAjxpMime() : "mime_folder", true);
        if (!editors || !editors.length) {
            return;
        }
        var editor = editors[0];
        var editorClassName = editors[0].editorClass;

        pydio.Registry.loadEditorResources(editors[0].resourcesManager, (function () {
            var component = FuncUtils.getFunctionByName(editorClassName, window);

            if (component) {
                this.loadPreviewFromEditor(component, node);
            }
        }).bind(this));
    };

    FilePreview.prototype.loadPreviewFromEditor = function loadPreviewFromEditor(editorClass, node) {
        this.setState({
            EditorClass: this.props.richPreview ? editorClass.Panel : editorClass.Badge
        });
    };

    FilePreview.prototype.render = function render() {
        var _getStyles = this.getStyles();

        var rootStyle = _getStyles.rootStyle;
        var mimeFontStyle = _getStyles.mimeFontStyle;
        var _props2 = this.props;
        var node = _props2.node;
        var mimeClassName = _props2.mimeClassName;
        var processing = _props2.processing;
        var EditorClass = this.state.EditorClass;

        var element = undefined;

        if (processing) {
            element = React.createElement(_materialUi.CircularProgress, { size: 40, thickness: 2 });
        } else if (EditorClass) {
            element = React.createElement(EditorClass, _extends({ pydio: pydio }, this.props, { preview: true, mimeFontStyle: mimeFontStyle }));
        } else {
            var svg = node.getSvgSource();
            var isLeaf = node.isLeaf();
            element = React.createElement('div', { key: 'icon', className: mimeClassName || 'mimefont mdi mdi-' + (svg || (isLeaf ? 'file' : 'folder')), style: mimeFontStyle });
        }

        return React.createElement(
            'div',
            { ref: 'container', style: rootStyle, className: 'mimefont-container' + (EditorClass ? ' with-editor-badge' : ''), onTouchTap: this.props.onTouchTap },
            element
        );
    };

    return FilePreview;
})(_react.PureComponent);

exports['default'] = _materialUiStyles.muiThemeable()(FilePreview);
module.exports = exports['default'];

},{"color":"color","material-ui":"material-ui","material-ui/styles":"material-ui/styles","react":"react"}],82:[function(require,module,exports){
(function (global){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _pydioUtilPath = require('pydio/util/path');

var _pydioUtilPath2 = _interopRequireDefault(_pydioUtilPath);

var _pydioModelAction = require('pydio/model/action');

var _pydioModelAction2 = _interopRequireDefault(_pydioModelAction);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _FilePreview = require('./FilePreview');

var _FilePreview2 = _interopRequireDefault(_FilePreview);

var _materialUi = require('material-ui');

var _CellsMessageToolbar = require('./CellsMessageToolbar');

var _CellsMessageToolbar2 = _interopRequireDefault(_CellsMessageToolbar);

var _Pydio$requireLib = _pydio2['default'].requireLib('components');

var SimpleList = _Pydio$requireLib.SimpleList;

var _Pydio$requireLib2 = _pydio2['default'].requireLib('boot');

var moment = _Pydio$requireLib2.moment;

var ComponentConfigsParser = (function () {
    function ComponentConfigsParser() {
        _classCallCheck(this, ComponentConfigsParser);
    }

    ComponentConfigsParser.prototype.getDefaultListColumns = function getDefaultListColumns() {
        return {
            text: {
                label: 'File Name',
                message: '1',
                width: '50%',
                renderCell: MainFilesList.tableEntryRenderCell,
                sortType: 'string',
                remoteSortAttribute: 'ajxp_label'
            },
            filesize: {
                label: 'File Size',
                message: '2',
                sortType: 'number',
                sortAttribute: 'bytesize',
                remoteSortAttribute: 'filesize'
            },
            mimestring: {
                label: 'File Type',
                message: '3',
                sortType: 'string'
            },
            ajxp_modiftime: {
                label: 'Mofidied on',
                message: '4',
                sortType: 'number'
            }
        };
    };

    ComponentConfigsParser.prototype.loadConfigs = function loadConfigs(componentName) {
        var configs = new Map();
        var columnsNodes = XMLUtils.XPathSelectNodes(global.pydio.getXmlRegistry(), 'client_configs/component_config[@component="FilesList"]/columns/column|client_configs/component_config[@component="FilesList"]/columns/additional_column');
        var columns = {};
        var messages = global.pydio.MessageHash;
        columnsNodes.forEach(function (colNode) {
            var name = colNode.getAttribute('attributeName');
            columns[name] = {
                message: colNode.getAttribute('messageId'),
                label: colNode.getAttribute('messageString') ? colNode.getAttribute('messageString') : messages[colNode.getAttribute('messageId')],
                sortType: messages[colNode.getAttribute('sortType')]
            };
            if (name === 'ajxp_label') {
                columns[name].renderCell = MainFilesList.tableEntryRenderCell;
            }
            if (colNode.getAttribute('reactModifier')) {
                (function () {
                    var reactModifier = colNode.getAttribute('reactModifier');
                    ResourcesManager.detectModuleToLoadAndApply(reactModifier, function () {
                        columns[name].renderComponent = columns[name].renderCell = FuncUtils.getFunctionByName(reactModifier, global);
                    }, true);
                })();
            }
            columns[name]['sortType'] = 'string';
        });
        configs.set('columns', columns);
        return configs;
    };

    return ComponentConfigsParser;
})();

var MainFilesList = _react2['default'].createClass({
    displayName: 'MainFilesList',

    propTypes: {
        pydio: _react2['default'].PropTypes.instanceOf(_pydio2['default']),
        horizontalRibbon: _react2['default'].PropTypes.bool
    },

    statics: {
        tableEntryRenderCell: function tableEntryRenderCell(node) {
            return _react2['default'].createElement(
                'span',
                null,
                _react2['default'].createElement(_FilePreview2['default'], { rounded: true, loadThumbnail: false, node: node, style: { backgroundColor: 'transparent' } }),
                ' ',
                node.getLabel()
            );
        }
    },

    getInitialState: function getInitialState() {
        var configParser = new ComponentConfigsParser();
        var columns = configParser.loadConfigs('FilesList').get('columns');
        return {
            contextNode: this.props.pydio.getContextHolder().getContextNode(),
            displayMode: this.props.displayMode ? this.props.displayMode : 'list',
            thumbNearest: 200,
            thumbSize: 200,
            elementsPerLine: 5,
            columns: columns ? columns : configParser.getDefaultListColumns(),
            parentIsScrolling: this.props.parentIsScrolling,
            repositoryId: this.props.pydio.repositoryId
        };
    },

    componentDidMount: function componentDidMount() {
        // Hook to the central datamodel
        this._contextObserver = (function () {
            this.setState({ contextNode: this.props.pydio.getContextHolder().getContextNode() });
        }).bind(this);
        this.props.pydio.getContextHolder().observe("context_changed", this._contextObserver);
        this.props.pydio.getController().updateGuiActions(this.getPydioActions());

        this.recomputeThumbnailsDimension();
        if (window.addEventListener) {
            window.addEventListener('resize', this.recomputeThumbnailsDimension);
        } else {
            window.attachEvent('onresize', this.recomputeThumbnailsDimension);
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        this.props.pydio.getContextHolder().stopObserving("context_changed", this._contextObserver);
        this.getPydioActions(true).map((function (key) {
            this.props.pydio.getController().deleteFromGuiActions(key);
        }).bind(this));
        if (window.addEventListener) {
            window.removeEventListener('resize', this.recomputeThumbnailsDimension);
        } else {
            window.detachEvent('onresize', this.recomputeThumbnailsDimension);
        }
    },

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
        return !this.state || this.state.repositoryId !== nextProps.pydio.repositoryId || nextState !== this.state;
    },

    componentWillReceiveProps: function componentWillReceiveProps() {
        if (this.state && this.state.repositoryId !== this.props.pydio.repositoryId) {
            this.props.pydio.getController().updateGuiActions(this.getPydioActions());
            var configParser = new ComponentConfigsParser();
            var columns = configParser.loadConfigs('FilesList').get('columns');
            this.setState({
                columns: columns ? columns : configParser.getDefaultListColumns()
            });
        }
    },

    resize: function resize() {
        this.recomputeThumbnailsDimension();
    },

    recomputeThumbnailsDimension: function recomputeThumbnailsDimension(nearest) {

        if (!nearest || nearest instanceof Event) {
            nearest = this.state.thumbNearest;
        }
        var MAIN_CONTAINER_FULL_PADDING = 2;
        var THUMBNAIL_MARGIN = 1;
        var containerWidth = undefined;
        try {
            containerWidth = _reactDom2['default'].findDOMNode(this.refs['list'].refs['infinite']).clientWidth - MAIN_CONTAINER_FULL_PADDING;
        } catch (e) {
            containerWidth = 200;
        }

        // Find nearest dim
        var blockNumber = Math.floor(containerWidth / nearest);
        var width = Math.floor(containerWidth / blockNumber) - THUMBNAIL_MARGIN * 2;
        if (this.props.horizontalRibbon) {
            blockNumber = this.state.contextNode.getChildren().size;
            if (this.state.displayMode === 'grid-160') width = 160;else if (this.state.displayMode === 'grid-320') width = 320;else if (this.state.displayMode === 'grid-80') width = 80;else width = 200;
        }

        // Recompute columns widths
        var columns = this.state.columns;
        var columnKeys = Object.keys(columns);
        var defaultFirstWidthPercent = 10;
        var defaultFirstMinWidthPx = 250;
        var firstColWidth = Math.max(250, containerWidth * defaultFirstWidthPercent / 100);
        var otherColWidth = (containerWidth - firstColWidth) / (Object.keys(this.state.columns).length - 1);
        columnKeys.map(function (columnKey) {
            columns[columnKey]['width'] = otherColWidth;
        });

        this.setState({
            columns: columns,
            elementsPerLine: blockNumber,
            thumbSize: width,
            thumbNearest: nearest
        });
    },

    entryRenderIcon: function entryRenderIcon(node) {
        var _this = this;

        var entryProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        if (entryProps && entryProps.parent) {
            return _react2['default'].createElement(_FilePreview2['default'], {
                loadThumbnail: false,
                node: node,
                mimeClassName: 'mimefont mdi mdi-chevron-left',
                onTouchTap: function () {
                    _this.entryHandleClicks(node, SimpleList.CLICK_TYPE_DOUBLE);
                },
                style: { cursor: 'pointer' }
            });
        } else {
            var processing = !!node.getMetadata().get('Processing');
            return _react2['default'].createElement(_FilePreview2['default'], {
                loadThumbnail: !entryProps['parentIsScrolling'] && !processing,
                node: node,
                processing: processing
            });
        }
    },

    entryRenderActions: function entryRenderActions(node) {
        var _this2 = this;

        var content = null;
        var mobile = this.props.pydio.UI.MOBILE_EXTENSIONS;
        var dm = this.props.pydio.getContextHolder();
        if (mobile) {
            var _ret2 = (function () {
                var ContextMenuModel = require('pydio/model/context-menu');
                return {
                    v: _react2['default'].createElement(_materialUi.IconButton, { iconClassName: 'mdi mdi-dots-vertical', tooltip: 'Info', onClick: function (event) {
                            _this2.props.pydio.observeOnce('actions_refreshed', function () {
                                ContextMenuModel.getInstance().openNodeAtPosition(node, event.clientX, event.clientY);
                            });
                            event.stopPropagation();
                            dm.setSelectedNodes([node]);
                            ContextMenuModel.getInstance().openNodeAtPosition(node, event.clientX, event.clientY);
                        } })
                };
            })();

            if (typeof _ret2 === 'object') return _ret2.v;
        } else if (node.getMetadata().get('overlay_class')) {
            var elements = node.getMetadata().get('overlay_class').split(',').map(function (c) {
                return _react2['default'].createElement('span', { key: c, className: c + ' overlay-class-span' });
            });
            content = _react2['default'].createElement(
                'div',
                { className: 'overlay_icon_div' },
                elements
            );
        }
        return content;
    },

    entryHandleClicks: function entryHandleClicks(node, clickType, event) {
        var dm = this.props.pydio.getContextHolder();
        var mobile = this.props.pydio.UI.MOBILE_EXTENSIONS || this.props.horizontalRibbon;
        if (dm.getContextNode().getParent() === node && clickType === SimpleList.CLICK_TYPE_SIMPLE) {
            return;
        }
        if (!mobile && (!clickType || clickType === SimpleList.CLICK_TYPE_SIMPLE)) {
            var crtSelection = dm.getSelectedNodes();
            if (event && event.shiftKey && crtSelection.length) {
                var newSelection = this.refs.list.computeSelectionFromCurrentPlusTargetNode(crtSelection, node);
                dm.setSelectedNodes(newSelection);
            } else if (event && (event.ctrlKey || event.metaKey) && crtSelection.length) {
                if (crtSelection.indexOf(node) === -1) {
                    dm.setSelectedNodes([].concat(crtSelection, [node]));
                } else {
                    var otherSelection = crtSelection.filter(function (obj) {
                        return obj !== node;
                    });
                    dm.setSelectedNodes(otherSelection);
                }
            } else {
                dm.setSelectedNodes([node]);
            }
        } else if (mobile || clickType === SimpleList.CLICK_TYPE_DOUBLE) {
            if (!node.isBrowsable()) {
                dm.setSelectedNodes([node]);
                this.props.pydio.Controller.fireAction("open_with_unique");
            } else {
                dm.requireContextChange(node);
            }
        }
    },

    entryRenderSecondLine: function entryRenderSecondLine(node) {
        var metaData = node.getMetadata();
        var pieces = [];

        if (metaData.get('ajxp_modiftime')) {
            var mDate = moment(parseFloat(metaData.get('ajxp_modiftime')) * 1000);
            var dateString = mDate.calendar();
            if (dateString.indexOf('/') > -1) {
                dateString = mDate.fromNow();
            }
            pieces.push(_react2['default'].createElement(
                'span',
                { key: 'time_description', className: 'metadata_chunk metadata_chunk_description' },
                dateString
            ));
        }

        var first = false;
        var attKeys = Object.keys(this.state.columns);
        for (var i = 0; i < attKeys.length; i++) {
            var s = attKeys[i];
            var columnDef = this.state.columns[s];
            var label = undefined;
            if (s === 'ajxp_label' || s === 'text') {
                continue;
            } else if (s == "ajxp_modiftime") {
                var date = new Date();
                date.setTime(parseInt(metaData.get(s)) * 1000);
                label = _pydioUtilPath2['default'].formatModifDate(date);
            } else if (s == "ajxp_dirname" && metaData.get("filename")) {
                var dirName = _pydioUtilPath2['default'].getDirname(metaData.get("filename"));
                label = dirName ? dirName : "/";
            } else if (s == "filesize" && metaData.get(s) == "-") {
                continue;
            } else if (columnDef.renderComponent) {
                columnDef['name'] = s;
                label = columnDef.renderComponent(node, columnDef);
            } else {
                var metaValue = metaData.get(s) || "";
                if (!metaValue) {
                    continue;
                }
                label = metaValue;
            }
            var sep = undefined;
            if (!first) {
                sep = _react2['default'].createElement('span', { className: 'icon-angle-right' });
            }
            var cellClass = 'metadata_chunk metadata_chunk_standard metadata_chunk_' + s;
            pieces.push(_react2['default'].createElement(
                'span',
                { key: s, className: cellClass },
                sep,
                _react2['default'].createElement(
                    'span',
                    { className: 'text_label' },
                    label
                )
            ));
        }
        return pieces;
    },

    switchDisplayMode: function switchDisplayMode(displayMode) {
        this.setState({ displayMode: displayMode });
        if (displayMode.indexOf('grid-') === 0) {
            var near = parseInt(displayMode.split('-')[1]);
            this.recomputeThumbnailsDimension(near);
        } else if (displayMode === 'detail') {
            this.recomputeThumbnailsDimension();
        }
    },

    getPydioActions: function getPydioActions() {
        var keysOnly = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (keysOnly) {
            return ['switch_display_mode'];
        }
        var multiAction = new _pydioModelAction2['default']({
            name: 'switch_display_mode',
            icon_class: 'mdi mdi-view-list',
            text_id: 150,
            title_id: 151,
            text: MessageHash[150],
            title: MessageHash[151],
            hasAccessKey: false,
            subMenu: true,
            subMenuUpdateImage: true
        }, {
            selection: false,
            dir: true,
            actionBar: true,
            actionBarGroup: 'display_toolbar',
            contextMenu: false,
            infoPanel: false
        }, {}, {}, {
            staticItems: [{ name: 'List', title: 227, icon_class: 'mdi mdi-view-list', callback: (function () {
                    this.switchDisplayMode('list');
                }).bind(this), hasAccessKey: true, accessKey: 'list_access_key' }, { name: 'Detail', title: 461, icon_class: 'mdi mdi-view-headline', callback: (function () {
                    this.switchDisplayMode('detail');
                }).bind(this), hasAccessKey: true, accessKey: 'detail_access_key' }, { name: 'Thumbs', title: 229, icon_class: 'mdi mdi-view-grid', callback: (function () {
                    this.switchDisplayMode('grid-160');
                }).bind(this), hasAccessKey: true, accessKey: 'thumbs_access_key' }, { name: 'Thumbs large', title: 229, icon_class: 'mdi mdi-view-agenda', callback: (function () {
                    this.switchDisplayMode('grid-320');
                }).bind(this), hasAccessKey: false }, { name: 'Thumbs small', title: 229, icon_class: 'mdi mdi-view-module', callback: (function () {
                    this.switchDisplayMode('grid-80');
                }).bind(this), hasAccessKey: false }]
        });
        var buttons = new Map();
        buttons.set('switch_display_mode', multiAction);
        return buttons;
    },

    render: function render() {

        var tableKeys = undefined,
            sortKeys = undefined,
            elementStyle = undefined,
            className = 'files-list layout-fill main-files-list';
        var elementHeight = undefined,
            entryRenderSecondLine = undefined,
            elementsPerLine = 1,
            near = undefined;
        var dMode = this.state.displayMode;
        if (dMode.indexOf('grid-') === 0) {
            near = parseInt(dMode.split('-')[1]);
            dMode = 'grid';
        }
        var infiniteSliceCount = 50;

        if (dMode === 'detail') {

            elementHeight = SimpleList.HEIGHT_ONE_LINE;
            tableKeys = this.state.columns;
        } else if (dMode === 'grid') {

            sortKeys = this.state.columns;
            className += ' material-list-grid grid-size-' + near;
            elementHeight = Math.ceil(this.state.thumbSize / this.state.elementsPerLine);
            if (!elementHeight || this.props.horizontalRibbon) {
                elementHeight = 1;
            }
            elementsPerLine = this.state.elementsPerLine;
            elementStyle = {
                width: this.state.thumbSize,
                height: this.state.thumbSize
            };
            if (this.props.horizontalRibbon) {
                className += ' horizontal-ribbon';
            }
            // Todo: compute a more real number of elements visible per page.
            if (near === 320) infiniteSliceCount = 25;else if (near === 160) infiniteSliceCount = 80;else if (near === 80) infiniteSliceCount = 200;
        } else if (dMode === 'list') {

            sortKeys = this.state.columns;
            elementHeight = SimpleList.HEIGHT_TWO_LINES;
            entryRenderSecondLine = this.entryRenderSecondLine;
        }

        var pydio = this.props.pydio;
        var contextNode = this.state.contextNode;

        var messages = pydio.MessageHash;
        var canUpload = pydio.Controller.getActionByName('upload') && !contextNode.getMetadata().has('node_readonly');
        var secondary = messages[canUpload ? '565' : '566'];
        var iconClassName = canUpload ? 'mdi mdi-cloud-upload' : 'mdi mdi-folder-outline';
        var emptyStateProps = {
            style: { backgroundColor: 'transparent' },
            iconClassName: iconClassName,
            primaryTextId: messages['562'],
            secondaryTextId: secondary
        };
        if (contextNode.isRoot()) {
            (function () {
                var isCell = pydio.user.activeRepository ? pydio.user.getRepositoriesList().get(pydio.user.activeRepository).getOwner() : false;
                var recyclePath = contextNode.getMetadata().get('repo_has_recycle');
                emptyStateProps = {
                    style: { backgroundColor: 'transparent' },
                    iconClassName: iconClassName,
                    primaryTextId: isCell ? messages['631'] : messages['563'],
                    secondaryTextId: secondary
                };
                if (recyclePath) {
                    emptyStateProps = _extends({}, emptyStateProps, {
                        checkEmptyState: function checkEmptyState(node) {
                            return node.isLoaded() && node.getChildren().size === 1 && node.getChildren().get(recyclePath);
                        },
                        actionLabelId: messages['567'],
                        actionIconClassName: 'mdi mdi-delete',
                        actionCallback: function actionCallback(e) {
                            pydio.goTo(recyclePath);
                        }
                    });
                }
            })();
        } else {
            var recycle = pydio.getContextHolder().getRootNode().getMetadata().get('repo_has_recycle');
            if (contextNode.getPath() === recycle) {
                emptyStateProps = _extends({}, emptyStateProps, {
                    iconClassName: 'mdi mdi-delete-empty',
                    primaryTextId: messages['564'],
                    secondaryTextId: null
                });
            }
        }

        return _react2['default'].createElement(SimpleList, {
            ref: 'list',
            tableKeys: tableKeys,
            sortKeys: sortKeys,
            node: this.state.contextNode,
            dataModel: pydio.getContextHolder(),
            className: className,
            actionBarGroups: ["change_main"],
            infiniteSliceCount: infiniteSliceCount,
            skipInternalDataModel: true,
            elementsPerLine: elementsPerLine,
            elementHeight: elementHeight,
            elementStyle: elementStyle,
            passScrollingStateToChildren: true,
            entryRenderIcon: this.entryRenderIcon,
            entryRenderParentIcon: this.entryRenderIcon,
            entryRenderSecondLine: entryRenderSecondLine,
            entryRenderActions: this.entryRenderActions,
            entryHandleClicks: this.entryHandleClicks,
            horizontalRibbon: this.props.horizontalRibbon,
            emptyStateProps: emptyStateProps,
            defaultSortingInfo: { sortType: 'file-natural', attribute: '', direction: 'asc' },
            hideToolbar: true,
            customToolbar: _react2['default'].createElement(_CellsMessageToolbar2['default'], { pydio: pydio })
        });
    }

});

exports['default'] = MainFilesList;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./CellsMessageToolbar":78,"./FilePreview":81,"material-ui":"material-ui","pydio":"pydio","pydio/model/action":"pydio/model/action","pydio/model/context-menu":"pydio/model/context-menu","pydio/util/path":"pydio/util/path","react":"react","react-dom":"react-dom"}],83:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _reactJoyride = require('react-joyride');

var _reactJoyride2 = _interopRequireDefault(_reactJoyride);

var _Pydio$requireLib = _pydio2['default'].requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib.PydioContextConsumer;

var TourGuide = (function (_Component) {
    _inherits(TourGuide, _Component);

    function TourGuide() {
        _classCallCheck(this, TourGuide);

        _Component.apply(this, arguments);
    }

    TourGuide.prototype.render = function render() {
        var _this = this;

        var message = function message(id) {
            return _this.props.getMessage('ajax_gui.tour.locale.' + id);
        };
        var locales = ['back', 'close', 'last', 'next', 'skip'];
        var locale = {};
        locales.forEach(function (k) {
            locale[k] = message(k);
        });
        return React.createElement(_reactJoyride2['default'], _extends({}, this.props, {
            locale: locale,
            allowClicksThruHole: true
        }));
    };

    return TourGuide;
})(_react.Component);

exports['default'] = TourGuide = PydioContextConsumer(TourGuide);
exports['default'] = TourGuide;
module.exports = exports['default'];

},{"pydio":"pydio","react":"react","react-joyride":17}],84:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _materialUi = require('material-ui');

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _TourGuide = require('./TourGuide');

var _TourGuide2 = _interopRequireDefault(_TourGuide);

var _Pydio$requireLib = _pydio2['default'].requireLib('boot');

var PydioContextConsumer = _Pydio$requireLib.PydioContextConsumer;

var DOMUtils = require('pydio/util/dom');

var Scheme = (function (_Component) {
    _inherits(Scheme, _Component);

    function Scheme() {
        _classCallCheck(this, Scheme);

        _Component.apply(this, arguments);
    }

    Scheme.prototype.render = function render() {
        var style = {
            position: 'relative',
            fontSize: 24,
            width: this.props.dimension || 100,
            height: this.props.dimension || 100,
            backgroundColor: '#ECEFF1',
            color: '#607d8b',
            borderRadius: '50%',
            margin: '0 auto'
        };
        return React.createElement(
            'div',
            { style: _extends({}, style, this.props.style) },
            this.props.children
        );
    };

    return Scheme;
})(_react.Component);

var IconScheme = (function (_Component2) {
    _inherits(IconScheme, _Component2);

    function IconScheme(props) {
        _classCallCheck(this, IconScheme);

        _Component2.call(this, props);
        this.state = { icon: props.icon || props.icons[0], index: 0 };
    }

    IconScheme.prototype.componentDidMount = function componentDidMount() {
        this.componentWillReceiveProps(this.props);
    };

    IconScheme.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var _this = this;

        var icon = nextProps.icon;
        var icons = nextProps.icons;

        if (this._interval) clearInterval(this._interval);

        var state = undefined;
        if (icon) {
            state = { icon: icon };
        } else if (icons) {
            state = { icon: icons[0], index: 0 };
            this._interval = setInterval(function () {
                _this.nextIcon();
            }, 1700);
        }
        this.setState(state);
    };

    IconScheme.prototype.nextIcon = function nextIcon() {
        var icons = this.props.icons;

        var next = this.state.index + 1;
        if (next > icons.length - 1) next = 0;
        this.setState({ index: next, icon: icons[next] });
    };

    IconScheme.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this._interval) clearInterval(this._interval);
    };

    IconScheme.prototype.render = function render() {
        var icon = this.state.icon;

        return React.createElement(
            Scheme,
            { dimension: 80 },
            React.createElement('span', { className: "mdi mdi-" + icon, style: { position: 'absolute', top: 14, left: 14, fontSize: 50 } })
        );
    };

    return IconScheme;
})(_react.Component);

var CreateMenuCard = (function (_Component3) {
    _inherits(CreateMenuCard, _Component3);

    function CreateMenuCard() {
        _classCallCheck(this, CreateMenuCard);

        _Component3.apply(this, arguments);
    }

    CreateMenuCard.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        setTimeout(function () {
            _this2.props.pydio.notify('tutorial-open-create-menu');
        }, 950);
    };

    CreateMenuCard.prototype.render = function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                this.props.message('create-menu')
            ),
            React.createElement(IconScheme, { icons: ['file-plus', 'folder-plus'] })
        );
    };

    return CreateMenuCard;
})(_react.Component);

var InfoPanelCard = (function (_Component4) {
    _inherits(InfoPanelCard, _Component4);

    function InfoPanelCard() {
        _classCallCheck(this, InfoPanelCard);

        _Component4.apply(this, arguments);
    }

    InfoPanelCard.prototype.componentDidMount = function componentDidMount() {
        var _this3 = this;

        this._int = setInterval(function () {
            _this3.setState({ closed: !(_this3.state && _this3.state.closed) });
        }, 1500);
    };

    InfoPanelCard.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this._int) clearInterval(this._int);
    };

    InfoPanelCard.prototype.render = function render() {
        var leftStyle = { width: 24, transition: DOMUtils.getBeziersTransition(), transform: 'scaleX(1)', transformOrigin: 'right' };
        if (this.state && this.state.closed) {
            leftStyle = _extends({}, leftStyle, { width: 0, transform: 'scaleX(0)' });
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                this.props.message('infopanel.1')
            ),
            React.createElement(
                Scheme,
                { style: { fontSize: 10, padding: 25 }, dimension: 130 },
                React.createElement(
                    'div',
                    { style: { boxShadow: '2px 2px 0px #CFD8DC', display: 'flex' } },
                    React.createElement(
                        'div',
                        { style: { backgroundColor: 'white', flex: 3 } },
                        React.createElement(
                            'div',
                            null,
                            React.createElement('span', { className: 'mdi mdi-folder' }),
                            ' ',
                            this.props.message('infopanel.folder'),
                            ' 1 '
                        ),
                        React.createElement(
                            'div',
                            { style: { backgroundColor: '#03a9f4', color: 'white' } },
                            React.createElement('span', { className: 'mdi mdi-folder' }),
                            '  ',
                            this.props.message('infopanel.folder'),
                            ' 2'
                        ),
                        React.createElement(
                            'div',
                            null,
                            React.createElement('span', { className: 'mdi mdi-file' }),
                            ' ',
                            this.props.message('infopanel.file'),
                            ' 3'
                        ),
                        React.createElement(
                            'div',
                            null,
                            React.createElement('span', { className: 'mdi mdi-file' }),
                            ' ',
                            this.props.message('infopanel.file'),
                            ' 4'
                        )
                    ),
                    React.createElement(
                        'div',
                        { style: leftStyle },
                        React.createElement(
                            'div',
                            { style: { backgroundColor: '#edf4f7', padding: 4, height: '100%', fontSize: 17 } },
                            React.createElement('span', { className: 'mdi mdi-information-variant' })
                        )
                    )
                )
            ),
            React.createElement(
                'p',
                null,
                this.props.message('infopanel.2'),
                ' (',
                React.createElement('span', { className: 'mdi mdi-information', style: { fontSize: 18, color: '#5c7784' } }),
                ').'
            )
        );
    };

    return InfoPanelCard;
})(_react.Component);

var UserWidgetCard = (function (_Component5) {
    _inherits(UserWidgetCard, _Component5);

    function UserWidgetCard() {
        _classCallCheck(this, UserWidgetCard);

        _Component5.apply(this, arguments);
    }

    UserWidgetCard.prototype.render = function render() {
        var iconStyle = {
            display: 'inline-block',
            textAlign: 'center',
            fontSize: 17,
            lineHeight: '20px',
            backgroundColor: '#ECEFF1',
            color: '#607D8B',
            borderRadius: '50%',
            padding: '5px 6px',
            width: 30,
            height: 30,
            marginRight: 5
        };
        return React.createElement(
            'div',
            null,
            React.createElement(
                'p',
                null,
                React.createElement('span', { className: 'mdi mdi-book-open-variant', style: iconStyle }),
                ' ',
                this.props.message('uwidget.addressbook')
            ),
            React.createElement(_materialUi.Divider, null),
            React.createElement(
                'p',
                null,
                React.createElement('span', { className: 'mdi mdi-bell-outline', style: iconStyle }),
                ' ',
                this.props.message('uwidget.alerts')
            ),
            React.createElement(_materialUi.Divider, null),
            React.createElement(
                'p',
                null,
                React.createElement('span', { className: 'mdi mdi-dots-vertical', style: iconStyle }),
                ' ',
                this.props.message('uwidget.menu')
            ),
            React.createElement(_materialUi.Divider, null),
            React.createElement(
                'p',
                null,
                React.createElement('span', { className: 'mdi mdi-home-variant', style: iconStyle }),
                ' ',
                this.props.message('uwidget.home')
            )
        );
    };

    return UserWidgetCard;
})(_react.Component);

var WelcomeTour = (function (_Component6) {
    _inherits(WelcomeTour, _Component6);

    function WelcomeTour(props, context) {
        _classCallCheck(this, WelcomeTour);

        _Component6.call(this, props, context);
        this.state = { started: !(props.pydio.user && !props.pydio.user.getPreference('gui_preferences', true)['UserAccount.WelcomeModal.Shown']) };
    }

    WelcomeTour.prototype.discard = function discard() {
        var finished = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
        var user = this.props.pydio.user;

        var guiPrefs = user.getPreference('gui_preferences', true);
        guiPrefs['UserAccount.WelcomeModal.Shown'] = true;
        if (finished) guiPrefs['WelcomeComponent.Pydio8.TourGuide.FSTemplate'] = true;
        user.setPreference('gui_preferences', guiPrefs, true);
        user.savePreference('gui_preferences');
    };

    WelcomeTour.prototype.componentDidMount = function componentDidMount() {
        var _this4 = this;

        if (!this.state.started) {
            pydio.UI.openComponentInModal('UserAccount', 'WelcomeModal', {
                onRequestStart: function onRequestStart(skip) {
                    if (skip) {
                        _this4.discard(true);
                    } else {
                        _this4.discard();
                        _this4.setState({ started: true, skip: skip });
                    }
                }
            });
        }
    };

    WelcomeTour.prototype.render = function render() {
        var _this5 = this;

        if (!this.state.started || this.state.skip) {
            return null;
        }
        var getMessage = this.props.getMessage;

        var message = function message(id) {
            return getMessage('ajax_gui.tour.' + id);
        };

        var tourguideSteps = [];

        if (pydio.user && pydio.user.activeRepository) {
            tourguideSteps.push({
                title: message('create-menu.title'),
                text: React.createElement(CreateMenuCard, { message: message, pydio: this.props.pydio }),
                selector: '#create-button-menu',
                position: 'left',
                style: { width: 220 }
            });
        }

        tourguideSteps = tourguideSteps.concat([{
            title: message('display-bar.title'),
            text: React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    message('display-bar')
                ),
                React.createElement(IconScheme, { icons: ['view-list', 'view-grid', 'view-carousel', 'sort-ascending', 'sort-descending'] })
            ),
            selector: '#display-toolbar',
            position: 'left'
        }, {
            title: message('infopanel.title'),
            text: React.createElement(InfoPanelCard, { message: message }),
            selector: '#info_panel',
            position: 'left'
        }, {
            title: message('uwidget.title'),
            text: React.createElement(UserWidgetCard, { message: message }),
            selector: '.user-widget',
            position: 'right',
            style: { width: 320 }
        }]);
        var callback = function callback(data) {
            if (data.type === 'step:after' && data.index === tourguideSteps.length - 1) {
                _this5.discard(true);
            }
        };
        return React.createElement(_TourGuide2['default'], {
            ref: 'joyride',
            steps: tourguideSteps,
            run: true, // or some other boolean for when you want to start it
            autoStart: true,
            debug: false,
            callback: callback,
            type: 'continuous'
        });
    };

    return WelcomeTour;
})(_react.Component);

exports['default'] = WelcomeTour = PydioContextConsumer(WelcomeTour);
exports['default'] = WelcomeTour;
module.exports = exports['default'];

},{"./TourGuide":83,"material-ui":"material-ui","pydio":"pydio","pydio/util/dom":"pydio/util/dom","react":"react"}],85:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _materialUi = require('material-ui');

var _reactDnd = require('react-dnd');

var _pydioUtilDom = require('pydio/util/dom');

var _pydioUtilDom2 = _interopRequireDefault(_pydioUtilDom);

var _pydioHttpResourcesManager = require('pydio/http/resources-manager');

var _pydioHttpResourcesManager2 = _interopRequireDefault(_pydioHttpResourcesManager);

var React = require('react');

var _require = require('material-ui/styles');

var muiThemeable = _require.muiThemeable;

var Pydio = require('pydio');
var PydioApi = require('pydio/http/api');
var Node = require('pydio/model/node');

var _Pydio$requireLib = Pydio.requireLib('components');

var FoldersTree = _Pydio$requireLib.FoldersTree;
var DND = _Pydio$requireLib.DND;
var ChatIcon = _Pydio$requireLib.ChatIcon;

var _Pydio$requireLib2 = Pydio.requireLib('hoc');

var withContextMenu = _Pydio$requireLib2.withContextMenu;
var Types = DND.Types;
var collect = DND.collect;
var collectDrop = DND.collectDrop;
var nodeDragSource = DND.nodeDragSource;
var nodeDropTarget = DND.nodeDropTarget;

var Badge = function Badge(_ref) {
    var children = _ref.children;
    var muiTheme = _ref.muiTheme;

    var style = {
        display: "inline-block",
        backgroundColor: muiTheme.palette.accent1Color,
        color: 'white',

        fontSize: 10,
        borderRadius: 6,
        padding: '0 5px',
        marginLeft: 5,
        height: 16,
        lineHeight: '17px',
        fontWeight: 500
    };

    return React.createElement(
        'span',
        { style: style },
        children
    );
};

Badge = muiThemeable()(Badge);

var Confirm = React.createClass({
    displayName: 'Confirm',

    propTypes: {
        pydio: React.PropTypes.instanceOf(Pydio),
        onDecline: React.PropTypes.func,
        onAccept: React.PropTypes.func,
        mode: React.PropTypes.oneOf(['new_share', 'reject_accepted'])
    },

    componentDidMount: function componentDidMount() {
        this.refs.dialog.show();
    },

    render: function render() {
        var messages = this.props.pydio.MessageHash,
            messageTitle = messages[545],
            messageBody = messages[546],
            actions = [{ text: messages[548], ref: 'decline', onClick: this.props.onDecline }, { text: messages[547], ref: 'accept', onClick: this.props.onAccept }];
        if (this.props.mode === 'reject_accepted') {
            messageBody = messages[549];
            actions = [{ text: messages[54], ref: 'decline', onClick: this.props.onDecline }, { text: messages[551], ref: 'accept', onClick: this.props.onAccept }];
        }

        for (var key in this.props.replacements) {
            messageTitle = messageTitle.replace(new RegExp(key), this.props.replacements[key]);
            messageBody = messageBody.replace(new RegExp(key), this.props.replacements[key]);
        }

        return React.createElement(
            'div',
            { className: 'react-mui-context', style: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' } },
            React.createElement(
                ReactMUI.Dialog,
                {
                    ref: 'dialog',
                    title: messageTitle,
                    actions: actions,
                    modal: false,
                    dismissOnClickAway: true,
                    onDismiss: this.props.onDismiss.bind(this),
                    open: true
                },
                messageBody
            )
        );
    }
});

var WorkspaceEntry = React.createClass({
    displayName: 'WorkspaceEntry',

    propTypes: {
        pydio: React.PropTypes.instanceOf(Pydio).isRequired,
        workspace: React.PropTypes.instanceOf(Repository).isRequired,
        showFoldersTree: React.PropTypes.bool,
        onHoverLink: React.PropTypes.func,
        onOutLink: React.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return {
            openAlert: false,
            openFoldersTree: false,
            currentContextNode: this.props.pydio.getContextHolder().getContextNode()
        };
    },

    getLetterBadge: function getLetterBadge() {
        return { __html: this.props.workspace.getHtmlBadge(true) };
    },

    componentDidMount: function componentDidMount() {
        if (this.props.showFoldersTree) {
            this._monitorFolder = (function () {
                this.setState({ currentContextNode: this.props.pydio.getContextHolder().getContextNode() });
            }).bind(this);
            this.props.pydio.getContextHolder().observe("context_changed", this._monitorFolder);
        }
    },

    componentWillUnmount: function componentWillUnmount() {
        if (this._monitorFolder) {
            this.props.pydio.getContextHolder().stopObserving("context_changed", this._monitorFolder);
        }
    },

    handleAccept: function handleAccept() {
        this.props.workspace.setAccessStatus('accepted');
        this.handleCloseAlert();
        this.onClick();
    },

    handleDecline: function handleDecline() {
        // Switching status to decline
        this.props.workspace.setAccessStatus('declined');
        this.props.pydio.fire("repository_list_refreshed", {
            list: this.props.pydio.user.getRepositoriesList(),
            active: this.props.pydio.user.getActiveRepository()
        });
        this.handleCloseAlert();
    },

    handleOpenAlert: function handleOpenAlert(mode, event) {
        if (mode === undefined) mode = 'new_share';

        event.stopPropagation();
        this.wrapper = document.body.appendChild(document.createElement('div'));
        this.wrapper.style.zIndex = 11;
        var replacements = {
            '%%OWNER%%': this.props.workspace.getOwner()
        };
        ReactDOM.render(React.createElement(Confirm, _extends({}, this.props, {
            mode: mode,
            replacements: replacements,
            onAccept: mode === 'new_share' ? this.handleAccept.bind(this) : this.handleDecline.bind(this),
            onDecline: mode === 'new_share' ? this.handleDecline.bind(this) : this.handleCloseAlert.bind(this),
            onDismiss: this.handleCloseAlert
        })), this.wrapper);
    },

    handleCloseAlert: function handleCloseAlert() {
        ReactDOM.unmountComponentAtNode(this.wrapper);
        this.wrapper.remove();
    },

    onClick: function onClick() {
        var _this = this;

        if (this.props.workspace.getId() === this.props.pydio.user.activeRepository && this.props.showFoldersTree) {
            this.props.pydio.goTo('/');
        } else {
            this.props.pydio.observeOnce('repository_list_refreshed', function () {
                _this.setState({ loading: false });
            });
            this.setState({ loading: true });
            this.props.pydio.triggerRepositoryChange(this.props.workspace.getId());
        }
    },

    toggleFoldersPanelOpen: function toggleFoldersPanelOpen(ev) {
        ev.stopPropagation();
        this.setState({ openFoldersTree: !this.state.openFoldersTree });
    },

    getItemStyle: function getItemStyle(node) {
        var isContext = this.props.pydio.getContextHolder().getContextNode() === node;
        var accent2 = this.props.muiTheme.palette.accent2Color;
        if (isContext) {
            return {
                backgroundColor: accent2,
                color: 'white'
            };
        }
        var isSelected = this.props.pydio.getContextHolder().getSelectedNodes().indexOf(node) !== -1;
        if (isSelected) {
            return {
                backgroundColor: _color2['default'](accent2).lightness(95).toString()
            };
        }
        return {};
    },

    roomPopover: function roomPopover(event) {
        var _this2 = this;

        event.stopPropagation();
        var target = event.target;

        var offsetTop = target.getBoundingClientRect().top;
        var viewport = _pydioUtilDom2['default'].getViewportHeight();
        var popoverTop = viewport - offsetTop < 250;
        _pydioHttpResourcesManager2['default'].loadClassesAndApply(["ShareDialog"], function () {
            var popoverContent = React.createElement(ShareDialog.CellCard, {
                pydio: _this2.props.pydio,
                cellId: _this2.props.workspace.getId(),
                onDismiss: function () {
                    _this2.setState({ popoverOpen: false });
                },
                onHeightChange: function () {
                    _this2.setState({ popoverHeight: 500 });
                }
            });
            _this2.setState({ popoverAnchor: target, popoverOpen: true, popoverContent: popoverContent, popoverTop: popoverTop, popoverHeight: null });
        });
    },

    render: function render() {
        var _this3 = this;

        var _props = this.props;
        var workspace = _props.workspace;
        var pydio = _props.pydio;
        var onHoverLink = _props.onHoverLink;
        var onOutLink = _props.onOutLink;
        var showFoldersTree = _props.showFoldersTree;

        var current = pydio.user.getActiveRepository() === workspace.getId(),
            currentClass = "workspace-entry",
            messages = pydio.MessageHash,
            onHover = undefined,
            onOut = undefined,
            onClick = undefined,
            additionalAction = undefined,
            treeToggle = undefined;

        var style = {};

        if (current) {
            currentClass += " workspace-current";
            if (this.state.openFoldersTree) {
                style = this.getItemStyle(pydio.getContextHolder().getRootNode());
            } else {
                style = this.getItemStyle(pydio.getContextHolder().getContextNode());
            }
        }

        currentClass += " workspace-access-" + workspace.getAccessType();

        if (onHoverLink) {
            onHover = (function (event) {
                onHoverLink(event, workspace);
            }).bind(this);
        }

        if (onOutLink) {
            onOut = (function (event) {
                onOutLink(event, workspace);
            }).bind(this);
        }

        onClick = this.onClick;
        var chatIcon = undefined;

        if (workspace.getOwner()) {
            additionalAction = React.createElement('span', { className: 'workspace-additional-action mdi mdi-dots-vertical', onClick: this.roomPopover.bind(this) });
            if (!pydio.getPluginConfigs("action.advanced_settings").get("GLOBAL_DISABLE_CHATS")) {
                chatIcon = React.createElement(ChatIcon, { pydio: pydio, roomType: 'WORKSPACE', objectId: workspace.getId() });
            }
        }

        if (workspace.getOwner() && !workspace.getAccessStatus() && !workspace.getLastConnection()) {
            //newWorkspace = <Badge>NEW</Badge>;
            // Dialog for remote shares
            if (workspace.getRepositoryType() === "remote") {
                onClick = this.handleOpenAlert.bind(this, 'new_share');
            }
        } else if (workspace.getRepositoryType() === "remote" && !current) {
            // Remote share but already accepted, add delete
            additionalAction = React.createElement('span', { className: 'workspace-additional-action mdi mdi-close', onClick: this.handleOpenAlert.bind(this, 'reject_accepted'), title: messages['550'] });
        }

        if (this.state && this.state.loading) {
            additionalAction = React.createElement(_materialUi.CircularProgress, { size: 20, thickness: 3, style: { marginTop: 2, marginRight: 6, opacity: .5 } });
        }

        if (showFoldersTree) {
            var fTCName = this.state.openFoldersTree ? "mdi mdi-chevron-down" : "mdi mdi-chevron-right";
            treeToggle = React.createElement('span', { style: { opacity: 1 }, className: 'workspace-additional-action ' + fTCName, onClick: this.toggleFoldersPanelOpen });
        }

        var menuNode = undefined;
        if (workspace.getId() === pydio.user.activeRepository) {
            menuNode = pydio.getContextHolder().getRootNode();
        } else {
            /*
            menuNode = new Node('/', false, workspace.getLabel());
            menuNode.setRoot(true);
            const metaMap = new Map();
            metaMap.set('repository_id', workspace.getId());
            menuNode.setMetadata(metaMap);
            */
        }

        var _state = this.state;
        var popoverOpen = _state.popoverOpen;
        var popoverAnchor = _state.popoverAnchor;
        var popoverTop = _state.popoverTop;
        var popoverHeight = _state.popoverHeight;

        var title = workspace.getLabel();
        if (workspace.getDescription()) {
            title += ' - ' + workspace.getDescription();
        }

        var wsBlock = React.createElement(
            ContextMenuWrapper,
            {
                node: menuNode,
                className: currentClass,
                onClick: onClick,
                onMouseOver: onHover,
                onMouseOut: onOut,
                style: style
            },
            React.createElement(
                'span',
                { className: 'workspace-label', title: title },
                workspace.getLabel()
            ),
            chatIcon,
            treeToggle,
            React.createElement('span', { style: { flex: 1 } }),
            additionalAction,
            React.createElement(
                _materialUi.Popover,
                {
                    open: popoverOpen,
                    anchorEl: popoverAnchor,
                    useLayerForClickAway: true,
                    autoCloseWhenOffScreen: false,
                    canAutoPosition: true,
                    onRequestClose: function () {
                        _this3.setState({ popoverOpen: false });
                    },
                    anchorOrigin: { horizontal: "right", vertical: popoverTop ? "bottom" : "center" },
                    targetOrigin: { horizontal: "left", vertical: popoverTop ? "bottom" : "center" },
                    zDepth: 3,
                    style: { overflow: 'hidden', borderRadius: 10, height: popoverHeight }
                },
                this.state.popoverContent
            )
        );

        if (showFoldersTree) {
            return React.createElement(
                'div',
                null,
                wsBlock,
                React.createElement(FoldersTree, {
                    pydio: pydio,
                    dataModel: pydio.getContextHolder(),
                    className: this.state.openFoldersTree ? "open" : "closed",
                    draggable: true,
                    getItemStyle: this.getItemStyle
                })
            );
        } else {
            return wsBlock;
        }
    }

});

var ContextMenuWrapper = function ContextMenuWrapper(props) {
    var canDrop = props.canDrop;
    var isOver = props.isOver;
    var connectDropTarget = props.connectDropTarget;

    var className = props.className || '';
    if (canDrop && isOver) {
        className += ' droppable-active';
    }
    return React.createElement('div', _extends({}, props, {
        className: className,
        ref: function (instance) {
            var node = ReactDOM.findDOMNode(instance);
            if (typeof connectDropTarget === 'function') connectDropTarget(node);
        }
    }));
};
ContextMenuWrapper = withContextMenu(ContextMenuWrapper);
ContextMenuWrapper = _reactDnd.DropTarget(Types.NODE_PROVIDER, nodeDropTarget, collectDrop)(ContextMenuWrapper);
exports['default'] = WorkspaceEntry = muiThemeable()(WorkspaceEntry);

exports['default'] = WorkspaceEntry;
module.exports = exports['default'];

},{"color":"color","material-ui":"material-ui","material-ui/styles":"material-ui/styles","pydio":"pydio","pydio/http/api":"pydio/http/api","pydio/http/resources-manager":"pydio/http/resources-manager","pydio/model/node":"pydio/model/node","pydio/util/dom":"pydio/util/dom","react":"react","react-dnd":"react-dnd"}],86:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var _require = require('material-ui');

var ListItem = _require.ListItem;
var Avatar = _require.Avatar;
var FontIcon = _require.FontIcon;

var _require2 = require('material-ui/styles');

var muiThemeable = _require2.muiThemeable;

var Color = require('color');

var Pydio = require('pydio');
var Repository = require('pydio/model/repository');

var WorkspaceEntryMaterial = (function (_React$Component) {
    _inherits(WorkspaceEntryMaterial, _React$Component);

    function WorkspaceEntryMaterial() {
        _classCallCheck(this, WorkspaceEntryMaterial);

        _React$Component.apply(this, arguments);
    }

    WorkspaceEntryMaterial.prototype.onClick = function onClick() {
        if (this.props.onWorkspaceTouchTap) {
            this.props.onWorkspaceTouchTap(this.props.workspace.getId());
            return;
        }
        if (this.props.workspace.getId() === this.props.pydio.user.activeRepository && this.props.showFoldersTree) {
            this.props.pydio.goTo('/');
        } else {
            this.props.pydio.triggerRepositoryChange(this.props.workspace.getId());
        }
    };

    WorkspaceEntryMaterial.prototype.render = function render() {
        var _props = this.props;
        var workspace = _props.workspace;
        var muiTheme = _props.muiTheme;

        var leftAvatar = undefined,
            leftIcon = undefined;
        var color = muiTheme.palette.primary1Color;
        //let backgroundColor = new Color(muiTheme.palette.primary1Color).lightness(96).rgb().toString();
        var backgroundColor = '#ECEFF1';
        if (workspace.getOwner() || workspace.getAccessType() === 'inbox') {
            color = MaterialUI.Style.colors.teal500;
            var icon = workspace.getAccessType() === 'inbox' ? 'file-multiple' : 'folder-outline';
            if (workspace.getRepositoryType() === 'remote') icon = 'cloud-outline';
            leftAvatar = React.createElement(Avatar, { backgroundColor: backgroundColor, color: color, icon: React.createElement(FontIcon, { className: 'mdi mdi-' + icon }) });
        } else {
            leftAvatar = React.createElement(
                Avatar,
                { style: { fontSize: 18 }, backgroundColor: backgroundColor, color: color },
                workspace.getLettersBadge()
            );
        }
        return React.createElement(ListItem, {
            leftAvatar: leftAvatar,
            leftIcon: leftIcon,
            primaryText: workspace.getLabel(),
            secondaryText: workspace.getDescription(),
            onTouchTap: this.onClick.bind(this)
        });
    };

    return WorkspaceEntryMaterial;
})(React.Component);

WorkspaceEntryMaterial.propTypes = {
    pydio: React.PropTypes.instanceOf(Pydio).isRequired,
    workspace: React.PropTypes.instanceOf(Repository).isRequired,
    muiTheme: React.PropTypes.object
};

exports['default'] = WorkspaceEntryMaterial = muiThemeable()(WorkspaceEntryMaterial);
exports['default'] = WorkspaceEntryMaterial;
module.exports = exports['default'];

},{"color":"color","material-ui":"material-ui","material-ui/styles":"material-ui/styles","pydio":"pydio","pydio/model/repository":"pydio/model/repository","react":"react"}],87:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var _WorkspaceEntry = require('./WorkspaceEntry');

var _WorkspaceEntry2 = _interopRequireDefault(_WorkspaceEntry);

var _pydioHttpResourcesManager = require('pydio/http/resources-manager');

var _pydioHttpResourcesManager2 = _interopRequireDefault(_pydioHttpResourcesManager);

var _materialUi = require('material-ui');

var _pydioUtilLang = require('pydio/util/lang');

var _pydioUtilLang2 = _interopRequireDefault(_pydioUtilLang);

var _Pydio$requireLib = _pydio2['default'].requireLib('hoc');

var withVerticalScroll = _Pydio$requireLib.withVerticalScroll;

var _Pydio$requireLib2 = _pydio2['default'].requireLib('components');

var EmptyStateView = _Pydio$requireLib2.EmptyStateView;

var Repository = require('pydio/model/repository');

var _require = require('material-ui/styles');

var muiThemeable = _require.muiThemeable;

var WorkspacesList = (function (_React$Component) {
    _inherits(WorkspacesList, _React$Component);

    function WorkspacesList(props, context) {
        var _this = this;

        _classCallCheck(this, WorkspacesList);

        _React$Component.call(this, props, context);
        this.state = this.stateFromPydio(props.pydio);
        this._reloadObserver = function () {
            _this.setState(_this.stateFromPydio(_this.props.pydio));
        };
    }

    WorkspacesList.prototype.stateFromPydio = function stateFromPydio(pydio) {
        return {
            workspaces: pydio.user ? pydio.user.getRepositoriesList() : [],
            showTreeForWorkspace: pydio.user ? pydio.user.activeRepository : false
        };
    };

    WorkspacesList.prototype.componentDidMount = function componentDidMount() {
        this.props.pydio.observe('repository_list_refreshed', this._reloadObserver);
    };

    WorkspacesList.prototype.componentWillUnmount = function componentWillUnmount() {
        this.props.pydio.stopObserving('repository_list_refreshed', this._reloadObserver);
    };

    WorkspacesList.prototype.createRepositoryEnabled = function createRepositoryEnabled() {
        return this.props.pydio.getPluginConfigs("auth").get("USER_CREATE_CELLS");
    };

    WorkspacesList.prototype.render = function render() {
        var _this3 = this;

        var entries = [],
            sharedEntries = [],
            createAction = undefined;
        var _state = this.state;
        var workspaces = _state.workspaces;
        var showTreeForWorkspace = _state.showTreeForWorkspace;
        var _props = this.props;
        var pydio = _props.pydio;
        var className = _props.className;
        var style = _props.style;
        var filterByType = _props.filterByType;
        var muiTheme = _props.muiTheme;

        var wsList = [];
        workspaces.forEach(function (o, k) {
            wsList.push(o);
        });
        wsList.sort(_pydioUtilLang2['default'].arraySorter('getLabel', true));

        wsList.forEach((function (object) {

            var key = object.getId();
            if (Repository.isInternal(key)) return;
            if (object.hasContentFilter()) return;
            if (object.getAccessStatus() === 'declined') return;

            var entry = _react2['default'].createElement(_WorkspaceEntry2['default'], _extends({}, this.props, {
                key: key,
                workspace: object,
                showFoldersTree: showTreeForWorkspace && showTreeForWorkspace === key
            }));
            if (object.getOwner()) {
                sharedEntries.push(entry);
            } else {
                entries.push(entry);
            }
        }).bind(this));

        var messages = pydio.MessageHash;
        var createClick = (function (event) {
            var _this2 = this;

            var target = event.target;
            _pydioHttpResourcesManager2['default'].loadClassesAndApply(['ShareDialog'], function () {
                _this2.setState({
                    popoverOpen: true,
                    popoverAnchor: target,
                    popoverContent: _react2['default'].createElement(ShareDialog.CreateCellDialog, { pydio: _this2.props.pydio, onDismiss: function () {
                            _this2.setState({ popoverOpen: false });
                        } })
                });
            });
        }).bind(this);
        if (this.createRepositoryEnabled()) {
            var styles = {
                button: {
                    width: 36,
                    height: 36,
                    padding: 6,
                    position: 'absolute',
                    right: 8,
                    top: 8
                },
                icon: {
                    fontSize: 22,
                    color: muiTheme.palette.accent1Color //'rgba(0,0,0,.54)'
                }
            };
            if (sharedEntries.length) {
                createAction = _react2['default'].createElement(_materialUi.IconButton, {
                    style: styles.button,
                    iconStyle: styles.icon,
                    iconClassName: "icomoon-cells-clear-plus",
                    tooltip: messages[417],
                    tooltipPosition: "top-left",
                    onTouchTap: createClick
                });
            }
        }

        var sections = [];
        if (entries.length) {
            sections.push({
                k: 'entries',
                title: _react2['default'].createElement(
                    'div',
                    { key: 'entries-title', className: 'section-title', style: this.props.sectionTitleStyle },
                    messages[468]
                ),
                content: _react2['default'].createElement(
                    'div',
                    { key: 'entries-ws', className: 'workspaces' },
                    entries
                )
            });
        }
        if (!sharedEntries.length) {
            sharedEntries = _react2['default'].createElement(EmptyStateView, {
                iconClassName: "icomoon-cells",
                primaryTextId: messages[632],
                secondaryTextId: messages[633],
                actionLabelId: this.createRepositoryEnabled() ? messages[418] : null,
                actionCallback: this.createRepositoryEnabled() ? createClick : null,
                actionStyle: { marginTop: 20 },
                style: { backgroundColor: 'transparent' }
            });
        }
        sections.push({
            k: 'shared',
            title: _react2['default'].createElement(
                'div',
                { key: 'shared-title', className: 'section-title', style: _extends({}, this.props.sectionTitleStyle, { position: 'relative', overflow: 'visible' }) },
                sharedEntries.length ? messages[469] : '',
                createAction
            ),
            content: _react2['default'].createElement(
                'div',
                { key: 'shared-ws', className: 'workspaces' },
                sharedEntries
            )
        });

        var classNames = ['user-workspaces-list'];
        if (className) classNames.push(className);

        if (filterByType) {
            var ret = undefined;
            sections.map(function (s) {
                if (filterByType && filterByType === s.k) {
                    ret = _react2['default'].createElement(
                        'div',
                        { className: classNames.join(' '), style: style },
                        s.title,
                        s.content
                    );
                }
            });
            return ret;
        }

        var elements = [];
        sections.map(function (s) {
            elements.push(s.title);
            elements.push(s.content);
        });
        return _react2['default'].createElement(
            'div',
            { className: classNames.join(' '), style: style },
            elements,
            _react2['default'].createElement(
                _materialUi.Popover,
                {
                    open: this.state.popoverOpen,
                    anchorEl: this.state.popoverAnchor,
                    useLayerForClickAway: true,
                    onRequestClose: function () {
                        _this3.setState({ popoverOpen: false });
                    },
                    anchorOrigin: sharedEntries.length ? { horizontal: "left", vertical: "top" } : { horizontal: "right", vertical: "center" },
                    targetOrigin: sharedEntries.length ? { horizontal: "left", vertical: "top" } : { horizontal: "left", vertical: "center" },
                    zDepth: 3,
                    style: { borderRadius: 10, overflow: 'hidden', marginLeft: sharedEntries.length ? -10 : 0, marginTop: sharedEntries.length ? -10 : 0 }
                },
                this.state.popoverContent
            )
        );
    };

    return WorkspacesList;
})(_react2['default'].Component);

WorkspacesList.PropTypes = {
    pydio: _react2['default'].PropTypes.instanceOf(_pydio2['default']),
    workspaces: _react2['default'].PropTypes.instanceOf(Map),
    showTreeForWorkspace: _react2['default'].PropTypes.string,
    onHoverLink: _react2['default'].PropTypes.func,
    onOutLink: _react2['default'].PropTypes.func,
    className: _react2['default'].PropTypes.string,
    style: _react2['default'].PropTypes.object,
    sectionTitleStyle: _react2['default'].PropTypes.object,
    filterByType: _react2['default'].PropTypes.oneOf(['shared', 'entries', 'create'])
};

exports['default'] = WorkspacesList = withVerticalScroll(WorkspacesList);
exports['default'] = WorkspacesList = muiThemeable()(WorkspacesList);

exports['default'] = WorkspacesList;
module.exports = exports['default'];

},{"./WorkspaceEntry":85,"material-ui":"material-ui","material-ui/styles":"material-ui/styles","pydio":"pydio","pydio/http/resources-manager":"pydio/http/resources-manager","pydio/model/repository":"pydio/model/repository","pydio/util/lang":"pydio/util/lang","react":"react"}],88:[function(require,module,exports){
/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _WorkspaceEntryMaterial = require('./WorkspaceEntryMaterial');

var _WorkspaceEntryMaterial2 = _interopRequireDefault(_WorkspaceEntryMaterial);

var _pydio = require('pydio');

var _pydio2 = _interopRequireDefault(_pydio);

var React = require('react');
var Repository = require('pydio/model/repository');

var _require = require('material-ui');

var List = _require.List;
var Subheader = _require.Subheader;
var Divider = _require.Divider;

var WorkspacesListMaterial = (function (_React$Component) {
    _inherits(WorkspacesListMaterial, _React$Component);

    function WorkspacesListMaterial() {
        _classCallCheck(this, WorkspacesListMaterial);

        _React$Component.apply(this, arguments);
    }

    WorkspacesListMaterial.prototype.render = function render() {
        var _props = this.props;
        var workspaces = _props.workspaces;
        var showTreeForWorkspace = _props.showTreeForWorkspace;
        var filterByType = _props.filterByType;

        var inboxEntry = undefined,
            entries = [],
            sharedEntries = [],
            remoteShares = [];

        workspaces.forEach((function (object, key) {

            if (Repository.isInternal(object.getId())) return;
            if (object.hasContentFilter()) return;
            if (object.getAccessStatus() === 'declined') return;

            var entry = React.createElement(_WorkspaceEntryMaterial2['default'], _extends({}, this.props, {
                key: key,
                workspace: object,
                showFoldersTree: showTreeForWorkspace && showTreeForWorkspace === key
            }));
            if (object.getAccessType() == "inbox") {
                inboxEntry = entry;
            } else if (object.getOwner()) {
                if (object.getRepositoryType() === 'remote') {
                    remoteShares.push(entry);
                } else {
                    sharedEntries.push(entry);
                }
            } else {
                entries.push(entry);
            }
        }).bind(this));

        var messages = pydio.MessageHash;

        var allEntries = undefined;
        if (sharedEntries.length) {
            sharedEntries.unshift(React.createElement(
                Subheader,
                null,
                messages[626]
            ));
        }
        if (inboxEntry) {
            if (sharedEntries.length) {
                sharedEntries.unshift(React.createElement(Divider, null));
            }
            sharedEntries.unshift(inboxEntry);
            sharedEntries.unshift(React.createElement(
                Subheader,
                null,
                messages[630]
            ));
        }
        if (remoteShares.length) {
            remoteShares.unshift(React.createElement(
                Subheader,
                null,
                messages[627]
            ));
            remoteShares.unshift(React.createElement(Divider, null));
            sharedEntries = sharedEntries.concat(remoteShares);
        }
        if (filterByType === 'entries') {
            entries.unshift(React.createElement(
                Subheader,
                null,
                messages[468]
            ));
        }
        if (filterByType) {
            allEntries = filterByType === 'shared' ? sharedEntries : entries;
        } else {
            allEntries = entries.concat(sharedEntries);
        }

        return React.createElement(
            List,
            { style: this.props.style },
            allEntries
        );
    };

    return WorkspacesListMaterial;
})(React.Component);

WorkspacesListMaterial.propTypes = {
    pydio: React.PropTypes.instanceOf(_pydio2['default']),
    workspaces: React.PropTypes.instanceOf(Map),
    filterByType: React.PropTypes.oneOf(['shared', 'entries', 'create']),

    sectionTitleStyle: React.PropTypes.object,
    showTreeForWorkspace: React.PropTypes.string,
    onHoverLink: React.PropTypes.func,
    onOutLink: React.PropTypes.func,
    className: React.PropTypes.string,
    style: React.PropTypes.object
};

exports['default'] = WorkspacesListMaterial;
module.exports = exports['default'];

},{"./WorkspaceEntryMaterial":86,"material-ui":"material-ui","pydio":"pydio","pydio/model/repository":"pydio/model/repository","react":"react"}]},{},[62])(62)
});
