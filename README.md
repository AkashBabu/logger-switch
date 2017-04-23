# logger-switch
Nodejs library to turn ON/OFF logging and also deactivate/activate logging only in a particular peice of code, or use your own logger etc.

## Installation 
> npm install logger-switch --save

## Usage

```javascript
var Logger = require('logger-switch');

var logger = new Logger('Test');

logger.activate();
logger.timestamp('DD MMM YY, HH:mm a');

logger.log('hi' + ' Cavin', "how r u??");
//Test (12 Feb 17, 11:37 am): hi Cavin how r u??  

logger.deactivate();
logger.error('This will not be logger');
// This will not be printed

logger.activate();
logger.timestamp(null);
logger.log('this will not have timstamp')
//Prints: Test: this will not have timstamp
```

## Parser Usage
```javascript
// file contents(./file.log):
// GET /data
// POST /login
// GET /timestamp

var Parser = require("logger-switch/parser")
var parser = new Parser({method: 0})
var file = "./test.log"
var writer = fs.createWriteStream(file)
writer.write("GET /timestamp\n")
writer.write("GET /data\n")
writer.write("POST /login\n")
writer.end()

function validation (param) {
    return (param == "GET")
}

parser.parse("method", validation, file, function(err, out) {
    var res = []
    out.on('data', function(d) {
        res.push(d)
    })
    out.on('end', function() {
        res.length.should.be.eql(2)
        res[0].should.contain("GET /timestamp")
        res[1].should.contain("GET /data")

        fs.unlink(file)
        done()
    })
})
```

## Constructor

**Logger**(name, logger)  
*name* - Prefix to be used while logging. *default* is 'Log :'  
*logger* - Custom logger to be used. *default* is stdout and stderr

**Parser**(options)
*options* - Should be in the format key-index, where key is for developer reference and index
            is the index of the key in each line when seperated by `" "(space)`

## Methods - Logger

**activate()**  
Will Enable logging activity

**deactivate()**
Will disable logging activity

**timestamp(format)**
Will enable/disable timestamp logging.  
*format* - Supports momentjs timestamp format string. if `null` is passed then timestamp logging will be disabled  

## Methods - Parser

**parse([key], [validation], file, cb)**  
Will parse the given file  
*key* - the key in the options to be used to find the parameter. `Defaults` to timestamp with index `0`  
*validation* - Validation function to be called for the param. This is used to filter the lines in the result. `Defaults` to `function(){return true}`  
*file* - Complete file path that has to be parsed  
*cb* - Callback(err, result), result includes the filtered lines in the file


## Testing
> npm install  
> npm test



Similarly you can create many such logger and activate only the required logger from the configuration file, depending on env being used.  
For more [examples](https://github.com/AkashBabu/logger-switch/tree/master/examples)