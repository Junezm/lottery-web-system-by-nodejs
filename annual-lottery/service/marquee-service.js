var fileUtils = require('../utils/file-utils');
var collectionUtils = require('../utils/collection-utils');

var defaultEncoding = "UTF-8";

var allMembers = {};
var roundsChoiceCounts = [];
var currentRound = 0;
var membersChoiceRound = {};
var candidateMembers = [];

var init = function () {
    fileUtils.readLines("data/marquee/members", defaultEncoding).forEach(function (line) {
        line = line.replace(/(^\s*)|(\s*$)/g, ""); //trim
        var idName = line.split(" ");
        if (idName.length == 2) {
            allMembers[idName[0]] = idName[1];
        } else if (/\d{1,3}/.test(line)) {
            allMembers[idName[0]] = "";
            membersChoiceRound[idName[0]] = 99;
        } else {
            throw Error("bad format member list on line: " + line);
        }
    });

    fileUtils.readLines("data/marquee/counts", defaultEncoding).forEach(function (roundName) {
        roundsChoiceCounts.push(parseInt(roundName));
        roundsChoiceCounts.sort(function (a, b) {
            return b - a
        });
    });

    fileUtils.listFiles("data/marquee/rounds/", defaultEncoding).forEach(function (roundName) {
        currentRound = parseInt(roundName);

        // 如果只有文件夹没有choice文件，表示这一轮没有抽出结果
        if (!fileUtils.exists("data/marquee/rounds/" + roundName + "/choice")) {
            return false;
        }
        fileUtils.readLines("data/marquee/rounds/" + roundName + "/choice", defaultEncoding).forEach(function (member) {
            membersChoiceRound[member] = currentRound;
        });
    });

    // 如果rounds文件夹为空，需要显式启动第一轮；
    // 如果rounds文件夹不为空，一定会定位到一个没有choice文件的目录中
    if (currentRound == 0) {
        openNewRound();
    }

    // 根据历史中奖记录初始化继续抽奖的人
    candidateMembers = generateCandidateMembers();
};

var _getCurrentRoundDir = function () {
    return "data/marquee/rounds/" + currentRound;
};

var generateCandidateMembers = function () {
    var members = [];
    for (var id in allMembers) {
        if (typeof membersChoiceRound[id] == 'undefined') {
            members.push(id);
        }
    }
    return members;
};

var choiceMembersRandomly = function () {
    if (currentRound > roundsChoiceCounts.length) {
        return [];
    }

    var randomChoices = collectionUtils.selectRandom(candidateMembers, roundsChoiceCounts[currentRound - 1]);
    fileUtils.appendFile(_getCurrentRoundDir() + "/generate-logs", randomChoices.join(" ") + "\r", defaultEncoding);
    return randomChoices;
};

var getMemberChoiceRound = function (id) {
    return membersChoiceRound[id];
};

var getMembers = function () {
    return allMembers;
};

var openNewRound = function () {
    currentRound++;
    fileUtils.mkdir("data/marquee/rounds/" + currentRound);
};

var saveRoundChoice = function (ids) {
    if (ids.length == 0) {
        throw new Error("members could not be empty.");
    }

    // 记录日志
    fileUtils.dumpFile(_getCurrentRoundDir() + "/choice", ids.join("\r"), defaultEncoding);

    // 更新本地变量
    ids.forEach(function (id) {
        membersChoiceRound[id] = currentRound;
    });
    candidateMembers = generateCandidateMembers();

    openNewRound();
    return true;
};

init();

module.exports.getMemberChoiceRound = getMemberChoiceRound;
module.exports.getMembers = getMembers;
module.exports.saveRoundChoice = saveRoundChoice;
module.exports.choiceMembersRandomly = choiceMembersRandomly;