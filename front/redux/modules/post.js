import { createAction, handleActions } from "redux-actions";
import produce from "immer";

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
				tags: ["서평", "자기계발"],
				img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1570279036/noticon/jl36nfr73kf3siyjcp56.jpg",
				date: "10월 10일"
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
				tags: ["서평", "자기계발"],
				img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1569898129/noticon/x8e3entin2axlgquvx8k.png",
				date: "10월 10일"
			}
		],
		[]
	],
	isAddingPost: false,
	addPostError: "" // 포스트 업로드 실패 사유
};

//더미 데이터
let postIndex = 3;
const dummyPost = {
	id: ++postIndex,
	user: {
		id: 1,
		nickname: "GrownUprince"
	},
	like: 0,
	author: "졸꾸러기",
	title: "Don't feel sleepy, sleep more and be happier",
	description:
		"서평이라기 보다는 개인적으로 다시 또 보면서 수면에 관해 우리가 보통 잘 모르는 부분을 계속 상기시키기 위해 쓰는 글",
	tags: ["서평", "자기계발"],
	img: "https://res.cloudinary.com/dgggcrkxq/image/upload/v1569280061/noticon/pzqutc2e2p09otxqhk2h.png",
	date: "10월 12일"
};

// 액션 타입 정의
export const ADD_POST_REQUEST = "post/LOAD_POSTS_REQUEST";
export const ADD_POST_SUCCESS = "post/LOAD_POSTS_SUCCESS";
export const ADD_POST_FAILURE = "post/LOAD_POSTS_FAILURE";

// 액션 생성 함수
export const loadPostsRequest = createAction(ADD_POST_REQUEST);
export const loadPostsSuccess = createAction(ADD_POST_SUCCESS);
export const loadPostsFailure = createAction(ADD_POST_FAILURE);

// immer 를 사용하여 값을 수정하는 리듀서
export default handleActions(
	{
		[ADD_POST_REQUEST]: state =>
			produce(state, draft => {
				draft.isAddingPost = true;
			}),
		[ADD_POST_SUCCESS]: state =>
			produce(state, draft => {
				draft.mainPosts[1].push(dummyPost);
				draft.isAddingPost = false;
			}),
		[ADD_POST_FAILURE]: (state, { payload }) =>
			produce(state, draft => {
				draft.isAddingPost = false;
				draft.addPostError = payload;
			})
	},
	initialState
);
