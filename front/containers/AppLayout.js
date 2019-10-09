import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Avatar, Icon, Button, Layout, Menu, Dropdown } from "antd";
import styled from "styled-components";

const { Header, Footer, Content } = Layout;

const Logo = styled.div`
	font-size: 32px;
	
	font-weight: 800;
	font-family: "Oleo Script Swash Caps", cursive;
	margin: 0 24px 0 50px;
  float: left;
  
  a {
    color: #5cd12a;
  }
`;

const StyledFooter = styled(Footer)`
	font-family: "Oleo Script Swash Caps", cursive;
	font-size: 20px;
`;

const RightHeaderItems = styled.div`
	float: right;
	margin-right: 50px;

	& > a,
	& > span,
	& > i {
		margin-left: 20px;
	}

	.collapsingMenu {
		@media screen and (max-width: 991px) {
			display: none;
		}
	}

	.burger-menu {
		@media screen and (min-width: 991px) {
			display: none;
		}
	}
`;

const collapsedMenu = (
	<Menu>
		<Menu.Item key="newPost">
			<Link href="/newPost">
				<a>새 포스트</a>
			</Link>
		</Menu.Item>
		<Menu.Item key="myPage">
			<Link href="/myPage">
				<a>내 페이지</a>
			</Link>
		</Menu.Item>
		<Menu.Divider />
		<Menu.Item key="login">로그인</Menu.Item>
	</Menu>
);

const AppLayout = ({ children }) => {
	return (
		<Layout className="layout">
			<Header style={{ background: "white", borderBottom: "1px solid #d9d9d9" }}>
				<Logo>
					<Link href="/">
						<a>BouqPost</a>
					</Link>
				</Logo>

				<RightHeaderItems>
					<Link href="/search">
						<a>
							<Icon type="search" style={{ fontSize: 24, verticalAlign: "-0.2em", color: "#5cd12a" }} />
						</a>
					</Link>
					<Link href="/newPost">
						<a style={{ fontSize: 20, color: "#2b2a28" }} className="collapsingMenu">
							+ 새 포스트
						</a>
					</Link>
					<Link href="/myPage">
						<a>
							<Avatar size="large" icon="user" className="collapsingMenu" />
						</a>
					</Link>

					<Link href="/login">
						<a className="collapsingMenu">
							<Button size="large" style={{ fontSize: 18, color: "#2b2a28" }}>
								로그인
							</Button>
						</a>
					</Link>
					<Dropdown overlay={collapsedMenu} trigger={["click"]}>
						<a className="ant-dropdown-link" href="#" style={{ marginLeft: 10, color: "#2b2a28" }}>
							<Icon type="menu" className="burger-menu" style={{ fontSize: 22 }} />
						</a>
					</Dropdown>
				</RightHeaderItems>
			</Header>
			<Content style={{ padding: "0 50px" }}>
				<div style={{ background: "#f0f2f5", padding: 24, minHeight: 600 }}>{children}</div>
			</Content>
			<StyledFooter style={{ textAlign: "center" }}>- BouqPost -</StyledFooter>
		</Layout>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node
};

export default AppLayout;
