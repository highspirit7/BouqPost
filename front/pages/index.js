import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Row, Col } from "antd";
import Link from "next/link";
import styled from "styled-components";
import ThumbnailCmp from "../components/main/ThumbnailCmp";

import {
	LOAD_POSTS_REQUEST,
	REMOVE_POST_REQUEST,
	LOAD_RANDOM_POSTS_REQUEST,
	UNLIKE_POST_REQUEST,
	LIKE_POST_REQUEST
} from "../redux/modules/post";
import PostForMain from "../components/main/PostForMain";

const ThumbnailWrapper = styled.div`
	margin: 0 auto;
	margin-bottom: 2em;
	display: flex;
	justify-content: center;

	@media (max-width: 1024px) {
		margin-bottom: 1.4em;
	}

	.desktop {
		width: 96%;

		@media (max-width: 1024px) {
			display: none;
		}
	}

	.tablet {
		width: 100%;

		@media (max-width: 414px) {
			display: none;
		}
		@media (min-width: 1024px) {
			display: none;
		}
	}

	.mobile {
		width: 100%;
		@media (min-width: 414px) {
			display: none;
		}
	}
`;

const Categories = styled.div`
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	padding: 20px;

	span {
		display: block;
		width: fit-content;
		font-size: 1rem;
		padding: 2px 10px;
		margin: 5px 0;
	}
`;

const ResponsiveCategories = styled.div`
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	padding: 20px;
	margin-bottom: 1.4em;

	span {
		width: fit-content;
		font-size: 1rem;
		padding: 2px 10px;
		margin: 5px 3px;
	}

	@media (min-width: 1024px) {
		display: none;
	}
`;

const ContentsWrapper = styled.div`
	width: 94%;
	margin: 0 auto;

	@media (max-width: 1024px) {
		width: 100%;
	}

	.desktop {
		@media (max-width: 1024px) {
			display: none;
		}
	}

	.tablet {
		@media (min-width: 1024px) {
			display: none;
		}
	}
`;

const Main = () => {
	const { myInfo } = useSelector(state => state.user);
	const { displayedPosts, hasMorePost, randomPosts } = useSelector(state => state.post);
	const { providedCategories, colors } = useSelector(state => state.categories);
	const categoryKeys = Object.keys(providedCategories);
	const categoryValues = Object.values(providedCategories);

	const dispatch = useDispatch();
	const countRef = useRef([]);

	const categoryItems = categoryKeys.map((params, i) => {
		return (
			<Link key={params} href="/category/[category_name]" as={`/category/${params}`}>
				<a>
					<Tag color={colors[i]} style={{ cursor: "pointer" }}>
						{/* 객체 내부에 params라는 키값은 없고 params라는 변수가 담고 있는 스트링이 키값이 된다 이러한 경우에는 []를 써서 객체의 value에 접근해야 한다. */}
						{providedCategories[params]}
					</Tag>
				</a>
			</Link>
		);
	});

	//포스트 하나 제거
	const onRemovePost = useCallback(
		postId => () => {
			dispatch({
				type: REMOVE_POST_REQUEST,
				postId
			});
		},
		[dispatch]
	);

	const onToggleLike = useCallback(
		(id, liked, post) => () => {
			if (!id) {
				return alert("로그인이 필요합니다!");
			}
			if (liked) {
				// 좋아요 누른 상태
				dispatch({
					type: UNLIKE_POST_REQUEST,
					postId: post.id
				});
			} else {
				// 좋아요 안 누른 상태
				dispatch({
					type: LIKE_POST_REQUEST,
					postId: post.id
				});
			}
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
				<Row gutter={20} className="desktop" style={{ marginRight: 0, marginLeft: 0 }}>
					{randomPosts.map(post => (
						<Col className="gutter-row" span={6} key={post.id}>
							<ThumbnailCmp post={post} />
						</Col>
					))}
				</Row>
				<Row className="tablet" style={{ marginRight: 0, marginLeft: 0 }}>
					<Col span={11} key={randomPosts[0].id} style={{ float: "left" }}>
						<ThumbnailCmp post={randomPosts[0]} />
					</Col>
					<Col span={11} key={randomPosts[1].id} style={{ float: "right" }}>
						<ThumbnailCmp post={randomPosts[1]} />
					</Col>
				</Row>
				<Row className="mobile">
					<ThumbnailCmp post={randomPosts[0]} />
				</Row>
			</ThumbnailWrapper>
			<ContentsWrapper>
				<ResponsiveCategories>{categoryItems}</ResponsiveCategories>
				<Row gutter={20}>
					<Col className="gutter-row desktop" span={18}>
						{displayedPosts.map((post, index) => {
							return (
								<PostForMain
									post={post}
									key={index}
									categoryKeys={categoryKeys}
									categoryValues={categoryValues}
									colors={colors}
									myInfo={myInfo}
									onRemovePost={onRemovePost}
									onToggleLike={onToggleLike}
								/>
							);
						})}
					</Col>
					<Col className="gutter-row tablet" span={24}>
						{displayedPosts.map((post, index) => {
							return (
								<PostForMain
									post={post}
									key={index}
									categoryKeys={categoryKeys}
									categoryValues={categoryValues}
									colors={colors}
									myInfo={myInfo}
									onRemovePost={onRemovePost}
									onToggleLike={onToggleLike}
								/>
							);
						})}
					</Col>
					<Col className="gutter-row desktop" span={6}>
						<Categories>
							<h2>카테고리 별로 보기</h2>
							{categoryItems}
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
	context.store.dispatch({
		type: LOAD_RANDOM_POSTS_REQUEST
	});
};

export default Main;
