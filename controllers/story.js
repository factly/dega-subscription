'use strict';

const StoryModel = require('../models/story');
const utils = require('../lib/utils');

function saveStory(req,res,next){
    const logger = req.logger;
    const model = new StoryModel();
    console.log("controller passing")
    return model.saveStory(
        req.app.kraken,
        req.body.accessToken,
        req.body.user,
        req.body.id,
        req.body.type
    ) .then((result) => {
        if (result) {
            res.status(200).json(result);
            return
        }
    })
    .catch(next);

}
function unsaveStory(req,res,next){
    const logger = req.logger;
    const model = new StoryModel();
    console.log("controller passing")
    return model.unsaveStory(
        req.app.kraken,
        req.body.accessToken,
        req.body.user,
        req.body.id,
        req.body.type
    ) .then((result) => {
        if (result) {
            res.status(200).json(result);
            return
        }
    })
    .catch(next);

}
module.exports = function (router) {
    router.post('/save',saveStory);
    router.post('/unsave',unsaveStory)
};
