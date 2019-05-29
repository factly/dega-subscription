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
        super(logger, 'post');
        this.logger = logger;
    }
    getSavedPosts(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        console.log("database", database);
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
                console.log("result",result)
                if(result.length>0 && result[0].post && result[0].post.length){
                    console.log("getLiked",result[0].post);
                    return Q(axios({
                      method:'get',
                      url:"http://api.factly.in/api/v1/posts/",
                      params:{
                        "client":"factly-telugu",
                        "ids":result[0].post,
                        "sortBy":"publishedDate",
                        "sortAsc":"false"
                      }
                    })).then((response)=>{
                      console.log("detailed",response.data)
                      return response.data;
                    })
                    .catch((error)=>{
                      console.log(error);
                      return error.data;
                    })
                  }
                  else{
                    return {};
                  }
            })
        )
    }
    getSavedFactchecks(config, accessToken, user) {
        const database = config.get('databaseConfig:databases:factly');
        console.log("database", database);
        return Q(this.collection(database, "users").find({ _id: user.sub }).toArray()
            .then((result) => {
                console.log("result",result)
                if(result.length>0 && result[0].factcheck && result[0].factcheck.length){
                    console.log("getLiked",result[0].factcheck);
                    return Q(axios({
                      method:'get',
                      url:"http://api.factly.in/api/v1/factchecks/",
                      params:{
                        "client":"factly-telugu",
                        "ids":result[0].factcheck,
                        "sortBy":"publishedDate",
                        "sortAsc":"false"
                      }
                    })).then((response)=>{
                      console.log("detailed",response.data)
                      return response.data;
                    })
                    .catch((error)=>{
                      console.log(error);
                      return error.data;
                    })
                  }
                  else{
                    return {};
                  }
            })
        )
    }
}

module.exports = SavedModel;