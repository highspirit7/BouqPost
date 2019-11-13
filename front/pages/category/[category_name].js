import React, { useEffect, useCallback, useRef } from "react";
// import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import propTypes from "prop-types";
// import Router from "next/router";
import { Divider, Spin, Icon } from "antd";

import { StyledPostbox } from "../../styledcomponents/post";
import {
	LOAD_CATEGORY_POSTS_REQUEST,
	REMOVE_POST_REQUEST,
	LIKE_POST_REQUEST,
	UNLIKE_POST_REQUEST
} from "../../redux/modules/post";
import PostForOthers from "../../components/PostForOthers";
import { NoResultMsg } from "../../styledcomponents/etc";

const Category = ({ category_name }) => {
	const dispatch = useDispatch();
	const { displayedPosts, hasMorePost, isSearchingPosts } = useSelector(state => state.post);
	const { providedCategories, colors } = useSelector(state => state.categories);
	const { myInfo } = useSelector(state => state.user);
	const categoryKeys = Object.keys(providedCategories);
	const categoryValues = Object.values(providedCategories);

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
			if (hasMorePost) {
				const lastId = displayedPosts.length > 0 ? displayedPosts[displayedPosts.length - 1].id : 0; //제일 하단 게시물의 id

				//프론트단에서 불필요하게 액션이 디스패치되는 것을 막기 위해
				//사가상으로는 상관없지만(쓰로틀링으로인해 사가에서는 인식하고 처리하는 액션은 1.5초에 하나) 리덕스 상에서 액션이 중복실행되는 현상 방지용
				//lastId가 countRef에 담겨 있으면(이미 해당 액션이 한 번은 디스패치되었다는 의미), 더 이상 포스트 로드 요청하는 액션 디스패치하지 않도록 해준다.
				// console.log("lastId : " + lastId);

				if (!countRef.current.includes(lastId)) {
					dispatch({
						type: LOAD_CATEGORY_POSTS_REQUEST,
						category: category_name,
						lastId
					});
					countRef.current.push(lastId);
				}
			}
		}
	}, [hasMorePost, dispatch, displayedPosts, category_name]);

	useEffect(() => {
		window.addEventListener("scroll", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, [displayedPosts.length, onScroll]);

	const loadingIcon = <Icon type="loading" style={{ fontSize: 48, color: "#939599" }} spin />;

	return (
		<Spin spinning={isSearchingPosts} indicator={loadingIcon}>
			{displayedPosts.length !== 0 ? (
				<StyledPostbox>
					<h1>{`'${providedCategories[category_name]}' 카테고리의 포스트`}</h1>
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
				<NoResultMsg>
					{!isSearchingPosts && displayedPosts.length === 0 && "- 현재 카테고리에 포스트가 존재하지 않습니다 -"}
				</NoResultMsg>
			)}
		</Spin>
	);
};

Category.propTypes = {
	category_name: propTypes.string.isRequired
};

Category.getInitialProps = async context => {
	const category_name = context.query.category_name;
	// console.log("Search querystring : ", keyword);
	if (category_name !== "undefined") {
		context.store.dispatch({
			type: LOAD_CATEGORY_POSTS_REQUEST,
			category: category_name
		});
	}

	return { category_name };
};

export default Category;
