var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
var ObjectId = require('mongoose').mongo.ObjectID;
var sanction = require("../models/sanctions");
const promotion = require("../models/promotion");
const mission = require("../models/mission");

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

    updateSanction: async(req, res) => {
        await sanction.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true });
    },
    GetAllSanctions: async(req, res) => {
        sanction.find({}, function(err, users) {
            res.json(users);
        });

    },

    GetAllUsers: async(req, res) => {
        User.find({}, function(err, users) {
            res.json(users);
        });
    },
    GetUserById: async(req, res) => {
        User.find({ _id: req.params.userid }, (err, user) => {
            res.json(user[0]);
        });
    },
    updatePromotion: async(req, res) => {
        await promotion.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true });
    },


    createPromotion: async(req, res) => {

        try {
            const newProm = new promotion(req.body);
            console.log(req.body);
            const user = await User.findById(req.body.userid);
            console.log(user)
            newProm.user = user;
            await newProm.save();
            user.promotion.push(newProm);
            await user.save();
            let proms = await promotion.find({}).populate('promotion');

            res.send(proms)

        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },


    createMission: async(req, res) => {

        try {
            const newMission = new mission(req.body);
            console.log(req.body);
            const user = await User.findById(req.body.userid);
            console.log(user)
            newMission.user = user;
            await newMission.save();
            user.mission.push(newMission);
            await user.save();
            let missions = await mission.find({}).populate('mission');

            res.send(missions)

        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },
    updateMission: async(req, res) => {
        await mission.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true });
    },




    deleteMission: async(req, res) => {

        try {
            const result = await mission.findOneAndDelete({ '_id': req.params.id });
            if (result) {
                const userUpdated = await User.updateOne({ '_id': result.user }, {
                    $pull: {
                        mission: ObjectId(req.params.id)
                    }
                })
                return res.status(200).send()
            }


        } catch (error) {

            res.status(500).send({ error })
        }

    },



}