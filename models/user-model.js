const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Component = require('./component-model');


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    components: [{
        type: Schema.Types.ObjectId,
        ref: 'Component'
    }]


});

const User = mongoose.model('user', userSchema);

module.exports = User;