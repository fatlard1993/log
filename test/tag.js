#!/usr/bin/env node

const { Log } = require('../log.js');

const log = new Log({ tag: 'customTag', verbosity: 1 });

log('<--- Look a custom tag!');
