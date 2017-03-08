var express = require('express');
var encryptUtils = require('../utils/encrypt-utils.js');
var router = express.Router();
var fileUtils = require('../utils/file-utils');

if (fileUtils.exists("data/admin-token")) {
    global.admin = fileUtils.read("data/admin-token", "UTF-8");
}

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!global.admin) {
        var token = encryptUtils.guid();
        res.cookie("admin-token", token, {maxAge: 1000000000, httpOnly: true, path: '/'});
        global.admin = token;
        fileUtils.dumpFile("data/admin-token", token, "UTF-8");

        res.redirect("public/big-screen.html");
    }

    res.json({retCode: -1, retMsg: "admin has registered."});
});

module.exports = router;
