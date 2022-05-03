"use strict";

const UserServices = require("../Services/UserServices");
const leaveServices = require("../Services/leaveService");
const adminService = require("../Services/adminService");

module.exports = (app, apiRoutes) => {
  var Uservice = require("../Services/UserServices");
  //default route
  app.get("/", (req, res) => {
    res.send("server working..");
  });
  // todoList Routes
  app.route("/Authenticate").post(Uservice.SignIn);
  app.route("/register").post(Uservice.SignUp);
  app.route("/userdeleted/:id").delete(UserServices.deleteUser);
  app.route("/logout").get(UserServices.logout);
  app.route("/requestSuppHours").post(Uservice.requestSuppHours);
  app.route("/userupdated").post(UserServices.UpdateUser);
  app.route("/updateImage").post(UserServices.updateProfilePic);

  app.route("/requestrapport").post(UserServices.requestRapport);
  app.route("/getpointage").get(UserServices.getPointage)


  app.route("/getmutation").get(UserServices.GetMutationById);


  app.route("/leaveupdated").put(leaveServices.updateLeave);
  app.route("/deleteleave").delete(leaveServices.deleteLeave);
  app.route("/requestleave").post(leaveServices.requestLeave);
  app.route("/getrequest").get(leaveServices.GetRequestById);
  app.route("/getNotifications").get(UserServices.GetNotifications);
  app.route("/deletereqhours").delete(UserServices.deleteReqHours);
  app.route("/getreqhours").get(UserServices.GetReqHoursById);





  app.route("/users").get(adminService.GetAllUsers);
  app.route("/getuserbyid").get(adminService.GetUserById);
  app.route("/adminDeleteUser").delete(adminService.deleteUser);
  app.route("/addsanction").post(adminService.addSanction);
  app.route("/deletesanction/:id").delete(adminService.deleteSanction);
  app.route("/updatesanction/:id").put(adminService.updateSanction);
  app.route("/getsanction/:id").get(adminService.GetAllSanctions);
  app.route("/createprom").post(adminService.createPromotion);

  app.route("/createmission").post(adminService.createMission);
  app.route("/updatemission/:id").put(adminService.updateMission);
  app.route("/deletesmission/:id").delete(adminService.deleteMission);

  app.route("/createMutualPaper").post(adminService.createMission);
  app.route("/updateMutualPaper/:id").put(adminService.updateMission);
  app.route("/deletesMutualPaper/:id").delete(adminService.deleteMission);

  app.route("/adminPointage").post(adminService.InsertPointage);
  app.route("/admin-signin").post(adminService.Authenticate);

  app.route("/adminRequests").get(adminService.GetAllRequests);
  app.route("/getallmissions").get(adminService.getAllMissions);

  app.route("/adminRequestsRefuse").put(adminService.updateLeaveRefused);
  app.route("/adminRequestsAccept").put(adminService.updateLeaveAccepted);

  app.route("/adminSuppHours").get(adminService.getAllHours);
  app.route("/adminSuppHoursRefuse").put(adminService.updateHoursRefused);
  app.route("/adminSuppHoursAccept").put(adminService.updateHoursAccepted);
  app.route("/demandeMutation").post(adminService.createMutation);
  app.route("/deletesMutation").put(UserServices.deleteMutation);
  app.route("/mutationUpdated").put(UserServices.updateMutation);
  app.route("/getmissions").get(UserServices.getMissions);
  app.route("/submitreport").put(UserServices.submitReport);
  app.route("/getmutations").get(adminService.getMutations);
  app.route("/demandeAdministrative").post(UserServices.requestDemande);

  

  app.route("/updatemutation").put(adminService.updateMutation);
  app.route("/getAdminNotifications").get(adminService.getAdminNotifications);

};
