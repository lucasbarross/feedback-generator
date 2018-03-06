const jwt = require("jsonwebtoken");

const secretKey = require("../../../../config/constants.js").authentication.secretKey;

// to gain acess send Authorization header in the format Bearer <token>


module.exports =  function(req, res, next) {
	var bearerHeader = req.headers['authorization'];

	if(bearerHeader){
		var bearer = bearerHeader.split(' ');
		
		var bearerToken = bearer[1];

		req.token = bearerToken;

		jwt.verify(req.token, secretKey, (err, authData) => {
			if(err){
				res.json({code: -1 , err : err});
			}else{
				req.authData = authData;
				next();
		}
		});

	} else {
		res.status(401).send("You need to be logged in to that");
	}

}
