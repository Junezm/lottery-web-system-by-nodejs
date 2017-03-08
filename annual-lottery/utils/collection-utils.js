/**
 * Created by zhangnongfei on 2017/1/12.
 */
var selectRandom = function (array, count) {
    array = array.slice(0);
    if (count.length >= array.length) {
        return array;
    }

    var candidates = [];
    while (candidates.length < count) {
        var upper = array.length - candidates.length - 1;
        var chooseIndex = Math.floor(Math.random() * upper);
        candidates.push(array[chooseIndex]);

        var tmp = array[upper];
        array[upper] = array[chooseIndex];
        array[chooseIndex] = tmp;
    }
    return candidates;
};

module.exports.selectRandom = selectRandom;