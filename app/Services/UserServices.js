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
        let user = await User.findOne({ email: req.body.email });
           
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
                if(user.accountStatus === "disabled"){
                    res.json({
                      success: false,
                      message: "Authentication failed. Account disabled.",
                  });
                  }
                  else {
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
        }
    },

    SignIn: async (req, res) => {
        try {
            let account = await User.findOne({email: req.body.email})
            if(account){
                throw conflictError
            }
            let data = req.body
            data.password= Encrypt(req.body.password)
            data.accountStatus = "enabled"
            data.imageProfile = "avatar.png"
            var newUser = new User(data);

            newUser.save(function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.json({ data });
                }
            });
            res.status(200).json({success: true})
        }
        catch(conflictError) {
            res.status(409).json({error: "Ce compte existe déja"})
        }
    },


    UpdateUser: async(req, res) => {
        let data = req.body
        if(data.password!=""){
            data.password = Encrypt(data.password)
        }
        Object.keys(data).forEach((k) => data[k] == '' && delete data[k]);
        await User.findByIdAndUpdate(req.body.userid, data);
        
        res.status(200).json({ success: true });
    },



    logout: function(req, res) {
        req.session.destroy(() => {
            req.logout();
            res.redirect("/"); //Inside a callback… bulletproof!
        });
    },

    updateProfilePic: async (req, res) => {
        const path = require("path");
        const multer = require("multer");
        

        const storage = multer.diskStorage({
        destination: "./public/uploads/",
        filename: function(req, file, cb){
            cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
        }
        });

        const upload =  multer({
        storage: storage,
        limits:{fileSize: 1000000},
        }).single("myImage");
        upload(req, res, async function(){
            let filename = req.file.filename;
            const result = await User.findByIdAndUpdate(req.query.id,{imageProfile : filename});
            return res.send(200).end();
        });
        

    },


    deleteUser: async(req, res) => {

        try {
            const result = await User.findOneAndDelete({ '_id': req.params.id });

            return res.status(200).send()



        } catch (error) {

            res.status(500).send({ error })
        }

    },
    requestSuppHours: async(req, res) => {

        try {
            const newReq = new SuppHours(req.body);
            const user = await User.findById(req.body.userid);
            newReq.user = user;
            newReq.status = "pending"
            await newReq.save();
            user.SuppHours.push(newReq);
            await user.save();
            let hours = await SuppHours.find({}).populate('Employee');

            res.send(hours)
        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },

    deleteReqHours: async(req, res) => {

        try {
            const result = await SuppHours.findOneAndDelete({ '_id': req.params.id });
            if (result) {
                const userUpdated = await User.updateOne({ '_id': result.user }, {
                    $pull: {
                        SuppHours: ObjectId(req.params.id)
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

    updateReqHours: async(req, res) => {
        await SuppHours.findByIdAndUpdate(req.params.id, req.body);

        res.status(200).json({ success: true });
    },

  

    requestRapport: async(req, res) => {

        try {
            const newRapp = new Rapport(req.body);
            const user = await User.findById(req.body.userid);
            newRapp.user = user;
            await newRapp.save();
            user.Rapport.push(newRapp);
            await user.save();
            let rapp = await Rapport.find({}).populate('Employee');

            res.send(rapp)
        } catch (error) {
            console.log(error);
            res.send("err");
        }
    },

    getPointage: async(req,res) => {
        const mDate = new Date(req.query.pDate)
        const userId = req.query.userId;
        const myUser = await User.findById(userId);
        try {
            const pointages = await Pointage.aggregate(
                [{
                    $addFields: {  
                        "month" : {$month: '$pDate'},
                        "year" : {$year: '$pDate'},
                        "day": {$dayOfMonth: '$pDate'}
                    },
                    
                }]
            )
            mDate.setMonth(mDate.getMonth()+1);
            
            const leaves = await LeaveApplication.aggregate(
                [{
                    $addFields: {  
                        "monthF" : {$month: '$fromDate'},
                        "yearF" : {$year: '$fromDate'},
                        "dayF": {$dayOfMonth: '$fromDate'},
                        "monthT" : {$month: '$toDate'},
                        "yearT" : {$year: '$toDate'},
                        "dayT": {$dayOfMonth: '$toDate'}
                    },
                    
                }]
            )
            let pMonth = mDate.getMonth()
            let pYear = mDate.getFullYear()
            console.log(leaves)
            const leavesResult = leaves.filter(a => ((((a.monthF == pMonth) && (a.yearF == pYear))|| ((a.monthT == pMonth)&&(a.yearT == pYear))) && a.user == userId && a.status === "Accepted"))
            const pointageResult = pointages.filter(a => (a.month == pMonth && a.user == userId && a.year == pYear));
            console.log("poi", pointages)
            res.status(200).send({pointage: pointageResult, leave: leavesResult});
        }
        catch(error){
            res.send({"error": error})
        }
    },
    GetNotifications: async(req, res) => {
        const user = await User.findById(req.query.id);
        const notifs = await Notification.find({user: user, status: "not seen"})
        res.status(200).send({notifs: notifs})
    },
    GetMutationById: async (req, res) => {
        console.log(req.query.id)
        const user = await User.findById(req.query.id);
        const mutation = await Mutation.find({user: user})
        const result = []
        mutation.map(
            row => {
                let newRow = {}
                newRow._id = row._id
                newRow.to = row.to
                newRow.nom = user.nom
                newRow.prenom = user.prenom
                newRow.status = row.status
                newRow.reasonForMutation = row.reasonForMutation
                result.push(newRow)
            }
        )
        res.status(200).send(result);
      }



}