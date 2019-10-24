import React, { useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import propTypes from "prop-types";
// import Router from "next/router";
import { Divider } from "antd";
import styled from "styled-components";

import {
	LOAD_USER_POSTS_REQUEST,
	REMOVE_POST_REQUEST,
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST
} from "../../redux/modules/post";
import PostForOthers from "../../components/PostForOthers";

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

const User = ({ user_id }) => {
	const dispatch = useDispatch();
	const { displayedPosts, hasMorePost, countPosts } = useSelector(state => state.post);
	const { providedCategories, colors } = useSelector(state => state.categories);
	const { myInfo } = useSelector(state => state.user);
	const categoryKeys = Object.keys(providedCategories);
	const categoryValues = Object.values(providedCategories);

	const countRef = useRef([]);

	// const router = useRouter();
	// const { category_name } = router.query;

	// useEffect(() => {
	// 	dispatch({
	// 		type: LOAD_CATEGORY_POSTS_REQUEST,
	// 		category: category_name
	// 	});
	// }, [dispatch, category_name]);

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
      console.log("displayedPosts length : " + displayedPosts.length);
      console.log(hasMorePost);
			if (hasMorePost) {
			
				const lastId = displayedPosts.length > 0 ? displayedPosts[displayedPosts.length - 1].id : 0; //제일 하단 게시물의 id
				console.log("lastId " + lastId);
				//프론트단에서 불필요하게 액션이 디스패치되는 것을 막기 위해
				//사가상으로는 상관없지만(쓰로틀링으로인해 사가에서는 인식하고 처리하는 액션은 1.5초에 하나) 리덕스 상에서 액션이 중복실행되는 현상 방지용
				//lastId가 countRef에 담겨 있으면(이미 해당 액션이 한 번은 디스패치되었다는 의미), 더 이상 포스트 로드 요청하는 액션 디스패치하지 않도록 해준다.
				// console.log("lastId : " + lastId);

				if (!countRef.current.includes(lastId)) {
					dispatch({
						type: LOAD_USER_POSTS_REQUEST,
						user_id,
						lastId
					});
					countRef.current.push(lastId);
				}
			}
		}
	}, [hasMorePost, dispatch, displayedPosts, user_id]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [displayedPosts.length, onScroll]);

	// console.log("카테고리 : " + category_name);
	// useEffect(() => {
	// 	dispatch({
	// 		type: LOAD_CATEGORY_POSTS_REQUEST,
	// 		category: category_name
	// 	});
	// }, []);

	return (
		<>
			{displayedPosts.length !== 0 ? (
				<StyledPostbox>
					<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
						<h1 style={{ fontSize: 28 }}>{displayedPosts[0].User.nickname}</h1>
						<h1>{`${countPosts}개의 포스트`}</h1>
						<Divider style={{ marginTop: "6px", marginBottom: "20px" }} dashed />
					</div>

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
			) : (
				<NoResultMsg>{displayedPosts.length === 0 && `- 해당 사용자의 포스트가 존재하지 않습니다 -`}</NoResultMsg>
			)}
		</>
	);
};

User.propTypes = {
	user_id: propTypes.string
};

User.getInitialProps = async context => {
	const user_id = context.query.user_id;
	// console.log("Search querystring : ", keyword);
	if (user_id !== "undefined") {
		context.store.dispatch({
			type: LOAD_USER_POSTS_REQUEST,
			user_id
		});
	}

	//리턴값은 지금 이 컴포넌트에 props로 전달된다.
	return { user_id };
};

export default User;
