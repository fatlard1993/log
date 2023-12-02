import Log from '../src/log.js';

const parentLog = new Log({ tag: 'parent', defaults: { verbosity: 1 } });
const childLog = new Log({ tag: 'child' });
const customLog = new Log({ tag: 'newCustomTag' });

customLog('<--- Look re-using our custom tagged logger from another file!');

parentLog('V0 visible');
parentLog.wow('!!V0 visible!!');
parentLog(1)('V1 NOT visible');

childLog('V0 visible');
childLog(1)('V1 NOT visible');

parentLog('Change parent verbosity');
parentLog.options.verbosity = 2;

parentLog(1)('V1 visible');
childLog(1)('V1 NOT visible');
