











var moment = require('moment');


var Logger = function (name, logger) {
    this.name = name ? name : 'Log';
    this.logger = logger ? logger : console;
    this.active = true;
    this.tsFormat = null;

    var self = this;

    ['log', 'info', 'debug', 'warn', 'error'].forEach(function (type) {
        self[type] = function () {
            self.active ? self.logger[type].apply(null, [self.getPrefix()].concat(Array.prototype.slice.call(arguments))) : null;
        }
    })

    return this;
}
Logger.prototype.getPrefix = function() {
    var self = this;
    return self.name + (self.tsFormat ? ' (' + moment().format(self.tsFormat) + ')' : "") + ":";
}
Logger.prototype.activate = function () {
    this.active = true;
}
Logger.prototype.deactivate = function () {
    this.active = false;
}
Logger.prototype.timestamp = function (tsFormat) {
    // this.ts = true;
    this.tsFormat = tsFormat;
}

module.exports = Logger;
