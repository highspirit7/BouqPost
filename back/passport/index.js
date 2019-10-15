const passport = require("passport");
const db = require("../models");
const kakao = require("./kakaoStrategy");

module.exports = () => {
	//로그인 성공시 딱 한번 실행되면서 사용자 식별자(아마 쿠키)를 세션 스토어(서버에 위치)에 저장(by egoing)
	passport.serializeUser((user, done) => {
		// 서버쪽에 다음과 같이 저장(메모리에) ; [{ id: 3, cookie: 'asdfgh' }]
		// 프론트(브라우저)로는 쿠키 값만 전달
		// 프론트에서 요청이 들어올 시, 쿠카값을 가지고 어떤 id에 해당하는지 서버가 알 수 있게 된다.
		// console.log("serializeUser - " + user);
    // console.dir(user);
		return done(null, user.user_id);
	});

	// 프론트에서 요청이 들어올때마다 실행되는건 deserializeUser
	// 그 저장된 사용자 식별 데이터를 기준으로 우리가 필요한 사용자 정보를 조회할 때 사용하는게 deserializeUser
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await db.User.findOne({
				where: { user_id: id },
				include: [
					{
						model: db.Post,
						as: "Posts",
						attributes: ["id"]
					},
					{
						model: db.Post,
						as: "Liked",
						attributes: ["id"]
					}
				]
      });
      console.log("deserializeUser - " + id);
			console.log("deserializeUser - " + user);
			//return 사용 안해도 무방하지만 해당 코드 뒤에 더 실행되는 부분이 없다는 것을 확실히 하기 위해 return 웬만하면 사용 추천(by ZeroCho)
			// 그러나 async 함수는 return은 사용 안해도 되는건지 확실하지 않다.(by ZeroCho)
			return done(null, user.dataValues); // req.user에 저장된다
		} catch (e) {
			console.error(e);
			return done(e);
		}
	});

	kakao();
};

// 프론트에서 서버로는 cookie만 보내요(asdfgh)
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
// id: 3이 deserializeUser에 들어감
// req.user로 사용자 정보가 들어감

// 요청 보낼때마다 deserializeUser가 실행됨(db 요청 1번씩 실행)
// 실무에서는 deserializeUser 결과물 캐싱 ; 서버로 요청을 줄이기 위함
