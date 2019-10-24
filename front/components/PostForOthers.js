import React from "react";
import styled from "styled-components";
import propTypes from "prop-types";
import Link from "next/link";
import { Tag, Icon, Popconfirm } from "antd";
import TimeAgo from "react-timeago";
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";


const OtherPostbox = styled.div`
	img {
		width: 186px;
		height: 112px;
		margin-right: 16px;
	}

	.contents {
		display: inline-block;
	}

	.likeBtn {
		border: 1px solid rgb(147, 149, 153, 0.6);
		border-radius: 20px;
	}
`;

const Poster = styled.div`
	margin: 0 10px;
	padding: 0 10px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

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
								<Link key={category.name} href={`/category/${categoryKeys[indexInCategories]}`}>
									<a>
										<Tag color={colors[indexInCategories]} style={{ curosr: "pointer" }}>
											{category.name}
										</Tag>
									</a>
								</Link>
							);
						})}
					</div>
					<a href={post.link} target="blank" rel="noopener noreferrer">
						<h2>{post.title}</h2>
					</a>
					{post.description ? <p>{post.description}</p> : <br />}

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

						<Poster>Posted by {post.User.nickname}</Poster>

						<div>
							<TimeAgo date={post.created_at} formatter={formatter}></TimeAgo>
						</div>
						{myInfo && myInfo.id === post.UserId && (
							<>
								<Link href={`/editPost/${post.id}`}>
									<a>
										<div
											style={{
												marginLeft: 14,
												paddingRight: 10,
												paddingLeft: 10,
												borderRight: "1px solid rgba(0, 0, 0, 0.1)",
												borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
												color: "rgba(0, 0, 0, 0.65)"
											}}>
											수정
										</div>
									</a>
								</Link>

								<Popconfirm
									title="정말 삭제하시겠습니까?"
									okText="Yes"
									cancelText="No"
									onConfirm={onRemovePost(post.id)}>
									<div style={{ marginLeft: 10, cursor: "pointer" }}>삭제</div>
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
