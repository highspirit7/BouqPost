import { createAction, handleActions } from "redux-actions";
import produce from "immer";

export const initialState = {
	displayedPosts: [],
	randomPosts: [],
	countPosts: 0,
	isAddingPost: false,
	isUpdatingPost: false,
	isScraping: false,
	isSearchingPosts: false,
	noResultMsg: "",
	scrapedTitle: "",
	scrapedImg: "",
	errors: {
		scrapingError: "",
		addPostError: "",
		loadPostError: "",
		updatePostError: "",
		removePostError: "",
		searchPostError: "",
		loadRandomPostsError: ""
	},
	loadedPost: {
		link: "",
		title: "",
		description: "",
		category: []
	}
};

// 액션 타입 정의
export const ADD_POST_REQUEST = "post/ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "post/ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "post/ADD_POST_FAILURE";

export const SCRAPING_REQUEST = "post/SCRAPING_REQUEST";
export const SCRAPING_SUCCESS = "post/SCRAPING_SUCCESS";
export const SCRAPING_FAILURE = "post/SCRAPING_FAILURE";

export const LOAD_POSTS_REQUEST = "post/LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "post/LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "post/LOAD_POSTS_FAILURE";

export const LOAD_POST_REQUEST = "post/LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "post/LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "post/LOAD_POST_FAILURE";

export const UPDATE_POST_REQUEST = "post/UPDATE_POST_REQUEST";
export const UPDATE_POST_SUCCESS = "post/UPDATE_POST_SUCCESS";
export const UPDATE_POST_FAILURE = "post/UPDATE_POST_FAILURE";

export const REMOVE_POST_REQUEST = "post/REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "post/REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "post/REMOVE_POST_FAILURE";

export const SEARCH_POSTS_REQUEST = "post/SEARCH_POSTS_REQUEST";
export const SEARCH_POSTS_SUCCESS = "post/SEARCH_POSTS_SUCCESS";
export const SEARCH_POSTS_FAILURE = "post/SEARCH_POSTS_FAILURE";

export const LOAD_CATEGORY_POSTS_REQUEST = "post/LOAD_CATEGORY_POSTS_REQUEST";
export const LOAD_CATEGORY_POSTS_SUCCESS = "post/LOAD_CATEGORY_POSTS_SUCCESS";
export const LOAD_CATEGORY_POSTS_FAILURE = "post/LOAD_CATEGORY_POSTS_FAILURE";

export const CLEAR_DISPLAYED_POSTS = "post/CLEAR_DISPLAYED_POSTS";

export const LOAD_USER_POSTS_REQUEST = "post/LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "post/LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "post/LOAD_USER_POSTS_FAILURE";

export const LOAD_RANDOM_POSTS_REQUEST = "post/LOAD_RANDOM_POSTS_REQUEST";
export const LOAD_RANDOM_POSTS_SUCCESS = "post/LOAD_RANDOM_POSTS_SUCCESS";
export const LOAD_RANDOM_POSTS_FAILURE = "post/LOAD_RANDOM_POSTS_FAILURE";

export const LIKE_POST_REQUEST = "post/LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "post/LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "post/LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "post/UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "post/UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "post/UNLIKE_POST_FAILURE";

// 액션 생성 함수
export const addPostsRequest = createAction(ADD_POST_REQUEST);
export const addPostsSuccess = createAction(ADD_POST_SUCCESS);
export const addPostsFailure = createAction(ADD_POST_FAILURE);
export const scrapingRequest = createAction(SCRAPING_REQUEST);
export const scrapingSuccess = createAction(SCRAPING_SUCCESS);
export const scrapingFailure = createAction(SCRAPING_FAILURE);
export const loadPostsRequest = createAction(LOAD_POSTS_REQUEST);
export const loadPostsSuccess = createAction(LOAD_POSTS_SUCCESS);
export const loadPostsFailure = createAction(LOAD_POSTS_FAILURE);
export const loadPostRequest = createAction(LOAD_POST_REQUEST);
export const loadPostSuccess = createAction(LOAD_POST_SUCCESS);
export const loadPostFailure = createAction(LOAD_POST_FAILURE);
export const updatePostRequest = createAction(UPDATE_POST_REQUEST);
export const updatePostSuccess = createAction(UPDATE_POST_SUCCESS);
export const updatePostFailure = createAction(UPDATE_POST_FAILURE);
export const removePostRequest = createAction(REMOVE_POST_REQUEST);
export const removePostSuccess = createAction(REMOVE_POST_SUCCESS);
export const removePostFailure = createAction(REMOVE_POST_FAILURE);
export const searchPostRequest = createAction(SEARCH_POSTS_REQUEST);
export const searchPostSuccess = createAction(SEARCH_POSTS_SUCCESS);
export const searchPostFailure = createAction(SEARCH_POSTS_FAILURE);
export const loadCategoryPostsRequest = createAction(LOAD_CATEGORY_POSTS_REQUEST);
export const loadCategoryPostsSuccess = createAction(LOAD_CATEGORY_POSTS_SUCCESS);
export const loadCategoryPostsFailure = createAction(LOAD_CATEGORY_POSTS_FAILURE);
export const clearDisplayedPosts = createAction(CLEAR_DISPLAYED_POSTS);
export const loadUserPostsRequest = createAction(LOAD_USER_POSTS_REQUEST);
export const loadUserPostsSuccess = createAction(LOAD_USER_POSTS_SUCCESS);
export const loadUserPostsFailure = createAction(LOAD_USER_POSTS_FAILURE);
export const loadRandomPostsRequest = createAction(LOAD_RANDOM_POSTS_REQUEST);
export const loadRandomPostsSuccess = createAction(LOAD_RANDOM_POSTS_SUCCESS);
export const loadRandomPostsFailure = createAction(LOAD_RANDOM_POSTS_FAILURE);

// immer 를 사용하여 값을 수정하는 리듀서
export default handleActions(
	{
		[ADD_POST_REQUEST]: state =>
			produce(state, draft => {
				draft.isAddingPost = true;
			}),
		[ADD_POST_SUCCESS]: state => {
			produce(state, draft => {
				draft.isAddingPost = false;
			});
		},
		[ADD_POST_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.isAddingPost = false;
				draft.errors.addPostError = payload;
			}),
		[UPDATE_POST_REQUEST]: state =>
			produce(state, draft => {
				draft.isUpdatingPost = true;
			}),
		[UPDATE_POST_SUCCESS]: state => {
			produce(state, draft => {
				draft.isUpdatingPost = false;
			});
		},
		[UPDATE_POST_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.isUpdatingPost = false;
				draft.errors.updatePostError = payload;
			}),
		[SCRAPING_REQUEST]: state =>
			produce(state, draft => {
				draft.isScraping = true;
			}),
		[SCRAPING_SUCCESS]: (state, { payload }) =>
			produce(state, draft => {
				draft.isScraping = false;
				draft.scrapedTitle = payload.title;
				draft.scrapedImg = payload.image;
			}),
		[SCRAPING_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.isScraping = false;
				draft.errors.scrapingError = payload;
			}),
		[LOAD_POSTS_REQUEST]: (state, payload) =>
			produce(state, draft => {
				//lastId가 없으면 페이지에 처음 접속해 포스트 로딩하는 것이기에 displayedPosts 초기값은 비어있게 하고, 그렇지 않은 경우 무한 스크롤로 포스트 추가 로딩하는 것이기에 무한 스크롤하는 그 순간 displyaedPosts 그대로 유지
				draft.displayedPosts = !payload.lastId ? [] : draft.displayedPosts;
				draft.hasMorePost = payload.lastId ? draft.hasMorePost : true;
			}),
		[LOAD_POSTS_SUCCESS]: (state, { payload }) =>
			produce(state, draft => {
				payload.forEach(post => {
					draft.displayedPosts.push(post);
				});
				//로딩한 포스트 개수가 5개가 아니라는 것은 실질적으로는 5개보다 작았다는 것이고, 그러면 남아있는 포스트를 모두 이미 로딩했다는 뜻이 된다.
				draft.hasMorePost = payload.length === 5;
			}),
		[LOAD_POSTS_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.errors.loadPostError = payload;
			}),
		[LOAD_POST_SUCCESS]: (state, { payload }) =>
			produce(state, draft => {
				draft.loadedPost.link = payload.link;
				draft.loadedPost.title = payload.title;
				draft.loadedPost.description = payload.description;
				draft.loadedPost.category = payload.Categories.map(category => category.name);
			}),
		[LOAD_POST_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.errors.loadPostError = payload;
			}),
		[REMOVE_POST_SUCCESS]: (state, payload) =>
			produce(state, draft => {
				const index = draft.displayedPosts.findIndex(post => post.id === payload.data);
				draft.displayedPosts.splice(index, 1);
			}),
		[REMOVE_POST_FAILURE]: (state, payload) =>
			produce(state, draft => {
				draft.errors.removePostError = payload.error;
			}),
		[SEARCH_POSTS_REQUEST]: (state, payload) =>
			produce(state, draft => {
				draft.displayedPosts = !payload.lastId ? [] : draft.displayedPosts;
				draft.hasMorePost = payload.lastId ? draft.hasMorePost : true;
				// draft.isSearchingPosts = payload.lastId ? true : false;
			}),
		[SEARCH_POSTS_SUCCESS]: (state, { payload }) =>
			produce(state, draft => {
				payload.forEach(post => {
					draft.displayedPosts.push(post);
				});

				//로딩한 포스트 개수가 5개가 아니라는 것은 실질적으로는 5개보다 작았다는 것이고, 그러면 남아있는 포스트를 모두 이미 로딩했다는 뜻이 된다.
				draft.hasMorePost = payload.length === 5;
				// draft.isSearchingPosts = false;
			}),
		[SEARCH_POSTS_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.errors.searchPostError = payload;
				// draft.isSearchingPosts = false;
			}),
		[LOAD_CATEGORY_POSTS_REQUEST]: (state, payload) =>
			produce(state, draft => {
				draft.displayedPosts = !payload.lastId ? [] : draft.displayedPosts;
				draft.hasMorePost = payload.lastId ? draft.hasMorePost : true;
			}),
		[LOAD_CATEGORY_POSTS_SUCCESS]: (state, { payload }) =>
			produce(state, draft => {
				payload.forEach(post => {
					draft.displayedPosts.push(post);
				});

				//로딩한 포스트 개수가 5개가 아니라는 것은 실질적으로는 5개보다 작았다는 것이고, 그러면 남아있는 포스트를 모두 이미 로딩했다는 뜻이 된다.
				draft.hasMorePost = payload.length === 5;
			}),
		[LOAD_CATEGORY_POSTS_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.errors.loadPostError = payload;
			}),
		[CLEAR_DISPLAYED_POSTS]: state =>
			produce(state, draft => {
				draft.displayedPosts = [];
			}),
		[LOAD_USER_POSTS_REQUEST]: (state, payload) =>
			produce(state, draft => {
				draft.displayedPosts = !payload.lastId ? [] : draft.displayedPosts;
				draft.hasMorePost = payload.lastId ? draft.hasMorePost : true;
			}),
		[LOAD_USER_POSTS_SUCCESS]: (state, payload) =>
			produce(state, draft => {
				payload.data.posts.forEach(post => {
					draft.displayedPosts.push(post);
				});
				draft.countPosts = payload.data.count;
				//로딩한 포스트 개수가 5개가 아니라는 것은 실질적으로는 5개보다 작았다는 것이고, 그러면 남아있는 포스트를 모두 이미 로딩했다는 뜻이 된다.
				draft.hasMorePost = payload.length === 5;
			}),
		[LOAD_USER_POSTS_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.errors.loadPostError = payload;
			}),
		[LOAD_RANDOM_POSTS_SUCCESS]: (state, { payload }) =>
			produce(state, draft => {
				payload.forEach(post => {
					draft.randomPosts.push(post);
				});
			}),
		[LOAD_RANDOM_POSTS_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.errors.loadRandomPostsError = payload;
			}),
		[LIKE_POST_SUCCESS]: (state, payload) =>
			produce(state, draft => {
				const postIndex = draft.displayedPosts.findIndex(post => post.id === payload.data.postId);

				draft.displayedPosts[postIndex].Likers.unshift({ id: payload.data.userId });
			}),
		[UNLIKE_POST_SUCCESS]: (state, payload) =>
			produce(state, draft => {
				const postIndex = draft.displayedPosts.findIndex(post => post.id === payload.data.postId);
				const likeIndex = draft.displayedPosts[postIndex].Likers.findIndex(liker => liker.id === payload.data.userId);
				draft.displayedPosts[postIndex].Likers.splice(likeIndex, 1);
			})
	},
	initialState
);
