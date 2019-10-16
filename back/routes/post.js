const express = require("express");

const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();

//multer가 formData의 파일은 req.file(s)로 그 외의 일반 데이터는 req.body로 분리시켜 보낸다.
router.post("/", isLoggedIn, async (req, res, next) => {
  // POST /api/post
  // console.log("request body");
  // console.dir(req.body);
	try {
		//액션에 들어가는 data객체를 그대로 req.body로 받을 수 있는 것으로 보인다.
		const categories = req.body.category;
		const newPost = await db.Post.create({
			title: req.body.title,
			description: req.body.description,
			UserId: req.user.id
		});

		//카테고리 있으면 add
		if (categories) {
			await newPost.addCategories(categories);
		}

		// 이래 방식 및 include 방식 2가지 다 가능
		// const User = await newPost.getUser();
		// newPost.User = User;
		// res.json(newPost);

		const fullPost = await db.Post.findOne({
			where: { id: newPost.id },
			include: [
				{
					model: db.User,
					attributes: ["id", "nickname"]
				},
				{
					model: db.User,
					as: "Likers",
					attributes: ["id"]
				}
			]
		});
    res.json(fullPost);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;