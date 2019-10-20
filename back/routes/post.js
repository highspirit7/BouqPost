const express = require("express");
const client = require("cheerio-httpcli");
const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
	// POST /api/post

	try {
		//액션에 들어가는 data객체를 그대로 req.body로 받을 수 있는 것으로 보인다.

		const newPost = await db.Post.create({
			title: req.body.title,
			description: req.body.description,
			thumbnail: req.body.image,
			link: req.body.link,
			UserId: req.user.id
		});

		const categories = await Promise.all(
			req.body.category.map(category => {
				return db.Category.create({ name: category });
			})
		);
		await newPost.addCategories(categories);

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
		res.send("새 포스트가 추가되었습니다.");
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

router.put("/:postId", isLoggedIn, async (req, res, next) => {
	// POST /api/post

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
		const previousCategory = post.Categories.map(category => category.name);

		//카테고리에 변화가 없는 경우에 굳이 기존 카테고리를 삭제하고 새로 생성할 필요가 없으므로 카테고리에 변화가 없는 경우 필터
		if (req.body.category.sort().join(",") !== previousCategory.sort().join(",")) {
			//해당 포스트에 기존 카테고리 아이디만 추출
			const previousCategoriesId = post.Categories.map(category => category.id);

			//바뀐 카테고리와 기존의 카테고리 개수가 동일한 경우
			if (req.body.category.length === previousCategory.length) {
				//카테고리를 업데이트
				const categories = await Promise.all(
					req.body.category.map((category, index) => {
						return db.Category.update(
							{ name: category },
							{
								where: {
									id: previousCategoriesId[index]
								}
							}
						);
					})
				);

				await post.setCategories(categories);
				console.log(post);
			} else {
				//바뀐 카테고리 개수와 기존 카테고리 개수가 다른 경우
				//기존 카테고리 전부 삭제
				//이 방식이 적합한 것인지 모르겠지만 기존의 카테고리 숫자와 업데이트할 카테고리 숫자가 다른 경우에는 처리가 까다로워진다고 판단하였다.(associations도 고려한다면)
				await previousCategoriesId.forEach(categoryId => {
					db.Category.destroy({
						where: {
							id: categoryId
						}
					});
				});

				//업데이트된 카테고리를 새로이(새로운 아이디로) 생성
				const categories = await Promise.all(
					req.body.category.map(category => {
						return db.Category.create({ name: category });
					})
				);

				await post.setCategories(categories);
				console.dir(post);
			}
		}

		res.send("포스트가 성공적으로 수정되었습니다.");
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
