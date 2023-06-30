const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date(),
        // required: true
    },
    // user: {type:mongoose.Types.ObjectId},
    name: { type: String, required: true, unique:true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    //rooms, ...
    price: { type: Number, required: true },
    rooms: { type: String, required: true },
    size: { type: String, required: true },
    baths: { type: String, required: true },
    description: { type: String, default: '' },
    imgSrc: { type: String, default: '' },
    imgSrc2: {
        type: String,  default: '' 
    },
    imgSrc3: {
        type: String,  default: '' 
    },
    imgSrc4: {
        type: String,  default: '' 
    },
    isEnabled: { type: Boolean, default: true },
   
    Date: {
        type: Date, default:Date(),
    },
},{timestamp:true});

const propertyModal = mongoose.model('Property', schema, 'properties');
module.exports = propertyModal;