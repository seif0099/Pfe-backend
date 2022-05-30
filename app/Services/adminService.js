var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
var ObjectId = require("mongoose").mongo.ObjectID;
var sanction = require("../models/sanctions");
const promotion = require("../models/promotion");
const mission = require("../models/mission");
const mutualPaper = require("../models/mutualPaper");
const Pointage = require("../models/pointage");
const SuppHours = require("../models/suppHours");
const Mutation = require("../models/mutation");
const { GetEvents } = require("./leaveService");
const SSEClient = require("../SSEClient");
const express = require("express");
const Notification = require("../models/notif");
const Demande = require("../models/demande");
const Rapport = require("../models/rapport");
allUsers = function () {
  User.find({}, function (err, users) {
    res.json(users);
    console.log(users);
  });
};

var Encrypt = function (string) {
  var hash = sha512.create();
  hash.update(string);
  var encrypted = hash.hex();
  return encrypted;
};
function updateToken(user) {
  const payload = {
    user: user.user,
  };
  var token = jwt.sign(payload, "kjhkhkjh", {
    expiresIn: "2 days",
  });
  let response = {
    _id: user._id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    username: user.username,
    imageProfile: user.imageProfile,
  };
  return { token: token, response: response };
}
module.exports = {
  Authenticate: async (req, res) => {
    let user = await admin.findOne({
      email: req.body.email,
    });

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
        let response = updateToken(user);

        // return the information including token as JSON
        res.json({
          success: true,
          message: "Enjoy your token!",
          idToken: response.token,
          expiresIn: 1440,
          user: response.response,
        });
      }
    }
  },
  deleteUser: async (req, res) => {
    try {
      console.log(req);
      const user = await User.findOneAndUpdate(
        req.query._id,
        { accountStatus: "disabled" }
      );
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
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "sanction",
        role: "user",
        sanction: newSanction,
      });
      notif.save();
      let sanctions = await sanction
        .find({})
        .populate("Employee");

      res.send(sanctions);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },

  deleteSanction: async (req, res) => {
    try {
      const result = await sanction.findOneAndDelete({
        _id: req.params.id,
      });
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
    await sanction.findByIdAndUpdate(
      req.params.id,
      req.body
    );

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
      console.log(users);
    });
  },
  getPointage: async (req, res) => {
    let p = Pointage.find({}, function (err, users) {
      console.log(p);
      res.json(users);
    });
  },

  GetUserById: async (req, res) => {
    const user = await User.findOne({ _id: req.query.id });
    console.log(user);
    res.status(200).json(user);
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
      user.poste = req.body.newPoste;
      await user.save();
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "promotion",
        role: "user",
        promotion: newProm,
      });
      notif.save();
      let proms = await promotion
        .find({})
        .populate("Employee");

      res
        .status(200)
        .json({ message: "Promotion crée avec succés" });
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },

  createMission: async (req, res) => {
    try {
      let data = req.body;
      data.status = "en cours";
      const newMission = new mission(data);
      const user = await User.findById(req.query.id);
      newMission.user = user;
      await newMission.save();
      user.mission.push(newMission);
      await user.save();
      let missions = await mission
        .find({})
        .populate("Employee");
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "mission",
        role: "user",
        mission: newMission,
      });
      notif.save();
      res.status(200).send(missions);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },
  updateMission: async (req, res) => {
    await mission.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({ success: true });
  },

  deleteMission: async (req, res) => {
    try {
      const result = await mission.findOneAndDelete({
        _id: req.params.id,
      });
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
      let data = req.body;
      data.status = req.body.status;
      const newMutual = new mutualPaper(data);
      const user = await User.findById(req.query.id);
      newMutual.user = user;
      await newMutual.save();
      user.mutualPaper.push(newMutual);
      await user.save();
      let mutualPapers = await mutualPaper
        .find({})
        .populate("Employee");
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "mission",
        role: "user",
        mutualPaper: newMutual,
      });
      notif.save();
      res.status(200).send(mutualPapers);
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
      const result = await mutual.findOneAndDelete({
        _id: req.params.id,
      });
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
  InsertPointage: async (req, res) => {
    try {
      console.log("insertion");
      const newPointage = new Pointage(req.body);
      console.log(req.body);
      const user = await User.findById(req.body.userid);
      user.state = "true";
      newPointage.user = user;
      console.log(user, "aaaaaaaaaaa");
      await newPointage.save();
      user.Pointage.push(newPointage);
      await user.save();
      let p = await Pointage.find({}).populate("Employee");
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
    let result = [];
    let requests = await LeaveApplication.find({
      status: "pending",
    }).populate("user");
    requests.map((row) => {
      let newElement = {};
      newElement._id = row._id;
      newElement.fromDate = row.fromDate;
      newElement.toDate = row.toDate;
      newElement.reasonForLeave = row.reasonForLeave;
      newElement.nom = row.user.nom;
      newElement.prenom = row.user.prenom;
      result.push(newElement);
    });
    res.status(200).json(result);
  },
  updateLeaveRefused: async (req, res) => {
    const leave = await LeaveApplication.findByIdAndUpdate(
      req.query.id,
      { status: "Refused" }
    );
    const user = await User.findById(leave.user._id);

    let leaveId = await LeaveApplication.findById(
      req.query.id
    );
    await Notification.findOneAndDelete({
      leaveApplication: leaveId,
      role: "admin",
    });
    const notif = new Notification({
      user: user,
      status: "not seen",
      type: "leave",
      role: "user",
      leaveApplication: leave,
    });
    notif.save();
    res.status(200).json({ success: true });
  },
  updateLeaveAccepted: async (req, res) => {
    let leave = await LeaveApplication.findByIdAndUpdate(
      req.query.id,
      { status: "Accepted" }
    );
    const user = await User.findById(leave.user._id);
    let leaveId = await LeaveApplication.findById(
      req.query.id
    );
    await Notification.findOneAndDelete({
      leaveApplication: leaveId,
      role: "admin",
    });
    const notif = new Notification({
      user: user,
      status: "not seen",
      type: "leave",
      role: "user",
      leaveApplication: leave,
    });
    res.status(200).json({ success: true });
  },
  getAllHours: async (req, res) => {
    let result = [];
    let suppHours = await SuppHours.find({
      status: "pending",
    }).populate("user");
    suppHours.map((row) => {
      let newElement = {};
      newElement._id = row._id;
      newElement.typeOfWork = row.typeOfWork;
      newElement.fromDate = row.fromDate;
      newElement.toDate = row.toDate;
      newElement.nom = row.user.nom;
      newElement.prenom = row.user.prenom;
      result.push(newElement);
    });
    res.status(200).json(result);
  },
  updateHoursRefused: async (req, res) => {
    await SuppHours.findByIdAndUpdate(req.query.id, {
      status: "Refused",
    });
    let supphours = await SuppHours.findById(req.query.id);
    let user = await User.findById(supphours.user);
    let suppId = await SuppHours.findById(req.query.id);
    await Notification.findOneAndDelete({
      SuppHours: suppId,
      role: "admin",
    });
    const notif = new Notification({
      user: user,
      status: "not seen",
      type: "supphours",
      role: "user",
      SuppHours: supphours,
    });
    notif.save();
    res.status(200).json({ success: true });
  },
  updateHoursAccepted: async (req, res) => {
    await SuppHours.findByIdAndUpdate(req.query.id, {
      status: "Accepted",
    });
    let supphours = await SuppHours.findById(req.query.id);
    let user = await User.findById(supphours.user);
    let suppId = await SuppHours.findById(req.query.id);
    await Notification.findOneAndDelete({
      SuppHours: suppId,
      role: "admin",
    });
    const notif = new Notification({
      user: user,
      status: "not seen",
      type: "supphours",
      role: "user",
      SuppHours: supphours,
    });
    notif.save();
    res.status(200).json({ success: true });
  },

  createMutation: async (req, res) => {
    try {
      console.log(req.body.userid);
      const user = await User.findById(req.body.userid);
      let data = req.body;
      data.from = user.service;
      data.status = "pending";
      console.log(data);
      const newMut = new Mutation(data);
      newMut.user = user;
      await newMut.save();
      user.Mutation.push(newMut);
      await user.save();
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "mutation",
        role: "admin",
        Mutation: newMut,
      });
      notif.save();
      res.status(200).json({ success: "true" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: "false" });
    }
  },
  getMutations: async (req, res) => {
    let result = await Mutation.find({
      status: "pending",
    }).populate("user");
    console.log(result);
    res.status(200).send({ result: result });
  },
  getAllMissions: async (req, res) => {
    try {
      let missions = await mission.find().populate("user");
      console.log(missions);
      res.status(200).json(missions);
    } catch (e) {
      res.status(500).send({ success: "false" });
    }
  },
  updateMutation: async (req, res) => {
    try {
      console.log(req.query);
      await Mutation.findByIdAndUpdate(req.query.id, {
        status: req.query.status,
      });
      let mutation = await Mutation.findById(req.query.id);
      let mutationId = await Mutation.findById(
        req.query.id
      );
      await Notification.findOneAndDelete({
        Mutation: mutationId,
        role: "admin",
      });
      let user = await User.findById(mutation.user);
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "mutation",
        role: "user",
        Mutation: mutation,
      });
      notif.save();

      res.status(200).send({ success: "true" });
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: "false" });
    }
  },
  getAdminNotifications: async (req, res) => {
    try {
      let notifs = await Notification.find({
        role: "admin",
        status: "not seen",
      });
      res.status(200).send({ notifs: notifs });
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: "false" });
    }
  },
  getDemandesAdministrative: async (req, res) => {
    try {
      let demandes = await Demande.find().populate("user");
      res.status(200).send({ demandes: demandes });
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: "false" });
    }
  },
  updateProfilePic: async (req, res) => {
    const SECRET = "securep4ssword";
    const path = require("path");
    const multer = require("multer");

    const storage = multer.diskStorage({
      destination: "./public/uploads/",
      filename: function (req, file, cb) {
        cb(
          null,
          "IMAGE-" +
            Date.now() +
            path.extname(file.originalname)
        );
      },
    });

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 },
    }).single("myImage");
    upload(req, res, async function () {
      let filename = req.file.filename;
      const result = await admin.findByIdAndUpdate(
        req.query.id,
        { imageProfile: filename }
      );
      let user = await admin.findById(req.query.id);
      let response = updateToken(user);
      res.status(200).json({
        success: true,
        idToken: response.token,
        expiresIn: 1440,
        user: response.response,
      });
    });
  },
  updateAdmin: async (req, res) => {
    const SECRET = "securep4ssword";
    let data = req.body;
    if (data.password != "") {
      data.password = Encrypt(data.password);
    }
    Object.keys(data).forEach(
      (k) => data[k] == "" && delete data[k]
    );
    await admin.findByIdAndUpdate(req.body.userid, data);
    let user = await admin.findById(req.body.userid);
    let response = updateToken(user);
    res.status(200).json({
      success: true,
      idToken: response.token,
      expiresIn: 1440,
      user: response.response,
    });
  },

  getAllRapports: async (req, res) => {
    let rapports = await Rapport.find(req.query).populate(
      "user"
    );

    res.status(200).json({ rapport: rapports });
  },
};
