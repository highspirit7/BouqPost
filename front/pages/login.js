import React from "react";
import { Card } from "antd";
import styled from "styled-components";

const LoginCard = styled(Card)`
	width: 90%;
	margin: 0 auto;
  border-radius: 6px;
  
	h1 {
		font-size: 30px;
  }
  
`;

const KakaoLoginBtn = styled.img`
	content: url("http://localhost:3000/kakaologinbtn.png");
	width: 300px;
  height: 50px;
  margin-bottom: 2em;
  cursor: pointer;
`;

const Login = () => {
	return (
		<LoginCard>
			<h1>로그인</h1>
			<p style={{ fontSize: 17 }}>좋아요 및 포스트 작성을 위해서는 로그인이 필요합니다.</p>
			<KakaoLoginBtn />
			<p style={{ fontSize: 15, color: '#939599' }}>카카오 계정으로 로그인 시 카카오톡 닉네임만 외부에 공개됩니다.</p>
		</LoginCard>
	);
};

export default Login;
