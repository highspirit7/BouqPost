module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		"User",
		{
			// 테이블명은 users
			user_id: {
				type: DataTypes.STRING(40),
				allowNull: false,
				unique: true
			},
			nickname: {
				type: DataTypes.STRING(20),
        allowNull: false
			},
			thumbnail_img: {
				type: DataTypes.STRING,
        allowNull: false
			}
		},
		{
			charset: "utf8",
			collate: "utf8_general_ci" // 한글이 저장돼요
		}
	);

	User.associate = db => {
		db.User.hasMany(db.Post, { as: "Posts" });

		db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
	};

	return User;
};
