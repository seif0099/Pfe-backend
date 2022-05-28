var User = require("../models/employee");
var LeaveApplication = require("../models/leave");
const path = require("path");
const multer = require("multer");
var admin = require("../models/admin");
var jwt = require("jsonwebtoken");
var sha512 = require("js-sha512");
const SSEClient = require("../SSEClient");
const Notification = require("../models/notif");
var ObjectId = require("mongoose").mongo.ObjectID;

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

var Encrypt = function (string) {
  var hash = sha512.create();
  hash.update(string);
  var encrypted = hash.hex();
  return encrypted;
};

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
  },
});

module.exports = {
  requestLeave: async (req, res) => {
    try {
      const upload = multer({
        storage: storage,
        limits: { fileSize: 1000000 },
        onError: function (err, next) {
          console.log("error", err);
          next(err);
        },
      }).single("myImage");

      //

      upload(req, res, async function () {
        try {
          const newLeave = new LeaveApplication(JSON.parse(req.body.data));

          const user = await User.findById(req.body.userId);
          let filename = req.file.filename;
          newLeave.user = user;
          newLeave.status = "pending";
          newLeave.certificat = filename;
          await newLeave.save();
          user.leaveApplication.push(newLeave);
          await user.save();
          const notif = new Notification({
            user: user,
            status: "not seen",
            type: "leave",
            role: "admin",
            leaveApplication: newLeave,
          });
          notif.save();

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
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: "false" });
    }
  },

  deleteLeave: async (req, res) => {
    try {
      const result = await LeaveApplication.findOneAndDelete({ _id: req.query.id });
      if (result) {
        const userUpdated = await User.updateOne(
          { _id: result.user },
          {
            $pull: {
              leaveApplication: ObjectId(req.query.id),
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

  updateLeave: async (req, res) => {
    result = await LeaveApplication.findByIdAndUpdate(req.query.id, req.body);
    console.log(req.body);
    res.status(200).json({ success: true });
  },
  GetRequestById: async (req, res) => {
    console.log(req.query.id);
    const user = await User.findById(req.query.id);
    const leaves = await LeaveApplication.find({ user: user });
    const result = [];
    leaves.map((row) => {
      let newRow = {};
      newRow._id = row._id;
      newRow.fromDate = row.fromDate;
      newRow.toDate = row.toDate;
      newRow.nom = user.nom;
      newRow.prenom = user.prenom;
      newRow.status = row.status;
      newRow.reasonForLeave = row.reasonForLeave;
      result.push(newRow);
    });
    res.status(200).send(result);
  },
  GetEvents: async (req, res) => {
    const client = new SSEClient(res);
    client.initialize();
    setTimeout(() => {
      client.send({ id: Date.now(), type: "message", data: "hello" });
    }, 5000);
  },
};
