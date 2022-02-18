'use strict';

const UserServices = require('../Services/UserServices');

module.exports = (app, apiRoutes) => {
    var Uservice = require('../Services/UserServices');
    //default route
    app.get('/', (req, res) => {
        res.send('server working..');

    });
    // todoList Routes 
    app.route('/Authenticate').post(Uservice.Authenticate);
    app.route('/register').post(Uservice.SignIn);
    app.route('/leave/:id').post(Uservice.requestLeave);
    app.route('/users').get(UserServices.GetAllUsers);
    app.route('/users/:userid').get(UserServices.GetUserById);
    app.route('/leave/:id').delete(UserServices.deleteLeave);
    //apiRoutes.route('/users').get(Uservice.GetAllUsers);
}