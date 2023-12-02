import Log, { methodMap } from '../src/log.js';

const colorLogger = new Log({ color: true, verbosity: 1, colorMap: { whoops: '\x1b[31m' } });

methodMap.why = 'info';

colorLogger.info('info');
colorLogger.warn('warn');
colorLogger.error('error');
colorLogger.why('why?');
colorLogger.whoops('whoops');
