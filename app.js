require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
let uri = "mongodb+srv://" + process.env.USERNAME + ":" + process.env.PASSWORD + "@cluster0.hlswi.mongodb.net/Stocks?retryWrites=true&w=majority"
var Company = require('./models/company.js')

//catching exceptions
const catchExceptions = func => {
    return (req, res, next) => {
        Promise.resolve(func(req,res)).catch(next)
    }
}

//set up our express app
const app = express()

// POST needs the body parser to retrieve data & translate it to JS
app.use(bodyParser.urlencoded({
    extended: false
 }))

 app.use(bodyParser.json())
 
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


// SEARCHING BY TICKER OR NAME  (GET)
app.get('/search', catchExceptions(async (req,res) => {
    var query = ""
    if (req.query['query'] == "") {
        res.send("Empty search! <p> <a href ='/'> Home Page </a>");
        return
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

// ADDING A NEW ENTRY (POST)
app.post('/add', catchExceptions(async (req,res) => {
    var companyData = {
        Company: req.body.name,
        Ticker: req.body.symbol
    }

    //BONUS: To check if entry already exists? 
    // db.collection('companies').find(companyData).limit(1).size().toArray (function (err, items) {
    //     if (err)
    //         console.log("Error: " + err)
    //     else if (items.length)
    //         console.log("Item exists, therefore no action is performed.")
    // })

    new Company(companyData).save()
    console.log("Inserted!" + '\n' + 
                "Name: " + req.body.name + '\n' + 
                "Ticker: " + req.body.symbol)
    res.redirect('/')
}))

// app.get('/add', catchExceptions(async (req,res) => {
//     if (req.query['name'] == "") {
//         res.send("Empty search! <p> <a href ='/'> Home Page </a>")
//         return
//     }
//     else if (req.query['symbol'] == "") {
//         res.send("Empty search! <p> <a href ='/'> Home Page </a>")
//         return
//     }
//     console.log(req.query['symbol'])
//     console.log(req.query['name'])
//     var companyData = {
//         Ticker: req.query['symbol'].trim(),
//         Company: req.query['name'].trim()
//     }
//     // Check for pre-existing name & symbol
//     // We will need an async result (db query for existing) and
//     // validators don't support promises, hence need to create own function & pass callback
//     db.collection('companies').find(companyData).toArray(function (err, items) {
//         if (err)
//             console.log("Error: " + err)
//         else if (items.length) // Found a pre-existing search
//             res.send("Entry already exists. <p> <a href ='/'> Home Page </a>")
//         else { 
//             app.post('/post', (req,res) => {
//                 db.collection('companies').insertOne(companyData, function(err,res) {
//                     if (err)
//                         console.log("Error: " + err)
//                     else
//                         res.send("Item inserted! <p> <a href ='/'> Home Page </a>")
                    
//                 })
//             })
//         }
//     })
// })
// )


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


