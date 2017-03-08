var fs = require('fs');
var pathUtils = require('./path-utils');

var exists = function (file) {
    return fs.existsSync(pathUtils.normalizePath(file));
};

var mkdir = function(dir){
    return fs.mkdirSync(pathUtils.normalizePath(dir));
};

var read = function (file, encoding) {
    file = pathUtils.normalizePath(file);
    if (!fs.existsSync(file)) {
        return null;
    }
    return fs.readFileSync(file, encoding);
};

var readLines = function (file, encoding) {
    var content = read(file, encoding);
    if (content == null) {
        return null;
    }
    return content.split(/\r\n|\r|\n/);
};

var listFiles = function (folder) {
    return fs.readdirSync(pathUtils.normalizePath(folder));
};

var dumpFile = function (file, content, encoding) {
    /* mode:444 表示只读模式 */
    fs.writeFileSync(pathUtils.normalizePath(file), content, {encoding: encoding, mode: parseInt('444', 8), flag: 'w'});
};

var appendFile = function (file, content, encoding) {
    /* mode保持默认值，可读可写 */
    fs.writeFileSync(pathUtils.normalizePath(file), content, {encoding: encoding, flag: 'a'});
};

module.exports.exists = exists;
module.exports.mkdir = mkdir;
module.exports.read = read;
module.exports.readLines = readLines;
module.exports.listFiles = listFiles;
module.exports.dumpFile = dumpFile;
module.exports.appendFile = appendFile;