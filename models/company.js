const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create company schema & model
const CompanySchema = new Schema({
    Company: {
        type: String,
        required: true
    },
    Ticker: {
        type: String,
        required: true
    },
});

// This model allows us to interact with the schema
const Company = new mongoose.model('company',CompanySchema);

module.exports = Company;