#!/usr/bin/env node

const { Log } = require('../log.js');

const log = new Log({ verbosity: 1 });

log('V0 visible');
log(1)('V1 invisible');

log('Change verbosity');
log.opts.verbosity = 2;

log(1)('V1 visible');
log(2)('V2 invisible');
