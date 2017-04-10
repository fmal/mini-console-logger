const LEVELS = ['trace', 'debug', 'info', 'warn', 'error'];

export const LOG_LEVELS = Object.freeze(
  LEVELS.reduce(
    (acc, lvl) => {
      acc[lvl.toUpperCase()] = lvl;
      return acc;
    },
    {}
  )
);

let instance;
const privateProps = new WeakMap();

export class Logger {
  constructor(consoleObj = window.console) {
    const listeners = {};
    const level = LOG_LEVELS.TRACE;

    privateProps.set(this, {
      listeners,
      level,
      consoleObj
    });
  }

  static getInstance() {
    if (!instance) {
      instance = new Logger();
    }

    return instance;
  }

  static log(level, args) {
    const instancePrivateProps = privateProps.get(this);
    const loggerLevel = instancePrivateProps.level;
    const consoleObj = instancePrivateProps.consoleObj;

    const isDisabled = loggerLevel === null;
    const isSilenced = LEVELS.indexOf(level) < LEVELS.indexOf(loggerLevel);

    if (isDisabled || isSilenced) {
      return null;
    }

    const stringArgs = [];

    args.forEach((arg, i) => {
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

    const fn = consoleObj[level] || consoleObj.log;
    fn.apply(consoleObj, stringArgs);

    const listeners = instancePrivateProps.listeners[level];

    if (listeners && listeners.length > 0) {
      listeners.forEach(listener => listener.apply(null, args));
    }
  }

  get level() {
    return privateProps.get(this).level;
  }

  set level(newLevel) {
    privateProps.get(this).level = newLevel;
  }

  on(key, fn) {
    const { listeners } = privateProps.get(this);
    const listener = listeners[key] || (listeners[key] = []);
    listener.push(fn);

    return () => {
      this.off(key, fn);
    };
  }

  off(key, fn) {
    const { listeners } = privateProps.get(this);

    if (!listeners[key]) {
      return;
    }

    if (!fn) {
      listeners[key] = [];
    }

    listeners[key] = listeners[key].filter(listener => listener !== fn);
  }
}

LEVELS.forEach(level => {
  Object.assign(Logger.prototype, {
    [level](...args) {
      Logger.log.call(this, level, args);
      return this;
    }
  });
});

function isPlainObject(obj) {
  return typeof obj === 'object' &&
    obj !== null &&
    (obj.constructor === Object || Object.getPrototypeOf(obj) === null);
}

export default Logger.getInstance();
