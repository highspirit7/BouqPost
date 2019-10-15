const express = require("express");
const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
	// /api/user/

	//아래와 같이 db에서 시퀄라이즈로 가져올 때 비밀번호를 삭제한다든지와 같은 이유로 수정이 필요하거나 할 때는 toJSON 해주어야 한다.
	// console.log(req.session);

	//이 부분이 필요없다...
	const user = Object.assign({}, req.user);

	//res.send로 해도 똑같이 동작하는데 res.json도 내부적으로 send를 사용한다고 한다.
	return res.json(req.user);
});

module.exports = router;
