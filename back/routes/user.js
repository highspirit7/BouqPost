const express = require("express");
const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
	// /api/user/
  
  //시퀄라이즈도 DB에서 가져온 경우에는 res.json으로만 동작했다. 하지만 여기서는 req.user를 그대로 사용
	//res.send로 해도 똑같이 동작하는데 res.json도 내부적으로 send를 사용한다고 한다.
	return res.json(req.user);
});

router.post("/logout", (req, res) => {
	// /api/user/logout
	req.logout();
	req.session.destroy();
	res.send("로그아웃 처리되었습니다");
});

module.exports = router;
