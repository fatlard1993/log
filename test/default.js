#!/usr/bin/env node

const { Log } = require('../log.js');

const parentLog = new Log({ tag: 'parent', defaults: { verbosity: 1 } });
const childLog = new Log({ tag: 'child' });

parentLog('V0 visible');
parentLog(1)('V1 NOT visible');

childLog('V0 visible');
childLog(1)('V1 NOT visible');

parentLog('Change parent verbosity');
parentLog.opts.verbosity = 2;

parentLog(1)('V1 visible');
childLog(1)('V1 NOT visible');
