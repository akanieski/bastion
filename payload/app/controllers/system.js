module.exports = {
    
    info: {
        secure: false,
        action: function*(req, res, next) {
            
            console.log(req.config);
            
            res.ok({
                hello: 'world' 
            });
            
        }
    }
    
}