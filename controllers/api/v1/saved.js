'use strict';

const SavedModel = require('../../../models/saved');
const utils = require('../../../lib/utils');

function getSavedPosts(req,res,next){
    const logger = req.logger;
    utils.setLogTokens(logger, 'saved', 'getSavedPosts', req.query.client, null);
    const model = new SavedModel(logger);
    return model.getSavedPosts(
        req.app.kraken,
        req.body.accessToken,
        req.body.user,
    ) .then((result) => {
        if (result) {
            res.status(200).json(result);
            return
        }
    })
    .catch(next);

}
function getSavedFactchecks(req,res,next){
    const logger = req.logger;
    utils.setLogTokens(logger, 'saved', 'getSavedFactchecks', req.query.client, null);
    const model = new SavedModel(logger);
    return model.getSavedFactchecks(
        req.app.kraken,
        req.body.accessToken,
        req.body.user,
    ) .then((result) => {
        if (result) {
            res.status(200).json(result);
            return
        }
    })
    .catch(next);

}

module.exports = function (router) {
    router.post('/posts',getSavedPosts);
    router.post('/factchecks',getSavedFactchecks)
};
