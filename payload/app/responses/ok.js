module.exports = function*(data) {
    console.log('ok');
    this
        .status(200)
        .send(data);
}