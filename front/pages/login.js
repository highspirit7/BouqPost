import React from "react";
import { Card } from "antd";
import styled from "styled-components";
import { backUrl } from "../config/config";

const LoginFormWrapper = styled(Card)`
	width: 90%;
	margin: 0 auto;
	border-radius: 6px;

	h1 {
		font-size: 30px;
		@media (max-width: 414px) {
			font-size: 24px;
		}
	}

	.guide_1 {
		font-size: 18px;

		@media (max-width: 414px) {
			font-size: 16px;
		}
	}

	.guide_2 {
		fontsize: 15px;
		color: #939599;
	}
`;

const KakaoLoginBtn = styled.div`
	width: 200px;
	height: 50px;
	margin-bottom: 2em;
	cursor: pointer;
	border-radius: 6px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
	background-color: #fff;
	color: #757575;
	display: flex;
	align-items: center;
	justify-content: space-between;
	img {
		margin-left: 12px;
		// width: 32px;
		// height: 32px;
	}

	div {
		width: 100%;
		text-align: center;
		font-size: 18px;
		font-weight: 500;

		@media (max-width: 414px) {
			font-size: 17px;
		}
	}
`;

const Login = () => {
	return (
		<LoginFormWrapper>
			<h1>로그인</h1>
			<p className="guide_1">좋아요 및 포스트 작성을 위해서는 로그인이 필요합니다.</p>

			<a href={`${backUrl}/oauth/kakao`}>
				<KakaoLoginBtn>
					<img src="/kakaolink_btn_small.png" alt="kakaolink_btn"></img>
					<div>카카오 로그인</div>
				</KakaoLoginBtn>
			</a>

			<p className="guide_2">카카오 계정으로 로그인 시 카카오톡 닉네임만 외부에 공개됩니다.</p>
		</LoginFormWrapper>
	);
};

export default Login;
