var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
const SSEClient = require("../SSEClient");
const Notification = require("../models/notif");
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
            const notif = new Notification({
                user: user,
                status: "not seen",
                type: "leave",
                role: "admin",
                leaveApplication: newLeave
            })
            notif.save();
            res.status(200).json({ success: "true" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: "false" });
        }
    },

    deleteLeave: async(req, res) => {

        try {
            const result = await LeaveApplication.findOneAndDelete({ '_id': req.query.id });
            if (result) {
                const userUpdated = await User.updateOne({ '_id': result.user }, {
                    $pull: {
                        leaveApplication: ObjectId(req.query.id),
                        status : "Refused"
                    }
                })
                return res.status(200).send()
            }


        } catch (error) {

            res.status(500).send({ error })
        }

    },

    updateLeave: async(req, res) => {
        result = await LeaveApplication.findByIdAndUpdate(req.query.id,req.body );
console.log(req.body)
        res.status(200).json({ success: true });
    },
    GetRequestById: async (req, res) => {
        console.log(req.query.id)
        const user = await User.findById(req.query.id);
        const leaves = await LeaveApplication.find({user: user})
        const result = []
        leaves.map(
            row => {
                let newRow = {}
                newRow._id = row._id
                newRow.fromDate = row.fromDate
                newRow.toDate = row.toDate
                newRow.nom = user.nom
                newRow.prenom = user.prenom
                newRow.status = row.status
                newRow.reasonForLeave = row.reasonForLeave
                result.push(newRow)
            }
        )
        res.status(200).send(result);
      },
      GetEvents: async(req, res) => {
        const client = new SSEClient(res);
        client.initialize();
        setTimeout(() => {
          client.send({ id: Date.now(), type: 'message', data: 'hello' });
        }, 5000);
      }
     
}