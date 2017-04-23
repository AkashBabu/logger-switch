var Logger = require("../index")
var moment = require("moment")
var logger = new Logger("Test")
var chai = require("chai")
var should = chai.should()
chai.use(require("sinon-chai"))
require("mocha-sinon")


describe("Logger", () => {

    beforeEach(function() {
        this.sinon.stub(console, 'log')
        this.sinon.stub(console, 'error')
        this.sinon.stub(console, 'info')
        this.sinon.stub(console, 'warn')
        logger.activate()
    })
    afterEach(function() {
        this.sinon.restore()
        logger.deactivate()
    })

    it("should log without timestamp if not specified", function() {
        logger.log("some log")
        console.log.should.be.calledOnce
        console.log.should.be.calledWith("Test:", 'some log')
    })

    it("should call console.info", () => {  
        logger.info("some log")
        console.info.should.be.calledOnce
        console.info.should.be.calledWith("Test:", "some log")
        console.log.should.not.be.calledOnce
        console.warn.should.not.be.calledOnce
        console.error.should.not.be.calledOnce
    })
    it("should call console.log", () => {  
        logger.log("some log")
        console.log.should.be.calledOnce
        console.log.should.be.calledWith("Test:", "some log")
        console.info.should.not.be.calledOnce
        console.warn.should.not.be.calledOnce
        console.error.should.not.be.calledOnce
    })
    it("should call console.warn", () => {  
        logger.warn("some log")
        console.warn.should.be.calledOnce
        console.warn.should.be.calledWith("Test:", "some log")
        console.log.should.not.be.calledOnce
        console.info.should.not.be.calledOnce
        console.error.should.not.be.calledOnce
    })
    it("should call console.error", () => {  
        logger.error("some log")
        console.error.should.be.calledOnce
        console.error.should.be.calledWith("Test:", "some log")
        console.log.should.not.be.calledOnce
        console.warn.should.not.be.calledOnce
        console.info.should.not.be.calledOnce
    })
    it("should not be called when logger is deactivated", () => {
        logger.deactivate()
        logger.log("some log")
        console.log.callCount.should.be.eql(0)
    })
    it("should log with timestamp", () => {
        logger.timestamp("DD-MM-YY")
        var curDate = moment().format("DD-MM-YY")
        logger.log("some log")
        console.log.callCount.should.be.eql(1)
        console.log.should.be.calledWith("Test (" + curDate + "):", "some log")

        logger.timestamp()
        logger.log("some log")
        console.log.callCount.should.be.eql(2)
        console.log.should.be.calledWith("Test:", "some log")
    })
    it("should log to a file when a file logger is specified", function()  {
        var fs = require("fs")
        var logFile = "./logger.log"
        var errLogFile = "./errLogger.log"

        var fileLog = new console.Console(fs.createWriteStream(logFile), fs.createWriteStream(errLogFile))
        var fileLogger = new Logger("Test", fileLog)

        this.sinon.restore()

        fileLogger.log("some log")
        fs.readFile(logFile, {encoding: 'utf8'}, function(err, data) {
            if(err) {
                console.log(err);
            } else {
                data.should.be.eql("Test: some log\n")
                
            }

            fs.unlink(logFile)
            fs.unlink(errLogFile)
        }) 
    })
})
