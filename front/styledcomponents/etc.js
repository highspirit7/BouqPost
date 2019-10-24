import styled from "styled-components";
import { Input } from "antd";

export const NoResultMsg = styled.div`
	text-align: center;
	font-size: 30px;
	margin-top: 70px;
	color: #939599;
`;

const { Search } = Input;

export const StyledSearch = styled(Search)`
	width: 82%;
	display: block;
	margin: 0 auto;
	margin-bottom: 30px;

	input {
		height: 40px;
	}
	font-size: 18px;

	svg {
		width: 1.3em;
		height: 1.3em;
	}
`;
