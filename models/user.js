const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');

class UserModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'post');
        this.logger = logger;
    }
    getUserInfo(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        console.log("database", database);
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
                console.log("result")
                if (result.length > 0) {
                    console.log("getLiked", result[0]);
                    user.prefs = {}
                    if (result[0].post)
                        user["prefs"].post = result[0].post;
                    if (result[0].factcheck)
                        user["prefs"].factcheck = result[0].factcheck;
                    if (result[0].gender)
                        user.gender = result[0].gender
                    if (result[0].dob)
                        user.dob = result[0].dob
                    console.log("user", user)
                }
                return user
            })
        )
    }

    modifyUserInfo(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        console.log(user)
        let toModify = {};
        if (user.gender) {
            toModify["gender"] = user.gender;
        }
        if (user.dob) {
            toModify["dob"] = user.dob
        }
        return Q(this.collection(database, "users").updateOne({ _id: user.sub }, { $set: toModify }, { upsert: true })
            .then((result) => {
                if (result)
                    return { "success": true }
            }))
    }
}

module.exports = UserModel;