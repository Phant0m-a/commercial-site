const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: {
        type: Date,
        default: Date().now,
        // required:  true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, unique:true, required: true },
    password: { type: String, required: true },
    description: { type: String, required: true},
    imgSrc: { type: String, default:'' },
    isEnabled:{type:Boolean, default:false}
},{timestamp:true});

const UserModal = mongoose.model('User', schema);
module.exports = UserModal;