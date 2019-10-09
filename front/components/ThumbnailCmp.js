import React from "react";
import styled from "styled-components";

const StyledThumbnail = styled.div`
	position: relative;
	z-index: 111;
	// width: 23%;
	height: 180px;
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 4px;
	cursor: pointer;
	box-shadow: #939599 2px 2px 6px -2px;

	.thumbnail {
		width: 100%;
		height: 100%;
		opacity: 0.4;
	}

	.content {
		position: absolute;
		width: 100%;
		top: 60%;
		left: 0;
		z-index: 10;
	}

	.title,
	.description {
		color: "#939599";
		font-size: 16px;
		margin: 0 14px;
	}
`;

const ThumbnailCmp = () => {
  return (
    <StyledThumbnail>
    <img className="thumbnail" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />

    <div className="content">
      <div className="title">북극곰의 멸종</div>
      <div className="description">북극곰의 멸종</div>
    </div>
  </StyledThumbnail>
  )
}

export default ThumbnailCmp;