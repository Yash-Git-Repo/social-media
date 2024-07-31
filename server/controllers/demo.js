const { success } = require("../utils/responseWrapper")

const demoController = async(req,res) =>{
    return res.send(success(200,"This is demo Controller"))
}

module.exports = {demoController}