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
        super(logger, 'users');
        this.logger = logger;
    }
    getUserInfo(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        this.logger.info("Fetching User Info");
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
                this.logger.info('Retrieved User info');
                if (result.length > 0) {
                    user.prefs = {}
                    if (result[0].post)
                        user["prefs"].post = result[0].post;
                    if (result[0].factcheck)
                        user["prefs"].factcheck = result[0].factcheck;
                    if (result[0].gender)
                        user.gender = result[0].gender
                    if (result[0].dob)
                        user.dob = result[0].dob
                    if(result[0].name)
                        user.name = result[0].name
                }
                return user
            })
        )
    }

    modifyUserInfo(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        let toModify = {};
        if (user.gender) {
            toModify["gender"] = user.gender;
        }
        if (user.dob) {
            toModify["dob"] = user.dob
        }
        if(user.gender == ''){
            toModify["gender"] = null;
        }
        if(user.dob == ''){
            toModify["dob"] = null;
        }
        toModify["name"] = user.name
        this.logger.info("Modifing User");
        return Q(this.collection(database, "users").updateOne({ _id: user.sub }, { $set: toModify }, { upsert: true })
            .then((result) => {
                this.logger.info('Modfied User')
                if (result)
                    return { "success": true }
            }))
    }
}

module.exports = UserModel;