var normalizePath = function (path) {
    if (!path || path == "") {
        throw Error("path could not be null or empty");
    }

    /*分别判断linux和windows的完整路径*/
    if (path.indexOf('/') == 0 || path.indexOf(":") > 0) {
        return path;
    } else {
        return process.cwd() + "/" + path;
    }
};

module.exports.normalizePath = normalizePath;