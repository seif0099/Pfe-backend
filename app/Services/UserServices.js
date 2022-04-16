var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
const SuppHours = require("../models/suppHours");
const mission = require("../models/mission");
var ObjectId = require('mongoose').mongo.ObjectID;

/* costum methods  */

var Encrypt = function(string) {
    var hash = sha512.create();
    hash.update(string);
    var encrypted = hash.hex();
    return encrypted;
};
module.exports = {
    Authenticate: async(req, res) => {
        let user = await User.findOne({ email: req.body.email });
           
        if (!user) {
            res.json({
                success: false,
                message: "Authentication failed. email not found.",
            });
        } else {
            if (Encrypt(req.body.password) != user.password) {
                res.json({
                    success: false,
                    message: "Authentication failed. Wrong password.",
                });
            } else {
                const payload = {
                    admin: user.admin,
                };

                var token = jwt.sign(payload, 'kjhkhkjh', {
                    expiresIn: "2 days",
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: "Enjoy your token!",
                    idToken: token,
                    expiresIn: 1440,
                    user: user,
                });
            }
        }
    },

    SignIn: (req, res) => {
        console.log({ x: req.body })
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: Encrypt(req.body.password),
            nom: req.body.nom,
            prenom: req.body.prenom,
            classEmp: req.body.classEmp,
            matricule: req.body.matricule,
            postEmp : req.body.postEmp 
        });

        newUser.save(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json({ data });
            }
        });
    },


    UpdateUser: async(req, res) => {
        await User.findByIdAndUpdate(req.params.userid, req.body);

        res.status(200).json({ success: true });
    },



    logout: function(req, res) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/"); //Inside a callback… bulletproof!
        });
    },

    updateProfilePic: async(req, res) => {
        upload(req, res, function(err) {
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }

            User.update({ _id: req.params.userid }, { profilepicUrl: req.file.filename },
                (err, user) => {
                    if (err) throw err;
                }
            );
            res.json({ error_code: 0, err_desc: null });
        });
    },


    deleteUser: async(req, res) => {

        try {
            console.log("object...................")
            const result = await User.findOneAndDelete({ '_id': req.params.id });

            return res.status(200).send()



        } catch (error) {

            res.status(500).send({ error })
        }

    },
    requestSuppHours: async(req, res) => {

        try {
            const newReq = new SuppHours(req.body);
            console.log(req.body);
            const user = await User.findById(req.body.userid);
            console.log(user)
            newReq.user = user;
            await newReq.save();
            user.SuppHours.push(newReq);
            await user.save();
            let hours = await SuppHours.find({}).populate('Employee');

            res.send(hours)
        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },

    deleteReqHours: async(req, res) => {

        try {
            const result = await SuppHours.findOneAndDelete({ '_id': req.params.id });
            if (result) {
                const userUpdated = await User.updateOne({ '_id': result.user }, {
                    $pull: {
                        SuppHours: ObjectId(req.params.id)
                    }
                })
                return res.status(200).send()
            }


        } catch (error) {

            res.status(500).send({ error })
        }

    },




    /* updateLeave: async(req, res) => {
         try {
             const updatedLeaveData = new LeaveApplication(req.body)
             console.log("--------------", updatedLeaveData)

             await LeaveApplication.findOneAndUpdate(req.params.id, {
                     $set: {
                         Leavetype: req.body.Leavetype,
                         FromDate: req.body.FromDate,
                         ToDate: req.body.ToDate,
                         Reasonforleave: req.body.Reasonforleave,
                         Status: req.body.Status,
                         userid: req.body.userid
                     }
                 },

             ).then((LeaveApplication));

             res.status(200).json({ success: true });
         } catch (error) {

             res.status(500).send({ error })
         }

     }*/

    updateReqHours: async(req, res) => {
        await SuppHours.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true });
    },

  





}