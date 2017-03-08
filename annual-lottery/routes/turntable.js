var express = require('express');
var turntableService = require("../service/turntable-service");
var router = express.Router();

router.get('/prize', function (req, res, next) {
    res.json({
        retCode: 0,
        retMsg: "",
        round: turntableService.getCurrentRound(),
        prize: turntableService.getRoundPrize()
    });
});

router.post('/stake', function (req, res, next) {
    if (!turntableService.isRoundOpen()) {
        res.json({retCode: -1, retMsg: "staking for current round is closing."});
        return;
    }

    var name = req.body["name"].toUpperCase();
    if (!turntableService.validMember(name)) {
        res.json({retCode: -100, retMsg: "not valid code."});
        return;
    }

    var position = req.body["position"];
    if (!position || !/[0-7]/.test(position)) {
        res.json({retCode: -2, retMsg: "please choice a position"});
        return;
    }

    res.cookie("name", name, {maxAge: 100000000, httpOnly: true, path: '/'});
    if (turntableService.saveMemberCurrentStake(name, parseInt(position))) {
        res.json({retCode: 0, retMsg: ""});
    } else {
        res.json({retCode: -3, retMsg: "stake for member has done."});
    }
});

router.get('/stake', function (req, res, next) {
    // 如果参数中没有，就从cookie中取
    var name = req.query["name"] || req.cookies["name"];
    if (name) {
        name = name.toUpperCase();
        var position = undefined;
        var stake = turntableService.getMemberCurrentStake(name);
        if (stake) {
            position = stake.position;
        }
    }
    var history = turntableService.getMemberRoundsStake(name || "NOBODY");
    res.json({retCode: 0, retMsg: "", name: name, position: position, history: history});
});

router.get('/s-round-open', function (req, res, next) {
    turntableService.openOrCreateRound();
    res.json({retCode: 0, retMsg: ""});
});

router.get('/s-generate-round-choice', function (req, res, next) {
    turntableService.closeCurrentRound();
    res.json({retCode: 0, retMsg: "", choice: turntableService.generateRoundChoice()});
});

router.post('/s-dump-round-choice', function (req, res, next) {
    turntableService.dumpRoundChoice(parseInt(req.body["position"]), req.body["members"].split(","));
    res.json({retCode: 0, retMsg: ""});
});

module.exports = router;
