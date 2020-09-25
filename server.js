var express = require("express")
var path = require("path")
var serveStatic = require("serve-static")

var app = express()
app.use(express.static(__dirname))
app.use(serveStatic(path.join(__dirname, "build")))

var port = process.env.PORT || 8000
app.listen(port)
console.log("server started " + port)
