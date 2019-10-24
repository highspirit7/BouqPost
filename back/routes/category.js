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
			where,
			attributes: ["id"],
			include: [
				{
					model: db.Category,
					where: { params: req.params.category },
					attributes: ["name"]
				}
			],
			order: [["id", "DESC"]],
			limit: parseInt(req.query.limit, 10)
		});

		const postId = posts.map(post => post.id);

		const fullPosts = await Promise.all(
			postId.map(id =>
				db.Post.findOne({
					where: { id },
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
              through: "Like",
              as: "Likers",
              attributes: ["id"]
						}
					],
					// order: [["id", "DESC"]]
				})
			)
		);

		return res.json(fullPosts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
