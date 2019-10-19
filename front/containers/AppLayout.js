import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Icon, Button, Layout, Menu, Dropdown, Spin } from "antd";
import styled from "styled-components";
import { LOG_OUT_REQUEST, LOAD_USER_REQUEST } from "../redux/modules/user";
import { LOAD_CATEGORIES } from "../redux/modules/categories";

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

	.ant-avatar {
		vertical-align: -0.65rem;
	}
`;

const AppLayout = ({ children }) => {
	const { myInfo } = useSelector(state => state.user);
	const { isAddingPost } = useSelector(state => state.post);

	const [isLoading, setLoading] = useState(false);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!myInfo) {
			dispatch({
				type: LOAD_USER_REQUEST
			});
		}
	}, []);

	useEffect(() => {
		dispatch({
			type: LOAD_CATEGORIES
		});
	}, []);

	const onLogout = useCallback(() => {
		dispatch({
			type: LOG_OUT_REQUEST
		});
	}, []);

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
			{myInfo ? (
				<Menu.Item key="logout">
					<a onClick={onLogout}>로그아웃</a>
				</Menu.Item>
			) : (
				<Menu.Item key="login">
					<Link href="/login">
						<a>로그인</a>
					</Link>
				</Menu.Item>
			)}
		</Menu>
	);

	const myMenu = (
		<Menu>
			<Menu.Item key="user_name">{myInfo && myInfo.nickname}</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="myPage">
				<Link href="/myPage">
					<a>내 페이지</a>
				</Link>
			</Menu.Item>
			{myInfo && (
				<Menu.Item key="logout">
					<a onClick={onLogout}>로그아웃</a>
				</Menu.Item>
			)}
		</Menu>
	);

	const loadingIcon = <Icon type="loading" style={{ fontSize: 48, color: "#939599" }} spin />;

	return (
		<Spin spinning={isAddingPost} indicator={loadingIcon}>
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
						{myInfo ? (
							<Dropdown overlay={myMenu} trigger={["hover"]}>
								<a className="ant-dropdown-link" href="#">
									<Avatar src={myInfo && myInfo.thumbnail_img} className="collapsingMenu" />
								</a>
							</Dropdown>
						) : (
							<Link href="/login">
								<a className="collapsingMenu">
									<Button size="large" style={{ fontSize: 18, color: "#2b2a28" }}>
										로그인
									</Button>
								</a>
							</Link>
						)}

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
		</Spin>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node
};

export default AppLayout;
