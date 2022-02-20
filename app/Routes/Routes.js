'use strict';

const UserServices = require('../Services/UserServices');
const leaveServices = require('../Services/leaveService');
const adminService = require('../Services/adminService');



module.exports = (app, apiRoutes) => {
    var Uservice = require('../Services/UserServices');
    //default route
    app.get('/', (req, res) => {
        res.send('server working..');

    });
    // todoList Routes 
    app.route('/Authenticate').post(Uservice.Authenticate);
    app.route('/register').post(Uservice.SignIn);
    app.route('/leave').post(leaveServices.requestLeave);
    app.route('/users').get(UserServices.GetAllUsers);
    app.route('/users/:userid').get(UserServices.GetUserById);
    app.route('/deleteleave/:id').delete(leaveServices.deleteLeave);
    app.route('/leaveupdated/:id').put(leaveServices.updateLeave);
    app.route('/userdeleted/:id').delete(UserServices.deleteUser);
    app.route('/adminDeleteUser/:id').delete(adminService.deleteUser);
    app.route('/logout').get(UserServices.logout);
    app.route('/addsanction').post(adminService.addSanction);

    app.route('/deletesanction/:id').delete(adminService.deleteSanction);
    //apiRoutes.route('/users').get(Uservice.GetAllUsers);
}