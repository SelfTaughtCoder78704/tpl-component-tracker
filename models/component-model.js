const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const componentSchema = new Schema({
    codeType: {
        type: String,
        required: true,
        default: 'component'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sanitizedCode: {
        html: {
            type: String,
            default: ''
        },
        css: {
            type: String,
            default: ''
        },
        js: {
            type: String,
            default: ''
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

componentSchema.set('timestamps', true);
const Component = mongoose.model('component', componentSchema);

module.exports = Component;