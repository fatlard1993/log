"use-strict";

class Log {
	constructor(opts = {}){
		const tag = opts.tag = opts.tag || '_default_';

		if(typeof opts.defaultVerbosity === 'number') Log.prototype.defaultVerbosity = opts.defaultVerbosity;

		opts.colorMap = Object.assign(opts.colorMap || {}, {
			reset: '\x1b[0m',
			info: '\x1b[34m',
			warn: '\x1b[33m',
			error: '\x1b[31m'
		});

		Object.defineProperty(opts, 'newTag', {
			set: function(newTag){
				if(newTag === this.tag) return;

				if(Log.prototype.loggers[newTag]){
					Log.prototype.loggers[this.tag].opts = Object.assign(Log.prototype.loggers[newTag].opts, Log.prototype.loggers[this.tag].opts);

					Log.prototype.loggers[newTag] = Log.prototype.loggers[this.tag];
				}

				Log.prototype.loggers[newTag] = Log.prototype.loggers[this.tag];

				delete Log.prototype.loggers[this.tag];

				this.tag = newTag;
			}
		});

		Log.prototype.loggers = Log.prototype.loggers || {};

		if(Log.prototype.loggers[tag]){
			Log.prototype.loggers[tag].opts = Object.assign(Log.prototype.loggers[tag].opts, opts);

			return Log.prototype.loggers[tag];
		}

		if(typeof opts.verbosity === 'undefined') opts.verbosity = Log.prototype.defaultVerbosity;

		const isNode = typeof window === 'undefined';

		const createLogger = (method) => {
			if(!console || typeof console[method] !== 'function') return;

			return function(verbosity){
				const hasVerbosity = !arguments.length || (arguments.length === 1 && typeof verbosity === 'number');

				if(hasVerbosity && !verbosity) verbosity = 0;

				const colorMap = logger.opts.colorMap, mappedColor = typeof colorMap[tag] === 'string' ? colorMap[tag] : colorMap[method];
				const args = Array.from(arguments);

				if(hasVerbosity) args.splice(0, 1);

				if(logger.opts.color && mappedColor) args.unshift(mappedColor);

				else if(isNode && method === 'error') args.unshift('[ERROR]');

				if(!logger.opts.silentTag && logger.opts.tag !== '_default_') args.unshift(`[${logger.opts.tag}]`);

				args.unshift(colorMap.reset);

				const logFunc = console[method].bind(this, ...args);

				if(hasVerbosity) return verbosity < logger.opts.verbosity ? logFunc : () => {};

				else if(!hasVerbosity && logger.opts.verbosity) logFunc();
			};
		};

		const logger = new Proxy(createLogger('log'), { get(target, method){ return (target[method] = (typeof target[method] !== 'undefined' ? target[method] : createLogger(method))); } });

		logger.opts = opts;

		Log.prototype.loggers[tag] = logger;

		return logger;
	}
}

Log.prototype.defaultVerbosity = 0;

if(typeof module === 'object') module.exports = Log;