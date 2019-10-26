import { all, fork } from "redux-saga/effects";
import user from "./user";
import post from "./post";
import axios from "axios";
import { backUrl } from "../../config/config";

//한 번 불러온 모듈(여기서는 axios)은 캐싱이 된다. 그래서 다른 sagas폴더 파일에서 아래 코드롤 재사용할 필요가 없고 여기서 한 번 사용해주면 다 적용된다.
axios.defaults.baseURL = backUrl;

export default function* rootSaga() {
	yield all([fork(user), fork(post)]);
}
