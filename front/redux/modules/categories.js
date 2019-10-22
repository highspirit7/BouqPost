import { createAction, handleActions } from "redux-actions";
import produce from "immer";

export const initialState = {
	providedCategories: [],
	colors: [
		"#d69da9",
		"#f39c12",
		"#b8cecd",
		"#c7acb4",
		"#3ff3fc",
		"#9b018a",
		"#00f429",
		"#4b5320",
		"#bcc6e5",
		"#7f99b1",
    "#6db087",
    "#8ec127",
    "#00aedb",
    "#fc3468",
    "#326ada",
    "#a19c9c",
    "#433e90",
    "#ffe700",
    "#a2790d",
    "#d4a348",
    "#323536"
	]
};

// 액션 타입 정의
export const LOAD_CATEGORIES = "categories/LOAD_CATEGORIES";

// 액션 생성
export const loadCategories = createAction(LOAD_CATEGORIES);

export default handleActions(
	{
		[LOAD_CATEGORIES]: state =>
			produce(state, draft => {
				draft.providedCategories = [
					"기타",
					"서평",
					"경제/경영",
					"역사",
					"문화",
					"IT",
					"철학",
					"에세이",
					"과학",
					"예술",
					"소설",
					"인문",
					"건강",
					"자기계발",
					"시",
					"여행",
					"외국어",
					"Tip",
          "정치/사회",
          "빡독",
          "글쓰기"
				];
			})
	},
	initialState
);
