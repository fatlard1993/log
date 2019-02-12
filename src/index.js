var log;

const logHelp = {
	DBG: 0,
	colorMap: {
		reset: '\x1b[0m',
		info: '\x1b[34m',
		warn: '\x1b[33m',
		error: '\x1b[31m'
	},
	noop: function(){},
	consoleWrap: function(method){
		return function _log(verbosity){
			if(verbosity && typeof verbosity !== 'number' || arguments.length > 1) console[method].apply(null, arguments);

			else if((verbosity || 0) < logHelp.DBG && console && console[method]){
				if(logHelp.isNode){
					return function _colorLog(){
						if(logHelp.mapColors && logHelp.colorMap[method]){
							Array.prototype.unshift.call(arguments, logHelp.colorMap[method]);
							Array.prototype.push.call(arguments, logHelp.colorMap.reset);
						}

						else if(method === 'error') Array.prototype.unshift.call(arguments, method);

						console[method].apply(null, arguments);
					};
				}

				return console[method].bind(console);
			}

			else return logHelp.noop;
		};
	}
};

if(typeof Proxy === 'function') log = new Proxy(logHelp.consoleWrap('log'), { get(target, method){ return logHelp.consoleWrap(method); } });

else{
	log = logHelp.consoleWrap('log');
	log.warn = logHelp.consoleWrap('warn');
	log.error = logHelp.consoleWrap('error');

	log.warn('Enabled limited non ES6 support, only log(v)(args), log.warn(v)(args) and log.error(v)(args) are available');
}

if(typeof window === 'undefined'){
	module.exports = log;

	logHelp.isNode = true;
	logHelp.mapColors = process.env.COLOR;

	logHelp.DBG = process.env.DBG || (process.env.QUIET ? 0 : 1);
}

log()('log verbosity set to: '+ logHelp.DBG);