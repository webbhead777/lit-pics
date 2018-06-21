module.exports.wrap = function wrap(func) {
    return (req, res, next) => func(req, res, next).catch((err) => {console.log(err); return next(err)})
}
