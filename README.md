[![Build Status](https://img.shields.io/travis/fmal/mini-console-logger/master.svg?style=flat-square)](http://travis-ci.org/fmal/mini-console-logger)
[![npm](https://img.shields.io/npm/v/mini-console-logger.svg?style=flat-square)](https://www.npmjs.com/package/mini-console-logger) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Styled with Prettier](https://img.shields.io/badge/styled%20with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![module formats: umd, cjs, and es](https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square)](https://unpkg.com/mini-console-logger/dist/)
[![size](http://img.badgesize.io/https://unpkg.com/mini-console-logger/dist/mini-console-logger.umd.min.js?label=size&style=flat-square)](https://unpkg.com/mini-console-logger/dist/)

# mini-console-logger

Simple logging utility.

```
npm install mini-console-logger --save
```

## Usage

```js
import logger, { LOG_LEVELS } from 'mini-console-logger';

logger.trace('trace');
logger.debug('debug');
logger.info('info');
logger.warn('warn');
logger.error('error');

// objects and Errors are stringified automatically
logger.debug({
  prop1: 'foo',
  prop2: 'bar'
});
logger.error(new Error('foo'));

logger.level = null; // silence logger
logger.level = LOG_LEVELS.WARN; // log only warn and above

logger.on(LOG_LEVELS.ERROR, err => {
  // so something with the error
});
logger.off(LOG_LEVELS.ERROR); // unbind error listener
```

[Live demo](http://jsbin.com/cawiwep/edit?js,console)