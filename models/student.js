const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name: { type: String, required: true },
    image: { type: String, required: true },
    marks: { 
        type: String, 
        required: true, 
    }
});

module.exports = mongoose.model('student', studentSchema);