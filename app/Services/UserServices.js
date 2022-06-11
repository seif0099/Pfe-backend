var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
const SuppHours = require("../models/suppHours");
const mission = require("../models/mission");
const Rapport = require("../models/rapport");
const Pointage = require("../models/pointage");
const Notification = require("../models/notif");
const Mutation = require("../models/mutation");
const Demande = require("../models/demande");
const mutualPaper = require("../models/mutualPaper");

var ObjectId = require("mongoose").mongo.ObjectID;

/* costum methods  */

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
    sitFam: user.sitFam,
    adresse: user.adresse,
    tel: user.tel,
    imageProfile: user.imageProfile,
    service: user.service,
    poste: user.poste,
  };
  return { token: token, response: response };
}
module.exports = {
  SignIn: async (req, res) => {
    let user = await User.findOne({
      matricule: req.body.matricule,
    });

    if (!user) {
      res.json({
        success: false,
        message:
          "Authentication failed. Matricule not found.",
      });
    } else {
      if (Encrypt(req.body.password) != user.password) {
        res.json({
          success: false,
          message: "Authentication failed. Wrong password.",
        });
      } else {
        if (user.accountStatus === "disabled") {
          res.json({
            success: false,
            message:
              "Authentication failed. Account disabled.",
          });
        } else {
          let response = updateToken(user);
          // return the information including token as JSON
          res.json({
            success: true,
            idToken: response.token,
            expiresIn: 1440,
            user: response.response,
          });
        }
      }
    }
  },

  SignUp: async (req, res) => {
    try {
      let account = await User.findOne({
        email: req.body.email,
      });

      let data = req.body;
      data.password = Encrypt(req.body.password);
      data.accountStatus = "enabled";
      data.imageProfile = "avatar.png";
      data.state = "false";
      var newUser = new User(data);

      await newUser.save();
      return res.status(200).json({ success: true });
    } catch (conflictError) {
      return res
        .status(409)
        .json({ error: "Ce compte existe déja" });
    }
  },

  UpdateUser: async (req, res) => {
    const SECRET = "securep4ssword";
    let data = req.body;
    if (data.password != "") {
      data.password = Encrypt(data.password);
    }
    Object.keys(data).forEach(
      (k) => data[k] == "" && delete data[k]
    );
    await User.findByIdAndUpdate(req.body.userid, data);
    let user = await User.findById(req.body.userid);
    let response = updateToken(user);
    // return the information including token as JSON
    res.status(200).json({
      success: true,
      idToken: response.token,
      expiresIn: 1440,
      user: response.response,
    });
  },

  logout: function (req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/"); //Inside a callback… bulletproof!
    });
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
      const result = await User.findByIdAndUpdate(
        req.query.id,
        { imageProfile: filename }
      );
      let user = await User.findById(req.query.id);
      let response = updateToken(user);
      res.status(200).json({
        success: true,
        idToken: response.token,
        expiresIn: 1440,
        user: response.response,
      });
    });
  },

  updateCertificat: async (req, res) => {
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
      onError: function (err, next) {
        console.log("error", err);
        next(err);
      },
    }).single("myImage");

    upload(req, res, async function () {
      try {
        let filename = req.file.filename;
        const result =
          await LeaveApplication.findByIdAndUpdate(
            req.query.id,
            { certificat: filename }
          );
        let user = await User.findById(req.query.id);
        let response = updateToken(user);
        res.status(200).json({
          success: true,
          idToken: response.token,
          expiresIn: 1440,
          user: response.response,
        });
      } catch (err) {
        throw err;
      }
    });
  },

  deleteUser: async (req, res) => {
    try {
      const result = await User.findOneAndDelete({
        _id: req.params.id,
      });

      return res.status(200).send();
    } catch (error) {
      res.status(500).send({ error });
    }
  },
  requestSuppHours: async (req, res) => {
    try {
      let data = {
        typeOfWork: req.body.typeOfWork,
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        date: req.body.date,
      };
      const newReq = new SuppHours(data);
      const user = await User.findById(req.body.userid);
      newReq.user = user;
      newReq.status = "pending";
      await newReq.save();
      user.SuppHours.push(newReq);
      await user.save();
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "supphours",
        role: "admin",
        SuppHours: newReq,
      });
      notif.save();
      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: "false" });
    }
  },

  deleteReqHours: async (req, res) => {
    try {
      const result = await SuppHours.findOneAndDelete({
        _id: req.query.id,
      });
      if (result) {
        const userUpdated = await User.updateOne(
          { _id: result.user },
          {
            $pull: {
              SuppHours: ObjectId(req.query.id),
              status: "Refused",
            },
          }
        );
        return res.status(200).send();
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  },

  updateReqHours: async (req, res) => {
    await SuppHours.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.status(200).json({ success: true });
  },

  requestRapport: async (req, res) => {
    try {
      const newRapp = new Rapport(req.body);
      const user = await User.findById(req.query.id);

      newRapp.user = user;
      await newRapp.save();
      user.rapport.push(newRapp);
      await user.save();
      const notifAdmin = new Notification({
        user: user,
        status: "not seen",
        type: "accident",
        role: "admin",
        rapport: newRapp,
      });
      notifAdmin.save();
      let rapp = await Rapport.find({}).populate(
        "Employee"
      );

      res.send(rapp);
    } catch (error) {
      console.log(error);
      res.send("err");
    }
  },

  getPointage: async (req, res) => {
    const mDate = new Date(req.query.pDate);
    const userId = req.query.userId;
    const myUser = await User.findById(userId);
    try {
      const pointages = await Pointage.aggregate([
        {
          $addFields: {
            month: { $month: "$pDate" },
            year: { $year: "$pDate" },
            day: { $dayOfMonth: "$pDate" },
          },
        },
      ]);
      mDate.setMonth(mDate.getMonth() + 1);

      const leaves = await LeaveApplication.aggregate([
        {
          $addFields: {
            monthF: { $month: "$fromDate" },
            yearF: { $year: "$fromDate" },
            dayF: { $dayOfMonth: "$fromDate" },
            monthT: { $month: "$toDate" },
            yearT: { $year: "$toDate" },
            dayT: { $dayOfMonth: "$toDate" },
          },
        },
      ]);
      let pMonth = mDate.getMonth();
      let pYear = mDate.getFullYear();
      console.log(leaves);
      const leavesResult = leaves.filter(
        (a) =>
          ((a.monthF == pMonth && a.yearF == pYear) ||
            (a.monthT == pMonth && a.yearT == pYear)) &&
          a.user == userId &&
          a.status === "Accepted"
      );
      const pointageResult = pointages.filter(
        (a) =>
          a.month == pMonth &&
          a.user == userId &&
          a.year == pYear
      );
      res.status(200).send({
        pointage: pointageResult,
        leave: leavesResult,
      });
    } catch (error) {
      res.send({ error: error });
    }
  },
  GetNotifications: async (req, res) => {
    const user = await User.findById(req.query.id);
    const notifs = await Notification.find({
      user: user,
      status: "not seen",
      role: "user",
    })
      .populate("promotion")
      .populate("sanction");
    res.status(200).send({ notifs: notifs });
  },

  GetMutationById: async (req, res) => {
    console.log(req.query.id);
    const user = await User.findById(req.query.id);
    const mutation = await Mutation.find({ user: user });
    const result = [];
    mutation.map((row) => {
      let newRow = {};
      newRow._id = row._id;
      newRow.to = row.to;
      newRow.from = row.from;
      newRow.nom = user.nom;
      newRow.prenom = user.prenom;
      newRow.status = row.status;
      newRow.reasonForMutation = row.reasonForMutation;
      result.push(newRow);
    });
    res.status(200).send(result);
  },

  deleteMutation: async (req, res) => {
    try {
      const result = await Mutation.findOneAndDelete({
        _id: req.query.id,
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
        res.status(200).send({ success: "true" });
      }
    } catch (e) {
      res.status(500).send({ success: "false" });
    }
  },
  updateMutation: async (req, res) => {
    try {
      const mutation = await Mutation.findByIdAndUpdate(
        req.query.id,
        req.body
      );
      res.status(200).send({ success: "true" });
    } catch (e) {
      res.status(500).send({ success: "false" });
    }
  },
  getMissions: async (req, res) => {
    try {
      let user = await User.findById(req.query.id);
      let missions = await mission.find({ user: user });
      res.status(200).json(missions);
    } catch (e) {
      res.status(500).send({ success: "false" });
    }
  },
  submitReport: async (req, res) => {
    try {
      let data = req.body;
      data.status = "terminée";
      data.dateValidation = new Date();
      let missions = await mission.findByIdAndUpdate(
        req.query.id,
        data
      );
      let m = await mission.findById(req.query.id);
      let user = await User.findById(mission.user);
      let notif = await Notification.findOneAndUpdate(
        { mission: missions },
        { status: "seen" }
      );
      const notifAdmin = new Notification({
        user: user,
        status: "not seen",
        type: "mission",
        role: "admin",
        mission: m,
      });
      notifAdmin.save();
      res.status(200).json({ success: "true" });
    } catch (e) {
      console.log(e);
      res.status(500).send({ success: "false" });
    }
  },

  requestDemande: async (req, res) => {
    try {
      console.log(req.body);
      let data = {
        sujet: req.body.sujet,
      };
      const newReq = new Demande(data);
      const user = await User.findById(req.body.userid);
      newReq.user = user;
      await newReq.save();
      user.demande.push(newReq);
      await user.save();
      const notif = new Notification({
        user: user,
        status: "not seen",
        type: "demande",
        role: "admin",
        demande: newReq,
      });
      notif.save();
      res.status(200).json({ success: "true" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: "false" });
    }
  },

  GetReqHoursById: async (req, res) => {
    console.log(req.query.id);
    const user = await User.findById(req.query.id);
    const leaves = await SuppHours.find({ user: user });
    const result = [];
    leaves.map((row) => {
      let newRow = {};
      newRow._id = row._id;
      newRow.fromDate = row.fromDate;
      newRow.toDate = row.toDate;
      newRow.nom = user.nom;
      newRow.prenom = user.prenom;
      newRow.status = row.status;
      newRow.date = row.date;

      newRow.typeOfWork = row.typeOfWork;
      result.push(newRow);
    });
    res.status(200).send(result);
  },
  markAsSeen: async (req, res) => {
    try {
      await Notification.findByIdAndUpdate(req.query.id, {
        status: "seen",
      });
      res.status(200).send({ success: "true" });
    } catch (e) {
      res.status(500).send({ success: "false" });
    }
  },
  GetMutualById: async (req, res) => {
    console.log(req.query.id);
    const user = await User.findById(req.query.id);
    const leaves = await mutualPaper.find({ user: user });
    const result = [];
    leaves.map((row) => {
      let newRow = {};
      newRow._id = row._id;
      newRow.status = row.status;
      newRow.numPaper = row.numPaper;

      result.push(newRow);
    });
    res.status(200).send(result);
  },
};
