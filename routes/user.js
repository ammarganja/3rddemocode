const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helper = require('../utilatis/helper');

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json(
          helper.setErrorResponse({ message: "Mail already exists" })
        );
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json(
              helper.setErrorResponse({ message: "Password must be contain 6 letters with 1 capital, 1 number and 1 special character." })
            );  

          } else {

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(req.body.password)) {
              return res.status(500).json(
                helper.setErrorResponse({ message: "Password must be contain 6 letters with 1 capital, 1 number and 1 special character." })
              );  
            }

         
            if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(req.body.mobileno)) {
              return res.status(500).json(
                helper.setErrorResponse({ message: "mobile number must be contain 10 numbers" })
              );
            }

            if (!req.body.firstname) {
              return res.status(500).json(helper.setErrorResponse({ message: "firstname Required" }));
            }

            if (!req.body.lastname) {
              return res.status(500).json(helper.setErrorResponse({ message: "Lastname Required" }));
            }

            if (!req.body.email) {
              return res.status(500).json(helper.setErrorResponse({ message: "Email Address Required" }));
            }

            if (!req.body.mobileno) {
              return res.status(500).json(helper.setErrorResponse({ message: "Mobileno Required" }));
            }

            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              mobileno: req.body.mobileno,
              password: hash
            }, { versionKey: false });

            user
              .save()
              .then(resultData => {
                if (resultData) {
                  const token = jwt.sign(
                    {
                      email: resultData.email,
                      userId: resultData._id
                    },
                    process.env.JWT_KEY,
                    {
                      expiresIn: "1h"
                    }
                  );
                  
                  const obj = {
                    token: token,
                    data: {
                      "firstname": resultData.firstname,
                      "lastname": resultData.lastname,
                      "email": resultData.email,
                      "mobileno":resultData.mobileno
                    }
                  }
                  return res.status(200).json(helper.setSuccessResponse({ recordset: obj }));
                }
                console.log(recordset);
                res.status(201).json({
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(
                  helper.setErrorResponse({ status: 500 })
                );
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json(
            helper.setErrorResponse({ message: "auth failed" })
          );
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json(helper.setErrorResponse({ message: "auth failed" }));
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              process.env.JWT_KEY,
              {
                  expiresIn: "1h"
              }
            )
            let obj = {
                data: user,
                token: token
              };
            return res.status(200).json( helper.setSuccessResponse({ message: "Auth successful", recordset: obj}));
          }
          res.status(401).json( helper.setErrorResponse({ message: "auth failed" }));
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.delete("/:userId", (req, res, next) => {
  user.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json(
        helper.setSuccessResponse({ message: "User deleted"})
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(
        helper.setErrorResponse({ status:500 }));
    });
});

router.get("/getUserList", (req, res, next) => {
  user.find()
    .exec()
    .then(result => {
      console.log(result)
      res.status(200).json(
        helper.setSuccessResponse({ message: "Get User List Successfully", data: result})
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;