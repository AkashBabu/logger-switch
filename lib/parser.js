var parseArgs = require("args-pattern")
var fs = require('fs')

var defaults = {
    timestamp: 0,
}

function isUndefined(d) { return d == undefined || d == null }

function Parser(options) {
    this.options = options || defaults
    return this
}

// args [key], [validation], file, cb
/**
 * Will parse a file
 * @param {string} [key=timestamp] 
 * @param {string} [validation=noop]
 * @param {string} file 
 * @param {function} cb - callback
 */
Parser.prototype.parse = function () {

    let [key, validation, file, cb] = parseArgs(arguments, '[key], [validation], file, cb', {
        args: ['timestamp', function(){return true}, "./abc.abc", function(){}]
    })
    var self = this; 
    fs.stat(file, function(err, stat) {
        if(stat) {
            if(stat.isFile()) {

                var out = []
                var ok = true
                var index = isUndefined(self.options[key]) ? 0 : self.options[key]
                            
                var stream = require('readable-stream')
                var ts = new stream.Transform({objectMode: true})
                ts._transform = function(chunk, encoding, done){
                    var data = chunk.toString()
                    var parameter = isUndefined(data.split(' ')[index]) ? "" : data.split(' ')[index]
                    if(validation) {
                        if(validation(parameter)) {
                            this.push(data)
                        }
                    } else {
                        this.push(data)
                    }
                    done()
                }
                ts._flush = function(done){
                    done()
                }
                var liner = new stream.Transform( { objectMode: true } )
                
                liner._transform = function (chunk, encoding, done) {
                    var data = chunk.toString()
                    if (this._lastLineData) data = this._lastLineData + data
                
                    var lines = data.split('\n')
                    this._lastLineData = lines.splice(lines.length-1,1)[0]
                
                    lines.forEach(this.push.bind(this))
                    done()
                }
                liner._flush = function (done) {
                    if (this._lastLineData) this.push(this._lastLineData)
                    this._lastLineData = null
                    done()
                }
                fs.createReadStream(file).pipe(liner).pipe(ts)

                cb(null, ts)

            } else {
                cb("Path is not a File")
            }
        } else {
            cb("No Such File or Directory")
        }
    })   
}

module.exports = Parser