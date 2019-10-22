const express = require("express");
const db = require("../models");
const Op = db.Sequelize.Op;

const router = express.Router();

router.get("/:category", async (req, res, next) => {
  // GET /api/category
	try {
		let where = {};
		if (parseInt(req.query.lastId, 10)) {
			where = {
				id: {
					[Op.lt]: parseInt(req.query.lastId, 10)
				}
			};
		}

		const posts = await db.Post.findAll({
			include: [
				{
					model: db.Category,
					//이스케이핑 처리된 것을 디코드처리. DB에서는 애초에 사용자가 입력했던 대로 해시태그가 저장되어 있기 때문.
					where: { name: decodeURIComponent(req.params.category) }
				},
				{
					model: db.User,
					attributes: ["id", "nickname"]
				},
				{
					model: db.User,
					through: "Like",
					as: "Likers",
					attributes: ["id"]
				}
			],
			order: [["id", "DESC"]],
			limit: 5
		});
		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
