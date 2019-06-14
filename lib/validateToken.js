const axios = require('axios')
const Querystring = require('querystring');
module.exports = function getValidateTokenMiddleware() {
    return async function validateToken(req, res, next) {
        const authSecret = Buffer.from(req.app.kraken.get('env:keycloak:clientId')+":"+req.app.kraken.get('env:keycloak:secret')).toString('base64');
        if (req.originalUrl != "/api/v1/user/info") {
            console.log("not userinfo")
            let token = req.body.accessToken || req.headers.authorization;
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
                console.log("Token is valid");
                next();
            }
            else{
                console.log(validate)
                console.log("Invalid token");
                res.end("{'err':'invalid token'");
            }
        }
        else{
            next();
        }

    };
};