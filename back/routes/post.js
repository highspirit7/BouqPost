const express = require("express");
const path = require("path");

const db = require("../models");
const { isLoggedIn } = require("./middleware");

const router = express.Router();



//multer가 formData의 파일은 req.file(s)로 그 외의 일반 데이터는 req.body로 분리시켜 보낸다.
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
	// POST /api/post
	try {
		//액션에 들어가는 data객체를 그대로 req.body로 받을 수 있는 것으로 보인다.
		const hashtags = req.body.content.match(/#[^\s]+/g);
		const newPost = await db.Post.create({
			content: req.body.content, // ex) '제로초 파이팅 #구독 #좋아요 눌러주세요'
			UserId: req.user.id
		});
		if (hashtags) {
			//기본적으로 Promise.all은 promise 들의 배열을 받습니다. 그리고 그걸 다 합쳐서 하나의 promise로 만듭니다. Promise.all은 넘겨준 promise를 전달(dispatch)하거나 생성(create)하지는 않습니다. Promise.all이 하는 일은 그들을 그룹화해서 하나의 새로운 promise로 만들고 모두 종료될 때까지 기다리는 것입니다.
			const result = await Promise.all(
				hashtags.map(tag =>
					db.Hashtag.findOrCreate({
						where: { name: tag.slice(1).toLowerCase() }
					})
				)
			);
			console.log(result);
			await newPost.addHashtags(result.map(r => r[0]));
		}

		//multer이용 시, 이미지 주소가 여러개라면 배열의 형태로 [주소 1, 주소2] 이렇게 전달
		//그래서 배열인 경우 구분해서 처리.
		if (req.body.image) {
			if (Array.isArray(req.body.image)) {
				const images = await Promise.all(
					req.body.image.map(image => {
						return db.Image.create({ src: image });
					})
				);
				await newPost.addImages(images);
			} else {
				// 이미지를 하나만 올리면 image: 주소1
				const image = await db.Image.create({ src: req.body.image });
				await newPost.addImage(image);
			}
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
					model: db.Image
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