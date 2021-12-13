require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
let uri = "mongodb+srv://hermit46:Water1sl!fe@cluster0.hlswi.mongodb.net/Stocks?retryWrites=true&w=majority"

//catching exceptions
const catchExceptions = func => {
    return (req, res, next) => {
        Promise.resolve(func(req,res)).catch(next)
    }
}


//set up our express app
const app = express()
 
 // connect to mongoDB
mongoose.connect(uri, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', (error) => console.log("Connected to Database."))
mongoose.Promise = global.Promise

// Initialize home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

// Searching by Ticker or Name
app.get('/search', catchExceptions(async (req,res) => {
    var query = ""
    if (req.query['query'] == "") {
        res.send("Empty search! <p> <a href ='/'> Home Page </a>");
        return;
    }
    // When searching for symbol
    else if (req.query['type'] == 'symbol') {
        query = {Ticker: req.query['query'].trim()}
    }
    // When searching for name
    else if (req.query['type'] == 'name'){
        query = {Company: req.query['query'].trim()}
    }
    // Searching
    db.collection('companies').find(query).toArray(function (err, items) {
        if (err)
            console.log("Error: " + err)
        else if (items.length == 0)
            res.send("No match on search. <p> <a href ='/'> Home Page </a>")
        else { // taking JSON & converting to JS array
            var resultArray = []
            for (i = 0; i < items.length; i++) {
                resultArray.push([items[i].Company, items[i].Ticker])
            }
            res.send(printData(items, resultArray))
        }
    })
})
)


function printData(items, result) {
    var output = ""
    for (i = 0; i < items.length; i++)
        output += ("<strong>Company Name: </strong>" + result[i][0] + ", <strong>Symbol: </strong>" + result[i][1]  + "<br></br>")
    output += "<br> <a href ='/'> Home Page </a>"
    return output
}

// Useful for production environment: create process event listener for unhandled rejection
process.on('unhandledRejection', err => {
    // if you want a stack always throw an error
    console.log(`Send this to error tracking: ${err.stack}`)
    console.log("----------------------------")
})

app.listen(process.env.PORT || 8000, function() {
    console.log("Server Started & Listening on port %d in %s mode.", this.address().port, app.settings.env)
}) 


