const KakaoStrategy = require("passport-kakao").Strategy;
const passport = require("passport");
const db = require("../models");

module.exports = () => {
	passport.use(
		new KakaoStrategy(
			{
				clientID: process.env.KAKAO_ID,
				callbackURL: "/api/oauth/kakao/callback"
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const exUser = await db.User.findOne({ where: { user_id: profile.id } });
					if (exUser) {
						done(null, exUser);
					} else {
						const newUser = await db.User.create({
							user_id: profile._json.id,
							nickname: profile.username,
							thumbnail_img: profile._json.properties.thumbnail_image
						});
						done(null, newUser);
					}
				} catch (error) {
					console.error(error);
					done(error);
				}
			}
		)
	);
};
