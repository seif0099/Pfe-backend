var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
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
            nom: "",
            prenom: "",
            classEmp: "",
            matricule: ""
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


    requestLeave: async(req, res) => {

        try {
            const newLeave = new LeaveApplication(req.body);
            const user = await User.findById(req.params.id);
            newLeave.user = user;
            await newLeave.save();
            user.leaveApplication.push(newLeave);
            await user.save();
            let leaves = await LeaveApplication.find({}).populate('Employee');

            res.send(leaves)

        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },

    deleteLeave: async(req, res) => {
        User.findById({ id: req.params.id }, function(err, employee) {
            if (err) {
                res.send("error");
                console.log(err.message);
            } else {
                LeaveApplication.findByIdAndRemove({ id: req.params.id }, function(
                    err,
                    leaveApplication
                ) {
                    if (!err) {
                        console.log("LeaveApplication deleted");
                        User.updateOne({ id: req.params.id }, { $pull: { leaveApplication: req.params.id2 } }),

                            res.send(leaveApplication);


                    } else {
                        console.log(err.message);
                        res.send("error");
                    }
                });
                console.log("delete");
                console.log(req.params.id);
            }
        });
    }

}