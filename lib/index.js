'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === 'function' &&
  typeof Symbol.iterator === 'symbol'
  ? function(obj) {
      return typeof obj;
    }
  : function(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

var LEVELS = ['trace', 'debug', 'info', 'warn', 'error'];

var LOG_LEVELS = (exports.LOG_LEVELS = Object.freeze(
  LEVELS.reduce(
    function(acc, lvl) {
      acc[lvl.toUpperCase()] = lvl;
      return acc;
    },
    {}
  )
));

var instance = void 0;
var privateProps = new WeakMap();

var Logger = (exports.Logger = (function() {
  function Logger() {
    var consoleObj = arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : window.console;

    _classCallCheck(this, Logger);

    var listeners = {};
    var level = LOG_LEVELS.TRACE;

    privateProps.set(this, {
      listeners: listeners,
      level: level,
      consoleObj: consoleObj
    });
  }

  Logger.getInstance = function getInstance() {
    if (!instance) {
      instance = new Logger();
    }

    return instance;
  };

  Logger.log = function log(level, args) {
    var instancePrivateProps = privateProps.get(this);
    var loggerLevel = instancePrivateProps.level;
    var consoleObj = instancePrivateProps.consoleObj;

    var isDisabled = loggerLevel === null;
    var isSilenced = LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);

    if (isDisabled || isSilenced) {
      return null;
    }

    var stringArgs = [];

    args.forEach(function(arg, i) {
      if (isPlainObject(arg)) {
        try {
          stringArgs[i] = JSON.stringify(arg);
        } catch (error) {
          stringArgs[i] = arg;
        }
      } else if (arg instanceof Error) {
        stringArgs[i] = JSON.stringify(
          arg.toJSON
            ? arg
            : {
                event: 'error',
                message: arg.message,
                name: arg.name,
                stack: arg.stack
              }
        );
      } else {
        stringArgs[i] = arg;
      }
    });

    var fn = consoleObj[level] || consoleObj.log;
    fn.apply(consoleObj, stringArgs);

    var listeners = instancePrivateProps.listeners[level];

    if (listeners && listeners.length > 0) {
      listeners.forEach(function(listener) {
        return listener.apply(null, args);
      });
    }
  };

  Logger.prototype.on = function on(key, fn) {
    var _this = this;

    var _privateProps$get = privateProps.get(this),
      listeners = _privateProps$get.listeners;

    var listener = listeners[key] || (listeners[key] = []);
    listener.push(fn);

    return function() {
      _this.off(key, fn);
    };
  };

  Logger.prototype.off = function off(key, fn) {
    var _privateProps$get2 = privateProps.get(this),
      listeners = _privateProps$get2.listeners;

    if (!listeners[key]) {
      return;
    }

    if (!fn) {
      listeners[key] = [];
    }

    listeners[key] = listeners[key].filter(function(listener) {
      return listener !== fn;
    });
  };

  _createClass(Logger, [
    {
      key: 'level',
      get: function get() {
        return privateProps.get(this).level;
      },
      set: function set(newLevel) {
        privateProps.get(this).level = newLevel;
      }
    }
  ]);

  return Logger;
})());

LEVELS.forEach(function(level) {
  var _Object$assign;

  Object.assign(
    Logger.prototype,
    ((_Object$assign = {}), (_Object$assign[level] = function() {
      for (
        var _len = arguments.length, args = Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }

      Logger.log.call(this, level, args);
      return this;
    }), _Object$assign)
  );
});

function isPlainObject(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) ===
    'object' &&
    obj !== null &&
    (obj.constructor === Object || Object.getPrototypeOf(obj) === null);
}

exports.default = Logger.getInstance();
