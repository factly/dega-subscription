const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');

class StoryModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'post');
        this.logger = logger;
    }
    saveStory(config, accessToken, user, id, type) {
        const database = config.get('databaseConfig:databases:factly');
        console.log("database", database);
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
                let userPrefs;
                let toModify = true;
                console.log("id", id, "userid", user.sub, "result", result);
                if (result.length > 0) {
                    userPrefs = result[0];
                    if (userPrefs[type]) {
                        if (!userPrefs[type].includes(id))
                            userPrefs[type].push(id);
                        else {
                            toModify = false;
                        }
                    }
                    else {
                        userPrefs[type] = [id]
                    }
                }
                else {
                    userPrefs = { "_id": user.sub, [type]: [id] }
                }
                console.log("modify", toModify);
                if (toModify) {
                    console.log("to modify", userPrefs);
                    this.collection(database, "users").updateOne({ _id: user.sub }, { $set: { [type]: userPrefs[type] } }, { upsert: true }, (err, result) => {
                        if (err) throw err;
                        return { "success": true }
                    });
                }
                return { "success": true }
            })
        )
    }
    unsaveStory(config, accessToken, user, id, type) {
        const database = config.get('databaseConfig:databases:factly');
        console.log("database", database);
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
                let userPrefs;
                let toModify = true;
                console.log("id", id, "userid", user.sub, "result", result);
                if (result.length > 0 && result[0][type].includes(id)) {
                    userPrefs = result[0];
                    console.log(userPrefs);
                    let index = userPrefs[type].indexOf(id)
                    userPrefs[type].splice(index, 1)
                }
                else {
                    toModify = false;
                }
                console.log("modify", toModify);
                if (toModify) {
                    console.log("to modify", userPrefs);
                    this.collection(database, "users").updateOne({ _id: user.sub }, { $set: { [type]: userPrefs[type] } }, { upsert: true }, (err, result) => {
                        if (err) throw err;
                        return { "success": true }
                    });
                }
                return { "success": true }
            })
        )
    }
}

module.exports = StoryModel;