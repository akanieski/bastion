module.exports = function*(req, res, next) {
    console.log("Request Received");
    next();
}