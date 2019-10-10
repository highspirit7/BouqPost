import { createAction, handleActions } from "redux-actions";
import produce from "immer";

const dummyUser = {
  nickname: 'GrownUprince',
  Posts: [],
  likes: 0,
  id: 1,
};

// 액션 타입 정의
const LOG_IN_REQUEST = "user/LOG_IN_REQUEST";
const LOG_IN_SUCCESS = "user/LOG_IN_SUCCESS";
const LOG_IN_FAILURE = "user/LOG_IN_FAILURE";
const LOG_OUT = "user/LOG_OUT";

// 액션 생성 함수
export const loginRequest = createAction(LOG_IN_REQUEST);
export const loginSuccess = createAction(LOG_IN_SUCCESS);
export const loginFailure = createAction(LOG_IN_FAILURE);
export const logout = createAction(LOG_OUT);

export const initialState = {
	isLoggedIn: false, // 로그인 여부
	isLoggingOut: false, // 로그아웃 시도중
	isLoggingIn: false, // 로그인 시도중
	logInErrorMsg: "", // 로그인 실패 사유
	myInfo: null // 내 정보
};

// immer 를 사용하여 값을 수정하는 리듀서
export default handleActions(
	{
		[LOG_IN_REQUEST]: (state, action) =>
			produce(state, draft => {
        draft.isLoggingIn = true;
        draft.logInErrorMsg = action.error.message
			}),
		// :: { } 를 따로 열지 않고 바로 리턴하면 이런 형식입니다.
		[LOG_IN_SUCCESS]: state =>
			produce(state, draft => {
				draft.isLoggingIn = false;
        draft.isLoggedIn = true;
        draft.myInfo = dummyUser;
			}),
		[LOG_IN_FAILURE]: state =>
			produce(state, draft => {
				draft.isLoggingIn = false;
        draft.isLoggedIn = false;
        draft.myInfo = null;
			}),
		[LOG_OUT]: state =>
			produce(state, draft => {
				draft.isLoggedIn = false;
        draft.myInfo = null;
			}),
	},
	initialState
);
