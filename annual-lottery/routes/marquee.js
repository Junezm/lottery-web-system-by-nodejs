var express = require('express');
var marqueeService = require("../service/marquee-service");

var router = express.Router();

router.get('/s-members', function (req, res, next) {
    var members = [];
    var idNames = marqueeService.getMembers();
    for(var id in idNames){
        members.push({id: id, name: idNames[id], choice: marqueeService.getMemberChoiceRound(id)});
    }

    res.json({retCode: 0, retMsg: "", members: members});
});

router.get('/s-generate-choices', function (req, res, next) {
    res.json({retCode: 0, retMsg: "", choices: marqueeService.choiceMembersRandomly()});
});

router.post('/s-dump-choices', function (req, res, next) {
    var choiceMembers = req.body["members"];
    try {
        marqueeService.saveRoundChoice(choiceMembers.split(","));
    } catch (err) {
        res.json({retCode: -9, retMsg: err});
        return;
    }
    res.json({retCode: 0, retMsg: ""});
});

module.exports = router;
