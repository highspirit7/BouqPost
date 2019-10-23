const express = require("express");
const db = require("../models");
const { isLoggedIn } = require("./middleware");
const Op = db.Sequelize.Op;
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

router.get("/:userId", async (req, res, next) => {
	// GET /api/user
	try {
		let where = {};
		if (parseInt(req.query.lastId, 10)) {
			where = {
				id: {
					[Op.lt]: parseInt(req.query.lastId, 10)
        },
        UserId: parseInt(req.params.userId)
			};
		} else {
      where = {
        UserId: parseInt(req.params.userId)
      }
    }

		const posts = await db.Post.findAll({
			where,
      include: [
        {
          model: db.User,
          attributes: ["id", "nickname"]
        },
        {
          model: db.Category
        },
        {
          model: db.User,
          as: "Likers",
          attributes: ["id"]
        }
      ],
			order: [["id", "DESC"]],
			limit: parseInt(req.query.limit, 10)
		});

		return res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
