import React from "react";
import propTypes from "prop-types";
import Link from "next/link";
import { Tag, Icon, Popconfirm } from "antd";
import TimeAgo from "react-timeago";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import { OtherPostbox, Poster, DeleteBtn, UserName, EditBtn, Title, StyledTimeAgo } from "../styledcomponents/post";

const PostForOthers = ({ post, categoryKeys, categoryValues, colors, myInfo, onRemovePost, onToggleLike }) => {
	const formatter = buildFormatter(koreanStrings);

	const showDefaultImg = event => {
		event.target.src = "/bbakdok.png";
		event.target.title =
			"해당 링크에서 이미지를 적절한 이미지를 추출하지 못했거나 간혹 이미지를 로드하지 못하는 에러 시 기본 이미지가 출력됩니다";
	};

	const myId = myInfo ? myInfo.id : 0;

	const liked = myId && post.Likers && post.Likers.find(v => v.id === myInfo.id);

	return (
		<OtherPostbox>
			<div style={{ display: "flex", alignItems: "center" }}>
				<a href={post.link} target="_blank" rel="noopener noreferrer">
					<img
						src={
							post.thumbnail
								? `https://images.weserv.nl/?url=ssl:${post.thumbnail.slice(8)}&w=200&h=128`
								: "/bbakdok.png"
						}
						onError={showDefaultImg}
						alt="thumbnail_img"
					/>
				</a>
				<div className="contents">
					<div>
						{post.Categories.map(category => {
							const indexInCategories = categoryValues.indexOf(category.name);

							return (
								<Link
									key={category.name}
									href="/category/[category_name]"
									as={`/category/${categoryKeys[indexInCategories]}`}>
									<a>
										<Tag color={colors[indexInCategories]} style={{ cursor: "pointer" }}>
											{category.name}
										</Tag>
									</a>
								</Link>
							);
						})}
					</div>
					<Title href={post.link} target="blank" rel="noopener noreferrer">
						{post.title}
					</Title>
					{post.description ? (
						<a href={post.link} target="blank" rel="noopener noreferrer">
							<p style={{ marginTop: 2 }}>{post.description}</p>
						</a>
					) : (
						<p style={{ marginTop: 6 }}></p>
					)}
					<Poster className="tablet">
						Posted by{" "}
						<Link href="/user/[user_id]" as={`/user/${post.UserId}`}>
							<UserName>{post.User.nickname}</UserName>
						</Link>
					</Poster>
					<div style={{ display: "flex", alignItems: "center" }}>
						<button className="likeBtn">
							{" "}
							<Icon
								type="heart"
								theme={liked ? "twoTone" : "outlined"}
								twoToneColor="#eb2f96"
								onClick={onToggleLike(myId, liked, post)}
							/>
							{post.Likers.length !== 0 && <span style={{ marginLeft: 6 }}>{post.Likers.length}</span>}
						</button>

						<Poster className="desktop">
							Posted by{" "}
							<Link href="/user/[user_id]" as={`/user/${post.UserId}`}>
								<UserName>{post.User.nickname}</UserName>
							</Link>
						</Poster>

						<StyledTimeAgo>
							<TimeAgo date={post.created_at} formatter={formatter}></TimeAgo>
						</StyledTimeAgo>
						{myInfo && myInfo.id === post.UserId && (
							<>
								<Link href="/editPost/[postId]" as={`/editPost/${post.id}`}>
									<EditBtn>수정</EditBtn>
								</Link>

								<Popconfirm
									title="정말 삭제하시겠습니까?"
									okText="Yes"
									cancelText="No"
									onConfirm={onRemovePost(post.id)}>
									<DeleteBtn>삭제</DeleteBtn>
								</Popconfirm>
							</>
						)}
					</div>
				</div>
			</div>
		</OtherPostbox>
	);
};

PostForOthers.propTypes = {
	post: propTypes.object.isRequired,
	categoryKeys: propTypes.array.isRequired,
	categoryValues: propTypes.array.isRequired,
	colors: propTypes.array.isRequired,
	myInfo: propTypes.object,
	onRemovePost: propTypes.func.isRequired,
	onToggleLike: propTypes.func.isRequired
};

export default PostForOthers;
