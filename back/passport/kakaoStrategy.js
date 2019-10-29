const KakaoStrategy = require("passport-kakao").Strategy;
const passport = require("passport");
const db = require("../models");
const logger = require("../logger");

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

					console.log("프로필 id " + profile.id);
					console.log(typeof profile.id);
					logger.info("카카오 profile.id");
					logger.info(profile.id);

					if (exUser) {
						//가입 시 최초로 세팅한 정보가 아닌 최신 프로필 정보는 아래 객체에 담겨져 있다.
						const latestProfile = profile._json.kakao_account.profile;

						//이렇게 업데이트했을 때 반환되는 값이 해당 row의 id

						await db.User.update(
							{ nickname: latestProfile.nickname, thumbnail_img: latestProfile.thumbnail_image_url },
							{
								where: { user_id: profile.id }
							}
						);

						const updatedUser = await db.User.findOne({ where: { user_id: profile.id } });

						logger.info("업데이트된 유저 정보 ; serializeUser로 전달될");
						logger.info(updatedUser);
						done(null, updatedUser);
					} else {
						const newUser = await db.User.create({
							user_id: profile._json.id,
							nickname: profile.username,
							thumbnail_img: profile._json.properties.thumbnail_image
						});
						done(null, newUser);
						//이렇게 문제 없이 해당 유저에 관한 정보가 조회되든 아니면 신규 유저만 새로 생성한 유저 정보든 serializeUser 함수의 첫번째 인자로 전달된다.
					}
				} catch (error) {
					console.error(error);
					done(error);
				}
			}
		)
	);
};
