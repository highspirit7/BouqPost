import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Icon, Row, Col, Divider } from "antd";
import styled from "styled-components";
import ThumbnailCmp from "../components/ThumbnailCmp";
import moment from "moment";
import { LOAD_POSTS_REQUEST } from "../redux/modules/post";

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
	padding: 22px;
	// height: 240px;
	// display: flex;
	// align-items: center;
	margin-bottom: 16px;

	img {
		width: 186px;
		height: 112px;
		margin-right: 16px;
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
	const [liked, setLike] = useState(false);
	const { displayedPosts, hasMorePost } = useSelector(state => state.post);
	const { providedCategories, colors } = useSelector(state => state.categories);

	const dispatch = useDispatch();
	const countRef = useRef([]);

	const onScroll = useCallback(() => {
		//scrollY : 스크롤 내린 거리, clientHeight: 화면 높이, scrollHeight: 전체 화면 높이
		if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
			if (hasMorePost) {
				const lastId = displayedPosts[displayedPosts.length - 1].id; //제일 하단 게시물의 id

				//프론트단에서 불필요하게 액션이 디스패치되는 것을 막기 위해
				//사가상으로는 상관없지만(쓰로틀링으로인해 사가에서는 인식하고 처리하는 액션은 1.5초에 하나) 리덕스 상에서 액션이 중복실행되는 현상 방지용
				//lastId가 countRef에 담겨 있으면(이미 해당 액션이 한 번은 디스패치되었다는 의미), 더 이상 포스트 로드 요청하는 액션 디스패치하지 않도록 해준다.
				if (!countRef.current.includes(lastId)) {
					dispatch({
						type: LOAD_POSTS_REQUEST,
						lastId
					});
					countRef.current.push(lastId);
				}
				// dispatch({
				//   type: LOAD_MAIN_POSTS_REQUEST,
				//   lastId
				// });
			}
		}
	}, [hasMorePost, displayedPosts.length]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [displayedPosts.length]);

	useEffect(() => {
		dispatch({
			type: LOAD_POSTS_REQUEST
		});
	}, []);

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
						{displayedPosts.map((post, index) => {
							return (
								<StyledPostbox key={index}>
									<div style={{ display: "flex", alignItems: "center" }}>
										<a href={post.link} target="_blank" rel="noopener noreferrer">
											<img src={post.thumbnail || "/bbakdok.png"} alt="post_thumbnail" />
										</a>
										<div className="contents">
											<div>
												{post.Categories.map(category => {
													const indexInCategories = providedCategories.indexOf(category.name);
													return (
														<Tag color={colors[indexInCategories]} key={category.name}>
															{category.name}
														</Tag>
													);
												})}
											</div>
											<a href={post.link} target="blank" rel="noopener noreferrer">
												<h2>{post.title}</h2>
											</a>

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
													{post.Likers.length !== 0 && <span style={{ marginLeft: 6 }}>{post.Likers.length}</span>}
												</button>
												<span>posted by {post.User.nickname}</span>
											</div>
										</div>
									</div>
								</StyledPostbox>
							);
						})}
					</Col>
					<Col className="gutter-row" span={6}>
						<Categories>
							<h2>카테고리 별로 보기</h2>
							{providedCategories.map((category, i) => {
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
