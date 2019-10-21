const express = require("express");
const db = require("../models");
const Op = db.Sequelize.Op;
const Sequelize = require("sequelize");

const router = express.Router();

//키워드로 포스트 검색
router.get("/:keyword", async (req, res, next) => {
	// GET /api/search
	const include = [
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
	];

	try {
		//lastId가 0이 아닌 경우; 즉 이미 화면에 포스트들이 존재하고 처음 요청하는 것이 아닌 경우.
		if (parseInt(req.query.lastId, 10)) {
			const posts = await db.Post.findAll({
				where: {
					id: {
						[Op.lt]: parseInt(req.query.lastId, 10) // less than
					},
					[Op.or]: [
						{
							title: {
								[Op.like]: "%" + decodeURIComponent(req.params.keyword) + "%"
							}
						},
						{
							description: {
								[Op.like]: "%" + decodeURIComponent(req.params.keyword) + "%"
							}
						}
					]
				},
				include,
				order: [["id", "DESC"]], // DESC는 내림차순, ASC는 오름차순
				limit: 10
			});

			return res.json(posts);
		} else {
			//lastId 0(falthy)이면 그러니까 제일 처음에 게시물들이 검색되어 출력될 때 위 조건문은 실행되지 않고 lastId 조건 없이 그냥 5개만 불러온다.
			const posts = await db.Post.findAll({
				where: {
					[Op.or]: [
						{
							title: {
								[Op.like]: "%" + decodeURIComponent(req.params.keyword) + "%"
							}
						},
						{
							description: {
								[Op.like]: "%" + decodeURIComponent(req.params.keyword) + "%"
							}
						}
					]
				},
				include,
				order: [["id", "DESC"]], // DESC는 내림차순, ASC는 오름차순
				limit: 10
			});
      console.log(req.query.limit)
			return res.json(posts);
		}
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
