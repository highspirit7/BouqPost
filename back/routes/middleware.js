//공통적으로 사용될 수 있는 부분을 따로 미들웨어로 제작
exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).send("로그인이 필요합니다.");
	}
};

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.status(401).send("로그인한 사용자는 접근할 수 없습니다.");
	}
};
