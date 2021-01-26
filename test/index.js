#!/usr/bin/env node

const Log = require('../src/index.js');

const defaultLogger = new Log({ defaults: { verbosity: 1 } });
const coloredLogger = new Log({ tag: 'colorLog', color: true, colorMap: { colorLog: '\x1b[36m' } })
const logger1 = new Log({ tag: 'logger1', verbosity: 2 });
const defaultColorLogger = new Log({ defaults: { color: true } });
const logger2 = new Log({ tag: 'logger2', verbosity: 3 });
const hiddenLogger = new Log({ tag: 'hiddenLogger', verbosity: 0 });

defaultLogger(defaultLogger.opts.verbosity, 'V0 visible');
defaultLogger(1)('V1 invisible');

coloredLogger.info('V0 visible info');
coloredLogger.warn()('V0 visible warn');
coloredLogger.error('V0 visible error');
coloredLogger('V0 visible customTagColor');
coloredLogger(1)('V1 invisible');

logger1(logger1.opts.verbosity, 'V0 visible');
logger1(1)('V1 visible');
logger1(2)('V2 invisible');

defaultColorLogger.info('V0 visible info');
defaultColorLogger.warn('V0 visible warn');
defaultColorLogger.error('V0 visible error');

logger2.info(logger2.opts.verbosity, 'V0 visible info');
logger2(1)('V1 visible');
logger2(2)('V2 visible');
logger2(3)('V3 invisible');

hiddenLogger('V0 invisible');