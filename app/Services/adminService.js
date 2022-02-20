var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
var ObjectId = require('mongoose').mongo.ObjectID;
var sanction = require("../models/sanctions")

var Encrypt = function(string) {
    var hash = sha512.create();
    hash.update(string);
    var encrypted = hash.hex();
    return encrypted;
};
module.exports = {


    deleteUser: async(req, res) => {

        try {
            console.log("object...................")
            const result = await User.findOneAndDelete({ '_id': req.params.id });

            return res.status(200).send()



        } catch (error) {

            res.status(500).send({ error })
        }


    },


    addSanction: async(req, res) => {

        try {
            const newSanction = new sanction(req.body);
            console.log(req.body);
            const user = await User.findById(req.body.userid);
            console.log(user)
            newSanction.user = user;
            await newSanction.save();
            user.sanction.push(newSanction);
            await user.save();
            let sanctions = await sanction.find({}).populate('Employee');

            res.send(sanctions)

        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },

    deleteSanction: async(req, res) => {

        try {
            const result = await sanction.findOneAndDelete({ '_id': req.params.id });
            if (result) {
                const sanctionDelted = await User.updateOne({ '_id': result.user }, {
                    $pull: {
                        sanction: ObjectId(req.params.id)
                    }
                })
                return res.status(200).send()
            }


        } catch (error) {

            res.status(500).send({ error })
        }

    },



}