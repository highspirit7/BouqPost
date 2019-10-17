import { createAction, handleActions } from "redux-actions";
import produce from "immer";
import moment from "moment";

moment.locale("ko");

export const initialState = {
	mainPosts: [
		[
			{
				id: 1,
				title: "Nah2(나이)가 들면서 친구 사귀기가 어렵다고? Nah!",
				description: "오래된 친구에게 연락. 까짓 거 한번 시도해보세요!",
				like: 3,
				author: "졸꾸러기",
				user: {
					id: 1,
					nickname: "GrownUprince"
				},
				categories: ["서평", "자기계발"],
				img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1570279036/noticon/jl36nfr73kf3siyjcp56.jpg",
				createdAt: "10월 10일"
			},
			{
				id: 2,
				title: "Nah2(나이)가 들면서 친구 사귀기가 어렵다고? Nah!",
				description: "오래된 친구에게 연락. 까짓 거 한번 시도해보세요!",
				like: 3,
				author: "졸꾸러기",
				user: {
					id: 1,
					nickname: "GrownUprince"
				},
				categories: ["서평", "자기계발"],
				img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1569898129/noticon/x8e3entin2axlgquvx8k.png",
				createdAt: "10월 10일"
			}
		],
		[]
	],
	isAddingPost: false,
	isScraping: false,
	scrapedData: {},
	scrapingError: "",
	addPostError: "" // 포스트 업로드 실패 사유
};

//더미 데이터
// let postIndex = 3;
// const dummyPost = {
// 	id: ++postIndex,
// 	user: {
// 		id: 1,
// 		nickname: "GrownUprince"
// 	},
// 	like: 0,
// 	author: "졸꾸러기",
// 	title: "Don't feel sleepy, sleep more and be happier",
// 	description:
// 		"서평이라기 보다는 개인적으로 다시 또 보면서 수면에 관해 우리가 보통 잘 모르는 부분을 계속 상기시키기 위해 쓰는 글",
// 	categories: ["서평", "자기계발"],
// 	img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1569280061/noticon/pzqutc2e2p09otxqhk2h.png",
// 	date: "10월 12일"
// };

// 액션 타입 정의
export const ADD_POST_REQUEST = "post/ADD_POSTS_REQUEST";
export const ADD_POST_SUCCESS = "post/ADD_POSTS_SUCCESS";
export const ADD_POST_FAILURE = "post/ADD_POSTS_FAILURE";
export const SCRAPING_REQUEST = "post/SCRAPING_REQUEST";
export const SCRAPING_SUCCESS = "post/SCRAPING_SUCCESS";
export const SCRAPING_FAILURE = "post/SCRAPING_FAILURE";

// 액션 생성 함수
export const addPostsRequest = createAction(ADD_POST_REQUEST);
export const addPostsSuccess = createAction(ADD_POST_SUCCESS);
export const addPostsFailure = createAction(ADD_POST_FAILURE);
export const scrapingRequest = createAction(SCRAPING_REQUEST);
export const scrapingSuccess = createAction(SCRAPING_SUCCESS);
export const scrapingFailure = createAction(SCRAPING_FAILURE);

// immer 를 사용하여 값을 수정하는 리듀서
// var output = m.format("YYYY년MM월DD일 HH:mm:ss dddd");

export default handleActions(
	{
		[ADD_POST_REQUEST]: state =>
			produce(state, draft => {
				draft.isAddingPost = true;
			}),
		[ADD_POST_SUCCESS]: (state, { payload }) => {
			produce(state, draft => {
				// const newPost = payload.data;

				// //날짜가 그 이전 배열과 다르면 새로운 배열 만들어서 추가해주도록 하는 로직 필요
				// newPost.createdAt = moment(newPost.createdAt).format("MM월 DD일 dddd");

				// //애초에 첫 게시물 작성하는 경우 + 새 게시물 생성 날짜가 제일 최신 게시물의 날짜와 다를 때
				// if (draft.mainPosts[0][0].createdAt && draft.mainPosts[0][0].createdAt !== newPost.createdAt) {
				// 	draft.mainPosts.unshift([]);
				// 	draft.mainPosts[0].unshift(newPost);
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
		[SCRAPING_SUCCESS]: (state, payload) =>
			produce(state, draft => {
				draft.isScraping = false;
				draft.scrapedData = payload.data;
			}),
		[SCRAPING_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.isScraping = false;
				draft.scrapingError = payload;
			})
	},
	initialState
);
