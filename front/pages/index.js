import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Icon, Row, Col, Popconfirm } from "antd";
import Link from "next/link";
import styled from "styled-components";
import ThumbnailCmp from "../components/ThumbnailCmp";
import TimeAgo from "react-timeago";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import { LOAD_POSTS_REQUEST, REMOVE_POST_REQUEST } from "../redux/modules/post";

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
	}

	h1 {
		font-size: 24px;
	}

	p {
		color: #939599;
		cursor: pointer;
	}

	p:hover {
		color: #2b2a28;
	}
`;

const Poster = styled.div`
	margin: 0 10px;
	padding: 0 10px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

const UserName = styled.a`
	color: rgba(0, 0, 0, 0.65);
	font-weight: 500;
	:hover {
		color: #5cd12a;
	}
`;

const EditBtn = styled.a`
	margin-left: 14px;
	padding-right: 10px;
	padding-left: 10px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	border-left: 1px solid rgba(0, 0, 0, 0.1);
	color: rgba(0, 0, 0, 0.65);

	:hover {
		color: #326ada;
	}
`;

const DeleteBtn = styled.div`
	margin-left: 10px;
	cursor: pointer;

	color: rgba(0, 0, 0, 0.65);
	:hover {
		color: #fc3468;
	}
`;

const Main = () => {
	const [liked, setLike] = useState(false);
	const { myInfo } = useSelector(state => state.user);
	const { displayedPosts, hasMorePost } = useSelector(state => state.post);
	const { providedCategories, colors } = useSelector(state => state.categories);
	const categoryKeys = Object.keys(providedCategories);
	const categoryValues = Object.values(providedCategories);

	const dispatch = useDispatch();
	const countRef = useRef([]);

	const formatter = buildFormatter(koreanStrings);

	const showDefaultImg = event => {
		event.target.src = "/bbakdok.png";
		event.target.title =
			"해당 링크에서 이미지를 적절한 이미지를 추출하지 못했거나 간혹 이미지를 로드하지 못하는 에러 시 기본 이미지가 출력됩니다";
	};

	const onRemovePost = useCallback(
		postId => () => {
			dispatch({
				type: REMOVE_POST_REQUEST,
				postId
			});
		},
		[dispatch]
	);

	const onScroll = useCallback(() => {
		//scrollY : 스크롤 내린 거리, clientHeight: 화면 높이, scrollHeight: 전체 화면 높이
		if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
			if (hasMorePost) {
				const lastId = displayedPosts.length > 0 ? displayedPosts[displayedPosts.length - 1].id : 0; //제일 하단 게시물의 id

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
	}, [hasMorePost, dispatch, displayedPosts]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [displayedPosts.length, onScroll]);

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
											<img
												src={
													post.thumbnail
														? `https://images.weserv.nl/?url=ssl:${post.thumbnail.slice(8)}&w=200&h=128`
														: "/bbakdok.png"
												}
												onError={showDefaultImg}
												alt="thumbnail_img"
											/>
										</a>
										<div className="contents">
											<div>
												{post.Categories.map(category => {
													const indexInCategories = categoryValues.indexOf(category.name);

													return (
														<Link key={category.name} href={`/category/${categoryKeys[indexInCategories]}`}>
															<a>
																<Tag color={colors[indexInCategories]} style={{ curosr: "pointer" }}>
																	{category.name}
																</Tag>
															</a>
														</Link>
													);
												})}
											</div>
											<a
												href={post.link}
												target="blank"
												rel="noopener noreferrer"
												style={{
													color: "#2b2a28",
													fontSize: 20,
													fontWeight: 500
												}}>
												{post.title}
											</a>
											{post.description ? (
												<a href={post.link} target="blank" rel="noopener noreferrer">
													<p style={{ marginTop: 2, fontSize: 16 }}>{post.description}</p>
												</a>
											) : (
												<p style={{ marginTop: 6 }}></p>
											)}

											<div style={{ display: "flex", alignItems: "center" }}>
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

												<Poster>
													Posted by{" "}
													<Link href={`/user/${post.UserId}`}>
														<UserName style={{}}>{post.User.nickname}</UserName>
													</Link>
												</Poster>

												<div>
													<TimeAgo date={post.created_at} formatter={formatter}></TimeAgo>
												</div>
												{myInfo && myInfo.id === post.UserId && (
													<>
														<Link href={`/editPost/${post.id}`}>
															<EditBtn>수정</EditBtn>
														</Link>

														<Popconfirm
															title="정말 삭제하시겠습니까?"
															okText="Yes"
															cancelText="No"
															onConfirm={onRemovePost(post.id)}>
															<DeleteBtn>삭제</DeleteBtn>
														</Popconfirm>
													</>
												)}
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
							{categoryKeys.map((params, i) => {
								return (
									<Link key={params} href={`/category/${params}`}>
										<a>
											<Tag color={colors[i]} style={{ cursor: "pointer" }}>
												{/* 객체 내부에 params라는 키값은 없고 params라는 변수가 담고 있는 스트링이 키값이 된다 이러한 경우에는 []를 써서 객체의 value에 접근해야 한다. */}
												{providedCategories[params]}
											</Tag>
										</a>
									</Link>
								);
							})}
						</Categories>
					</Col>
				</Row>
			</ContentsWrapper>
		</div>
	);
};

Main.propTypes = {};

Main.getInitialProps = async context => {
	context.store.dispatch({
		type: LOAD_POSTS_REQUEST
	});
};

export default Main;
