var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
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
        let user = await User.findOne({ username: req.body.username });

        if (!user) {
            res.json({
                success: false,
                message: "Authentication failed. User not found.",
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
            matricule: req.body.matricule
        });

        newUser.save(function(err, data) {
            if (err) {
                console.log(err);
            } else {
                res.json({ data });
            }
        });
    },

    GetAllUsers: async(req, res) => {
        User.find({}, function(err, users) {
            res.json(users);
        });
    },
    UpdateUser: async(req, res) => {
        await User.findByIdAndUpdate(req.params.userid, req.body);

        res.status(200).json({ success: true });
    },

    GetUserById: async(req, res) => {
        User.find({ _id: req.params.userid }, (err, user) => {
            res.json(user[0]);
        });
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

    }






}