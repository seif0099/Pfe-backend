var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
var ObjectId = require("mongoose").mongo.ObjectID;
var sanction = require("../models/sanctions");
const promotion = require("../models/promotion");
const mission = require("../models/mission");
const mutual = require("../models/mutualPaper");
const Pointage = require("../models/pointage");

var Encrypt = function (string) {
  var hash = sha512.create();
  hash.update(string);
  var encrypted = hash.hex();
  return encrypted;
};
module.exports = {
  Authenticate: async(req, res) => {
    let user = await admin.findOne({ email: req.body.email });
       
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
  deleteUser: async (req, res) => {
    try {
      console.log("object...................");
      const result = await User.findOneAndDelete({ _id: req.params.id });

      return res.status(200).send();
    } catch (error) {
      res.status(500).send({ error });
    }
  },

  addSanction: async (req, res) => {
    try {
      const newSanction = new sanction(req.body);
      console.log(req.body);
      const user = await User.findById(req.body.userid);
      console.log(user);
      newSanction.user = user;
      await newSanction.save();
      user.sanction.push(newSanction);
      await user.save();
      let sanctions = await sanction.find({}).populate("Employee");

      res.send(sanctions);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },

  deleteSanction: async (req, res) => {
    try {
      const result = await sanction.findOneAndDelete({ _id: req.params.id });
      if (result) {
        const sanctionDelted = await User.updateOne(
          { _id: result.user },
          {
            $pull: {
              sanction: ObjectId(req.params.id),
            },
          }
        );
        return res.status(200).send();
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  },

  updateSanction: async (req, res) => {
    await sanction.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ success: true });
  },
  GetAllSanctions: async (req, res) => {
    sanction.find({}, function (err, users) {
      res.json(users);
    });
  },

  GetAllUsers: async (req, res) => {
    User.find({}, function (err, users) {
      res.json(users);
      console.log(users)
    });
  },
  GetUserById: async (req, res) => {
    User.find({ _id: req.params.userid }, (err, user) => {
      res.json(user[0]);
    });
  },
  updatePromotion: async (req, res) => {
    await promotion.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ success: true });
  },

  createPromotion: async (req, res) => {
    try {
      const newProm = new promotion(req.body);
      console.log(req.body);
      const user = await User.findById(req.body.userid);
      console.log(user);
      newProm.user = user;
      await newProm.save();
      user.promotion.push(newProm);
      await user.save();
      let proms = await promotion.find({}).populate("Employee");

      res.send(proms);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },

  createMission: async (req, res) => {
    try {
      const newMission = new mission(req.body);
      console.log(req.body);
      const user = await User.findById(req.body.userid);
      console.log(user);
      newMission.user = user;
      await newMission.save();
      user.mission.push(newMission);
      await user.save();
      let missions = await mission.find({}).populate("Employee");

      res.send(missions);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },
  updateMission: async (req, res) => {
    await mission.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ success: true });
  },

  deleteMission: async (req, res) => {
    try {
      const result = await mission.findOneAndDelete({ _id: req.params.id });
      if (result) {
        const userUpdated = await User.updateOne(
          { _id: result.user },
          {
            $pull: {
              mission: ObjectId(req.params.id),
            },
          }
        );
        return res.status(200).send();
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  },
  createMutualPaper: async (req, res) => {
    try {
      const newPaper = new mutual(req.body);
      console.log(req.body);
      const user = await User.findById(req.body.userid);
      console.log(user);
      newPaper.user = user;
      await newPaper.save();
      user.mutual.push(newPaper);
      await user.save();
      let papers = await mutual.find({}).populate("Employee");

      res.send(papers);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },
  updateMutualPaper: async (req, res) => {
    await mutual.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ success: true });
  },

  deleteMutualPaper: async (req, res) => {
    try {
      const result = await mutual.findOneAndDelete({ _id: req.params.id });
      if (result) {
        const userUpdated = await User.updateOne(
          { _id: result.user },
          {
            $pull: {
              mutual: ObjectId(req.params.id),
            },
          }
        );
        return res.status(200).send();
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  },
  InsertPointage: async(req,res) =>{
    try {
      console.log("insertion")
      const newPointage = new Pointage(req.body);
      console.log(req.body);
      const user = await User.findById(req.body.userid);
      console.log(user);
      newPointage.user = user;
      await newPointage.save();
      user.Pointage.push(newPointage);
      await user.save();
      let p = await Pointage.find({}).populate("Employee");
      console.log("mriguel")
      res.send(p);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },
  updatePointage: async (req, res) => {
    await Pointage.findByIdAndUpdate(req.body.id, req.body);

    res.status(200).json({ success: true });
  },
  GetAllRequests: async (req, res) => {
    await LeaveApplication.find({status : "pending"}, function (err, users) {
      res.status(200).json(users);
      console.log(users)
    });
  },
  updateLeaveRefused: async(req, res) => {
    await LeaveApplication.findByIdAndUpdate(req.query.id, {status : "Refused"});

    res.status(200).json({ success: true });
},
updateLeaveAccepted: async(req, res) => {
  await LeaveApplication.findByIdAndUpdate(req.query.id, {status : "Accepted"});

  res.status(200).json({ success: true });
},

  }

