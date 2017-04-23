var Parser = require("../parser")

var parser = new Parser({ method: 0 })
var file = "./file.log"

var fs = require('fs')
var writer = fs.createWriteStream(file)
writer.write("GET /data\n")
writer.write("POST /data\n")
writer.write("GET /data\n")
writer.end();

function validation(data) {
    return data == "GET"
}

parser.parse('method', validation, file, function (err, res) {
    if (!err) {
        res.on('data', function (d) {
            console.log("res:", d);
        })
        res.on("end", function () {
            console.log("end");
            fs.unlink(file)
        })
    } else {
        console.error(err)
    }
})