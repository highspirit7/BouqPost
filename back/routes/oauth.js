const express = require("express");
const passport = require("passport");

const router = express.Router();

const prod = process.env.NODE_ENV === "production";

const redirectUrlSuccess = prod ? "http://bouqpost.xyz" : "http://localhost:3000";

const redirectUrlFailure = prod ? "http://bouqpost.xyz/login" : "http://localhost:3000/login";

router.get("/kakao", passport.authenticate("kakao"));

router.get(
	"/kakao/callback",
	passport.authenticate("kakao", {
		failureRedirect: redirectUrlFailure
	}),
	(req, res) => {
		res.redirect(redirectUrlSuccess);
	}
);

module.exports = router;
