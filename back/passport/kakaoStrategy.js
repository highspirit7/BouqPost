const KakaoStrategy = require("passport-kakao").Strategy;
const passport = require("passport");
const db = require("../models");

module.exports = () => {
	passport.use(
		new KakaoStrategy(
			{
				clientID: process.env.KAKAO_ID,
				callbackURL: "/oauth/kakao/callback"
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const exUser = await db.User.findOne({ where: { user_id: profile.id } });

					if (exUser) {
            //가입 시 최초로 세팅한 정보가 아닌 최신 프로필 정보는 아래 객체에 담겨져 있다.
						const latestProfile = profile._json.kakao_account.profile;

						//이렇게 업데이트했을 때 반환되는 값이 해당 row의 id
						const updatedUserId = await db.User.update(
							{ nickname: latestProfile.nickname, thumbnail_img: latestProfile.thumbnail_image_url },
							{
								where: { user_id: profile.id }
							}
						);

						const updatedUser = await db.User.findOne({ where: { id: updatedUserId } });

						done(null, updatedUser);
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
