const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const student = require("../models/student")


router.get('/', (req, res) => {
    student.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving student :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

        student.findById(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Retriving student :' + JSON.stringify(err, undefined, 2)); }
    });
});



router.post('/', (req, res) => {
    const Student = new student({
        _id: new mongoose.Types.ObjectId(),
        Name: req.body.Name,
        image: req.body.image,
        marks: req.body.marks
    });
    Student.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in student Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

// router.get('/list', (req, res) => {
//     employee.find((err, docs) => {
//         if (!err) {
//             res.render("employee/list", {
//                 list: docs
//             });
//         }
//         else {
//             console.log('Error in retrieving employee list :' + err);
//         }
//     });
// });


router.put('/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var Student = {
        Name: req.body.Name,
        image: req.body.image,
        marks: req.body.marks
    };
    student.findByIdAndUpdate(req.params.id, { $set: Student }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in student Update :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.delete('/:id', (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

        student.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in student Delete :' + JSON.stringify(err, undefined, 2)); }
    });
});


module.exports = router;