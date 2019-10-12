import { combineReducers } from "redux";
import user from "./user";
import post from "./post";
import categories from "./categories";

const rootReducer = combineReducers({
	user,
  post,
  categories
});

export default rootReducer;
