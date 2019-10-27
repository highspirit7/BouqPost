const express = require("express");
const client = require("cheerio-httpcli");
const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();
const logger = require("../logger");

router.post("/", async (req, res, next) => {
	try {
		//액션에 들어가는 data객체를 그대로 req.body로 받을 수 있는 것으로 보인다.
		logger.info(req.user);

		const newPost = await db.Post.create({
			title: req.body.title,
			description: req.body.description,
			thumbnail: req.body.image,
			link: req.body.link,
			UserId: req.user.id
		});

		const categories = await Promise.all(
			req.body.category.map(category => {
				return db.Category.findOne({ where: { name: category } });
			})
		);
		await newPost.addCategories(categories);

		logger.error();

		res.send("새 포스트가 추가되었습니다.");
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//링크 입력 시 크롤링으로 제목 및 썸네일 이미지 추출
router.post("/scraping", async (req, response, next) => {
	client.fetch(req.body.url, (err, $, res, body) => {
		const title1 = $("meta[property='og:title']").attr("content");
		const title2 = $("title").text();

		const image_og = $("meta[property='og:image']").attr("content");

		const scrapedData = {};

		if (!title1) {
			scrapedData.title = title2;
		} else {
			scrapedData.title = title1;
		}

		if (image_og) {
			scrapedData.image = image_og;
		}

		if (err) {
			console.error(err);
			return next(error);
		}

		return response.json(scrapedData);
	});
});

//게시물 하나 조회(수정용)
router.get("/:postId", isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({
			where: { id: req.params.postId },
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
			]
		});
		// console.log(post)
		res.json(post);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//게시물 수정
router.put("/:postId", isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({
			where: { id: req.params.postId },
			include: [
				{
					model: db.Category
				}
			]
		});

		if (!post) {
			return res.status(404).send("해당 포스트가 존재하지 않습니다");
		}

		const updatedPost = await db.Post.update(
			{
				title: req.body.title,
				description: req.body.description,
				thumbnail: req.body.image,
				link: req.body.link
			},
			{
				where: {
					id: req.params.postId
				}
			}
		);

		//업데이트된 카테고리를 새로이(새로운 아이디로) 생성
		const categories = await Promise.all(
			req.body.category.map(category => {
				return db.Category.findOne({ where: { name: category } });
			})
		);

		await post.setCategories(categories);

		res.send("포스트가 성공적으로 수정되었습니다.");
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//게시물 삭제
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.postId } });
		if (!post) {
			return res.status(404).send("포스트가 존재하지 않습니다.");
		}
		await db.Post.destroy({ where: { id: req.params.postId } });
		res.send(req.params.postId);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//게시물 좋아요 클릭
router.post("/:postId/like", isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.postId } });
		if (!post) {
			return res.status(404).send("포스트가 존재하지 않습니다.");
		}
		await post.addLiker(req.user.id);
		console.log(req.user);
		res.json({ userId: req.user.id });
	} catch (e) {
		console.error(e);
		next(e);
	}
});

//게시물 좋아요 클릭 해제
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
	try {
		const post = await db.Post.findOne({ where: { id: req.params.postId } });
		if (!post) {
			return res.status(404).send("포스트가 존재하지 않습니다.");
		}
		await post.removeLiker(req.user.id);
		res.json({ userId: req.user.id });
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
