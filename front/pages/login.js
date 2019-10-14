import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Link from "next/link";
import { Card } from "antd";
import styled from "styled-components";
import Router from "next/router";
import { LOG_IN_REQUEST } from "../redux/modules/user";

const LoginFormWrapper = styled(Card)`
	width: 90%;
	margin: 0 auto;
	border-radius: 6px;

	h1 {
		font-size: 30px;
	}
`;

const KakaoLoginBtn = styled.img`
	content: url("/kakaologinbtn.png");
	width: 300px;
	height: 50px;
	margin-bottom: 2em;
	cursor: pointer;
`;

const Login = () => {
	const dispatch = useDispatch();
	const { myInfo } = useSelector(state => state.user);

	// useEffect(() => {
	// 	if (myInfo) {
	// 		alert("로그인했으니 메인페이지로 이동합니다.");
	// 		Router.push("/");
	// 	}
	// }, [myInfo]);

	// const requestLogin = useCallback(() => {
	// 	return dispatch({
	// 		type: LOG_IN_REQUEST
	// 	});
	// },[]);

	return (
		<LoginFormWrapper>
			<h1>로그인</h1>
			<p style={{ fontSize: 17 }}>좋아요 및 포스트 작성을 위해서는 로그인이 필요합니다.</p>

			<a href="http://localhost:2019/api/oauth/kakao">
				<KakaoLoginBtn />
			</a>

			<p style={{ fontSize: 15, color: "#939599" }}>카카오 계정으로 로그인 시 카카오톡 닉네임만 외부에 공개됩니다.</p>
		</LoginFormWrapper>
	);
};

export default Login;
