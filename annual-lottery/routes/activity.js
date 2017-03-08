var express = require('express');
var router = express.Router();
var fileUtils = require('../utils/file-utils');

var currentIndex = 0;
var allQuestions = [];
var selectQuestions = function (count) {
    if (currentIndex >= allQuestions.length) {
        allQuestions = fileUtils.readLines("data/activity/questions", "UTF-8");
        allQuestions.sort(function () {
            return 0.5 - Math.random()
        });
        currentIndex = 0;
    }

    var buffer = [];
    for (; currentIndex < allQuestions.length && buffer.length < count; currentIndex++) {
        buffer.push(allQuestions[currentIndex]);
    }

    if (buffer.length < count) {
        // 如果数量不够表示刚刚遍历到了末尾，这时候重新获取一次就行了
        return selectQuestions(count);
    }
    return buffer;
};

router.get('/select-questions/:count', function (req, res, next) {
    var count = parseInt(req.params["count"]);
    res.render('activity/questions', {questions: selectQuestions(count)});
});

module.exports = router;
