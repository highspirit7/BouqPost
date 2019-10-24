import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import propTypes from "prop-types";
import { Input, Divider } from "antd";
import styled from "styled-components";
import Router from "next/router";

import {
	REMOVE_POST_REQUEST,
	SEARCH_POSTS_REQUEST,
	CLEAR_DISPLAYED_POSTS,
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST
} from "../redux/modules/post";
import PostForOthers from "../components/PostForOthers";

const { Search } = Input;

const StyledSearch = styled(Search)`
	width: 82%;
	display: block;
	margin: 0 auto;
	margin-bottom: 30px;

	input {
		height: 40px;
		font-size: 18px;
	}

	svg {
		width: 1.3em;
		height: 1.3em;
	}
`;

const StyledPostbox = styled.div`
	width: 82%;
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	padding: 22px;
	// height: 240px;
	// display: flex;
	// align-items: center;
	margin: 0 auto;
	margin-bottom: 16px;

	h1 {
		font-size: 24px;
	}
`;

const NoResultMsg = styled.div`
	text-align: center;
	font-size: 30px;
	margin-top: 70px;
	color: #939599;
`;

const SearchPage = ({ keyword }) => {
	const { displayedPosts, hasMorePost } = useSelector(state => state.post);

	const { providedCategories, colors } = useSelector(state => state.categories);
	const { myInfo } = useSelector(state => state.user);
	const categoryKeys = Object.keys(providedCategories);
	const categoryValues = Object.values(providedCategories);

	const dispatch = useDispatch();

	// 아래 함수를 직접 Search 컴포넌트의 onSearch에 넣어줬었는데 동작하질 않았다.
	// 아마 useCallback 때문인 것인지 원인은 모르지만 그래서 함수 안 쓰고 직접 onSearch에 라우팅 코드를 삽입했다.
	// const searchRequest = useCallback(
	// 	keyword => () => {
	// 		console.log(keyword);
	// 		Router.push({
	// 			pathname: "/search",
	// 			query: {
	// 				q: encodeURIComponent(keyword)
	// 			}
	// 		});
	// 	},
	// 	[]
	// );

	const countRef = useRef([]);

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
			// console.log("displayedPosts length : " + displayedPosts.length);
			// console.log(hasMorePost);
			if (hasMorePost) {
				const lastId = displayedPosts.length > 0 ? displayedPosts[displayedPosts.length - 1].id : 0; //제일 하단 게시물의 id
				// console.log("lastId " + lastId);
				//프론트단에서 불필요하게 액션이 디스패치되는 것을 막기 위해
				//사가상으로는 상관없지만(쓰로틀링으로인해 사가에서는 인식하고 처리하는 액션은 1.5초에 하나) 리덕스 상에서 액션이 중복실행되는 현상 방지용
				//lastId가 countRef에 담겨 있으면(이미 해당 액션이 한 번은 디스패치되었다는 의미), 더 이상 포스트 로드 요청하는 액션 디스패치하지 않도록 해준다.
				if (!countRef.current.includes(lastId)) {
					dispatch({
						type: SEARCH_POSTS_REQUEST,
						keyword,
						lastId
					});
					countRef.current.push(lastId);
				}
			}
		}
	}, [hasMorePost, dispatch, keyword, displayedPosts]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [displayedPosts.length, onScroll]);

	return (
		<>
			<StyledSearch
				placeholder="검색어를 입력해주세요"
				onSearch={value =>
					Router.push({
						pathname: "/search",
						query: {
							q: encodeURIComponent(value)
						}
					})
				}
			/>
			{displayedPosts.length !== 0 && (
				<StyledPostbox>
					<h1>검색된 포스트</h1>
					{displayedPosts.map((post, index) => {
						return (
							<div key={index}>
								<PostForOthers
									post={post}
									key={index}
									categoryKeys={categoryKeys}
									categoryValues={categoryValues}
									colors={colors}
									myInfo={myInfo}
									onRemovePost={onRemovePost}
									onToggleLike={onToggleLike}
								/>
								{index !== displayedPosts.length - 1 && <Divider />}
							</div>
						);
					})}
				</StyledPostbox>
			)}
			<NoResultMsg>{keyword !== "undefined" && displayedPosts.length === 0 && "- 검색 결과가 없습니다 -"}</NoResultMsg>
		</>
	);
};

SearchPage.propTypes = {
	keyword: propTypes.string
};

SearchPage.getInitialProps = async context => {
	const keyword = decodeURIComponent(context.query.q);
	// console.log("Search querystring : ", keyword);
	context.store.dispatch({
		type: CLEAR_DISPLAYED_POSTS
	});

	if (keyword !== "undefined") {
		context.store.dispatch({
			type: SEARCH_POSTS_REQUEST,
			keyword
		});
	}

	//리턴값은 지금 이 컴포넌트에 props로 전달된다.
	return { keyword };
};

export default SearchPage;
