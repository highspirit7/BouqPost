module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		"Post",
		{
			// 테이블명은 posts
			title: {
				type: DataTypes.STRING, // VARCHAR(255)
				allowNull: false
			},
			description: {
				type: DataTypes.TEXT
			},
			author: {
				type: DataTypes.STRING(100)
			},
			thumbnail: {
				type: DataTypes.STRING
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: sequelize.literal("now()")
			}
		},
		{
      timestamps: false,
			charset: "utf8mb4", //  한글+이모티콘
			collate: "utf8mb4_general_ci"
		}
	);
	Post.associate = db => {
		//belongsTo의 경우에는 child모델의 입장에서 parent 모델의 정보가 필요할때 사용
		//외래 키 자동 생성의 대원칙은 [target 모델의 이름 + target 모델의 주요 키 이름]. 그래서 테이블에 UserId 컬럼이 생긴다.(belongsTo의 경우)
		db.Post.belongsTo(db.User);

		//테이블간에 다대다 관계가 이루어질 때 중간에 하나의 테이블이 또 생기게 되는데 through로 정의되는 것이 바로 그 중간에 생기는 테이블
		db.Post.belongsToMany(db.Category, { through: "PostCategory" });
		db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
	};
	return Post;
};
