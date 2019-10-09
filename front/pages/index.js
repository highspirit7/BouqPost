import React from "react";
import { Card } from "antd";
import styled from "styled-components";
import ThumbnailCmp from "../components/ThumbnailCmp";

const ThumbnailWrapper = styled.div`
	width: 94%;
	display: flex;
	justify-content: space-between;
	margin: 0 auto;
`;

const Main = () => {
	return (
		<div>
			<ThumbnailWrapper>
        <ThumbnailCmp />
        <ThumbnailCmp />
        <ThumbnailCmp />
        <ThumbnailCmp />
      </ThumbnailWrapper>
		</div>
	);
};

export default Main;
