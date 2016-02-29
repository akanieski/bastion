module.exports = {
    
    attachResponses: require('../app/middleware/attachResponses.js'),
    
    json: require('body-parser').json(),
    
    urlencode: require('body-parser').json(),
    
    requestLogger: require('../app/middleware/requestLogger'),
    
    setup: [
        '*urlencode',
        '*json',
        'requestLogger',
        'attachResponses',
        'router'
    ]
    
}