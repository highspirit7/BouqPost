import { createAction, handleActions } from "redux-actions";
import produce from "immer";

// const dummyUser = {
// 	nickname: "GrownUprince",
// 	Posts: [],
// 	likes: 0,
// 	id: 1,
// 	profileImg: "/little prince.png"
// };

// 액션 타입 정의
export const LOAD_USER_REQUEST = "user/LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "user/LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "user/LOAD_USER_FAILURE";
export const LOG_OUT_REQUEST = "user/LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "user/LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "user/LOG_OUT_FAILURE";

// 액션 생성 함수
export const loginRequest = createAction(LOAD_USER_REQUEST);
export const loginSuccess = createAction(LOAD_USER_SUCCESS);
export const loginFailure = createAction(LOAD_USER_FAILURE);
export const logoutRequest = createAction(LOG_OUT_REQUEST);
export const logoutSuccess = createAction(LOG_OUT_SUCCESS);
export const logoutFailure = createAction(LOG_OUT_FAILURE);

export const initialState = {
	// isLoggedIn: false, // 로그인 여부
	// isLoggingOut: false, // 로그아웃 시도중
	// isLoggingIn: false, // 로그인 시도중
	// logInErrorMsg: "", // 로그인 실패 사유
	myInfo: null // 내 정보
};

// immer 를 사용하여 값을 수정하는 리듀서
export default handleActions(
	{
		// [LOAD_USER_REQUEST]: state =>
		// 	produce(state, draft => {
		// 		draft.isLoggingIn = true;
		// 		// draft.logInErrorMsg = payload.error.message
		// 	}),
		// [LOAD_USER_SUCCESS]: state =>
		// 	produce(state, draft => {
		// 		draft.isLoggingIn = false;
		// 		draft.isLoggedIn = true;
		// 		// draft.myInfo = dummyUser;
		// 	}),
		// [LOAD_USER_FAILURE]: (state, { payload }) =>
		// 	produce(state, draft => {
		// 		draft.isLoggingIn = false;
		// 		draft.isLoggedIn = false;
		// 		draft.logInErrorMsg = payload;
		// 		draft.myInfo = null;
		// 	}),
		[LOAD_USER_SUCCESS]: (state, payload) =>
			produce(state, draft => {
				if (payload.me) {
					draft.myInfo = payload.data;
				}
			}),
		[LOG_OUT_REQUEST]: state =>
			produce(state, draft => {
				draft.isLoggingOut = true;
			}),
		[LOG_OUT_SUCCESS]: state =>
			produce(state, draft => {
				draft.isLoggingOut = false;
				draft.myInfo = null;
			}),
		[LOG_OUT_FAILURE]: state =>
			produce(state, draft => {
				draft.isLoggingOut = true;
			})
	},
	initialState
);
