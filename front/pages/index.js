import React from "react";
import { Tag, Icon, Row, Col, Divider } from "antd";
import styled from "styled-components";
import ThumbnailCmp from "../components/ThumbnailCmp";
import randomcolor from "randomcolor";

//더미 데이터
const posts = [
	[
		{
			title: "Nah2(나이)가 들면서 친구 사귀기가 어렵다고? Nah!",
			description: "오래된 친구에게 연락. 까짓 거 한번 시도해보세요!",
			like: 3,
			author: "졸꾸러기",
			poster: "GrownUprince",
			tags: ["서평", "자기계발"],
			img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1570279036/noticon/jl36nfr73kf3siyjcp56.jpg",
			date: "10월 10일"
		},
		{
			title: "Nah2(나이)가 들면서 친구 사귀기가 어렵다고? Nah!",
			description: "오래된 친구에게 연락. 까짓 거 한번 시도해보세요!",
			like: 3,
			author: "졸꾸러기",
			poster: "GrownUprince",
			tags: ["서평", "자기계발"],
			img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1569898129/noticon/x8e3entin2axlgquvx8k.png",
			date: "10월 10일"
		}
	],
	[
		{
			title: "BTS 유엔연설문 안부러운 'BesTSelf 쓰기'",
			description: "오래된 친구에게 연락. 까짓 거 한번 시도해보세요!",
			like: 3,
			author: "마음챙김",
			poster: "GrownUprince",
			tags: ["서평", "자기계발"],
			img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1566913092/noticon/gci2ok6bmv35foix59iw.png",
			date: "10월 9일"
		}
	]
];

const ThumbnailWrapper = styled.div`
	width: 94%;
	// display: flex;
	// justify-content: space-between;
	margin: 0 auto;
	margin-bottom: 2em;
`;

const Categories = styled.div`
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	// width: 20%;
	padding: 20px;

	span {
		display: block;
		width: fit-content;
		font-size: 1rem;
		padding: 2px 10px;
		margin: 5px 0;
	}
`;

const ContentsWrapper = styled.div`
	width: 94%;
	// display: flex;
	// justify-content: space-between;
	margin: 0 auto;
`;

const randomColors = randomcolor({
	count: 10
});

const StyledPostbox = styled.div`
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	padding: 18px;
	// height: 240px;
	// display: flex;
	// align-items: center;
	margin-bottom: 16px;

	img {
		width: 200px;
    height: 128px;
    margin-right: 12px;
	}

	.contents {
		display: inline-block;
	}

	.likeBtn {
		border: 1px solid rgb(147, 149, 153, 0.6);
		border-radius: 20px;
		margin-right: 14px;
  }
  
  h1 {
    font-size: 24px;
  }
`;

const Main = () => {
	return (
		<div>
			<ThumbnailWrapper>
				<Row gutter={20}>
					<Col className="gutter-row" span={6}>
						<ThumbnailCmp />
					</Col>
					<Col className="gutter-row" span={6}>
						<ThumbnailCmp />
					</Col>
					<Col className="gutter-row" span={6}>
						<ThumbnailCmp />
					</Col>
					<Col className="gutter-row" span={6}>
						<ThumbnailCmp />
					</Col>
				</Row>
			</ThumbnailWrapper>
			<ContentsWrapper>
				<Row gutter={20}>
					<Col className="gutter-row" span={18}>
						{posts.map((postsByDate, index) => {
							return (
								<StyledPostbox key={postsByDate[0].date}>
									<h1>{postsByDate[0].date}</h1>
									{postsByDate.map((post, i) => (
										<>
											<div key={i} style={{ display: "flex", alignItems: "center" }}>
												<img src={post.img} alt="post_thumbnail" />
												<div className="contents">
													<div>
														{post.tags.map((tag, i) => (
															<Tag color={randomColors[i]} key={tag}>
																{tag}
															</Tag>
														))}
													</div>
													<h2>{post.title}</h2>
													<p>{post.description}</p>
													<div>
														<button className="likeBtn">
															{" "}
															<Icon type="heart" theme="filled" />
															<span style={{ marginLeft: 6 }}>{post.like}</span>
														</button>

														<span style={{ marginRight: 14 }}>작성자 : {post.author}</span>
														<span>posted by {post.poster}</span>
													</div>
												</div>
											</div>
											{postsByDate.length - 1 !== i && <Divider />}
										</>
									))}
								</StyledPostbox>
							);
						})}
					</Col>
					<Col className="gutter-row" span={6}>
						<Categories>
							<h2>카테고리 별로 보기</h2>
							<Tag color={randomColors[0]}>졸꾸</Tag>
							<Tag color={randomColors[1]}>서평</Tag>
							<Tag color={randomColors[2]}>역사</Tag>
							<Tag color={randomColors[3]}>경제 / 경영</Tag>
							<Tag color={randomColors[4]}>문화</Tag>
							<Tag color={randomColors[5]}>IT</Tag>
							<Tag color={randomColors[6]}>철학</Tag>
							<Tag color={randomColors[7]}>에세이</Tag>
							<Tag color={randomColors[8]}>과학</Tag>
							<Tag color={randomColors[9]}>예술</Tag>
						</Categories>
					</Col>
				</Row>
			</ContentsWrapper>
		</div>
	);
};

export default Main;
