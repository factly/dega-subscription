'use strict';

var UserModel = require('../models/user');
var http = require('http');
function modifyUserInfo(req, res, next) {
  const logger = req.logger;
  const model = new UserModel();
  return model.modifyUserInfo(
    req.app.kraken,
    req.body.accessToken,
    req.body.user
  ).then((result) => {
    console.log("result",result);
    if (result) {
      res.status(200).json(result);
      return
    }
  })
    .catch(next);
}
function getUserInfo(req, res, next) {
  const logger = req.logger;
  const model = new UserModel();
  console.log("controller passing")
  req.headers.host = req.app.kraken.get('env:keycloak:uri')
  console.log(req.headers.host)
  var options = {
    // host to forward to
    host:req.app.kraken.get('env:keycloak:uri'),
    // port to forward to
    port: null,
    // path to forward to
    path: '/auth/realms/Test/protocol/openid-connect/userinfo',
    // request method
    method: 'GET',
    // headers to send
    headers: req.headers
  };

  var creq = http.request(options, function (cres) {

    // set encoding
    cres.setEncoding('utf8');

    // wait for data
    cres.on('data', async function (chunk) {
      console.log("chunk",chunk)
      chunk = JSON.parse(chunk)
      if (chunk["error"]) {
        console.log("error", chunk["error"]);
        res.end();
        creq.end();
      }
      else {
        let user = chunk;
        console.log(req.body);
        console.log(chunk)
        return model.getUserInfo(
          req.app.kraken,
          req.body.accessToken,
          chunk
        ).then((result) => {
          if (result) {
            res.writeHead(cres.statusCode);
            console.log(chunk);
            res.write(JSON.stringify(chunk));
            res.end();
          }
        })
          .catch(next);
      }
    });
  }).on('error', function (e) {
    console.log(e.message);
    res.writeHead(500);
    res.end();
  });

  creq.end();
}

module.exports = function (router) {
  router.get('/info', getUserInfo);
  router.post('/update',modifyUserInfo);
};
