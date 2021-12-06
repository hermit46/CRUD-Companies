const express = require('express')
const router = express.Router()
const Company = require('../models/company')

// Getting all
router.get('/', async (req, res) => {
    try {
        const companies = await Company.find()
        res.json(companies)
    } catch (err) {
        // 500 for server error
        res.status(500).json({ message: err.message })
    }
})

// IF searching by Ticker
router.get('/ticker/:Ticker', getCompanyByTicker, (req, res) => {
    res.send(res.company)
})

// IF searching by Name
router.get('/company/:Company', getCompanyByName, (req, res) => {
    res.send(res.company)
})

// middleware for modularity
async function getCompanyByTicker(req, res, next) {
    let company
    try {
        // company = await Company.findById(req.params.id)
        company = await Company.find({Ticker: req.params.Ticker})
        if (company == null) {
            return res.status(404).json({ message: "Cannot find company" })
        } 
    } catch (err) {
            return res.status(500).json({ message: err.message })
        }
        res.company = company
        next()
}

async function getCompanyByName(req, res, next) {
    let company
    try {
        // company = await Company.findById(req.params.id)
        console.log(req.params.Company)
        company = await Company.find({Company: req.params.Company})
        if (company == null) {
            return res.status(404).json({ message: "Cannot find company" })
        } 
    } catch (err) {
            return res.status(500).json({ message: err.message })
        }
        res.company = company
        next()
}

module.exports = router