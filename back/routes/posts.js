const express = require("express");
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

const router = express.Router();

router.get("/", async (req, res, next) => {
	// GET /api/posts
	try {
		let where = {};
		//lastId가 0이 아닌 경우, 그러니까 실질적으로는 0보다 큰 경우
		if (parseInt(req.query.lastId, 10)) {
			where = {
				id: {
					[Op.lt]: parseInt(req.query.lastId, 10) // less than
				}
			};
		}
		//lastId 0(falthy)이면 그러니까 제일 처음에 게시물들이 출력될 때 위 조건문은 실행되지 않고 lastId 조건 없이 불러온다.
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
					through: "Like",
					as: "Likers",
					attributes: ["id"]
				}
			],
			order: [["id", "DESC"]], // DESC는 내림차순, ASC는 오름차순
			limit: parseInt(req.query.limit, 10)
		});
		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//우선 랜덤하게 게시물 4개 조회(나중에 좋아요 몇개 이상 등 조건 추가 가능)
router.get("/random", async (req, res, next) => {
	// GET /api/posts
	try {
		const posts = await db.Post.findAll({
			attributes: ["title", "description", "link", "thumbnail", "id"],
			order: Sequelize.literal("rand()"),
			limit: 4
		});
		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//유저가 좋아하는 게시물 조회
router.get("/likes", async (req, res, next) => {
	// GET /api/posts
	try {
		const user = await db.User.findOne({
			where: { id: req.user.id },
			include: [
				{
					model: db.Post,
					as: "Liked",
					attributes: ["id"]
				}
			]
		});

		const postIdLike = user.Liked.map(post => post.id).reverse();

		if (!parseInt(req.query.lastId)) {
			const neededPostIdLike = postIdLike.slice(0, parseInt(req.query.limit, 10));

			const fullPosts = await Promise.all(
				neededPostIdLike.map(id =>
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
						]
						// order: [["id", "DESC"]]
					})
				)
			);

			return res.json(fullPosts);
		} else {
			const index = postIdLike.findIndex(id => id === parseInt(req.query.lastId, 10));

			const neededPostIdLike = postIdLike.slice(index + 1, index + 6);

			const fullPosts = await Promise.all(
				neededPostIdLike.map(id =>
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
						]
						// order: [["id", "DESC"]]
					})
				)
			);

			return res.json(fullPosts);
		}
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
