const PostB = require('../../models/post/postTypeB.model');
const Community = require('../../models/community.model');

//publicaion con tokens
async function createPostTypeB(req, res) {
    const modelPostTypeB = new PostB();
    const parameters = req.body;
    const { idCommunity } = req.params;

    const community = await Community.findById(idCommunity)


}


module.exports = {
    createPostTypeB
}