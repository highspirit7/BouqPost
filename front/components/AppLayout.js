import React, { useCallback } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Icon, Button, Layout, Menu, Dropdown, Spin } from "antd";
import styled from "styled-components";
import { LOG_OUT_REQUEST } from "../redux/modules/user";
import { Logo, StyledFooter, RightHeaderItems } from "../styledcomponents/appLayout";

const { Header, Content } = Layout;
const ResponsiveHeader = styled(Header)`
	@media (max-width: 1024px) {
		padding: 0 30px;
	}

	@media (max-width: 414px) {
		padding: 0px;
	}
`;

const ResponsiveContent = styled(Content)`
	padding: 0 50px;
	margin-top: 63px;

	@media (max-width: 414px) {
		padding: 0px;
	}
`;

const ResponsiveWrapper = styled.div`
	background: #f0f2f5;
	padding: 24px;
	min-height: 600;

	@media (max-width: 414px) {
		padding: 10px 4px;
	}
`;

const SearchIcon = styled(Icon)`
	font-size: 24px;
	vertical-align: -0.2em;
	color: #5cd12a;

	@media (max-width: 414px) {
		vertical-align: -0.32em;
	}
`;

const DropdownLink = styled.a`
	margin-left: 10px;
	color: #2b2a28;

	@media (max-width: 414px) {
		vertical-align: -0.32em;
	}
`;

const AppLayout = ({ children }) => {
	const { myInfo } = useSelector(state => state.user);
	const { isAddingPost } = useSelector(state => state.post);

	const dispatch = useDispatch();

	const onLogout = useCallback(() => {
		dispatch({
			type: LOG_OUT_REQUEST
		});
	}, [dispatch]);

	const collapsedMenu = myInfo ? (
		<Menu>
			<Menu.Item style={{ fontWeight: 600 }}>{myInfo.nickname}</Menu.Item>
			<Menu.Item key="newPost">
				<Link href="/newPost">
					<a>새 포스트</a>
				</Link>
			</Menu.Item>
			<Menu.Item key="myPage">
				<Link href={`/user/${myInfo && myInfo.id}`}>
					<a>내 페이지</a>
				</Link>
			</Menu.Item>
			<Menu.Item key="myLikes">
				<Link href="/likes">
					<a>내 좋아요</a>
				</Link>
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="logout">
				<a onClick={onLogout}>로그아웃</a>
			</Menu.Item>
		</Menu>
	) : (
		<Menu>
			<Menu.Item key="login">
				<Link href="/login">
					<a>로그인</a>
				</Link>
			</Menu.Item>
		</Menu>
	);

	const myMenu = (
		<Menu>
			<Menu.Item key="user_name" disabled>
				{myInfo && myInfo.nickname}
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item key="myPage">
				<Link href={`/user/${myInfo && myInfo.id}`}>
					<a>내 페이지</a>
				</Link>
			</Menu.Item>
			<Menu.Item key="myLikes">
				<Link href="/likes">
					<a>내 좋아요</a>
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
				<ResponsiveHeader
					style={{
						background: "white",
						borderBottom: "1px solid #d9d9d9",
						position: "fixed",
						width: "100%",
						zIndex: 999
					}}>
					<Logo>
						<Link href="/" prefetch>
							<a>BouqPost</a>
						</Link>
					</Logo>

					<RightHeaderItems>
						<Link href="/search">
							<a>
								<SearchIcon type="search" />
							</a>
						</Link>
						<Link href="/newPost">
							<a style={{ fontSize: 20, color: "#2b2a28" }} className="collapsingMenu">
								+ 새 포스트
							</a>
						</Link>
						{myInfo ? (
							<Dropdown
								overlayStyle={{ border: "1px solid rgb(147, 149, 153, 0.6)", borderRadius: 5 }}
								overlay={myMenu}
								trigger={["hover"]}>
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

						<Dropdown
							overlayStyle={{ border: "1px solid rgb(147, 149, 153, 0.6)", borderRadius: 5 }}
							overlay={collapsedMenu}
							trigger={["click"]}>
							<DropdownLink className="ant-dropdown-link" href="#">
								<Icon type="menu" className="burger-menu" style={{ fontSize: 22 }} />
							</DropdownLink>
						</Dropdown>
					</RightHeaderItems>
				</ResponsiveHeader>
				<ResponsiveContent>
					<ResponsiveWrapper>{children}</ResponsiveWrapper>
				</ResponsiveContent>
				<StyledFooter style={{ textAlign: "center" }}>- BouqPost -</StyledFooter>
			</Layout>
		</Spin>
	);
};

AppLayout.propTypes = {
	children: PropTypes.node
};

export default AppLayout;
