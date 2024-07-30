(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":7}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/is-iterable"), __esModule: true };
},{"core-js/library/fn/is-iterable":8}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":9}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _promise = require("../core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new _promise2.default(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return _promise2.default.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};
},{"../core-js/promise":3}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _isIterable2 = require("../core-js/is-iterable");

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require("../core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if ((0, _isIterable3.default)(Object(arr))) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();
},{"../core-js/get-iterator":1,"../core-js/is-iterable":2}],6:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":81}],7:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/core.get-iterator":72,"../modules/es6.string.iterator":77,"../modules/web.dom.iterable":80}],8:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.is-iterable');

},{"../modules/core.is-iterable":73,"../modules/es6.string.iterator":77,"../modules/web.dom.iterable":80}],9:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
require('../modules/es7.promise.finally');
require('../modules/es7.promise.try');
module.exports = require('../modules/_core').Promise;

},{"../modules/_core":17,"../modules/es6.object.to-string":75,"../modules/es6.promise":76,"../modules/es6.string.iterator":77,"../modules/es7.promise.finally":78,"../modules/es7.promise.try":79,"../modules/web.dom.iterable":80}],10:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],11:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],12:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],13:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":34}],14:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":62,"./_to-iobject":64,"./_to-length":65}],15:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":16,"./_wks":70}],16:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],17:[function(require,module,exports){
var core = module.exports = { version: '2.6.11' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],18:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":10}],19:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],20:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":24}],21:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":26,"./_is-object":34}],22:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],23:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":17,"./_ctx":18,"./_global":26,"./_has":27,"./_hide":28}],24:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],25:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":13,"./_ctx":18,"./_is-array-iter":33,"./_iter-call":35,"./_to-length":65,"./core.get-iterator-method":71}],26:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],27:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],28:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":20,"./_object-dp":45,"./_property-desc":52}],29:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":26}],30:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":20,"./_dom-create":21,"./_fails":24}],31:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],32:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":16}],33:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":40,"./_wks":70}],34:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],35:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":13}],36:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":28,"./_object-create":44,"./_property-desc":52,"./_set-to-string-tag":56,"./_wks":70}],37:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":23,"./_hide":28,"./_iter-create":36,"./_iterators":40,"./_library":41,"./_object-gpo":47,"./_redefine":54,"./_set-to-string-tag":56,"./_wks":70}],38:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":70}],39:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],40:[function(require,module,exports){
module.exports = {};

},{}],41:[function(require,module,exports){
module.exports = true;

},{}],42:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":16,"./_global":26,"./_task":61}],43:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":10}],44:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":13,"./_dom-create":21,"./_enum-bug-keys":22,"./_html":29,"./_object-dps":46,"./_shared-key":57}],45:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":13,"./_descriptors":20,"./_ie8-dom-define":30,"./_to-primitive":67}],46:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":13,"./_descriptors":20,"./_object-dp":45,"./_object-keys":49}],47:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":27,"./_shared-key":57,"./_to-object":66}],48:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":14,"./_has":27,"./_shared-key":57,"./_to-iobject":64}],49:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":22,"./_object-keys-internal":48}],50:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],51:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":13,"./_is-object":34,"./_new-promise-capability":43}],52:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],53:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":28}],54:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":28}],55:[function(require,module,exports){
'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_core":17,"./_descriptors":20,"./_global":26,"./_object-dp":45,"./_wks":70}],56:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":27,"./_object-dp":45,"./_wks":70}],57:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":58,"./_uid":68}],58:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":17,"./_global":26,"./_library":41}],59:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":10,"./_an-object":13,"./_wks":70}],60:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":19,"./_to-integer":63}],61:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":16,"./_ctx":18,"./_dom-create":21,"./_global":26,"./_html":29,"./_invoke":31}],62:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":63}],63:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],64:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":19,"./_iobject":32}],65:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":63}],66:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":19}],67:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":34}],68:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],69:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":26}],70:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":26,"./_shared":58,"./_uid":68}],71:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":15,"./_core":17,"./_iterators":40,"./_wks":70}],72:[function(require,module,exports){
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":13,"./_core":17,"./core.get-iterator-method":71}],73:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || Iterators.hasOwnProperty(classof(O));
};

},{"./_classof":15,"./_core":17,"./_iterators":40,"./_wks":70}],74:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":11,"./_iter-define":37,"./_iter-step":39,"./_iterators":40,"./_to-iobject":64}],75:[function(require,module,exports){

},{}],76:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":10,"./_an-instance":12,"./_classof":15,"./_core":17,"./_ctx":18,"./_export":23,"./_for-of":25,"./_global":26,"./_is-object":34,"./_iter-detect":38,"./_library":41,"./_microtask":42,"./_new-promise-capability":43,"./_perform":50,"./_promise-resolve":51,"./_redefine-all":53,"./_set-species":55,"./_set-to-string-tag":56,"./_species-constructor":59,"./_task":61,"./_user-agent":69,"./_wks":70}],77:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":37,"./_string-at":60}],78:[function(require,module,exports){
// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_core":17,"./_export":23,"./_global":26,"./_promise-resolve":51,"./_species-constructor":59}],79:[function(require,module,exports){
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":23,"./_new-promise-capability":43,"./_perform":50}],80:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":26,"./_hide":28,"./_iterators":40,"./_wks":70,"./es6.array.iterator":74}],81:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":82}],82:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],83:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  it: {
    query: {
      actions: {
        showelevation: "Visualizza elevazione"
      }
    },
    chart: {
      title: 'Elevazione',
      tooltip: {
        title: 'Distanza'
      },
      labels: {
        x: 'Distanza (m)',
        y: 'Altezza (m)'
      }
    }
  },
  en: {
    query: {
      actions: {
        showelevation: "Show elevation"
      }
    },
    chart: {
      title: "Elevation",
      tooltip: {
        title: "Distance"
      },
      labels: {
        x: 'Distance (m)',
        y: 'Height (m)'
      }
    }
  }
};

},{}],84:[function(require,module,exports){
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _i18n = require('./i18n');

var _i18n2 = _interopRequireDefault(_i18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  i18n: _i18n2.default
};

},{"./i18n":83}],85:[function(require,module,exports){
var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _g3wsdk$core$utils = g3wsdk.core.utils,
    base = _g3wsdk$core$utils.base,
    inherit = _g3wsdk$core$utils.inherit;

var Plugin = g3wsdk.core.plugin.Plugin;
var Service = require('./pluginservice');
var addI18nPlugin = g3wsdk.core.i18n.addI18nPlugin;

var _Plugin = function _Plugin() {
  base(this);
  this.name = 'eleprofile';
  this.init = function () {
    // add i18n of the plugin
    addI18nPlugin({
      name: this.name,
      config: _config2.default.i18n
    });
    // set catalog initial tab
    this.config = this.getConfig();
    this.setService(Service);
    this.service.init(this.config);
    this.registerPlugin(this.config.gid);
    // create API
    this.setReady(true);
  };
  //called when plugin is removed
  this.unload = function () {
    this.service.clear();
  };
};

inherit(_Plugin, Plugin);

(function (plugin) {
  plugin.init();
})(new _Plugin());

},{"./config":84,"./pluginservice":86}],86:[function(require,module,exports){
var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inherit = g3wsdk.core.utils.inherit;
var base = g3wsdk.core.utils.base;
var XHR = g3wsdk.core.utils.XHR;
var PluginService = g3wsdk.core.plugin.PluginService;
var t = g3wsdk.core.i18n.tPlugin;
var GUI = g3wsdk.gui.GUI;
var ChartsFactory = g3wsdk.gui.vue.Charts.ChartsFactory;

function ElevationProfileService() {
  base(this);
  this.init = function () {
    var _this = this;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.chartColor = GUI.skinColor;
    this.config = config;
    // add vue property to in add elevention chart element
    this.config.layers && this.config.layers.forEach(function (layerObj) {
      return layerObj._vue = {};
    });
    this._mapService = GUI.getComponent('map').getService();
    this.keySetters = {};
    var queryresultsComponent = GUI.getComponent('queryresults');
    this.queryresultsService = queryresultsComponent.getService();
    this.keySetters.openCloseFeatureResult = this.queryresultsService.onafter('openCloseFeatureResult', function (_ref) {
      var open = _ref.open,
          layer = _ref.layer,
          feature = _ref.feature,
          container = _ref.container;

      var layerObj = _this.config.layers.find(function (layerObj) {
        var layerId = layerObj.layer_id;

        return layer.id === layerId;
      });
      layerObj && _this.showHideChartComponent({
        open: open,
        container: container,
        layerObj: layerObj,
        fid: feature.attributes['g3w_fid']
      });
    });
  };

  this.getConfig = function () {
    return this.config;
  };

  this.getUrls = function () {
    return this.config.urls;
  };

  this.createLoadingComponentDomElement = function () {
    var loadingComponent = Vue.extend({
      template: '<bar-loader :loading="true"></bar-loader>'
    });
    return new loadingComponent().$mount().$el;
  };

  this.showHideChartComponent = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          open = _ref3.open,
          layerObj = _ref3.layerObj,
          container = _ref3.container,
          fid = _ref3.fid;

      var api, layerId, barLoadingDom, _ref4, component, error, vueComponentObject;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!open) {
                _context2.next = 26;
                break;
              }

              api = layerObj.api, layerId = layerObj.layer_id;
              barLoadingDom = this.createLoadingComponentDomElement();
              _context2.prev = 3;

              container.append(barLoadingDom);
              _context2.next = 7;
              return this.getChartComponent({ api: api, layerId: layerId, fid: fid });

            case 7:
              _ref4 = _context2.sent;
              component = _ref4.component;
              error = _ref4.error;

              if (!error) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt('return');

            case 12:
              vueComponentObject = Vue.extend(component);

              layerObj._vue[fid] = new vueComponentObject();
              layerObj._vue[fid].$once('hook:mounted', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        container.append(this.$el);
                        GUI.emit('resize');

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              })));
              layerObj._vue[fid].$mount();
              _context2.next = 21;
              break;

            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2['catch'](3);
              return _context2.abrupt('return', _context2.t0);

            case 21:
              _context2.prev = 21;

              barLoadingDom.remove();
              return _context2.finish(21);

            case 24:
              _context2.next = 27;
              break;

            case 26:
              if (layerObj._vue[fid]) {
                layerObj._vue[fid].$destroy();
                layerObj._vue[fid].$el.remove();
                layerObj._vue[fid] = undefined;
              }

            case 27:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[3, 18, 21, 24]]);
    }));

    return function () {
      return _ref2.apply(this, arguments);
    };
  }();

  this.getChartComponent = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          api = _ref7.api,
          layerId = _ref7.layerId,
          fid = _ref7.fid;

      var response, data, graphData, i, _data, x, y, self, map, hideHightlightFnc;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return this.getElevationData({ api: api, layerId: layerId, fid: fid });

            case 3:
              response = _context3.sent;
              data = response.result && response.profile;

              if (!data) {
                _context3.next = 12;
                break;
              }

              graphData = {
                x: ['x'],
                y: ['y'],
                minX: 9999999,
                maxX: -9999999,
                minY: 9999999,
                maxY: -9999999
              };

              for (i = 0; i < data.length; i++) {
                _data = data[i];
                x = _data[3];
                y = _data[2];

                graphData.minX = x < graphData.minX ? x : graphData.minX;
                graphData.minY = y < graphData.minY ? y : graphData.minY;
                graphData.maxX = x > graphData.maxX ? x : graphData.maxX;
                graphData.maxY = y > graphData.maxY ? y : graphData.maxY;
                graphData.x.push(x);
                graphData.y.push(y);
              }
              self = this;
              map = this._mapService.getMap();

              hideHightlightFnc = function hideHightlightFnc() {};

              return _context3.abrupt('return', {
                data: data,
                id: t('eleprofile.chart.title'),
                component: ChartsFactory.build({
                  type: 'c3:lineXY',
                  hooks: {
                    created: function created() {
                      this.setConfig({
                        onmouseout: function onmouseout() {
                          hideHightlightFnc();
                        },

                        title: {
                          text: t('eleprofile.chart.title'),
                          position: 'top-center'
                        },
                        padding: {
                          top: 40,
                          bottom: 30,
                          right: 30
                        },
                        zoom: {
                          enabled: true,
                          rescale: true
                        },
                        data: {
                          selection: {
                            enabled: false,
                            draggable: true
                          },
                          x: 'x',
                          y: 'y',
                          types: {
                            y: 'area'
                          },
                          colors: {
                            x: self.chartColor,
                            y: self.chartColor
                          },
                          columns: [graphData.x, graphData.y],
                          onmouseout: function onmouseout(evt) {
                            hideHightlightFnc();
                          },
                          onclick: function onclick(_ref8) {
                            var index = _ref8.index;

                            var _data$index = (0, _slicedToArray3.default)(data[index], 2),
                                x = _data$index[0],
                                y = _data$index[1];

                            map.getView().setCenter([x, y]);
                          }
                        },
                        legend: {
                          show: false
                        },
                        tooltip: {
                          format: {
                            title: function title(d) {
                              return t('eleprofile.chart.tooltip.title') + ': ' + data[d][3];
                            }
                          },
                          contents: function contents(_data, color) {
                            var index = _data[0].index;

                            var _data$index2 = (0, _slicedToArray3.default)(data[index], 3),
                                x = _data$index2[0],
                                y = _data$index2[1],
                                value = _data$index2[2];

                            var point_geom = new ol.geom.Point([x, y]);
                            self._mapService.highlightGeometry(point_geom, {
                              zoom: false,
                              hide: function hide(callback) {
                                hideHightlightFnc = callback;
                              },
                              style: new ol.style.Style({
                                image: new ol.style.RegularShape({
                                  fill: new ol.style.Fill({ color: 'white' }),
                                  stroke: new ol.style.Stroke({ color: self.chartColor, width: 3 }),
                                  points: 3,
                                  radius: 12,
                                  angle: 0
                                })
                              })
                            });
                            return '<div style="font-weight: bold; border:2px solid; background-color: #ffffff; padding: 3px;border-radius: 3px;" \n                          class="skin-border-color skin-color">' + value.toFixed(2) + '(m)</div>';
                          }
                        },
                        axis: {
                          x: {
                            max: graphData.maxX + 2,
                            min: graphData.minX - 2,
                            label: {
                              text: t('eleprofile.chart.labels.x'),
                              position: 'outer-center'
                            },
                            tick: {
                              fit: false,
                              count: 4,
                              format: function format(value) {
                                return value.toFixed(2);
                              }
                            }
                          },
                          y: {
                            max: graphData.maxY + 5,
                            min: graphData.minY - 5,
                            label: {
                              text: t('eleprofile.chart.labels.y'),
                              position: 'outer-middle'
                            },
                            tick: {
                              count: 5,
                              format: function format(value) {
                                return value.toFixed(2);
                              }
                            }
                          }
                        }
                      });
                    }
                  }
                })
              });

            case 12:
              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](0);
              return _context3.abrupt('return', {
                error: true
              });

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this, [[0, 14]]);
    }));

    return function () {
      return _ref6.apply(this, arguments);
    };
  }();

  this.getElevationData = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          api = _ref10.api,
          layerId = _ref10.layerId,
          fid = _ref10.fid;

      var url, data, response;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              url = '' + api + layerId + '/' + fid;
              data = {
                result: false
              };
              _context4.prev = 2;
              _context4.next = 5;
              return XHR.get({
                url: url
              });

            case 5:
              response = _context4.sent;

              data.profile = response.profile;
              data.result = true;
              _context4.next = 12;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4['catch'](2);

            case 12:
              return _context4.abrupt('return', data);

            case 13:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this, [[2, 10]]);
    }));

    return function () {
      return _ref9.apply(this, arguments);
    };
  }();

  this.clear = function () {
    this.queryresultsService.un('openCloseFeatureResult', this.keySetters.openCloseFeatureResult);
  };
}

inherit(ElevationProfileService, PluginService);

module.exports = new ElevationProfileService();

},{"babel-runtime/helpers/asyncToGenerator":4,"babel-runtime/helpers/slicedToArray":5,"babel-runtime/regenerator":6}]},{},[85])

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2dldC1pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvaXMtaXRlcmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3Byb21pc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2FzeW5jVG9HZW5lcmF0b3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3NsaWNlZFRvQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9yZWdlbmVyYXRvci9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vZ2V0LWl0ZXJhdG9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9pcy1pdGVyYWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vcHJvbWlzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19leHBvcnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mb3Itb2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW52b2tlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX21pY3JvdGFzay5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbmV3LXByb21pc2UtY2FwYWJpbGl0eS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3BlcmZvcm0uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdXNlci1hZ2VudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmlzLWl0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5wcm9taXNlLmZpbmFsbHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnByb21pc2UudHJ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lLW1vZHVsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJjb25maWcvaTE4bi9pbmRleC5qcyIsImNvbmZpZy9pbmRleC5qcyIsImluZGV4LmpzIiwicGx1Z2luc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O2tCQ3Z0QmU7QUFDYixNQUFJO0FBQ0YsV0FBTztBQUNMLGVBQVM7QUFDUCx1QkFBZTtBQURSO0FBREosS0FETDtBQU1GLFdBQU87QUFDTCxhQUFPLFlBREY7QUFFTCxlQUFTO0FBQ1AsZUFBTztBQURBLE9BRko7QUFLTCxjQUFRO0FBQ04sV0FBRyxjQURHO0FBRU4sV0FBRTtBQUZJO0FBTEg7QUFOTCxHQURTO0FBa0JiLE1BQUk7QUFDRixXQUFPO0FBQ0wsZUFBUztBQUNQLHVCQUFlO0FBRFI7QUFESixLQURMO0FBTUYsV0FBTztBQUNMLGFBQU8sV0FERjtBQUVMLGVBQVM7QUFDUCxlQUFPO0FBREEsT0FGSjtBQUtMLGNBQVE7QUFDTixXQUFHLGNBREc7QUFFTixXQUFFO0FBRkk7QUFMSDtBQU5MO0FBbEJTLEM7Ozs7Ozs7QUNBZjs7Ozs7O2tCQUNlO0FBQ2I7QUFEYSxDOzs7QUNEZjs7Ozs7O3lCQUN3QixPQUFPLElBQVAsQ0FBWSxLO0lBQTdCLEksc0JBQUEsSTtJQUFNLE8sc0JBQUEsTzs7QUFDYixJQUFNLFNBQVMsT0FBTyxJQUFQLENBQVksTUFBWixDQUFtQixNQUFsQztBQUNBLElBQU0sVUFBVSxRQUFRLGlCQUFSLENBQWhCO0FBQ0EsSUFBTSxnQkFBZ0IsT0FBTyxJQUFQLENBQVksSUFBWixDQUFpQixhQUF2Qzs7QUFFQSxJQUFNLFVBQVUsU0FBVixPQUFVLEdBQVc7QUFDekIsT0FBSyxJQUFMO0FBQ0EsT0FBSyxJQUFMLEdBQVksWUFBWjtBQUNBLE9BQUssSUFBTCxHQUFZLFlBQVc7QUFDckI7QUFDQSxrQkFBYztBQUNaLFlBQU0sS0FBSyxJQURDO0FBRVosY0FBUSxpQkFBYTtBQUZULEtBQWQ7QUFJQTtBQUNBLFNBQUssTUFBTCxHQUFjLEtBQUssU0FBTCxFQUFkO0FBQ0EsU0FBSyxVQUFMLENBQWdCLE9BQWhCO0FBQ0EsU0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixLQUFLLE1BQXZCO0FBQ0EsU0FBSyxjQUFMLENBQW9CLEtBQUssTUFBTCxDQUFZLEdBQWhDO0FBQ0E7QUFDQSxTQUFLLFFBQUwsQ0FBYyxJQUFkO0FBQ0QsR0FiRDtBQWNBO0FBQ0EsT0FBSyxNQUFMLEdBQWMsWUFBVztBQUN2QixTQUFLLE9BQUwsQ0FBYSxLQUFiO0FBQ0QsR0FGRDtBQUdELENBckJEOztBQXVCQSxRQUFRLE9BQVIsRUFBaUIsTUFBakI7O0FBRUEsQ0FBQyxVQUFTLE1BQVQsRUFBZ0I7QUFDZixTQUFPLElBQVA7QUFDRCxDQUZELEVBRUcsSUFBSSxPQUFKLEVBRkg7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0JBLElBQU0sVUFBVSxPQUFPLElBQVAsQ0FBWSxLQUFaLENBQWtCLE9BQWxDO0FBQ0EsSUFBTSxPQUFPLE9BQU8sSUFBUCxDQUFZLEtBQVosQ0FBa0IsSUFBL0I7QUFDQSxJQUFNLE1BQU0sT0FBTyxJQUFQLENBQVksS0FBWixDQUFrQixHQUE5QjtBQUNBLElBQU0sZ0JBQWdCLE9BQU8sSUFBUCxDQUFZLE1BQVosQ0FBbUIsYUFBekM7QUFDQSxJQUFNLElBQUksT0FBTyxJQUFQLENBQVksSUFBWixDQUFpQixPQUEzQjtBQUNBLElBQU0sTUFBTSxPQUFPLEdBQVAsQ0FBVyxHQUF2QjtBQUNBLElBQU0sZ0JBQWdCLE9BQU8sR0FBUCxDQUFXLEdBQVgsQ0FBZSxNQUFmLENBQXNCLGFBQTVDOztBQUVBLFNBQVMsdUJBQVQsR0FBbUM7QUFDakMsT0FBSyxJQUFMO0FBQ0EsT0FBSyxJQUFMLEdBQVksWUFBb0I7QUFBQTs7QUFBQSxRQUFYLE1BQVcsdUVBQUosRUFBSTs7QUFDOUIsU0FBSyxVQUFMLEdBQWtCLElBQUksU0FBdEI7QUFDQSxTQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0E7QUFDQSxTQUFLLE1BQUwsQ0FBWSxNQUFaLElBQXNCLEtBQUssTUFBTCxDQUFZLE1BQVosQ0FBbUIsT0FBbkIsQ0FBMkI7QUFBQSxhQUFZLFNBQVMsSUFBVCxHQUFnQixFQUE1QjtBQUFBLEtBQTNCLENBQXRCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLElBQUksWUFBSixDQUFpQixLQUFqQixFQUF3QixVQUF4QixFQUFuQjtBQUNBLFNBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFFBQU0sd0JBQXdCLElBQUksWUFBSixDQUFpQixjQUFqQixDQUE5QjtBQUNBLFNBQUssbUJBQUwsR0FBMkIsc0JBQXNCLFVBQXRCLEVBQTNCO0FBQ0EsU0FBSyxVQUFMLENBQWdCLHNCQUFoQixHQUF5QyxLQUFLLG1CQUFMLENBQXlCLE9BQXpCLENBQWlDLHdCQUFqQyxFQUEyRCxnQkFBcUM7QUFBQSxVQUFuQyxJQUFtQyxRQUFuQyxJQUFtQztBQUFBLFVBQTdCLEtBQTZCLFFBQTdCLEtBQTZCO0FBQUEsVUFBdEIsT0FBc0IsUUFBdEIsT0FBc0I7QUFBQSxVQUFiLFNBQWEsUUFBYixTQUFhOztBQUN2SSxVQUFNLFdBQVcsTUFBSyxNQUFMLENBQVksTUFBWixDQUFtQixJQUFuQixDQUF3QixvQkFBWTtBQUFBLFlBQ2xDLE9BRGtDLEdBQ3ZCLFFBRHVCLENBQzVDLFFBRDRDOztBQUVuRCxlQUFPLE1BQU0sRUFBTixLQUFhLE9BQXBCO0FBQ0QsT0FIZ0IsQ0FBakI7QUFJQSxrQkFBWSxNQUFLLHNCQUFMLENBQTRCO0FBQ3RDLGtCQURzQztBQUV0Qyw0QkFGc0M7QUFHdEMsMEJBSHNDO0FBSXRDLGFBQUssUUFBUSxVQUFSLENBQW1CLFNBQW5CO0FBSmlDLE9BQTVCLENBQVo7QUFNRCxLQVh3QyxDQUF6QztBQVlELEdBckJEOztBQXVCQSxPQUFLLFNBQUwsR0FBaUIsWUFBVTtBQUN6QixXQUFPLEtBQUssTUFBWjtBQUNELEdBRkQ7O0FBSUEsT0FBSyxPQUFMLEdBQWUsWUFBVztBQUN4QixXQUFPLEtBQUssTUFBTCxDQUFZLElBQW5CO0FBQ0QsR0FGRDs7QUFJQSxPQUFLLGdDQUFMLEdBQXdDLFlBQVU7QUFDaEQsUUFBTSxtQkFBbUIsSUFBSSxNQUFKLENBQVc7QUFDbEM7QUFEa0MsS0FBWCxDQUF6QjtBQUdBLFdBQU8sSUFBSSxnQkFBSixHQUF1QixNQUF2QixHQUFnQyxHQUF2QztBQUNELEdBTEQ7O0FBT0EsT0FBSyxzQkFBTDtBQUFBLHlGQUE4QjtBQUFBLHNGQUFnRCxFQUFoRDtBQUFBLFVBQWdCLElBQWhCLFNBQWdCLElBQWhCO0FBQUEsVUFBc0IsUUFBdEIsU0FBc0IsUUFBdEI7QUFBQSxVQUFnQyxTQUFoQyxTQUFnQyxTQUFoQztBQUFBLFVBQTJDLEdBQTNDLFNBQTJDLEdBQTNDOztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQ3hCLElBRHdCO0FBQUE7QUFBQTtBQUFBOztBQUVuQixpQkFGbUIsR0FFTyxRQUZQLENBRW5CLEdBRm1CLEVBRUosT0FGSSxHQUVPLFFBRlAsQ0FFZCxRQUZjO0FBR3BCLDJCQUhvQixHQUdKLEtBQUssZ0NBQUwsRUFISTtBQUFBOztBQUt4Qix3QkFBVSxNQUFWLENBQWlCLGFBQWpCO0FBTHdCO0FBQUEscUJBTVMsS0FBSyxpQkFBTCxDQUF1QixFQUFDLFFBQUQsRUFBTSxnQkFBTixFQUFlLFFBQWYsRUFBdkIsQ0FOVDs7QUFBQTtBQUFBO0FBTWpCLHVCQU5pQixTQU1qQixTQU5pQjtBQU1OLG1CQU5NLFNBTU4sS0FOTTs7QUFBQSxtQkFPcEIsS0FQb0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFRbEIsZ0NBUmtCLEdBUUcsSUFBSSxNQUFKLENBQVcsU0FBWCxDQVJIOztBQVN4Qix1QkFBUyxJQUFULENBQWMsR0FBZCxJQUFxQixJQUFJLGtCQUFKLEVBQXJCO0FBQ0EsdUJBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUIsS0FBbkIsQ0FBeUIsY0FBekIsMkVBQXlDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDdkMsa0NBQVUsTUFBVixDQUFpQixLQUFLLEdBQXRCO0FBQ0EsNEJBQUksSUFBSixDQUFTLFFBQVQ7O0FBRnVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQXpDO0FBSUEsdUJBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUIsTUFBbkI7QUFkd0I7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQWtCeEIsNEJBQWMsTUFBZDtBQWxCd0I7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBcUIxQixrQkFBSSxTQUFTLElBQVQsQ0FBYyxHQUFkLENBQUosRUFBd0I7QUFDdEIseUJBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUIsUUFBbkI7QUFDQSx5QkFBUyxJQUFULENBQWMsR0FBZCxFQUFtQixHQUFuQixDQUF1QixNQUF2QjtBQUNBLHlCQUFTLElBQVQsQ0FBYyxHQUFkLElBQXFCLFNBQXJCO0FBQ0Q7O0FBekJ5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUE5Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUE2QkEsT0FBSyxpQkFBTDtBQUFBLHlGQUF5QjtBQUFBLHNGQUFtQyxFQUFuQztBQUFBLFVBQWdCLEdBQWhCLFNBQWdCLEdBQWhCO0FBQUEsVUFBcUIsT0FBckIsU0FBcUIsT0FBckI7QUFBQSxVQUE4QixHQUE5QixTQUE4QixHQUE5Qjs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFFRSxLQUFLLGdCQUFMLENBQXNCLEVBQUMsUUFBRCxFQUFNLGdCQUFOLEVBQWUsUUFBZixFQUF0QixDQUZGOztBQUFBO0FBRWYsc0JBRmU7QUFHZixrQkFIZSxHQUdSLFNBQVMsTUFBVCxJQUFtQixTQUFTLE9BSHBCOztBQUFBLG1CQUlqQixJQUppQjtBQUFBO0FBQUE7QUFBQTs7QUFLYix1QkFMYSxHQUtEO0FBQ2hCLG1CQUFHLENBQUMsR0FBRCxDQURhO0FBRWhCLG1CQUFHLENBQUMsR0FBRCxDQUZhO0FBR2hCLHNCQUFPLE9BSFM7QUFJaEIsc0JBQU0sQ0FBQyxPQUpTO0FBS2hCLHNCQUFPLE9BTFM7QUFNaEIsc0JBQU0sQ0FBQztBQU5TLGVBTEM7O0FBYW5CLG1CQUFTLENBQVQsR0FBVyxDQUFYLEVBQWMsSUFBSSxLQUFLLE1BQXZCLEVBQStCLEdBQS9CLEVBQW9DO0FBQzVCLHFCQUQ0QixHQUNwQixLQUFLLENBQUwsQ0FEb0I7QUFFNUIsaUJBRjRCLEdBRXhCLE1BQU0sQ0FBTixDQUZ3QjtBQUc1QixpQkFINEIsR0FHeEIsTUFBTSxDQUFOLENBSHdCOztBQUlsQywwQkFBVSxJQUFWLEdBQWlCLElBQUksVUFBVSxJQUFkLEdBQXFCLENBQXJCLEdBQXlCLFVBQVUsSUFBcEQ7QUFDQSwwQkFBVSxJQUFWLEdBQWlCLElBQUksVUFBVSxJQUFkLEdBQXFCLENBQXJCLEdBQXlCLFVBQVUsSUFBcEQ7QUFDQSwwQkFBVSxJQUFWLEdBQWlCLElBQUksVUFBVSxJQUFkLEdBQXFCLENBQXJCLEdBQXlCLFVBQVUsSUFBcEQ7QUFDQSwwQkFBVSxJQUFWLEdBQWlCLElBQUksVUFBVSxJQUFkLEdBQXFCLENBQXJCLEdBQXlCLFVBQVUsSUFBcEQ7QUFDQSwwQkFBVSxDQUFWLENBQVksSUFBWixDQUFpQixDQUFqQjtBQUNBLDBCQUFVLENBQVYsQ0FBWSxJQUFaLENBQWlCLENBQWpCO0FBQ0Q7QUFDSyxrQkF4QmEsR0F3Qk4sSUF4Qk07QUF5QmIsaUJBekJhLEdBeUJQLEtBQUssV0FBTCxDQUFpQixNQUFqQixFQXpCTzs7QUEwQmYsK0JBMUJlLEdBMEJLLDZCQUFNLENBQUUsQ0ExQmI7O0FBQUEsZ0RBMkJaO0FBQ0wsMEJBREs7QUFFTCxvQkFBSSxFQUFFLHdCQUFGLENBRkM7QUFHTCwyQkFBVyxjQUFjLEtBQWQsQ0FBb0I7QUFDN0Isd0JBQU0sV0FEdUI7QUFFN0IseUJBQU87QUFDTCwyQkFESyxxQkFDSztBQUNSLDJCQUFLLFNBQUwsQ0FBZTtBQUNiLGtDQURhLHdCQUNBO0FBQ1g7QUFDRCx5QkFIWTs7QUFJYiwrQkFBTztBQUNMLGdDQUFNLEVBQUUsd0JBQUYsQ0FERDtBQUVMLG9DQUFVO0FBRkwseUJBSk07QUFRYixpQ0FBUztBQUNQLCtCQUFLLEVBREU7QUFFUCxrQ0FBUSxFQUZEO0FBR1AsaUNBQU87QUFIQSx5QkFSSTtBQWFiLDhCQUFNO0FBQ0osbUNBQVMsSUFETDtBQUVKLG1DQUFTO0FBRkwseUJBYk87QUFpQmIsOEJBQU07QUFDSixxQ0FBVztBQUNULHFDQUFTLEtBREE7QUFFVCx1Q0FBVztBQUZGLDJCQURQO0FBS0osNkJBQUcsR0FMQztBQU1KLDZCQUFHLEdBTkM7QUFPSixpQ0FBTztBQUNMLCtCQUFHO0FBREUsMkJBUEg7QUFVSixrQ0FBUTtBQUNOLCtCQUFHLEtBQUssVUFERjtBQUVOLCtCQUFHLEtBQUs7QUFGRiwyQkFWSjtBQWNKLG1DQUFTLENBQ1AsVUFBVSxDQURILEVBRVAsVUFBVSxDQUZILENBZEw7QUFrQkosb0NBbEJJLHNCQWtCTyxHQWxCUCxFQWtCWTtBQUNkO0FBQ0QsMkJBcEJHO0FBcUJKLGlDQXJCSSwwQkFxQmE7QUFBQSxnQ0FBUixLQUFRLFNBQVIsS0FBUTs7QUFBQSwyRUFDQSxLQUFLLEtBQUwsQ0FEQTtBQUFBLGdDQUNSLENBRFE7QUFBQSxnQ0FDTCxDQURLOztBQUVmLGdDQUFJLE9BQUosR0FBYyxTQUFkLENBQXdCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBeEI7QUFDRDtBQXhCRyx5QkFqQk87QUEyQ2IsZ0NBQVE7QUFDTixnQ0FBTTtBQURBLHlCQTNDSztBQThDYixpQ0FBUTtBQUNOLGtDQUFRO0FBQ04saUNBRE0saUJBQ0EsQ0FEQSxFQUNHO0FBQ1AscUNBQVUsRUFBRSxnQ0FBRixDQUFWLFVBQWtELEtBQUssQ0FBTCxFQUFRLENBQVIsQ0FBbEQ7QUFDRDtBQUhLLDJCQURGO0FBTU4sb0NBQVUsa0JBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUNoQyxnQ0FBTSxRQUFRLE1BQU0sQ0FBTixFQUFTLEtBQXZCOztBQURnQyw0RUFFVixLQUFLLEtBQUwsQ0FGVTtBQUFBLGdDQUV6QixDQUZ5QjtBQUFBLGdDQUV0QixDQUZzQjtBQUFBLGdDQUVuQixLQUZtQjs7QUFHaEMsZ0NBQU0sYUFBYSxJQUFJLEdBQUcsSUFBSCxDQUFRLEtBQVosQ0FDakIsQ0FBQyxDQUFELEVBQUksQ0FBSixDQURpQixDQUFuQjtBQUdBLGlDQUFLLFdBQUwsQ0FBaUIsaUJBQWpCLENBQW1DLFVBQW5DLEVBQStDO0FBQzdDLG9DQUFNLEtBRHVDO0FBRTdDLG9DQUFNLGNBQVMsUUFBVCxFQUFtQjtBQUN2QixvREFBb0IsUUFBcEI7QUFDRCwrQkFKNEM7QUFLN0MscUNBQU8sSUFBSSxHQUFHLEtBQUgsQ0FBUyxLQUFiLENBQW1CO0FBQ3hCLHVDQUFPLElBQUksR0FBRyxLQUFILENBQVMsWUFBYixDQUEwQjtBQUMvQix3Q0FBTSxJQUFJLEdBQUcsS0FBSCxDQUFTLElBQWIsQ0FBa0IsRUFBQyxPQUFPLE9BQVIsRUFBbEIsQ0FEeUI7QUFFL0IsMENBQVEsSUFBSSxHQUFHLEtBQUgsQ0FBUyxNQUFiLENBQW9CLEVBQUMsT0FBTyxLQUFLLFVBQWIsRUFBeUIsT0FBTyxDQUFoQyxFQUFwQixDQUZ1QjtBQUcvQiwwQ0FBUSxDQUh1QjtBQUkvQiwwQ0FBUSxFQUp1QjtBQUsvQix5Q0FBTztBQUx3QixpQ0FBMUI7QUFEaUIsK0JBQW5CO0FBTHNDLDZCQUEvQztBQWVBLHVOQUMyQyxNQUFNLE9BQU4sQ0FBYyxDQUFkLENBRDNDO0FBRUQ7QUE3QksseUJBOUNLO0FBNkViLDhCQUFNO0FBQ0osNkJBQUc7QUFDRCxpQ0FBSyxVQUFVLElBQVYsR0FBaUIsQ0FEckI7QUFFRCxpQ0FBSyxVQUFVLElBQVYsR0FBaUIsQ0FGckI7QUFHRCxtQ0FBTztBQUNMLG9DQUFNLEVBQUUsMkJBQUYsQ0FERDtBQUVMLHdDQUFVO0FBRkwsNkJBSE47QUFPRCxrQ0FBTTtBQUNKLG1DQUFLLEtBREQ7QUFFSixxQ0FBTyxDQUZIO0FBR0osc0NBQVEsZ0JBQVUsS0FBVixFQUFpQjtBQUN2Qix1Q0FBTyxNQUFNLE9BQU4sQ0FBYyxDQUFkLENBQVA7QUFDRDtBQUxHO0FBUEwsMkJBREM7QUFnQkosNkJBQUc7QUFDRCxpQ0FBSyxVQUFVLElBQVYsR0FBaUIsQ0FEckI7QUFFRCxpQ0FBSyxVQUFVLElBQVYsR0FBaUIsQ0FGckI7QUFHRCxtQ0FBTztBQUNMLG9DQUFNLEVBQUUsMkJBQUYsQ0FERDtBQUVMLHdDQUFVO0FBRkwsNkJBSE47QUFPRCxrQ0FBTTtBQUNKLHFDQUFPLENBREg7QUFFSixzQ0FBUSxnQkFBVSxLQUFWLEVBQWlCO0FBQ3ZCLHVDQUFPLE1BQU0sT0FBTixDQUFjLENBQWQsQ0FBUDtBQUNEO0FBSkc7QUFQTDtBQWhCQztBQTdFTyx1QkFBZjtBQTZHRDtBQS9HSTtBQUZzQixpQkFBcEI7QUFITixlQTNCWTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0RBcUpkO0FBQ0wsdUJBQU87QUFERixlQXJKYzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUF6Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUEySkEsT0FBSyxnQkFBTDtBQUFBLHlGQUF3QjtBQUFBLHVGQUFtQyxFQUFuQztBQUFBLFVBQWdCLEdBQWhCLFVBQWdCLEdBQWhCO0FBQUEsVUFBcUIsT0FBckIsVUFBcUIsT0FBckI7QUFBQSxVQUE4QixHQUE5QixVQUE4QixHQUE5Qjs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2hCLGlCQURnQixRQUNQLEdBRE8sR0FDRCxPQURDLFNBQ1UsR0FEVjtBQUVoQixrQkFGZ0IsR0FFVDtBQUNYLHdCQUFRO0FBREcsZUFGUztBQUFBO0FBQUE7QUFBQSxxQkFNRyxJQUFJLEdBQUosQ0FBUTtBQUM3QjtBQUQ2QixlQUFSLENBTkg7O0FBQUE7QUFNZCxzQkFOYzs7QUFTcEIsbUJBQUssT0FBTCxHQUFlLFNBQVMsT0FBeEI7QUFDQSxtQkFBSyxNQUFMLEdBQWMsSUFBZDtBQVZvQjtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLGdEQVlmLElBWmU7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBeEI7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBZUEsT0FBSyxLQUFMLEdBQWEsWUFBVztBQUN0QixTQUFLLG1CQUFMLENBQXlCLEVBQXpCLENBQTRCLHdCQUE1QixFQUFzRCxLQUFLLFVBQUwsQ0FBZ0Isc0JBQXRFO0FBQ0QsR0FGRDtBQUdEOztBQUVELFFBQVEsdUJBQVIsRUFBaUMsYUFBakM7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLElBQUksdUJBQUosRUFBakIiLCJmaWxlIjoiYnVpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9pcy1pdGVyYWJsZVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfcHJvbWlzZSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3Byb21pc2VcIik7XG5cbnZhciBfcHJvbWlzZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9wcm9taXNlKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdlbiA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIG5ldyBfcHJvbWlzZTIuZGVmYXVsdChmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBmdW5jdGlvbiBzdGVwKGtleSwgYXJnKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIGluZm8gPSBnZW5ba2V5XShhcmcpO1xuICAgICAgICAgIHZhciB2YWx1ZSA9IGluZm8udmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIF9wcm9taXNlMi5kZWZhdWx0LnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBzdGVwKFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgc3RlcChcInRocm93XCIsIGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0ZXAoXCJuZXh0XCIpO1xuICAgIH0pO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pc0l0ZXJhYmxlMiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL2lzLWl0ZXJhYmxlXCIpO1xuXG52YXIgX2lzSXRlcmFibGUzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXNJdGVyYWJsZTIpO1xuXG52YXIgX2dldEl0ZXJhdG9yMiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL2dldC1pdGVyYXRvclwiKTtcblxudmFyIF9nZXRJdGVyYXRvcjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRJdGVyYXRvcjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7XG4gICAgdmFyIF9hcnIgPSBbXTtcbiAgICB2YXIgX24gPSB0cnVlO1xuICAgIHZhciBfZCA9IGZhbHNlO1xuICAgIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaSA9ICgwLCBfZ2V0SXRlcmF0b3IzLmRlZmF1bHQpKGFyciksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2QgPSB0cnVlO1xuICAgICAgX2UgPSBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfYXJyO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0gZWxzZSBpZiAoKDAsIF9pc0l0ZXJhYmxlMy5kZWZhdWx0KShPYmplY3QoYXJyKSkpIHtcbiAgICAgIHJldHVybiBzbGljZUl0ZXJhdG9yKGFyciwgaSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xuICAgIH1cbiAgfTtcbn0oKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvcicpO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9jb3JlLmlzLWl0ZXJhYmxlJyk7XG4iLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYucHJvbWlzZScpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcucHJvbWlzZS5maW5hbGx5Jyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNy5wcm9taXNlLnRyeScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL19jb3JlJykuUHJvbWlzZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuMTEnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciBJU19XUkFQID0gdHlwZSAmICRleHBvcnQuVztcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGtleSwgb3duLCBvdXQ7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYgKG93biAmJiBoYXMoZXhwb3J0cywga2V5KSkgY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbiAoQykge1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIEMpIHtcbiAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDKCk7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmIChJU19QUk9UTykge1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmICh0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKSBoaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIGFyZ3MsIHRoYXQpIHtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZG9uZSwgdmFsdWUpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmUgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgU2FmYXJpIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMzOVxuICB9IGVsc2UgaWYgKE9ic2VydmVyICYmICEoZ2xvYmFsLm5hdmlnYXRvciAmJiBnbG9iYWwubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSB7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZiAoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpIHtcbiAgICAvLyBQcm9taXNlLnJlc29sdmUgd2l0aG91dCBhbiBhcmd1bWVudCB0aHJvd3MgYW4gZXJyb3IgaW4gTEcgV2ViT1MgMlxuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBpZiAoc2FmZSAmJiB0YXJnZXRba2V5XSkgdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faGlkZScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IHR5cGVvZiBjb3JlW0tFWV0gPT0gJ2Z1bmN0aW9uJyA/IGNvcmVbS0VZXSA6IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE5IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL19odG1sJyk7XG52YXIgY2VsID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBzZXRUYXNrID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbnZhciBjbGVhclRhc2sgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XG52YXIgTWVzc2FnZUNoYW5uZWwgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWw7XG52YXIgRGlzcGF0Y2ggPSBnbG9iYWwuRGlzcGF0Y2g7XG52YXIgY291bnRlciA9IDA7XG52YXIgcXVldWUgPSB7fTtcbnZhciBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbnZhciBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpZCA9ICt0aGlzO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIGlmIChxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmICghc2V0VGFzayB8fCAhY2xlYXJUYXNrKSB7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBpID0gMTtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKSB7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmIChyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcycpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIFNwaGVyZSAoSlMgZ2FtZSBlbmdpbmUpIERpc3BhdGNoIEFQSVxuICB9IGVsc2UgaWYgKERpc3BhdGNoICYmIERpc3BhdGNoLm5vdykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBEaXNwYXRjaC5ub3coY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZiAoTWVzc2FnZUNoYW5uZWwpIHtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgcG9ydCA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZiAoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0JykpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbmF2aWdhdG9yID0gZ2xvYmFsLm5hdmlnYXRvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJztcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0ID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBpdGVyRm4gPSBnZXQoaXQpO1xuICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgcmV0dXJuIGFuT2JqZWN0KGl0ZXJGbi5jYWxsKGl0KSk7XG59O1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmlzSXRlcmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8gPSBPYmplY3QoaXQpO1xuICByZXR1cm4gT1tJVEVSQVRPUl0gIT09IHVuZGVmaW5lZFxuICAgIHx8ICdAQGl0ZXJhdG9yJyBpbiBPXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICAgIHx8IEl0ZXJhdG9ycy5oYXNPd25Qcm9wZXJ0eShjbGFzc29mKE8pKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBraW5kID0gdGhpcy5faztcbiAgdmFyIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZiAoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpIHtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpO1xuIiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4vX3VzZXItYWdlbnQnKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52OCB8fCAnJztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2VcbiAgICAgIC8vIHY4IDYuNiAoTm9kZSAxMCBhbmQgQ2hyb21lIDY2KSBoYXZlIGEgYnVnIHdpdGggcmVzb2x2aW5nIGN1c3RvbSB0aGVuYWJsZXNcbiAgICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTgzMDU2NVxuICAgICAgLy8gd2UgY2FuJ3QgZGV0ZWN0IGl0IHN5bmNocm9ub3VzbHksIHNvIGp1c3QgY2hlY2sgdmVyc2lvbnNcbiAgICAgICYmIHY4LmluZGV4T2YoJzYuNicpICE9PSAwXG4gICAgICAmJiB1c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lLzY2JykgPT09IC0xO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24gKHByb21pc2UsIGlzUmVqZWN0KSB7XG4gIGlmIChwcm9taXNlLl9uKSByZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIG9rID0gcHJvbWlzZS5fcyA9PSAxO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuLCBleGl0ZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChwcm9taXNlLl9oID09IDIpIG9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYW5kbGVyID09PSB0cnVlKSByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7IC8vIG1heSB0aHJvd1xuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgICBleGl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKSB7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhZXhpdGVkKSBkb21haW4uZXhpdCgpO1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkgcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYgKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKSBvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIHVuaGFuZGxlZCA9IGlzVW5oYW5kbGVkKHByb21pc2UpO1xuICAgIHZhciByZXN1bHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYgKHVuaGFuZGxlZCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKSB7XG4gICAgICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZiAodW5oYW5kbGVkICYmIHJlc3VsdC5lKSB0aHJvdyByZXN1bHQudjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UuX2ggIT09IDEgJiYgKHByb21pc2UuX2EgfHwgcHJvbWlzZS5fYykubGVuZ3RoID09PSAwO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKSB7XG4gICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92IH0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmICghcHJvbWlzZS5fYSkgcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIHZhciB0aGVuO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZiAodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgICRyZWplY3QuY2FsbCh7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmICghVVNFX05BVElWRSkge1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fYSkgdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9zKSBub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG4gIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmYgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgcmV0dXJuIEMgPT09ICRQcm9taXNlIHx8IEMgPT09IFdyYXBwZXJcbiAgICAgID8gbmV3IE93blByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICA6IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBQcm9taXNlOiAkUHJvbWlzZSB9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocikge1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcyk7XG4gICAgdmFyICQkcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKExJQlJBUlkgJiYgdGhpcyA9PT0gV3JhcHBlciA/ICRQcm9taXNlIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikge1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciAkaW5kZXggPSBpbmRleCsrO1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtZmluYWxseVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ1Byb21pc2UnLCB7ICdmaW5hbGx5JzogZnVuY3Rpb24gKG9uRmluYWxseSkge1xuICB2YXIgQyA9IHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCBjb3JlLlByb21pc2UgfHwgZ2xvYmFsLlByb21pc2UpO1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBvbkZpbmFsbHkgPT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIHRoaXMudGhlbihcbiAgICBpc0Z1bmN0aW9uID8gZnVuY3Rpb24gKHgpIHtcbiAgICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShDLCBvbkZpbmFsbHkoKSkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9KTtcbiAgICB9IDogb25GaW5hbGx5LFxuICAgIGlzRnVuY3Rpb24gPyBmdW5jdGlvbiAoZSkge1xuICAgICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKEMsIG9uRmluYWxseSgpKS50aGVuKGZ1bmN0aW9uICgpIHsgdGhyb3cgZTsgfSk7XG4gICAgfSA6IG9uRmluYWxseVxuICApO1xufSB9KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLXByb21pc2UtdHJ5XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUHJvbWlzZScsIHsgJ3RyeSc6IGZ1bmN0aW9uIChjYWxsYmFja2ZuKSB7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYodGhpcyk7XG4gIHZhciByZXN1bHQgPSBwZXJmb3JtKGNhbGxiYWNrZm4pO1xuICAocmVzdWx0LmUgPyBwcm9taXNlQ2FwYWJpbGl0eS5yZWplY3QgOiBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlKShyZXN1bHQudik7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufSB9KTtcbiIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbnZhciBET01JdGVyYWJsZXMgPSAoJ0NTU1J1bGVMaXN0LENTU1N0eWxlRGVjbGFyYXRpb24sQ1NTVmFsdWVMaXN0LENsaWVudFJlY3RMaXN0LERPTVJlY3RMaXN0LERPTVN0cmluZ0xpc3QsJyArXG4gICdET01Ub2tlbkxpc3QsRGF0YVRyYW5zZmVySXRlbUxpc3QsRmlsZUxpc3QsSFRNTEFsbENvbGxlY3Rpb24sSFRNTENvbGxlY3Rpb24sSFRNTEZvcm1FbGVtZW50LEhUTUxTZWxlY3RFbGVtZW50LCcgK1xuICAnTWVkaWFMaXN0LE1pbWVUeXBlQXJyYXksTmFtZWROb2RlTWFwLE5vZGVMaXN0LFBhaW50UmVxdWVzdExpc3QsUGx1Z2luLFBsdWdpbkFycmF5LFNWR0xlbmd0aExpc3QsU1ZHTnVtYmVyTGlzdCwnICtcbiAgJ1NWR1BhdGhTZWdMaXN0LFNWR1BvaW50TGlzdCxTVkdTdHJpbmdMaXN0LFNWR1RyYW5zZm9ybUxpc3QsU291cmNlQnVmZmVyTGlzdCxTdHlsZVNoZWV0TGlzdCxUZXh0VHJhY2tDdWVMaXN0LCcgK1xuICAnVGV4dFRyYWNrTGlzdCxUb3VjaExpc3QnKS5zcGxpdCgnLCcpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IERPTUl0ZXJhYmxlcy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IERPTUl0ZXJhYmxlc1tpXTtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV07XG4gIHZhciBwcm90byA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10pIGhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbi8vIFRoaXMgbWV0aG9kIG9mIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdCBuZWVkcyB0byBiZVxuLy8ga2VwdCBpZGVudGljYWwgdG8gdGhlIHdheSBpdCBpcyBvYnRhaW5lZCBpbiBydW50aW1lLmpzXG52YXIgZyA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMgfSkoKSB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG5cbi8vIFVzZSBgZ2V0T3duUHJvcGVydHlOYW1lc2AgYmVjYXVzZSBub3QgYWxsIGJyb3dzZXJzIHN1cHBvcnQgY2FsbGluZ1xuLy8gYGhhc093blByb3BlcnR5YCBvbiB0aGUgZ2xvYmFsIGBzZWxmYCBvYmplY3QgaW4gYSB3b3JrZXIuIFNlZSAjMTgzLlxudmFyIGhhZFJ1bnRpbWUgPSBnLnJlZ2VuZXJhdG9yUnVudGltZSAmJlxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhnKS5pbmRleE9mKFwicmVnZW5lcmF0b3JSdW50aW1lXCIpID49IDA7XG5cbi8vIFNhdmUgdGhlIG9sZCByZWdlbmVyYXRvclJ1bnRpbWUgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZXN0b3JlZCBsYXRlci5cbnZhciBvbGRSdW50aW1lID0gaGFkUnVudGltZSAmJiBnLnJlZ2VuZXJhdG9yUnVudGltZTtcblxuLy8gRm9yY2UgcmVldmFsdXRhdGlvbiBvZiBydW50aW1lLmpzLlxuZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSB1bmRlZmluZWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vcnVudGltZVwiKTtcblxuaWYgKGhhZFJ1bnRpbWUpIHtcbiAgLy8gUmVzdG9yZSB0aGUgb3JpZ2luYWwgcnVudGltZS5cbiAgZy5yZWdlbmVyYXRvclJ1bnRpbWUgPSBvbGRSdW50aW1lO1xufSBlbHNlIHtcbiAgLy8gUmVtb3ZlIHRoZSBnbG9iYWwgcHJvcGVydHkgYWRkZWQgYnkgcnVudGltZS5qcy5cbiAgdHJ5IHtcbiAgICBkZWxldGUgZy5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIH0gY2F0Y2goZSkge1xuICAgIGcucmVnZW5lcmF0b3JSdW50aW1lID0gdW5kZWZpbmVkO1xuICB9XG59XG4iLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBPcCA9IE9iamVjdC5wcm90b3R5cGU7XG4gIHZhciBoYXNPd24gPSBPcC5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciAkU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiID8gU3ltYm9sIDoge307XG4gIHZhciBpdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuaXRlcmF0b3IgfHwgXCJAQGl0ZXJhdG9yXCI7XG4gIHZhciBhc3luY0l0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5hc3luY0l0ZXJhdG9yIHx8IFwiQEBhc3luY0l0ZXJhdG9yXCI7XG4gIHZhciB0b1N0cmluZ1RhZ1N5bWJvbCA9ICRTeW1ib2wudG9TdHJpbmdUYWcgfHwgXCJAQHRvU3RyaW5nVGFnXCI7XG5cbiAgdmFyIGluTW9kdWxlID0gdHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIjtcbiAgdmFyIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lO1xuICBpZiAocnVudGltZSkge1xuICAgIGlmIChpbk1vZHVsZSkge1xuICAgICAgLy8gSWYgcmVnZW5lcmF0b3JSdW50aW1lIGlzIGRlZmluZWQgZ2xvYmFsbHkgYW5kIHdlJ3JlIGluIGEgbW9kdWxlLFxuICAgICAgLy8gbWFrZSB0aGUgZXhwb3J0cyBvYmplY3QgaWRlbnRpY2FsIHRvIHJlZ2VuZXJhdG9yUnVudGltZS5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gcnVudGltZTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGV2YWx1YXRpbmcgdGhlIHJlc3Qgb2YgdGhpcyBmaWxlIGlmIHRoZSBydW50aW1lIHdhc1xuICAgIC8vIGFscmVhZHkgZGVmaW5lZCBnbG9iYWxseS5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBEZWZpbmUgdGhlIHJ1bnRpbWUgZ2xvYmFsbHkgKGFzIGV4cGVjdGVkIGJ5IGdlbmVyYXRlZCBjb2RlKSBhcyBlaXRoZXJcbiAgLy8gbW9kdWxlLmV4cG9ydHMgKGlmIHdlJ3JlIGluIGEgbW9kdWxlKSBvciBhIG5ldywgZW1wdHkgb2JqZWN0LlxuICBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZSA9IGluTW9kdWxlID8gbW9kdWxlLmV4cG9ydHMgOiB7fTtcblxuICBmdW5jdGlvbiB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gSWYgb3V0ZXJGbiBwcm92aWRlZCBhbmQgb3V0ZXJGbi5wcm90b3R5cGUgaXMgYSBHZW5lcmF0b3IsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIHByb3RvR2VuZXJhdG9yID0gb3V0ZXJGbiAmJiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvciA/IG91dGVyRm4gOiBHZW5lcmF0b3I7XG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUocHJvdG9HZW5lcmF0b3IucHJvdG90eXBlKTtcbiAgICB2YXIgY29udGV4dCA9IG5ldyBDb250ZXh0KHRyeUxvY3NMaXN0IHx8IFtdKTtcblxuICAgIC8vIFRoZSAuX2ludm9rZSBtZXRob2QgdW5pZmllcyB0aGUgaW1wbGVtZW50YXRpb25zIG9mIHRoZSAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMuXG4gICAgZ2VuZXJhdG9yLl9pbnZva2UgPSBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3IoKSB7fVxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICAvLyBUaGlzIGlzIGEgcG9seWZpbGwgZm9yICVJdGVyYXRvclByb3RvdHlwZSUgZm9yIGVudmlyb25tZW50cyB0aGF0XG4gIC8vIGRvbid0IG5hdGl2ZWx5IHN1cHBvcnQgaXQuXG4gIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuICBJdGVyYXRvclByb3RvdHlwZVtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIGdldFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuICB2YXIgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90byAmJiBnZXRQcm90byhnZXRQcm90byh2YWx1ZXMoW10pKSk7XG4gIGlmIChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAmJlxuICAgICAgTmF0aXZlSXRlcmF0b3JQcm90b3R5cGUgIT09IE9wICYmXG4gICAgICBoYXNPd24uY2FsbChOYXRpdmVJdGVyYXRvclByb3RvdHlwZSwgaXRlcmF0b3JTeW1ib2wpKSB7XG4gICAgLy8gVGhpcyBlbnZpcm9ubWVudCBoYXMgYSBuYXRpdmUgJUl0ZXJhdG9yUHJvdG90eXBlJTsgdXNlIGl0IGluc3RlYWRcbiAgICAvLyBvZiB0aGUgcG9seWZpbGwuXG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBOYXRpdmVJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9XG4gICAgR2VuZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUpO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZVt0b1N0cmluZ1RhZ1N5bWJvbF0gPVxuICAgIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgICAgaWYgKCEodG9TdHJpbmdUYWdTeW1ib2wgaW4gZ2VuRnVuKSkge1xuICAgICAgICBnZW5GdW5bdG9TdHJpbmdUYWdTeW1ib2xdID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuICAgICAgfVxuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBydW50aW1lLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGdlbmVyYXRvclttZXRob2RdLCBnZW5lcmF0b3IsIGFyZyk7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVjb3JkLmFyZztcbiAgICAgICAgdmFyIHZhbHVlID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpZiAodmFsdWUgJiZcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKSkge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUuX19hd2FpdCkudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaW52b2tlKFwibmV4dFwiLCB2YWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGludm9rZShcInRocm93XCIsIGVyciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi4gSWYgdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQsIGhvd2V2ZXIsIHRoZVxuICAgICAgICAgIC8vIHJlc3VsdCBmb3IgdGhpcyBpdGVyYXRpb24gd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBzYW1lXG4gICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3RcbiAgICAgICAgICAvLyB0aHJvd24gYmFjayBpbnRvIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24sIGFzIGlzIHRoZSBjYXNlXG4gICAgICAgICAgLy8gd2hlbiBhbiBhd2FpdGVkIFByb21pc2UgaXMgcmVqZWN0ZWQuIFRoaXMgZGlmZmVyZW5jZSBpblxuICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuICAgICAgICAgIC8vIGFsbG93cyB0aGUgY29uc3VtZXIgdG8gZGVjaWRlIHdoYXQgdG8gZG8gd2l0aCB0aGUgeWllbGRlZFxuICAgICAgICAgIC8vIHJlamVjdGlvbiAoc3dhbGxvdyBpdCBhbmQgY29udGludWUsIG1hbnVhbGx5IC50aHJvdyBpdCBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG4gICAgICAgICAgLy8gYXdhaXQsIGJ5IGNvbnRyYXN0LCB0aGVyZSBpcyBubyBvcHBvcnR1bml0eSB0byBleGFtaW5lIHRoZVxuICAgICAgICAgIC8vIHJlamVjdGlvbiByZWFzb24gb3V0c2lkZSB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uLCBzbyB0aGVcbiAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcbiAgICAgICAgICAvLyBsZXQgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBoYW5kbGUgdGhlIGV4Y2VwdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwcmV2aW91c1Byb21pc2U7XG5cbiAgICBmdW5jdGlvbiBlbnF1ZXVlKG1ldGhvZCwgYXJnKSB7XG4gICAgICBmdW5jdGlvbiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHJ1bnRpbWUuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dC5tZXRob2QgPSBtZXRob2Q7XG4gICAgICBjb250ZXh0LmFyZyA9IGFyZztcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgdmFyIGRlbGVnYXRlUmVzdWx0ID0gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoZGVsZWdhdGVSZXN1bHQgPT09IENvbnRpbnVlU2VudGluZWwpIGNvbnRpbnVlO1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlUmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAvLyBTZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgICAgICAvLyBmdW5jdGlvbi5zZW50IGltcGxlbWVudGF0aW9uLlxuICAgICAgICAgIGNvbnRleHQuc2VudCA9IGNvbnRleHQuX3NlbnQgPSBjb250ZXh0LmFyZztcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBjb250ZXh0LmFyZztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKTtcblxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgY29udGV4dC5hcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgLy8gRGlzcGF0Y2ggdGhlIGV4Y2VwdGlvbiBieSBsb29waW5nIGJhY2sgYXJvdW5kIHRvIHRoZVxuICAgICAgICAgIC8vIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oY29udGV4dC5hcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInRocm93XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vIENhbGwgZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdKGNvbnRleHQuYXJnKSBhbmQgaGFuZGxlIHRoZVxuICAvLyByZXN1bHQsIGVpdGhlciBieSByZXR1cm5pbmcgYSB7IHZhbHVlLCBkb25lIH0gcmVzdWx0IGZyb20gdGhlXG4gIC8vIGRlbGVnYXRlIGl0ZXJhdG9yLCBvciBieSBtb2RpZnlpbmcgY29udGV4dC5tZXRob2QgYW5kIGNvbnRleHQuYXJnLFxuICAvLyBzZXR0aW5nIGNvbnRleHQuZGVsZWdhdGUgdG8gbnVsbCwgYW5kIHJldHVybmluZyB0aGUgQ29udGludWVTZW50aW5lbC5cbiAgZnVuY3Rpb24gbWF5YmVJbnZva2VEZWxlZ2F0ZShkZWxlZ2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBtZXRob2QgPSBkZWxlZ2F0ZS5pdGVyYXRvcltjb250ZXh0Lm1ldGhvZF07XG4gICAgaWYgKG1ldGhvZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBBIC50aHJvdyBvciAucmV0dXJuIHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyAudGhyb3dcbiAgICAgIC8vIG1ldGhvZCBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgaWYgKGRlbGVnYXRlLml0ZXJhdG9yLnJldHVybikge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgcnVudGltZS5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIHJ1bnRpbWUudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG59KShcbiAgLy8gSW4gc2xvcHB5IG1vZGUsIHVuYm91bmQgYHRoaXNgIHJlZmVycyB0byB0aGUgZ2xvYmFsIG9iamVjdCwgZmFsbGJhY2sgdG9cbiAgLy8gRnVuY3Rpb24gY29uc3RydWN0b3IgaWYgd2UncmUgaW4gZ2xvYmFsIHN0cmljdCBtb2RlLiBUaGF0IGlzIHNhZGx5IGEgZm9ybVxuICAvLyBvZiBpbmRpcmVjdCBldmFsIHdoaWNoIHZpb2xhdGVzIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5LlxuICAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzIH0pKCkgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpXG4pO1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICBpdDoge1xuICAgIHF1ZXJ5OiB7XG4gICAgICBhY3Rpb25zOiB7XG4gICAgICAgIHNob3dlbGV2YXRpb246IFwiVmlzdWFsaXp6YSBlbGV2YXppb25lXCIsXG4gICAgICB9XG4gICAgfSxcbiAgICBjaGFydDoge1xuICAgICAgdGl0bGU6ICdFbGV2YXppb25lJyxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgdGl0bGU6ICdEaXN0YW56YSdcbiAgICAgIH0sXG4gICAgICBsYWJlbHM6IHtcbiAgICAgICAgeDogJ0Rpc3RhbnphIChtKScsXG4gICAgICAgIHk6J0FsdGV6emEgKG0pJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZW46IHtcbiAgICBxdWVyeToge1xuICAgICAgYWN0aW9uczoge1xuICAgICAgICBzaG93ZWxldmF0aW9uOiBcIlNob3cgZWxldmF0aW9uXCIsXG4gICAgICB9XG4gICAgfSxcbiAgICBjaGFydDoge1xuICAgICAgdGl0bGU6IFwiRWxldmF0aW9uXCIsXG4gICAgICB0b29sdGlwOiB7XG4gICAgICAgIHRpdGxlOiBcIkRpc3RhbmNlXCJcbiAgICAgIH0sXG4gICAgICBsYWJlbHM6IHtcbiAgICAgICAgeDogJ0Rpc3RhbmNlIChtKScsXG4gICAgICAgIHk6J0hlaWdodCAobSknXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgaTE4biBmcm9tICcuL2kxOG4nXG5leHBvcnQgZGVmYXVsdCB7XG4gIGkxOG5cbn1cbiIsImltcG9ydCBwbHVnaW5Db25maWcgZnJvbSAnLi9jb25maWcnO1xuY29uc3Qge2Jhc2UsIGluaGVyaXR9ID0gZzN3c2RrLmNvcmUudXRpbHM7XG5jb25zdCBQbHVnaW4gPSBnM3dzZGsuY29yZS5wbHVnaW4uUGx1Z2luO1xuY29uc3QgU2VydmljZSA9IHJlcXVpcmUoJy4vcGx1Z2luc2VydmljZScpO1xuY29uc3QgYWRkSTE4blBsdWdpbiA9IGczd3Nkay5jb3JlLmkxOG4uYWRkSTE4blBsdWdpbjtcblxuY29uc3QgX1BsdWdpbiA9IGZ1bmN0aW9uKCkge1xuICBiYXNlKHRoaXMpO1xuICB0aGlzLm5hbWUgPSAnZWxlcHJvZmlsZSc7XG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGFkZCBpMThuIG9mIHRoZSBwbHVnaW5cbiAgICBhZGRJMThuUGx1Z2luKHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIGNvbmZpZzogcGx1Z2luQ29uZmlnLmkxOG5cbiAgICB9KTtcbiAgICAvLyBzZXQgY2F0YWxvZyBpbml0aWFsIHRhYlxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5nZXRDb25maWcoKTtcbiAgICB0aGlzLnNldFNlcnZpY2UoU2VydmljZSk7XG4gICAgdGhpcy5zZXJ2aWNlLmluaXQodGhpcy5jb25maWcpO1xuICAgIHRoaXMucmVnaXN0ZXJQbHVnaW4odGhpcy5jb25maWcuZ2lkKTtcbiAgICAvLyBjcmVhdGUgQVBJXG4gICAgdGhpcy5zZXRSZWFkeSh0cnVlKTtcbiAgfTtcbiAgLy9jYWxsZWQgd2hlbiBwbHVnaW4gaXMgcmVtb3ZlZFxuICB0aGlzLnVubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2VydmljZS5jbGVhcigpO1xuICB9O1xufTtcblxuaW5oZXJpdChfUGx1Z2luLCBQbHVnaW4pO1xuXG4oZnVuY3Rpb24ocGx1Z2luKXtcbiAgcGx1Z2luLmluaXQoKTtcbn0pKG5ldyBfUGx1Z2luKTtcblxuXG5cbiIsImNvbnN0IGluaGVyaXQgPSBnM3dzZGsuY29yZS51dGlscy5pbmhlcml0O1xuY29uc3QgYmFzZSA9IGczd3Nkay5jb3JlLnV0aWxzLmJhc2U7XG5jb25zdCBYSFIgPSBnM3dzZGsuY29yZS51dGlscy5YSFI7XG5jb25zdCBQbHVnaW5TZXJ2aWNlID0gZzN3c2RrLmNvcmUucGx1Z2luLlBsdWdpblNlcnZpY2U7XG5jb25zdCB0ID0gZzN3c2RrLmNvcmUuaTE4bi50UGx1Z2luO1xuY29uc3QgR1VJID0gZzN3c2RrLmd1aS5HVUk7XG5jb25zdCBDaGFydHNGYWN0b3J5ID0gZzN3c2RrLmd1aS52dWUuQ2hhcnRzLkNoYXJ0c0ZhY3Rvcnk7XG5cbmZ1bmN0aW9uIEVsZXZhdGlvblByb2ZpbGVTZXJ2aWNlKCkge1xuICBiYXNlKHRoaXMpO1xuICB0aGlzLmluaXQgPSBmdW5jdGlvbihjb25maWc9e30pIHtcbiAgICB0aGlzLmNoYXJ0Q29sb3IgPSBHVUkuc2tpbkNvbG9yO1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIC8vIGFkZCB2dWUgcHJvcGVydHkgdG8gaW4gYWRkIGVsZXZlbnRpb24gY2hhcnQgZWxlbWVudFxuICAgIHRoaXMuY29uZmlnLmxheWVycyAmJiB0aGlzLmNvbmZpZy5sYXllcnMuZm9yRWFjaChsYXllck9iaiA9PiBsYXllck9iai5fdnVlID0ge30pO1xuICAgIHRoaXMuX21hcFNlcnZpY2UgPSBHVUkuZ2V0Q29tcG9uZW50KCdtYXAnKS5nZXRTZXJ2aWNlKCk7XG4gICAgdGhpcy5rZXlTZXR0ZXJzID0ge307XG4gICAgY29uc3QgcXVlcnlyZXN1bHRzQ29tcG9uZW50ID0gR1VJLmdldENvbXBvbmVudCgncXVlcnlyZXN1bHRzJyk7XG4gICAgdGhpcy5xdWVyeXJlc3VsdHNTZXJ2aWNlID0gcXVlcnlyZXN1bHRzQ29tcG9uZW50LmdldFNlcnZpY2UoKTtcbiAgICB0aGlzLmtleVNldHRlcnMub3BlbkNsb3NlRmVhdHVyZVJlc3VsdCA9IHRoaXMucXVlcnlyZXN1bHRzU2VydmljZS5vbmFmdGVyKCdvcGVuQ2xvc2VGZWF0dXJlUmVzdWx0JywgKHtvcGVuLCBsYXllciwgZmVhdHVyZSwgY29udGFpbmVyfSk9PntcbiAgICAgIGNvbnN0IGxheWVyT2JqID0gdGhpcy5jb25maWcubGF5ZXJzLmZpbmQobGF5ZXJPYmogPT4ge1xuICAgICAgICBjb25zdCB7bGF5ZXJfaWQ6IGxheWVySWR9ID0gbGF5ZXJPYmo7XG4gICAgICAgIHJldHVybiBsYXllci5pZCA9PT0gbGF5ZXJJZDtcbiAgICAgIH0pO1xuICAgICAgbGF5ZXJPYmogJiYgdGhpcy5zaG93SGlkZUNoYXJ0Q29tcG9uZW50KHtcbiAgICAgICAgb3BlbixcbiAgICAgICAgY29udGFpbmVyLFxuICAgICAgICBsYXllck9iaixcbiAgICAgICAgZmlkOiBmZWF0dXJlLmF0dHJpYnV0ZXNbJ2czd19maWQnXVxuICAgICAgfSlcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMuZ2V0Q29uZmlnID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gIH07XG5cbiAgdGhpcy5nZXRVcmxzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnVybHM7XG4gIH07XG5cbiAgdGhpcy5jcmVhdGVMb2FkaW5nQ29tcG9uZW50RG9tRWxlbWVudCA9IGZ1bmN0aW9uKCl7XG4gICAgY29uc3QgbG9hZGluZ0NvbXBvbmVudCA9IFZ1ZS5leHRlbmQoe1xuICAgICAgdGVtcGxhdGU6IGA8YmFyLWxvYWRlciA6bG9hZGluZz1cInRydWVcIj48L2Jhci1sb2FkZXI+YFxuICAgIH0pO1xuICAgIHJldHVybiBuZXcgbG9hZGluZ0NvbXBvbmVudCgpLiRtb3VudCgpLiRlbDtcbiAgfTtcblxuICB0aGlzLnNob3dIaWRlQ2hhcnRDb21wb25lbnQgPSBhc3luYyBmdW5jdGlvbih7b3BlbiwgbGF5ZXJPYmosIGNvbnRhaW5lciwgZmlkfT17fSkge1xuICAgIGlmIChvcGVuKSB7XG4gICAgICBjb25zdCB7YXBpLCBsYXllcl9pZDogbGF5ZXJJZH0gPSBsYXllck9iajtcbiAgICAgIGNvbnN0IGJhckxvYWRpbmdEb20gPSB0aGlzLmNyZWF0ZUxvYWRpbmdDb21wb25lbnREb21FbGVtZW50KCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb250YWluZXIuYXBwZW5kKGJhckxvYWRpbmdEb20pO1xuICAgICAgICBjb25zdCB7Y29tcG9uZW50LCBlcnJvcn0gPSBhd2FpdCB0aGlzLmdldENoYXJ0Q29tcG9uZW50KHthcGksIGxheWVySWQsIGZpZH0pO1xuICAgICAgICBpZiAoZXJyb3IpIHJldHVybjtcbiAgICAgICAgY29uc3QgdnVlQ29tcG9uZW50T2JqZWN0ID0gVnVlLmV4dGVuZChjb21wb25lbnQpO1xuICAgICAgICBsYXllck9iai5fdnVlW2ZpZF0gPSBuZXcgdnVlQ29tcG9uZW50T2JqZWN0KCk7XG4gICAgICAgIGxheWVyT2JqLl92dWVbZmlkXS4kb25jZSgnaG9vazptb3VudGVkJywgYXN5bmMgZnVuY3Rpb24oKXtcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kKHRoaXMuJGVsKTtcbiAgICAgICAgICBHVUkuZW1pdCgncmVzaXplJyk7XG4gICAgICAgIH0pO1xuICAgICAgICBsYXllck9iai5fdnVlW2ZpZF0uJG1vdW50KCk7XG4gICAgICB9IGNhdGNoIChlcnJvcil7XG4gICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGJhckxvYWRpbmdEb20ucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChsYXllck9iai5fdnVlW2ZpZF0pIHtcbiAgICAgICAgbGF5ZXJPYmouX3Z1ZVtmaWRdLiRkZXN0cm95KCk7XG4gICAgICAgIGxheWVyT2JqLl92dWVbZmlkXS4kZWwucmVtb3ZlKCk7XG4gICAgICAgIGxheWVyT2JqLl92dWVbZmlkXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdGhpcy5nZXRDaGFydENvbXBvbmVudCA9IGFzeW5jIGZ1bmN0aW9uKHthcGksIGxheWVySWQsIGZpZH09e30pIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmdldEVsZXZhdGlvbkRhdGEoe2FwaSwgbGF5ZXJJZCwgZmlkfSk7XG4gICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UucmVzdWx0ICYmIHJlc3BvbnNlLnByb2ZpbGU7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBjb25zdCBncmFwaERhdGEgPSB7XG4gICAgICAgICAgeDogWyd4J10sXG4gICAgICAgICAgeTogWyd5J10sXG4gICAgICAgICAgbWluWDogIDk5OTk5OTksXG4gICAgICAgICAgbWF4WDogLTk5OTk5OTksXG4gICAgICAgICAgbWluWTogIDk5OTk5OTksXG4gICAgICAgICAgbWF4WTogLTk5OTk5OTlcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IF9kYXRhID0gZGF0YVtpXTtcbiAgICAgICAgICBjb25zdCB4ID0gX2RhdGFbM107XG4gICAgICAgICAgY29uc3QgeSA9IF9kYXRhWzJdO1xuICAgICAgICAgIGdyYXBoRGF0YS5taW5YID0geCA8IGdyYXBoRGF0YS5taW5YID8geCA6IGdyYXBoRGF0YS5taW5YO1xuICAgICAgICAgIGdyYXBoRGF0YS5taW5ZID0geSA8IGdyYXBoRGF0YS5taW5ZID8geSA6IGdyYXBoRGF0YS5taW5ZO1xuICAgICAgICAgIGdyYXBoRGF0YS5tYXhYID0geCA+IGdyYXBoRGF0YS5tYXhYID8geCA6IGdyYXBoRGF0YS5tYXhYO1xuICAgICAgICAgIGdyYXBoRGF0YS5tYXhZID0geSA+IGdyYXBoRGF0YS5tYXhZID8geSA6IGdyYXBoRGF0YS5tYXhZO1xuICAgICAgICAgIGdyYXBoRGF0YS54LnB1c2goeCk7XG4gICAgICAgICAgZ3JhcGhEYXRhLnkucHVzaCh5KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgbWFwID0gdGhpcy5fbWFwU2VydmljZS5nZXRNYXAoKTtcbiAgICAgICAgbGV0IGhpZGVIaWdodGxpZ2h0Rm5jID0gKCkgPT4ge307XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBpZDogdCgnZWxlcHJvZmlsZS5jaGFydC50aXRsZScpLFxuICAgICAgICAgIGNvbXBvbmVudDogQ2hhcnRzRmFjdG9yeS5idWlsZCh7XG4gICAgICAgICAgICB0eXBlOiAnYzM6bGluZVhZJyxcbiAgICAgICAgICAgIGhvb2tzOiB7XG4gICAgICAgICAgICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRDb25maWcoe1xuICAgICAgICAgICAgICAgICAgb25tb3VzZW91dCgpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlkZUhpZ2h0bGlnaHRGbmMoKVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHQoJ2VsZXByb2ZpbGUuY2hhcnQudGl0bGUnKSxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICd0b3AtY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIHRvcDogNDAsXG4gICAgICAgICAgICAgICAgICAgIGJvdHRvbTogMzAsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAzMFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHpvb206IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzY2FsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbjoge1xuICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB4OiAneCcsXG4gICAgICAgICAgICAgICAgICAgIHk6ICd5JyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICB5OiAnYXJlYSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3JzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgeDogc2VsZi5jaGFydENvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgIHk6IHNlbGYuY2hhcnRDb2xvclxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiBbXG4gICAgICAgICAgICAgICAgICAgICAgZ3JhcGhEYXRhLngsXG4gICAgICAgICAgICAgICAgICAgICAgZ3JhcGhEYXRhLnlcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgb25tb3VzZW91dChldnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICBoaWRlSGlnaHRsaWdodEZuYygpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvbmNsaWNrKHtpbmRleH0pIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBbeCwgeV0gPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICBtYXAuZ2V0VmlldygpLnNldENlbnRlcihbeCx5XSk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgdG9vbHRpcDp7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDoge1xuICAgICAgICAgICAgICAgICAgICAgIHRpdGxlKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBgJHt0KCdlbGVwcm9maWxlLmNoYXJ0LnRvb2x0aXAudGl0bGUnKX06ICR7ZGF0YVtkXVszXX1gXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudHM6IGZ1bmN0aW9uIChfZGF0YSwgY29sb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IF9kYXRhWzBdLmluZGV4O1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IFt4LCB5LCB2YWx1ZV0gPSBkYXRhW2luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb2ludF9nZW9tID0gbmV3IG9sLmdlb20uUG9pbnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBbeCwgeV1cbiAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgIHNlbGYuX21hcFNlcnZpY2UuaGlnaGxpZ2h0R2VvbWV0cnkocG9pbnRfZ2VvbSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgem9vbTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlSGlnaHRsaWdodEZuYyA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBuZXcgb2wuc3R5bGUuU3R5bGUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogbmV3IG9sLnN0eWxlLlJlZ3VsYXJTaGFwZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogbmV3IG9sLnN0eWxlLkZpbGwoe2NvbG9yOiAnd2hpdGUnIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZTogbmV3IG9sLnN0eWxlLlN0cm9rZSh7Y29sb3I6IHNlbGYuY2hhcnRDb2xvciwgd2lkdGg6IDN9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb2ludHM6IDMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiAxMixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmdsZTogMFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYDxkaXYgc3R5bGU9XCJmb250LXdlaWdodDogYm9sZDsgYm9yZGVyOjJweCBzb2xpZDsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsgcGFkZGluZzogM3B4O2JvcmRlci1yYWRpdXM6IDNweDtcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJza2luLWJvcmRlci1jb2xvciBza2luLWNvbG9yXCI+JHt2YWx1ZS50b0ZpeGVkKDIpfShtKTwvZGl2PmBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICAgIG1heDogZ3JhcGhEYXRhLm1heFggKyAyLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbjogZ3JhcGhEYXRhLm1pblggLSAyLFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0KCdlbGVwcm9maWxlLmNoYXJ0LmxhYmVscy54JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ291dGVyLWNlbnRlcidcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHRpY2s6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpdDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogNCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgICAgIG1heDogZ3JhcGhEYXRhLm1heFkgKyA1LFxuICAgICAgICAgICAgICAgICAgICAgIG1pbjogZ3JhcGhEYXRhLm1pblkgLSA1LFxuICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0KCdlbGVwcm9maWxlLmNoYXJ0LmxhYmVscy55JyksXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ291dGVyLW1pZGRsZSdcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHRpY2s6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiA1LFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlcnJvcjogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB0aGlzLmdldEVsZXZhdGlvbkRhdGEgPSBhc3luYyBmdW5jdGlvbih7YXBpLCBsYXllcklkLCBmaWR9PXt9KSB7XG4gICAgY29uc3QgdXJsID0gYCR7YXBpfSR7bGF5ZXJJZH0vJHtmaWR9YDtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgcmVzdWx0OiBmYWxzZVxuICAgIH07XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgWEhSLmdldCh7XG4gICAgICAgIHVybFxuICAgICAgfSk7XG4gICAgICBkYXRhLnByb2ZpbGUgPSByZXNwb25zZS5wcm9maWxlO1xuICAgICAgZGF0YS5yZXN1bHQgPSB0cnVlO1xuICAgIH0gY2F0Y2goZXJyb3Ipe31cbiAgICByZXR1cm4gZGF0YTtcbiAgfTtcblxuICB0aGlzLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5xdWVyeXJlc3VsdHNTZXJ2aWNlLnVuKCdvcGVuQ2xvc2VGZWF0dXJlUmVzdWx0JywgdGhpcy5rZXlTZXR0ZXJzLm9wZW5DbG9zZUZlYXR1cmVSZXN1bHQpO1xuICB9XG59XG5cbmluaGVyaXQoRWxldmF0aW9uUHJvZmlsZVNlcnZpY2UsIFBsdWdpblNlcnZpY2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBFbGV2YXRpb25Qcm9maWxlU2VydmljZTtcbiJdLCJwcmVFeGlzdGluZ0NvbW1lbnQiOiIvLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5aWNtOTNjMlZ5TFhCaFkyc3ZYM0J5Wld4MVpHVXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZbUZpWld3dGNuVnVkR2x0WlM5amIzSmxMV3B6TDJkbGRDMXBkR1Z5WVhSdmNpNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWlZV0psYkMxeWRXNTBhVzFsTDJOdmNtVXRhbk12YVhNdGFYUmxjbUZpYkdVdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlltRmlaV3d0Y25WdWRHbHRaUzlqYjNKbExXcHpMM0J5YjIxcGMyVXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZbUZpWld3dGNuVnVkR2x0WlM5b1pXeHdaWEp6TDJGemVXNWpWRzlIWlc1bGNtRjBiM0l1YW5NaUxDSXVMaTh1TGk4dUxpOXViMlJsWDIxdlpIVnNaWE12WW1GaVpXd3RjblZ1ZEdsdFpTOW9aV3h3WlhKekwzTnNhV05sWkZSdlFYSnlZWGt1YW5NaUxDSXVMaTh1TGk4dUxpOXViMlJsWDIxdlpIVnNaWE12WW1GaVpXd3RjblZ1ZEdsdFpTOXlaV2RsYm1WeVlYUnZjaTlwYm1SbGVDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdlptNHZaMlYwTFdsMFpYSmhkRzl5TG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzltYmk5cGN5MXBkR1Z5WVdKc1pTNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdlptNHZjSEp2YldselpTNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZllTMW1kVzVqZEdsdmJpNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZllXUmtMWFJ2TFhWdWMyTnZjR0ZpYkdWekxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5aGJpMXBibk4wWVc1alpTNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZllXNHRiMkpxWldOMExtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5aGNuSmhlUzFwYm1Oc2RXUmxjeTVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZZMnhoYzNOdlppNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZlkyOW1MbXB6SWl3aUxpNHZMaTR2TGk0dmJtOWtaVjl0YjJSMWJHVnpMMk52Y21VdGFuTXZiR2xpY21GeWVTOXRiMlIxYkdWekwxOWpiM0psTG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTlqZEhndWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WDJSbFptbHVaV1F1YW5NaUxDSXVMaTh1TGk4dUxpOXViMlJsWDIxdlpIVnNaWE12WTI5eVpTMXFjeTlzYVdKeVlYSjVMMjF2WkhWc1pYTXZYMlJsYzJOeWFYQjBiM0p6TG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTlrYjIwdFkzSmxZWFJsTG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTlsYm5WdExXSjFaeTFyWlhsekxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5bGVIQnZjblF1YW5NaUxDSXVMaTh1TGk4dUxpOXViMlJsWDIxdlpIVnNaWE12WTI5eVpTMXFjeTlzYVdKeVlYSjVMMjF2WkhWc1pYTXZYMlpoYVd4ekxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5bWIzSXRiMll1YW5NaUxDSXVMaTh1TGk4dUxpOXViMlJsWDIxdlpIVnNaWE12WTI5eVpTMXFjeTlzYVdKeVlYSjVMMjF2WkhWc1pYTXZYMmRzYjJKaGJDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZmFHRnpMbXB6SWl3aUxpNHZMaTR2TGk0dmJtOWtaVjl0YjJSMWJHVnpMMk52Y21VdGFuTXZiR2xpY21GeWVTOXRiMlIxYkdWekwxOW9hV1JsTG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTlvZEcxc0xtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5cFpUZ3RaRzl0TFdSbFptbHVaUzVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZhVzUyYjJ0bExtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5cGIySnFaV04wTG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTlwY3kxaGNuSmhlUzFwZEdWeUxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5cGN5MXZZbXBsWTNRdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WDJsMFpYSXRZMkZzYkM1cWN5SXNJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5amIzSmxMV3B6TDJ4cFluSmhjbmt2Ylc5a2RXeGxjeTlmYVhSbGNpMWpjbVZoZEdVdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WDJsMFpYSXRaR1ZtYVc1bExtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5cGRHVnlMV1JsZEdWamRDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZmFYUmxjaTF6ZEdWd0xtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5cGRHVnlZWFJ2Y25NdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WDJ4cFluSmhjbmt1YW5NaUxDSXVMaTh1TGk4dUxpOXViMlJsWDIxdlpIVnNaWE12WTI5eVpTMXFjeTlzYVdKeVlYSjVMMjF2WkhWc1pYTXZYMjFwWTNKdmRHRnpheTVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZibVYzTFhCeWIyMXBjMlV0WTJGd1lXSnBiR2wwZVM1cWN5SXNJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5amIzSmxMV3B6TDJ4cFluSmhjbmt2Ylc5a2RXeGxjeTlmYjJKcVpXTjBMV055WldGMFpTNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZmIySnFaV04wTFdSd0xtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5dlltcGxZM1F0WkhCekxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5dlltcGxZM1F0WjNCdkxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5dlltcGxZM1F0YTJWNWN5MXBiblJsY201aGJDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZmIySnFaV04wTFd0bGVYTXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzQmxjbVp2Y20wdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WDNCeWIyMXBjMlV0Y21WemIyeDJaUzVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZjSEp2Y0dWeWRIa3RaR1Z6WXk1cWN5SXNJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5amIzSmxMV3B6TDJ4cFluSmhjbmt2Ylc5a2RXeGxjeTlmY21Wa1pXWnBibVV0WVd4c0xtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5eVpXUmxabWx1WlM1cWN5SXNJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5amIzSmxMV3B6TDJ4cFluSmhjbmt2Ylc5a2RXeGxjeTlmYzJWMExYTndaV05wWlhNdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WDNObGRDMTBieTF6ZEhKcGJtY3RkR0ZuTG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTl6YUdGeVpXUXRhMlY1TG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMTl6YUdGeVpXUXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzTndaV05wWlhNdFkyOXVjM1J5ZFdOMGIzSXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzTjBjbWx1WnkxaGRDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZmRHRnpheTVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZkRzh0WVdKemIyeDFkR1V0YVc1a1pYZ3Vhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzUnZMV2x1ZEdWblpYSXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzUnZMV2x2WW1wbFkzUXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzUnZMV3hsYm1kMGFDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5ZmRHOHRiMkpxWldOMExtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDE5MGJ5MXdjbWx0YVhScGRtVXVhbk1pTENJdUxpOHVMaTh1TGk5dWIyUmxYMjF2WkhWc1pYTXZZMjl5WlMxcWN5OXNhV0p5WVhKNUwyMXZaSFZzWlhNdlgzVnBaQzVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZkWE5sY2kxaFoyVnVkQzVxY3lJc0lpNHVMeTR1THk0dUwyNXZaR1ZmYlc5a2RXeGxjeTlqYjNKbExXcHpMMnhwWW5KaGNua3ZiVzlrZFd4bGN5OWZkMnR6TG1weklpd2lMaTR2TGk0dkxpNHZibTlrWlY5dGIyUjFiR1Z6TDJOdmNtVXRhbk12YkdsaWNtRnllUzl0YjJSMWJHVnpMMk52Y21VdVoyVjBMV2wwWlhKaGRHOXlMVzFsZEdodlpDNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5amIzSmxMbWRsZEMxcGRHVnlZWFJ2Y2k1cWN5SXNJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5amIzSmxMV3B6TDJ4cFluSmhjbmt2Ylc5a2RXeGxjeTlqYjNKbExtbHpMV2wwWlhKaFlteGxMbXB6SWl3aUxpNHZMaTR2TGk0dmJtOWtaVjl0YjJSMWJHVnpMMk52Y21VdGFuTXZiR2xpY21GeWVTOXRiMlIxYkdWekwyVnpOaTVoY25KaGVTNXBkR1Z5WVhSdmNpNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5bGN6WXViMkpxWldOMExuUnZMWE4wY21sdVp5NXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5bGN6WXVjSEp2YldselpTNXFjeUlzSWk0dUx5NHVMeTR1TDI1dlpHVmZiVzlrZFd4bGN5OWpiM0psTFdwekwyeHBZbkpoY25rdmJXOWtkV3hsY3k5bGN6WXVjM1J5YVc1bkxtbDBaWEpoZEc5eUxtcHpJaXdpTGk0dkxpNHZMaTR2Ym05a1pWOXRiMlIxYkdWekwyTnZjbVV0YW5NdmJHbGljbUZ5ZVM5dGIyUjFiR1Z6TDJWek55NXdjbTl0YVhObExtWnBibUZzYkhrdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdlkyOXlaUzFxY3k5c2FXSnlZWEo1TDIxdlpIVnNaWE12WlhNM0xuQnliMjFwYzJVdWRISjVMbXB6SWl3aUxpNHZMaTR2TGk0dmJtOWtaVjl0YjJSMWJHVnpMMk52Y21VdGFuTXZiR2xpY21GeWVTOXRiMlIxYkdWekwzZGxZaTVrYjIwdWFYUmxjbUZpYkdVdWFuTWlMQ0l1TGk4dUxpOHVMaTl1YjJSbFgyMXZaSFZzWlhNdmNtVm5aVzVsY21GMGIzSXRjblZ1ZEdsdFpTOXlkVzUwYVcxbExXMXZaSFZzWlM1cWN5SXNJaTR1THk0dUx5NHVMMjV2WkdWZmJXOWtkV3hsY3k5eVpXZGxibVZ5WVhSdmNpMXlkVzUwYVcxbEwzSjFiblJwYldVdWFuTWlMQ0pqYjI1bWFXY3ZhVEU0Ymk5cGJtUmxlQzVxY3lJc0ltTnZibVpwWnk5cGJtUmxlQzVxY3lJc0ltbHVaR1Y0TG1weklpd2ljR3gxWjJsdWMyVnlkbWxqWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaVFVRkJRVHRCUTBGQk96dEJRMEZCT3p0QlEwRkJPenRCUTBGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRGNrTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5zUkVFN1FVRkRRVHM3UVVORVFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTklRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5JUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlExQkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFNrRTdRVUZEUVRzN1FVTkVRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEVEVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlEweEJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU4yUWtFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlEzWkNRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEVEVFN1FVRkRRVHRCUVVOQk96dEJRMFpCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTndRa0U3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTB4Qk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEU2tFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTlFRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlEwcEJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTTVSRUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOUVFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRM3BDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5PUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMHBCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5TUVR0QlFVTkJPMEZCUTBFN08wRkRSa0U3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEU0VFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTm9Ra0U3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkRUa0U3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMUpCTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTBoQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlExcEJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFlrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRGNrVkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRGRFSkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMGhCTzBGQlEwRTdPMEZEUkVFN1FVRkRRVHM3UVVORVFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOeVJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEYkVKQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTjZRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOb1FrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOaVFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTJKQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOcVFrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5RUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlExQkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMXBCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5TUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlExQkJPMEZCUTBFN08wRkRSRUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTJSQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkRVRUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTB4Qk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlExcEJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTFSQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOcVFrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkRjRVpCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFVFRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFRrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFRrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFRrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMHhCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTFwQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTk1RVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlEwcEJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOWVFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGRFVrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUczdRVU5RUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTFaQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkRiRU5CT3p0QlEwRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZET1ZKQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVOcVFrRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUTNCQ1FUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVTmFRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRMjVDUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZEYmtOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN096czdPMnRDUTNaMFFtVTdRVUZEWWl4TlFVRkpPMEZCUTBZc1YwRkJUenRCUVVOTUxHVkJRVk03UVVGRFVDeDFRa0ZCWlR0QlFVUlNPMEZCUkVvc1MwRkVURHRCUVUxR0xGZEJRVTg3UVVGRFRDeGhRVUZQTEZsQlJFWTdRVUZGVEN4bFFVRlRPMEZCUTFBc1pVRkJUenRCUVVSQkxFOUJSa283UVVGTFRDeGpRVUZSTzBGQlEwNHNWMEZCUnl4alFVUkhPMEZCUlU0c1YwRkJSVHRCUVVaSk8wRkJURWc3UVVGT1RDeEhRVVJUTzBGQmEwSmlMRTFCUVVrN1FVRkRSaXhYUVVGUE8wRkJRMHdzWlVGQlV6dEJRVU5RTEhWQ1FVRmxPMEZCUkZJN1FVRkVTaXhMUVVSTU8wRkJUVVlzVjBGQlR6dEJRVU5NTEdGQlFVOHNWMEZFUmp0QlFVVk1MR1ZCUVZNN1FVRkRVQ3hsUVVGUE8wRkJSRUVzVDBGR1NqdEJRVXRNTEdOQlFWRTdRVUZEVGl4WFFVRkhMR05CUkVjN1FVRkZUaXhYUVVGRk8wRkJSa2s3UVVGTVNEdEJRVTVNTzBGQmJFSlRMRU03T3pzN096czdRVU5CWmpzN096czdPMnRDUVVObE8wRkJRMkk3UVVGRVlTeERPenM3UVVORVpqczdPenM3TzNsQ1FVTjNRaXhQUVVGUExFbEJRVkFzUTBGQldTeExPMGxCUVRkQ0xFa3NjMEpCUVVFc1NUdEpRVUZOTEU4c2MwSkJRVUVzVHpzN1FVRkRZaXhKUVVGTkxGTkJRVk1zVDBGQlR5eEpRVUZRTEVOQlFWa3NUVUZCV2l4RFFVRnRRaXhOUVVGc1F6dEJRVU5CTEVsQlFVMHNWVUZCVlN4UlFVRlJMR2xDUVVGU0xFTkJRV2hDTzBGQlEwRXNTVUZCVFN4blFrRkJaMElzVDBGQlR5eEpRVUZRTEVOQlFWa3NTVUZCV2l4RFFVRnBRaXhoUVVGMlF6czdRVUZGUVN4SlFVRk5MRlZCUVZVc1UwRkJWaXhQUVVGVkxFZEJRVmM3UVVGRGVrSXNUMEZCU3l4SlFVRk1PMEZCUTBFc1QwRkJTeXhKUVVGTUxFZEJRVmtzV1VGQldqdEJRVU5CTEU5QlFVc3NTVUZCVEN4SFFVRlpMRmxCUVZjN1FVRkRja0k3UVVGRFFTeHJRa0ZCWXp0QlFVTmFMRmxCUVUwc1MwRkJTeXhKUVVSRE8wRkJSVm9zWTBGQlVTeHBRa0ZCWVR0QlFVWlVMRXRCUVdRN1FVRkpRVHRCUVVOQkxGTkJRVXNzVFVGQlRDeEhRVUZqTEV0QlFVc3NVMEZCVEN4RlFVRmtPMEZCUTBFc1UwRkJTeXhWUVVGTUxFTkJRV2RDTEU5QlFXaENPMEZCUTBFc1UwRkJTeXhQUVVGTUxFTkJRV0VzU1VGQllpeERRVUZyUWl4TFFVRkxMRTFCUVhaQ08wRkJRMEVzVTBGQlN5eGpRVUZNTEVOQlFXOUNMRXRCUVVzc1RVRkJUQ3hEUVVGWkxFZEJRV2hETzBGQlEwRTdRVUZEUVN4VFFVRkxMRkZCUVV3c1EwRkJZeXhKUVVGa08wRkJRMFFzUjBGaVJEdEJRV05CTzBGQlEwRXNUMEZCU3l4TlFVRk1MRWRCUVdNc1dVRkJWenRCUVVOMlFpeFRRVUZMTEU5QlFVd3NRMEZCWVN4TFFVRmlPMEZCUTBRc1IwRkdSRHRCUVVkRUxFTkJja0pFT3p0QlFYVkNRU3hSUVVGUkxFOUJRVklzUlVGQmFVSXNUVUZCYWtJN08wRkJSVUVzUTBGQlF5eFZRVUZUTEUxQlFWUXNSVUZCWjBJN1FVRkRaaXhUUVVGUExFbEJRVkE3UVVGRFJDeERRVVpFTEVWQlJVY3NTVUZCU1N4UFFVRktMRVZCUmtnN096czdPenM3T3pzN096czdPenM3TzBGREwwSkJMRWxCUVUwc1ZVRkJWU3hQUVVGUExFbEJRVkFzUTBGQldTeExRVUZhTEVOQlFXdENMRTlCUVd4RE8wRkJRMEVzU1VGQlRTeFBRVUZQTEU5QlFVOHNTVUZCVUN4RFFVRlpMRXRCUVZvc1EwRkJhMElzU1VGQkwwSTdRVUZEUVN4SlFVRk5MRTFCUVUwc1QwRkJUeXhKUVVGUUxFTkJRVmtzUzBGQldpeERRVUZyUWl4SFFVRTVRanRCUVVOQkxFbEJRVTBzWjBKQlFXZENMRTlCUVU4c1NVRkJVQ3hEUVVGWkxFMUJRVm9zUTBGQmJVSXNZVUZCZWtNN1FVRkRRU3hKUVVGTkxFbEJRVWtzVDBGQlR5eEpRVUZRTEVOQlFWa3NTVUZCV2l4RFFVRnBRaXhQUVVFelFqdEJRVU5CTEVsQlFVMHNUVUZCVFN4UFFVRlBMRWRCUVZBc1EwRkJWeXhIUVVGMlFqdEJRVU5CTEVsQlFVMHNaMEpCUVdkQ0xFOUJRVThzUjBGQlVDeERRVUZYTEVkQlFWZ3NRMEZCWlN4TlFVRm1MRU5CUVhOQ0xHRkJRVFZET3p0QlFVVkJMRk5CUVZNc2RVSkJRVlFzUjBGQmJVTTdRVUZEYWtNc1QwRkJTeXhKUVVGTU8wRkJRMEVzVDBGQlN5eEpRVUZNTEVkQlFWa3NXVUZCYjBJN1FVRkJRVHM3UVVGQlFTeFJRVUZZTEUxQlFWY3NkVVZCUVVvc1JVRkJTVHM3UVVGRE9VSXNVMEZCU3l4VlFVRk1MRWRCUVd0Q0xFbEJRVWtzVTBGQmRFSTdRVUZEUVN4VFFVRkxMRTFCUVV3c1IwRkJZeXhOUVVGa08wRkJRMEU3UVVGRFFTeFRRVUZMTEUxQlFVd3NRMEZCV1N4TlFVRmFMRWxCUVhOQ0xFdEJRVXNzVFVGQlRDeERRVUZaTEUxQlFWb3NRMEZCYlVJc1QwRkJia0lzUTBGQk1rSTdRVUZCUVN4aFFVRlpMRk5CUVZNc1NVRkJWQ3hIUVVGblFpeEZRVUUxUWp0QlFVRkJMRXRCUVROQ0xFTkJRWFJDTzBGQlEwRXNVMEZCU3l4WFFVRk1MRWRCUVcxQ0xFbEJRVWtzV1VGQlNpeERRVUZwUWl4TFFVRnFRaXhGUVVGM1FpeFZRVUY0UWl4RlFVRnVRanRCUVVOQkxGTkJRVXNzVlVGQlRDeEhRVUZyUWl4RlFVRnNRanRCUVVOQkxGRkJRVTBzZDBKQlFYZENMRWxCUVVrc1dVRkJTaXhEUVVGcFFpeGpRVUZxUWl4RFFVRTVRanRCUVVOQkxGTkJRVXNzYlVKQlFVd3NSMEZCTWtJc2MwSkJRWE5DTEZWQlFYUkNMRVZCUVROQ08wRkJRMEVzVTBGQlN5eFZRVUZNTEVOQlFXZENMSE5DUVVGb1FpeEhRVUY1UXl4TFFVRkxMRzFDUVVGTUxFTkJRWGxDTEU5QlFYcENMRU5CUVdsRExIZENRVUZxUXl4RlFVRXlSQ3huUWtGQmNVTTdRVUZCUVN4VlFVRnVReXhKUVVGdFF5eFJRVUZ1UXl4SlFVRnRRenRCUVVGQkxGVkJRVGRDTEV0QlFUWkNMRkZCUVRkQ0xFdEJRVFpDTzBGQlFVRXNWVUZCZEVJc1QwRkJjMElzVVVGQmRFSXNUMEZCYzBJN1FVRkJRU3hWUVVGaUxGTkJRV0VzVVVGQllpeFRRVUZoT3p0QlFVTjJTU3hWUVVGTkxGZEJRVmNzVFVGQlN5eE5RVUZNTEVOQlFWa3NUVUZCV2l4RFFVRnRRaXhKUVVGdVFpeERRVUYzUWl4dlFrRkJXVHRCUVVGQkxGbEJRMnhETEU5QlJHdERMRWRCUTNaQ0xGRkJSSFZDTEVOQlF6VkRMRkZCUkRSRE96dEJRVVZ1UkN4bFFVRlBMRTFCUVUwc1JVRkJUaXhMUVVGaExFOUJRWEJDTzBGQlEwUXNUMEZJWjBJc1EwRkJha0k3UVVGSlFTeHJRa0ZCV1N4TlFVRkxMSE5DUVVGTUxFTkJRVFJDTzBGQlEzUkRMR3RDUVVSelF6dEJRVVYwUXl3MFFrRkdjME03UVVGSGRFTXNNRUpCU0hORE8wRkJTWFJETEdGQlFVc3NVVUZCVVN4VlFVRlNMRU5CUVcxQ0xGTkJRVzVDTzBGQlNtbERMRTlCUVRWQ0xFTkJRVm83UVVGTlJDeExRVmgzUXl4RFFVRjZRenRCUVZsRUxFZEJja0pFT3p0QlFYVkNRU3hQUVVGTExGTkJRVXdzUjBGQmFVSXNXVUZCVlR0QlFVTjZRaXhYUVVGUExFdEJRVXNzVFVGQldqdEJRVU5FTEVkQlJrUTdPMEZCU1VFc1QwRkJTeXhQUVVGTUxFZEJRV1VzV1VGQlZ6dEJRVU40UWl4WFFVRlBMRXRCUVVzc1RVRkJUQ3hEUVVGWkxFbEJRVzVDTzBGQlEwUXNSMEZHUkRzN1FVRkpRU3hQUVVGTExHZERRVUZNTEVkQlFYZERMRmxCUVZVN1FVRkRhRVFzVVVGQlRTeHRRa0ZCYlVJc1NVRkJTU3hOUVVGS0xFTkJRVmM3UVVGRGJFTTdRVUZFYTBNc1MwRkJXQ3hEUVVGNlFqdEJRVWRCTEZkQlFVOHNTVUZCU1N4blFrRkJTaXhIUVVGMVFpeE5RVUYyUWl4SFFVRm5ReXhIUVVGMlF6dEJRVU5FTEVkQlRFUTdPMEZCVDBFc1QwRkJTeXh6UWtGQlREdEJRVUZCTEhsR1FVRTRRanRCUVVGQkxITkdRVUZuUkN4RlFVRm9SRHRCUVVGQkxGVkJRV2RDTEVsQlFXaENMRk5CUVdkQ0xFbEJRV2hDTzBGQlFVRXNWVUZCYzBJc1VVRkJkRUlzVTBGQmMwSXNVVUZCZEVJN1FVRkJRU3hWUVVGblF5eFRRVUZvUXl4VFFVRm5ReXhUUVVGb1F6dEJRVUZCTEZWQlFUSkRMRWRCUVRORExGTkJRVEpETEVkQlFUTkRPenRCUVVGQk96dEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFc2JVSkJRM2hDTEVsQlJIZENPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVVZ1UWl4cFFrRkdiVUlzUjBGRlR5eFJRVVpRTEVOQlJXNUNMRWRCUm0xQ0xFVkJSVW9zVDBGR1NTeEhRVVZQTEZGQlJsQXNRMEZGWkN4UlFVWmpPMEZCUjNCQ0xESkNRVWh2UWl4SFFVZEtMRXRCUVVzc1owTkJRVXdzUlVGSVNUdEJRVUZCT3p0QlFVdDRRaXgzUWtGQlZTeE5RVUZXTEVOQlFXbENMR0ZCUVdwQ08wRkJUSGRDTzBGQlFVRXNjVUpCVFZNc1MwRkJTeXhwUWtGQlRDeERRVUYxUWl4RlFVRkRMRkZCUVVRc1JVRkJUU3huUWtGQlRpeEZRVUZsTEZGQlFXWXNSVUZCZGtJc1EwRk9WRHM3UVVGQlFUdEJRVUZCTzBGQlRXcENMSFZDUVU1cFFpeFRRVTFxUWl4VFFVNXBRanRCUVUxT0xHMUNRVTVOTEZOQlRVNHNTMEZPVFRzN1FVRkJRU3h0UWtGUGNFSXNTMEZRYjBJN1FVRkJRVHRCUVVGQk8wRkJRVUU3TzBGQlFVRTdPMEZCUVVFN1FVRlJiRUlzWjBOQlVtdENMRWRCVVVjc1NVRkJTU3hOUVVGS0xFTkJRVmNzVTBGQldDeERRVkpJT3p0QlFWTjRRaXgxUWtGQlV5eEpRVUZVTEVOQlFXTXNSMEZCWkN4SlFVRnhRaXhKUVVGSkxHdENRVUZLTEVWQlFYSkNPMEZCUTBFc2RVSkJRVk1zU1VGQlZDeERRVUZqTEVkQlFXUXNSVUZCYlVJc1MwRkJia0lzUTBGQmVVSXNZMEZCZWtJc01rVkJRWGxETzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkRka01zYTBOQlFWVXNUVUZCVml4RFFVRnBRaXhMUVVGTExFZEJRWFJDTzBGQlEwRXNORUpCUVVrc1NVRkJTaXhEUVVGVExGRkJRVlE3TzBGQlJuVkRPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTEdWQlFYcERPMEZCU1VFc2RVSkJRVk1zU1VGQlZDeERRVUZqTEVkQlFXUXNSVUZCYlVJc1RVRkJia0k3UVVGa2QwSTdRVUZCUVRzN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUczdRVUZCUVR0QlFVRkJPenRCUVd0Q2VFSXNORUpCUVdNc1RVRkJaRHRCUVd4Q2QwSTdPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVUZCTzBGQmNVSXhRaXhyUWtGQlNTeFRRVUZUTEVsQlFWUXNRMEZCWXl4SFFVRmtMRU5CUVVvc1JVRkJkMEk3UVVGRGRFSXNlVUpCUVZNc1NVRkJWQ3hEUVVGakxFZEJRV1FzUlVGQmJVSXNVVUZCYmtJN1FVRkRRU3g1UWtGQlV5eEpRVUZVTEVOQlFXTXNSMEZCWkN4RlFVRnRRaXhIUVVGdVFpeERRVUYxUWl4TlFVRjJRanRCUVVOQkxIbENRVUZUTEVsQlFWUXNRMEZCWXl4SFFVRmtMRWxCUVhGQ0xGTkJRWEpDTzBGQlEwUTdPMEZCZWtKNVFqdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRU3hMUVVFNVFqczdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHM3UVVFMlFrRXNUMEZCU3l4cFFrRkJURHRCUVVGQkxIbEdRVUY1UWp0QlFVRkJMSE5HUVVGdFF5eEZRVUZ1UXp0QlFVRkJMRlZCUVdkQ0xFZEJRV2hDTEZOQlFXZENMRWRCUVdoQ08wRkJRVUVzVlVGQmNVSXNUMEZCY2tJc1UwRkJjVUlzVDBGQmNrSTdRVUZCUVN4VlFVRTRRaXhIUVVFNVFpeFRRVUU0UWl4SFFVRTVRanM3UVVGQlFUczdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFTeHhRa0ZGUlN4TFFVRkxMR2RDUVVGTUxFTkJRWE5DTEVWQlFVTXNVVUZCUkN4RlFVRk5MR2RDUVVGT0xFVkJRV1VzVVVGQlppeEZRVUYwUWl4RFFVWkdPenRCUVVGQk8wRkJSV1lzYzBKQlJtVTdRVUZIWml4clFrRklaU3hIUVVkU0xGTkJRVk1zVFVGQlZDeEpRVUZ0UWl4VFFVRlRMRTlCU0hCQ096dEJRVUZCTEcxQ1FVbHFRaXhKUVVwcFFqdEJRVUZCTzBGQlFVRTdRVUZCUVRzN1FVRkxZaXgxUWtGTVlTeEhRVXRFTzBGQlEyaENMRzFDUVVGSExFTkJRVU1zUjBGQlJDeERRVVJoTzBGQlJXaENMRzFDUVVGSExFTkJRVU1zUjBGQlJDeERRVVpoTzBGQlIyaENMSE5DUVVGUExFOUJTRk03UVVGSmFFSXNjMEpCUVUwc1EwRkJReXhQUVVwVE8wRkJTMmhDTEhOQ1FVRlBMRTlCVEZNN1FVRk5hRUlzYzBKQlFVMHNRMEZCUXp0QlFVNVRMR1ZCVEVNN08wRkJZVzVDTEcxQ1FVRlRMRU5CUVZRc1IwRkJWeXhEUVVGWUxFVkJRV01zU1VGQlNTeExRVUZMTEUxQlFYWkNMRVZCUVN0Q0xFZEJRUzlDTEVWQlFXOURPMEZCUXpWQ0xIRkNRVVEwUWl4SFFVTndRaXhMUVVGTExFTkJRVXdzUTBGRWIwSTdRVUZGTlVJc2FVSkJSalJDTEVkQlJYaENMRTFCUVUwc1EwRkJUaXhEUVVaM1FqdEJRVWMxUWl4cFFrRklORUlzUjBGSGVFSXNUVUZCVFN4RFFVRk9MRU5CU0hkQ096dEJRVWxzUXl3d1FrRkJWU3hKUVVGV0xFZEJRV2xDTEVsQlFVa3NWVUZCVlN4SlFVRmtMRWRCUVhGQ0xFTkJRWEpDTEVkQlFYbENMRlZCUVZVc1NVRkJjRVE3UVVGRFFTd3dRa0ZCVlN4SlFVRldMRWRCUVdsQ0xFbEJRVWtzVlVGQlZTeEpRVUZrTEVkQlFYRkNMRU5CUVhKQ0xFZEJRWGxDTEZWQlFWVXNTVUZCY0VRN1FVRkRRU3d3UWtGQlZTeEpRVUZXTEVkQlFXbENMRWxCUVVrc1ZVRkJWU3hKUVVGa0xFZEJRWEZDTEVOQlFYSkNMRWRCUVhsQ0xGVkJRVlVzU1VGQmNFUTdRVUZEUVN3d1FrRkJWU3hKUVVGV0xFZEJRV2xDTEVsQlFVa3NWVUZCVlN4SlFVRmtMRWRCUVhGQ0xFTkJRWEpDTEVkQlFYbENMRlZCUVZVc1NVRkJjRVE3UVVGRFFTd3dRa0ZCVlN4RFFVRldMRU5CUVZrc1NVRkJXaXhEUVVGcFFpeERRVUZxUWp0QlFVTkJMREJDUVVGVkxFTkJRVllzUTBGQldTeEpRVUZhTEVOQlFXbENMRU5CUVdwQ08wRkJRMFE3UVVGRFN5eHJRa0Y0UW1Fc1IwRjNRazRzU1VGNFFrMDdRVUY1UW1Jc2FVSkJla0poTEVkQmVVSlFMRXRCUVVzc1YwRkJUQ3hEUVVGcFFpeE5RVUZxUWl4RlFYcENUenM3UVVFd1FtWXNLMEpCTVVKbExFZEJNRUpMTERaQ1FVRk5MRU5CUVVVc1EwRXhRbUk3TzBGQlFVRXNaMFJCTWtKYU8wRkJRMHdzTUVKQlJFczdRVUZGVEN4dlFrRkJTU3hGUVVGRkxIZENRVUZHTEVOQlJrTTdRVUZIVEN3eVFrRkJWeXhqUVVGakxFdEJRV1FzUTBGQmIwSTdRVUZETjBJc2QwSkJRVTBzVjBGRWRVSTdRVUZGTjBJc2VVSkJRVTg3UVVGRFRDd3lRa0ZFU3l4eFFrRkRTenRCUVVOU0xESkNRVUZMTEZOQlFVd3NRMEZCWlR0QlFVTmlMR3REUVVSaExIZENRVU5CTzBGQlExZzdRVUZEUkN4NVFrRklXVHM3UVVGSllpd3JRa0ZCVHp0QlFVTk1MR2REUVVGTkxFVkJRVVVzZDBKQlFVWXNRMEZFUkR0QlFVVk1MRzlEUVVGVk8wRkJSa3dzZVVKQlNrMDdRVUZSWWl4cFEwRkJVenRCUVVOUUxDdENRVUZMTEVWQlJFVTdRVUZGVUN4clEwRkJVU3hGUVVaRU8wRkJSMUFzYVVOQlFVODdRVUZJUVN4NVFrRlNTVHRCUVdGaUxEaENRVUZOTzBGQlEwb3NiVU5CUVZNc1NVRkVURHRCUVVWS0xHMURRVUZUTzBGQlJrd3NlVUpCWWs4N1FVRnBRbUlzT0VKQlFVMDdRVUZEU2l4eFEwRkJWenRCUVVOVUxIRkRRVUZUTEV0QlJFRTdRVUZGVkN4MVEwRkJWenRCUVVaR0xESkNRVVJRTzBGQlMwb3NOa0pCUVVjc1IwRk1RenRCUVUxS0xEWkNRVUZITEVkQlRrTTdRVUZQU2l4cFEwRkJUenRCUVVOTUxDdENRVUZITzBGQlJFVXNNa0pCVUVnN1FVRlZTaXhyUTBGQlVUdEJRVU5PTEN0Q1FVRkhMRXRCUVVzc1ZVRkVSanRCUVVWT0xDdENRVUZITEV0QlFVczdRVUZHUml3eVFrRldTanRCUVdOS0xHMURRVUZUTEVOQlExQXNWVUZCVlN4RFFVUklMRVZCUlZBc1ZVRkJWU3hEUVVaSUxFTkJaRXc3UVVGclFrb3NiME5CYkVKSkxITkNRV3RDVHl4SFFXeENVQ3hGUVd0Q1dUdEJRVU5rTzBGQlEwUXNNa0pCY0VKSE8wRkJjVUpLTEdsRFFYSkNTU3d3UWtGeFFtRTdRVUZCUVN4blEwRkJVaXhMUVVGUkxGTkJRVklzUzBGQlVUczdRVUZCUVN3eVJVRkRRU3hMUVVGTExFdEJRVXdzUTBGRVFUdEJRVUZCTEdkRFFVTlNMRU5CUkZFN1FVRkJRU3huUTBGRFRDeERRVVJMT3p0QlFVVm1MR2REUVVGSkxFOUJRVW9zUjBGQll5eFRRVUZrTEVOQlFYZENMRU5CUVVNc1EwRkJSQ3hGUVVGSExFTkJRVWdzUTBGQmVFSTdRVUZEUkR0QlFYaENSeXg1UWtGcVFrODdRVUV5UTJJc1owTkJRVkU3UVVGRFRpeG5RMEZCVFR0QlFVUkJMSGxDUVRORFN6dEJRVGhEWWl4cFEwRkJVVHRCUVVOT0xHdERRVUZSTzBGQlEwNHNhVU5CUkUwc2FVSkJRMEVzUTBGRVFTeEZRVU5ITzBGQlExQXNjVU5CUVZVc1JVRkJSU3huUTBGQlJpeERRVUZXTEZWQlFXdEVMRXRCUVVzc1EwRkJUQ3hGUVVGUkxFTkJRVklzUTBGQmJFUTdRVUZEUkR0QlFVaExMREpDUVVSR08wRkJUVTRzYjBOQlFWVXNhMEpCUVZVc1MwRkJWaXhGUVVGcFFpeExRVUZxUWl4RlFVRjNRanRCUVVOb1F5eG5RMEZCVFN4UlFVRlJMRTFCUVUwc1EwRkJUaXhGUVVGVExFdEJRWFpDT3p0QlFVUm5ReXcwUlVGRlZpeExRVUZMTEV0QlFVd3NRMEZHVlR0QlFVRkJMR2REUVVWNlFpeERRVVo1UWp0QlFVRkJMR2REUVVWMFFpeERRVVp6UWp0QlFVRkJMR2REUVVWdVFpeExRVVp0UWpzN1FVRkhhRU1zWjBOQlFVMHNZVUZCWVN4SlFVRkpMRWRCUVVjc1NVRkJTQ3hEUVVGUkxFdEJRVm9zUTBGRGFrSXNRMEZCUXl4RFFVRkVMRVZCUVVrc1EwRkJTaXhEUVVScFFpeERRVUZ1UWp0QlFVZEJMR2xEUVVGTExGZEJRVXdzUTBGQmFVSXNhVUpCUVdwQ0xFTkJRVzFETEZWQlFXNURMRVZCUVN0RE8wRkJRemRETEc5RFFVRk5MRXRCUkhWRE8wRkJSVGRETEc5RFFVRk5MR05CUVZNc1VVRkJWQ3hGUVVGdFFqdEJRVU4yUWl4dlJFRkJiMElzVVVGQmNFSTdRVUZEUkN3clFrRktORU03UVVGTE4wTXNjVU5CUVU4c1NVRkJTU3hIUVVGSExFdEJRVWdzUTBGQlV5eExRVUZpTEVOQlFXMUNPMEZCUTNoQ0xIVkRRVUZQTEVsQlFVa3NSMEZCUnl4TFFVRklMRU5CUVZNc1dVRkJZaXhEUVVFd1FqdEJRVU12UWl4M1EwRkJUU3hKUVVGSkxFZEJRVWNzUzBGQlNDeERRVUZUTEVsQlFXSXNRMEZCYTBJc1JVRkJReXhQUVVGUExFOUJRVklzUlVGQmJFSXNRMEZFZVVJN1FVRkZMMElzTUVOQlFWRXNTVUZCU1N4SFFVRkhMRXRCUVVnc1EwRkJVeXhOUVVGaUxFTkJRVzlDTEVWQlFVTXNUMEZCVHl4TFFVRkxMRlZCUVdJc1JVRkJlVUlzVDBGQlR5eERRVUZvUXl4RlFVRndRaXhEUVVaMVFqdEJRVWN2UWl3d1EwRkJVU3hEUVVoMVFqdEJRVWt2UWl3d1EwRkJVU3hGUVVwMVFqdEJRVXN2UWl4NVEwRkJUenRCUVV4M1FpeHBRMEZCTVVJN1FVRkVhVUlzSzBKQlFXNUNPMEZCVEhORExEWkNRVUV2UXp0QlFXVkJMSFZPUVVNeVF5eE5RVUZOTEU5QlFVNHNRMEZCWXl4RFFVRmtMRU5CUkRORE8wRkJSVVE3UVVFM1Frc3NlVUpCT1VOTE8wRkJOa1ZpTERoQ1FVRk5PMEZCUTBvc05rSkJRVWM3UVVGRFJDeHBRMEZCU3l4VlFVRlZMRWxCUVZZc1IwRkJhVUlzUTBGRWNrSTdRVUZGUkN4cFEwRkJTeXhWUVVGVkxFbEJRVllzUjBGQmFVSXNRMEZHY2tJN1FVRkhSQ3h0UTBGQlR6dEJRVU5NTEc5RFFVRk5MRVZCUVVVc01rSkJRVVlzUTBGRVJEdEJRVVZNTEhkRFFVRlZPMEZCUmt3c05rSkJTRTQ3UVVGUFJDeHJRMEZCVFR0QlFVTktMRzFEUVVGTExFdEJSRVE3UVVGRlNpeHhRMEZCVHl4RFFVWklPMEZCUjBvc2MwTkJRVkVzWjBKQlFWVXNTMEZCVml4RlFVRnBRanRCUVVOMlFpeDFRMEZCVHl4TlFVRk5MRTlCUVU0c1EwRkJZeXhEUVVGa0xFTkJRVkE3UVVGRFJEdEJRVXhITzBGQlVFd3NNa0pCUkVNN1FVRm5Ra29zTmtKQlFVYzdRVUZEUkN4cFEwRkJTeXhWUVVGVkxFbEJRVllzUjBGQmFVSXNRMEZFY2tJN1FVRkZSQ3hwUTBGQlN5eFZRVUZWTEVsQlFWWXNSMEZCYVVJc1EwRkdja0k3UVVGSFJDeHRRMEZCVHp0QlFVTk1MRzlEUVVGTkxFVkJRVVVzTWtKQlFVWXNRMEZFUkR0QlFVVk1MSGREUVVGVk8wRkJSa3dzTmtKQlNFNDdRVUZQUkN4clEwRkJUVHRCUVVOS0xIRkRRVUZQTEVOQlJFZzdRVUZGU2l4elEwRkJVU3huUWtGQlZTeExRVUZXTEVWQlFXbENPMEZCUTNaQ0xIVkRRVUZQTEUxQlFVMHNUMEZCVGl4RFFVRmpMRU5CUVdRc1EwRkJVRHRCUVVORU8wRkJTa2M3UVVGUVREdEJRV2hDUXp0QlFUZEZUeXgxUWtGQlpqdEJRVFpIUkR0QlFTOUhTVHRCUVVaelFpeHBRa0ZCY0VJN1FVRklUaXhsUVROQ1dUczdRVUZCUVR0QlFVRkJPMEZCUVVFN08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRXNaMFJCY1Vwa08wRkJRMHdzZFVKQlFVODdRVUZFUml4bFFYSktZenM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRU3hMUVVGNlFqczdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHM3UVVFeVNrRXNUMEZCU3l4blFrRkJURHRCUVVGQkxIbEdRVUYzUWp0QlFVRkJMSFZHUVVGdFF5eEZRVUZ1UXp0QlFVRkJMRlZCUVdkQ0xFZEJRV2hDTEZWQlFXZENMRWRCUVdoQ08wRkJRVUVzVlVGQmNVSXNUMEZCY2tJc1ZVRkJjVUlzVDBGQmNrSTdRVUZCUVN4VlFVRTRRaXhIUVVFNVFpeFZRVUU0UWl4SFFVRTVRanM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUTJoQ0xHbENRVVJuUWl4UlFVTlFMRWRCUkU4c1IwRkRSQ3hQUVVSRExGTkJRMVVzUjBGRVZqdEJRVVZvUWl4clFrRkdaMElzUjBGRlZEdEJRVU5ZTEhkQ1FVRlJPMEZCUkVjc1pVRkdVenRCUVVGQk8wRkJRVUU3UVVGQlFTeHhRa0ZOUnl4SlFVRkpMRWRCUVVvc1EwRkJVVHRCUVVNM1FqdEJRVVEyUWl4bFFVRlNMRU5CVGtnN08wRkJRVUU3UVVGTlpDeHpRa0ZPWXpzN1FVRlRjRUlzYlVKQlFVc3NUMEZCVEN4SFFVRmxMRk5CUVZNc1QwRkJlRUk3UVVGRFFTeHRRa0ZCU3l4TlFVRk1MRWRCUVdNc1NVRkJaRHRCUVZadlFqdEJRVUZCT3p0QlFVRkJPMEZCUVVFN1FVRkJRVHM3UVVGQlFUdEJRVUZCTEdkRVFWbG1MRWxCV21VN08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFc1MwRkJlRUk3TzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN08wRkJaVUVzVDBGQlN5eExRVUZNTEVkQlFXRXNXVUZCVnp0QlFVTjBRaXhUUVVGTExHMUNRVUZNTEVOQlFYbENMRVZCUVhwQ0xFTkJRVFJDTEhkQ1FVRTFRaXhGUVVGelJDeExRVUZMTEZWQlFVd3NRMEZCWjBJc2MwSkJRWFJGTzBGQlEwUXNSMEZHUkR0QlFVZEVPenRCUVVWRUxGRkJRVkVzZFVKQlFWSXNSVUZCYVVNc1lVRkJha003TzBGQlJVRXNUMEZCVHl4UFFVRlFMRWRCUVdsQ0xFbEJRVWtzZFVKQlFVb3NSVUZCYWtJaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWhtZFc1amRHbHZiaWdwZTJaMWJtTjBhVzl1SUhJb1pTeHVMSFFwZTJaMWJtTjBhVzl1SUc4b2FTeG1LWHRwWmlnaGJsdHBYU2w3YVdZb0lXVmJhVjBwZTNaaGNpQmpQVndpWm5WdVkzUnBiMjVjSWowOWRIbHdaVzltSUhKbGNYVnBjbVVtSm5KbGNYVnBjbVU3YVdZb0lXWW1KbU1wY21WMGRYSnVJR01vYVN3aE1DazdhV1lvZFNseVpYUjFjbTRnZFNocExDRXdLVHQyWVhJZ1lUMXVaWGNnUlhKeWIzSW9YQ0pEWVc1dWIzUWdabWx1WkNCdGIyUjFiR1VnSjF3aUsya3JYQ0luWENJcE8zUm9jbTkzSUdFdVkyOWtaVDFjSWsxUFJGVk1SVjlPVDFSZlJrOVZUa1JjSWl4aGZYWmhjaUJ3UFc1YmFWMDllMlY0Y0c5eWRITTZlMzE5TzJWYmFWMWJNRjB1WTJGc2JDaHdMbVY0Y0c5eWRITXNablZ1WTNScGIyNG9jaWw3ZG1GeUlHNDlaVnRwWFZzeFhWdHlYVHR5WlhSMWNtNGdieWh1Zkh4eUtYMHNjQ3h3TG1WNGNHOXlkSE1zY2l4bExHNHNkQ2w5Y21WMGRYSnVJRzViYVYwdVpYaHdiM0owYzMxbWIzSW9kbUZ5SUhVOVhDSm1kVzVqZEdsdmJsd2lQVDEwZVhCbGIyWWdjbVZ4ZFdseVpTWW1jbVZ4ZFdseVpTeHBQVEE3YVR4MExteGxibWQwYUR0cEt5c3BieWgwVzJsZEtUdHlaWFIxY200Z2IzMXlaWFIxY200Z2NuMHBLQ2tpTENKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhzZ1hDSmtaV1poZFd4MFhDSTZJSEpsY1hWcGNtVW9YQ0pqYjNKbExXcHpMMnhwWW5KaGNua3ZabTR2WjJWMExXbDBaWEpoZEc5eVhDSXBMQ0JmWDJWelRXOWtkV3hsT2lCMGNuVmxJSDA3SWl3aWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN0lGd2laR1ZtWVhWc2RGd2lPaUJ5WlhGMWFYSmxLRndpWTI5eVpTMXFjeTlzYVdKeVlYSjVMMlp1TDJsekxXbDBaWEpoWW14bFhDSXBMQ0JmWDJWelRXOWtkV3hsT2lCMGNuVmxJSDA3SWl3aWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCN0lGd2laR1ZtWVhWc2RGd2lPaUJ5WlhGMWFYSmxLRndpWTI5eVpTMXFjeTlzYVdKeVlYSjVMMlp1TDNCeWIyMXBjMlZjSWlrc0lGOWZaWE5OYjJSMWJHVTZJSFJ5ZFdVZ2ZUc2lMQ0pjSW5WelpTQnpkSEpwWTNSY0lqdGNibHh1Wlhod2IzSjBjeTVmWDJWelRXOWtkV3hsSUQwZ2RISjFaVHRjYmx4dWRtRnlJRjl3Y205dGFYTmxJRDBnY21WeGRXbHlaU2hjSWk0dUwyTnZjbVV0YW5NdmNISnZiV2x6WlZ3aUtUdGNibHh1ZG1GeUlGOXdjbTl0YVhObE1pQTlJRjlwYm5SbGNtOXdVbVZ4ZFdseVpVUmxabUYxYkhRb1gzQnliMjFwYzJVcE8xeHVYRzVtZFc1amRHbHZiaUJmYVc1MFpYSnZjRkpsY1hWcGNtVkVaV1poZFd4MEtHOWlhaWtnZXlCeVpYUjFjbTRnYjJKcUlDWW1JRzlpYWk1ZlgyVnpUVzlrZFd4bElEOGdiMkpxSURvZ2V5QmtaV1poZFd4ME9pQnZZbW9nZlRzZ2ZWeHVYRzVsZUhCdmNuUnpMbVJsWm1GMWJIUWdQU0JtZFc1amRHbHZiaUFvWm00cElIdGNiaUFnY21WMGRYSnVJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ1oyVnVJRDBnWm00dVlYQndiSGtvZEdocGN5d2dZWEpuZFcxbGJuUnpLVHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRjl3Y205dGFYTmxNaTVrWldaaGRXeDBLR1oxYm1OMGFXOXVJQ2h5WlhOdmJIWmxMQ0J5WldwbFkzUXBJSHRjYmlBZ0lDQWdJR1oxYm1OMGFXOXVJSE4wWlhBb2EyVjVMQ0JoY21jcElIdGNiaUFnSUNBZ0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnYVc1bWJ5QTlJR2RsYmx0clpYbGRLR0Z5WnlrN1hHNGdJQ0FnSUNBZ0lDQWdkbUZ5SUhaaGJIVmxJRDBnYVc1bWJ5NTJZV3gxWlR0Y2JpQWdJQ0FnSUNBZ2ZTQmpZWFJqYUNBb1pYSnliM0lwSUh0Y2JpQWdJQ0FnSUNBZ0lDQnlaV3BsWTNRb1pYSnliM0lwTzF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQWdJR2xtSUNocGJtWnZMbVJ2Ym1VcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhOdmJIWmxLSFpoYkhWbEtUdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdYM0J5YjIxcGMyVXlMbVJsWm1GMWJIUXVjbVZ6YjJ4MlpTaDJZV3gxWlNrdWRHaGxiaWhtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lITjBaWEFvWENKdVpYaDBYQ0lzSUhaaGJIVmxLVHRjYmlBZ0lDQWdJQ0FnSUNCOUxDQm1kVzVqZEdsdmJpQW9aWEp5S1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J6ZEdWd0tGd2lkR2h5YjNkY0lpd2daWEp5S1R0Y2JpQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnYzNSbGNDaGNJbTVsZUhSY0lpazdYRzRnSUNBZ2ZTazdYRzRnSUgwN1hHNTlPeUlzSWx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc1bGVIQnZjblJ6TGw5ZlpYTk5iMlIxYkdVZ1BTQjBjblZsTzF4dVhHNTJZWElnWDJselNYUmxjbUZpYkdVeUlEMGdjbVZ4ZFdseVpTaGNJaTR1TDJOdmNtVXRhbk12YVhNdGFYUmxjbUZpYkdWY0lpazdYRzVjYm5aaGNpQmZhWE5KZEdWeVlXSnNaVE1nUFNCZmFXNTBaWEp2Y0ZKbGNYVnBjbVZFWldaaGRXeDBLRjlwYzBsMFpYSmhZbXhsTWlrN1hHNWNiblpoY2lCZloyVjBTWFJsY21GMGIzSXlJRDBnY21WeGRXbHlaU2hjSWk0dUwyTnZjbVV0YW5NdloyVjBMV2wwWlhKaGRHOXlYQ0lwTzF4dVhHNTJZWElnWDJkbGRFbDBaWEpoZEc5eU15QTlJRjlwYm5SbGNtOXdVbVZ4ZFdseVpVUmxabUYxYkhRb1gyZGxkRWwwWlhKaGRHOXlNaWs3WEc1Y2JtWjFibU4wYVc5dUlGOXBiblJsY205d1VtVnhkV2x5WlVSbFptRjFiSFFvYjJKcUtTQjdJSEpsZEhWeWJpQnZZbW9nSmlZZ2IySnFMbDlmWlhOTmIyUjFiR1VnUHlCdlltb2dPaUI3SUdSbFptRjFiSFE2SUc5aWFpQjlPeUI5WEc1Y2JtVjRjRzl5ZEhNdVpHVm1ZWFZzZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ1puVnVZM1JwYjI0Z2MyeHBZMlZKZEdWeVlYUnZjaWhoY25Jc0lHa3BJSHRjYmlBZ0lDQjJZWElnWDJGeWNpQTlJRnRkTzF4dUlDQWdJSFpoY2lCZmJpQTlJSFJ5ZFdVN1hHNGdJQ0FnZG1GeUlGOWtJRDBnWm1Gc2MyVTdYRzRnSUNBZ2RtRnlJRjlsSUQwZ2RXNWtaV1pwYm1Wa08xeHVYRzRnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJR1p2Y2lBb2RtRnlJRjlwSUQwZ0tEQXNJRjluWlhSSmRHVnlZWFJ2Y2pNdVpHVm1ZWFZzZENrb1lYSnlLU3dnWDNNN0lDRW9YMjRnUFNBb1gzTWdQU0JmYVM1dVpYaDBLQ2twTG1SdmJtVXBPeUJmYmlBOUlIUnlkV1VwSUh0Y2JpQWdJQ0FnSUNBZ1gyRnljaTV3ZFhOb0tGOXpMblpoYkhWbEtUdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2FTQW1KaUJmWVhKeUxteGxibWQwYUNBOVBUMGdhU2tnWW5KbFlXczdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTQmpZWFJqYUNBb1pYSnlLU0I3WEc0Z0lDQWdJQ0JmWkNBOUlIUnlkV1U3WEc0Z0lDQWdJQ0JmWlNBOUlHVnljanRjYmlBZ0lDQjlJR1pwYm1Gc2JIa2dlMXh1SUNBZ0lDQWdkSEo1SUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLQ0ZmYmlBbUppQmZhVnRjSW5KbGRIVnlibHdpWFNrZ1gybGJYQ0p5WlhSMWNtNWNJbDBvS1R0Y2JpQWdJQ0FnSUgwZ1ptbHVZV3hzZVNCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hmWkNrZ2RHaHliM2NnWDJVN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJRjloY25JN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z1puVnVZM1JwYjI0Z0tHRnljaXdnYVNrZ2UxeHVJQ0FnSUdsbUlDaEJjbkpoZVM1cGMwRnljbUY1S0dGeWNpa3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQmhjbkk3WEc0Z0lDQWdmU0JsYkhObElHbG1JQ2dvTUN3Z1gybHpTWFJsY21GaWJHVXpMbVJsWm1GMWJIUXBLRTlpYW1WamRDaGhjbklwS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhOc2FXTmxTWFJsY21GMGIzSW9ZWEp5TENCcEtUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUZSNWNHVkZjbkp2Y2loY0lrbHVkbUZzYVdRZ1lYUjBaVzF3ZENCMGJ5QmtaWE4wY25WamRIVnlaU0J1YjI0dGFYUmxjbUZpYkdVZ2FXNXpkR0Z1WTJWY0lpazdYRzRnSUNBZ2ZWeHVJQ0I5TzF4dWZTZ3BPeUlzSW0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnY21WeGRXbHlaU2hjSW5KbFoyVnVaWEpoZEc5eUxYSjFiblJwYldWY0lpazdYRzRpTENKeVpYRjFhWEpsS0NjdUxpOXRiMlIxYkdWekwzZGxZaTVrYjIwdWFYUmxjbUZpYkdVbktUdGNibkpsY1hWcGNtVW9KeTR1TDIxdlpIVnNaWE12WlhNMkxuTjBjbWx1Wnk1cGRHVnlZWFJ2Y2ljcE8xeHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnlaWEYxYVhKbEtDY3VMaTl0YjJSMWJHVnpMMk52Y21VdVoyVjBMV2wwWlhKaGRHOXlKeWs3WEc0aUxDSnlaWEYxYVhKbEtDY3VMaTl0YjJSMWJHVnpMM2RsWWk1a2IyMHVhWFJsY21GaWJHVW5LVHRjYm5KbGNYVnBjbVVvSnk0dUwyMXZaSFZzWlhNdlpYTTJMbk4wY21sdVp5NXBkR1Z5WVhSdmNpY3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5WlhGMWFYSmxLQ2N1TGk5dGIyUjFiR1Z6TDJOdmNtVXVhWE10YVhSbGNtRmliR1VuS1R0Y2JpSXNJbkpsY1hWcGNtVW9KeTR1TDIxdlpIVnNaWE12WlhNMkxtOWlhbVZqZEM1MGJ5MXpkSEpwYm1jbktUdGNibkpsY1hWcGNtVW9KeTR1TDIxdlpIVnNaWE12WlhNMkxuTjBjbWx1Wnk1cGRHVnlZWFJ2Y2ljcE8xeHVjbVZ4ZFdseVpTZ25MaTR2Ylc5a2RXeGxjeTkzWldJdVpHOXRMbWwwWlhKaFlteGxKeWs3WEc1eVpYRjFhWEpsS0NjdUxpOXRiMlIxYkdWekwyVnpOaTV3Y205dGFYTmxKeWs3WEc1eVpYRjFhWEpsS0NjdUxpOXRiMlIxYkdWekwyVnpOeTV3Y205dGFYTmxMbVpwYm1Gc2JIa25LVHRjYm5KbGNYVnBjbVVvSnk0dUwyMXZaSFZzWlhNdlpYTTNMbkJ5YjIxcGMyVXVkSEo1SnlrN1hHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlISmxjWFZwY21Vb0p5NHVMMjF2WkhWc1pYTXZYMk52Y21VbktTNVFjbTl0YVhObE8xeHVJaXdpYlc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtZFc1amRHbHZiaUFvYVhRcElIdGNiaUFnYVdZZ0tIUjVjR1Z2WmlCcGRDQWhQU0FuWm5WdVkzUnBiMjRuS1NCMGFISnZkeUJVZVhCbFJYSnliM0lvYVhRZ0t5QW5JR2x6SUc1dmRDQmhJR1oxYm1OMGFXOXVJU2NwTzF4dUlDQnlaWFIxY200Z2FYUTdYRzU5TzF4dUlpd2liVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpQW9LU0I3SUM4cUlHVnRjSFI1SUNvdklIMDdYRzRpTENKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNocGRDd2dRMjl1YzNSeWRXTjBiM0lzSUc1aGJXVXNJR1p2Y21KcFpHUmxia1pwWld4a0tTQjdYRzRnSUdsbUlDZ2hLR2wwSUdsdWMzUmhibU5sYjJZZ1EyOXVjM1J5ZFdOMGIzSXBJSHg4SUNobWIzSmlhV1JrWlc1R2FXVnNaQ0FoUFQwZ2RXNWtaV1pwYm1Wa0lDWW1JR1p2Y21KcFpHUmxia1pwWld4a0lHbHVJR2wwS1NrZ2UxeHVJQ0FnSUhSb2NtOTNJRlI1Y0dWRmNuSnZjaWh1WVcxbElDc2dKem9nYVc1amIzSnlaV04wSUdsdWRtOWpZWFJwYjI0aEp5azdYRzRnSUgwZ2NtVjBkWEp1SUdsME8xeHVmVHRjYmlJc0luWmhjaUJwYzA5aWFtVmpkQ0E5SUhKbGNYVnBjbVVvSnk0dlgybHpMVzlpYW1WamRDY3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtZFc1amRHbHZiaUFvYVhRcElIdGNiaUFnYVdZZ0tDRnBjMDlpYW1WamRDaHBkQ2twSUhSb2NtOTNJRlI1Y0dWRmNuSnZjaWhwZENBcklDY2dhWE1nYm05MElHRnVJRzlpYW1WamRDRW5LVHRjYmlBZ2NtVjBkWEp1SUdsME8xeHVmVHRjYmlJc0lpOHZJR1poYkhObElDMCtJRUZ5Y21GNUkybHVaR1Y0VDJaY2JpOHZJSFJ5ZFdVZ0lDMCtJRUZ5Y21GNUkybHVZMngxWkdWelhHNTJZWElnZEc5SlQySnFaV04wSUQwZ2NtVnhkV2x5WlNnbkxpOWZkRzh0YVc5aWFtVmpkQ2NwTzF4dWRtRnlJSFJ2VEdWdVozUm9JRDBnY21WeGRXbHlaU2duTGk5ZmRHOHRiR1Z1WjNSb0p5azdYRzUyWVhJZ2RHOUJZbk52YkhWMFpVbHVaR1Y0SUQwZ2NtVnhkV2x5WlNnbkxpOWZkRzh0WVdKemIyeDFkR1V0YVc1a1pYZ25LVHRjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm5WdVkzUnBiMjRnS0VsVFgwbE9RMHhWUkVWVEtTQjdYRzRnSUhKbGRIVnliaUJtZFc1amRHbHZiaUFvSkhSb2FYTXNJR1ZzTENCbWNtOXRTVzVrWlhncElIdGNiaUFnSUNCMllYSWdUeUE5SUhSdlNVOWlhbVZqZENna2RHaHBjeWs3WEc0Z0lDQWdkbUZ5SUd4bGJtZDBhQ0E5SUhSdlRHVnVaM1JvS0U4dWJHVnVaM1JvS1R0Y2JpQWdJQ0IyWVhJZ2FXNWtaWGdnUFNCMGIwRmljMjlzZFhSbFNXNWtaWGdvWm5KdmJVbHVaR1Y0TENCc1pXNW5kR2dwTzF4dUlDQWdJSFpoY2lCMllXeDFaVHRjYmlBZ0lDQXZMeUJCY25KaGVTTnBibU5zZFdSbGN5QjFjMlZ6SUZOaGJXVldZV3gxWlZwbGNtOGdaWEYxWVd4cGRIa2dZV3huYjNKcGRHaHRYRzRnSUNBZ0x5OGdaWE5zYVc1MExXUnBjMkZpYkdVdGJtVjRkQzFzYVc1bElHNXZMWE5sYkdZdFkyOXRjR0Z5WlZ4dUlDQWdJR2xtSUNoSlUxOUpUa05NVlVSRlV5QW1KaUJsYkNBaFBTQmxiQ2tnZDJocGJHVWdLR3hsYm1kMGFDQStJR2x1WkdWNEtTQjdYRzRnSUNBZ0lDQjJZV3gxWlNBOUlFOWJhVzVrWlhncksxMDdYRzRnSUNBZ0lDQXZMeUJsYzJ4cGJuUXRaR2x6WVdKc1pTMXVaWGgwTFd4cGJtVWdibTh0YzJWc1ppMWpiMjF3WVhKbFhHNGdJQ0FnSUNCcFppQW9kbUZzZFdVZ0lUMGdkbUZzZFdVcElISmxkSFZ5YmlCMGNuVmxPMXh1SUNBZ0lDOHZJRUZ5Y21GNUkybHVaR1Y0VDJZZ2FXZHViM0psY3lCb2IyeGxjeXdnUVhKeVlYa2phVzVqYkhWa1pYTWdMU0J1YjNSY2JpQWdJQ0I5SUdWc2MyVWdabTl5SUNnN2JHVnVaM1JvSUQ0Z2FXNWtaWGc3SUdsdVpHVjRLeXNwSUdsbUlDaEpVMTlKVGtOTVZVUkZVeUI4ZkNCcGJtUmxlQ0JwYmlCUEtTQjdYRzRnSUNBZ0lDQnBaaUFvVDF0cGJtUmxlRjBnUFQwOUlHVnNLU0J5WlhSMWNtNGdTVk5mU1U1RFRGVkVSVk1nZkh3Z2FXNWtaWGdnZkh3Z01EdGNiaUFnSUNCOUlISmxkSFZ5YmlBaFNWTmZTVTVEVEZWRVJWTWdKaVlnTFRFN1hHNGdJSDA3WEc1OU8xeHVJaXdpTHk4Z1oyVjBkR2x1WnlCMFlXY2dabkp2YlNBeE9TNHhMak11TmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuS0NsY2JuWmhjaUJqYjJZZ1BTQnlaWEYxYVhKbEtDY3VMMTlqYjJZbktUdGNiblpoY2lCVVFVY2dQU0J5WlhGMWFYSmxLQ2N1TDE5M2EzTW5LU2duZEc5VGRISnBibWRVWVdjbktUdGNiaTh2SUVWVE15QjNjbTl1WnlCb1pYSmxYRzUyWVhJZ1FWSkhJRDBnWTI5bUtHWjFibU4wYVc5dUlDZ3BJSHNnY21WMGRYSnVJR0Z5WjNWdFpXNTBjenNnZlNncEtTQTlQU0FuUVhKbmRXMWxiblJ6Snp0Y2JseHVMeThnWm1Gc2JHSmhZMnNnWm05eUlFbEZNVEVnVTJOeWFYQjBJRUZqWTJWemN5QkVaVzVwWldRZ1pYSnliM0pjYm5aaGNpQjBjbmxIWlhRZ1BTQm1kVzVqZEdsdmJpQW9hWFFzSUd0bGVTa2dlMXh1SUNCMGNua2dlMXh1SUNBZ0lISmxkSFZ5YmlCcGRGdHJaWGxkTzF4dUlDQjlJR05oZEdOb0lDaGxLU0I3SUM4cUlHVnRjSFI1SUNvdklIMWNibjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0Z0tHbDBLU0I3WEc0Z0lIWmhjaUJQTENCVUxDQkNPMXh1SUNCeVpYUjFjbTRnYVhRZ1BUMDlJSFZ1WkdWbWFXNWxaQ0EvSUNkVmJtUmxabWx1WldRbklEb2dhWFFnUFQwOUlHNTFiR3dnUHlBblRuVnNiQ2RjYmlBZ0lDQXZMeUJBUUhSdlUzUnlhVzVuVkdGbklHTmhjMlZjYmlBZ0lDQTZJSFI1Y0dWdlppQW9WQ0E5SUhSeWVVZGxkQ2hQSUQwZ1QySnFaV04wS0dsMEtTd2dWRUZIS1NrZ1BUMGdKM04wY21sdVp5Y2dQeUJVWEc0Z0lDQWdMeThnWW5WcGJIUnBibFJoWnlCallYTmxYRzRnSUNBZ09pQkJVa2NnUHlCamIyWW9UeWxjYmlBZ0lDQXZMeUJGVXpNZ1lYSm5kVzFsYm5SeklHWmhiR3hpWVdOclhHNGdJQ0FnT2lBb1FpQTlJR052WmloUEtTa2dQVDBnSjA5aWFtVmpkQ2NnSmlZZ2RIbHdaVzltSUU4dVkyRnNiR1ZsSUQwOUlDZG1kVzVqZEdsdmJpY2dQeUFuUVhKbmRXMWxiblJ6SnlBNklFSTdYRzU5TzF4dUlpd2lkbUZ5SUhSdlUzUnlhVzVuSUQwZ2UzMHVkRzlUZEhKcGJtYzdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm5WdVkzUnBiMjRnS0dsMEtTQjdYRzRnSUhKbGRIVnliaUIwYjFOMGNtbHVaeTVqWVd4c0tHbDBLUzV6YkdsalpTZzRMQ0F0TVNrN1hHNTlPMXh1SWl3aWRtRnlJR052Y21VZ1BTQnRiMlIxYkdVdVpYaHdiM0owY3lBOUlIc2dkbVZ5YzJsdmJqb2dKekl1Tmk0eE1TY2dmVHRjYm1sbUlDaDBlWEJsYjJZZ1gxOWxJRDA5SUNkdWRXMWlaWEluS1NCZlgyVWdQU0JqYjNKbE95QXZMeUJsYzJ4cGJuUXRaR2x6WVdKc1pTMXNhVzVsSUc1dkxYVnVaR1ZtWEc0aUxDSXZMeUJ2Y0hScGIyNWhiQ0F2SUhOcGJYQnNaU0JqYjI1MFpYaDBJR0pwYm1ScGJtZGNiblpoY2lCaFJuVnVZM1JwYjI0Z1BTQnlaWEYxYVhKbEtDY3VMMTloTFdaMWJtTjBhVzl1SnlrN1hHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWjFibU4wYVc5dUlDaG1iaXdnZEdoaGRDd2diR1Z1WjNSb0tTQjdYRzRnSUdGR2RXNWpkR2x2YmlobWJpazdYRzRnSUdsbUlDaDBhR0YwSUQwOVBTQjFibVJsWm1sdVpXUXBJSEpsZEhWeWJpQm1ianRjYmlBZ2MzZHBkR05vSUNoc1pXNW5kR2dwSUh0Y2JpQWdJQ0JqWVhObElERTZJSEpsZEhWeWJpQm1kVzVqZEdsdmJpQW9ZU2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1p1TG1OaGJHd29kR2hoZEN3Z1lTazdYRzRnSUNBZ2ZUdGNiaUFnSUNCallYTmxJREk2SUhKbGRIVnliaUJtZFc1amRHbHZiaUFvWVN3Z1lpa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWnVMbU5oYkd3b2RHaGhkQ3dnWVN3Z1lpazdYRzRnSUNBZ2ZUdGNiaUFnSUNCallYTmxJRE02SUhKbGRIVnliaUJtZFc1amRHbHZiaUFvWVN3Z1lpd2dZeWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR1p1TG1OaGJHd29kR2hoZEN3Z1lTd2dZaXdnWXlrN1hHNGdJQ0FnZlR0Y2JpQWdmVnh1SUNCeVpYUjFjbTRnWm5WdVkzUnBiMjRnS0M4cUlDNHVMbUZ5WjNNZ0tpOHBJSHRjYmlBZ0lDQnlaWFIxY200Z1ptNHVZWEJ3Ykhrb2RHaGhkQ3dnWVhKbmRXMWxiblJ6S1R0Y2JpQWdmVHRjYm4wN1hHNGlMQ0l2THlBM0xqSXVNU0JTWlhGMWFYSmxUMkpxWldOMFEyOWxjbU5wWW14bEtHRnlaM1Z0Wlc1MEtWeHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpQW9hWFFwSUh0Y2JpQWdhV1lnS0dsMElEMDlJSFZ1WkdWbWFXNWxaQ2tnZEdoeWIzY2dWSGx3WlVWeWNtOXlLRndpUTJGdUozUWdZMkZzYkNCdFpYUm9iMlFnYjI0Z0lGd2lJQ3NnYVhRcE8xeHVJQ0J5WlhSMWNtNGdhWFE3WEc1OU8xeHVJaXdpTHk4Z1ZHaGhibXNuY3lCSlJUZ2dabTl5SUdocGN5Qm1kVzV1ZVNCa1pXWnBibVZRY205d1pYSjBlVnh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0FoY21WeGRXbHlaU2duTGk5ZlptRnBiSE1uS1NobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUhKbGRIVnliaUJQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb2UzMHNJQ2RoSnl3Z2V5Qm5aWFE2SUdaMWJtTjBhVzl1SUNncElIc2djbVYwZFhKdUlEYzdJSDBnZlNrdVlTQWhQU0EzTzF4dWZTazdYRzRpTENKMllYSWdhWE5QWW1wbFkzUWdQU0J5WlhGMWFYSmxLQ2N1TDE5cGN5MXZZbXBsWTNRbktUdGNiblpoY2lCa2IyTjFiV1Z1ZENBOUlISmxjWFZwY21Vb0p5NHZYMmRzYjJKaGJDY3BMbVJ2WTNWdFpXNTBPMXh1THk4Z2RIbHdaVzltSUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUWdhWE1nSjI5aWFtVmpkQ2NnYVc0Z2IyeGtJRWxGWEc1MllYSWdhWE1nUFNCcGMwOWlhbVZqZENoa2IyTjFiV1Z1ZENrZ0ppWWdhWE5QWW1wbFkzUW9aRzlqZFcxbGJuUXVZM0psWVhSbFJXeGxiV1Z1ZENrN1hHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWjFibU4wYVc5dUlDaHBkQ2tnZTF4dUlDQnlaWFIxY200Z2FYTWdQeUJrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MEtHbDBLU0E2SUh0OU8xeHVmVHRjYmlJc0lpOHZJRWxGSURndElHUnZiaWQwSUdWdWRXMGdZblZuSUd0bGVYTmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdLRnh1SUNBblkyOXVjM1J5ZFdOMGIzSXNhR0Z6VDNkdVVISnZjR1Z5ZEhrc2FYTlFjbTkwYjNSNWNHVlBaaXh3Y205d1pYSjBlVWx6Ulc1MWJXVnlZV0pzWlN4MGIweHZZMkZzWlZOMGNtbHVaeXgwYjFOMGNtbHVaeXgyWVd4MVpVOW1KMXh1S1M1emNHeHBkQ2duTENjcE8xeHVJaXdpZG1GeUlHZHNiMkpoYkNBOUlISmxjWFZwY21Vb0p5NHZYMmRzYjJKaGJDY3BPMXh1ZG1GeUlHTnZjbVVnUFNCeVpYRjFhWEpsS0NjdUwxOWpiM0psSnlrN1hHNTJZWElnWTNSNElEMGdjbVZ4ZFdseVpTZ25MaTlmWTNSNEp5azdYRzUyWVhJZ2FHbGtaU0E5SUhKbGNYVnBjbVVvSnk0dlgyaHBaR1VuS1R0Y2JuWmhjaUJvWVhNZ1BTQnlaWEYxYVhKbEtDY3VMMTlvWVhNbktUdGNiblpoY2lCUVVrOVVUMVJaVUVVZ1BTQW5jSEp2ZEc5MGVYQmxKenRjYmx4dWRtRnlJQ1JsZUhCdmNuUWdQU0JtZFc1amRHbHZiaUFvZEhsd1pTd2dibUZ0WlN3Z2MyOTFjbU5sS1NCN1hHNGdJSFpoY2lCSlUxOUdUMUpEUlVRZ1BTQjBlWEJsSUNZZ0pHVjRjRzl5ZEM1R08xeHVJQ0IyWVhJZ1NWTmZSMHhQUWtGTUlEMGdkSGx3WlNBbUlDUmxlSEJ2Y25RdVJ6dGNiaUFnZG1GeUlFbFRYMU5VUVZSSlF5QTlJSFI1Y0dVZ0ppQWtaWGh3YjNKMExsTTdYRzRnSUhaaGNpQkpVMTlRVWs5VVR5QTlJSFI1Y0dVZ0ppQWtaWGh3YjNKMExsQTdYRzRnSUhaaGNpQkpVMTlDU1U1RUlEMGdkSGx3WlNBbUlDUmxlSEJ2Y25RdVFqdGNiaUFnZG1GeUlFbFRYMWRTUVZBZ1BTQjBlWEJsSUNZZ0pHVjRjRzl5ZEM1WE8xeHVJQ0IyWVhJZ1pYaHdiM0owY3lBOUlFbFRYMGRNVDBKQlRDQS9JR052Y21VZ09pQmpiM0psVzI1aGJXVmRJSHg4SUNoamIzSmxXMjVoYldWZElEMGdlMzBwTzF4dUlDQjJZWElnWlhod1VISnZkRzhnUFNCbGVIQnZjblJ6VzFCU1QxUlBWRmxRUlYwN1hHNGdJSFpoY2lCMFlYSm5aWFFnUFNCSlUxOUhURTlDUVV3Z1B5Qm5iRzlpWVd3Z09pQkpVMTlUVkVGVVNVTWdQeUJuYkc5aVlXeGJibUZ0WlYwZ09pQW9aMnh2WW1Gc1cyNWhiV1ZkSUh4OElIdDlLVnRRVWs5VVQxUlpVRVZkTzF4dUlDQjJZWElnYTJWNUxDQnZkMjRzSUc5MWREdGNiaUFnYVdZZ0tFbFRYMGRNVDBKQlRDa2djMjkxY21ObElEMGdibUZ0WlR0Y2JpQWdabTl5SUNoclpYa2dhVzRnYzI5MWNtTmxLU0I3WEc0Z0lDQWdMeThnWTI5dWRHRnBibk1nYVc0Z2JtRjBhWFpsWEc0Z0lDQWdiM2R1SUQwZ0lVbFRYMFpQVWtORlJDQW1KaUIwWVhKblpYUWdKaVlnZEdGeVoyVjBXMnRsZVYwZ0lUMDlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQnBaaUFvYjNkdUlDWW1JR2hoY3lobGVIQnZjblJ6TENCclpYa3BLU0JqYjI1MGFXNTFaVHRjYmlBZ0lDQXZMeUJsZUhCdmNuUWdibUYwYVhabElHOXlJSEJoYzNObFpGeHVJQ0FnSUc5MWRDQTlJRzkzYmlBL0lIUmhjbWRsZEZ0clpYbGRJRG9nYzI5MWNtTmxXMnRsZVYwN1hHNGdJQ0FnTHk4Z2NISmxkbVZ1ZENCbmJHOWlZV3dnY0c5c2JIVjBhVzl1SUdadmNpQnVZVzFsYzNCaFkyVnpYRzRnSUNBZ1pYaHdiM0owYzF0clpYbGRJRDBnU1ZOZlIweFBRa0ZNSUNZbUlIUjVjR1Z2WmlCMFlYSm5aWFJiYTJWNVhTQWhQU0FuWm5WdVkzUnBiMjRuSUQ4Z2MyOTFjbU5sVzJ0bGVWMWNiaUFnSUNBdkx5QmlhVzVrSUhScGJXVnljeUIwYnlCbmJHOWlZV3dnWm05eUlHTmhiR3dnWm5KdmJTQmxlSEJ2Y25RZ1kyOXVkR1Y0ZEZ4dUlDQWdJRG9nU1ZOZlFrbE9SQ0FtSmlCdmQyNGdQeUJqZEhnb2IzVjBMQ0JuYkc5aVlXd3BYRzRnSUNBZ0x5OGdkM0poY0NCbmJHOWlZV3dnWTI5dWMzUnlkV04wYjNKeklHWnZjaUJ3Y21WMlpXNTBJR05vWVc1blpTQjBhR1Z0SUdsdUlHeHBZbkpoY25sY2JpQWdJQ0E2SUVsVFgxZFNRVkFnSmlZZ2RHRnlaMlYwVzJ0bGVWMGdQVDBnYjNWMElEOGdLR1oxYm1OMGFXOXVJQ2hES1NCN1hHNGdJQ0FnSUNCMllYSWdSaUE5SUdaMWJtTjBhVzl1SUNoaExDQmlMQ0JqS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2gwYUdseklHbHVjM1JoYm1ObGIyWWdReWtnZTF4dUlDQWdJQ0FnSUNBZ0lITjNhWFJqYUNBb1lYSm5kVzFsYm5SekxteGxibWQwYUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnWTJGelpTQXdPaUJ5WlhSMWNtNGdibVYzSUVNb0tUdGNiaUFnSUNBZ0lDQWdJQ0FnSUdOaGMyVWdNVG9nY21WMGRYSnVJRzVsZHlCREtHRXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ1kyRnpaU0F5T2lCeVpYUjFjbTRnYm1WM0lFTW9ZU3dnWWlrN1hHNGdJQ0FnSUNBZ0lDQWdmU0J5WlhSMWNtNGdibVYzSUVNb1lTd2dZaXdnWXlrN1hHNGdJQ0FnSUNBZ0lIMGdjbVYwZFhKdUlFTXVZWEJ3Ykhrb2RHaHBjeXdnWVhKbmRXMWxiblJ6S1R0Y2JpQWdJQ0FnSUgwN1hHNGdJQ0FnSUNCR1cxQlNUMVJQVkZsUVJWMGdQU0JEVzFCU1QxUlBWRmxRUlYwN1hHNGdJQ0FnSUNCeVpYUjFjbTRnUmp0Y2JpQWdJQ0F2THlCdFlXdGxJSE4wWVhScFl5QjJaWEp6YVc5dWN5Qm1iM0lnY0hKdmRHOTBlWEJsSUcxbGRHaHZaSE5jYmlBZ0lDQjlLU2h2ZFhRcElEb2dTVk5mVUZKUFZFOGdKaVlnZEhsd1pXOW1JRzkxZENBOVBTQW5ablZ1WTNScGIyNG5JRDhnWTNSNEtFWjFibU4wYVc5dUxtTmhiR3dzSUc5MWRDa2dPaUJ2ZFhRN1hHNGdJQ0FnTHk4Z1pYaHdiM0owSUhCeWIzUnZJRzFsZEdodlpITWdkRzhnWTI5eVpTNGxRMDlPVTFSU1ZVTlVUMUlsTG0xbGRHaHZaSE11SlU1QlRVVWxYRzRnSUNBZ2FXWWdLRWxUWDFCU1QxUlBLU0I3WEc0Z0lDQWdJQ0FvWlhod2IzSjBjeTUyYVhKMGRXRnNJSHg4SUNobGVIQnZjblJ6TG5acGNuUjFZV3dnUFNCN2ZTa3BXMnRsZVYwZ1BTQnZkWFE3WEc0Z0lDQWdJQ0F2THlCbGVIQnZjblFnY0hKdmRHOGdiV1YwYUc5a2N5QjBieUJqYjNKbExpVkRUMDVUVkZKVlExUlBVaVV1Y0hKdmRHOTBlWEJsTGlWT1FVMUZKVnh1SUNBZ0lDQWdhV1lnS0hSNWNHVWdKaUFrWlhod2IzSjBMbElnSmlZZ1pYaHdVSEp2ZEc4Z0ppWWdJV1Y0Y0ZCeWIzUnZXMnRsZVYwcElHaHBaR1VvWlhod1VISnZkRzhzSUd0bGVTd2diM1YwS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibjA3WEc0dkx5QjBlWEJsSUdKcGRHMWhjRnh1SkdWNGNHOXlkQzVHSUQwZ01Uc2dJQ0F2THlCbWIzSmpaV1JjYmlSbGVIQnZjblF1UnlBOUlESTdJQ0FnTHk4Z1oyeHZZbUZzWEc0a1pYaHdiM0owTGxNZ1BTQTBPeUFnSUM4dklITjBZWFJwWTF4dUpHVjRjRzl5ZEM1UUlEMGdPRHNnSUNBdkx5QndjbTkwYjF4dUpHVjRjRzl5ZEM1Q0lEMGdNVFk3SUNBdkx5QmlhVzVrWEc0a1pYaHdiM0owTGxjZ1BTQXpNanNnSUM4dklIZHlZWEJjYmlSbGVIQnZjblF1VlNBOUlEWTBPeUFnTHk4Z2MyRm1aVnh1SkdWNGNHOXlkQzVTSUQwZ01USTRPeUF2THlCeVpXRnNJSEJ5YjNSdklHMWxkR2h2WkNCbWIzSWdZR3hwWW5KaGNubGdYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJQ1JsZUhCdmNuUTdYRzRpTENKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNobGVHVmpLU0I3WEc0Z0lIUnllU0I3WEc0Z0lDQWdjbVYwZFhKdUlDRWhaWGhsWXlncE8xeHVJQ0I5SUdOaGRHTm9JQ2hsS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJ5ZFdVN1hHNGdJSDFjYm4wN1hHNGlMQ0oyWVhJZ1kzUjRJRDBnY21WeGRXbHlaU2duTGk5ZlkzUjRKeWs3WEc1MllYSWdZMkZzYkNBOUlISmxjWFZwY21Vb0p5NHZYMmwwWlhJdFkyRnNiQ2NwTzF4dWRtRnlJR2x6UVhKeVlYbEpkR1Z5SUQwZ2NtVnhkV2x5WlNnbkxpOWZhWE10WVhKeVlYa3RhWFJsY2ljcE8xeHVkbUZ5SUdGdVQySnFaV04wSUQwZ2NtVnhkV2x5WlNnbkxpOWZZVzR0YjJKcVpXTjBKeWs3WEc1MllYSWdkRzlNWlc1bmRHZ2dQU0J5WlhGMWFYSmxLQ2N1TDE5MGJ5MXNaVzVuZEdnbktUdGNiblpoY2lCblpYUkpkR1Z5Um00Z1BTQnlaWEYxYVhKbEtDY3VMMk52Y21VdVoyVjBMV2wwWlhKaGRHOXlMVzFsZEdodlpDY3BPMXh1ZG1GeUlFSlNSVUZMSUQwZ2UzMDdYRzUyWVhJZ1VrVlVWVkpPSUQwZ2UzMDdYRzUyWVhJZ1pYaHdiM0owY3lBOUlHMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0Z0tHbDBaWEpoWW14bExDQmxiblJ5YVdWekxDQm1iaXdnZEdoaGRDd2dTVlJGVWtGVVQxSXBJSHRjYmlBZ2RtRnlJR2wwWlhKR2JpQTlJRWxVUlZKQlZFOVNJRDhnWm5WdVkzUnBiMjRnS0NrZ2V5QnlaWFIxY200Z2FYUmxjbUZpYkdVN0lIMGdPaUJuWlhSSmRHVnlSbTRvYVhSbGNtRmliR1VwTzF4dUlDQjJZWElnWmlBOUlHTjBlQ2htYml3Z2RHaGhkQ3dnWlc1MGNtbGxjeUEvSURJZ09pQXhLVHRjYmlBZ2RtRnlJR2x1WkdWNElEMGdNRHRjYmlBZ2RtRnlJR3hsYm1kMGFDd2djM1JsY0N3Z2FYUmxjbUYwYjNJc0lISmxjM1ZzZER0Y2JpQWdhV1lnS0hSNWNHVnZaaUJwZEdWeVJtNGdJVDBnSjJaMWJtTjBhVzl1SnlrZ2RHaHliM2NnVkhsd1pVVnljbTl5S0dsMFpYSmhZbXhsSUNzZ0p5QnBjeUJ1YjNRZ2FYUmxjbUZpYkdVaEp5azdYRzRnSUM4dklHWmhjM1FnWTJGelpTQm1iM0lnWVhKeVlYbHpJSGRwZEdnZ1pHVm1ZWFZzZENCcGRHVnlZWFJ2Y2x4dUlDQnBaaUFvYVhOQmNuSmhlVWwwWlhJb2FYUmxja1p1S1NrZ1ptOXlJQ2hzWlc1bmRHZ2dQU0IwYjB4bGJtZDBhQ2hwZEdWeVlXSnNaUzVzWlc1bmRHZ3BPeUJzWlc1bmRHZ2dQaUJwYm1SbGVEc2dhVzVrWlhnckt5a2dlMXh1SUNBZ0lISmxjM1ZzZENBOUlHVnVkSEpwWlhNZ1B5Qm1LR0Z1VDJKcVpXTjBLSE4wWlhBZ1BTQnBkR1Z5WVdKc1pWdHBibVJsZUYwcFd6QmRMQ0J6ZEdWd1d6RmRLU0E2SUdZb2FYUmxjbUZpYkdWYmFXNWtaWGhkS1R0Y2JpQWdJQ0JwWmlBb2NtVnpkV3gwSUQwOVBTQkNVa1ZCU3lCOGZDQnlaWE4xYkhRZ1BUMDlJRkpGVkZWU1Rpa2djbVYwZFhKdUlISmxjM1ZzZER0Y2JpQWdmU0JsYkhObElHWnZjaUFvYVhSbGNtRjBiM0lnUFNCcGRHVnlSbTR1WTJGc2JDaHBkR1Z5WVdKc1pTazdJQ0VvYzNSbGNDQTlJR2wwWlhKaGRHOXlMbTVsZUhRb0tTa3VaRzl1WlRzcElIdGNiaUFnSUNCeVpYTjFiSFFnUFNCallXeHNLR2wwWlhKaGRHOXlMQ0JtTENCemRHVndMblpoYkhWbExDQmxiblJ5YVdWektUdGNiaUFnSUNCcFppQW9jbVZ6ZFd4MElEMDlQU0JDVWtWQlN5QjhmQ0J5WlhOMWJIUWdQVDA5SUZKRlZGVlNUaWtnY21WMGRYSnVJSEpsYzNWc2REdGNiaUFnZlZ4dWZUdGNibVY0Y0c5eWRITXVRbEpGUVVzZ1BTQkNVa1ZCU3p0Y2JtVjRjRzl5ZEhNdVVrVlVWVkpPSUQwZ1VrVlVWVkpPTzF4dUlpd2lMeThnYUhSMGNITTZMeTluYVhSb2RXSXVZMjl0TDNwc2IybHliMk5yTDJOdmNtVXRhbk12YVhOemRXVnpMemcySTJsemMzVmxZMjl0YldWdWRDMHhNVFUzTlRrd01qaGNiblpoY2lCbmJHOWlZV3dnUFNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhSNWNHVnZaaUIzYVc1a2IzY2dJVDBnSjNWdVpHVm1hVzVsWkNjZ0ppWWdkMmx1Wkc5M0xrMWhkR2dnUFQwZ1RXRjBhRnh1SUNBL0lIZHBibVJ2ZHlBNklIUjVjR1Z2WmlCelpXeG1JQ0U5SUNkMWJtUmxabWx1WldRbklDWW1JSE5sYkdZdVRXRjBhQ0E5UFNCTllYUm9JRDhnYzJWc1pseHVJQ0F2THlCbGMyeHBiblF0WkdsellXSnNaUzF1WlhoMExXeHBibVVnYm04dGJtVjNMV1oxYm1OY2JpQWdPaUJHZFc1amRHbHZiaWduY21WMGRYSnVJSFJvYVhNbktTZ3BPMXh1YVdZZ0tIUjVjR1Z2WmlCZlgyY2dQVDBnSjI1MWJXSmxjaWNwSUY5Zlp5QTlJR2RzYjJKaGJEc2dMeThnWlhOc2FXNTBMV1JwYzJGaWJHVXRiR2x1WlNCdWJ5MTFibVJsWmx4dUlpd2lkbUZ5SUdoaGMwOTNibEJ5YjNCbGNuUjVJRDBnZTMwdWFHRnpUM2R1VUhKdmNHVnlkSGs3WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNocGRDd2dhMlY1S1NCN1hHNGdJSEpsZEhWeWJpQm9ZWE5QZDI1UWNtOXdaWEowZVM1allXeHNLR2wwTENCclpYa3BPMXh1ZlR0Y2JpSXNJblpoY2lCa1VDQTlJSEpsY1hWcGNtVW9KeTR2WDI5aWFtVmpkQzFrY0NjcE8xeHVkbUZ5SUdOeVpXRjBaVVJsYzJNZ1BTQnlaWEYxYVhKbEtDY3VMMTl3Y205d1pYSjBlUzFrWlhOakp5azdYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJSEpsY1hWcGNtVW9KeTR2WDJSbGMyTnlhWEIwYjNKekp5a2dQeUJtZFc1amRHbHZiaUFvYjJKcVpXTjBMQ0JyWlhrc0lIWmhiSFZsS1NCN1hHNGdJSEpsZEhWeWJpQmtVQzVtS0c5aWFtVmpkQ3dnYTJWNUxDQmpjbVZoZEdWRVpYTmpLREVzSUhaaGJIVmxLU2s3WEc1OUlEb2dablZ1WTNScGIyNGdLRzlpYW1WamRDd2dhMlY1TENCMllXeDFaU2tnZTF4dUlDQnZZbXBsWTNSYmEyVjVYU0E5SUhaaGJIVmxPMXh1SUNCeVpYUjFjbTRnYjJKcVpXTjBPMXh1ZlR0Y2JpSXNJblpoY2lCa2IyTjFiV1Z1ZENBOUlISmxjWFZwY21Vb0p5NHZYMmRzYjJKaGJDY3BMbVJ2WTNWdFpXNTBPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JrYjJOMWJXVnVkQ0FtSmlCa2IyTjFiV1Z1ZEM1a2IyTjFiV1Z1ZEVWc1pXMWxiblE3WEc0aUxDSnRiMlIxYkdVdVpYaHdiM0owY3lBOUlDRnlaWEYxYVhKbEtDY3VMMTlrWlhOamNtbHdkRzl5Y3ljcElDWW1JQ0Z5WlhGMWFYSmxLQ2N1TDE5bVlXbHNjeWNwS0daMWJtTjBhVzl1SUNncElIdGNiaUFnY21WMGRYSnVJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoeVpYRjFhWEpsS0NjdUwxOWtiMjB0WTNKbFlYUmxKeWtvSjJScGRpY3BMQ0FuWVNjc0lIc2daMlYwT2lCbWRXNWpkR2x2YmlBb0tTQjdJSEpsZEhWeWJpQTNPeUI5SUgwcExtRWdJVDBnTnp0Y2JuMHBPMXh1SWl3aUx5OGdabUZ6ZENCaGNIQnNlU3dnYUhSMGNEb3ZMMnB6Y0dWeVppNXNibXRwZEM1amIyMHZabUZ6ZEMxaGNIQnNlUzgxWEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNobWJpd2dZWEpuY3l3Z2RHaGhkQ2tnZTF4dUlDQjJZWElnZFc0Z1BTQjBhR0YwSUQwOVBTQjFibVJsWm1sdVpXUTdYRzRnSUhOM2FYUmphQ0FvWVhKbmN5NXNaVzVuZEdncElIdGNiaUFnSUNCallYTmxJREE2SUhKbGRIVnliaUIxYmlBL0lHWnVLQ2xjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQTZJR1p1TG1OaGJHd29kR2hoZENrN1hHNGdJQ0FnWTJGelpTQXhPaUJ5WlhSMWNtNGdkVzRnUHlCbWJpaGhjbWR6V3pCZEtWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSURvZ1ptNHVZMkZzYkNoMGFHRjBMQ0JoY21keld6QmRLVHRjYmlBZ0lDQmpZWE5sSURJNklISmxkSFZ5YmlCMWJpQS9JR1p1S0dGeVozTmJNRjBzSUdGeVozTmJNVjBwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdPaUJtYmk1allXeHNLSFJvWVhRc0lHRnlaM05iTUYwc0lHRnlaM05iTVYwcE8xeHVJQ0FnSUdOaGMyVWdNem9nY21WMGRYSnVJSFZ1SUQ4Z1ptNG9ZWEpuYzFzd1hTd2dZWEpuYzFzeFhTd2dZWEpuYzFzeVhTbGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBNklHWnVMbU5oYkd3b2RHaGhkQ3dnWVhKbmMxc3dYU3dnWVhKbmMxc3hYU3dnWVhKbmMxc3lYU2s3WEc0Z0lDQWdZMkZ6WlNBME9pQnlaWFIxY200Z2RXNGdQeUJtYmloaGNtZHpXekJkTENCaGNtZHpXekZkTENCaGNtZHpXekpkTENCaGNtZHpXek5kS1Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRG9nWm00dVkyRnNiQ2gwYUdGMExDQmhjbWR6V3pCZExDQmhjbWR6V3pGZExDQmhjbWR6V3pKZExDQmhjbWR6V3pOZEtUdGNiaUFnZlNCeVpYUjFjbTRnWm00dVlYQndiSGtvZEdoaGRDd2dZWEpuY3lrN1hHNTlPMXh1SWl3aUx5OGdabUZzYkdKaFkyc2dabTl5SUc1dmJpMWhjbkpoZVMxc2FXdGxJRVZUTXlCaGJtUWdibTl1TFdWdWRXMWxjbUZpYkdVZ2IyeGtJRlk0SUhOMGNtbHVaM05jYm5aaGNpQmpiMllnUFNCeVpYRjFhWEpsS0NjdUwxOWpiMlluS1R0Y2JpOHZJR1Z6YkdsdWRDMWthWE5oWW14bExXNWxlSFF0YkdsdVpTQnVieTF3Y205MGIzUjVjR1V0WW5WcGJIUnBibk5jYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVDJKcVpXTjBLQ2Q2SnlrdWNISnZjR1Z5ZEhsSmMwVnVkVzFsY21GaWJHVW9NQ2tnUHlCUFltcGxZM1FnT2lCbWRXNWpkR2x2YmlBb2FYUXBJSHRjYmlBZ2NtVjBkWEp1SUdOdlppaHBkQ2tnUFQwZ0oxTjBjbWx1WnljZ1B5QnBkQzV6Y0d4cGRDZ25KeWtnT2lCUFltcGxZM1FvYVhRcE8xeHVmVHRjYmlJc0lpOHZJR05vWldOcklHOXVJR1JsWm1GMWJIUWdRWEp5WVhrZ2FYUmxjbUYwYjNKY2JuWmhjaUJKZEdWeVlYUnZjbk1nUFNCeVpYRjFhWEpsS0NjdUwxOXBkR1Z5WVhSdmNuTW5LVHRjYm5aaGNpQkpWRVZTUVZSUFVpQTlJSEpsY1hWcGNtVW9KeTR2WDNkcmN5Y3BLQ2RwZEdWeVlYUnZjaWNwTzF4dWRtRnlJRUZ5Y21GNVVISnZkRzhnUFNCQmNuSmhlUzV3Y205MGIzUjVjR1U3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0Z0tHbDBLU0I3WEc0Z0lISmxkSFZ5YmlCcGRDQWhQVDBnZFc1a1pXWnBibVZrSUNZbUlDaEpkR1Z5WVhSdmNuTXVRWEp5WVhrZ1BUMDlJR2wwSUh4OElFRnljbUY1VUhKdmRHOWJTVlJGVWtGVVQxSmRJRDA5UFNCcGRDazdYRzU5TzF4dUlpd2liVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpQW9hWFFwSUh0Y2JpQWdjbVYwZFhKdUlIUjVjR1Z2WmlCcGRDQTlQVDBnSjI5aWFtVmpkQ2NnUHlCcGRDQWhQVDBnYm5Wc2JDQTZJSFI1Y0dWdlppQnBkQ0E5UFQwZ0oyWjFibU4wYVc5dUp6dGNibjA3WEc0aUxDSXZMeUJqWVd4c0lITnZiV1YwYUdsdVp5QnZiaUJwZEdWeVlYUnZjaUJ6ZEdWd0lIZHBkR2dnYzJGbVpTQmpiRzl6YVc1bklHOXVJR1Z5Y205eVhHNTJZWElnWVc1UFltcGxZM1FnUFNCeVpYRjFhWEpsS0NjdUwxOWhiaTF2WW1wbFkzUW5LVHRjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWm5WdVkzUnBiMjRnS0dsMFpYSmhkRzl5TENCbWJpd2dkbUZzZFdVc0lHVnVkSEpwWlhNcElIdGNiaUFnZEhKNUlIdGNiaUFnSUNCeVpYUjFjbTRnWlc1MGNtbGxjeUEvSUdadUtHRnVUMkpxWldOMEtIWmhiSFZsS1Zzd1hTd2dkbUZzZFdWYk1WMHBJRG9nWm00b2RtRnNkV1VwTzF4dUlDQXZMeUEzTGpRdU5pQkpkR1Z5WVhSdmNrTnNiM05sS0dsMFpYSmhkRzl5TENCamIyMXdiR1YwYVc5dUtWeHVJQ0I5SUdOaGRHTm9JQ2hsS1NCN1hHNGdJQ0FnZG1GeUlISmxkQ0E5SUdsMFpYSmhkRzl5V3lkeVpYUjFjbTRuWFR0Y2JpQWdJQ0JwWmlBb2NtVjBJQ0U5UFNCMWJtUmxabWx1WldRcElHRnVUMkpxWldOMEtISmxkQzVqWVd4c0tHbDBaWEpoZEc5eUtTazdYRzRnSUNBZ2RHaHliM2NnWlR0Y2JpQWdmVnh1ZlR0Y2JpSXNJaWQxYzJVZ2MzUnlhV04wSnp0Y2JuWmhjaUJqY21WaGRHVWdQU0J5WlhGMWFYSmxLQ2N1TDE5dlltcGxZM1F0WTNKbFlYUmxKeWs3WEc1MllYSWdaR1Z6WTNKcGNIUnZjaUE5SUhKbGNYVnBjbVVvSnk0dlgzQnliM0JsY25SNUxXUmxjMk1uS1R0Y2JuWmhjaUJ6WlhSVWIxTjBjbWx1WjFSaFp5QTlJSEpsY1hWcGNtVW9KeTR2WDNObGRDMTBieTF6ZEhKcGJtY3RkR0ZuSnlrN1hHNTJZWElnU1hSbGNtRjBiM0pRY205MGIzUjVjR1VnUFNCN2ZUdGNibHh1THk4Z01qVXVNUzR5TGpFdU1TQWxTWFJsY21GMGIzSlFjbTkwYjNSNWNHVWxXMEJBYVhSbGNtRjBiM0pkS0NsY2JuSmxjWFZwY21Vb0p5NHZYMmhwWkdVbktTaEpkR1Z5WVhSdmNsQnliM1J2ZEhsd1pTd2djbVZ4ZFdseVpTZ25MaTlmZDJ0ekp5a29KMmwwWlhKaGRHOXlKeWtzSUdaMWJtTjBhVzl1SUNncElIc2djbVYwZFhKdUlIUm9hWE03SUgwcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1oxYm1OMGFXOXVJQ2hEYjI1emRISjFZM1J2Y2l3Z1RrRk5SU3dnYm1WNGRDa2dlMXh1SUNCRGIyNXpkSEoxWTNSdmNpNXdjbTkwYjNSNWNHVWdQU0JqY21WaGRHVW9TWFJsY21GMGIzSlFjbTkwYjNSNWNHVXNJSHNnYm1WNGREb2daR1Z6WTNKcGNIUnZjaWd4TENCdVpYaDBLU0I5S1R0Y2JpQWdjMlYwVkc5VGRISnBibWRVWVdjb1EyOXVjM1J5ZFdOMGIzSXNJRTVCVFVVZ0t5QW5JRWwwWlhKaGRHOXlKeWs3WEc1OU8xeHVJaXdpSjNWelpTQnpkSEpwWTNRbk8xeHVkbUZ5SUV4SlFsSkJVbGtnUFNCeVpYRjFhWEpsS0NjdUwxOXNhV0p5WVhKNUp5azdYRzUyWVhJZ0pHVjRjRzl5ZENBOUlISmxjWFZwY21Vb0p5NHZYMlY0Y0c5eWRDY3BPMXh1ZG1GeUlISmxaR1ZtYVc1bElEMGdjbVZ4ZFdseVpTZ25MaTlmY21Wa1pXWnBibVVuS1R0Y2JuWmhjaUJvYVdSbElEMGdjbVZ4ZFdseVpTZ25MaTlmYUdsa1pTY3BPMXh1ZG1GeUlFbDBaWEpoZEc5eWN5QTlJSEpsY1hWcGNtVW9KeTR2WDJsMFpYSmhkRzl5Y3ljcE8xeHVkbUZ5SUNScGRHVnlRM0psWVhSbElEMGdjbVZ4ZFdseVpTZ25MaTlmYVhSbGNpMWpjbVZoZEdVbktUdGNiblpoY2lCelpYUlViMU4wY21sdVoxUmhaeUE5SUhKbGNYVnBjbVVvSnk0dlgzTmxkQzEwYnkxemRISnBibWN0ZEdGbkp5azdYRzUyWVhJZ1oyVjBVSEp2ZEc5MGVYQmxUMllnUFNCeVpYRjFhWEpsS0NjdUwxOXZZbXBsWTNRdFozQnZKeWs3WEc1MllYSWdTVlJGVWtGVVQxSWdQU0J5WlhGMWFYSmxLQ2N1TDE5M2EzTW5LU2duYVhSbGNtRjBiM0luS1R0Y2JuWmhjaUJDVlVkSFdTQTlJQ0VvVzEwdWEyVjVjeUFtSmlBbmJtVjRkQ2NnYVc0Z1cxMHVhMlY1Y3lncEtUc2dMeThnVTJGbVlYSnBJR2hoY3lCaWRXZG5lU0JwZEdWeVlYUnZjbk1nZHk5dklHQnVaWGgwWUZ4dWRtRnlJRVpHWDBsVVJWSkJWRTlTSUQwZ0owQkFhWFJsY21GMGIzSW5PMXh1ZG1GeUlFdEZXVk1nUFNBbmEyVjVjeWM3WEc1MllYSWdWa0ZNVlVWVElEMGdKM1poYkhWbGN5YzdYRzVjYm5aaGNpQnlaWFIxY201VWFHbHpJRDBnWm5WdVkzUnBiMjRnS0NrZ2V5QnlaWFIxY200Z2RHaHBjenNnZlR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm1kVzVqZEdsdmJpQW9RbUZ6WlN3Z1RrRk5SU3dnUTI5dWMzUnlkV04wYjNJc0lHNWxlSFFzSUVSRlJrRlZURlFzSUVsVFgxTkZWQ3dnUms5U1EwVkVLU0I3WEc0Z0lDUnBkR1Z5UTNKbFlYUmxLRU52Ym5OMGNuVmpkRzl5TENCT1FVMUZMQ0J1WlhoMEtUdGNiaUFnZG1GeUlHZGxkRTFsZEdodlpDQTlJR1oxYm1OMGFXOXVJQ2hyYVc1a0tTQjdYRzRnSUNBZ2FXWWdLQ0ZDVlVkSFdTQW1KaUJyYVc1a0lHbHVJSEJ5YjNSdktTQnlaWFIxY200Z2NISnZkRzliYTJsdVpGMDdYRzRnSUNBZ2MzZHBkR05vSUNocmFXNWtLU0I3WEc0Z0lDQWdJQ0JqWVhObElFdEZXVk02SUhKbGRIVnliaUJtZFc1amRHbHZiaUJyWlhsektDa2dleUJ5WlhSMWNtNGdibVYzSUVOdmJuTjBjblZqZEc5eUtIUm9hWE1zSUd0cGJtUXBPeUI5TzF4dUlDQWdJQ0FnWTJGelpTQldRVXhWUlZNNklISmxkSFZ5YmlCbWRXNWpkR2x2YmlCMllXeDFaWE1vS1NCN0lISmxkSFZ5YmlCdVpYY2dRMjl1YzNSeWRXTjBiM0lvZEdocGN5d2dhMmx1WkNrN0lIMDdYRzRnSUNBZ2ZTQnlaWFIxY200Z1puVnVZM1JwYjI0Z1pXNTBjbWxsY3lncElIc2djbVYwZFhKdUlHNWxkeUJEYjI1emRISjFZM1J2Y2loMGFHbHpMQ0JyYVc1a0tUc2dmVHRjYmlBZ2ZUdGNiaUFnZG1GeUlGUkJSeUE5SUU1QlRVVWdLeUFuSUVsMFpYSmhkRzl5Snp0Y2JpQWdkbUZ5SUVSRlJsOVdRVXhWUlZNZ1BTQkVSVVpCVlV4VUlEMDlJRlpCVEZWRlV6dGNiaUFnZG1GeUlGWkJURlZGVTE5Q1ZVY2dQU0JtWVd4elpUdGNiaUFnZG1GeUlIQnliM1J2SUQwZ1FtRnpaUzV3Y205MGIzUjVjR1U3WEc0Z0lIWmhjaUFrYm1GMGFYWmxJRDBnY0hKdmRHOWJTVlJGVWtGVVQxSmRJSHg4SUhCeWIzUnZXMFpHWDBsVVJWSkJWRTlTWFNCOGZDQkVSVVpCVlV4VUlDWW1JSEJ5YjNSdlcwUkZSa0ZWVEZSZE8xeHVJQ0IyWVhJZ0pHUmxabUYxYkhRZ1BTQWtibUYwYVhabElIeDhJR2RsZEUxbGRHaHZaQ2hFUlVaQlZVeFVLVHRjYmlBZ2RtRnlJQ1JsYm5SeWFXVnpJRDBnUkVWR1FWVk1WQ0EvSUNGRVJVWmZWa0ZNVlVWVElEOGdKR1JsWm1GMWJIUWdPaUJuWlhSTlpYUm9iMlFvSjJWdWRISnBaWE1uS1NBNklIVnVaR1ZtYVc1bFpEdGNiaUFnZG1GeUlDUmhibmxPWVhScGRtVWdQU0JPUVUxRklEMDlJQ2RCY25KaGVTY2dQeUJ3Y205MGJ5NWxiblJ5YVdWeklIeDhJQ1J1WVhScGRtVWdPaUFrYm1GMGFYWmxPMXh1SUNCMllYSWdiV1YwYUc5a2N5d2dhMlY1TENCSmRHVnlZWFJ2Y2xCeWIzUnZkSGx3WlR0Y2JpQWdMeThnUm1sNElHNWhkR2wyWlZ4dUlDQnBaaUFvSkdGdWVVNWhkR2wyWlNrZ2UxeHVJQ0FnSUVsMFpYSmhkRzl5VUhKdmRHOTBlWEJsSUQwZ1oyVjBVSEp2ZEc5MGVYQmxUMllvSkdGdWVVNWhkR2wyWlM1allXeHNLRzVsZHlCQ1lYTmxLQ2twS1R0Y2JpQWdJQ0JwWmlBb1NYUmxjbUYwYjNKUWNtOTBiM1I1Y0dVZ0lUMDlJRTlpYW1WamRDNXdjbTkwYjNSNWNHVWdKaVlnU1hSbGNtRjBiM0pRY205MGIzUjVjR1V1Ym1WNGRDa2dlMXh1SUNBZ0lDQWdMeThnVTJWMElFQkFkRzlUZEhKcGJtZFVZV2NnZEc4Z2JtRjBhWFpsSUdsMFpYSmhkRzl5YzF4dUlDQWdJQ0FnYzJWMFZHOVRkSEpwYm1kVVlXY29TWFJsY21GMGIzSlFjbTkwYjNSNWNHVXNJRlJCUnl3Z2RISjFaU2s3WEc0Z0lDQWdJQ0F2THlCbWFYZ2dabTl5SUhOdmJXVWdiMnhrSUdWdVoybHVaWE5jYmlBZ0lDQWdJR2xtSUNnaFRFbENVa0ZTV1NBbUppQjBlWEJsYjJZZ1NYUmxjbUYwYjNKUWNtOTBiM1I1Y0dWYlNWUkZVa0ZVVDFKZElDRTlJQ2RtZFc1amRHbHZiaWNwSUdocFpHVW9TWFJsY21GMGIzSlFjbTkwYjNSNWNHVXNJRWxVUlZKQlZFOVNMQ0J5WlhSMWNtNVVhR2x6S1R0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnTHk4Z1ptbDRJRUZ5Y21GNUkzdDJZV3gxWlhNc0lFQkFhWFJsY21GMGIzSjlMbTVoYldVZ2FXNGdWamdnTHlCR1JseHVJQ0JwWmlBb1JFVkdYMVpCVEZWRlV5QW1KaUFrYm1GMGFYWmxJQ1ltSUNSdVlYUnBkbVV1Ym1GdFpTQWhQVDBnVmtGTVZVVlRLU0I3WEc0Z0lDQWdWa0ZNVlVWVFgwSlZSeUE5SUhSeWRXVTdYRzRnSUNBZ0pHUmxabUYxYkhRZ1BTQm1kVzVqZEdsdmJpQjJZV3gxWlhNb0tTQjdJSEpsZEhWeWJpQWtibUYwYVhabExtTmhiR3dvZEdocGN5azdJSDA3WEc0Z0lIMWNiaUFnTHk4Z1JHVm1hVzVsSUdsMFpYSmhkRzl5WEc0Z0lHbG1JQ2dvSVV4SlFsSkJVbGtnZkh3Z1JrOVNRMFZFS1NBbUppQW9RbFZIUjFrZ2ZId2dWa0ZNVlVWVFgwSlZSeUI4ZkNBaGNISnZkRzliU1ZSRlVrRlVUMUpkS1NrZ2UxeHVJQ0FnSUdocFpHVW9jSEp2ZEc4c0lFbFVSVkpCVkU5U0xDQWtaR1ZtWVhWc2RDazdYRzRnSUgxY2JpQWdMeThnVUd4MVp5Qm1iM0lnYkdsaWNtRnllVnh1SUNCSmRHVnlZWFJ2Y25OYlRrRk5SVjBnUFNBa1pHVm1ZWFZzZER0Y2JpQWdTWFJsY21GMGIzSnpXMVJCUjEwZ1BTQnlaWFIxY201VWFHbHpPMXh1SUNCcFppQW9SRVZHUVZWTVZDa2dlMXh1SUNBZ0lHMWxkR2h2WkhNZ1BTQjdYRzRnSUNBZ0lDQjJZV3gxWlhNNklFUkZSbDlXUVV4VlJWTWdQeUFrWkdWbVlYVnNkQ0E2SUdkbGRFMWxkR2h2WkNoV1FVeFZSVk1wTEZ4dUlDQWdJQ0FnYTJWNWN6b2dTVk5mVTBWVUlEOGdKR1JsWm1GMWJIUWdPaUJuWlhSTlpYUm9iMlFvUzBWWlV5a3NYRzRnSUNBZ0lDQmxiblJ5YVdWek9pQWtaVzUwY21sbGMxeHVJQ0FnSUgwN1hHNGdJQ0FnYVdZZ0tFWlBVa05GUkNrZ1ptOXlJQ2hyWlhrZ2FXNGdiV1YwYUc5a2N5a2dlMXh1SUNBZ0lDQWdhV1lnS0NFb2EyVjVJR2x1SUhCeWIzUnZLU2tnY21Wa1pXWnBibVVvY0hKdmRHOHNJR3RsZVN3Z2JXVjBhRzlrYzF0clpYbGRLVHRjYmlBZ0lDQjlJR1ZzYzJVZ0pHVjRjRzl5ZENna1pYaHdiM0owTGxBZ0t5QWtaWGh3YjNKMExrWWdLaUFvUWxWSFIxa2dmSHdnVmtGTVZVVlRYMEpWUnlrc0lFNUJUVVVzSUcxbGRHaHZaSE1wTzF4dUlDQjlYRzRnSUhKbGRIVnliaUJ0WlhSb2IyUnpPMXh1ZlR0Y2JpSXNJblpoY2lCSlZFVlNRVlJQVWlBOUlISmxjWFZwY21Vb0p5NHZYM2RyY3ljcEtDZHBkR1Z5WVhSdmNpY3BPMXh1ZG1GeUlGTkJSa1ZmUTB4UFUwbE9SeUE5SUdaaGJITmxPMXh1WEc1MGNua2dlMXh1SUNCMllYSWdjbWwwWlhJZ1BTQmJOMTFiU1ZSRlVrRlVUMUpkS0NrN1hHNGdJSEpwZEdWeVd5ZHlaWFIxY200blhTQTlJR1oxYm1OMGFXOXVJQ2dwSUhzZ1UwRkdSVjlEVEU5VFNVNUhJRDBnZEhKMVpUc2dmVHRjYmlBZ0x5OGdaWE5zYVc1MExXUnBjMkZpYkdVdGJtVjRkQzFzYVc1bElHNXZMWFJvY205M0xXeHBkR1Z5WVd4Y2JpQWdRWEp5WVhrdVpuSnZiU2h5YVhSbGNpd2dablZ1WTNScGIyNGdLQ2tnZXlCMGFISnZkeUF5T3lCOUtUdGNibjBnWTJGMFkyZ2dLR1VwSUhzZ0x5b2daVzF3ZEhrZ0tpOGdmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNobGVHVmpMQ0J6YTJsd1EyeHZjMmx1WnlrZ2UxeHVJQ0JwWmlBb0lYTnJhWEJEYkc5emFXNW5JQ1ltSUNGVFFVWkZYME5NVDFOSlRrY3BJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdkbUZ5SUhOaFptVWdQU0JtWVd4elpUdGNiaUFnZEhKNUlIdGNiaUFnSUNCMllYSWdZWEp5SUQwZ1d6ZGRPMXh1SUNBZ0lIWmhjaUJwZEdWeUlEMGdZWEp5VzBsVVJWSkJWRTlTWFNncE8xeHVJQ0FnSUdsMFpYSXVibVY0ZENBOUlHWjFibU4wYVc5dUlDZ3BJSHNnY21WMGRYSnVJSHNnWkc5dVpUb2djMkZtWlNBOUlIUnlkV1VnZlRzZ2ZUdGNiaUFnSUNCaGNuSmJTVlJGVWtGVVQxSmRJRDBnWm5WdVkzUnBiMjRnS0NrZ2V5QnlaWFIxY200Z2FYUmxjanNnZlR0Y2JpQWdJQ0JsZUdWaktHRnljaWs3WEc0Z0lIMGdZMkYwWTJnZ0tHVXBJSHNnTHlvZ1pXMXdkSGtnS2k4Z2ZWeHVJQ0J5WlhSMWNtNGdjMkZtWlR0Y2JuMDdYRzRpTENKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNoa2IyNWxMQ0IyWVd4MVpTa2dlMXh1SUNCeVpYUjFjbTRnZXlCMllXeDFaVG9nZG1Gc2RXVXNJR1J2Ym1VNklDRWhaRzl1WlNCOU8xeHVmVHRjYmlJc0ltMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UzMDdYRzRpTENKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhSeWRXVTdYRzRpTENKMllYSWdaMnh2WW1Gc0lEMGdjbVZ4ZFdseVpTZ25MaTlmWjJ4dlltRnNKeWs3WEc1MllYSWdiV0ZqY205MFlYTnJJRDBnY21WeGRXbHlaU2duTGk5ZmRHRnpheWNwTG5ObGREdGNiblpoY2lCUFluTmxjblpsY2lBOUlHZHNiMkpoYkM1TmRYUmhkR2x2Yms5aWMyVnlkbVZ5SUh4OElHZHNiMkpoYkM1WFpXSkxhWFJOZFhSaGRHbHZiazlpYzJWeWRtVnlPMXh1ZG1GeUlIQnliMk5sYzNNZ1BTQm5iRzlpWVd3dWNISnZZMlZ6Y3p0Y2JuWmhjaUJRY205dGFYTmxJRDBnWjJ4dlltRnNMbEJ5YjIxcGMyVTdYRzUyWVhJZ2FYTk9iMlJsSUQwZ2NtVnhkV2x5WlNnbkxpOWZZMjltSnlrb2NISnZZMlZ6Y3lrZ1BUMGdKM0J5YjJObGMzTW5PMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnZG1GeUlHaGxZV1FzSUd4aGMzUXNJRzV2ZEdsbWVUdGNibHh1SUNCMllYSWdabXgxYzJnZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUhCaGNtVnVkQ3dnWm00N1hHNGdJQ0FnYVdZZ0tHbHpUbTlrWlNBbUppQW9jR0Z5Wlc1MElEMGdjSEp2WTJWemN5NWtiMjFoYVc0cEtTQndZWEpsYm5RdVpYaHBkQ2dwTzF4dUlDQWdJSGRvYVd4bElDaG9aV0ZrS1NCN1hHNGdJQ0FnSUNCbWJpQTlJR2hsWVdRdVptNDdYRzRnSUNBZ0lDQm9aV0ZrSUQwZ2FHVmhaQzV1WlhoME8xeHVJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnWm00b0tUdGNiaUFnSUNBZ0lIMGdZMkYwWTJnZ0tHVXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHaGxZV1FwSUc1dmRHbG1lU2dwTzF4dUlDQWdJQ0FnSUNCbGJITmxJR3hoYzNRZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJSFJvY205M0lHVTdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTQnNZWE4wSUQwZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUdsbUlDaHdZWEpsYm5RcElIQmhjbVZ1ZEM1bGJuUmxjaWdwTzF4dUlDQjlPMXh1WEc0Z0lDOHZJRTV2WkdVdWFuTmNiaUFnYVdZZ0tHbHpUbTlrWlNrZ2UxeHVJQ0FnSUc1dmRHbG1lU0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lIQnliMk5sYzNNdWJtVjRkRlJwWTJzb1pteDFjMmdwTzF4dUlDQWdJSDA3WEc0Z0lDOHZJR0p5YjNkelpYSnpJSGRwZEdnZ1RYVjBZWFJwYjI1UFluTmxjblpsY2l3Z1pYaGpaWEIwSUdsUFV5QlRZV1poY21rZ0xTQm9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZlbXh2YVhKdlkyc3ZZMjl5WlMxcWN5OXBjM04xWlhNdk16TTVYRzRnSUgwZ1pXeHpaU0JwWmlBb1QySnpaWEoyWlhJZ0ppWWdJU2huYkc5aVlXd3VibUYyYVdkaGRHOXlJQ1ltSUdkc2IySmhiQzV1WVhacFoyRjBiM0l1YzNSaGJtUmhiRzl1WlNrcElIdGNiaUFnSUNCMllYSWdkRzluWjJ4bElEMGdkSEoxWlR0Y2JpQWdJQ0IyWVhJZ2JtOWtaU0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVlJsZUhST2IyUmxLQ2NuS1R0Y2JpQWdJQ0J1WlhjZ1QySnpaWEoyWlhJb1pteDFjMmdwTG05aWMyVnlkbVVvYm05a1pTd2dleUJqYUdGeVlXTjBaWEpFWVhSaE9pQjBjblZsSUgwcE95QXZMeUJsYzJ4cGJuUXRaR2x6WVdKc1pTMXNhVzVsSUc1dkxXNWxkMXh1SUNBZ0lHNXZkR2xtZVNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJRzV2WkdVdVpHRjBZU0E5SUhSdloyZHNaU0E5SUNGMGIyZG5iR1U3WEc0Z0lDQWdmVHRjYmlBZ0x5OGdaVzUyYVhKdmJtMWxiblJ6SUhkcGRHZ2diV0Y1WW1VZ2JtOXVMV052YlhCc1pYUmxiSGtnWTI5eWNtVmpkQ3dnWW5WMElHVjRhWE4wWlc1MElGQnliMjFwYzJWY2JpQWdmU0JsYkhObElHbG1JQ2hRY205dGFYTmxJQ1ltSUZCeWIyMXBjMlV1Y21WemIyeDJaU2tnZTF4dUlDQWdJQzh2SUZCeWIyMXBjMlV1Y21WemIyeDJaU0IzYVhSb2IzVjBJR0Z1SUdGeVozVnRaVzUwSUhSb2NtOTNjeUJoYmlCbGNuSnZjaUJwYmlCTVJ5QlhaV0pQVXlBeVhHNGdJQ0FnZG1GeUlIQnliMjFwYzJVZ1BTQlFjbTl0YVhObExuSmxjMjlzZG1Vb2RXNWtaV1pwYm1Wa0tUdGNiaUFnSUNCdWIzUnBabmtnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQndjbTl0YVhObExuUm9aVzRvWm14MWMyZ3BPMXh1SUNBZ0lIMDdYRzRnSUM4dklHWnZjaUJ2ZEdobGNpQmxiblpwY205dWJXVnVkSE1nTFNCdFlXTnliM1JoYzJzZ1ltRnpaV1FnYjI0NlhHNGdJQzh2SUMwZ2MyVjBTVzF0WldScFlYUmxYRzRnSUM4dklDMGdUV1Z6YzJGblpVTm9ZVzV1Wld4Y2JpQWdMeThnTFNCM2FXNWtiM2N1Y0c5emRFMWxjM05oWjF4dUlDQXZMeUF0SUc5dWNtVmhaSGx6ZEdGMFpXTm9ZVzVuWlZ4dUlDQXZMeUF0SUhObGRGUnBiV1Z2ZFhSY2JpQWdmU0JsYkhObElIdGNiaUFnSUNCdWIzUnBabmtnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQXZMeUJ6ZEhKaGJtZGxJRWxGSUNzZ2QyVmljR0ZqYXlCa1pYWWdjMlZ5ZG1WeUlHSjFaeUF0SUhWelpTQXVZMkZzYkNobmJHOWlZV3dwWEc0Z0lDQWdJQ0J0WVdOeWIzUmhjMnN1WTJGc2JDaG5iRzlpWVd3c0lHWnNkWE5vS1R0Y2JpQWdJQ0I5TzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUdaMWJtTjBhVzl1SUNobWJpa2dlMXh1SUNBZ0lIWmhjaUIwWVhOcklEMGdleUJtYmpvZ1ptNHNJRzVsZUhRNklIVnVaR1ZtYVc1bFpDQjlPMXh1SUNBZ0lHbG1JQ2hzWVhOMEtTQnNZWE4wTG01bGVIUWdQU0IwWVhOck8xeHVJQ0FnSUdsbUlDZ2hhR1ZoWkNrZ2UxeHVJQ0FnSUNBZ2FHVmhaQ0E5SUhSaGMyczdYRzRnSUNBZ0lDQnViM1JwWm5rb0tUdGNiaUFnSUNCOUlHeGhjM1FnUFNCMFlYTnJPMXh1SUNCOU8xeHVmVHRjYmlJc0lpZDFjMlVnYzNSeWFXTjBKenRjYmk4dklESTFMalF1TVM0MUlFNWxkMUJ5YjIxcGMyVkRZWEJoWW1sc2FYUjVLRU1wWEc1MllYSWdZVVoxYm1OMGFXOXVJRDBnY21WeGRXbHlaU2duTGk5ZllTMW1kVzVqZEdsdmJpY3BPMXh1WEc1bWRXNWpkR2x2YmlCUWNtOXRhWE5sUTJGd1lXSnBiR2wwZVNoREtTQjdYRzRnSUhaaGNpQnlaWE52YkhabExDQnlaV3BsWTNRN1hHNGdJSFJvYVhNdWNISnZiV2x6WlNBOUlHNWxkeUJES0daMWJtTjBhVzl1SUNna0pISmxjMjlzZG1Vc0lDUWtjbVZxWldOMEtTQjdYRzRnSUNBZ2FXWWdLSEpsYzI5c2RtVWdJVDA5SUhWdVpHVm1hVzVsWkNCOGZDQnlaV3BsWTNRZ0lUMDlJSFZ1WkdWbWFXNWxaQ2tnZEdoeWIzY2dWSGx3WlVWeWNtOXlLQ2RDWVdRZ1VISnZiV2x6WlNCamIyNXpkSEoxWTNSdmNpY3BPMXh1SUNBZ0lISmxjMjlzZG1VZ1BTQWtKSEpsYzI5c2RtVTdYRzRnSUNBZ2NtVnFaV04wSUQwZ0pDUnlaV3BsWTNRN1hHNGdJSDBwTzF4dUlDQjBhR2x6TG5KbGMyOXNkbVVnUFNCaFJuVnVZM1JwYjI0b2NtVnpiMngyWlNrN1hHNGdJSFJvYVhNdWNtVnFaV04wSUQwZ1lVWjFibU4wYVc5dUtISmxhbVZqZENrN1hHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpMbVlnUFNCbWRXNWpkR2x2YmlBb1F5a2dlMXh1SUNCeVpYUjFjbTRnYm1WM0lGQnliMjFwYzJWRFlYQmhZbWxzYVhSNUtFTXBPMXh1ZlR0Y2JpSXNJaTh2SURFNUxqRXVNaTR5SUM4Z01UVXVNaTR6TGpVZ1QySnFaV04wTG1OeVpXRjBaU2hQSUZzc0lGQnliM0JsY25ScFpYTmRLVnh1ZG1GeUlHRnVUMkpxWldOMElEMGdjbVZ4ZFdseVpTZ25MaTlmWVc0dGIySnFaV04wSnlrN1hHNTJZWElnWkZCeklEMGdjbVZ4ZFdseVpTZ25MaTlmYjJKcVpXTjBMV1J3Y3ljcE8xeHVkbUZ5SUdWdWRXMUNkV2RMWlhseklEMGdjbVZ4ZFdseVpTZ25MaTlmWlc1MWJTMWlkV2N0YTJWNWN5Y3BPMXh1ZG1GeUlFbEZYMUJTVDFSUElEMGdjbVZ4ZFdseVpTZ25MaTlmYzJoaGNtVmtMV3RsZVNjcEtDZEpSVjlRVWs5VVR5Y3BPMXh1ZG1GeUlFVnRjSFI1SUQwZ1puVnVZM1JwYjI0Z0tDa2dleUF2S2lCbGJYQjBlU0FxTHlCOU8xeHVkbUZ5SUZCU1QxUlBWRmxRUlNBOUlDZHdjbTkwYjNSNWNHVW5PMXh1WEc0dkx5QkRjbVZoZEdVZ2IySnFaV04wSUhkcGRHZ2dabUZyWlNCZ2JuVnNiR0FnY0hKdmRHOTBlWEJsT2lCMWMyVWdhV1p5WVcxbElFOWlhbVZqZENCM2FYUm9JR05zWldGeVpXUWdjSEp2ZEc5MGVYQmxYRzUyWVhJZ1kzSmxZWFJsUkdsamRDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdMeThnVkdoeVlYTm9MQ0IzWVhOMFpTQmhibVFnYzI5a2IyMTVPaUJKUlNCSFF5QmlkV2RjYmlBZ2RtRnlJR2xtY21GdFpTQTlJSEpsY1hWcGNtVW9KeTR2WDJSdmJTMWpjbVZoZEdVbktTZ25hV1p5WVcxbEp5azdYRzRnSUhaaGNpQnBJRDBnWlc1MWJVSjFaMHRsZVhNdWJHVnVaM1JvTzF4dUlDQjJZWElnYkhRZ1BTQW5QQ2M3WEc0Z0lIWmhjaUJuZENBOUlDYytKenRjYmlBZ2RtRnlJR2xtY21GdFpVUnZZM1Z0Wlc1ME8xeHVJQ0JwWm5KaGJXVXVjM1I1YkdVdVpHbHpjR3hoZVNBOUlDZHViMjVsSnp0Y2JpQWdjbVZ4ZFdseVpTZ25MaTlmYUhSdGJDY3BMbUZ3Y0dWdVpFTm9hV3hrS0dsbWNtRnRaU2s3WEc0Z0lHbG1jbUZ0WlM1emNtTWdQU0FuYW1GMllYTmpjbWx3ZERvbk95QXZMeUJsYzJ4cGJuUXRaR2x6WVdKc1pTMXNhVzVsSUc1dkxYTmpjbWx3ZEMxMWNteGNiaUFnTHk4Z1kzSmxZWFJsUkdsamRDQTlJR2xtY21GdFpTNWpiMjUwWlc1MFYybHVaRzkzTGs5aWFtVmpkRHRjYmlBZ0x5OGdhSFJ0YkM1eVpXMXZkbVZEYUdsc1pDaHBabkpoYldVcE8xeHVJQ0JwWm5KaGJXVkViMk4xYldWdWRDQTlJR2xtY21GdFpTNWpiMjUwWlc1MFYybHVaRzkzTG1SdlkzVnRaVzUwTzF4dUlDQnBabkpoYldWRWIyTjFiV1Z1ZEM1dmNHVnVLQ2s3WEc0Z0lHbG1jbUZ0WlVSdlkzVnRaVzUwTG5keWFYUmxLR3gwSUNzZ0ozTmpjbWx3ZENjZ0t5Qm5kQ0FySUNka2IyTjFiV1Z1ZEM1R1BVOWlhbVZqZENjZ0t5QnNkQ0FySUNjdmMyTnlhWEIwSnlBcklHZDBLVHRjYmlBZ2FXWnlZVzFsUkc5amRXMWxiblF1WTJ4dmMyVW9LVHRjYmlBZ1kzSmxZWFJsUkdsamRDQTlJR2xtY21GdFpVUnZZM1Z0Wlc1MExrWTdYRzRnSUhkb2FXeGxJQ2hwTFMwcElHUmxiR1YwWlNCamNtVmhkR1ZFYVdOMFcxQlNUMVJQVkZsUVJWMWJaVzUxYlVKMVowdGxlWE5iYVYxZE8xeHVJQ0J5WlhSMWNtNGdZM0psWVhSbFJHbGpkQ2dwTzF4dWZUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JQWW1wbFkzUXVZM0psWVhSbElIeDhJR1oxYm1OMGFXOXVJR055WldGMFpTaFBMQ0JRY205d1pYSjBhV1Z6S1NCN1hHNGdJSFpoY2lCeVpYTjFiSFE3WEc0Z0lHbG1JQ2hQSUNFOVBTQnVkV3hzS1NCN1hHNGdJQ0FnUlcxd2RIbGJVRkpQVkU5VVdWQkZYU0E5SUdGdVQySnFaV04wS0U4cE8xeHVJQ0FnSUhKbGMzVnNkQ0E5SUc1bGR5QkZiWEIwZVNncE8xeHVJQ0FnSUVWdGNIUjVXMUJTVDFSUFZGbFFSVjBnUFNCdWRXeHNPMXh1SUNBZ0lDOHZJR0ZrWkNCY0lsOWZjSEp2ZEc5Zlgxd2lJR1p2Y2lCUFltcGxZM1F1WjJWMFVISnZkRzkwZVhCbFQyWWdjRzlzZVdacGJHeGNiaUFnSUNCeVpYTjFiSFJiU1VWZlVGSlBWRTlkSUQwZ1R6dGNiaUFnZlNCbGJITmxJSEpsYzNWc2RDQTlJR055WldGMFpVUnBZM1FvS1R0Y2JpQWdjbVYwZFhKdUlGQnliM0JsY25ScFpYTWdQVDA5SUhWdVpHVm1hVzVsWkNBL0lISmxjM1ZzZENBNklHUlFjeWh5WlhOMWJIUXNJRkJ5YjNCbGNuUnBaWE1wTzF4dWZUdGNiaUlzSW5aaGNpQmhiazlpYW1WamRDQTlJSEpsY1hWcGNtVW9KeTR2WDJGdUxXOWlhbVZqZENjcE8xeHVkbUZ5SUVsRk9GOUVUMDFmUkVWR1NVNUZJRDBnY21WeGRXbHlaU2duTGk5ZmFXVTRMV1J2YlMxa1pXWnBibVVuS1R0Y2JuWmhjaUIwYjFCeWFXMXBkR2wyWlNBOUlISmxjWFZwY21Vb0p5NHZYM1J2TFhCeWFXMXBkR2wyWlNjcE8xeHVkbUZ5SUdSUUlEMGdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1TzF4dVhHNWxlSEJ2Y25SekxtWWdQU0J5WlhGMWFYSmxLQ2N1TDE5a1pYTmpjbWx3ZEc5eWN5Y3BJRDhnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUlEb2dablZ1WTNScGIyNGdaR1ZtYVc1bFVISnZjR1Z5ZEhrb1R5d2dVQ3dnUVhSMGNtbGlkWFJsY3lrZ2UxeHVJQ0JoYms5aWFtVmpkQ2hQS1R0Y2JpQWdVQ0E5SUhSdlVISnBiV2wwYVhabEtGQXNJSFJ5ZFdVcE8xeHVJQ0JoYms5aWFtVmpkQ2hCZEhSeWFXSjFkR1Z6S1R0Y2JpQWdhV1lnS0VsRk9GOUVUMDFmUkVWR1NVNUZLU0IwY25rZ2UxeHVJQ0FnSUhKbGRIVnliaUJrVUNoUExDQlFMQ0JCZEhSeWFXSjFkR1Z6S1R0Y2JpQWdmU0JqWVhSamFDQW9aU2tnZXlBdktpQmxiWEIwZVNBcUx5QjlYRzRnSUdsbUlDZ25aMlYwSnlCcGJpQkJkSFJ5YVdKMWRHVnpJSHg4SUNkelpYUW5JR2x1SUVGMGRISnBZblYwWlhNcElIUm9jbTkzSUZSNWNHVkZjbkp2Y2lnblFXTmpaWE56YjNKeklHNXZkQ0J6ZFhCd2IzSjBaV1FoSnlrN1hHNGdJR2xtSUNnbmRtRnNkV1VuSUdsdUlFRjBkSEpwWW5WMFpYTXBJRTliVUYwZ1BTQkJkSFJ5YVdKMWRHVnpMblpoYkhWbE8xeHVJQ0J5WlhSMWNtNGdUenRjYm4wN1hHNGlMQ0oyWVhJZ1pGQWdQU0J5WlhGMWFYSmxLQ2N1TDE5dlltcGxZM1F0WkhBbktUdGNiblpoY2lCaGJrOWlhbVZqZENBOUlISmxjWFZwY21Vb0p5NHZYMkZ1TFc5aWFtVmpkQ2NwTzF4dWRtRnlJR2RsZEV0bGVYTWdQU0J5WlhGMWFYSmxLQ2N1TDE5dlltcGxZM1F0YTJWNWN5Y3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUhKbGNYVnBjbVVvSnk0dlgyUmxjMk55YVhCMGIzSnpKeWtnUHlCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRHbGxjeUE2SUdaMWJtTjBhVzl1SUdSbFptbHVaVkJ5YjNCbGNuUnBaWE1vVHl3Z1VISnZjR1Z5ZEdsbGN5a2dlMXh1SUNCaGJrOWlhbVZqZENoUEtUdGNiaUFnZG1GeUlHdGxlWE1nUFNCblpYUkxaWGx6S0ZCeWIzQmxjblJwWlhNcE8xeHVJQ0IyWVhJZ2JHVnVaM1JvSUQwZ2EyVjVjeTVzWlc1bmRHZzdYRzRnSUhaaGNpQnBJRDBnTUR0Y2JpQWdkbUZ5SUZBN1hHNGdJSGRvYVd4bElDaHNaVzVuZEdnZ1BpQnBLU0JrVUM1bUtFOHNJRkFnUFNCclpYbHpXMmtySzEwc0lGQnliM0JsY25ScFpYTmJVRjBwTzF4dUlDQnlaWFIxY200Z1R6dGNibjA3WEc0aUxDSXZMeUF4T1M0eExqSXVPU0F2SURFMUxqSXVNeTR5SUU5aWFtVmpkQzVuWlhSUWNtOTBiM1I1Y0dWUFppaFBLVnh1ZG1GeUlHaGhjeUE5SUhKbGNYVnBjbVVvSnk0dlgyaGhjeWNwTzF4dWRtRnlJSFJ2VDJKcVpXTjBJRDBnY21WeGRXbHlaU2duTGk5ZmRHOHRiMkpxWldOMEp5azdYRzUyWVhJZ1NVVmZVRkpQVkU4Z1BTQnlaWEYxYVhKbEtDY3VMMTl6YUdGeVpXUXRhMlY1Snlrb0owbEZYMUJTVDFSUEp5azdYRzUyWVhJZ1QySnFaV04wVUhKdmRHOGdQU0JQWW1wbFkzUXVjSEp2ZEc5MGVYQmxPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUU5aWFtVmpkQzVuWlhSUWNtOTBiM1I1Y0dWUFppQjhmQ0JtZFc1amRHbHZiaUFvVHlrZ2UxeHVJQ0JQSUQwZ2RHOVBZbXBsWTNRb1R5azdYRzRnSUdsbUlDaG9ZWE1vVHl3Z1NVVmZVRkpQVkU4cEtTQnlaWFIxY200Z1QxdEpSVjlRVWs5VVQxMDdYRzRnSUdsbUlDaDBlWEJsYjJZZ1R5NWpiMjV6ZEhKMVkzUnZjaUE5UFNBblpuVnVZM1JwYjI0bklDWW1JRThnYVc1emRHRnVZMlZ2WmlCUExtTnZibk4wY25WamRHOXlLU0I3WEc0Z0lDQWdjbVYwZFhKdUlFOHVZMjl1YzNSeWRXTjBiM0l1Y0hKdmRHOTBlWEJsTzF4dUlDQjlJSEpsZEhWeWJpQlBJR2x1YzNSaGJtTmxiMllnVDJKcVpXTjBJRDhnVDJKcVpXTjBVSEp2ZEc4Z09pQnVkV3hzTzF4dWZUdGNiaUlzSW5aaGNpQm9ZWE1nUFNCeVpYRjFhWEpsS0NjdUwxOW9ZWE1uS1R0Y2JuWmhjaUIwYjBsUFltcGxZM1FnUFNCeVpYRjFhWEpsS0NjdUwxOTBieTFwYjJKcVpXTjBKeWs3WEc1MllYSWdZWEp5WVhsSmJtUmxlRTltSUQwZ2NtVnhkV2x5WlNnbkxpOWZZWEp5WVhrdGFXNWpiSFZrWlhNbktTaG1ZV3h6WlNrN1hHNTJZWElnU1VWZlVGSlBWRThnUFNCeVpYRjFhWEpsS0NjdUwxOXphR0Z5WldRdGEyVjVKeWtvSjBsRlgxQlNUMVJQSnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdablZ1WTNScGIyNGdLRzlpYW1WamRDd2dibUZ0WlhNcElIdGNiaUFnZG1GeUlFOGdQU0IwYjBsUFltcGxZM1FvYjJKcVpXTjBLVHRjYmlBZ2RtRnlJR2tnUFNBd08xeHVJQ0IyWVhJZ2NtVnpkV3gwSUQwZ1cxMDdYRzRnSUhaaGNpQnJaWGs3WEc0Z0lHWnZjaUFvYTJWNUlHbHVJRThwSUdsbUlDaHJaWGtnSVQwZ1NVVmZVRkpQVkU4cElHaGhjeWhQTENCclpYa3BJQ1ltSUhKbGMzVnNkQzV3ZFhOb0tHdGxlU2s3WEc0Z0lDOHZJRVJ2YmlkMElHVnVkVzBnWW5WbklDWWdhR2xrWkdWdUlHdGxlWE5jYmlBZ2QyaHBiR1VnS0c1aGJXVnpMbXhsYm1kMGFDQStJR2twSUdsbUlDaG9ZWE1vVHl3Z2EyVjVJRDBnYm1GdFpYTmJhU3NyWFNrcElIdGNiaUFnSUNCK1lYSnlZWGxKYm1SbGVFOW1LSEpsYzNWc2RDd2dhMlY1S1NCOGZDQnlaWE4xYkhRdWNIVnphQ2hyWlhrcE8xeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCeVpYTjFiSFE3WEc1OU8xeHVJaXdpTHk4Z01Ua3VNUzR5TGpFMElDOGdNVFV1TWk0ekxqRTBJRTlpYW1WamRDNXJaWGx6S0U4cFhHNTJZWElnSkd0bGVYTWdQU0J5WlhGMWFYSmxLQ2N1TDE5dlltcGxZM1F0YTJWNWN5MXBiblJsY201aGJDY3BPMXh1ZG1GeUlHVnVkVzFDZFdkTFpYbHpJRDBnY21WeGRXbHlaU2duTGk5ZlpXNTFiUzFpZFdjdGEyVjVjeWNwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFOWlhbVZqZEM1clpYbHpJSHg4SUdaMWJtTjBhVzl1SUd0bGVYTW9UeWtnZTF4dUlDQnlaWFIxY200Z0pHdGxlWE1vVHl3Z1pXNTFiVUoxWjB0bGVYTXBPMXh1ZlR0Y2JpSXNJbTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdablZ1WTNScGIyNGdLR1Y0WldNcElIdGNiaUFnZEhKNUlIdGNiaUFnSUNCeVpYUjFjbTRnZXlCbE9pQm1ZV3h6WlN3Z2Rqb2daWGhsWXlncElIMDdYRzRnSUgwZ1kyRjBZMmdnS0dVcElIdGNiaUFnSUNCeVpYUjFjbTRnZXlCbE9pQjBjblZsTENCMk9pQmxJSDA3WEc0Z0lIMWNibjA3WEc0aUxDSjJZWElnWVc1UFltcGxZM1FnUFNCeVpYRjFhWEpsS0NjdUwxOWhiaTF2WW1wbFkzUW5LVHRjYm5aaGNpQnBjMDlpYW1WamRDQTlJSEpsY1hWcGNtVW9KeTR2WDJsekxXOWlhbVZqZENjcE8xeHVkbUZ5SUc1bGQxQnliMjFwYzJWRFlYQmhZbWxzYVhSNUlEMGdjbVZ4ZFdseVpTZ25MaTlmYm1WM0xYQnliMjFwYzJVdFkyRndZV0pwYkdsMGVTY3BPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNoRExDQjRLU0I3WEc0Z0lHRnVUMkpxWldOMEtFTXBPMXh1SUNCcFppQW9hWE5QWW1wbFkzUW9lQ2tnSmlZZ2VDNWpiMjV6ZEhKMVkzUnZjaUE5UFQwZ1F5a2djbVYwZFhKdUlIZzdYRzRnSUhaaGNpQndjbTl0YVhObFEyRndZV0pwYkdsMGVTQTlJRzVsZDFCeWIyMXBjMlZEWVhCaFltbHNhWFI1TG1Zb1F5azdYRzRnSUhaaGNpQnlaWE52YkhabElEMGdjSEp2YldselpVTmhjR0ZpYVd4cGRIa3VjbVZ6YjJ4MlpUdGNiaUFnY21WemIyeDJaU2g0S1R0Y2JpQWdjbVYwZFhKdUlIQnliMjFwYzJWRFlYQmhZbWxzYVhSNUxuQnliMjFwYzJVN1hHNTlPMXh1SWl3aWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbWRXNWpkR2x2YmlBb1ltbDBiV0Z3TENCMllXeDFaU2tnZTF4dUlDQnlaWFIxY200Z2UxeHVJQ0FnSUdWdWRXMWxjbUZpYkdVNklDRW9ZbWwwYldGd0lDWWdNU2tzWEc0Z0lDQWdZMjl1Wm1sbmRYSmhZbXhsT2lBaEtHSnBkRzFoY0NBbUlESXBMRnh1SUNBZ0lIZHlhWFJoWW14bE9pQWhLR0pwZEcxaGNDQW1JRFFwTEZ4dUlDQWdJSFpoYkhWbE9pQjJZV3gxWlZ4dUlDQjlPMXh1ZlR0Y2JpSXNJblpoY2lCb2FXUmxJRDBnY21WeGRXbHlaU2duTGk5ZmFHbGtaU2NwTzF4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbWRXNWpkR2x2YmlBb2RHRnlaMlYwTENCemNtTXNJSE5oWm1VcElIdGNiaUFnWm05eUlDaDJZWElnYTJWNUlHbHVJSE55WXlrZ2UxeHVJQ0FnSUdsbUlDaHpZV1psSUNZbUlIUmhjbWRsZEZ0clpYbGRLU0IwWVhKblpYUmJhMlY1WFNBOUlITnlZMXRyWlhsZE8xeHVJQ0FnSUdWc2MyVWdhR2xrWlNoMFlYSm5aWFFzSUd0bGVTd2djM0pqVzJ0bGVWMHBPMXh1SUNCOUlISmxkSFZ5YmlCMFlYSm5aWFE3WEc1OU8xeHVJaXdpYlc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5WlhGMWFYSmxLQ2N1TDE5b2FXUmxKeWs3WEc0aUxDSW5kWE5sSUhOMGNtbGpkQ2M3WEc1MllYSWdaMnh2WW1Gc0lEMGdjbVZ4ZFdseVpTZ25MaTlmWjJ4dlltRnNKeWs3WEc1MllYSWdZMjl5WlNBOUlISmxjWFZwY21Vb0p5NHZYMk52Y21VbktUdGNiblpoY2lCa1VDQTlJSEpsY1hWcGNtVW9KeTR2WDI5aWFtVmpkQzFrY0NjcE8xeHVkbUZ5SUVSRlUwTlNTVkJVVDFKVElEMGdjbVZ4ZFdseVpTZ25MaTlmWkdWelkzSnBjSFJ2Y25NbktUdGNiblpoY2lCVFVFVkRTVVZUSUQwZ2NtVnhkV2x5WlNnbkxpOWZkMnR6Snlrb0ozTndaV05wWlhNbktUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtZFc1amRHbHZiaUFvUzBWWktTQjdYRzRnSUhaaGNpQkRJRDBnZEhsd1pXOW1JR052Y21WYlMwVlpYU0E5UFNBblpuVnVZM1JwYjI0bklEOGdZMjl5WlZ0TFJWbGRJRG9nWjJ4dlltRnNXMHRGV1YwN1hHNGdJR2xtSUNoRVJWTkRVa2xRVkU5U1V5QW1KaUJESUNZbUlDRkRXMU5RUlVOSlJWTmRLU0JrVUM1bUtFTXNJRk5RUlVOSlJWTXNJSHRjYmlBZ0lDQmpiMjVtYVdkMWNtRmliR1U2SUhSeWRXVXNYRzRnSUNBZ1oyVjBPaUJtZFc1amRHbHZiaUFvS1NCN0lISmxkSFZ5YmlCMGFHbHpPeUI5WEc0Z0lIMHBPMXh1ZlR0Y2JpSXNJblpoY2lCa1pXWWdQU0J5WlhGMWFYSmxLQ2N1TDE5dlltcGxZM1F0WkhBbktTNW1PMXh1ZG1GeUlHaGhjeUE5SUhKbGNYVnBjbVVvSnk0dlgyaGhjeWNwTzF4dWRtRnlJRlJCUnlBOUlISmxjWFZwY21Vb0p5NHZYM2RyY3ljcEtDZDBiMU4wY21sdVoxUmhaeWNwTzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWjFibU4wYVc5dUlDaHBkQ3dnZEdGbkxDQnpkR0YwS1NCN1hHNGdJR2xtSUNocGRDQW1KaUFoYUdGektHbDBJRDBnYzNSaGRDQS9JR2wwSURvZ2FYUXVjSEp2ZEc5MGVYQmxMQ0JVUVVjcEtTQmtaV1lvYVhRc0lGUkJSeXdnZXlCamIyNW1hV2QxY21GaWJHVTZJSFJ5ZFdVc0lIWmhiSFZsT2lCMFlXY2dmU2s3WEc1OU8xeHVJaXdpZG1GeUlITm9ZWEpsWkNBOUlISmxjWFZwY21Vb0p5NHZYM05vWVhKbFpDY3BLQ2RyWlhsekp5azdYRzUyWVhJZ2RXbGtJRDBnY21WeGRXbHlaU2duTGk5ZmRXbGtKeWs3WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNoclpYa3BJSHRjYmlBZ2NtVjBkWEp1SUhOb1lYSmxaRnRyWlhsZElIeDhJQ2h6YUdGeVpXUmJhMlY1WFNBOUlIVnBaQ2hyWlhrcEtUdGNibjA3WEc0aUxDSjJZWElnWTI5eVpTQTlJSEpsY1hWcGNtVW9KeTR2WDJOdmNtVW5LVHRjYm5aaGNpQm5iRzlpWVd3Z1BTQnlaWEYxYVhKbEtDY3VMMTluYkc5aVlXd25LVHRjYm5aaGNpQlRTRUZTUlVRZ1BTQW5YMTlqYjNKbExXcHpYM05vWVhKbFpGOWZKenRjYm5aaGNpQnpkRzl5WlNBOUlHZHNiMkpoYkZ0VFNFRlNSVVJkSUh4OElDaG5iRzlpWVd4YlUwaEJVa1ZFWFNBOUlIdDlLVHRjYmx4dUtHMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0Z0tHdGxlU3dnZG1Gc2RXVXBJSHRjYmlBZ2NtVjBkWEp1SUhOMGIzSmxXMnRsZVYwZ2ZId2dLSE4wYjNKbFcydGxlVjBnUFNCMllXeDFaU0FoUFQwZ2RXNWtaV1pwYm1Wa0lEOGdkbUZzZFdVZ09pQjdmU2s3WEc1OUtTZ25kbVZ5YzJsdmJuTW5MQ0JiWFNrdWNIVnphQ2g3WEc0Z0lIWmxjbk5wYjI0NklHTnZjbVV1ZG1WeWMybHZiaXhjYmlBZ2JXOWtaVG9nY21WeGRXbHlaU2duTGk5ZmJHbGljbUZ5ZVNjcElEOGdKM0IxY21VbklEb2dKMmRzYjJKaGJDY3NYRzRnSUdOdmNIbHlhV2RvZERvZ0o4S3BJREl3TVRrZ1JHVnVhWE1nVUhWemFHdGhjbVYySUNoNmJHOXBjbTlqYXk1eWRTa25YRzU5S1R0Y2JpSXNJaTh2SURjdU15NHlNQ0JUY0dWamFXVnpRMjl1YzNSeWRXTjBiM0lvVHl3Z1pHVm1ZWFZzZEVOdmJuTjBjblZqZEc5eUtWeHVkbUZ5SUdGdVQySnFaV04wSUQwZ2NtVnhkV2x5WlNnbkxpOWZZVzR0YjJKcVpXTjBKeWs3WEc1MllYSWdZVVoxYm1OMGFXOXVJRDBnY21WeGRXbHlaU2duTGk5ZllTMW1kVzVqZEdsdmJpY3BPMXh1ZG1GeUlGTlFSVU5KUlZNZ1BTQnlaWEYxYVhKbEtDY3VMMTkzYTNNbktTZ25jM0JsWTJsbGN5Y3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtZFc1amRHbHZiaUFvVHl3Z1JDa2dlMXh1SUNCMllYSWdReUE5SUdGdVQySnFaV04wS0U4cExtTnZibk4wY25WamRHOXlPMXh1SUNCMllYSWdVenRjYmlBZ2NtVjBkWEp1SUVNZ1BUMDlJSFZ1WkdWbWFXNWxaQ0I4ZkNBb1V5QTlJR0Z1VDJKcVpXTjBLRU1wVzFOUVJVTkpSVk5kS1NBOVBTQjFibVJsWm1sdVpXUWdQeUJFSURvZ1lVWjFibU4wYVc5dUtGTXBPMXh1ZlR0Y2JpSXNJblpoY2lCMGIwbHVkR1ZuWlhJZ1BTQnlaWEYxYVhKbEtDY3VMMTkwYnkxcGJuUmxaMlZ5SnlrN1hHNTJZWElnWkdWbWFXNWxaQ0E5SUhKbGNYVnBjbVVvSnk0dlgyUmxabWx1WldRbktUdGNiaTh2SUhSeWRXVWdJQzArSUZOMGNtbHVaeU5oZEZ4dUx5OGdabUZzYzJVZ0xUNGdVM1J5YVc1bkkyTnZaR1ZRYjJsdWRFRjBYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1oxYm1OMGFXOXVJQ2hVVDE5VFZGSkpUa2NwSUh0Y2JpQWdjbVYwZFhKdUlHWjFibU4wYVc5dUlDaDBhR0YwTENCd2IzTXBJSHRjYmlBZ0lDQjJZWElnY3lBOUlGTjBjbWx1Wnloa1pXWnBibVZrS0hSb1lYUXBLVHRjYmlBZ0lDQjJZWElnYVNBOUlIUnZTVzUwWldkbGNpaHdiM01wTzF4dUlDQWdJSFpoY2lCc0lEMGdjeTVzWlc1bmRHZzdYRzRnSUNBZ2RtRnlJR0VzSUdJN1hHNGdJQ0FnYVdZZ0tHa2dQQ0F3SUh4OElHa2dQajBnYkNrZ2NtVjBkWEp1SUZSUFgxTlVVa2xPUnlBL0lDY25JRG9nZFc1a1pXWnBibVZrTzF4dUlDQWdJR0VnUFNCekxtTm9ZWEpEYjJSbFFYUW9hU2s3WEc0Z0lDQWdjbVYwZFhKdUlHRWdQQ0F3ZUdRNE1EQWdmSHdnWVNBK0lEQjRaR0ptWmlCOGZDQnBJQ3NnTVNBOVBUMGdiQ0I4ZkNBb1lpQTlJSE11WTJoaGNrTnZaR1ZCZENocElDc2dNU2twSUR3Z01IaGtZekF3SUh4OElHSWdQaUF3ZUdSbVptWmNiaUFnSUNBZ0lEOGdWRTlmVTFSU1NVNUhJRDhnY3k1amFHRnlRWFFvYVNrZ09pQmhYRzRnSUNBZ0lDQTZJRlJQWDFOVVVrbE9SeUEvSUhNdWMyeHBZMlVvYVN3Z2FTQXJJRElwSURvZ0tHRWdMU0F3ZUdRNE1EQWdQRHdnTVRBcElDc2dLR0lnTFNBd2VHUmpNREFwSUNzZ01IZ3hNREF3TUR0Y2JpQWdmVHRjYm4wN1hHNGlMQ0oyWVhJZ1kzUjRJRDBnY21WeGRXbHlaU2duTGk5ZlkzUjRKeWs3WEc1MllYSWdhVzUyYjJ0bElEMGdjbVZ4ZFdseVpTZ25MaTlmYVc1MmIydGxKeWs3WEc1MllYSWdhSFJ0YkNBOUlISmxjWFZwY21Vb0p5NHZYMmgwYld3bktUdGNiblpoY2lCalpXd2dQU0J5WlhGMWFYSmxLQ2N1TDE5a2IyMHRZM0psWVhSbEp5azdYRzUyWVhJZ1oyeHZZbUZzSUQwZ2NtVnhkV2x5WlNnbkxpOWZaMnh2WW1Gc0p5azdYRzUyWVhJZ2NISnZZMlZ6Y3lBOUlHZHNiMkpoYkM1d2NtOWpaWE56TzF4dWRtRnlJSE5sZEZSaGMyc2dQU0JuYkc5aVlXd3VjMlYwU1cxdFpXUnBZWFJsTzF4dWRtRnlJR05zWldGeVZHRnpheUE5SUdkc2IySmhiQzVqYkdWaGNrbHRiV1ZrYVdGMFpUdGNiblpoY2lCTlpYTnpZV2RsUTJoaGJtNWxiQ0E5SUdkc2IySmhiQzVOWlhOellXZGxRMmhoYm01bGJEdGNiblpoY2lCRWFYTndZWFJqYUNBOUlHZHNiMkpoYkM1RWFYTndZWFJqYUR0Y2JuWmhjaUJqYjNWdWRHVnlJRDBnTUR0Y2JuWmhjaUJ4ZFdWMVpTQTlJSHQ5TzF4dWRtRnlJRTlPVWtWQlJGbFRWRUZVUlVOSVFVNUhSU0E5SUNkdmJuSmxZV1I1YzNSaGRHVmphR0Z1WjJVbk8xeHVkbUZ5SUdSbFptVnlMQ0JqYUdGdWJtVnNMQ0J3YjNKME8xeHVkbUZ5SUhKMWJpQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdkbUZ5SUdsa0lEMGdLM1JvYVhNN1hHNGdJQzh2SUdWemJHbHVkQzFrYVhOaFlteGxMVzVsZUhRdGJHbHVaU0J1Ynkxd2NtOTBiM1I1Y0dVdFluVnBiSFJwYm5OY2JpQWdhV1lnS0hGMVpYVmxMbWhoYzA5M2JsQnliM0JsY25SNUtHbGtLU2tnZTF4dUlDQWdJSFpoY2lCbWJpQTlJSEYxWlhWbFcybGtYVHRjYmlBZ0lDQmtaV3hsZEdVZ2NYVmxkV1ZiYVdSZE8xeHVJQ0FnSUdadUtDazdYRzRnSUgxY2JuMDdYRzUyWVhJZ2JHbHpkR1Z1WlhJZ1BTQm1kVzVqZEdsdmJpQW9aWFpsYm5RcElIdGNiaUFnY25WdUxtTmhiR3dvWlhabGJuUXVaR0YwWVNrN1hHNTlPMXh1THk4Z1RtOWtaUzVxY3lBd0xqa3JJQ1lnU1VVeE1Dc2dhR0Z6SUhObGRFbHRiV1ZrYVdGMFpTd2diM1JvWlhKM2FYTmxPbHh1YVdZZ0tDRnpaWFJVWVhOcklIeDhJQ0ZqYkdWaGNsUmhjMnNwSUh0Y2JpQWdjMlYwVkdGemF5QTlJR1oxYm1OMGFXOXVJSE5sZEVsdGJXVmthV0YwWlNobWJpa2dlMXh1SUNBZ0lIWmhjaUJoY21keklEMGdXMTA3WEc0Z0lDQWdkbUZ5SUdrZ1BTQXhPMXh1SUNBZ0lIZG9hV3hsSUNoaGNtZDFiV1Z1ZEhNdWJHVnVaM1JvSUQ0Z2FTa2dZWEpuY3k1d2RYTm9LR0Z5WjNWdFpXNTBjMXRwS3l0ZEtUdGNiaUFnSUNCeGRXVjFaVnNySzJOdmRXNTBaWEpkSUQwZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdMeThnWlhOc2FXNTBMV1JwYzJGaWJHVXRibVY0ZEMxc2FXNWxJRzV2TFc1bGR5MW1kVzVqWEc0Z0lDQWdJQ0JwYm5admEyVW9kSGx3Wlc5bUlHWnVJRDA5SUNkbWRXNWpkR2x2YmljZ1B5Qm1iaUE2SUVaMWJtTjBhVzl1S0dadUtTd2dZWEpuY3lrN1hHNGdJQ0FnZlR0Y2JpQWdJQ0JrWldabGNpaGpiM1Z1ZEdWeUtUdGNiaUFnSUNCeVpYUjFjbTRnWTI5MWJuUmxjanRjYmlBZ2ZUdGNiaUFnWTJ4bFlYSlVZWE5ySUQwZ1puVnVZM1JwYjI0Z1kyeGxZWEpKYlcxbFpHbGhkR1VvYVdRcElIdGNiaUFnSUNCa1pXeGxkR1VnY1hWbGRXVmJhV1JkTzF4dUlDQjlPMXh1SUNBdkx5Qk9iMlJsTG1weklEQXVPQzFjYmlBZ2FXWWdLSEpsY1hWcGNtVW9KeTR2WDJOdlppY3BLSEJ5YjJObGMzTXBJRDA5SUNkd2NtOWpaWE56SnlrZ2UxeHVJQ0FnSUdSbFptVnlJRDBnWm5WdVkzUnBiMjRnS0dsa0tTQjdYRzRnSUNBZ0lDQndjbTlqWlhOekxtNWxlSFJVYVdOcktHTjBlQ2h5ZFc0c0lHbGtMQ0F4S1NrN1hHNGdJQ0FnZlR0Y2JpQWdMeThnVTNCb1pYSmxJQ2hLVXlCbllXMWxJR1Z1WjJsdVpTa2dSR2x6Y0dGMFkyZ2dRVkJKWEc0Z0lIMGdaV3h6WlNCcFppQW9SR2x6Y0dGMFkyZ2dKaVlnUkdsemNHRjBZMmd1Ym05M0tTQjdYRzRnSUNBZ1pHVm1aWElnUFNCbWRXNWpkR2x2YmlBb2FXUXBJSHRjYmlBZ0lDQWdJRVJwYzNCaGRHTm9MbTV2ZHloamRIZ29jblZ1TENCcFpDd2dNU2twTzF4dUlDQWdJSDA3WEc0Z0lDOHZJRUp5YjNkelpYSnpJSGRwZEdnZ1RXVnpjMkZuWlVOb1lXNXVaV3dzSUdsdVkyeDFaR1Z6SUZkbFlsZHZjbXRsY25OY2JpQWdmU0JsYkhObElHbG1JQ2hOWlhOellXZGxRMmhoYm01bGJDa2dlMXh1SUNBZ0lHTm9ZVzV1Wld3Z1BTQnVaWGNnVFdWemMyRm5aVU5vWVc1dVpXd29LVHRjYmlBZ0lDQndiM0owSUQwZ1kyaGhibTVsYkM1d2IzSjBNanRjYmlBZ0lDQmphR0Z1Ym1Wc0xuQnZjblF4TG05dWJXVnpjMkZuWlNBOUlHeHBjM1JsYm1WeU8xeHVJQ0FnSUdSbFptVnlJRDBnWTNSNEtIQnZjblF1Y0c5emRFMWxjM05oWjJVc0lIQnZjblFzSURFcE8xeHVJQ0F2THlCQ2NtOTNjMlZ5Y3lCM2FYUm9JSEJ2YzNSTlpYTnpZV2RsTENCemEybHdJRmRsWWxkdmNtdGxjbk5jYmlBZ0x5OGdTVVU0SUdoaGN5QndiM04wVFdWemMyRm5aU3dnWW5WMElHbDBKM01nYzNsdVl5QW1JSFI1Y0dWdlppQnBkSE1nY0c5emRFMWxjM05oWjJVZ2FYTWdKMjlpYW1WamRDZGNiaUFnZlNCbGJITmxJR2xtSUNobmJHOWlZV3d1WVdSa1JYWmxiblJNYVhOMFpXNWxjaUFtSmlCMGVYQmxiMllnY0c5emRFMWxjM05oWjJVZ1BUMGdKMloxYm1OMGFXOXVKeUFtSmlBaFoyeHZZbUZzTG1sdGNHOXlkRk5qY21sd2RITXBJSHRjYmlBZ0lDQmtaV1psY2lBOUlHWjFibU4wYVc5dUlDaHBaQ2tnZTF4dUlDQWdJQ0FnWjJ4dlltRnNMbkJ2YzNSTlpYTnpZV2RsS0dsa0lDc2dKeWNzSUNjcUp5azdYRzRnSUNBZ2ZUdGNiaUFnSUNCbmJHOWlZV3d1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWduYldWemMyRm5aU2NzSUd4cGMzUmxibVZ5TENCbVlXeHpaU2s3WEc0Z0lDOHZJRWxGT0MxY2JpQWdmU0JsYkhObElHbG1JQ2hQVGxKRlFVUlpVMVJCVkVWRFNFRk9SMFVnYVc0Z1kyVnNLQ2R6WTNKcGNIUW5LU2tnZTF4dUlDQWdJR1JsWm1WeUlEMGdablZ1WTNScGIyNGdLR2xrS1NCN1hHNGdJQ0FnSUNCb2RHMXNMbUZ3Y0dWdVpFTm9hV3hrS0dObGJDZ25jMk55YVhCMEp5a3BXMDlPVWtWQlJGbFRWRUZVUlVOSVFVNUhSVjBnUFNCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJR2gwYld3dWNtVnRiM1psUTJocGJHUW9kR2hwY3lrN1hHNGdJQ0FnSUNBZ0lISjFiaTVqWVd4c0tHbGtLVHRjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmVHRjYmlBZ0x5OGdVbVZ6ZENCdmJHUWdZbkp2ZDNObGNuTmNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQmtaV1psY2lBOUlHWjFibU4wYVc5dUlDaHBaQ2tnZTF4dUlDQWdJQ0FnYzJWMFZHbHRaVzkxZENoamRIZ29jblZ1TENCcFpDd2dNU2tzSURBcE8xeHVJQ0FnSUgwN1hHNGdJSDFjYm4xY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2UxeHVJQ0J6WlhRNklITmxkRlJoYzJzc1hHNGdJR05zWldGeU9pQmpiR1ZoY2xSaGMydGNibjA3WEc0aUxDSjJZWElnZEc5SmJuUmxaMlZ5SUQwZ2NtVnhkV2x5WlNnbkxpOWZkRzh0YVc1MFpXZGxjaWNwTzF4dWRtRnlJRzFoZUNBOUlFMWhkR2d1YldGNE8xeHVkbUZ5SUcxcGJpQTlJRTFoZEdndWJXbHVPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtZFc1amRHbHZiaUFvYVc1a1pYZ3NJR3hsYm1kMGFDa2dlMXh1SUNCcGJtUmxlQ0E5SUhSdlNXNTBaV2RsY2locGJtUmxlQ2s3WEc0Z0lISmxkSFZ5YmlCcGJtUmxlQ0E4SURBZ1B5QnRZWGdvYVc1a1pYZ2dLeUJzWlc1bmRHZ3NJREFwSURvZ2JXbHVLR2x1WkdWNExDQnNaVzVuZEdncE8xeHVmVHRjYmlJc0lpOHZJRGN1TVM0MElGUnZTVzUwWldkbGNseHVkbUZ5SUdObGFXd2dQU0JOWVhSb0xtTmxhV3c3WEc1MllYSWdabXh2YjNJZ1BTQk5ZWFJvTG1ac2IyOXlPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JtZFc1amRHbHZiaUFvYVhRcElIdGNiaUFnY21WMGRYSnVJR2x6VG1GT0tHbDBJRDBnSzJsMEtTQS9JREFnT2lBb2FYUWdQaUF3SUQ4Z1pteHZiM0lnT2lCalpXbHNLU2hwZENrN1hHNTlPMXh1SWl3aUx5OGdkRzhnYVc1a1pYaGxaQ0J2WW1wbFkzUXNJSFJ2VDJKcVpXTjBJSGRwZEdnZ1ptRnNiR0poWTJzZ1ptOXlJRzV2YmkxaGNuSmhlUzFzYVd0bElFVlRNeUJ6ZEhKcGJtZHpYRzUyWVhJZ1NVOWlhbVZqZENBOUlISmxjWFZwY21Vb0p5NHZYMmx2WW1wbFkzUW5LVHRjYm5aaGNpQmtaV1pwYm1Wa0lEMGdjbVZ4ZFdseVpTZ25MaTlmWkdWbWFXNWxaQ2NwTzF4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCbWRXNWpkR2x2YmlBb2FYUXBJSHRjYmlBZ2NtVjBkWEp1SUVsUFltcGxZM1FvWkdWbWFXNWxaQ2hwZENrcE8xeHVmVHRjYmlJc0lpOHZJRGN1TVM0eE5TQlViMHhsYm1kMGFGeHVkbUZ5SUhSdlNXNTBaV2RsY2lBOUlISmxjWFZwY21Vb0p5NHZYM1J2TFdsdWRHVm5aWEluS1R0Y2JuWmhjaUJ0YVc0Z1BTQk5ZWFJvTG0xcGJqdGNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdablZ1WTNScGIyNGdLR2wwS1NCN1hHNGdJSEpsZEhWeWJpQnBkQ0ErSURBZ1B5QnRhVzRvZEc5SmJuUmxaMlZ5S0dsMEtTd2dNSGd4Wm1abVptWm1abVptWm1abVppa2dPaUF3T3lBdkx5QndiM2NvTWl3Z05UTXBJQzBnTVNBOVBTQTVNREEzTVRrNU1qVTBOelF3T1RreFhHNTlPMXh1SWl3aUx5OGdOeTR4TGpFeklGUnZUMkpxWldOMEtHRnlaM1Z0Wlc1MEtWeHVkbUZ5SUdSbFptbHVaV1FnUFNCeVpYRjFhWEpsS0NjdUwxOWtaV1pwYm1Wa0p5azdYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1oxYm1OMGFXOXVJQ2hwZENrZ2UxeHVJQ0J5WlhSMWNtNGdUMkpxWldOMEtHUmxabWx1WldRb2FYUXBLVHRjYm4wN1hHNGlMQ0l2THlBM0xqRXVNU0JVYjFCeWFXMXBkR2wyWlNocGJuQjFkQ0JiTENCUWNtVm1aWEp5WldSVWVYQmxYU2xjYm5aaGNpQnBjMDlpYW1WamRDQTlJSEpsY1hWcGNtVW9KeTR2WDJsekxXOWlhbVZqZENjcE8xeHVMeThnYVc1emRHVmhaQ0J2WmlCMGFHVWdSVk0ySUhOd1pXTWdkbVZ5YzJsdmJpd2dkMlVnWkdsa2JpZDBJR2x0Y0d4bGJXVnVkQ0JBUUhSdlVISnBiV2wwYVhabElHTmhjMlZjYmk4dklHRnVaQ0IwYUdVZ2MyVmpiMjVrSUdGeVozVnRaVzUwSUMwZ1pteGhaeUF0SUhCeVpXWmxjbkpsWkNCMGVYQmxJR2x6SUdFZ2MzUnlhVzVuWEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNocGRDd2dVeWtnZTF4dUlDQnBaaUFvSVdselQySnFaV04wS0dsMEtTa2djbVYwZFhKdUlHbDBPMXh1SUNCMllYSWdabTRzSUhaaGJEdGNiaUFnYVdZZ0tGTWdKaVlnZEhsd1pXOW1JQ2htYmlBOUlHbDBMblJ2VTNSeWFXNW5LU0E5UFNBblpuVnVZM1JwYjI0bklDWW1JQ0ZwYzA5aWFtVmpkQ2gyWVd3Z1BTQm1iaTVqWVd4c0tHbDBLU2twSUhKbGRIVnliaUIyWVd3N1hHNGdJR2xtSUNoMGVYQmxiMllnS0dadUlEMGdhWFF1ZG1Gc2RXVlBaaWtnUFQwZ0oyWjFibU4wYVc5dUp5QW1KaUFoYVhOUFltcGxZM1FvZG1Gc0lEMGdabTR1WTJGc2JDaHBkQ2twS1NCeVpYUjFjbTRnZG1Gc08xeHVJQ0JwWmlBb0lWTWdKaVlnZEhsd1pXOW1JQ2htYmlBOUlHbDBMblJ2VTNSeWFXNW5LU0E5UFNBblpuVnVZM1JwYjI0bklDWW1JQ0ZwYzA5aWFtVmpkQ2gyWVd3Z1BTQm1iaTVqWVd4c0tHbDBLU2twSUhKbGRIVnliaUIyWVd3N1hHNGdJSFJvY205M0lGUjVjR1ZGY25KdmNpaGNJa05oYmlkMElHTnZiblpsY25RZ2IySnFaV04wSUhSdklIQnlhVzFwZEdsMlpTQjJZV3gxWlZ3aUtUdGNibjA3WEc0aUxDSjJZWElnYVdRZ1BTQXdPMXh1ZG1GeUlIQjRJRDBnVFdGMGFDNXlZVzVrYjIwb0tUdGNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdablZ1WTNScGIyNGdLR3RsZVNrZ2UxeHVJQ0J5WlhSMWNtNGdKMU41YldKdmJDZ25MbU52Ym1OaGRDaHJaWGtnUFQwOUlIVnVaR1ZtYVc1bFpDQS9JQ2NuSURvZ2EyVjVMQ0FuS1Y4bkxDQW9LeXRwWkNBcklIQjRLUzUwYjFOMGNtbHVaeWd6TmlrcE8xeHVmVHRjYmlJc0luWmhjaUJuYkc5aVlXd2dQU0J5WlhGMWFYSmxLQ2N1TDE5bmJHOWlZV3duS1R0Y2JuWmhjaUJ1WVhacFoyRjBiM0lnUFNCbmJHOWlZV3d1Ym1GMmFXZGhkRzl5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHNWhkbWxuWVhSdmNpQW1KaUJ1WVhacFoyRjBiM0l1ZFhObGNrRm5aVzUwSUh4OElDY25PMXh1SWl3aWRtRnlJSE4wYjNKbElEMGdjbVZ4ZFdseVpTZ25MaTlmYzJoaGNtVmtKeWtvSjNkcmN5Y3BPMXh1ZG1GeUlIVnBaQ0E5SUhKbGNYVnBjbVVvSnk0dlgzVnBaQ2NwTzF4dWRtRnlJRk41YldKdmJDQTlJSEpsY1hWcGNtVW9KeTR2WDJkc2IySmhiQ2NwTGxONWJXSnZiRHRjYm5aaGNpQlZVMFZmVTFsTlFrOU1JRDBnZEhsd1pXOW1JRk41YldKdmJDQTlQU0FuWm5WdVkzUnBiMjRuTzF4dVhHNTJZWElnSkdWNGNHOXlkSE1nUFNCdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUdaMWJtTjBhVzl1SUNodVlXMWxLU0I3WEc0Z0lISmxkSFZ5YmlCemRHOXlaVnR1WVcxbFhTQjhmQ0FvYzNSdmNtVmJibUZ0WlYwZ1BWeHVJQ0FnSUZWVFJWOVRXVTFDVDB3Z0ppWWdVM2x0WW05c1cyNWhiV1ZkSUh4OElDaFZVMFZmVTFsTlFrOU1JRDhnVTNsdFltOXNJRG9nZFdsa0tTZ25VM2x0WW05c0xpY2dLeUJ1WVcxbEtTazdYRzU5TzF4dVhHNGtaWGh3YjNKMGN5NXpkRzl5WlNBOUlITjBiM0psTzF4dUlpd2lkbUZ5SUdOc1lYTnpiMllnUFNCeVpYRjFhWEpsS0NjdUwxOWpiR0Z6YzI5bUp5azdYRzUyWVhJZ1NWUkZVa0ZVVDFJZ1BTQnlaWEYxYVhKbEtDY3VMMTkzYTNNbktTZ25hWFJsY21GMGIzSW5LVHRjYm5aaGNpQkpkR1Z5WVhSdmNuTWdQU0J5WlhGMWFYSmxLQ2N1TDE5cGRHVnlZWFJ2Y25NbktUdGNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdjbVZ4ZFdseVpTZ25MaTlmWTI5eVpTY3BMbWRsZEVsMFpYSmhkRzl5VFdWMGFHOWtJRDBnWm5WdVkzUnBiMjRnS0dsMEtTQjdYRzRnSUdsbUlDaHBkQ0FoUFNCMWJtUmxabWx1WldRcElISmxkSFZ5YmlCcGRGdEpWRVZTUVZSUFVsMWNiaUFnSUNCOGZDQnBkRnNuUUVCcGRHVnlZWFJ2Y2lkZFhHNGdJQ0FnZkh3Z1NYUmxjbUYwYjNKelcyTnNZWE56YjJZb2FYUXBYVHRjYm4wN1hHNGlMQ0oyWVhJZ1lXNVBZbXBsWTNRZ1BTQnlaWEYxYVhKbEtDY3VMMTloYmkxdlltcGxZM1FuS1R0Y2JuWmhjaUJuWlhRZ1BTQnlaWEYxYVhKbEtDY3VMMk52Y21VdVoyVjBMV2wwWlhKaGRHOXlMVzFsZEdodlpDY3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5WlhGMWFYSmxLQ2N1TDE5amIzSmxKeWt1WjJWMFNYUmxjbUYwYjNJZ1BTQm1kVzVqZEdsdmJpQW9hWFFwSUh0Y2JpQWdkbUZ5SUdsMFpYSkdiaUE5SUdkbGRDaHBkQ2s3WEc0Z0lHbG1JQ2gwZVhCbGIyWWdhWFJsY2tadUlDRTlJQ2RtZFc1amRHbHZiaWNwSUhSb2NtOTNJRlI1Y0dWRmNuSnZjaWhwZENBcklDY2dhWE1nYm05MElHbDBaWEpoWW14bElTY3BPMXh1SUNCeVpYUjFjbTRnWVc1UFltcGxZM1FvYVhSbGNrWnVMbU5oYkd3b2FYUXBLVHRjYm4wN1hHNGlMQ0oyWVhJZ1kyeGhjM052WmlBOUlISmxjWFZwY21Vb0p5NHZYMk5zWVhOemIyWW5LVHRjYm5aaGNpQkpWRVZTUVZSUFVpQTlJSEpsY1hWcGNtVW9KeTR2WDNkcmN5Y3BLQ2RwZEdWeVlYUnZjaWNwTzF4dWRtRnlJRWwwWlhKaGRHOXljeUE5SUhKbGNYVnBjbVVvSnk0dlgybDBaWEpoZEc5eWN5Y3BPMXh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5WlhGMWFYSmxLQ2N1TDE5amIzSmxKeWt1YVhOSmRHVnlZV0pzWlNBOUlHWjFibU4wYVc5dUlDaHBkQ2tnZTF4dUlDQjJZWElnVHlBOUlFOWlhbVZqZENocGRDazdYRzRnSUhKbGRIVnliaUJQVzBsVVJWSkJWRTlTWFNBaFBUMGdkVzVrWldacGJtVmtYRzRnSUNBZ2ZId2dKMEJBYVhSbGNtRjBiM0luSUdsdUlFOWNiaUFnSUNBdkx5QmxjMnhwYm5RdFpHbHpZV0pzWlMxdVpYaDBMV3hwYm1VZ2JtOHRjSEp2ZEc5MGVYQmxMV0oxYVd4MGFXNXpYRzRnSUNBZ2ZId2dTWFJsY21GMGIzSnpMbWhoYzA5M2JsQnliM0JsY25SNUtHTnNZWE56YjJZb1R5a3BPMXh1ZlR0Y2JpSXNJaWQxYzJVZ2MzUnlhV04wSnp0Y2JuWmhjaUJoWkdSVWIxVnVjMk52Y0dGaWJHVnpJRDBnY21WeGRXbHlaU2duTGk5ZllXUmtMWFJ2TFhWdWMyTnZjR0ZpYkdWekp5azdYRzUyWVhJZ2MzUmxjQ0E5SUhKbGNYVnBjbVVvSnk0dlgybDBaWEl0YzNSbGNDY3BPMXh1ZG1GeUlFbDBaWEpoZEc5eWN5QTlJSEpsY1hWcGNtVW9KeTR2WDJsMFpYSmhkRzl5Y3ljcE8xeHVkbUZ5SUhSdlNVOWlhbVZqZENBOUlISmxjWFZwY21Vb0p5NHZYM1J2TFdsdlltcGxZM1FuS1R0Y2JseHVMeThnTWpJdU1TNHpMalFnUVhKeVlYa3VjSEp2ZEc5MGVYQmxMbVZ1ZEhKcFpYTW9LVnh1THk4Z01qSXVNUzR6TGpFeklFRnljbUY1TG5CeWIzUnZkSGx3WlM1clpYbHpLQ2xjYmk4dklESXlMakV1TXk0eU9TQkJjbkpoZVM1d2NtOTBiM1I1Y0dVdWRtRnNkV1Z6S0NsY2JpOHZJREl5TGpFdU15NHpNQ0JCY25KaGVTNXdjbTkwYjNSNWNHVmJRRUJwZEdWeVlYUnZjbDBvS1Z4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCeVpYRjFhWEpsS0NjdUwxOXBkR1Z5TFdSbFptbHVaU2NwS0VGeWNtRjVMQ0FuUVhKeVlYa25MQ0JtZFc1amRHbHZiaUFvYVhSbGNtRjBaV1FzSUd0cGJtUXBJSHRjYmlBZ2RHaHBjeTVmZENBOUlIUnZTVTlpYW1WamRDaHBkR1Z5WVhSbFpDazdJQzh2SUhSaGNtZGxkRnh1SUNCMGFHbHpMbDlwSUQwZ01Ec2dJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnYm1WNGRDQnBibVJsZUZ4dUlDQjBhR2x6TGw5cklEMGdhMmx1WkRzZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnTHk4Z2EybHVaRnh1THk4Z01qSXVNUzQxTGpJdU1TQWxRWEp5WVhsSmRHVnlZWFJ2Y2xCeWIzUnZkSGx3WlNVdWJtVjRkQ2dwWEc1OUxDQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lIWmhjaUJQSUQwZ2RHaHBjeTVmZER0Y2JpQWdkbUZ5SUd0cGJtUWdQU0IwYUdsekxsOXJPMXh1SUNCMllYSWdhVzVrWlhnZ1BTQjBhR2x6TGw5cEt5czdYRzRnSUdsbUlDZ2hUeUI4ZkNCcGJtUmxlQ0ErUFNCUExteGxibWQwYUNrZ2UxeHVJQ0FnSUhSb2FYTXVYM1FnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnY21WMGRYSnVJSE4wWlhBb01TazdYRzRnSUgxY2JpQWdhV1lnS0d0cGJtUWdQVDBnSjJ0bGVYTW5LU0J5WlhSMWNtNGdjM1JsY0Nnd0xDQnBibVJsZUNrN1hHNGdJR2xtSUNocmFXNWtJRDA5SUNkMllXeDFaWE1uS1NCeVpYUjFjbTRnYzNSbGNDZ3dMQ0JQVzJsdVpHVjRYU2s3WEc0Z0lISmxkSFZ5YmlCemRHVndLREFzSUZ0cGJtUmxlQ3dnVDF0cGJtUmxlRjFkS1R0Y2JuMHNJQ2QyWVd4MVpYTW5LVHRjYmx4dUx5OGdZWEpuZFcxbGJuUnpUR2x6ZEZ0QVFHbDBaWEpoZEc5eVhTQnBjeUFsUVhKeVlYbFFjbTkwYjE5MllXeDFaWE1sSUNnNUxqUXVOQzQyTENBNUxqUXVOQzQzS1Z4dVNYUmxjbUYwYjNKekxrRnlaM1Z0Wlc1MGN5QTlJRWwwWlhKaGRHOXljeTVCY25KaGVUdGNibHh1WVdSa1ZHOVZibk5qYjNCaFlteGxjeWduYTJWNWN5Y3BPMXh1WVdSa1ZHOVZibk5qYjNCaFlteGxjeWduZG1Gc2RXVnpKeWs3WEc1aFpHUlViMVZ1YzJOdmNHRmliR1Z6S0NkbGJuUnlhV1Z6SnlrN1hHNGlMQ0lpTENJbmRYTmxJSE4wY21samRDYzdYRzUyWVhJZ1RFbENVa0ZTV1NBOUlISmxjWFZwY21Vb0p5NHZYMnhwWW5KaGNua25LVHRjYm5aaGNpQm5iRzlpWVd3Z1BTQnlaWEYxYVhKbEtDY3VMMTluYkc5aVlXd25LVHRjYm5aaGNpQmpkSGdnUFNCeVpYRjFhWEpsS0NjdUwxOWpkSGduS1R0Y2JuWmhjaUJqYkdGemMyOW1JRDBnY21WeGRXbHlaU2duTGk5ZlkyeGhjM052WmljcE8xeHVkbUZ5SUNSbGVIQnZjblFnUFNCeVpYRjFhWEpsS0NjdUwxOWxlSEJ2Y25RbktUdGNiblpoY2lCcGMwOWlhbVZqZENBOUlISmxjWFZwY21Vb0p5NHZYMmx6TFc5aWFtVmpkQ2NwTzF4dWRtRnlJR0ZHZFc1amRHbHZiaUE5SUhKbGNYVnBjbVVvSnk0dlgyRXRablZ1WTNScGIyNG5LVHRjYm5aaGNpQmhia2x1YzNSaGJtTmxJRDBnY21WeGRXbHlaU2duTGk5ZllXNHRhVzV6ZEdGdVkyVW5LVHRjYm5aaGNpQm1iM0pQWmlBOUlISmxjWFZwY21Vb0p5NHZYMlp2Y2kxdlppY3BPMXh1ZG1GeUlITndaV05wWlhORGIyNXpkSEoxWTNSdmNpQTlJSEpsY1hWcGNtVW9KeTR2WDNOd1pXTnBaWE10WTI5dWMzUnlkV04wYjNJbktUdGNiblpoY2lCMFlYTnJJRDBnY21WeGRXbHlaU2duTGk5ZmRHRnpheWNwTG5ObGREdGNiblpoY2lCdGFXTnliM1JoYzJzZ1BTQnlaWEYxYVhKbEtDY3VMMTl0YVdOeWIzUmhjMnNuS1NncE8xeHVkbUZ5SUc1bGQxQnliMjFwYzJWRFlYQmhZbWxzYVhSNVRXOWtkV3hsSUQwZ2NtVnhkV2x5WlNnbkxpOWZibVYzTFhCeWIyMXBjMlV0WTJGd1lXSnBiR2wwZVNjcE8xeHVkbUZ5SUhCbGNtWnZjbTBnUFNCeVpYRjFhWEpsS0NjdUwxOXdaWEptYjNKdEp5azdYRzUyWVhJZ2RYTmxja0ZuWlc1MElEMGdjbVZ4ZFdseVpTZ25MaTlmZFhObGNpMWhaMlZ1ZENjcE8xeHVkbUZ5SUhCeWIyMXBjMlZTWlhOdmJIWmxJRDBnY21WeGRXbHlaU2duTGk5ZmNISnZiV2x6WlMxeVpYTnZiSFpsSnlrN1hHNTJZWElnVUZKUFRVbFRSU0E5SUNkUWNtOXRhWE5sSnp0Y2JuWmhjaUJVZVhCbFJYSnliM0lnUFNCbmJHOWlZV3d1Vkhsd1pVVnljbTl5TzF4dWRtRnlJSEJ5YjJObGMzTWdQU0JuYkc5aVlXd3VjSEp2WTJWemN6dGNiblpoY2lCMlpYSnphVzl1Y3lBOUlIQnliMk5sYzNNZ0ppWWdjSEp2WTJWemN5NTJaWEp6YVc5dWN6dGNiblpoY2lCMk9DQTlJSFpsY25OcGIyNXpJQ1ltSUhabGNuTnBiMjV6TG5ZNElIeDhJQ2NuTzF4dWRtRnlJQ1JRY205dGFYTmxJRDBnWjJ4dlltRnNXMUJTVDAxSlUwVmRPMXh1ZG1GeUlHbHpUbTlrWlNBOUlHTnNZWE56YjJZb2NISnZZMlZ6Y3lrZ1BUMGdKM0J5YjJObGMzTW5PMXh1ZG1GeUlHVnRjSFI1SUQwZ1puVnVZM1JwYjI0Z0tDa2dleUF2S2lCbGJYQjBlU0FxTHlCOU8xeHVkbUZ5SUVsdWRHVnlibUZzTENCdVpYZEhaVzVsY21salVISnZiV2x6WlVOaGNHRmlhV3hwZEhrc0lFOTNibEJ5YjIxcGMyVkRZWEJoWW1sc2FYUjVMQ0JYY21Gd2NHVnlPMXh1ZG1GeUlHNWxkMUJ5YjIxcGMyVkRZWEJoWW1sc2FYUjVJRDBnYm1WM1IyVnVaWEpwWTFCeWIyMXBjMlZEWVhCaFltbHNhWFI1SUQwZ2JtVjNVSEp2YldselpVTmhjR0ZpYVd4cGRIbE5iMlIxYkdVdVpqdGNibHh1ZG1GeUlGVlRSVjlPUVZSSlZrVWdQU0FoSVdaMWJtTjBhVzl1SUNncElIdGNiaUFnZEhKNUlIdGNiaUFnSUNBdkx5QmpiM0p5WldOMElITjFZbU5zWVhOemFXNW5JSGRwZEdnZ1FFQnpjR1ZqYVdWeklITjFjSEJ2Y25SY2JpQWdJQ0IyWVhJZ2NISnZiV2x6WlNBOUlDUlFjbTl0YVhObExuSmxjMjlzZG1Vb01TazdYRzRnSUNBZ2RtRnlJRVpoYTJWUWNtOXRhWE5sSUQwZ0tIQnliMjFwYzJVdVkyOXVjM1J5ZFdOMGIzSWdQU0I3ZlNsYmNtVnhkV2x5WlNnbkxpOWZkMnR6Snlrb0ozTndaV05wWlhNbktWMGdQU0JtZFc1amRHbHZiaUFvWlhobFl5a2dlMXh1SUNBZ0lDQWdaWGhsWXlobGJYQjBlU3dnWlcxd2RIa3BPMXh1SUNBZ0lIMDdYRzRnSUNBZ0x5OGdkVzVvWVc1a2JHVmtJSEpsYW1WamRHbHZibk1nZEhKaFkydHBibWNnYzNWd2NHOXlkQ3dnVG05a1pVcFRJRkJ5YjIxcGMyVWdkMmwwYUc5MWRDQnBkQ0JtWVdsc2N5QkFRSE53WldOcFpYTWdkR1Z6ZEZ4dUlDQWdJSEpsZEhWeWJpQW9hWE5PYjJSbElIeDhJSFI1Y0dWdlppQlFjbTl0YVhObFVtVnFaV04wYVc5dVJYWmxiblFnUFQwZ0oyWjFibU4wYVc5dUp5bGNiaUFnSUNBZ0lDWW1JSEJ5YjIxcGMyVXVkR2hsYmlobGJYQjBlU2tnYVc1emRHRnVZMlZ2WmlCR1lXdGxVSEp2YldselpWeHVJQ0FnSUNBZ0x5OGdkamdnTmk0MklDaE9iMlJsSURFd0lHRnVaQ0JEYUhKdmJXVWdOallwSUdoaGRtVWdZU0JpZFdjZ2QybDBhQ0J5WlhOdmJIWnBibWNnWTNWemRHOXRJSFJvWlc1aFlteGxjMXh1SUNBZ0lDQWdMeThnYUhSMGNITTZMeTlpZFdkekxtTm9jbTl0YVhWdExtOXlaeTl3TDJOb2NtOXRhWFZ0TDJsemMzVmxjeTlrWlhSaGFXdy9hV1E5T0RNd05UWTFYRzRnSUNBZ0lDQXZMeUIzWlNCallXNG5kQ0JrWlhSbFkzUWdhWFFnYzNsdVkyaHliMjV2ZFhOc2VTd2djMjhnYW5WemRDQmphR1ZqYXlCMlpYSnphVzl1YzF4dUlDQWdJQ0FnSmlZZ2RqZ3VhVzVrWlhoUFppZ25OaTQySnlrZ0lUMDlJREJjYmlBZ0lDQWdJQ1ltSUhWelpYSkJaMlZ1ZEM1cGJtUmxlRTltS0NkRGFISnZiV1V2TmpZbktTQTlQVDBnTFRFN1hHNGdJSDBnWTJGMFkyZ2dLR1VwSUhzZ0x5b2daVzF3ZEhrZ0tpOGdmVnh1ZlNncE8xeHVYRzR2THlCb1pXeHdaWEp6WEc1MllYSWdhWE5VYUdWdVlXSnNaU0E5SUdaMWJtTjBhVzl1SUNocGRDa2dlMXh1SUNCMllYSWdkR2hsYmp0Y2JpQWdjbVYwZFhKdUlHbHpUMkpxWldOMEtHbDBLU0FtSmlCMGVYQmxiMllnS0hSb1pXNGdQU0JwZEM1MGFHVnVLU0E5UFNBblpuVnVZM1JwYjI0bklEOGdkR2hsYmlBNklHWmhiSE5sTzF4dWZUdGNiblpoY2lCdWIzUnBabmtnUFNCbWRXNWpkR2x2YmlBb2NISnZiV2x6WlN3Z2FYTlNaV3BsWTNRcElIdGNiaUFnYVdZZ0tIQnliMjFwYzJVdVgyNHBJSEpsZEhWeWJqdGNiaUFnY0hKdmJXbHpaUzVmYmlBOUlIUnlkV1U3WEc0Z0lIWmhjaUJqYUdGcGJpQTlJSEJ5YjIxcGMyVXVYMk03WEc0Z0lHMXBZM0p2ZEdGemF5aG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdkbUZ5SUhaaGJIVmxJRDBnY0hKdmJXbHpaUzVmZGp0Y2JpQWdJQ0IyWVhJZ2Iyc2dQU0J3Y205dGFYTmxMbDl6SUQwOUlERTdYRzRnSUNBZ2RtRnlJR2tnUFNBd08xeHVJQ0FnSUhaaGNpQnlkVzRnUFNCbWRXNWpkR2x2YmlBb2NtVmhZM1JwYjI0cElIdGNiaUFnSUNBZ0lIWmhjaUJvWVc1a2JHVnlJRDBnYjJzZ1B5QnlaV0ZqZEdsdmJpNXZheUE2SUhKbFlXTjBhVzl1TG1aaGFXdzdYRzRnSUNBZ0lDQjJZWElnY21WemIyeDJaU0E5SUhKbFlXTjBhVzl1TG5KbGMyOXNkbVU3WEc0Z0lDQWdJQ0IyWVhJZ2NtVnFaV04wSUQwZ2NtVmhZM1JwYjI0dWNtVnFaV04wTzF4dUlDQWdJQ0FnZG1GeUlHUnZiV0ZwYmlBOUlISmxZV04wYVc5dUxtUnZiV0ZwYmp0Y2JpQWdJQ0FnSUhaaGNpQnlaWE4xYkhRc0lIUm9aVzRzSUdWNGFYUmxaRHRjYmlBZ0lDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hvWVc1a2JHVnlLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLQ0Z2YXlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tIQnliMjFwYzJVdVgyZ2dQVDBnTWlrZ2IyNUlZVzVrYkdWVmJtaGhibVJzWldRb2NISnZiV2x6WlNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J3Y205dGFYTmxMbDlvSUQwZ01UdGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR2hoYm1Sc1pYSWdQVDA5SUhSeWRXVXBJSEpsYzNWc2RDQTlJSFpoYkhWbE8xeHVJQ0FnSUNBZ0lDQWdJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tHUnZiV0ZwYmlrZ1pHOXRZV2x1TG1WdWRHVnlLQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWE4xYkhRZ1BTQm9ZVzVrYkdWeUtIWmhiSFZsS1RzZ0x5OGdiV0Y1SUhSb2NtOTNYRzRnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aRzl0WVdsdUtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHUnZiV0ZwYmk1bGVHbDBLQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR1Y0YVhSbFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoeVpYTjFiSFFnUFQwOUlISmxZV04wYVc5dUxuQnliMjFwYzJVcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGFtVmpkQ2hVZVhCbFJYSnliM0lvSjFCeWIyMXBjMlV0WTJoaGFXNGdZM2xqYkdVbktTazdYRzRnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJR2xtSUNoMGFHVnVJRDBnYVhOVWFHVnVZV0pzWlNoeVpYTjFiSFFwS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0IwYUdWdUxtTmhiR3dvY21WemRXeDBMQ0J5WlhOdmJIWmxMQ0J5WldwbFkzUXBPMXh1SUNBZ0lDQWdJQ0FnSUgwZ1pXeHpaU0J5WlhOdmJIWmxLSEpsYzNWc2RDazdYRzRnSUNBZ0lDQWdJSDBnWld4elpTQnlaV3BsWTNRb2RtRnNkV1VwTzF4dUlDQWdJQ0FnZlNCallYUmphQ0FvWlNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvWkc5dFlXbHVJQ1ltSUNGbGVHbDBaV1FwSUdSdmJXRnBiaTVsZUdsMEtDazdYRzRnSUNBZ0lDQWdJSEpsYW1WamRDaGxLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlPMXh1SUNBZ0lIZG9hV3hsSUNoamFHRnBiaTVzWlc1bmRHZ2dQaUJwS1NCeWRXNG9ZMmhoYVc1YmFTc3JYU2s3SUM4dklIWmhjbWxoWW14bElHeGxibWQwYUNBdElHTmhiaWQwSUhWelpTQm1iM0pGWVdOb1hHNGdJQ0FnY0hKdmJXbHpaUzVmWXlBOUlGdGRPMXh1SUNBZ0lIQnliMjFwYzJVdVgyNGdQU0JtWVd4elpUdGNiaUFnSUNCcFppQW9hWE5TWldwbFkzUWdKaVlnSVhCeWIyMXBjMlV1WDJncElHOXVWVzVvWVc1a2JHVmtLSEJ5YjIxcGMyVXBPMXh1SUNCOUtUdGNibjA3WEc1MllYSWdiMjVWYm1oaGJtUnNaV1FnUFNCbWRXNWpkR2x2YmlBb2NISnZiV2x6WlNrZ2UxeHVJQ0IwWVhOckxtTmhiR3dvWjJ4dlltRnNMQ0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnZG1GeUlIWmhiSFZsSUQwZ2NISnZiV2x6WlM1ZmRqdGNiaUFnSUNCMllYSWdkVzVvWVc1a2JHVmtJRDBnYVhOVmJtaGhibVJzWldRb2NISnZiV2x6WlNrN1hHNGdJQ0FnZG1GeUlISmxjM1ZzZEN3Z2FHRnVaR3hsY2l3Z1kyOXVjMjlzWlR0Y2JpQWdJQ0JwWmlBb2RXNW9ZVzVrYkdWa0tTQjdYRzRnSUNBZ0lDQnlaWE4xYkhRZ1BTQndaWEptYjNKdEtHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHbHpUbTlrWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJSEJ5YjJObGMzTXVaVzFwZENnbmRXNW9ZVzVrYkdWa1VtVnFaV04wYVc5dUp5d2dkbUZzZFdVc0lIQnliMjFwYzJVcE8xeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR2hoYm1Sc1pYSWdQU0JuYkc5aVlXd3ViMjUxYm1oaGJtUnNaV1J5WldwbFkzUnBiMjRwSUh0Y2JpQWdJQ0FnSUNBZ0lDQm9ZVzVrYkdWeUtIc2djSEp2YldselpUb2djSEp2YldselpTd2djbVZoYzI5dU9pQjJZV3gxWlNCOUtUdGNiaUFnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2dvWTI5dWMyOXNaU0E5SUdkc2IySmhiQzVqYjI1emIyeGxLU0FtSmlCamIyNXpiMnhsTG1WeWNtOXlLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1bGNuSnZjaWduVlc1b1lXNWtiR1ZrSUhCeWIyMXBjMlVnY21WcVpXTjBhVzl1Snl3Z2RtRnNkV1VwTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDOHZJRUp5YjNkelpYSnpJSE5vYjNWc1pDQnViM1FnZEhKcFoyZGxjaUJnY21WcVpXTjBhVzl1U0dGdVpHeGxaR0FnWlhabGJuUWdhV1lnYVhRZ2QyRnpJR2hoYm1Sc1pXUWdhR1Z5WlN3Z1RtOWtaVXBUSUMwZ2MyaHZkV3hrWEc0Z0lDQWdJQ0J3Y205dGFYTmxMbDlvSUQwZ2FYTk9iMlJsSUh4OElHbHpWVzVvWVc1a2JHVmtLSEJ5YjIxcGMyVXBJRDhnTWlBNklERTdYRzRnSUNBZ2ZTQndjbTl0YVhObExsOWhJRDBnZFc1a1pXWnBibVZrTzF4dUlDQWdJR2xtSUNoMWJtaGhibVJzWldRZ0ppWWdjbVZ6ZFd4MExtVXBJSFJvY205M0lISmxjM1ZzZEM1Mk8xeHVJQ0I5S1R0Y2JuMDdYRzUyWVhJZ2FYTlZibWhoYm1Sc1pXUWdQU0JtZFc1amRHbHZiaUFvY0hKdmJXbHpaU2tnZTF4dUlDQnlaWFIxY200Z2NISnZiV2x6WlM1ZmFDQWhQVDBnTVNBbUppQW9jSEp2YldselpTNWZZU0I4ZkNCd2NtOXRhWE5sTGw5aktTNXNaVzVuZEdnZ1BUMDlJREE3WEc1OU8xeHVkbUZ5SUc5dVNHRnVaR3hsVlc1b1lXNWtiR1ZrSUQwZ1puVnVZM1JwYjI0Z0tIQnliMjFwYzJVcElIdGNiaUFnZEdGemF5NWpZV3hzS0dkc2IySmhiQ3dnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUhaaGNpQm9ZVzVrYkdWeU8xeHVJQ0FnSUdsbUlDaHBjMDV2WkdVcElIdGNiaUFnSUNBZ0lIQnliMk5sYzNNdVpXMXBkQ2duY21WcVpXTjBhVzl1U0dGdVpHeGxaQ2NzSUhCeWIyMXBjMlVwTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvYUdGdVpHeGxjaUE5SUdkc2IySmhiQzV2Ym5KbGFtVmpkR2x2Ym1oaGJtUnNaV1FwSUh0Y2JpQWdJQ0FnSUdoaGJtUnNaWElvZXlCd2NtOXRhWE5sT2lCd2NtOXRhWE5sTENCeVpXRnpiMjQ2SUhCeWIyMXBjMlV1WDNZZ2ZTazdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMDdYRzUyWVhJZ0pISmxhbVZqZENBOUlHWjFibU4wYVc5dUlDaDJZV3gxWlNrZ2UxeHVJQ0IyWVhJZ2NISnZiV2x6WlNBOUlIUm9hWE03WEc0Z0lHbG1JQ2h3Y205dGFYTmxMbDlrS1NCeVpYUjFjbTQ3WEc0Z0lIQnliMjFwYzJVdVgyUWdQU0IwY25WbE8xeHVJQ0J3Y205dGFYTmxJRDBnY0hKdmJXbHpaUzVmZHlCOGZDQndjbTl0YVhObE95QXZMeUIxYm5keVlYQmNiaUFnY0hKdmJXbHpaUzVmZGlBOUlIWmhiSFZsTzF4dUlDQndjbTl0YVhObExsOXpJRDBnTWp0Y2JpQWdhV1lnS0NGd2NtOXRhWE5sTGw5aEtTQndjbTl0YVhObExsOWhJRDBnY0hKdmJXbHpaUzVmWXk1emJHbGpaU2dwTzF4dUlDQnViM1JwWm5rb2NISnZiV2x6WlN3Z2RISjFaU2s3WEc1OU8xeHVkbUZ5SUNSeVpYTnZiSFpsSUQwZ1puVnVZM1JwYjI0Z0tIWmhiSFZsS1NCN1hHNGdJSFpoY2lCd2NtOXRhWE5sSUQwZ2RHaHBjenRjYmlBZ2RtRnlJSFJvWlc0N1hHNGdJR2xtSUNod2NtOXRhWE5sTGw5a0tTQnlaWFIxY200N1hHNGdJSEJ5YjIxcGMyVXVYMlFnUFNCMGNuVmxPMXh1SUNCd2NtOXRhWE5sSUQwZ2NISnZiV2x6WlM1ZmR5QjhmQ0J3Y205dGFYTmxPeUF2THlCMWJuZHlZWEJjYmlBZ2RISjVJSHRjYmlBZ0lDQnBaaUFvY0hKdmJXbHpaU0E5UFQwZ2RtRnNkV1VwSUhSb2NtOTNJRlI1Y0dWRmNuSnZjaWhjSWxCeWIyMXBjMlVnWTJGdUozUWdZbVVnY21WemIyeDJaV1FnYVhSelpXeG1YQ0lwTzF4dUlDQWdJR2xtSUNoMGFHVnVJRDBnYVhOVWFHVnVZV0pzWlNoMllXeDFaU2twSUh0Y2JpQWdJQ0FnSUcxcFkzSnZkR0Z6YXlobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCM2NtRndjR1Z5SUQwZ2V5QmZkem9nY0hKdmJXbHpaU3dnWDJRNklHWmhiSE5sSUgwN0lDOHZJSGR5WVhCY2JpQWdJQ0FnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFHVnVMbU5oYkd3b2RtRnNkV1VzSUdOMGVDZ2tjbVZ6YjJ4MlpTd2dkM0poY0hCbGNpd2dNU2tzSUdOMGVDZ2tjbVZxWldOMExDQjNjbUZ3Y0dWeUxDQXhLU2s3WEc0Z0lDQWdJQ0FnSUgwZ1kyRjBZMmdnS0dVcElIdGNiaUFnSUNBZ0lDQWdJQ0FrY21WcVpXTjBMbU5oYkd3b2QzSmhjSEJsY2l3Z1pTazdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQndjbTl0YVhObExsOTJJRDBnZG1Gc2RXVTdYRzRnSUNBZ0lDQndjbTl0YVhObExsOXpJRDBnTVR0Y2JpQWdJQ0FnSUc1dmRHbG1lU2h3Y205dGFYTmxMQ0JtWVd4elpTazdYRzRnSUNBZ2ZWeHVJQ0I5SUdOaGRHTm9JQ2hsS1NCN1hHNGdJQ0FnSkhKbGFtVmpkQzVqWVd4c0tIc2dYM2M2SUhCeWIyMXBjMlVzSUY5a09pQm1ZV3h6WlNCOUxDQmxLVHNnTHk4Z2QzSmhjRnh1SUNCOVhHNTlPMXh1WEc0dkx5QmpiMjV6ZEhKMVkzUnZjaUJ3YjJ4NVptbHNiRnh1YVdZZ0tDRlZVMFZmVGtGVVNWWkZLU0I3WEc0Z0lDOHZJREkxTGpRdU15NHhJRkJ5YjIxcGMyVW9aWGhsWTNWMGIzSXBYRzRnSUNSUWNtOXRhWE5sSUQwZ1puVnVZM1JwYjI0Z1VISnZiV2x6WlNobGVHVmpkWFJ2Y2lrZ2UxeHVJQ0FnSUdGdVNXNXpkR0Z1WTJVb2RHaHBjeXdnSkZCeWIyMXBjMlVzSUZCU1QwMUpVMFVzSUNkZmFDY3BPMXh1SUNBZ0lHRkdkVzVqZEdsdmJpaGxlR1ZqZFhSdmNpazdYRzRnSUNBZ1NXNTBaWEp1WVd3dVkyRnNiQ2gwYUdsektUdGNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdaWGhsWTNWMGIzSW9ZM1I0S0NSeVpYTnZiSFpsTENCMGFHbHpMQ0F4S1N3Z1kzUjRLQ1J5WldwbFkzUXNJSFJvYVhNc0lERXBLVHRjYmlBZ0lDQjlJR05oZEdOb0lDaGxjbklwSUh0Y2JpQWdJQ0FnSUNSeVpXcGxZM1F1WTJGc2JDaDBhR2x6TENCbGNuSXBPMXh1SUNBZ0lIMWNiaUFnZlR0Y2JpQWdMeThnWlhOc2FXNTBMV1JwYzJGaWJHVXRibVY0ZEMxc2FXNWxJRzV2TFhWdWRYTmxaQzEyWVhKelhHNGdJRWx1ZEdWeWJtRnNJRDBnWm5WdVkzUnBiMjRnVUhKdmJXbHpaU2hsZUdWamRYUnZjaWtnZTF4dUlDQWdJSFJvYVhNdVgyTWdQU0JiWFRzZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUEMwZ1lYZGhhWFJwYm1jZ2NtVmhZM1JwYjI1elhHNGdJQ0FnZEdocGN5NWZZU0E5SUhWdVpHVm1hVzVsWkRzZ0lDQWdJQ0F2THlBOExTQmphR1ZqYTJWa0lHbHVJR2x6Vlc1b1lXNWtiR1ZrSUhKbFlXTjBhVzl1YzF4dUlDQWdJSFJvYVhNdVgzTWdQU0F3T3lBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUEMwZ2MzUmhkR1ZjYmlBZ0lDQjBhR2x6TGw5a0lEMGdabUZzYzJVN0lDQWdJQ0FnSUNBZ0lDOHZJRHd0SUdSdmJtVmNiaUFnSUNCMGFHbHpMbDkySUQwZ2RXNWtaV1pwYm1Wa095QWdJQ0FnSUM4dklEd3RJSFpoYkhWbFhHNGdJQ0FnZEdocGN5NWZhQ0E5SURBN0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlBOExTQnlaV3BsWTNScGIyNGdjM1JoZEdVc0lEQWdMU0JrWldaaGRXeDBMQ0F4SUMwZ2FHRnVaR3hsWkN3Z01pQXRJSFZ1YUdGdVpHeGxaRnh1SUNBZ0lIUm9hWE11WDI0Z1BTQm1ZV3h6WlRzZ0lDQWdJQ0FnSUNBZ0x5OGdQQzBnYm05MGFXWjVYRzRnSUgwN1hHNGdJRWx1ZEdWeWJtRnNMbkJ5YjNSdmRIbHdaU0E5SUhKbGNYVnBjbVVvSnk0dlgzSmxaR1ZtYVc1bExXRnNiQ2NwS0NSUWNtOXRhWE5sTG5CeWIzUnZkSGx3WlN3Z2UxeHVJQ0FnSUM4dklESTFMalF1TlM0eklGQnliMjFwYzJVdWNISnZkRzkwZVhCbExuUm9aVzRvYjI1R2RXeG1hV3hzWldRc0lHOXVVbVZxWldOMFpXUXBYRzRnSUNBZ2RHaGxiam9nWm5WdVkzUnBiMjRnZEdobGJpaHZia1oxYkdacGJHeGxaQ3dnYjI1U1pXcGxZM1JsWkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEpsWVdOMGFXOXVJRDBnYm1WM1VISnZiV2x6WlVOaGNHRmlhV3hwZEhrb2MzQmxZMmxsYzBOdmJuTjBjblZqZEc5eUtIUm9hWE1zSUNSUWNtOXRhWE5sS1NrN1hHNGdJQ0FnSUNCeVpXRmpkR2x2Ymk1dmF5QTlJSFI1Y0dWdlppQnZia1oxYkdacGJHeGxaQ0E5UFNBblpuVnVZM1JwYjI0bklEOGdiMjVHZFd4bWFXeHNaV1FnT2lCMGNuVmxPMXh1SUNBZ0lDQWdjbVZoWTNScGIyNHVabUZwYkNBOUlIUjVjR1Z2WmlCdmJsSmxhbVZqZEdWa0lEMDlJQ2RtZFc1amRHbHZiaWNnSmlZZ2IyNVNaV3BsWTNSbFpEdGNiaUFnSUNBZ0lISmxZV04wYVc5dUxtUnZiV0ZwYmlBOUlHbHpUbTlrWlNBL0lIQnliMk5sYzNNdVpHOXRZV2x1SURvZ2RXNWtaV1pwYm1Wa08xeHVJQ0FnSUNBZ2RHaHBjeTVmWXk1d2RYTm9LSEpsWVdOMGFXOXVLVHRjYmlBZ0lDQWdJR2xtSUNoMGFHbHpMbDloS1NCMGFHbHpMbDloTG5CMWMyZ29jbVZoWTNScGIyNHBPMXh1SUNBZ0lDQWdhV1lnS0hSb2FYTXVYM01wSUc1dmRHbG1lU2gwYUdsekxDQm1ZV3h6WlNrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnY21WaFkzUnBiMjR1Y0hKdmJXbHpaVHRjYmlBZ0lDQjlMRnh1SUNBZ0lDOHZJREkxTGpRdU5TNHhJRkJ5YjIxcGMyVXVjSEp2ZEc5MGVYQmxMbU5oZEdOb0tHOXVVbVZxWldOMFpXUXBYRzRnSUNBZ0oyTmhkR05vSnpvZ1puVnVZM1JwYjI0Z0tHOXVVbVZxWldOMFpXUXBJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TG5Sb1pXNG9kVzVrWldacGJtVmtMQ0J2YmxKbGFtVmpkR1ZrS1R0Y2JpQWdJQ0I5WEc0Z0lIMHBPMXh1SUNCUGQyNVFjbTl0YVhObFEyRndZV0pwYkdsMGVTQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0IyWVhJZ2NISnZiV2x6WlNBOUlHNWxkeUJKYm5SbGNtNWhiQ2dwTzF4dUlDQWdJSFJvYVhNdWNISnZiV2x6WlNBOUlIQnliMjFwYzJVN1hHNGdJQ0FnZEdocGN5NXlaWE52YkhabElEMGdZM1I0S0NSeVpYTnZiSFpsTENCd2NtOXRhWE5sTENBeEtUdGNiaUFnSUNCMGFHbHpMbkpsYW1WamRDQTlJR04wZUNna2NtVnFaV04wTENCd2NtOXRhWE5sTENBeEtUdGNiaUFnZlR0Y2JpQWdibVYzVUhKdmJXbHpaVU5oY0dGaWFXeHBkSGxOYjJSMWJHVXVaaUE5SUc1bGQxQnliMjFwYzJWRFlYQmhZbWxzYVhSNUlEMGdablZ1WTNScGIyNGdLRU1wSUh0Y2JpQWdJQ0J5WlhSMWNtNGdReUE5UFQwZ0pGQnliMjFwYzJVZ2ZId2dReUE5UFQwZ1YzSmhjSEJsY2x4dUlDQWdJQ0FnUHlCdVpYY2dUM2R1VUhKdmJXbHpaVU5oY0dGaWFXeHBkSGtvUXlsY2JpQWdJQ0FnSURvZ2JtVjNSMlZ1WlhKcFkxQnliMjFwYzJWRFlYQmhZbWxzYVhSNUtFTXBPMXh1SUNCOU8xeHVmVnh1WEc0a1pYaHdiM0owS0NSbGVIQnZjblF1UnlBcklDUmxlSEJ2Y25RdVZ5QXJJQ1JsZUhCdmNuUXVSaUFxSUNGVlUwVmZUa0ZVU1ZaRkxDQjdJRkJ5YjIxcGMyVTZJQ1JRY205dGFYTmxJSDBwTzF4dWNtVnhkV2x5WlNnbkxpOWZjMlYwTFhSdkxYTjBjbWx1WnkxMFlXY25LU2drVUhKdmJXbHpaU3dnVUZKUFRVbFRSU2s3WEc1eVpYRjFhWEpsS0NjdUwxOXpaWFF0YzNCbFkybGxjeWNwS0ZCU1QwMUpVMFVwTzF4dVYzSmhjSEJsY2lBOUlISmxjWFZwY21Vb0p5NHZYMk52Y21VbktWdFFVazlOU1ZORlhUdGNibHh1THk4Z2MzUmhkR2xqYzF4dUpHVjRjRzl5ZENna1pYaHdiM0owTGxNZ0t5QWtaWGh3YjNKMExrWWdLaUFoVlZORlgwNUJWRWxXUlN3Z1VGSlBUVWxUUlN3Z2UxeHVJQ0F2THlBeU5TNDBMalF1TlNCUWNtOXRhWE5sTG5KbGFtVmpkQ2h5S1Z4dUlDQnlaV3BsWTNRNklHWjFibU4wYVc5dUlISmxhbVZqZENoeUtTQjdYRzRnSUNBZ2RtRnlJR05oY0dGaWFXeHBkSGtnUFNCdVpYZFFjbTl0YVhObFEyRndZV0pwYkdsMGVTaDBhR2x6S1R0Y2JpQWdJQ0IyWVhJZ0pDUnlaV3BsWTNRZ1BTQmpZWEJoWW1sc2FYUjVMbkpsYW1WamREdGNiaUFnSUNBa0pISmxhbVZqZENoeUtUdGNiaUFnSUNCeVpYUjFjbTRnWTJGd1lXSnBiR2wwZVM1d2NtOXRhWE5sTzF4dUlDQjlYRzU5S1R0Y2JpUmxlSEJ2Y25Rb0pHVjRjRzl5ZEM1VElDc2dKR1Y0Y0c5eWRDNUdJQ29nS0V4SlFsSkJVbGtnZkh3Z0lWVlRSVjlPUVZSSlZrVXBMQ0JRVWs5TlNWTkZMQ0I3WEc0Z0lDOHZJREkxTGpRdU5DNDJJRkJ5YjIxcGMyVXVjbVZ6YjJ4MlpTaDRLVnh1SUNCeVpYTnZiSFpsT2lCbWRXNWpkR2x2YmlCeVpYTnZiSFpsS0hncElIdGNiaUFnSUNCeVpYUjFjbTRnY0hKdmJXbHpaVkpsYzI5c2RtVW9URWxDVWtGU1dTQW1KaUIwYUdseklEMDlQU0JYY21Gd2NHVnlJRDhnSkZCeWIyMXBjMlVnT2lCMGFHbHpMQ0I0S1R0Y2JpQWdmVnh1ZlNrN1hHNGtaWGh3YjNKMEtDUmxlSEJ2Y25RdVV5QXJJQ1JsZUhCdmNuUXVSaUFxSUNFb1ZWTkZYMDVCVkVsV1JTQW1KaUJ5WlhGMWFYSmxLQ2N1TDE5cGRHVnlMV1JsZEdWamRDY3BLR1oxYm1OMGFXOXVJQ2hwZEdWeUtTQjdYRzRnSUNSUWNtOXRhWE5sTG1Gc2JDaHBkR1Z5S1ZzblkyRjBZMmduWFNobGJYQjBlU2s3WEc1OUtTa3NJRkJTVDAxSlUwVXNJSHRjYmlBZ0x5OGdNalV1TkM0MExqRWdVSEp2YldselpTNWhiR3dvYVhSbGNtRmliR1VwWEc0Z0lHRnNiRG9nWm5WdVkzUnBiMjRnWVd4c0tHbDBaWEpoWW14bEtTQjdYRzRnSUNBZ2RtRnlJRU1nUFNCMGFHbHpPMXh1SUNBZ0lIWmhjaUJqWVhCaFltbHNhWFI1SUQwZ2JtVjNVSEp2YldselpVTmhjR0ZpYVd4cGRIa29ReWs3WEc0Z0lDQWdkbUZ5SUhKbGMyOXNkbVVnUFNCallYQmhZbWxzYVhSNUxuSmxjMjlzZG1VN1hHNGdJQ0FnZG1GeUlISmxhbVZqZENBOUlHTmhjR0ZpYVd4cGRIa3VjbVZxWldOME8xeHVJQ0FnSUhaaGNpQnlaWE4xYkhRZ1BTQndaWEptYjNKdEtHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJSFpoY2lCMllXeDFaWE1nUFNCYlhUdGNiaUFnSUNBZ0lIWmhjaUJwYm1SbGVDQTlJREE3WEc0Z0lDQWdJQ0IyWVhJZ2NtVnRZV2x1YVc1bklEMGdNVHRjYmlBZ0lDQWdJR1p2Y2s5bUtHbDBaWEpoWW14bExDQm1ZV3h6WlN3Z1puVnVZM1JwYjI0Z0tIQnliMjFwYzJVcElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUNScGJtUmxlQ0E5SUdsdVpHVjRLeXM3WEc0Z0lDQWdJQ0FnSUhaaGNpQmhiSEpsWVdSNVEyRnNiR1ZrSUQwZ1ptRnNjMlU3WEc0Z0lDQWdJQ0FnSUhaaGJIVmxjeTV3ZFhOb0tIVnVaR1ZtYVc1bFpDazdYRzRnSUNBZ0lDQWdJSEpsYldGcGJtbHVaeXNyTzF4dUlDQWdJQ0FnSUNCRExuSmxjMjlzZG1Vb2NISnZiV2x6WlNrdWRHaGxiaWhtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNCcFppQW9ZV3h5WldGa2VVTmhiR3hsWkNrZ2NtVjBkWEp1TzF4dUlDQWdJQ0FnSUNBZ0lHRnNjbVZoWkhsRFlXeHNaV1FnUFNCMGNuVmxPMXh1SUNBZ0lDQWdJQ0FnSUhaaGJIVmxjMXNrYVc1a1pYaGRJRDBnZG1Gc2RXVTdYRzRnSUNBZ0lDQWdJQ0FnTFMxeVpXMWhhVzVwYm1jZ2ZId2djbVZ6YjJ4MlpTaDJZV3gxWlhNcE8xeHVJQ0FnSUNBZ0lDQjlMQ0J5WldwbFkzUXBPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0F0TFhKbGJXRnBibWx1WnlCOGZDQnlaWE52YkhabEtIWmhiSFZsY3lrN1hHNGdJQ0FnZlNrN1hHNGdJQ0FnYVdZZ0tISmxjM1ZzZEM1bEtTQnlaV3BsWTNRb2NtVnpkV3gwTG5ZcE8xeHVJQ0FnSUhKbGRIVnliaUJqWVhCaFltbHNhWFI1TG5CeWIyMXBjMlU3WEc0Z0lIMHNYRzRnSUM4dklESTFMalF1TkM0MElGQnliMjFwYzJVdWNtRmpaU2hwZEdWeVlXSnNaU2xjYmlBZ2NtRmpaVG9nWm5WdVkzUnBiMjRnY21GalpTaHBkR1Z5WVdKc1pTa2dlMXh1SUNBZ0lIWmhjaUJESUQwZ2RHaHBjenRjYmlBZ0lDQjJZWElnWTJGd1lXSnBiR2wwZVNBOUlHNWxkMUJ5YjIxcGMyVkRZWEJoWW1sc2FYUjVLRU1wTzF4dUlDQWdJSFpoY2lCeVpXcGxZM1FnUFNCallYQmhZbWxzYVhSNUxuSmxhbVZqZER0Y2JpQWdJQ0IyWVhJZ2NtVnpkV3gwSUQwZ2NHVnlabTl5YlNobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQm1iM0pQWmlocGRHVnlZV0pzWlN3Z1ptRnNjMlVzSUdaMWJtTjBhVzl1SUNod2NtOXRhWE5sS1NCN1hHNGdJQ0FnSUNBZ0lFTXVjbVZ6YjJ4MlpTaHdjbTl0YVhObEtTNTBhR1Z1S0dOaGNHRmlhV3hwZEhrdWNtVnpiMngyWlN3Z2NtVnFaV04wS1R0Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwcE8xeHVJQ0FnSUdsbUlDaHlaWE4xYkhRdVpTa2djbVZxWldOMEtISmxjM1ZzZEM1MktUdGNiaUFnSUNCeVpYUjFjbTRnWTJGd1lXSnBiR2wwZVM1d2NtOXRhWE5sTzF4dUlDQjlYRzU5S1R0Y2JpSXNJaWQxYzJVZ2MzUnlhV04wSnp0Y2JuWmhjaUFrWVhRZ1BTQnlaWEYxYVhKbEtDY3VMMTl6ZEhKcGJtY3RZWFFuS1NoMGNuVmxLVHRjYmx4dUx5OGdNakV1TVM0ekxqSTNJRk4wY21sdVp5NXdjbTkwYjNSNWNHVmJRRUJwZEdWeVlYUnZjbDBvS1Z4dWNtVnhkV2x5WlNnbkxpOWZhWFJsY2kxa1pXWnBibVVuS1NoVGRISnBibWNzSUNkVGRISnBibWNuTENCbWRXNWpkR2x2YmlBb2FYUmxjbUYwWldRcElIdGNiaUFnZEdocGN5NWZkQ0E5SUZOMGNtbHVaeWhwZEdWeVlYUmxaQ2s3SUM4dklIUmhjbWRsZEZ4dUlDQjBhR2x6TGw5cElEMGdNRHNnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnYm1WNGRDQnBibVJsZUZ4dUx5OGdNakV1TVM0MUxqSXVNU0FsVTNSeWFXNW5TWFJsY21GMGIzSlFjbTkwYjNSNWNHVWxMbTVsZUhRb0tWeHVmU3dnWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0IyWVhJZ1R5QTlJSFJvYVhNdVgzUTdYRzRnSUhaaGNpQnBibVJsZUNBOUlIUm9hWE11WDJrN1hHNGdJSFpoY2lCd2IybHVkRHRjYmlBZ2FXWWdLR2x1WkdWNElENDlJRTh1YkdWdVozUm9LU0J5WlhSMWNtNGdleUIyWVd4MVpUb2dkVzVrWldacGJtVmtMQ0JrYjI1bE9pQjBjblZsSUgwN1hHNGdJSEJ2YVc1MElEMGdKR0YwS0U4c0lHbHVaR1Y0S1R0Y2JpQWdkR2hwY3k1ZmFTQXJQU0J3YjJsdWRDNXNaVzVuZEdnN1hHNGdJSEpsZEhWeWJpQjdJSFpoYkhWbE9pQndiMmx1ZEN3Z1pHOXVaVG9nWm1Gc2MyVWdmVHRjYm4wcE8xeHVJaXdpTHk4Z2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzUmpNemt2Y0hKdmNHOXpZV3d0Y0hKdmJXbHpaUzFtYVc1aGJHeDVYRzRuZFhObElITjBjbWxqZENjN1hHNTJZWElnSkdWNGNHOXlkQ0E5SUhKbGNYVnBjbVVvSnk0dlgyVjRjRzl5ZENjcE8xeHVkbUZ5SUdOdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TDE5amIzSmxKeWs3WEc1MllYSWdaMnh2WW1Gc0lEMGdjbVZ4ZFdseVpTZ25MaTlmWjJ4dlltRnNKeWs3WEc1MllYSWdjM0JsWTJsbGMwTnZibk4wY25WamRHOXlJRDBnY21WeGRXbHlaU2duTGk5ZmMzQmxZMmxsY3kxamIyNXpkSEoxWTNSdmNpY3BPMXh1ZG1GeUlIQnliMjFwYzJWU1pYTnZiSFpsSUQwZ2NtVnhkV2x5WlNnbkxpOWZjSEp2YldselpTMXlaWE52YkhabEp5azdYRzVjYmlSbGVIQnZjblFvSkdWNGNHOXlkQzVRSUNzZ0pHVjRjRzl5ZEM1U0xDQW5VSEp2YldselpTY3NJSHNnSjJacGJtRnNiSGtuT2lCbWRXNWpkR2x2YmlBb2IyNUdhVzVoYkd4NUtTQjdYRzRnSUhaaGNpQkRJRDBnYzNCbFkybGxjME52Ym5OMGNuVmpkRzl5S0hSb2FYTXNJR052Y21VdVVISnZiV2x6WlNCOGZDQm5iRzlpWVd3dVVISnZiV2x6WlNrN1hHNGdJSFpoY2lCcGMwWjFibU4wYVc5dUlEMGdkSGx3Wlc5bUlHOXVSbWx1WVd4c2VTQTlQU0FuWm5WdVkzUnBiMjRuTzF4dUlDQnlaWFIxY200Z2RHaHBjeTUwYUdWdUtGeHVJQ0FnSUdselJuVnVZM1JwYjI0Z1B5Qm1kVzVqZEdsdmJpQW9lQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSEJ5YjIxcGMyVlNaWE52YkhabEtFTXNJRzl1Um1sdVlXeHNlU2dwS1M1MGFHVnVLR1oxYm1OMGFXOXVJQ2dwSUhzZ2NtVjBkWEp1SUhnN0lIMHBPMXh1SUNBZ0lIMGdPaUJ2YmtacGJtRnNiSGtzWEc0Z0lDQWdhWE5HZFc1amRHbHZiaUEvSUdaMWJtTjBhVzl1SUNobEtTQjdYRzRnSUNBZ0lDQnlaWFIxY200Z2NISnZiV2x6WlZKbGMyOXNkbVVvUXl3Z2IyNUdhVzVoYkd4NUtDa3BMblJvWlc0b1puVnVZM1JwYjI0Z0tDa2dleUIwYUhKdmR5QmxPeUI5S1R0Y2JpQWdJQ0I5SURvZ2IyNUdhVzVoYkd4NVhHNGdJQ2s3WEc1OUlIMHBPMXh1SWl3aUozVnpaU0J6ZEhKcFkzUW5PMXh1THk4Z2FIUjBjSE02THk5bmFYUm9kV0l1WTI5dEwzUmpNemt2Y0hKdmNHOXpZV3d0Y0hKdmJXbHpaUzEwY25sY2JuWmhjaUFrWlhod2IzSjBJRDBnY21WeGRXbHlaU2duTGk5ZlpYaHdiM0owSnlrN1hHNTJZWElnYm1WM1VISnZiV2x6WlVOaGNHRmlhV3hwZEhrZ1BTQnlaWEYxYVhKbEtDY3VMMTl1WlhjdGNISnZiV2x6WlMxallYQmhZbWxzYVhSNUp5azdYRzUyWVhJZ2NHVnlabTl5YlNBOUlISmxjWFZwY21Vb0p5NHZYM0JsY21admNtMG5LVHRjYmx4dUpHVjRjRzl5ZENna1pYaHdiM0owTGxNc0lDZFFjbTl0YVhObEp5d2dleUFuZEhKNUp6b2dablZ1WTNScGIyNGdLR05oYkd4aVlXTnJabTRwSUh0Y2JpQWdkbUZ5SUhCeWIyMXBjMlZEWVhCaFltbHNhWFI1SUQwZ2JtVjNVSEp2YldselpVTmhjR0ZpYVd4cGRIa3VaaWgwYUdsektUdGNiaUFnZG1GeUlISmxjM1ZzZENBOUlIQmxjbVp2Y20wb1kyRnNiR0poWTJ0bWJpazdYRzRnSUNoeVpYTjFiSFF1WlNBL0lIQnliMjFwYzJWRFlYQmhZbWxzYVhSNUxuSmxhbVZqZENBNklIQnliMjFwYzJWRFlYQmhZbWxzYVhSNUxuSmxjMjlzZG1VcEtISmxjM1ZzZEM1MktUdGNiaUFnY21WMGRYSnVJSEJ5YjIxcGMyVkRZWEJoWW1sc2FYUjVMbkJ5YjIxcGMyVTdYRzU5SUgwcE8xeHVJaXdpY21WeGRXbHlaU2duTGk5bGN6WXVZWEp5WVhrdWFYUmxjbUYwYjNJbktUdGNiblpoY2lCbmJHOWlZV3dnUFNCeVpYRjFhWEpsS0NjdUwxOW5iRzlpWVd3bktUdGNiblpoY2lCb2FXUmxJRDBnY21WeGRXbHlaU2duTGk5ZmFHbGtaU2NwTzF4dWRtRnlJRWwwWlhKaGRHOXljeUE5SUhKbGNYVnBjbVVvSnk0dlgybDBaWEpoZEc5eWN5Y3BPMXh1ZG1GeUlGUlBYMU5VVWtsT1IxOVVRVWNnUFNCeVpYRjFhWEpsS0NjdUwxOTNhM01uS1NnbmRHOVRkSEpwYm1kVVlXY25LVHRjYmx4dWRtRnlJRVJQVFVsMFpYSmhZbXhsY3lBOUlDZ25RMU5UVW5Wc1pVeHBjM1FzUTFOVFUzUjViR1ZFWldOc1lYSmhkR2x2Yml4RFUxTldZV3gxWlV4cGMzUXNRMnhwWlc1MFVtVmpkRXhwYzNRc1JFOU5VbVZqZEV4cGMzUXNSRTlOVTNSeWFXNW5UR2x6ZEN3bklDdGNiaUFnSjBSUFRWUnZhMlZ1VEdsemRDeEVZWFJoVkhKaGJuTm1aWEpKZEdWdFRHbHpkQ3hHYVd4bFRHbHpkQ3hJVkUxTVFXeHNRMjlzYkdWamRHbHZiaXhJVkUxTVEyOXNiR1ZqZEdsdmJpeElWRTFNUm05eWJVVnNaVzFsYm5Rc1NGUk5URk5sYkdWamRFVnNaVzFsYm5Rc0p5QXJYRzRnSUNkTlpXUnBZVXhwYzNRc1RXbHRaVlI1Y0dWQmNuSmhlU3hPWVcxbFpFNXZaR1ZOWVhBc1RtOWtaVXhwYzNRc1VHRnBiblJTWlhGMVpYTjBUR2x6ZEN4UWJIVm5hVzRzVUd4MVoybHVRWEp5WVhrc1UxWkhUR1Z1WjNSb1RHbHpkQ3hUVmtkT2RXMWlaWEpNYVhOMExDY2dLMXh1SUNBblUxWkhVR0YwYUZObFoweHBjM1FzVTFaSFVHOXBiblJNYVhOMExGTldSMU4wY21sdVoweHBjM1FzVTFaSFZISmhibk5tYjNKdFRHbHpkQ3hUYjNWeVkyVkNkV1ptWlhKTWFYTjBMRk4wZVd4bFUyaGxaWFJNYVhOMExGUmxlSFJVY21GamEwTjFaVXhwYzNRc0p5QXJYRzRnSUNkVVpYaDBWSEpoWTJ0TWFYTjBMRlJ2ZFdOb1RHbHpkQ2NwTG5Od2JHbDBLQ2NzSnlrN1hHNWNibVp2Y2lBb2RtRnlJR2tnUFNBd095QnBJRHdnUkU5TlNYUmxjbUZpYkdWekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lIWmhjaUJPUVUxRklEMGdSRTlOU1hSbGNtRmliR1Z6VzJsZE8xeHVJQ0IyWVhJZ1EyOXNiR1ZqZEdsdmJpQTlJR2RzYjJKaGJGdE9RVTFGWFR0Y2JpQWdkbUZ5SUhCeWIzUnZJRDBnUTI5c2JHVmpkR2x2YmlBbUppQkRiMnhzWldOMGFXOXVMbkJ5YjNSdmRIbHdaVHRjYmlBZ2FXWWdLSEJ5YjNSdklDWW1JQ0Z3Y205MGIxdFVUMTlUVkZKSlRrZGZWRUZIWFNrZ2FHbGtaU2h3Y205MGJ5d2dWRTlmVTFSU1NVNUhYMVJCUnl3Z1RrRk5SU2s3WEc0Z0lFbDBaWEpoZEc5eWMxdE9RVTFGWFNBOUlFbDBaWEpoZEc5eWN5NUJjbkpoZVR0Y2JuMWNiaUlzSWk4cUtseHVJQ29nUTI5d2VYSnBaMmgwSUNoaktTQXlNREUwTFhCeVpYTmxiblFzSUVaaFkyVmliMjlyTENCSmJtTXVYRzRnS2x4dUlDb2dWR2hwY3lCemIzVnlZMlVnWTI5a1pTQnBjeUJzYVdObGJuTmxaQ0IxYm1SbGNpQjBhR1VnVFVsVUlHeHBZMlZ1YzJVZ1ptOTFibVFnYVc0Z2RHaGxYRzRnS2lCTVNVTkZUbE5GSUdacGJHVWdhVzRnZEdobElISnZiM1FnWkdseVpXTjBiM0o1SUc5bUlIUm9hWE1nYzI5MWNtTmxJSFJ5WldVdVhHNGdLaTljYmx4dUx5OGdWR2hwY3lCdFpYUm9iMlFnYjJZZ2IySjBZV2x1YVc1bklHRWdjbVZtWlhKbGJtTmxJSFJ2SUhSb1pTQm5iRzlpWVd3Z2IySnFaV04wSUc1bFpXUnpJSFJ2SUdKbFhHNHZMeUJyWlhCMElHbGtaVzUwYVdOaGJDQjBieUIwYUdVZ2QyRjVJR2wwSUdseklHOWlkR0ZwYm1Wa0lHbHVJSEoxYm5ScGJXVXVhbk5jYm5aaGNpQm5JRDBnS0daMWJtTjBhVzl1S0NrZ2V5QnlaWFIxY200Z2RHaHBjeUI5S1NncElIeDhJRVoxYm1OMGFXOXVLRndpY21WMGRYSnVJSFJvYVhOY0lpa29LVHRjYmx4dUx5OGdWWE5sSUdCblpYUlBkMjVRY205d1pYSjBlVTVoYldWellDQmlaV05oZFhObElHNXZkQ0JoYkd3Z1luSnZkM05sY25NZ2MzVndjRzl5ZENCallXeHNhVzVuWEc0dkx5QmdhR0Z6VDNkdVVISnZjR1Z5ZEhsZ0lHOXVJSFJvWlNCbmJHOWlZV3dnWUhObGJHWmdJRzlpYW1WamRDQnBiaUJoSUhkdmNtdGxjaTRnVTJWbElDTXhPRE11WEc1MllYSWdhR0ZrVW5WdWRHbHRaU0E5SUdjdWNtVm5aVzVsY21GMGIzSlNkVzUwYVcxbElDWW1YRzRnSUU5aWFtVmpkQzVuWlhSUGQyNVFjbTl3WlhKMGVVNWhiV1Z6S0djcExtbHVaR1Y0VDJZb1hDSnlaV2RsYm1WeVlYUnZjbEoxYm5ScGJXVmNJaWtnUGowZ01EdGNibHh1THk4Z1UyRjJaU0IwYUdVZ2IyeGtJSEpsWjJWdVpYSmhkRzl5VW5WdWRHbHRaU0JwYmlCallYTmxJR2wwSUc1bFpXUnpJSFJ2SUdKbElISmxjM1J2Y21Wa0lHeGhkR1Z5TGx4dWRtRnlJRzlzWkZKMWJuUnBiV1VnUFNCb1lXUlNkVzUwYVcxbElDWW1JR2N1Y21WblpXNWxjbUYwYjNKU2RXNTBhVzFsTzF4dVhHNHZMeUJHYjNKalpTQnlaV1YyWVd4MWRHRjBhVzl1SUc5bUlISjFiblJwYldVdWFuTXVYRzVuTG5KbFoyVnVaWEpoZEc5eVVuVnVkR2x0WlNBOUlIVnVaR1ZtYVc1bFpEdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5WlhGMWFYSmxLRndpTGk5eWRXNTBhVzFsWENJcE8xeHVYRzVwWmlBb2FHRmtVblZ1ZEdsdFpTa2dlMXh1SUNBdkx5QlNaWE4wYjNKbElIUm9aU0J2Y21sbmFXNWhiQ0J5ZFc1MGFXMWxMbHh1SUNCbkxuSmxaMlZ1WlhKaGRHOXlVblZ1ZEdsdFpTQTlJRzlzWkZKMWJuUnBiV1U3WEc1OUlHVnNjMlVnZTF4dUlDQXZMeUJTWlcxdmRtVWdkR2hsSUdkc2IySmhiQ0J3Y205d1pYSjBlU0JoWkdSbFpDQmllU0J5ZFc1MGFXMWxMbXB6TGx4dUlDQjBjbmtnZTF4dUlDQWdJR1JsYkdWMFpTQm5MbkpsWjJWdVpYSmhkRzl5VW5WdWRHbHRaVHRjYmlBZ2ZTQmpZWFJqYUNobEtTQjdYRzRnSUNBZ1p5NXlaV2RsYm1WeVlYUnZjbEoxYm5ScGJXVWdQU0IxYm1SbFptbHVaV1E3WEc0Z0lIMWNibjFjYmlJc0lpOHFLbHh1SUNvZ1EyOXdlWEpwWjJoMElDaGpLU0F5TURFMExYQnlaWE5sYm5Rc0lFWmhZMlZpYjI5ckxDQkpibU11WEc0Z0tseHVJQ29nVkdocGN5QnpiM1Z5WTJVZ1kyOWtaU0JwY3lCc2FXTmxibk5sWkNCMWJtUmxjaUIwYUdVZ1RVbFVJR3hwWTJWdWMyVWdabTkxYm1RZ2FXNGdkR2hsWEc0Z0tpQk1TVU5GVGxORklHWnBiR1VnYVc0Z2RHaGxJSEp2YjNRZ1pHbHlaV04wYjNKNUlHOW1JSFJvYVhNZ2MyOTFjbU5sSUhSeVpXVXVYRzRnS2k5Y2JseHVJU2htZFc1amRHbHZiaWhuYkc5aVlXd3BJSHRjYmlBZ1hDSjFjMlVnYzNSeWFXTjBYQ0k3WEc1Y2JpQWdkbUZ5SUU5d0lEMGdUMkpxWldOMExuQnliM1J2ZEhsd1pUdGNiaUFnZG1GeUlHaGhjMDkzYmlBOUlFOXdMbWhoYzA5M2JsQnliM0JsY25SNU8xeHVJQ0IyWVhJZ2RXNWtaV1pwYm1Wa095QXZMeUJOYjNKbElHTnZiWEJ5WlhOemFXSnNaU0IwYUdGdUlIWnZhV1FnTUM1Y2JpQWdkbUZ5SUNSVGVXMWliMndnUFNCMGVYQmxiMllnVTNsdFltOXNJRDA5UFNCY0ltWjFibU4wYVc5dVhDSWdQeUJUZVcxaWIyd2dPaUI3ZlR0Y2JpQWdkbUZ5SUdsMFpYSmhkRzl5VTNsdFltOXNJRDBnSkZONWJXSnZiQzVwZEdWeVlYUnZjaUI4ZkNCY0lrQkFhWFJsY21GMGIzSmNJanRjYmlBZ2RtRnlJR0Z6ZVc1alNYUmxjbUYwYjNKVGVXMWliMndnUFNBa1UzbHRZbTlzTG1GemVXNWpTWFJsY21GMGIzSWdmSHdnWENKQVFHRnplVzVqU1hSbGNtRjBiM0pjSWp0Y2JpQWdkbUZ5SUhSdlUzUnlhVzVuVkdGblUzbHRZbTlzSUQwZ0pGTjViV0p2YkM1MGIxTjBjbWx1WjFSaFp5QjhmQ0JjSWtCQWRHOVRkSEpwYm1kVVlXZGNJanRjYmx4dUlDQjJZWElnYVc1TmIyUjFiR1VnUFNCMGVYQmxiMllnYlc5a2RXeGxJRDA5UFNCY0ltOWlhbVZqZEZ3aU8xeHVJQ0IyWVhJZ2NuVnVkR2x0WlNBOUlHZHNiMkpoYkM1eVpXZGxibVZ5WVhSdmNsSjFiblJwYldVN1hHNGdJR2xtSUNoeWRXNTBhVzFsS1NCN1hHNGdJQ0FnYVdZZ0tHbHVUVzlrZFd4bEtTQjdYRzRnSUNBZ0lDQXZMeUJKWmlCeVpXZGxibVZ5WVhSdmNsSjFiblJwYldVZ2FYTWdaR1ZtYVc1bFpDQm5iRzlpWVd4c2VTQmhibVFnZDJVbmNtVWdhVzRnWVNCdGIyUjFiR1VzWEc0Z0lDQWdJQ0F2THlCdFlXdGxJSFJvWlNCbGVIQnZjblJ6SUc5aWFtVmpkQ0JwWkdWdWRHbGpZV3dnZEc4Z2NtVm5aVzVsY21GMGIzSlNkVzUwYVcxbExseHVJQ0FnSUNBZ2JXOWtkV3hsTG1WNGNHOXlkSE1nUFNCeWRXNTBhVzFsTzF4dUlDQWdJSDFjYmlBZ0lDQXZMeUJFYjI0bmRDQmliM1JvWlhJZ1pYWmhiSFZoZEdsdVp5QjBhR1VnY21WemRDQnZaaUIwYUdseklHWnBiR1VnYVdZZ2RHaGxJSEoxYm5ScGJXVWdkMkZ6WEc0Z0lDQWdMeThnWVd4eVpXRmtlU0JrWldacGJtVmtJR2RzYjJKaGJHeDVMbHh1SUNBZ0lISmxkSFZ5Ymp0Y2JpQWdmVnh1WEc0Z0lDOHZJRVJsWm1sdVpTQjBhR1VnY25WdWRHbHRaU0JuYkc5aVlXeHNlU0FvWVhNZ1pYaHdaV04wWldRZ1lua2daMlZ1WlhKaGRHVmtJR052WkdVcElHRnpJR1ZwZEdobGNseHVJQ0F2THlCdGIyUjFiR1V1Wlhod2IzSjBjeUFvYVdZZ2QyVW5jbVVnYVc0Z1lTQnRiMlIxYkdVcElHOXlJR0VnYm1WM0xDQmxiWEIwZVNCdlltcGxZM1F1WEc0Z0lISjFiblJwYldVZ1BTQm5iRzlpWVd3dWNtVm5aVzVsY21GMGIzSlNkVzUwYVcxbElEMGdhVzVOYjJSMWJHVWdQeUJ0YjJSMWJHVXVaWGh3YjNKMGN5QTZJSHQ5TzF4dVhHNGdJR1oxYm1OMGFXOXVJSGR5WVhBb2FXNXVaWEpHYml3Z2IzVjBaWEpHYml3Z2MyVnNaaXdnZEhKNVRHOWpjMHhwYzNRcElIdGNiaUFnSUNBdkx5QkpaaUJ2ZFhSbGNrWnVJSEJ5YjNacFpHVmtJR0Z1WkNCdmRYUmxja1p1TG5CeWIzUnZkSGx3WlNCcGN5QmhJRWRsYm1WeVlYUnZjaXdnZEdobGJpQnZkWFJsY2tadUxuQnliM1J2ZEhsd1pTQnBibk4wWVc1alpXOW1JRWRsYm1WeVlYUnZjaTVjYmlBZ0lDQjJZWElnY0hKdmRHOUhaVzVsY21GMGIzSWdQU0J2ZFhSbGNrWnVJQ1ltSUc5MWRHVnlSbTR1Y0hKdmRHOTBlWEJsSUdsdWMzUmhibU5sYjJZZ1IyVnVaWEpoZEc5eUlEOGdiM1YwWlhKR2JpQTZJRWRsYm1WeVlYUnZjanRjYmlBZ0lDQjJZWElnWjJWdVpYSmhkRzl5SUQwZ1QySnFaV04wTG1OeVpXRjBaU2h3Y205MGIwZGxibVZ5WVhSdmNpNXdjbTkwYjNSNWNHVXBPMXh1SUNBZ0lIWmhjaUJqYjI1MFpYaDBJRDBnYm1WM0lFTnZiblJsZUhRb2RISjVURzlqYzB4cGMzUWdmSHdnVzEwcE8xeHVYRzRnSUNBZ0x5OGdWR2hsSUM1ZmFXNTJiMnRsSUcxbGRHaHZaQ0IxYm1sbWFXVnpJSFJvWlNCcGJYQnNaVzFsYm5SaGRHbHZibk1nYjJZZ2RHaGxJQzV1WlhoMExGeHVJQ0FnSUM4dklDNTBhSEp2ZHl3Z1lXNWtJQzV5WlhSMWNtNGdiV1YwYUc5a2N5NWNiaUFnSUNCblpXNWxjbUYwYjNJdVgybHVkbTlyWlNBOUlHMWhhMlZKYm5admEyVk5aWFJvYjJRb2FXNXVaWEpHYml3Z2MyVnNaaXdnWTI5dWRHVjRkQ2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdaMlZ1WlhKaGRHOXlPMXh1SUNCOVhHNGdJSEoxYm5ScGJXVXVkM0poY0NBOUlIZHlZWEE3WEc1Y2JpQWdMeThnVkhKNUwyTmhkR05vSUdobGJIQmxjaUIwYnlCdGFXNXBiV2w2WlNCa1pXOXdkR2x0YVhwaGRHbHZibk11SUZKbGRIVnlibk1nWVNCamIyMXdiR1YwYVc5dVhHNGdJQzh2SUhKbFkyOXlaQ0JzYVd0bElHTnZiblJsZUhRdWRISjVSVzUwY21sbGMxdHBYUzVqYjIxd2JHVjBhVzl1TGlCVWFHbHpJR2x1ZEdWeVptRmpaU0JqYjNWc1pGeHVJQ0F2THlCb1lYWmxJR0psWlc0Z0tHRnVaQ0IzWVhNZ2NISmxkbWx2ZFhOc2VTa2daR1Z6YVdkdVpXUWdkRzhnZEdGclpTQmhJR05zYjNOMWNtVWdkRzhnWW1WY2JpQWdMeThnYVc1MmIydGxaQ0IzYVhSb2IzVjBJR0Z5WjNWdFpXNTBjeXdnWW5WMElHbHVJR0ZzYkNCMGFHVWdZMkZ6WlhNZ2QyVWdZMkZ5WlNCaFltOTFkQ0IzWlZ4dUlDQXZMeUJoYkhKbFlXUjVJR2hoZG1VZ1lXNGdaWGhwYzNScGJtY2diV1YwYUc5a0lIZGxJSGRoYm5RZ2RHOGdZMkZzYkN3Z2MyOGdkR2hsY21VbmN5QnVieUJ1WldWa1hHNGdJQzh2SUhSdklHTnlaV0YwWlNCaElHNWxkeUJtZFc1amRHbHZiaUJ2WW1wbFkzUXVJRmRsSUdOaGJpQmxkbVZ1SUdkbGRDQmhkMkY1SUhkcGRHZ2dZWE56ZFcxcGJtZGNiaUFnTHk4Z2RHaGxJRzFsZEdodlpDQjBZV3RsY3lCbGVHRmpkR3g1SUc5dVpTQmhjbWQxYldWdWRDd2djMmx1WTJVZ2RHaGhkQ0JvWVhCd1pXNXpJSFJ2SUdKbElIUnlkV1ZjYmlBZ0x5OGdhVzRnWlhabGNua2dZMkZ6WlN3Z2MyOGdkMlVnWkc5dUozUWdhR0YyWlNCMGJ5QjBiM1ZqYUNCMGFHVWdZWEpuZFcxbGJuUnpJRzlpYW1WamRDNGdWR2hsWEc0Z0lDOHZJRzl1YkhrZ1lXUmthWFJwYjI1aGJDQmhiR3h2WTJGMGFXOXVJSEpsY1hWcGNtVmtJR2x6SUhSb1pTQmpiMjF3YkdWMGFXOXVJSEpsWTI5eVpDd2dkMmhwWTJoY2JpQWdMeThnYUdGeklHRWdjM1JoWW14bElITm9ZWEJsSUdGdVpDQnpieUJvYjNCbFpuVnNiSGtnYzJodmRXeGtJR0psSUdOb1pXRndJSFJ2SUdGc2JHOWpZWFJsTGx4dUlDQm1kVzVqZEdsdmJpQjBjbmxEWVhSamFDaG1iaXdnYjJKcUxDQmhjbWNwSUh0Y2JpQWdJQ0IwY25rZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhzZ2RIbHdaVG9nWENKdWIzSnRZV3hjSWl3Z1lYSm5PaUJtYmk1allXeHNLRzlpYWl3Z1lYSm5LU0I5TzF4dUlDQWdJSDBnWTJGMFkyZ2dLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhzZ2RIbHdaVG9nWENKMGFISnZkMXdpTENCaGNtYzZJR1Z5Y2lCOU8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lIWmhjaUJIWlc1VGRHRjBaVk4xYzNCbGJtUmxaRk4wWVhKMElEMGdYQ0p6ZFhOd1pXNWtaV1JUZEdGeWRGd2lPMXh1SUNCMllYSWdSMlZ1VTNSaGRHVlRkWE53Wlc1a1pXUlphV1ZzWkNBOUlGd2ljM1Z6Y0dWdVpHVmtXV2xsYkdSY0lqdGNiaUFnZG1GeUlFZGxibE4wWVhSbFJYaGxZM1YwYVc1bklEMGdYQ0psZUdWamRYUnBibWRjSWp0Y2JpQWdkbUZ5SUVkbGJsTjBZWFJsUTI5dGNHeGxkR1ZrSUQwZ1hDSmpiMjF3YkdWMFpXUmNJanRjYmx4dUlDQXZMeUJTWlhSMWNtNXBibWNnZEdocGN5QnZZbXBsWTNRZ1puSnZiU0IwYUdVZ2FXNXVaWEpHYmlCb1lYTWdkR2hsSUhOaGJXVWdaV1ptWldOMElHRnpYRzRnSUM4dklHSnlaV0ZyYVc1bklHOTFkQ0J2WmlCMGFHVWdaR2x6Y0dGMFkyZ2djM2RwZEdOb0lITjBZWFJsYldWdWRDNWNiaUFnZG1GeUlFTnZiblJwYm5WbFUyVnVkR2x1Wld3Z1BTQjdmVHRjYmx4dUlDQXZMeUJFZFcxdGVTQmpiMjV6ZEhKMVkzUnZjaUJtZFc1amRHbHZibk1nZEdoaGRDQjNaU0IxYzJVZ1lYTWdkR2hsSUM1amIyNXpkSEoxWTNSdmNpQmhibVJjYmlBZ0x5OGdMbU52Ym5OMGNuVmpkRzl5TG5CeWIzUnZkSGx3WlNCd2NtOXdaWEowYVdWeklHWnZjaUJtZFc1amRHbHZibk1nZEdoaGRDQnlaWFIxY200Z1IyVnVaWEpoZEc5eVhHNGdJQzh2SUc5aWFtVmpkSE11SUVadmNpQm1kV3hzSUhOd1pXTWdZMjl0Y0d4cFlXNWpaU3dnZVc5MUlHMWhlU0IzYVhOb0lIUnZJR052Ym1acFozVnlaU0I1YjNWeVhHNGdJQzh2SUcxcGJtbG1hV1Z5SUc1dmRDQjBieUJ0WVc1bmJHVWdkR2hsSUc1aGJXVnpJRzltSUhSb1pYTmxJSFIzYnlCbWRXNWpkR2x2Ym5NdVhHNGdJR1oxYm1OMGFXOXVJRWRsYm1WeVlYUnZjaWdwSUh0OVhHNGdJR1oxYm1OMGFXOXVJRWRsYm1WeVlYUnZja1oxYm1OMGFXOXVLQ2tnZTMxY2JpQWdablZ1WTNScGIyNGdSMlZ1WlhKaGRHOXlSblZ1WTNScGIyNVFjbTkwYjNSNWNHVW9LU0I3ZlZ4dVhHNGdJQzh2SUZSb2FYTWdhWE1nWVNCd2IyeDVabWxzYkNCbWIzSWdKVWwwWlhKaGRHOXlVSEp2ZEc5MGVYQmxKU0JtYjNJZ1pXNTJhWEp2Ym0xbGJuUnpJSFJvWVhSY2JpQWdMeThnWkc5dUozUWdibUYwYVhabGJIa2djM1Z3Y0c5eWRDQnBkQzVjYmlBZ2RtRnlJRWwwWlhKaGRHOXlVSEp2ZEc5MGVYQmxJRDBnZTMwN1hHNGdJRWwwWlhKaGRHOXlVSEp2ZEc5MGVYQmxXMmwwWlhKaGRHOXlVM2x0WW05c1hTQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3p0Y2JpQWdmVHRjYmx4dUlDQjJZWElnWjJWMFVISnZkRzhnUFNCUFltcGxZM1F1WjJWMFVISnZkRzkwZVhCbFQyWTdYRzRnSUhaaGNpQk9ZWFJwZG1WSmRHVnlZWFJ2Y2xCeWIzUnZkSGx3WlNBOUlHZGxkRkJ5YjNSdklDWW1JR2RsZEZCeWIzUnZLR2RsZEZCeWIzUnZLSFpoYkhWbGN5aGJYU2twS1R0Y2JpQWdhV1lnS0U1aGRHbDJaVWwwWlhKaGRHOXlVSEp2ZEc5MGVYQmxJQ1ltWEc0Z0lDQWdJQ0JPWVhScGRtVkpkR1Z5WVhSdmNsQnliM1J2ZEhsd1pTQWhQVDBnVDNBZ0ppWmNiaUFnSUNBZ0lHaGhjMDkzYmk1allXeHNLRTVoZEdsMlpVbDBaWEpoZEc5eVVISnZkRzkwZVhCbExDQnBkR1Z5WVhSdmNsTjViV0p2YkNrcElIdGNiaUFnSUNBdkx5QlVhR2x6SUdWdWRtbHliMjV0Wlc1MElHaGhjeUJoSUc1aGRHbDJaU0FsU1hSbGNtRjBiM0pRY205MGIzUjVjR1VsT3lCMWMyVWdhWFFnYVc1emRHVmhaRnh1SUNBZ0lDOHZJRzltSUhSb1pTQndiMng1Wm1sc2JDNWNiaUFnSUNCSmRHVnlZWFJ2Y2xCeWIzUnZkSGx3WlNBOUlFNWhkR2wyWlVsMFpYSmhkRzl5VUhKdmRHOTBlWEJsTzF4dUlDQjlYRzVjYmlBZ2RtRnlJRWR3SUQwZ1IyVnVaWEpoZEc5eVJuVnVZM1JwYjI1UWNtOTBiM1I1Y0dVdWNISnZkRzkwZVhCbElEMWNiaUFnSUNCSFpXNWxjbUYwYjNJdWNISnZkRzkwZVhCbElEMGdUMkpxWldOMExtTnlaV0YwWlNoSmRHVnlZWFJ2Y2xCeWIzUnZkSGx3WlNrN1hHNGdJRWRsYm1WeVlYUnZja1oxYm1OMGFXOXVMbkJ5YjNSdmRIbHdaU0E5SUVkd0xtTnZibk4wY25WamRHOXlJRDBnUjJWdVpYSmhkRzl5Um5WdVkzUnBiMjVRY205MGIzUjVjR1U3WEc0Z0lFZGxibVZ5WVhSdmNrWjFibU4wYVc5dVVISnZkRzkwZVhCbExtTnZibk4wY25WamRHOXlJRDBnUjJWdVpYSmhkRzl5Um5WdVkzUnBiMjQ3WEc0Z0lFZGxibVZ5WVhSdmNrWjFibU4wYVc5dVVISnZkRzkwZVhCbFczUnZVM1J5YVc1blZHRm5VM2x0WW05c1hTQTlYRzRnSUNBZ1IyVnVaWEpoZEc5eVJuVnVZM1JwYjI0dVpHbHpjR3hoZVU1aGJXVWdQU0JjSWtkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1WENJN1hHNWNiaUFnTHk4Z1NHVnNjR1Z5SUdadmNpQmtaV1pwYm1sdVp5QjBhR1VnTG01bGVIUXNJQzUwYUhKdmR5d2dZVzVrSUM1eVpYUjFjbTRnYldWMGFHOWtjeUJ2WmlCMGFHVmNiaUFnTHk4Z1NYUmxjbUYwYjNJZ2FXNTBaWEptWVdObElHbHVJSFJsY20xeklHOW1JR0VnYzJsdVoyeGxJQzVmYVc1MmIydGxJRzFsZEdodlpDNWNiaUFnWm5WdVkzUnBiMjRnWkdWbWFXNWxTWFJsY21GMGIzSk5aWFJvYjJSektIQnliM1J2ZEhsd1pTa2dlMXh1SUNBZ0lGdGNJbTVsZUhSY0lpd2dYQ0owYUhKdmQxd2lMQ0JjSW5KbGRIVnlibHdpWFM1bWIzSkZZV05vS0daMWJtTjBhVzl1S0cxbGRHaHZaQ2tnZTF4dUlDQWdJQ0FnY0hKdmRHOTBlWEJsVzIxbGRHaHZaRjBnUFNCbWRXNWpkR2x2YmloaGNtY3BJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdVgybHVkbTlyWlNodFpYUm9iMlFzSUdGeVp5azdYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnY25WdWRHbHRaUzVwYzBkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1SUQwZ1puVnVZM1JwYjI0b1oyVnVSblZ1S1NCN1hHNGdJQ0FnZG1GeUlHTjBiM0lnUFNCMGVYQmxiMllnWjJWdVJuVnVJRDA5UFNCY0ltWjFibU4wYVc5dVhDSWdKaVlnWjJWdVJuVnVMbU52Ym5OMGNuVmpkRzl5TzF4dUlDQWdJSEpsZEhWeWJpQmpkRzl5WEc0Z0lDQWdJQ0EvSUdOMGIzSWdQVDA5SUVkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1SUh4OFhHNGdJQ0FnSUNBZ0lDOHZJRVp2Y2lCMGFHVWdibUYwYVhabElFZGxibVZ5WVhSdmNrWjFibU4wYVc5dUlHTnZibk4wY25WamRHOXlMQ0IwYUdVZ1ltVnpkQ0IzWlNCallXNWNiaUFnSUNBZ0lDQWdMeThnWkc4Z2FYTWdkRzhnWTJobFkyc2dhWFJ6SUM1dVlXMWxJSEJ5YjNCbGNuUjVMbHh1SUNBZ0lDQWdJQ0FvWTNSdmNpNWthWE53YkdGNVRtRnRaU0I4ZkNCamRHOXlMbTVoYldVcElEMDlQU0JjSWtkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1WENKY2JpQWdJQ0FnSURvZ1ptRnNjMlU3WEc0Z0lIMDdYRzVjYmlBZ2NuVnVkR2x0WlM1dFlYSnJJRDBnWm5WdVkzUnBiMjRvWjJWdVJuVnVLU0I3WEc0Z0lDQWdhV1lnS0U5aWFtVmpkQzV6WlhSUWNtOTBiM1I1Y0dWUFppa2dlMXh1SUNBZ0lDQWdUMkpxWldOMExuTmxkRkJ5YjNSdmRIbHdaVTltS0dkbGJrWjFiaXdnUjJWdVpYSmhkRzl5Um5WdVkzUnBiMjVRY205MGIzUjVjR1VwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQm5aVzVHZFc0dVgxOXdjbTkwYjE5ZklEMGdSMlZ1WlhKaGRHOXlSblZ1WTNScGIyNVFjbTkwYjNSNWNHVTdYRzRnSUNBZ0lDQnBaaUFvSVNoMGIxTjBjbWx1WjFSaFoxTjViV0p2YkNCcGJpQm5aVzVHZFc0cEtTQjdYRzRnSUNBZ0lDQWdJR2RsYmtaMWJsdDBiMU4wY21sdVoxUmhaMU41YldKdmJGMGdQU0JjSWtkbGJtVnlZWFJ2Y2taMWJtTjBhVzl1WENJN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQWdJR2RsYmtaMWJpNXdjbTkwYjNSNWNHVWdQU0JQWW1wbFkzUXVZM0psWVhSbEtFZHdLVHRjYmlBZ0lDQnlaWFIxY200Z1oyVnVSblZ1TzF4dUlDQjlPMXh1WEc0Z0lDOHZJRmRwZEdocGJpQjBhR1VnWW05a2VTQnZaaUJoYm5rZ1lYTjVibU1nWm5WdVkzUnBiMjRzSUdCaGQyRnBkQ0I0WUNCcGN5QjBjbUZ1YzJadmNtMWxaQ0IwYjF4dUlDQXZMeUJnZVdsbGJHUWdjbVZuWlc1bGNtRjBiM0pTZFc1MGFXMWxMbUYzY21Gd0tIZ3BZQ3dnYzI4Z2RHaGhkQ0IwYUdVZ2NuVnVkR2x0WlNCallXNGdkR1Z6ZEZ4dUlDQXZMeUJnYUdGelQzZHVMbU5oYkd3b2RtRnNkV1VzSUZ3aVgxOWhkMkZwZEZ3aUtXQWdkRzhnWkdWMFpYSnRhVzVsSUdsbUlIUm9aU0I1YVdWc1pHVmtJSFpoYkhWbElHbHpYRzRnSUM4dklHMWxZVzUwSUhSdklHSmxJR0YzWVdsMFpXUXVYRzRnSUhKMWJuUnBiV1V1WVhkeVlYQWdQU0JtZFc1amRHbHZiaWhoY21jcElIdGNiaUFnSUNCeVpYUjFjbTRnZXlCZlgyRjNZV2wwT2lCaGNtY2dmVHRjYmlBZ2ZUdGNibHh1SUNCbWRXNWpkR2x2YmlCQmMzbHVZMGwwWlhKaGRHOXlLR2RsYm1WeVlYUnZjaWtnZTF4dUlDQWdJR1oxYm1OMGFXOXVJR2x1ZG05clpTaHRaWFJvYjJRc0lHRnlaeXdnY21WemIyeDJaU3dnY21WcVpXTjBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2NtVmpiM0prSUQwZ2RISjVRMkYwWTJnb1oyVnVaWEpoZEc5eVcyMWxkR2h2WkYwc0lHZGxibVZ5WVhSdmNpd2dZWEpuS1R0Y2JpQWdJQ0FnSUdsbUlDaHlaV052Y21RdWRIbHdaU0E5UFQwZ1hDSjBhSEp2ZDF3aUtTQjdYRzRnSUNBZ0lDQWdJSEpsYW1WamRDaHlaV052Y21RdVlYSm5LVHRjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCeVpYTjFiSFFnUFNCeVpXTnZjbVF1WVhKbk8xeHVJQ0FnSUNBZ0lDQjJZWElnZG1Gc2RXVWdQU0J5WlhOMWJIUXVkbUZzZFdVN1hHNGdJQ0FnSUNBZ0lHbG1JQ2gyWVd4MVpTQW1KbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RIbHdaVzltSUhaaGJIVmxJRDA5UFNCY0ltOWlhbVZqZEZ3aUlDWW1YRzRnSUNBZ0lDQWdJQ0FnSUNCb1lYTlBkMjR1WTJGc2JDaDJZV3gxWlN3Z1hDSmZYMkYzWVdsMFhDSXBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUZCeWIyMXBjMlV1Y21WemIyeDJaU2gyWVd4MVpTNWZYMkYzWVdsMEtTNTBhR1Z1S0daMWJtTjBhVzl1S0haaGJIVmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBiblp2YTJVb1hDSnVaWGgwWENJc0lIWmhiSFZsTENCeVpYTnZiSFpsTENCeVpXcGxZM1FwTzF4dUlDQWdJQ0FnSUNBZ0lIMHNJR1oxYm1OMGFXOXVLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYVc1MmIydGxLRndpZEdoeWIzZGNJaXdnWlhKeUxDQnlaWE52YkhabExDQnlaV3BsWTNRcE8xeHVJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlGQnliMjFwYzJVdWNtVnpiMngyWlNoMllXeDFaU2t1ZEdobGJpaG1kVzVqZEdsdmJpaDFibmR5WVhCd1pXUXBJSHRjYmlBZ0lDQWdJQ0FnSUNBdkx5QlhhR1Z1SUdFZ2VXbGxiR1JsWkNCUWNtOXRhWE5sSUdseklISmxjMjlzZG1Wa0xDQnBkSE1nWm1sdVlXd2dkbUZzZFdVZ1ltVmpiMjFsYzF4dUlDQWdJQ0FnSUNBZ0lDOHZJSFJvWlNBdWRtRnNkV1VnYjJZZ2RHaGxJRkJ5YjIxcGMyVThlM1poYkhWbExHUnZibVY5UGlCeVpYTjFiSFFnWm05eUlIUm9aVnh1SUNBZ0lDQWdJQ0FnSUM4dklHTjFjbkpsYm5RZ2FYUmxjbUYwYVc5dUxpQkpaaUIwYUdVZ1VISnZiV2x6WlNCcGN5QnlaV3BsWTNSbFpDd2dhRzkzWlhabGNpd2dkR2hsWEc0Z0lDQWdJQ0FnSUNBZ0x5OGdjbVZ6ZFd4MElHWnZjaUIwYUdseklHbDBaWEpoZEdsdmJpQjNhV3hzSUdKbElISmxhbVZqZEdWa0lIZHBkR2dnZEdobElITmhiV1ZjYmlBZ0lDQWdJQ0FnSUNBdkx5QnlaV0Z6YjI0dUlFNXZkR1VnZEdoaGRDQnlaV3BsWTNScGIyNXpJRzltSUhscFpXeGtaV1FnVUhKdmJXbHpaWE1nWVhKbElHNXZkRnh1SUNBZ0lDQWdJQ0FnSUM4dklIUm9jbTkzYmlCaVlXTnJJR2x1ZEc4Z2RHaGxJR2RsYm1WeVlYUnZjaUJtZFc1amRHbHZiaXdnWVhNZ2FYTWdkR2hsSUdOaGMyVmNiaUFnSUNBZ0lDQWdJQ0F2THlCM2FHVnVJR0Z1SUdGM1lXbDBaV1FnVUhKdmJXbHpaU0JwY3lCeVpXcGxZM1JsWkM0Z1ZHaHBjeUJrYVdabVpYSmxibU5sSUdsdVhHNGdJQ0FnSUNBZ0lDQWdMeThnWW1Wb1lYWnBiM0lnWW1WMGQyVmxiaUI1YVdWc1pDQmhibVFnWVhkaGFYUWdhWE1nYVcxd2IzSjBZVzUwTENCaVpXTmhkWE5sSUdsMFhHNGdJQ0FnSUNBZ0lDQWdMeThnWVd4c2IzZHpJSFJvWlNCamIyNXpkVzFsY2lCMGJ5QmtaV05wWkdVZ2QyaGhkQ0IwYnlCa2J5QjNhWFJvSUhSb1pTQjVhV1ZzWkdWa1hHNGdJQ0FnSUNBZ0lDQWdMeThnY21WcVpXTjBhVzl1SUNoemQyRnNiRzkzSUdsMElHRnVaQ0JqYjI1MGFXNTFaU3dnYldGdWRXRnNiSGtnTG5Sb2NtOTNJR2wwSUdKaFkydGNiaUFnSUNBZ0lDQWdJQ0F2THlCcGJuUnZJSFJvWlNCblpXNWxjbUYwYjNJc0lHRmlZVzVrYjI0Z2FYUmxjbUYwYVc5dUxDQjNhR0YwWlhabGNpa3VJRmRwZEdoY2JpQWdJQ0FnSUNBZ0lDQXZMeUJoZDJGcGRDd2dZbmtnWTI5dWRISmhjM1FzSUhSb1pYSmxJR2x6SUc1dklHOXdjRzl5ZEhWdWFYUjVJSFJ2SUdWNFlXMXBibVVnZEdobFhHNGdJQ0FnSUNBZ0lDQWdMeThnY21WcVpXTjBhVzl1SUhKbFlYTnZiaUJ2ZFhSemFXUmxJSFJvWlNCblpXNWxjbUYwYjNJZ1puVnVZM1JwYjI0c0lITnZJSFJvWlZ4dUlDQWdJQ0FnSUNBZ0lDOHZJRzl1YkhrZ2IzQjBhVzl1SUdseklIUnZJSFJvY205M0lHbDBJR1p5YjIwZ2RHaGxJR0YzWVdsMElHVjRjSEpsYzNOcGIyNHNJR0Z1WkZ4dUlDQWdJQ0FnSUNBZ0lDOHZJR3hsZENCMGFHVWdaMlZ1WlhKaGRHOXlJR1oxYm1OMGFXOXVJR2hoYm1Sc1pTQjBhR1VnWlhoalpYQjBhVzl1TGx4dUlDQWdJQ0FnSUNBZ0lISmxjM1ZzZEM1MllXeDFaU0E5SUhWdWQzSmhjSEJsWkR0Y2JpQWdJQ0FnSUNBZ0lDQnlaWE52YkhabEtISmxjM1ZzZENrN1hHNGdJQ0FnSUNBZ0lIMHNJSEpsYW1WamRDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RtRnlJSEJ5WlhacGIzVnpVSEp2YldselpUdGNibHh1SUNBZ0lHWjFibU4wYVc5dUlHVnVjWFZsZFdVb2JXVjBhRzlrTENCaGNtY3BJSHRjYmlBZ0lDQWdJR1oxYm1OMGFXOXVJR05oYkd4SmJuWnZhMlZYYVhSb1RXVjBhRzlrUVc1a1FYSm5LQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYm1WM0lGQnliMjFwYzJVb1puVnVZM1JwYjI0b2NtVnpiMngyWlN3Z2NtVnFaV04wS1NCN1hHNGdJQ0FnSUNBZ0lDQWdhVzUyYjJ0bEtHMWxkR2h2WkN3Z1lYSm5MQ0J5WlhOdmJIWmxMQ0J5WldwbFkzUXBPMXh1SUNBZ0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2NtVjBkWEp1SUhCeVpYWnBiM1Z6VUhKdmJXbHpaU0E5WEc0Z0lDQWdJQ0FnSUM4dklFbG1JR1Z1Y1hWbGRXVWdhR0Z6SUdKbFpXNGdZMkZzYkdWa0lHSmxabTl5WlN3Z2RHaGxiaUIzWlNCM1lXNTBJSFJ2SUhkaGFYUWdkVzUwYVd4Y2JpQWdJQ0FnSUNBZ0x5OGdZV3hzSUhCeVpYWnBiM1Z6SUZCeWIyMXBjMlZ6SUdoaGRtVWdZbVZsYmlCeVpYTnZiSFpsWkNCaVpXWnZjbVVnWTJGc2JHbHVaeUJwYm5admEyVXNYRzRnSUNBZ0lDQWdJQzh2SUhOdklIUm9ZWFFnY21WemRXeDBjeUJoY21VZ1lXeDNZWGx6SUdSbGJHbDJaWEpsWkNCcGJpQjBhR1VnWTI5eWNtVmpkQ0J2Y21SbGNpNGdTV1pjYmlBZ0lDQWdJQ0FnTHk4Z1pXNXhkV1YxWlNCb1lYTWdibTkwSUdKbFpXNGdZMkZzYkdWa0lHSmxabTl5WlN3Z2RHaGxiaUJwZENCcGN5QnBiWEJ2Y25SaGJuUWdkRzljYmlBZ0lDQWdJQ0FnTHk4Z1kyRnNiQ0JwYm5admEyVWdhVzF0WldScFlYUmxiSGtzSUhkcGRHaHZkWFFnZDJGcGRHbHVaeUJ2YmlCaElHTmhiR3hpWVdOcklIUnZJR1pwY21Vc1hHNGdJQ0FnSUNBZ0lDOHZJSE52SUhSb1lYUWdkR2hsSUdGemVXNWpJR2RsYm1WeVlYUnZjaUJtZFc1amRHbHZiaUJvWVhNZ2RHaGxJRzl3Y0c5eWRIVnVhWFI1SUhSdklHUnZYRzRnSUNBZ0lDQWdJQzh2SUdGdWVTQnVaV05sYzNOaGNua2djMlYwZFhBZ2FXNGdZU0J3Y21Wa2FXTjBZV0pzWlNCM1lYa3VJRlJvYVhNZ2NISmxaR2xqZEdGaWFXeHBkSGxjYmlBZ0lDQWdJQ0FnTHk4Z2FYTWdkMmg1SUhSb1pTQlFjbTl0YVhObElHTnZibk4wY25WamRHOXlJSE41Ym1Ob2NtOXViM1Z6YkhrZ2FXNTJiMnRsY3lCcGRITmNiaUFnSUNBZ0lDQWdMeThnWlhobFkzVjBiM0lnWTJGc2JHSmhZMnNzSUdGdVpDQjNhSGtnWVhONWJtTWdablZ1WTNScGIyNXpJSE41Ym1Ob2NtOXViM1Z6YkhsY2JpQWdJQ0FnSUNBZ0x5OGdaWGhsWTNWMFpTQmpiMlJsSUdKbFptOXlaU0IwYUdVZ1ptbHljM1FnWVhkaGFYUXVJRk5wYm1ObElIZGxJR2x0Y0d4bGJXVnVkQ0J6YVcxd2JHVmNiaUFnSUNBZ0lDQWdMeThnWVhONWJtTWdablZ1WTNScGIyNXpJR2x1SUhSbGNtMXpJRzltSUdGemVXNWpJR2RsYm1WeVlYUnZjbk1zSUdsMElHbHpJR1Z6Y0dWamFXRnNiSGxjYmlBZ0lDQWdJQ0FnTHk4Z2FXMXdiM0owWVc1MElIUnZJR2RsZENCMGFHbHpJSEpwWjJoMExDQmxkbVZ1SUhSb2IzVm5hQ0JwZENCeVpYRjFhWEpsY3lCallYSmxMbHh1SUNBZ0lDQWdJQ0J3Y21WMmFXOTFjMUJ5YjIxcGMyVWdQeUJ3Y21WMmFXOTFjMUJ5YjIxcGMyVXVkR2hsYmloY2JpQWdJQ0FnSUNBZ0lDQmpZV3hzU1c1MmIydGxWMmwwYUUxbGRHaHZaRUZ1WkVGeVp5eGNiaUFnSUNBZ0lDQWdJQ0F2THlCQmRtOXBaQ0J3Y205d1lXZGhkR2x1WnlCbVlXbHNkWEpsY3lCMGJ5QlFjbTl0YVhObGN5QnlaWFIxY201bFpDQmllU0JzWVhSbGNseHVJQ0FnSUNBZ0lDQWdJQzh2SUdsdWRtOWpZWFJwYjI1eklHOW1JSFJvWlNCcGRHVnlZWFJ2Y2k1Y2JpQWdJQ0FnSUNBZ0lDQmpZV3hzU1c1MmIydGxWMmwwYUUxbGRHaHZaRUZ1WkVGeVoxeHVJQ0FnSUNBZ0lDQXBJRG9nWTJGc2JFbHVkbTlyWlZkcGRHaE5aWFJvYjJSQmJtUkJjbWNvS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCRVpXWnBibVVnZEdobElIVnVhV1pwWldRZ2FHVnNjR1Z5SUcxbGRHaHZaQ0IwYUdGMElHbHpJSFZ6WldRZ2RHOGdhVzF3YkdWdFpXNTBJQzV1WlhoMExGeHVJQ0FnSUM4dklDNTBhSEp2ZHl3Z1lXNWtJQzV5WlhSMWNtNGdLSE5sWlNCa1pXWnBibVZKZEdWeVlYUnZjazFsZEdodlpITXBMbHh1SUNBZ0lIUm9hWE11WDJsdWRtOXJaU0E5SUdWdWNYVmxkV1U3WEc0Z0lIMWNibHh1SUNCa1pXWnBibVZKZEdWeVlYUnZjazFsZEdodlpITW9RWE41Ym1OSmRHVnlZWFJ2Y2k1d2NtOTBiM1I1Y0dVcE8xeHVJQ0JCYzNsdVkwbDBaWEpoZEc5eUxuQnliM1J2ZEhsd1pWdGhjM2x1WTBsMFpYSmhkRzl5VTNsdFltOXNYU0E5SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlR0Y2JpQWdjblZ1ZEdsdFpTNUJjM2x1WTBsMFpYSmhkRzl5SUQwZ1FYTjVibU5KZEdWeVlYUnZjanRjYmx4dUlDQXZMeUJPYjNSbElIUm9ZWFFnYzJsdGNHeGxJR0Z6ZVc1aklHWjFibU4wYVc5dWN5QmhjbVVnYVcxd2JHVnRaVzUwWldRZ2IyNGdkRzl3SUc5bVhHNGdJQzh2SUVGemVXNWpTWFJsY21GMGIzSWdiMkpxWldOMGN6c2dkR2hsZVNCcWRYTjBJSEpsZEhWeWJpQmhJRkJ5YjIxcGMyVWdabTl5SUhSb1pTQjJZV3gxWlNCdlpseHVJQ0F2THlCMGFHVWdabWx1WVd3Z2NtVnpkV3gwSUhCeWIyUjFZMlZrSUdKNUlIUm9aU0JwZEdWeVlYUnZjaTVjYmlBZ2NuVnVkR2x0WlM1aGMzbHVZeUE5SUdaMWJtTjBhVzl1S0dsdWJtVnlSbTRzSUc5MWRHVnlSbTRzSUhObGJHWXNJSFJ5ZVV4dlkzTk1hWE4wS1NCN1hHNGdJQ0FnZG1GeUlHbDBaWElnUFNCdVpYY2dRWE41Ym1OSmRHVnlZWFJ2Y2loY2JpQWdJQ0FnSUhkeVlYQW9hVzV1WlhKR2Jpd2diM1YwWlhKR2Jpd2djMlZzWml3Z2RISjVURzlqYzB4cGMzUXBYRzRnSUNBZ0tUdGNibHh1SUNBZ0lISmxkSFZ5YmlCeWRXNTBhVzFsTG1selIyVnVaWEpoZEc5eVJuVnVZM1JwYjI0b2IzVjBaWEpHYmlsY2JpQWdJQ0FnSUQ4Z2FYUmxjaUF2THlCSlppQnZkWFJsY2tadUlHbHpJR0VnWjJWdVpYSmhkRzl5TENCeVpYUjFjbTRnZEdobElHWjFiR3dnYVhSbGNtRjBiM0l1WEc0Z0lDQWdJQ0E2SUdsMFpYSXVibVY0ZENncExuUm9aVzRvWm5WdVkzUnBiMjRvY21WemRXeDBLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhKbGMzVnNkQzVrYjI1bElEOGdjbVZ6ZFd4MExuWmhiSFZsSURvZ2FYUmxjaTV1WlhoMEtDazdYRzRnSUNBZ0lDQWdJSDBwTzF4dUlDQjlPMXh1WEc0Z0lHWjFibU4wYVc5dUlHMWhhMlZKYm5admEyVk5aWFJvYjJRb2FXNXVaWEpHYml3Z2MyVnNaaXdnWTI5dWRHVjRkQ2tnZTF4dUlDQWdJSFpoY2lCemRHRjBaU0E5SUVkbGJsTjBZWFJsVTNWemNHVnVaR1ZrVTNSaGNuUTdYRzVjYmlBZ0lDQnlaWFIxY200Z1puVnVZM1JwYjI0Z2FXNTJiMnRsS0cxbGRHaHZaQ3dnWVhKbktTQjdYRzRnSUNBZ0lDQnBaaUFvYzNSaGRHVWdQVDA5SUVkbGJsTjBZWFJsUlhobFkzVjBhVzVuS1NCN1hHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2loY0lrZGxibVZ5WVhSdmNpQnBjeUJoYkhKbFlXUjVJSEoxYm01cGJtZGNJaWs3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdsbUlDaHpkR0YwWlNBOVBUMGdSMlZ1VTNSaGRHVkRiMjF3YkdWMFpXUXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHMWxkR2h2WkNBOVBUMGdYQ0owYUhKdmQxd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2RHaHliM2NnWVhKbk8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1FtVWdabTl5WjJsMmFXNW5MQ0J3WlhJZ01qVXVNeTR6TGpNdU15QnZaaUIwYUdVZ2MzQmxZenBjYmlBZ0lDQWdJQ0FnTHk4Z2FIUjBjSE02THk5d1pXOXdiR1V1Ylc5NmFXeHNZUzV2Y21jdmZtcHZjbVZ1Wkc5eVptWXZaWE0yTFdSeVlXWjBMbWgwYld3amMyVmpMV2RsYm1WeVlYUnZjbkpsYzNWdFpWeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z1pHOXVaVkpsYzNWc2RDZ3BPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JqYjI1MFpYaDBMbTFsZEdodlpDQTlJRzFsZEdodlpEdGNiaUFnSUNBZ0lHTnZiblJsZUhRdVlYSm5JRDBnWVhKbk8xeHVYRzRnSUNBZ0lDQjNhR2xzWlNBb2RISjFaU2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdaR1ZzWldkaGRHVWdQU0JqYjI1MFpYaDBMbVJsYkdWbllYUmxPMXh1SUNBZ0lDQWdJQ0JwWmlBb1pHVnNaV2RoZEdVcElIdGNiaUFnSUNBZ0lDQWdJQ0IyWVhJZ1pHVnNaV2RoZEdWU1pYTjFiSFFnUFNCdFlYbGlaVWx1ZG05clpVUmxiR1ZuWVhSbEtHUmxiR1ZuWVhSbExDQmpiMjUwWlhoMEtUdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1pHVnNaV2RoZEdWU1pYTjFiSFFwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNoa1pXeGxaMkYwWlZKbGMzVnNkQ0E5UFQwZ1EyOXVkR2x1ZFdWVFpXNTBhVzVsYkNrZ1kyOXVkR2x1ZFdVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdaR1ZzWldkaGRHVlNaWE4xYkhRN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLR052Ym5SbGVIUXViV1YwYUc5a0lEMDlQU0JjSW01bGVIUmNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJRk5sZEhScGJtY2dZMjl1ZEdWNGRDNWZjMlZ1ZENCbWIzSWdiR1ZuWVdONUlITjFjSEJ2Y25RZ2IyWWdRbUZpWld3bmMxeHVJQ0FnSUNBZ0lDQWdJQzh2SUdaMWJtTjBhVzl1TG5ObGJuUWdhVzF3YkdWdFpXNTBZWFJwYjI0dVhHNGdJQ0FnSUNBZ0lDQWdZMjl1ZEdWNGRDNXpaVzUwSUQwZ1kyOXVkR1Y0ZEM1ZmMyVnVkQ0E5SUdOdmJuUmxlSFF1WVhKbk8xeHVYRzRnSUNBZ0lDQWdJSDBnWld4elpTQnBaaUFvWTI5dWRHVjRkQzV0WlhSb2IyUWdQVDA5SUZ3aWRHaHliM2RjSWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR2xtSUNoemRHRjBaU0E5UFQwZ1IyVnVVM1JoZEdWVGRYTndaVzVrWldSVGRHRnlkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdjM1JoZEdVZ1BTQkhaVzVUZEdGMFpVTnZiWEJzWlhSbFpEdGNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2NtOTNJR052Ym5SbGVIUXVZWEpuTzF4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUdOdmJuUmxlSFF1WkdsemNHRjBZMmhGZUdObGNIUnBiMjRvWTI5dWRHVjRkQzVoY21jcE8xeHVYRzRnSUNBZ0lDQWdJSDBnWld4elpTQnBaaUFvWTI5dWRHVjRkQzV0WlhSb2IyUWdQVDA5SUZ3aWNtVjBkWEp1WENJcElIdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1MFpYaDBMbUZpY25Wd2RDaGNJbkpsZEhWeWJsd2lMQ0JqYjI1MFpYaDBMbUZ5WnlrN1hHNGdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0J6ZEdGMFpTQTlJRWRsYmxOMFlYUmxSWGhsWTNWMGFXNW5PMXh1WEc0Z0lDQWdJQ0FnSUhaaGNpQnlaV052Y21RZ1BTQjBjbmxEWVhSamFDaHBibTVsY2tadUxDQnpaV3htTENCamIyNTBaWGgwS1R0Y2JpQWdJQ0FnSUNBZ2FXWWdLSEpsWTI5eVpDNTBlWEJsSUQwOVBTQmNJbTV2Y20xaGJGd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdTV1lnWVc0Z1pYaGpaWEIwYVc5dUlHbHpJSFJvY205M2JpQm1jbTl0SUdsdWJtVnlSbTRzSUhkbElHeGxZWFpsSUhOMFlYUmxJRDA5UFZ4dUlDQWdJQ0FnSUNBZ0lDOHZJRWRsYmxOMFlYUmxSWGhsWTNWMGFXNW5JR0Z1WkNCc2IyOXdJR0poWTJzZ1ptOXlJR0Z1YjNSb1pYSWdhVzUyYjJOaGRHbHZiaTVjYmlBZ0lDQWdJQ0FnSUNCemRHRjBaU0E5SUdOdmJuUmxlSFF1Wkc5dVpWeHVJQ0FnSUNBZ0lDQWdJQ0FnUHlCSFpXNVRkR0YwWlVOdmJYQnNaWFJsWkZ4dUlDQWdJQ0FnSUNBZ0lDQWdPaUJIWlc1VGRHRjBaVk4xYzNCbGJtUmxaRmxwWld4a08xeHVYRzRnSUNBZ0lDQWdJQ0FnYVdZZ0tISmxZMjl5WkM1aGNtY2dQVDA5SUVOdmJuUnBiblZsVTJWdWRHbHVaV3dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR052Ym5ScGJuVmxPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nY21WamIzSmtMbUZ5Wnl4Y2JpQWdJQ0FnSUNBZ0lDQWdJR1J2Ym1VNklHTnZiblJsZUhRdVpHOXVaVnh1SUNBZ0lDQWdJQ0FnSUgwN1hHNWNiaUFnSUNBZ0lDQWdmU0JsYkhObElHbG1JQ2h5WldOdmNtUXVkSGx3WlNBOVBUMGdYQ0owYUhKdmQxd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ2MzUmhkR1VnUFNCSFpXNVRkR0YwWlVOdmJYQnNaWFJsWkR0Y2JpQWdJQ0FnSUNBZ0lDQXZMeUJFYVhOd1lYUmphQ0IwYUdVZ1pYaGpaWEIwYVc5dUlHSjVJR3h2YjNCcGJtY2dZbUZqYXlCaGNtOTFibVFnZEc4Z2RHaGxYRzRnSUNBZ0lDQWdJQ0FnTHk4Z1kyOXVkR1Y0ZEM1a2FYTndZWFJqYUVWNFkyVndkR2x2YmloamIyNTBaWGgwTG1GeVp5a2dZMkZzYkNCaFltOTJaUzVjYmlBZ0lDQWdJQ0FnSUNCamIyNTBaWGgwTG0xbGRHaHZaQ0E5SUZ3aWRHaHliM2RjSWp0Y2JpQWdJQ0FnSUNBZ0lDQmpiMjUwWlhoMExtRnlaeUE5SUhKbFkyOXlaQzVoY21jN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOU8xeHVJQ0I5WEc1Y2JpQWdMeThnUTJGc2JDQmtaV3hsWjJGMFpTNXBkR1Z5WVhSdmNsdGpiMjUwWlhoMExtMWxkR2h2WkYwb1kyOXVkR1Y0ZEM1aGNtY3BJR0Z1WkNCb1lXNWtiR1VnZEdobFhHNGdJQzh2SUhKbGMzVnNkQ3dnWldsMGFHVnlJR0o1SUhKbGRIVnlibWx1WnlCaElIc2dkbUZzZFdVc0lHUnZibVVnZlNCeVpYTjFiSFFnWm5KdmJTQjBhR1ZjYmlBZ0x5OGdaR1ZzWldkaGRHVWdhWFJsY21GMGIzSXNJRzl5SUdKNUlHMXZaR2xtZVdsdVp5QmpiMjUwWlhoMExtMWxkR2h2WkNCaGJtUWdZMjl1ZEdWNGRDNWhjbWNzWEc0Z0lDOHZJSE5sZEhScGJtY2dZMjl1ZEdWNGRDNWtaV3hsWjJGMFpTQjBieUJ1ZFd4c0xDQmhibVFnY21WMGRYSnVhVzVuSUhSb1pTQkRiMjUwYVc1MVpWTmxiblJwYm1Wc0xseHVJQ0JtZFc1amRHbHZiaUJ0WVhsaVpVbHVkbTlyWlVSbGJHVm5ZWFJsS0dSbGJHVm5ZWFJsTENCamIyNTBaWGgwS1NCN1hHNGdJQ0FnZG1GeUlHMWxkR2h2WkNBOUlHUmxiR1ZuWVhSbExtbDBaWEpoZEc5eVcyTnZiblJsZUhRdWJXVjBhRzlrWFR0Y2JpQWdJQ0JwWmlBb2JXVjBhRzlrSUQwOVBTQjFibVJsWm1sdVpXUXBJSHRjYmlBZ0lDQWdJQzh2SUVFZ0xuUm9jbTkzSUc5eUlDNXlaWFIxY200Z2QyaGxiaUIwYUdVZ1pHVnNaV2RoZEdVZ2FYUmxjbUYwYjNJZ2FHRnpJRzV2SUM1MGFISnZkMXh1SUNBZ0lDQWdMeThnYldWMGFHOWtJR0ZzZDJGNWN5QjBaWEp0YVc1aGRHVnpJSFJvWlNCNWFXVnNaQ29nYkc5dmNDNWNiaUFnSUNBZ0lHTnZiblJsZUhRdVpHVnNaV2RoZEdVZ1BTQnVkV3hzTzF4dVhHNGdJQ0FnSUNCcFppQW9ZMjl1ZEdWNGRDNXRaWFJvYjJRZ1BUMDlJRndpZEdoeWIzZGNJaWtnZTF4dUlDQWdJQ0FnSUNCcFppQW9aR1ZzWldkaGRHVXVhWFJsY21GMGIzSXVjbVYwZFhKdUtTQjdYRzRnSUNBZ0lDQWdJQ0FnTHk4Z1NXWWdkR2hsSUdSbGJHVm5ZWFJsSUdsMFpYSmhkRzl5SUdoaGN5QmhJSEpsZEhWeWJpQnRaWFJvYjJRc0lHZHBkbVVnYVhRZ1lWeHVJQ0FnSUNBZ0lDQWdJQzh2SUdOb1lXNWpaU0IwYnlCamJHVmhiaUIxY0M1Y2JpQWdJQ0FnSUNBZ0lDQmpiMjUwWlhoMExtMWxkR2h2WkNBOUlGd2ljbVYwZFhKdVhDSTdYRzRnSUNBZ0lDQWdJQ0FnWTI5dWRHVjRkQzVoY21jZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJQ0FnYldGNVltVkpiblp2YTJWRVpXeGxaMkYwWlNoa1pXeGxaMkYwWlN3Z1kyOXVkR1Y0ZENrN1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb1kyOXVkR1Y0ZEM1dFpYUm9iMlFnUFQwOUlGd2lkR2h5YjNkY0lpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdTV1lnYldGNVltVkpiblp2YTJWRVpXeGxaMkYwWlNoamIyNTBaWGgwS1NCamFHRnVaMlZrSUdOdmJuUmxlSFF1YldWMGFHOWtJR1p5YjIxY2JpQWdJQ0FnSUNBZ0lDQWdJQzh2SUZ3aWNtVjBkWEp1WENJZ2RHOGdYQ0owYUhKdmQxd2lMQ0JzWlhRZ2RHaGhkQ0J2ZG1WeWNtbGtaU0IwYUdVZ1ZIbHdaVVZ5Y205eUlHSmxiRzkzTGx4dUlDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlFTnZiblJwYm5WbFUyVnVkR2x1Wld3N1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ1kyOXVkR1Y0ZEM1dFpYUm9iMlFnUFNCY0luUm9jbTkzWENJN1hHNGdJQ0FnSUNBZ0lHTnZiblJsZUhRdVlYSm5JRDBnYm1WM0lGUjVjR1ZGY25KdmNpaGNiaUFnSUNBZ0lDQWdJQ0JjSWxSb1pTQnBkR1Z5WVhSdmNpQmtiMlZ6SUc1dmRDQndjbTkyYVdSbElHRWdKM1JvY205M0p5QnRaWFJvYjJSY0lpazdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQkRiMjUwYVc1MVpWTmxiblJwYm1Wc08xeHVJQ0FnSUgxY2JseHVJQ0FnSUhaaGNpQnlaV052Y21RZ1BTQjBjbmxEWVhSamFDaHRaWFJvYjJRc0lHUmxiR1ZuWVhSbExtbDBaWEpoZEc5eUxDQmpiMjUwWlhoMExtRnlaeWs3WEc1Y2JpQWdJQ0JwWmlBb2NtVmpiM0prTG5SNWNHVWdQVDA5SUZ3aWRHaHliM2RjSWlrZ2UxeHVJQ0FnSUNBZ1kyOXVkR1Y0ZEM1dFpYUm9iMlFnUFNCY0luUm9jbTkzWENJN1hHNGdJQ0FnSUNCamIyNTBaWGgwTG1GeVp5QTlJSEpsWTI5eVpDNWhjbWM3WEc0Z0lDQWdJQ0JqYjI1MFpYaDBMbVJsYkdWbllYUmxJRDBnYm5Wc2JEdGNiaUFnSUNBZ0lISmxkSFZ5YmlCRGIyNTBhVzUxWlZObGJuUnBibVZzTzF4dUlDQWdJSDFjYmx4dUlDQWdJSFpoY2lCcGJtWnZJRDBnY21WamIzSmtMbUZ5Wnp0Y2JseHVJQ0FnSUdsbUlDZ2hJR2x1Wm04cElIdGNiaUFnSUNBZ0lHTnZiblJsZUhRdWJXVjBhRzlrSUQwZ1hDSjBhSEp2ZDF3aU8xeHVJQ0FnSUNBZ1kyOXVkR1Y0ZEM1aGNtY2dQU0J1WlhjZ1ZIbHdaVVZ5Y205eUtGd2lhWFJsY21GMGIzSWdjbVZ6ZFd4MElHbHpJRzV2ZENCaGJpQnZZbXBsWTNSY0lpazdYRzRnSUNBZ0lDQmpiMjUwWlhoMExtUmxiR1ZuWVhSbElEMGdiblZzYkR0Y2JpQWdJQ0FnSUhKbGRIVnliaUJEYjI1MGFXNTFaVk5sYm5ScGJtVnNPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2hwYm1adkxtUnZibVVwSUh0Y2JpQWdJQ0FnSUM4dklFRnpjMmxuYmlCMGFHVWdjbVZ6ZFd4MElHOW1JSFJvWlNCbWFXNXBjMmhsWkNCa1pXeGxaMkYwWlNCMGJ5QjBhR1VnZEdWdGNHOXlZWEo1WEc0Z0lDQWdJQ0F2THlCMllYSnBZV0pzWlNCemNHVmphV1pwWldRZ1lua2daR1ZzWldkaGRHVXVjbVZ6ZFd4MFRtRnRaU0FvYzJWbElHUmxiR1ZuWVhSbFdXbGxiR1FwTGx4dUlDQWdJQ0FnWTI5dWRHVjRkRnRrWld4bFoyRjBaUzV5WlhOMWJIUk9ZVzFsWFNBOUlHbHVabTh1ZG1Gc2RXVTdYRzVjYmlBZ0lDQWdJQzh2SUZKbGMzVnRaU0JsZUdWamRYUnBiMjRnWVhRZ2RHaGxJR1JsYzJseVpXUWdiRzlqWVhScGIyNGdLSE5sWlNCa1pXeGxaMkYwWlZscFpXeGtLUzVjYmlBZ0lDQWdJR052Ym5SbGVIUXVibVY0ZENBOUlHUmxiR1ZuWVhSbExtNWxlSFJNYjJNN1hHNWNiaUFnSUNBZ0lDOHZJRWxtSUdOdmJuUmxlSFF1YldWMGFHOWtJSGRoY3lCY0luUm9jbTkzWENJZ1luVjBJSFJvWlNCa1pXeGxaMkYwWlNCb1lXNWtiR1ZrSUhSb1pWeHVJQ0FnSUNBZ0x5OGdaWGhqWlhCMGFXOXVMQ0JzWlhRZ2RHaGxJRzkxZEdWeUlHZGxibVZ5WVhSdmNpQndjbTlqWldWa0lHNXZjbTFoYkd4NUxpQkpabHh1SUNBZ0lDQWdMeThnWTI5dWRHVjRkQzV0WlhSb2IyUWdkMkZ6SUZ3aWJtVjRkRndpTENCbWIzSm5aWFFnWTI5dWRHVjRkQzVoY21jZ2MybHVZMlVnYVhRZ2FHRnpJR0psWlc1Y2JpQWdJQ0FnSUM4dklGd2lZMjl1YzNWdFpXUmNJaUJpZVNCMGFHVWdaR1ZzWldkaGRHVWdhWFJsY21GMGIzSXVJRWxtSUdOdmJuUmxlSFF1YldWMGFHOWtJSGRoYzF4dUlDQWdJQ0FnTHk4Z1hDSnlaWFIxY201Y0lpd2dZV3hzYjNjZ2RHaGxJRzl5YVdkcGJtRnNJQzV5WlhSMWNtNGdZMkZzYkNCMGJ5QmpiMjUwYVc1MVpTQnBiaUIwYUdWY2JpQWdJQ0FnSUM4dklHOTFkR1Z5SUdkbGJtVnlZWFJ2Y2k1Y2JpQWdJQ0FnSUdsbUlDaGpiMjUwWlhoMExtMWxkR2h2WkNBaFBUMGdYQ0p5WlhSMWNtNWNJaWtnZTF4dUlDQWdJQ0FnSUNCamIyNTBaWGgwTG0xbGRHaHZaQ0E5SUZ3aWJtVjRkRndpTzF4dUlDQWdJQ0FnSUNCamIyNTBaWGgwTG1GeVp5QTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQXZMeUJTWlMxNWFXVnNaQ0IwYUdVZ2NtVnpkV3gwSUhKbGRIVnlibVZrSUdKNUlIUm9aU0JrWld4bFoyRjBaU0J0WlhSb2IyUXVYRzRnSUNBZ0lDQnlaWFIxY200Z2FXNW1ienRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJVYUdVZ1pHVnNaV2RoZEdVZ2FYUmxjbUYwYjNJZ2FYTWdabWx1YVhOb1pXUXNJSE52SUdadmNtZGxkQ0JwZENCaGJtUWdZMjl1ZEdsdWRXVWdkMmwwYUZ4dUlDQWdJQzh2SUhSb1pTQnZkWFJsY2lCblpXNWxjbUYwYjNJdVhHNGdJQ0FnWTI5dWRHVjRkQzVrWld4bFoyRjBaU0E5SUc1MWJHdzdYRzRnSUNBZ2NtVjBkWEp1SUVOdmJuUnBiblZsVTJWdWRHbHVaV3c3WEc0Z0lIMWNibHh1SUNBdkx5QkVaV1pwYm1VZ1IyVnVaWEpoZEc5eUxuQnliM1J2ZEhsd1pTNTdibVY0ZEN4MGFISnZkeXh5WlhSMWNtNTlJR2x1SUhSbGNtMXpJRzltSUhSb1pWeHVJQ0F2THlCMWJtbG1hV1ZrSUM1ZmFXNTJiMnRsSUdobGJIQmxjaUJ0WlhSb2IyUXVYRzRnSUdSbFptbHVaVWwwWlhKaGRHOXlUV1YwYUc5a2N5aEhjQ2s3WEc1Y2JpQWdSM0JiZEc5VGRISnBibWRVWVdkVGVXMWliMnhkSUQwZ1hDSkhaVzVsY21GMGIzSmNJanRjYmx4dUlDQXZMeUJCSUVkbGJtVnlZWFJ2Y2lCemFHOTFiR1FnWVd4M1lYbHpJSEpsZEhWeWJpQnBkSE5sYkdZZ1lYTWdkR2hsSUdsMFpYSmhkRzl5SUc5aWFtVmpkQ0IzYUdWdUlIUm9aVnh1SUNBdkx5QkFRR2wwWlhKaGRHOXlJR1oxYm1OMGFXOXVJR2x6SUdOaGJHeGxaQ0J2YmlCcGRDNGdVMjl0WlNCaWNtOTNjMlZ5Y3ljZ2FXMXdiR1Z0Wlc1MFlYUnBiMjV6SUc5bUlIUm9aVnh1SUNBdkx5QnBkR1Z5WVhSdmNpQndjbTkwYjNSNWNHVWdZMmhoYVc0Z2FXNWpiM0p5WldOMGJIa2dhVzF3YkdWdFpXNTBJSFJvYVhNc0lHTmhkWE5wYm1jZ2RHaGxJRWRsYm1WeVlYUnZjbHh1SUNBdkx5QnZZbXBsWTNRZ2RHOGdibTkwSUdKbElISmxkSFZ5Ym1Wa0lHWnliMjBnZEdocGN5QmpZV3hzTGlCVWFHbHpJR1Z1YzNWeVpYTWdkR2hoZENCa2IyVnpiaWQwSUdoaGNIQmxiaTVjYmlBZ0x5OGdVMlZsSUdoMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5bVlXTmxZbTl2YXk5eVpXZGxibVZ5WVhSdmNpOXBjM04xWlhNdk1qYzBJR1p2Y2lCdGIzSmxJR1JsZEdGcGJITXVYRzRnSUVkd1cybDBaWEpoZEc5eVUzbHRZbTlzWFNBOUlHWjFibU4wYVc5dUtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpPMXh1SUNCOU8xeHVYRzRnSUVkd0xuUnZVM1J5YVc1bklEMGdablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlGd2lXMjlpYW1WamRDQkhaVzVsY21GMGIzSmRYQ0k3WEc0Z0lIMDdYRzVjYmlBZ1puVnVZM1JwYjI0Z2NIVnphRlJ5ZVVWdWRISjVLR3h2WTNNcElIdGNiaUFnSUNCMllYSWdaVzUwY25rZ1BTQjdJSFJ5ZVV4dll6b2diRzlqYzFzd1hTQjlPMXh1WEc0Z0lDQWdhV1lnS0RFZ2FXNGdiRzlqY3lrZ2UxeHVJQ0FnSUNBZ1pXNTBjbmt1WTJGMFkyaE1iMk1nUFNCc2IyTnpXekZkTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNneUlHbHVJR3h2WTNNcElIdGNiaUFnSUNBZ0lHVnVkSEo1TG1acGJtRnNiSGxNYjJNZ1BTQnNiMk56V3pKZE8xeHVJQ0FnSUNBZ1pXNTBjbmt1WVdaMFpYSk1iMk1nUFNCc2IyTnpXek5kTzF4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdWRISjVSVzUwY21sbGN5NXdkWE5vS0dWdWRISjVLVHRjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUhKbGMyVjBWSEo1Ulc1MGNua29aVzUwY25rcElIdGNiaUFnSUNCMllYSWdjbVZqYjNKa0lEMGdaVzUwY25rdVkyOXRjR3hsZEdsdmJpQjhmQ0I3ZlR0Y2JpQWdJQ0J5WldOdmNtUXVkSGx3WlNBOUlGd2libTl5YldGc1hDSTdYRzRnSUNBZ1pHVnNaWFJsSUhKbFkyOXlaQzVoY21jN1hHNGdJQ0FnWlc1MGNua3VZMjl0Y0d4bGRHbHZiaUE5SUhKbFkyOXlaRHRjYmlBZ2ZWeHVYRzRnSUdaMWJtTjBhVzl1SUVOdmJuUmxlSFFvZEhKNVRHOWpjMHhwYzNRcElIdGNiaUFnSUNBdkx5QlVhR1VnY205dmRDQmxiblJ5ZVNCdlltcGxZM1FnS0dWbVptVmpkR2wyWld4NUlHRWdkSEo1SUhOMFlYUmxiV1Z1ZENCM2FYUm9iM1YwSUdFZ1kyRjBZMmhjYmlBZ0lDQXZMeUJ2Y2lCaElHWnBibUZzYkhrZ1lteHZZMnNwSUdkcGRtVnpJSFZ6SUdFZ2NHeGhZMlVnZEc4Z2MzUnZjbVVnZG1Gc2RXVnpJSFJvY205M2JpQm1jbTl0WEc0Z0lDQWdMeThnYkc5allYUnBiMjV6SUhkb1pYSmxJSFJvWlhKbElHbHpJRzV2SUdWdVkyeHZjMmx1WnlCMGNua2djM1JoZEdWdFpXNTBMbHh1SUNBZ0lIUm9hWE11ZEhKNVJXNTBjbWxsY3lBOUlGdDdJSFJ5ZVV4dll6b2dYQ0p5YjI5MFhDSWdmVjA3WEc0Z0lDQWdkSEo1VEc5amMweHBjM1F1Wm05eVJXRmphQ2h3ZFhOb1ZISjVSVzUwY25rc0lIUm9hWE1wTzF4dUlDQWdJSFJvYVhNdWNtVnpaWFFvZEhKMVpTazdYRzRnSUgxY2JseHVJQ0J5ZFc1MGFXMWxMbXRsZVhNZ1BTQm1kVzVqZEdsdmJpaHZZbXBsWTNRcElIdGNiaUFnSUNCMllYSWdhMlY1Y3lBOUlGdGRPMXh1SUNBZ0lHWnZjaUFvZG1GeUlHdGxlU0JwYmlCdlltcGxZM1FwSUh0Y2JpQWdJQ0FnSUd0bGVYTXVjSFZ6YUNoclpYa3BPMXh1SUNBZ0lIMWNiaUFnSUNCclpYbHpMbkpsZG1WeWMyVW9LVHRjYmx4dUlDQWdJQzh2SUZKaGRHaGxjaUIwYUdGdUlISmxkSFZ5Ym1sdVp5QmhiaUJ2WW1wbFkzUWdkMmwwYUNCaElHNWxlSFFnYldWMGFHOWtMQ0IzWlNCclpXVndYRzRnSUNBZ0x5OGdkR2hwYm1keklITnBiWEJzWlNCaGJtUWdjbVYwZFhKdUlIUm9aU0J1WlhoMElHWjFibU4wYVc5dUlHbDBjMlZzWmk1Y2JpQWdJQ0J5WlhSMWNtNGdablZ1WTNScGIyNGdibVY0ZENncElIdGNiaUFnSUNBZ0lIZG9hV3hsSUNoclpYbHpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0IyWVhJZ2EyVjVJRDBnYTJWNWN5NXdiM0FvS1R0Y2JpQWdJQ0FnSUNBZ2FXWWdLR3RsZVNCcGJpQnZZbXBsWTNRcElIdGNiaUFnSUNBZ0lDQWdJQ0J1WlhoMExuWmhiSFZsSUQwZ2EyVjVPMXh1SUNBZ0lDQWdJQ0FnSUc1bGVIUXVaRzl1WlNBOUlHWmhiSE5sTzF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCdVpYaDBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUM4dklGUnZJR0YyYjJsa0lHTnlaV0YwYVc1bklHRnVJR0ZrWkdsMGFXOXVZV3dnYjJKcVpXTjBMQ0IzWlNCcWRYTjBJR2hoYm1jZ2RHaGxJQzUyWVd4MVpWeHVJQ0FnSUNBZ0x5OGdZVzVrSUM1a2IyNWxJSEJ5YjNCbGNuUnBaWE1nYjJabUlIUm9aU0J1WlhoMElHWjFibU4wYVc5dUlHOWlhbVZqZENCcGRITmxiR1l1SUZSb2FYTmNiaUFnSUNBZ0lDOHZJR0ZzYzI4Z1pXNXpkWEpsY3lCMGFHRjBJSFJvWlNCdGFXNXBabWxsY2lCM2FXeHNJRzV2ZENCaGJtOXVlVzFwZW1VZ2RHaGxJR1oxYm1OMGFXOXVMbHh1SUNBZ0lDQWdibVY0ZEM1a2IyNWxJRDBnZEhKMVpUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCdVpYaDBPMXh1SUNBZ0lIMDdYRzRnSUgwN1hHNWNiaUFnWm5WdVkzUnBiMjRnZG1Gc2RXVnpLR2wwWlhKaFlteGxLU0I3WEc0Z0lDQWdhV1lnS0dsMFpYSmhZbXhsS1NCN1hHNGdJQ0FnSUNCMllYSWdhWFJsY21GMGIzSk5aWFJvYjJRZ1BTQnBkR1Z5WVdKc1pWdHBkR1Z5WVhSdmNsTjViV0p2YkYwN1hHNGdJQ0FnSUNCcFppQW9hWFJsY21GMGIzSk5aWFJvYjJRcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHbDBaWEpoZEc5eVRXVjBhRzlrTG1OaGJHd29hWFJsY21GaWJHVXBPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0JwWmlBb2RIbHdaVzltSUdsMFpYSmhZbXhsTG01bGVIUWdQVDA5SUZ3aVpuVnVZM1JwYjI1Y0lpa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdhWFJsY21GaWJHVTdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJR2xtSUNnaGFYTk9ZVTRvYVhSbGNtRmliR1V1YkdWdVozUm9LU2tnZTF4dUlDQWdJQ0FnSUNCMllYSWdhU0E5SUMweExDQnVaWGgwSUQwZ1puVnVZM1JwYjI0Z2JtVjRkQ2dwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjNhR2xzWlNBb0t5dHBJRHdnYVhSbGNtRmliR1V1YkdWdVozUm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvYUdGelQzZHVMbU5oYkd3b2FYUmxjbUZpYkdVc0lHa3BLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJRzVsZUhRdWRtRnNkV1VnUFNCcGRHVnlZV0pzWlZ0cFhUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2JtVjRkQzVrYjI1bElEMGdabUZzYzJVN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJ1WlhoME8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUc1bGVIUXVkbUZzZFdVZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJQ0FnYm1WNGRDNWtiMjVsSUQwZ2RISjFaVHRjYmx4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCdVpYaDBPMXh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCdVpYaDBMbTVsZUhRZ1BTQnVaWGgwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUZKbGRIVnliaUJoYmlCcGRHVnlZWFJ2Y2lCM2FYUm9JRzV2SUhaaGJIVmxjeTVjYmlBZ0lDQnlaWFIxY200Z2V5QnVaWGgwT2lCa2IyNWxVbVZ6ZFd4MElIMDdYRzRnSUgxY2JpQWdjblZ1ZEdsdFpTNTJZV3gxWlhNZ1BTQjJZV3gxWlhNN1hHNWNiaUFnWm5WdVkzUnBiMjRnWkc5dVpWSmxjM1ZzZENncElIdGNiaUFnSUNCeVpYUjFjbTRnZXlCMllXeDFaVG9nZFc1a1pXWnBibVZrTENCa2IyNWxPaUIwY25WbElIMDdYRzRnSUgxY2JseHVJQ0JEYjI1MFpYaDBMbkJ5YjNSdmRIbHdaU0E5SUh0Y2JpQWdJQ0JqYjI1emRISjFZM1J2Y2pvZ1EyOXVkR1Y0ZEN4Y2JseHVJQ0FnSUhKbGMyVjBPaUJtZFc1amRHbHZiaWh6YTJsd1ZHVnRjRkpsYzJWMEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG5CeVpYWWdQU0F3TzF4dUlDQWdJQ0FnZEdocGN5NXVaWGgwSUQwZ01EdGNiaUFnSUNBZ0lDOHZJRkpsYzJWMGRHbHVaeUJqYjI1MFpYaDBMbDl6Wlc1MElHWnZjaUJzWldkaFkza2djM1Z3Y0c5eWRDQnZaaUJDWVdKbGJDZHpYRzRnSUNBZ0lDQXZMeUJtZFc1amRHbHZiaTV6Wlc1MElHbHRjR3hsYldWdWRHRjBhVzl1TGx4dUlDQWdJQ0FnZEdocGN5NXpaVzUwSUQwZ2RHaHBjeTVmYzJWdWRDQTlJSFZ1WkdWbWFXNWxaRHRjYmlBZ0lDQWdJSFJvYVhNdVpHOXVaU0E5SUdaaGJITmxPMXh1SUNBZ0lDQWdkR2hwY3k1a1pXeGxaMkYwWlNBOUlHNTFiR3c3WEc1Y2JpQWdJQ0FnSUhSb2FYTXViV1YwYUc5a0lEMGdYQ0p1WlhoMFhDSTdYRzRnSUNBZ0lDQjBhR2x6TG1GeVp5QTlJSFZ1WkdWbWFXNWxaRHRjYmx4dUlDQWdJQ0FnZEdocGN5NTBjbmxGYm5SeWFXVnpMbVp2Y2tWaFkyZ29jbVZ6WlhSVWNubEZiblJ5ZVNrN1hHNWNiaUFnSUNBZ0lHbG1JQ2doYzJ0cGNGUmxiWEJTWlhObGRDa2dlMXh1SUNBZ0lDQWdJQ0JtYjNJZ0tIWmhjaUJ1WVcxbElHbHVJSFJvYVhNcElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCT2IzUWdjM1Z5WlNCaFltOTFkQ0IwYUdVZ2IzQjBhVzFoYkNCdmNtUmxjaUJ2WmlCMGFHVnpaU0JqYjI1a2FYUnBiMjV6T2x4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2h1WVcxbExtTm9ZWEpCZENnd0tTQTlQVDBnWENKMFhDSWdKaVpjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdhR0Z6VDNkdUxtTmhiR3dvZEdocGN5d2dibUZ0WlNrZ0ppWmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lXbHpUbUZPS0N0dVlXMWxMbk5zYVdObEtERXBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwYzF0dVlXMWxYU0E5SUhWdVpHVm1hVzVsWkR0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdjM1J2Y0RvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ0lDQjBhR2x6TG1SdmJtVWdQU0IwY25WbE8xeHVYRzRnSUNBZ0lDQjJZWElnY205dmRFVnVkSEo1SUQwZ2RHaHBjeTUwY25sRmJuUnlhV1Z6V3pCZE8xeHVJQ0FnSUNBZ2RtRnlJSEp2YjNSU1pXTnZjbVFnUFNCeWIyOTBSVzUwY25rdVkyOXRjR3hsZEdsdmJqdGNiaUFnSUNBZ0lHbG1JQ2h5YjI5MFVtVmpiM0prTG5SNWNHVWdQVDA5SUZ3aWRHaHliM2RjSWlrZ2UxeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCeWIyOTBVbVZqYjNKa0xtRnlaenRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWNuWmhiRHRjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdaR2x6Y0dGMFkyaEZlR05sY0hScGIyNDZJR1oxYm1OMGFXOXVLR1Y0WTJWd2RHbHZiaWtnZTF4dUlDQWdJQ0FnYVdZZ0tIUm9hWE11Wkc5dVpTa2dlMXh1SUNBZ0lDQWdJQ0IwYUhKdmR5QmxlR05sY0hScGIyNDdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFpoY2lCamIyNTBaWGgwSUQwZ2RHaHBjenRjYmlBZ0lDQWdJR1oxYm1OMGFXOXVJR2hoYm1Sc1pTaHNiMk1zSUdOaGRXZG9kQ2tnZTF4dUlDQWdJQ0FnSUNCeVpXTnZjbVF1ZEhsd1pTQTlJRndpZEdoeWIzZGNJanRjYmlBZ0lDQWdJQ0FnY21WamIzSmtMbUZ5WnlBOUlHVjRZMlZ3ZEdsdmJqdGNiaUFnSUNBZ0lDQWdZMjl1ZEdWNGRDNXVaWGgwSUQwZ2JHOWpPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaGpZWFZuYUhRcElIdGNiaUFnSUNBZ0lDQWdJQ0F2THlCSlppQjBhR1VnWkdsemNHRjBZMmhsWkNCbGVHTmxjSFJwYjI0Z2QyRnpJR05oZFdkb2RDQmllU0JoSUdOaGRHTm9JR0pzYjJOckxGeHVJQ0FnSUNBZ0lDQWdJQzh2SUhSb1pXNGdiR1YwSUhSb1lYUWdZMkYwWTJnZ1lteHZZMnNnYUdGdVpHeGxJSFJvWlNCbGVHTmxjSFJwYjI0Z2JtOXliV0ZzYkhrdVhHNGdJQ0FnSUNBZ0lDQWdZMjl1ZEdWNGRDNXRaWFJvYjJRZ1BTQmNJbTVsZUhSY0lqdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1MFpYaDBMbUZ5WnlBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnSUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnliaUFoSVNCallYVm5hSFE3WEc0Z0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQjBhR2x6TG5SeWVVVnVkSEpwWlhNdWJHVnVaM1JvSUMwZ01Uc2dhU0ErUFNBd095QXRMV2twSUh0Y2JpQWdJQ0FnSUNBZ2RtRnlJR1Z1ZEhKNUlEMGdkR2hwY3k1MGNubEZiblJ5YVdWelcybGRPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2NtVmpiM0prSUQwZ1pXNTBjbmt1WTI5dGNHeGxkR2x2Ymp0Y2JseHVJQ0FnSUNBZ0lDQnBaaUFvWlc1MGNua3VkSEo1VEc5aklEMDlQU0JjSW5KdmIzUmNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJRVY0WTJWd2RHbHZiaUIwYUhKdmQyNGdiM1YwYzJsa1pTQnZaaUJoYm5rZ2RISjVJR0pzYjJOcklIUm9ZWFFnWTI5MWJHUWdhR0Z1Wkd4bFhHNGdJQ0FnSUNBZ0lDQWdMeThnYVhRc0lITnZJSE5sZENCMGFHVWdZMjl0Y0d4bGRHbHZiaUIyWVd4MVpTQnZaaUIwYUdVZ1pXNTBhWEpsSUdaMWJtTjBhVzl1SUhSdlhHNGdJQ0FnSUNBZ0lDQWdMeThnZEdoeWIzY2dkR2hsSUdWNFkyVndkR2x2Ymk1Y2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2FHRnVaR3hsS0Z3aVpXNWtYQ0lwTzF4dUlDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdhV1lnS0dWdWRISjVMblJ5ZVV4dll5QThQU0IwYUdsekxuQnlaWFlwSUh0Y2JpQWdJQ0FnSUNBZ0lDQjJZWElnYUdGelEyRjBZMmdnUFNCb1lYTlBkMjR1WTJGc2JDaGxiblJ5ZVN3Z1hDSmpZWFJqYUV4dlkxd2lLVHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdhR0Z6Um1sdVlXeHNlU0E5SUdoaGMwOTNiaTVqWVd4c0tHVnVkSEo1TENCY0ltWnBibUZzYkhsTWIyTmNJaWs3WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvYUdGelEyRjBZMmdnSmlZZ2FHRnpSbWx1WVd4c2VTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLSFJvYVhNdWNISmxkaUE4SUdWdWRISjVMbU5oZEdOb1RHOWpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm9ZVzVrYkdVb1pXNTBjbmt1WTJGMFkyaE1iMk1zSUhSeWRXVXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaDBhR2x6TG5CeVpYWWdQQ0JsYm5SeWVTNW1hVzVoYkd4NVRHOWpLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQm9ZVzVrYkdVb1pXNTBjbmt1Wm1sdVlXeHNlVXh2WXlrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLR2hoYzBOaGRHTm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnBaaUFvZEdocGN5NXdjbVYySUR3Z1pXNTBjbmt1WTJGMFkyaE1iMk1wSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJR2hoYm1Sc1pTaGxiblJ5ZVM1allYUmphRXh2WXl3Z2RISjFaU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnSUNCOUlHVnNjMlVnYVdZZ0tHaGhjMFpwYm1Gc2JIa3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2gwYUdsekxuQnlaWFlnUENCbGJuUnllUzVtYVc1aGJHeDVURzlqS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJvWVc1a2JHVW9aVzUwY25rdVptbHVZV3hzZVV4dll5azdYRzRnSUNBZ0lDQWdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z3aWRISjVJSE4wWVhSbGJXVnVkQ0IzYVhSb2IzVjBJR05oZEdOb0lHOXlJR1pwYm1Gc2JIbGNJaWs3WEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTeGNibHh1SUNBZ0lHRmljblZ3ZERvZ1puVnVZM1JwYjI0b2RIbHdaU3dnWVhKbktTQjdYRzRnSUNBZ0lDQm1iM0lnS0haaGNpQnBJRDBnZEdocGN5NTBjbmxGYm5SeWFXVnpMbXhsYm1kMGFDQXRJREU3SUdrZ1BqMGdNRHNnTFMxcEtTQjdYRzRnSUNBZ0lDQWdJSFpoY2lCbGJuUnllU0E5SUhSb2FYTXVkSEo1Ulc1MGNtbGxjMXRwWFR0Y2JpQWdJQ0FnSUNBZ2FXWWdLR1Z1ZEhKNUxuUnllVXh2WXlBOFBTQjBhR2x6TG5CeVpYWWdKaVpjYmlBZ0lDQWdJQ0FnSUNBZ0lHaGhjMDkzYmk1allXeHNLR1Z1ZEhKNUxDQmNJbVpwYm1Gc2JIbE1iMk5jSWlrZ0ppWmNiaUFnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVjSEpsZGlBOElHVnVkSEo1TG1acGJtRnNiSGxNYjJNcElIdGNiaUFnSUNBZ0lDQWdJQ0IyWVhJZ1ptbHVZV3hzZVVWdWRISjVJRDBnWlc1MGNuazdYRzRnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tHWnBibUZzYkhsRmJuUnllU0FtSmx4dUlDQWdJQ0FnSUNBZ0lDaDBlWEJsSUQwOVBTQmNJbUp5WldGclhDSWdmSHhjYmlBZ0lDQWdJQ0FnSUNBZ2RIbHdaU0E5UFQwZ1hDSmpiMjUwYVc1MVpWd2lLU0FtSmx4dUlDQWdJQ0FnSUNBZ0lHWnBibUZzYkhsRmJuUnllUzUwY25sTWIyTWdQRDBnWVhKbklDWW1YRzRnSUNBZ0lDQWdJQ0FnWVhKbklEdzlJR1pwYm1Gc2JIbEZiblJ5ZVM1bWFXNWhiR3g1VEc5aktTQjdYRzRnSUNBZ0lDQWdJQzh2SUVsbmJtOXlaU0IwYUdVZ1ptbHVZV3hzZVNCbGJuUnllU0JwWmlCamIyNTBjbTlzSUdseklHNXZkQ0JxZFcxd2FXNW5JSFJ2SUdGY2JpQWdJQ0FnSUNBZ0x5OGdiRzlqWVhScGIyNGdiM1YwYzJsa1pTQjBhR1VnZEhKNUwyTmhkR05vSUdKc2IyTnJMbHh1SUNBZ0lDQWdJQ0JtYVc1aGJHeDVSVzUwY25rZ1BTQnVkV3hzTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCMllYSWdjbVZqYjNKa0lEMGdabWx1WVd4c2VVVnVkSEo1SUQ4Z1ptbHVZV3hzZVVWdWRISjVMbU52YlhCc1pYUnBiMjRnT2lCN2ZUdGNiaUFnSUNBZ0lISmxZMjl5WkM1MGVYQmxJRDBnZEhsd1pUdGNiaUFnSUNBZ0lISmxZMjl5WkM1aGNtY2dQU0JoY21jN1hHNWNiaUFnSUNBZ0lHbG1JQ2htYVc1aGJHeDVSVzUwY25rcElIdGNiaUFnSUNBZ0lDQWdkR2hwY3k1dFpYUm9iMlFnUFNCY0ltNWxlSFJjSWp0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV1WlhoMElEMGdabWx1WVd4c2VVVnVkSEo1TG1acGJtRnNiSGxNYjJNN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCRGIyNTBhVzUxWlZObGJuUnBibVZzTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCeVpYUjFjbTRnZEdocGN5NWpiMjF3YkdWMFpTaHlaV052Y21RcE8xeHVJQ0FnSUgwc1hHNWNiaUFnSUNCamIyMXdiR1YwWlRvZ1puVnVZM1JwYjI0b2NtVmpiM0prTENCaFpuUmxja3h2WXlrZ2UxeHVJQ0FnSUNBZ2FXWWdLSEpsWTI5eVpDNTBlWEJsSUQwOVBTQmNJblJvY205M1hDSXBJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2djbVZqYjNKa0xtRnlaenRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tISmxZMjl5WkM1MGVYQmxJRDA5UFNCY0ltSnlaV0ZyWENJZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0J5WldOdmNtUXVkSGx3WlNBOVBUMGdYQ0pqYjI1MGFXNTFaVndpS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11Ym1WNGRDQTlJSEpsWTI5eVpDNWhjbWM3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0hKbFkyOXlaQzUwZVhCbElEMDlQU0JjSW5KbGRIVnlibHdpS1NCN1hHNGdJQ0FnSUNBZ0lIUm9hWE11Y25aaGJDQTlJSFJvYVhNdVlYSm5JRDBnY21WamIzSmtMbUZ5Wnp0Y2JpQWdJQ0FnSUNBZ2RHaHBjeTV0WlhSb2IyUWdQU0JjSW5KbGRIVnlibHdpTzF4dUlDQWdJQ0FnSUNCMGFHbHpMbTVsZUhRZ1BTQmNJbVZ1WkZ3aU8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUdsbUlDaHlaV052Y21RdWRIbHdaU0E5UFQwZ1hDSnViM0p0WVd4Y0lpQW1KaUJoWm5SbGNreHZZeWtnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbTVsZUhRZ1BTQmhablJsY2t4dll6dGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlFTnZiblJwYm5WbFUyVnVkR2x1Wld3N1hHNGdJQ0FnZlN4Y2JseHVJQ0FnSUdacGJtbHphRG9nWm5WdVkzUnBiMjRvWm1sdVlXeHNlVXh2WXlrZ2UxeHVJQ0FnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJSFJvYVhNdWRISjVSVzUwY21sbGN5NXNaVzVuZEdnZ0xTQXhPeUJwSUQ0OUlEQTdJQzB0YVNrZ2UxeHVJQ0FnSUNBZ0lDQjJZWElnWlc1MGNua2dQU0IwYUdsekxuUnllVVZ1ZEhKcFpYTmJhVjA3WEc0Z0lDQWdJQ0FnSUdsbUlDaGxiblJ5ZVM1bWFXNWhiR3g1VEc5aklEMDlQU0JtYVc1aGJHeDVURzlqS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1amIyMXdiR1YwWlNobGJuUnllUzVqYjIxd2JHVjBhVzl1TENCbGJuUnllUzVoWm5SbGNreHZZeWs3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnpaWFJVY25sRmJuUnllU2hsYm5SeWVTazdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJRU52Ym5ScGJuVmxVMlZ1ZEdsdVpXdzdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMRnh1WEc0Z0lDQWdYQ0pqWVhSamFGd2lPaUJtZFc1amRHbHZiaWgwY25sTWIyTXBJSHRjYmlBZ0lDQWdJR1p2Y2lBb2RtRnlJR2tnUFNCMGFHbHpMblJ5ZVVWdWRISnBaWE11YkdWdVozUm9JQzBnTVRzZ2FTQStQU0F3T3lBdExXa3BJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlHVnVkSEo1SUQwZ2RHaHBjeTUwY25sRmJuUnlhV1Z6VzJsZE8xeHVJQ0FnSUNBZ0lDQnBaaUFvWlc1MGNua3VkSEo1VEc5aklEMDlQU0IwY25sTWIyTXBJSHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdjbVZqYjNKa0lEMGdaVzUwY25rdVkyOXRjR3hsZEdsdmJqdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2NtVmpiM0prTG5SNWNHVWdQVDA5SUZ3aWRHaHliM2RjSWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnZG1GeUlIUm9jbTkzYmlBOUlISmxZMjl5WkM1aGNtYzdYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYTmxkRlJ5ZVVWdWRISjVLR1Z1ZEhKNUtUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSb2NtOTNianRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBdkx5QlVhR1VnWTI5dWRHVjRkQzVqWVhSamFDQnRaWFJvYjJRZ2JYVnpkQ0J2Ym14NUlHSmxJR05oYkd4bFpDQjNhWFJvSUdFZ2JHOWpZWFJwYjI1Y2JpQWdJQ0FnSUM4dklHRnlaM1Z0Wlc1MElIUm9ZWFFnWTI5eWNtVnpjRzl1WkhNZ2RHOGdZU0JyYm05M2JpQmpZWFJqYUNCaWJHOWpheTVjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGNJbWxzYkdWbllXd2dZMkYwWTJnZ1lYUjBaVzF3ZEZ3aUtUdGNiaUFnSUNCOUxGeHVYRzRnSUNBZ1pHVnNaV2RoZEdWWmFXVnNaRG9nWm5WdVkzUnBiMjRvYVhSbGNtRmliR1VzSUhKbGMzVnNkRTVoYldVc0lHNWxlSFJNYjJNcElIdGNiaUFnSUNBZ0lIUm9hWE11WkdWc1pXZGhkR1VnUFNCN1hHNGdJQ0FnSUNBZ0lHbDBaWEpoZEc5eU9pQjJZV3gxWlhNb2FYUmxjbUZpYkdVcExGeHVJQ0FnSUNBZ0lDQnlaWE4xYkhST1lXMWxPaUJ5WlhOMWJIUk9ZVzFsTEZ4dUlDQWdJQ0FnSUNCdVpYaDBURzlqT2lCdVpYaDBURzlqWEc0Z0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dFpYUm9iMlFnUFQwOUlGd2libVY0ZEZ3aUtTQjdYRzRnSUNBZ0lDQWdJQzh2SUVSbGJHbGlaWEpoZEdWc2VTQm1iM0puWlhRZ2RHaGxJR3hoYzNRZ2MyVnVkQ0IyWVd4MVpTQnpieUIwYUdGMElIZGxJR1J2YmlkMFhHNGdJQ0FnSUNBZ0lDOHZJR0ZqWTJsa1pXNTBZV3hzZVNCd1lYTnpJR2wwSUc5dUlIUnZJSFJvWlNCa1pXeGxaMkYwWlM1Y2JpQWdJQ0FnSUNBZ2RHaHBjeTVoY21jZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSEpsZEhWeWJpQkRiMjUwYVc1MVpWTmxiblJwYm1Wc08xeHVJQ0FnSUgxY2JpQWdmVHRjYm4wcEtGeHVJQ0F2THlCSmJpQnpiRzl3Y0hrZ2JXOWtaU3dnZFc1aWIzVnVaQ0JnZEdocGMyQWdjbVZtWlhKeklIUnZJSFJvWlNCbmJHOWlZV3dnYjJKcVpXTjBMQ0JtWVd4c1ltRmpheUIwYjF4dUlDQXZMeUJHZFc1amRHbHZiaUJqYjI1emRISjFZM1J2Y2lCcFppQjNaU2R5WlNCcGJpQm5iRzlpWVd3Z2MzUnlhV04wSUcxdlpHVXVJRlJvWVhRZ2FYTWdjMkZrYkhrZ1lTQm1iM0p0WEc0Z0lDOHZJRzltSUdsdVpHbHlaV04wSUdWMllXd2dkMmhwWTJnZ2RtbHZiR0YwWlhNZ1EyOXVkR1Z1ZENCVFpXTjFjbWwwZVNCUWIyeHBZM2t1WEc0Z0lDaG1kVzVqZEdsdmJpZ3BJSHNnY21WMGRYSnVJSFJvYVhNZ2ZTa29LU0I4ZkNCR2RXNWpkR2x2YmloY0luSmxkSFZ5YmlCMGFHbHpYQ0lwS0NsY2JpazdYRzRpTENKbGVIQnZjblFnWkdWbVlYVnNkQ0I3WEc0Z0lHbDBPaUI3WEc0Z0lDQWdjWFZsY25rNklIdGNiaUFnSUNBZ0lHRmpkR2x2Ym5NNklIdGNiaUFnSUNBZ0lDQWdjMmh2ZDJWc1pYWmhkR2x2YmpvZ1hDSldhWE4xWVd4cGVucGhJR1ZzWlhaaGVtbHZibVZjSWl4Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5TEZ4dUlDQWdJR05vWVhKME9pQjdYRzRnSUNBZ0lDQjBhWFJzWlRvZ0owVnNaWFpoZW1sdmJtVW5MRnh1SUNBZ0lDQWdkRzl2YkhScGNEb2dlMXh1SUNBZ0lDQWdJQ0IwYVhSc1pUb2dKMFJwYzNSaGJucGhKMXh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJR3hoWW1Wc2N6b2dlMXh1SUNBZ0lDQWdJQ0I0T2lBblJHbHpkR0Z1ZW1FZ0tHMHBKeXhjYmlBZ0lDQWdJQ0FnZVRvblFXeDBaWHA2WVNBb2JTa25YRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5TEZ4dUlDQmxiam9nZTF4dUlDQWdJSEYxWlhKNU9pQjdYRzRnSUNBZ0lDQmhZM1JwYjI1ek9pQjdYRzRnSUNBZ0lDQWdJSE5vYjNkbGJHVjJZWFJwYjI0NklGd2lVMmh2ZHlCbGJHVjJZWFJwYjI1Y0lpeGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUxGeHVJQ0FnSUdOb1lYSjBPaUI3WEc0Z0lDQWdJQ0IwYVhSc1pUb2dYQ0pGYkdWMllYUnBiMjVjSWl4Y2JpQWdJQ0FnSUhSdmIyeDBhWEE2SUh0Y2JpQWdJQ0FnSUNBZ2RHbDBiR1U2SUZ3aVJHbHpkR0Z1WTJWY0lseHVJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lHeGhZbVZzY3pvZ2UxeHVJQ0FnSUNBZ0lDQjRPaUFuUkdsemRHRnVZMlVnS0cwcEp5eGNiaUFnSUNBZ0lDQWdlVG9uU0dWcFoyaDBJQ2h0S1NkY2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lIMWNibjFjYmlJc0ltbHRjRzl5ZENCcE1UaHVJR1p5YjIwZ0p5NHZhVEU0YmlkY2JtVjRjRzl5ZENCa1pXWmhkV3gwSUh0Y2JpQWdhVEU0Ymx4dWZWeHVJaXdpYVcxd2IzSjBJSEJzZFdkcGJrTnZibVpwWnlCbWNtOXRJQ2N1TDJOdmJtWnBaeWM3WEc1amIyNXpkQ0I3WW1GelpTd2dhVzVvWlhKcGRIMGdQU0JuTTNkelpHc3VZMjl5WlM1MWRHbHNjenRjYm1OdmJuTjBJRkJzZFdkcGJpQTlJR2N6ZDNOa2F5NWpiM0psTG5Cc2RXZHBiaTVRYkhWbmFXNDdYRzVqYjI1emRDQlRaWEoyYVdObElEMGdjbVZ4ZFdseVpTZ25MaTl3YkhWbmFXNXpaWEoyYVdObEp5azdYRzVqYjI1emRDQmhaR1JKTVRodVVHeDFaMmx1SUQwZ1p6TjNjMlJyTG1OdmNtVXVhVEU0Ymk1aFpHUkpNVGh1VUd4MVoybHVPMXh1WEc1amIyNXpkQ0JmVUd4MVoybHVJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJR0poYzJVb2RHaHBjeWs3WEc0Z0lIUm9hWE11Ym1GdFpTQTlJQ2RsYkdWd2NtOW1hV3hsSnp0Y2JpQWdkR2hwY3k1cGJtbDBJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnTHk4Z1lXUmtJR2t4T0c0Z2IyWWdkR2hsSUhCc2RXZHBibHh1SUNBZ0lHRmtaRWt4T0c1UWJIVm5hVzRvZTF4dUlDQWdJQ0FnYm1GdFpUb2dkR2hwY3k1dVlXMWxMRnh1SUNBZ0lDQWdZMjl1Wm1sbk9pQndiSFZuYVc1RGIyNW1hV2N1YVRFNGJseHVJQ0FnSUgwcE8xeHVJQ0FnSUM4dklITmxkQ0JqWVhSaGJHOW5JR2x1YVhScFlXd2dkR0ZpWEc0Z0lDQWdkR2hwY3k1amIyNW1hV2NnUFNCMGFHbHpMbWRsZEVOdmJtWnBaeWdwTzF4dUlDQWdJSFJvYVhNdWMyVjBVMlZ5ZG1salpTaFRaWEoyYVdObEtUdGNiaUFnSUNCMGFHbHpMbk5sY25acFkyVXVhVzVwZENoMGFHbHpMbU52Ym1acFp5azdYRzRnSUNBZ2RHaHBjeTV5WldkcGMzUmxjbEJzZFdkcGJpaDBhR2x6TG1OdmJtWnBaeTVuYVdRcE8xeHVJQ0FnSUM4dklHTnlaV0YwWlNCQlVFbGNiaUFnSUNCMGFHbHpMbk5sZEZKbFlXUjVLSFJ5ZFdVcE8xeHVJQ0I5TzF4dUlDQXZMMk5oYkd4bFpDQjNhR1Z1SUhCc2RXZHBiaUJwY3lCeVpXMXZkbVZrWEc0Z0lIUm9hWE11ZFc1c2IyRmtJRDBnWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnZEdocGN5NXpaWEoyYVdObExtTnNaV0Z5S0NrN1hHNGdJSDA3WEc1OU8xeHVYRzVwYm1obGNtbDBLRjlRYkhWbmFXNHNJRkJzZFdkcGJpazdYRzVjYmlobWRXNWpkR2x2Ymlod2JIVm5hVzRwZTF4dUlDQndiSFZuYVc0dWFXNXBkQ2dwTzF4dWZTa29ibVYzSUY5UWJIVm5hVzRwTzF4dVhHNWNibHh1SWl3aVkyOXVjM1FnYVc1b1pYSnBkQ0E5SUdjemQzTmtheTVqYjNKbExuVjBhV3h6TG1sdWFHVnlhWFE3WEc1amIyNXpkQ0JpWVhObElEMGdaek4zYzJSckxtTnZjbVV1ZFhScGJITXVZbUZ6WlR0Y2JtTnZibk4wSUZoSVVpQTlJR2N6ZDNOa2F5NWpiM0psTG5WMGFXeHpMbGhJVWp0Y2JtTnZibk4wSUZCc2RXZHBibE5sY25acFkyVWdQU0JuTTNkelpHc3VZMjl5WlM1d2JIVm5hVzR1VUd4MVoybHVVMlZ5ZG1salpUdGNibU52Ym5OMElIUWdQU0JuTTNkelpHc3VZMjl5WlM1cE1UaHVMblJRYkhWbmFXNDdYRzVqYjI1emRDQkhWVWtnUFNCbk0zZHpaR3N1WjNWcExrZFZTVHRjYm1OdmJuTjBJRU5vWVhKMGMwWmhZM1J2Y25rZ1BTQm5NM2R6WkdzdVozVnBMbloxWlM1RGFHRnlkSE11UTJoaGNuUnpSbUZqZEc5eWVUdGNibHh1Wm5WdVkzUnBiMjRnUld4bGRtRjBhVzl1VUhKdlptbHNaVk5sY25acFkyVW9LU0I3WEc0Z0lHSmhjMlVvZEdocGN5azdYRzRnSUhSb2FYTXVhVzVwZENBOUlHWjFibU4wYVc5dUtHTnZibVpwWnoxN2ZTa2dlMXh1SUNBZ0lIUm9hWE11WTJoaGNuUkRiMnh2Y2lBOUlFZFZTUzV6YTJsdVEyOXNiM0k3WEc0Z0lDQWdkR2hwY3k1amIyNW1hV2NnUFNCamIyNW1hV2M3WEc0Z0lDQWdMeThnWVdSa0lIWjFaU0J3Y205d1pYSjBlU0IwYnlCcGJpQmhaR1FnWld4bGRtVnVkR2x2YmlCamFHRnlkQ0JsYkdWdFpXNTBYRzRnSUNBZ2RHaHBjeTVqYjI1bWFXY3ViR0Y1WlhKeklDWW1JSFJvYVhNdVkyOXVabWxuTG14aGVXVnljeTVtYjNKRllXTm9LR3hoZVdWeVQySnFJRDArSUd4aGVXVnlUMkpxTGw5MmRXVWdQU0I3ZlNrN1hHNGdJQ0FnZEdocGN5NWZiV0Z3VTJWeWRtbGpaU0E5SUVkVlNTNW5aWFJEYjIxd2IyNWxiblFvSjIxaGNDY3BMbWRsZEZObGNuWnBZMlVvS1R0Y2JpQWdJQ0IwYUdsekxtdGxlVk5sZEhSbGNuTWdQU0I3ZlR0Y2JpQWdJQ0JqYjI1emRDQnhkV1Z5ZVhKbGMzVnNkSE5EYjIxd2IyNWxiblFnUFNCSFZVa3VaMlYwUTI5dGNHOXVaVzUwS0NkeGRXVnllWEpsYzNWc2RITW5LVHRjYmlBZ0lDQjBhR2x6TG5GMVpYSjVjbVZ6ZFd4MGMxTmxjblpwWTJVZ1BTQnhkV1Z5ZVhKbGMzVnNkSE5EYjIxd2IyNWxiblF1WjJWMFUyVnlkbWxqWlNncE8xeHVJQ0FnSUhSb2FYTXVhMlY1VTJWMGRHVnljeTV2Y0dWdVEyeHZjMlZHWldGMGRYSmxVbVZ6ZFd4MElEMGdkR2hwY3k1eGRXVnllWEpsYzNWc2RITlRaWEoyYVdObExtOXVZV1owWlhJb0oyOXdaVzVEYkc5elpVWmxZWFIxY21WU1pYTjFiSFFuTENBb2UyOXdaVzRzSUd4aGVXVnlMQ0JtWldGMGRYSmxMQ0JqYjI1MFlXbHVaWEo5S1QwK2UxeHVJQ0FnSUNBZ1kyOXVjM1FnYkdGNVpYSlBZbW9nUFNCMGFHbHpMbU52Ym1acFp5NXNZWGxsY25NdVptbHVaQ2hzWVhsbGNrOWlhaUE5UGlCN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUh0c1lYbGxjbDlwWkRvZ2JHRjVaWEpKWkgwZ1BTQnNZWGxsY2s5aWFqdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHeGhlV1Z5TG1sa0lEMDlQU0JzWVhsbGNrbGtPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdJQ0JzWVhsbGNrOWlhaUFtSmlCMGFHbHpMbk5vYjNkSWFXUmxRMmhoY25SRGIyMXdiMjVsYm5Rb2UxeHVJQ0FnSUNBZ0lDQnZjR1Z1TEZ4dUlDQWdJQ0FnSUNCamIyNTBZV2x1WlhJc1hHNGdJQ0FnSUNBZ0lHeGhlV1Z5VDJKcUxGeHVJQ0FnSUNBZ0lDQm1hV1E2SUdabFlYUjFjbVV1WVhSMGNtbGlkWFJsYzFzblp6TjNYMlpwWkNkZFhHNGdJQ0FnSUNCOUtWeHVJQ0FnSUgwcFhHNGdJSDA3WEc1Y2JpQWdkR2hwY3k1blpYUkRiMjVtYVdjZ1BTQm1kVzVqZEdsdmJpZ3BlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbU52Ym1acFp6dGNiaUFnZlR0Y2JseHVJQ0IwYUdsekxtZGxkRlZ5YkhNZ1BTQm1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVqYjI1bWFXY3VkWEpzY3p0Y2JpQWdmVHRjYmx4dUlDQjBhR2x6TG1OeVpXRjBaVXh2WVdScGJtZERiMjF3YjI1bGJuUkViMjFGYkdWdFpXNTBJRDBnWm5WdVkzUnBiMjRvS1h0Y2JpQWdJQ0JqYjI1emRDQnNiMkZrYVc1blEyOXRjRzl1Wlc1MElEMGdWblZsTG1WNGRHVnVaQ2g3WEc0Z0lDQWdJQ0IwWlcxd2JHRjBaVG9nWUR4aVlYSXRiRzloWkdWeUlEcHNiMkZrYVc1blBWd2lkSEoxWlZ3aVBqd3ZZbUZ5TFd4dllXUmxjajVnWEc0Z0lDQWdmU2s3WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJzYjJGa2FXNW5RMjl0Y0c5dVpXNTBLQ2t1SkcxdmRXNTBLQ2t1SkdWc08xeHVJQ0I5TzF4dVhHNGdJSFJvYVhNdWMyaHZkMGhwWkdWRGFHRnlkRU52YlhCdmJtVnVkQ0E5SUdGemVXNWpJR1oxYm1OMGFXOXVLSHR2Y0dWdUxDQnNZWGxsY2s5aWFpd2dZMjl1ZEdGcGJtVnlMQ0JtYVdSOVBYdDlLU0I3WEc0Z0lDQWdhV1lnS0c5d1pXNHBJSHRjYmlBZ0lDQWdJR052Ym5OMElIdGhjR2tzSUd4aGVXVnlYMmxrT2lCc1lYbGxja2xrZlNBOUlHeGhlV1Z5VDJKcU8xeHVJQ0FnSUNBZ1kyOXVjM1FnWW1GeVRHOWhaR2x1WjBSdmJTQTlJSFJvYVhNdVkzSmxZWFJsVEc5aFpHbHVaME52YlhCdmJtVnVkRVJ2YlVWc1pXMWxiblFvS1R0Y2JpQWdJQ0FnSUhSeWVTQjdYRzRnSUNBZ0lDQWdJR052Ym5SaGFXNWxjaTVoY0hCbGJtUW9ZbUZ5VEc5aFpHbHVaMFJ2YlNrN1hHNGdJQ0FnSUNBZ0lHTnZibk4wSUh0amIyMXdiMjVsYm5Rc0lHVnljbTl5ZlNBOUlHRjNZV2wwSUhSb2FYTXVaMlYwUTJoaGNuUkRiMjF3YjI1bGJuUW9lMkZ3YVN3Z2JHRjVaWEpKWkN3Z1ptbGtmU2s3WEc0Z0lDQWdJQ0FnSUdsbUlDaGxjbkp2Y2lrZ2NtVjBkWEp1TzF4dUlDQWdJQ0FnSUNCamIyNXpkQ0IyZFdWRGIyMXdiMjVsYm5SUFltcGxZM1FnUFNCV2RXVXVaWGgwWlc1a0tHTnZiWEJ2Ym1WdWRDazdYRzRnSUNBZ0lDQWdJR3hoZVdWeVQySnFMbDkyZFdWYlptbGtYU0E5SUc1bGR5QjJkV1ZEYjIxd2IyNWxiblJQWW1wbFkzUW9LVHRjYmlBZ0lDQWdJQ0FnYkdGNVpYSlBZbW91WDNaMVpWdG1hV1JkTGlSdmJtTmxLQ2RvYjI5ck9tMXZkVzUwWldRbkxDQmhjM2x1WXlCbWRXNWpkR2x2YmlncGUxeHVJQ0FnSUNBZ0lDQWdJR052Ym5SaGFXNWxjaTVoY0hCbGJtUW9kR2hwY3k0a1pXd3BPMXh1SUNBZ0lDQWdJQ0FnSUVkVlNTNWxiV2wwS0NkeVpYTnBlbVVuS1R0Y2JpQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJR3hoZVdWeVQySnFMbDkyZFdWYlptbGtYUzRrYlc5MWJuUW9LVHRjYmlBZ0lDQWdJSDBnWTJGMFkyZ2dLR1Z5Y205eUtYdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHVnljbTl5TzF4dUlDQWdJQ0FnZlNCbWFXNWhiR3g1SUh0Y2JpQWdJQ0FnSUNBZ1ltRnlURzloWkdsdVowUnZiUzV5WlcxdmRtVW9LVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2FXWWdLR3hoZVdWeVQySnFMbDkyZFdWYlptbGtYU2tnZTF4dUlDQWdJQ0FnSUNCc1lYbGxjazlpYWk1ZmRuVmxXMlpwWkYwdUpHUmxjM1J5YjNrb0tUdGNiaUFnSUNBZ0lDQWdiR0Y1WlhKUFltb3VYM1oxWlZ0bWFXUmRMaVJsYkM1eVpXMXZkbVVvS1R0Y2JpQWdJQ0FnSUNBZ2JHRjVaWEpQWW1vdVgzWjFaVnRtYVdSZElEMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlR0Y2JseHVJQ0IwYUdsekxtZGxkRU5vWVhKMFEyOXRjRzl1Wlc1MElEMGdZWE41Ym1NZ1puVnVZM1JwYjI0b2UyRndhU3dnYkdGNVpYSkpaQ3dnWm1sa2ZUMTdmU2tnZTF4dUlDQWdJSFJ5ZVNCN1hHNGdJQ0FnSUNCamIyNXpkQ0J5WlhOd2IyNXpaU0E5SUdGM1lXbDBJSFJvYVhNdVoyVjBSV3hsZG1GMGFXOXVSR0YwWVNoN1lYQnBMQ0JzWVhsbGNrbGtMQ0JtYVdSOUtUdGNiaUFnSUNBZ0lHTnZibk4wSUdSaGRHRWdQU0J5WlhOd2IyNXpaUzV5WlhOMWJIUWdKaVlnY21WemNHOXVjMlV1Y0hKdlptbHNaVHRjYmlBZ0lDQWdJR2xtSUNoa1lYUmhLU0I3WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJR2R5WVhCb1JHRjBZU0E5SUh0Y2JpQWdJQ0FnSUNBZ0lDQjRPaUJiSjNnblhTeGNiaUFnSUNBZ0lDQWdJQ0I1T2lCYkoza25YU3hjYmlBZ0lDQWdJQ0FnSUNCdGFXNVlPaUFnT1RrNU9UazVPU3hjYmlBZ0lDQWdJQ0FnSUNCdFlYaFlPaUF0T1RrNU9UazVPU3hjYmlBZ0lDQWdJQ0FnSUNCdGFXNVpPaUFnT1RrNU9UazVPU3hjYmlBZ0lDQWdJQ0FnSUNCdFlYaFpPaUF0T1RrNU9UazVPVnh1SUNBZ0lDQWdJQ0I5TzF4dUlDQWdJQ0FnSUNCbWIzSWdLR3hsZENCcFBUQTdJR2tnUENCa1lYUmhMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBZ0lDQWdZMjl1YzNRZ1gyUmhkR0VnUFNCa1lYUmhXMmxkTzF4dUlDQWdJQ0FnSUNBZ0lHTnZibk4wSUhnZ1BTQmZaR0YwWVZzelhUdGNiaUFnSUNBZ0lDQWdJQ0JqYjI1emRDQjVJRDBnWDJSaGRHRmJNbDA3WEc0Z0lDQWdJQ0FnSUNBZ1ozSmhjR2hFWVhSaExtMXBibGdnUFNCNElEd2daM0poY0doRVlYUmhMbTFwYmxnZ1B5QjRJRG9nWjNKaGNHaEVZWFJoTG0xcGJsZzdYRzRnSUNBZ0lDQWdJQ0FnWjNKaGNHaEVZWFJoTG0xcGJsa2dQU0I1SUR3Z1ozSmhjR2hFWVhSaExtMXBibGtnUHlCNUlEb2daM0poY0doRVlYUmhMbTFwYmxrN1hHNGdJQ0FnSUNBZ0lDQWdaM0poY0doRVlYUmhMbTFoZUZnZ1BTQjRJRDRnWjNKaGNHaEVZWFJoTG0xaGVGZ2dQeUI0SURvZ1ozSmhjR2hFWVhSaExtMWhlRmc3WEc0Z0lDQWdJQ0FnSUNBZ1ozSmhjR2hFWVhSaExtMWhlRmtnUFNCNUlENGdaM0poY0doRVlYUmhMbTFoZUZrZ1B5QjVJRG9nWjNKaGNHaEVZWFJoTG0xaGVGazdYRzRnSUNBZ0lDQWdJQ0FnWjNKaGNHaEVZWFJoTG5ndWNIVnphQ2g0S1R0Y2JpQWdJQ0FnSUNBZ0lDQm5jbUZ3YUVSaGRHRXVlUzV3ZFhOb0tIa3BPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUdOdmJuTjBJSE5sYkdZZ1BTQjBhR2x6TzF4dUlDQWdJQ0FnSUNCamIyNXpkQ0J0WVhBZ1BTQjBhR2x6TGw5dFlYQlRaWEoyYVdObExtZGxkRTFoY0NncE8xeHVJQ0FnSUNBZ0lDQnNaWFFnYUdsa1pVaHBaMmgwYkdsbmFIUkdibU1nUFNBb0tTQTlQaUI3ZlR0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUh0Y2JpQWdJQ0FnSUNBZ0lDQmtZWFJoTEZ4dUlDQWdJQ0FnSUNBZ0lHbGtPaUIwS0NkbGJHVndjbTltYVd4bExtTm9ZWEowTG5ScGRHeGxKeWtzWEc0Z0lDQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1ME9pQkRhR0Z5ZEhOR1lXTjBiM0o1TG1KMWFXeGtLSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIUjVjR1U2SUNkak16cHNhVzVsV0ZrbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnYUc5dmEzTTZJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdZM0psWVhSbFpDZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwYUdsekxuTmxkRU52Ym1acFp5aDdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J2Ym0xdmRYTmxiM1YwS0NrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JvYVdSbFNHbG5hSFJzYVdkb2RFWnVZeWdwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2wwYkdVNklIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEdWNGREb2dkQ2duWld4bGNISnZabWxzWlM1amFHRnlkQzUwYVhSc1pTY3BMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2IzTnBkR2x2YmpvZ0ozUnZjQzFqWlc1MFpYSW5MRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIQmhaR1JwYm1jNklIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZEc5d09pQTBNQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1ltOTBkRzl0T2lBek1DeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21sbmFIUTZJRE13WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlbTl2YlRvZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JsYm1GaWJHVmtPaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhOallXeGxPaUIwY25WbExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdSaGRHRTZJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MyVnNaV04wYVc5dU9pQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pXNWhZbXhsWkRvZ1ptRnNjMlVzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaSEpoWjJkaFlteGxPaUIwY25WbFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIZzZJQ2Q0Snl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlVG9nSjNrbkxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IwZVhCbGN6b2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIazZJQ2RoY21WaEoxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiMnh2Y25NNklIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCNE9pQnpaV3htTG1Ob1lYSjBRMjlzYjNJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZVRvZ2MyVnNaaTVqYUdGeWRFTnZiRzl5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmJIVnRibk02SUZ0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JuY21Gd2FFUmhkR0V1ZUN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JuY21Gd2FFUmhkR0V1ZVZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmRMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdmJtMXZkWE5sYjNWMEtHVjJkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2hwWkdWSWFXZG9kR3hwWjJoMFJtNWpLQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUc5dVkyeHBZMnNvZTJsdVpHVjRmU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR052Ym5OMElGdDRMQ0I1WFNBOUlHUmhkR0ZiYVc1a1pYaGRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMWhjQzVuWlhSV2FXVjNLQ2t1YzJWMFEyVnVkR1Z5S0Z0NExIbGRLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCc1pXZGxibVE2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMmh2ZHpvZ1ptRnNjMlZjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBiMjlzZEdsd09udGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWm05eWJXRjBPaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2wwYkdVb1pDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHQWtlM1FvSjJWc1pYQnliMlpwYkdVdVkyaGhjblF1ZEc5dmJIUnBjQzUwYVhSc1pTY3BmVG9nSkh0a1lYUmhXMlJkV3pOZGZXQmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiMjUwWlc1MGN6b2dablZ1WTNScGIyNGdLRjlrWVhSaExDQmpiMnh2Y2lrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmJuTjBJR2x1WkdWNElEMGdYMlJoZEdGYk1GMHVhVzVrWlhnN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdXM2dzSUhrc0lIWmhiSFZsWFNBOUlHUmhkR0ZiYVc1a1pYaGRPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUhCdmFXNTBYMmRsYjIwZ1BTQnVaWGNnYjJ3dVoyVnZiUzVRYjJsdWRDaGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGdDRMQ0I1WFZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjMlZzWmk1ZmJXRndVMlZ5ZG1salpTNW9hV2RvYkdsbmFIUkhaVzl0WlhSeWVTaHdiMmx1ZEY5blpXOXRMQ0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I2YjI5dE9pQm1ZV3h6WlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdocFpHVTZJR1oxYm1OMGFXOXVLR05oYkd4aVlXTnJLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdocFpHVklhV2RvZEd4cFoyaDBSbTVqSUQwZ1kyRnNiR0poWTJzN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2MzUjViR1U2SUc1bGR5QnZiQzV6ZEhsc1pTNVRkSGxzWlNoN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHRZV2RsT2lCdVpYY2diMnd1YzNSNWJHVXVVbVZuZFd4aGNsTm9ZWEJsS0h0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQm1hV3hzT2lCdVpYY2diMnd1YzNSNWJHVXVSbWxzYkNoN1kyOXNiM0k2SUNkM2FHbDBaU2NnZlNrc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjM1J5YjJ0bE9pQnVaWGNnYjJ3dWMzUjViR1V1VTNSeWIydGxLSHRqYjJ4dmNqb2djMlZzWmk1amFHRnlkRU52Ykc5eUxDQjNhV1IwYURvZ00zMHBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhCdmFXNTBjem9nTXl4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnlZV1JwZFhNNklERXlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdGdVoyeGxPaUF3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhKbGRIVnliaUJnUEdScGRpQnpkSGxzWlQxY0ltWnZiblF0ZDJWcFoyaDBPaUJpYjJ4a095QmliM0prWlhJNk1uQjRJSE52Ykdsa095QmlZV05yWjNKdmRXNWtMV052Ykc5eU9pQWpabVptWm1abU95QndZV1JrYVc1bk9pQXpjSGc3WW05eVpHVnlMWEpoWkdsMWN6b2dNM0I0TzF3aUlGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmpiR0Z6Y3oxY0luTnJhVzR0WW05eVpHVnlMV052Ykc5eUlITnJhVzR0WTI5c2IzSmNJajRrZTNaaGJIVmxMblJ2Um1sNFpXUW9NaWw5S0cwcFBDOWthWFkrWUZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1lYaHBjem9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjRPaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiV0Y0T2lCbmNtRndhRVJoZEdFdWJXRjRXQ0FySURJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYldsdU9pQm5jbUZ3YUVSaGRHRXViV2x1V0NBdElESXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JHRmlaV3c2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSbGVIUTZJSFFvSjJWc1pYQnliMlpwYkdVdVkyaGhjblF1YkdGaVpXeHpMbmduS1N4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhCdmMybDBhVzl1T2lBbmIzVjBaWEl0WTJWdWRHVnlKMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHbGphem9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWm1sME9pQm1ZV3h6WlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOdmRXNTBPaUEwTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWm05eWJXRjBPaUJtZFc1amRHbHZiaUFvZG1Gc2RXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJSFpoYkhWbExuUnZSbWw0WldRb01pazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjVPaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiV0Y0T2lCbmNtRndhRVJoZEdFdWJXRjRXU0FySURVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYldsdU9pQm5jbUZ3YUVSaGRHRXViV2x1V1NBdElEVXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2JHRmlaV3c2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSbGVIUTZJSFFvSjJWc1pYQnliMlpwYkdVdVkyaGhjblF1YkdGaVpXeHpMbmtuS1N4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhCdmMybDBhVzl1T2lBbmIzVjBaWEl0Yldsa1pHeGxKMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMHNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RHbGphem9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWTI5MWJuUTZJRFVzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtYjNKdFlYUTZJR1oxYm1OMGFXOXVJQ2gyWVd4MVpTa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNGdkbUZzZFdVdWRHOUdhWGhsWkNneUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMHBYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlJR05oZEdOb0lDaGxjbklwSUh0Y2JpQWdJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0FnSUdWeWNtOXlPaUIwY25WbFhHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlPMXh1WEc0Z0lIUm9hWE11WjJWMFJXeGxkbUYwYVc5dVJHRjBZU0E5SUdGemVXNWpJR1oxYm1OMGFXOXVLSHRoY0drc0lHeGhlV1Z5U1dRc0lHWnBaSDA5ZTMwcElIdGNiaUFnSUNCamIyNXpkQ0IxY213Z1BTQmdKSHRoY0dsOUpIdHNZWGxsY2tsa2ZTOGtlMlpwWkgxZ08xeHVJQ0FnSUdOdmJuTjBJR1JoZEdFZ1BTQjdYRzRnSUNBZ0lDQnlaWE4xYkhRNklHWmhiSE5sWEc0Z0lDQWdmVHRjYmlBZ0lDQjBjbmtnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjbVZ6Y0c5dWMyVWdQU0JoZDJGcGRDQllTRkl1WjJWMEtIdGNiaUFnSUNBZ0lDQWdkWEpzWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0FnSUdSaGRHRXVjSEp2Wm1sc1pTQTlJSEpsYzNCdmJuTmxMbkJ5YjJacGJHVTdYRzRnSUNBZ0lDQmtZWFJoTG5KbGMzVnNkQ0E5SUhSeWRXVTdYRzRnSUNBZ2ZTQmpZWFJqYUNobGNuSnZjaWw3ZlZ4dUlDQWdJSEpsZEhWeWJpQmtZWFJoTzF4dUlDQjlPMXh1WEc0Z0lIUm9hWE11WTJ4bFlYSWdQU0JtZFc1amRHbHZiaWdwSUh0Y2JpQWdJQ0IwYUdsekxuRjFaWEo1Y21WemRXeDBjMU5sY25acFkyVXVkVzRvSjI5d1pXNURiRzl6WlVabFlYUjFjbVZTWlhOMWJIUW5MQ0IwYUdsekxtdGxlVk5sZEhSbGNuTXViM0JsYmtOc2IzTmxSbVZoZEhWeVpWSmxjM1ZzZENrN1hHNGdJSDFjYm4xY2JseHVhVzVvWlhKcGRDaEZiR1YyWVhScGIyNVFjbTltYVd4bFUyVnlkbWxqWlN3Z1VHeDFaMmx1VTJWeWRtbGpaU2s3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2JtVjNJRVZzWlhaaGRHbHZibEJ5YjJacGJHVlRaWEoyYVdObE8xeHVJbDE5In0=
