const express = require('express')
var session = require("express_session")
router = express.Router()

router.use(session({
	secret: 'important_user_secret'
}))
router.use(function(req,res,next)
{
	if(req.session.user){
		req.user = req.session.user
	}
}

)