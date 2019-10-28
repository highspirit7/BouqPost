import React from "react";
import styled from "styled-components";
import propTypes from "prop-types";

const ThumbnailCmp = ({ post }) => {
	const AlterThumbnail = styled.div`
		position: relative;
		height: 180px;
		border: 1px solid rgb(147, 149, 153, 0.6);
		border-radius: 4px;
		cursor: pointer;
		box-shadow: #939599 2px 2px 6px -2px;
		background-image: url(${post.thumbnail
				? `https://images.weserv.nl/?url=ssl:${post.thumbnail.slice(8)}&w=300&h=180`
				: "/bbakdok.png"}),
			url("/bbakdok.png");
		// background-repeat: no-repeat;
		background-size: cover;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		padding: 10px 0;

		:before {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: -webkit-linear-gradient(to top, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.14));
			background: -o-linear-gradient(to top, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.14));
			background: -moz-linear-gradient(to top, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.14));
			background: linear-gradient(to top, rgba(0, 0, 0, 0.66), rgba(0, 0, 0, 0.14));
			content: "";
		}

		.title,
		.description {
			width: 90%;
			position: relative;
		}

		.title {
			color: white;
			font-size: 1rem;
		}
		.description {
			font-size: 0.88rem;
			color: #b8bcc2;
		}
	`;

	const description = post.description.length > 22 ? `${post.description.substring(0, 22)}...` : post.description;
	const title = post.title > 60 ? `${post.title.substring(0, 60)}...` : post.title;

	return (
		<a href={post.link} target="_blank" rel="noopener noreferrer">
			<AlterThumbnail>
				<div className="title">{title}</div>
				<div className="description">{description}</div>
			</AlterThumbnail>
		</a>
	);
};

ThumbnailCmp.propTypes = {
	post: propTypes.object.isRequired
};

export default ThumbnailCmp;
