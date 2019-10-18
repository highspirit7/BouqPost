import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import moment from "moment";

export const initialState = {
	displayedPosts: [],
	isAddingPost: false,
	isScraping: false,
	scrapedTitle: "",
	scrapedImg: "",
	scrapingError: "",
	addPostError: "",
	loadPostsError: ""
};

// 액션 타입 정의
export const ADD_POST_REQUEST = "post/ADD_POSTS_REQUEST";
export const ADD_POST_SUCCESS = "post/ADD_POSTS_SUCCESS";
export const ADD_POST_FAILURE = "post/ADD_POSTS_FAILURE";
export const SCRAPING_REQUEST = "post/SCRAPING_REQUEST";
export const SCRAPING_SUCCESS = "post/SCRAPING_SUCCESS";
export const SCRAPING_FAILURE = "post/SCRAPING_FAILURE";
export const LOAD_POSTS_REQUEST = "post/LOAD_POSTS_REQUEST";
export const LOAD_POSTS_SUCCESS = "post/LOAD_POSTS_SUCCESS";
export const LOAD_POSTS_FAILURE = "post/LOAD_POSTS_FAILURE";

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

// immer 를 사용하여 값을 수정하는 리듀서
export default handleActions(
	{
		[ADD_POST_REQUEST]: state =>
			produce(state, draft => {
				draft.isAddingPost = true;
			}),
		[ADD_POST_SUCCESS]: (state, { payload }) => {
			produce(state, draft => {
				const newPost = payload;
				console.log(newPost);
				// //날짜가 그 이전 배열과 다르면 새로운 배열 만들어서 추가해주도록 하는 로직 필요
				// newPost.createdAt = moment(newPost.createdAt).format("MM월 DD일 dddd");

				// //애초에 첫 게시물 작성하는 경우 + 새 게시물 생성 날짜가 제일 최신 게시물의 날짜와 다를 때
				// if (draft.mainPosts[0][0].createdAt && draft.mainPosts[0][0].createdAt !== newPost.createdAt) {
				// 	draft.mainPosts.unshift([]);
				// 	draft.mainPosts[0].push(newPost);
				// } else {
				// 	//새 게시물 생성 날짜가 제일 최신 게시물의 날짜와 같을 때
				// 	draft.mainPosts[0].unshift(newPost);
				// }
				draft.isAddingPost = false;
			});
		},

		[ADD_POST_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.isAddingPost = false;
				draft.addPostError = payload;
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
				draft.scrapingError = payload;
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
				draft.loadPostsError = payload;
			})
	},
	initialState
);
