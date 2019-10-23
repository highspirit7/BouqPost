import { createAction, handleActions } from "redux-actions";
import produce from "immer";

export const initialState = {
	providedCategories: {},
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
				draft.providedCategories = {
          etc: "기타",
					bookreview: "서평",
					economyandmanagement: "경제/경영",
					history: "역사",
					culture: "문화",
					informationTech: "IT",
					philosophy: "철학",
					essay: "에세이",
					science: "과학",
					art: "예술",
					novel: "소설",
					humanities: "인문",
					health: "건강",
					selfdevelopment: "자기계발",
					poem: "시",
					travel: "여행",
					foreignlanguage: "외국어",
					tip: "Tip",
          politicsandsociety: "정치/사회",
          bbakdok: "빡독",
          writing: "글쓰기"
        }
				
				;
			})
	},
	initialState
);
