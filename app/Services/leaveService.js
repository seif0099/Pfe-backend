var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
var ObjectId = require('mongoose').mongo.ObjectID;

var Encrypt = function(string) {
    var hash = sha512.create();
    hash.update(string);
    var encrypted = hash.hex();
    return encrypted;
};
module.exports = {

    requestLeave: async(req, res) => {

        try {
            const newLeave = new LeaveApplication(req.body);
            console.log(req.body);
            const user = await User.findById(req.body.userid);
            console.log(user)
            newLeave.user = user;
            newLeave.status = "pending";
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

        try {
            const result = await LeaveApplication.findOneAndDelete({ '_id': req.params.id });
            if (result) {
                const userUpdated = await User.updateOne({ '_id': result.user }, {
                    $pull: {
                        leaveApplication: ObjectId(req.params.id)
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

    updateLeave: async(req, res) => {
        await LeaveApplication.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true });
    },
}