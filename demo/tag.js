import Log from '../src/log.js';

const log = new Log({ tag: 'customTag', verbosity: 1, color: true, colorMap: { customTag: '\x1b[31m' } });

log('<--- Look a custom tag!');

log.setTag('newCustomTag');

log('<--- Look now its got a new custom tag!');
