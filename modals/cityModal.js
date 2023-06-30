// { 'id':'someId', name:'Lahore'}
//now this will be assigned to different properties
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    // user: {type:mongoose.Types.ObjectId},
    name: { type: String, unique:true, required: true },

    //rooms, ...
    isDeleted: { type: Boolean, default: false },
    imgSrc: { type: String, default: '', required:true },
    isEnabled: { type: Boolean, default: true },

},{timestamp:true});

const cityModal = mongoose.model('City', schema,);
module.exports = cityModal;