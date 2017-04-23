var should = require('chai').should();
var fs = require('fs')
var Parser = require('../lib/parser')

describe("Log File Parser", () => {
    it("should return error for non-existing files", function (done) {
        var parser = new Parser()
        parser.parse("./xyz.xyz", function (err, out) {
            err.should.be.a('string')
            err.should.be.eql("No Such File or Directory")
            done()
        })
    })
    it("should parse all the lines", (done) => {
        var file = "./test.log"
        var parser = new Parser()
        var writer = fs.createWriteStream(file)
        writer.write("Hi wasssup\n")
        writer.write("Hi wasssup\n")
        writer.write("Hi wasssup\n")
        writer.end()

        parser.parse(file, function(err, out) {
            should.not.exist(err)
            var res = []
            out.on('data', function(d) {
            	res.push(d)
            })
            out.on('end', function() {
                res.length.should.be.eql(3)
                res[0].should.contain("Hi wasssup")
                fs.unlink(file)
                done()
            })
        })
    })
    it("should return only the valid lines", (done) => {
        var file = "./test.log"
        var parser = new Parser({method: 0})
        var writer = fs.createWriteStream(file)
        writer.write("GET /timestamp\n")
        writer.write("GET /data\n")
        writer.write("POST /login\n")
        writer.end()

        function validation (param) {
            return (param == "GET")
        }

        parser.parse("method", validation, file, function(err, out) {
            should.not.exist(err)
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
    })
})