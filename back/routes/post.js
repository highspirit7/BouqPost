const express = require("express");
const client = require("cheerio-httpcli");
const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
	// POST /api/post
	// console.log("request body");
	console.dir(req.body);
	try {
		//액션에 들어가는 data객체를 그대로 req.body로 받을 수 있는 것으로 보인다.

		const newPost = await db.Post.create({
			title: req.body.title,
			description: req.body.description,
			thumbnail: req.body.image,
			link: req.body.link,
			UserId: req.user.id
		});

		if (req.body.category) {
			const categories = await Promise.all(
				req.body.category.map(category => {
					return db.Category.create({ name: category });
				})
			);
			await newPost.addCategories(categories);
		}

		// 이래 방식 및 include 방식 2가지 다 가능
		// const User = await newPost.getUser();
		// newPost.User = User;
		// res.json(newPost);

		// const fullPost = await db.Post.findOne({
		// 	where: { id: newPost.id },
		// 	include: [
		// 		{
		// 			model: db.User,
		// 			attributes: ["id", "nickname"]
		// 		},
		// 		{
		// 			model: db.Category
		// 		},
		// 		{
		// 			model: db.User,
		// 			as: "Likers",
		// 			attributes: ["id"]
		// 		}
		// 	]
		// });
    res.send("새 포스트가 추가되었습니다.")
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//링크 입력 시 크롤링으로 제목 및 썸네일 이미지 추출
router.post("/scraping", async (req, response, next) => {
	try {
		var scrapedData = {};

		client.fetch(req.body.url, (err, $, res, body) => {
			const title1 = $("meta[property='og:title']").attr("content");
			const title2 = $("title").text();

			const image_og = $("meta[property='og:image']").attr("content");

			if (!title1) {
				scrapedData.title = title2;
			} else {
				scrapedData.title = title1;
			}

			if (image_og) {
				scrapedData.image = image_og;
			} else {
			}

			return response.json(scrapedData);
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
});

//게시물 하나 조회
// router.get("/:postId", async (req, res, next) => {
// 	try {
// 		const post = await db.Post.findOne({
// 			where: { id: req.params.postId },
// 			include: [
// 				{
// 					model: db.User,
// 					attributes: ["id", "nickname"]
// 				},
// 				{
// 					model: db.Category
// 				},
// 				{
// 					model: db.User,
// 					as: "Likers",
// 					attributes: ["id"]
// 				}
// 			]
// 		});
// 		res.json(post);
// 	} catch (e) {
// 		console.error(e);
// 		next(e);
// 	}
// });

module.exports = router;
