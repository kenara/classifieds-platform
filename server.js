var express = require("express")
var path = require("path")
var serveStatic = require("serve-static")
var history = require('connect-history-api-fallback');

var app = express()
app.use(history());
app.use(express.static(__dirname))
app.use(serveStatic(path.join(__dirname, "build")))

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
//     if (err) {
//       res.status(500).send(err)
//     }
//   })
// })
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'build/index.html'))
// });

var port = process.env.PORT || 8000
app.listen(port)
console.log("server started " + port)
