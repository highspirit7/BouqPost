import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Row, Col } from "antd";
import Link from "next/link";
import styled from "styled-components";
import ThumbnailCmp from "../components/index/ThumbnailCmp";

import MainPosts from "../components/index/MainPosts";
import { LOAD_POSTS_REQUEST, REMOVE_POST_REQUEST, LOAD_RANDOM_POSTS_REQUEST } from "../redux/modules/post";

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

const Main = () => {
	const [liked, setLike] = useState(false);
	const { myInfo } = useSelector(state => state.user);
	const { displayedPosts, hasMorePost, randomPosts } = useSelector(state => state.post);
	const { providedCategories, colors } = useSelector(state => state.categories);
	const categoryKeys = Object.keys(providedCategories);
	const categoryValues = Object.values(providedCategories);

	const dispatch = useDispatch();
	const countRef = useRef([]);

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
					{randomPosts.map(post => (
						<Col className="gutter-row" span={6} key={post.title}>
							<ThumbnailCmp post={post} />
						</Col>
					))}
				</Row>
			</ThumbnailWrapper>
			<ContentsWrapper>
				<Row gutter={20}>
					<Col className="gutter-row" span={18}>
						{displayedPosts.map((post, index) => {
							return (
								<MainPosts
									post={post}
									key={index}
									categoryKeys={categoryKeys}
                  categoryValues={categoryValues}
                  colors={colors}
                  myInfo={myInfo}
                  onRemovePost={onRemovePost} />
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
	context.store.dispatch({
		type: LOAD_RANDOM_POSTS_REQUEST
	});
};

export default Main;
