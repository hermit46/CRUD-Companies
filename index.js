// const express = require('express')
const url = require('url')
// const router = express.Router()
const Company = require('./models/company')
var http = require('http') 
var fs = require("fs")

// var app = express();

// //parses request body and populates request.body
// app.use( express.bodyParser() );

// //checks request.body for HTTP method overrides
// app.use( express.methodOverride() );

// //perform route lookup based on url and HTTP method
// app.use( app.router );

// //Where to serve static content
// app.use( express.static( path.join( application_root, 'site') ) );

// //Show all errors in development
// app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));

// app.get('/', function (req, res) {
//     res.render('index', {});
//   });

// var port = 8000;
// app.listen(port, function() {
//     console.log( 'Express server listening on port %d in %s mode', port, app.settings.env );
// })

http.createServer(function  (req,  res) {
    res.writeHead(200, {'Content-Type': 'text/html'})
    if (req.url  ==  "/") { //load form 
        // file="index.html"
        var html = fs.readFileSync('./index.html');
        res.write(html);    
        // fs.readFile(file, function(err, txt) {
        //     res.write(txt)
        // })
    }
    else if (req.url == "/result") { // after click submit
        console.log("text")
        var qobj = url.parse(req.url, true).query
        console.log("Result is: " + qobj)
        var txt = qobj.abc
        res.write("Result: " + txt)
    }
    res.end()
}).listen(8000)


// module.exports = router