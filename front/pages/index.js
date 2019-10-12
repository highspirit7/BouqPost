import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tag, Icon, Row, Col, Divider } from "antd";
import styled from "styled-components";
import ThumbnailCmp from "../components/ThumbnailCmp";
import { LOAD_CATEGORIES } from "../redux/modules/categories";

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
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch({
			type: LOAD_CATEGORIES
		});
	}, []);

	const [liked, setLike] = useState(false);
	const { mainPosts } = useSelector(state => state.post);
	const { categories, colors } = useSelector(state => state.categories);

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
						{mainPosts.map((postsByDate, index) => {
							return (
								<StyledPostbox key={index}>
									<h1>{postsByDate[0] && postsByDate[0].date}</h1>
									{postsByDate.map((post, i) => (
										<div key={i}>
											<div style={{ display: "flex", alignItems: "center" }}>
												<img src={post.img} alt="post_thumbnail" />
												<div className="contents">
													<div>
														{post.categories.map(tag => {
															const indexInCategories = categories.indexOf(tag);
															return (
																<Tag color={colors[indexInCategories]} key={tag}>
																	{tag}
																</Tag>
															);
														})}
													</div>
													<h2>{post.title}</h2>
													<p>{post.description}</p>
													<div>
														<button className="likeBtn">
															{" "}
															<Icon
																type="heart"
																theme={liked ? "twoTone" : "outlined"}
																twoToneColor="#eb2f96"
																onClick={() => setLike(!liked)}
															/>
															{post.like !== 0 && <span style={{ marginLeft: 6 }}>{post.like}</span>}
														</button>

														<span style={{ marginRight: 14 }}>작성자 : {post.author}</span>
														<span>posted by {post.user.nickname}</span>
													</div>
												</div>
											</div>
											{postsByDate.length - 1 !== i && <Divider />}
										</div>
									))}
								</StyledPostbox>
							);
						})}
					</Col>
					<Col className="gutter-row" span={6}>
						<Categories>
							<h2>카테고리 별로 보기</h2>
							{categories.map((category, i) => {
								return (
									<Tag color={colors[i]} key={category}>
										{category}
									</Tag>
								);
							})}
						</Categories>
					</Col>
				</Row>
			</ContentsWrapper>
		</div>
	);
};

export default Main;
