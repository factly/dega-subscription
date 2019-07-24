const axios = require('axios')
const Querystring = require('querystring');
module.exports = function getMiddleware() {
    return async function getMiddleware(req, res, next) {
        const authSecret = Buffer.from(req.app.kraken.get('env:keycloak:clientId')+":"+req.app.kraken.get('env:keycloak:secret')).toString('base64');
        let token = req.body.accessToken || req.headers.authorization;
        console.log("OKAY working")
        if(token.split(" ").length === 2 && token.split(" ")[1] === "Bearer"){
            let config = {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': "Basic "+authSecret
                }
            }
            let body = {
                token_type_hint: 'access_token',
                token: token.split(' ')[1]
            }
            let validate = await axios({
                method: 'post',
                url: req.app.kraken.get('env:keycloak:validateTokenEndpoint'),
                data: Querystring.stringify(body),
                headers: config.headers
            })
            if (validate.data.active && validate.data.sub === req.body.user.sub) {
                next();
            }
            else{
                res.status(401).send("{'err':'invalid token'}");
            }
        }
    };
};