const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
const axios = require('axios')

class SavedModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'users');
        this.logger = logger;
    }
    getSavedPosts(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        this.logger.info("Getting saved posts' id");
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
              this.logger.info("Retrieved saved posts' id");
              this.logger.info("Getting saved posts");
                if(result.length>0 && result[0].post && result[0].post.length){
                    return Q(axios({
                      method:'get',
                      url:config.get('env:dega-api:baseUri')+config.get('env:dega-api:posts'),
                      params:{
                        "client":config.get('env:dega-api:client'),
                        "ids":result[0].post,
                        "sortBy":"publishedDate",
                        "sortAsc":"false"
                      }
                    })).then((response)=>{
                      this.logger.info("Retreived saved posts");
                      return response.data;
                    })
                    .catch((error)=>{
                      this.logger.error(error.data);
                      return error.data;
                    })
                  }
                  else{
                    this.logger.info("No posts saved");
                    return {};
                  }
            })
        )
    }
    getSavedFactchecks(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        this.logger.info("Getting saved factchecks' id");
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
              this.logger.info("Retrieved saved factchecks' id");
              this.logger.info("Getting saved factchecks");
                if(result.length>0 && result[0].factcheck && result[0].factcheck.length){
                    return Q(axios({
                      method:'get',
                      url:config.get('env:dega-api:baseUri')+config.get('env:dega-api:factchecks'),
                      params:{
                        "client":config.get('env:dega-api:client'),
                        "ids":result[0].factcheck,
                        "sortBy":"publishedDate",
                        "sortAsc":"false"
                      }
                    })).then((response)=>{
                      this.logger.info("Retreived saved factchecks");
                      return response.data;
                    })
                    .catch((error)=>{
                      this.logger.error(error.data);
                      return error.data;
                    })
                  }
                  else{
                    this.logger.info("No factchecks saved");
                    return {};
                  }
            })
        )
    }
}

module.exports = SavedModel;