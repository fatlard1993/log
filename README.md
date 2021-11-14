# log

A console log wrapper with tags, colors, and verbosity

## Usage

Create a new instance of Log and pass an optional options object

### Options

- tag :String: _default_ | Multiple log instances created with the same tag will use the same function and options
- silentTag :Boolean: false | If enabled will remove the tag label prepended to the log messages
- defaults :Object: verbosity, color, colorMap | Sets Log.prototype.defaults[prop]
- verbosity :Number: Log.prototype.defaults.verbosity | The logger verbosity is checked against each individual logger call verbosity. if callVerbosity is less than loggerVerbosity it executes the log
- color :Boolean: false | If enabled console messages are wrapped in the appropriate color escape sequences for: info, warn, and error
- colorMap :Object: reset, info, warn, error | Override or add to the colorMap

### nodeJS

```
const Log = require('log');

const syslog = new Log({
	tag: 'system',
	verbosity: 1,
	color: true
});
```

### browser

```
import Log from 'log';

const log = new Log({
	tag: 'lib',
	verbosity: 1
});
```

If you want your console debug lines to match where the logger call is made, instead of inside the Log class, use the non-simple format: log()('stuff')

### The Logger

```
const log = new Log({ verbosity: 3 });

log('simple', 'simple log verbosity is 0');
log.error('simple named');
log(2)('verbosity specific');
log.warn(1)('verbosity specific named');


// Change options on the fly

const demoLog = new Log({ tag: 'demo', verbosity: 1 });

demoLog('visible');
demoLog(1)('hidden');

demoLog.opts.verbosity = 2;

demoLog(1)('visible');
demoLog(2)('hidden');

demoLog.opts.newTag = 'demo_pt2';

log.opts.newTag = 'demo_pt2'; // If the tagged logger already exists it inherits the options from the newest member

demoLog(2)(`visible, tag: "demo_pt2" = "${demoLog.opts.tag}"`);
log(2)(`visible, tag: "demo_pt2" = "${log.opts.tag}"`);

log.opts.silentTag = true;

demoLog('without tag');
```

### Access other loggers from the prototype

```
const loggerNames = Object.keys(Log.prototype.loggers);

Log.prototype.loggers.demo.opts.verbosity = 0;
Log.prototype.loggers._default_.opts.verbosity = 9;
```
