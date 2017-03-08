var fileUtils = require('../utils/file-utils');

var defaultEncoding = "UTF-8";
var roundsPrize = [];
var availableMembers;

var roundState = "close";
var currentRound = 0;
var membersStake = {};
var roundsChoice = {};

var init = function () {
    availableMembers = new Set(fileUtils.readLines("data/turntable/members", defaultEncoding));
    availableMembers.forEach(function(member){
        membersStake[member] = {}
    });

    fileUtils.readLines("data/turntable/prize", defaultEncoding).forEach(function (roundPrize) {
        roundsPrize.push(roundPrize.split(" "))
    });

    fileUtils.listFiles("data/turntable/rounds").forEach(function (dirName) {
        // 判断当前是第几局
        var round = parseInt(dirName);
        if (round > currentRound) {
            currentRound = round;
        }

        // 获取历史中奖结果
        var choice = fileUtils.readLines(_getRoundDir(round) + "/choice", defaultEncoding);
        if (choice != null) {
            roundsChoice[round] = parseInt(choice[0]);
        }

        // 获取历史投注记录
        var stakeLogs = fileUtils.readLines(_getRoundDir(round) + "/stake", defaultEncoding);
        if (stakeLogs != null) {
            stakeLogs.forEach(function (log) {
                if (log != "") {
                    var fields = log.split(" ");
                    var position = parseInt(fields[1]);
                    if (typeof roundsChoice[round] != 'undefined') {
                        var win = position == roundsChoice[round];
                    }

                    membersStake[fields[0]][round] = {position: position, win: win};
                }
            });
        }
    });

    if (currentRound == 0) {
        createNewRound();
    }
};

var getMemberRoundsStake = function (name) {
    return membersStake[name];
};

var _getRoundDir = function (round) {
    return "data/turntable/rounds/" + (round || currentRound);
};

var getRoundPrize = function () {
    return roundsPrize[currentRound - 1];
};

var isRoundOpen = function () {
    return roundState == "open";
};

var validMember = function (member) {
    return availableMembers.has(member);
};

var getMemberCurrentStake = function (member) {
    return membersStake[member][currentRound];
};

var saveMemberCurrentStake = function (member, position) {
    if (membersStake[member][currentRound]) {
        return false;
    }

    try {
        fileUtils.appendFile(_getRoundDir() + "/stake", member + " " + position + "\r", defaultEncoding);
        membersStake[member][currentRound] = {position: position};
        return true;
    } catch (e) {
        console.log("save member stake failed: " + e);
        return false;
    }
};

var getMembersByPosition = function (position) {
    var members = [];
    for (var member in membersStake) {
        var stake = membersStake[member][currentRound];
        if (stake && stake.position == position) {
            members.push(member);
        }
    }
    return members;
};

var createNewRound = function () {
    currentRound++;
    // 如果当前这一轮没有出结果，接着这一轮进行
    fileUtils.mkdir("data/turntable/rounds/" + currentRound);
};

var openOrCreateRound = function () {
    if (typeof roundsChoice[currentRound] != 'undefined') {
        // 如果当前这一轮有抽奖结果，则新开一轮
        createNewRound();
    }
    roundState = "open";
};

var closeCurrentRound = function () {
    // 关闭下注
    roundState = "close";
};

var getCurrentRound = function () {
    return currentRound;
};

var generateRoundChoice = function () {
    var position = Math.floor(Math.random() * 1000 % 8);
    var choice = {position: position, members: getMembersByPosition(position) || []};
    fileUtils.appendFile(_getRoundDir() + "/generate-log", JSON.stringify(choice)+"\n");
    return choice;
};

var dumpRoundChoice = function (position, members) {
    var choice = position + "\r";
    members.forEach(function (member) {
        choice += member + "\r";
    });
    fileUtils.dumpFile(_getRoundDir() + "/choice", choice, defaultEncoding);

    roundsChoice[currentRound] = position;

    availableMembers.forEach(function(member){
        var stake = membersStake[member][currentRound];
        if (stake) {
            stake.win = stake.position == position;
        } else {
            membersStake[member][currentRound] = {position: -1, win: false};
        }
    });
};

init();

module.exports.getRoundPrize = getRoundPrize;
module.exports.validMember = validMember;
module.exports.isRoundOpen = isRoundOpen;
module.exports.createNewRound = createNewRound;
module.exports.getMemberCurrentStake = getMemberCurrentStake;
module.exports.saveMemberCurrentStake = saveMemberCurrentStake;
module.exports.openOrCreateRound = openOrCreateRound;
module.exports.closeCurrentRound = closeCurrentRound;
module.exports.generateRoundChoice = generateRoundChoice;
module.exports.dumpRoundChoice = dumpRoundChoice;
module.exports.getCurrentRound = getCurrentRound;
module.exports.getMemberRoundsStake = getMemberRoundsStake;