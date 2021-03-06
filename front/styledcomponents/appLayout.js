import styled from "styled-components";
import { Layout } from "antd";

const { Footer } = Layout;

export const Logo = styled.div`
	font-size: 32px;

	font-weight: 800;
	font-family: "Oleo Script Swash Caps", cursive;
	margin: 0 24px 0 50px;
	float: left;

	a {
		color: #5cd12a;
	}

	@media (max-width: 414px) {
		font-size: 24px;
		margin: 0 24px 0 10px;
	}
`;

export const StyledFooter = styled(Footer)`
	font-family: "Oleo Script Swash Caps", cursive;
	font-size: 20px;
`;

export const RightHeaderItems = styled.div`
	float: right;
	margin-right: 50px;

	& > a,
	& > span,
	& > i {
    margin-left: 20px;
    
    @media(max-width: 1024px) {
      margin-left: 8px;
    }
	}



	.collapsingMenu {
		@media screen and (max-width: 1024px) {
			display: none;
		}
	}

	.burger-menu {
		@media screen and (min-width: 1024px) {
			display: none;
		}
	}

	.ant-avatar {
		vertical-align: -0.65rem;
  }
  
  @media (max-width: 414px) {
		margin-right: 10px;
	}
`;
