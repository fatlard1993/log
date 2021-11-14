#!/usr/bin/env node

const { Log } = require('../log.js');

const colorLogger = new Log({ color: true, verbosity: 1 });

colorLogger.info('info');
colorLogger.warn('warn');
colorLogger.error('error');
