import styled from "styled-components";

export const StyledPostbox = styled.div`
	width: 82%;
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	padding: 22px;
	// height: 240px;
	// display: flex;
	// align-items: center;
	margin: 0 auto;
	margin-bottom: 16px;

	h1 {
		font-size: 24px;
	}
`;

export const OtherPostbox = styled.div`
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

export const MainPostbox = styled.div`
	border: 1px solid rgb(147, 149, 153, 0.6);
	border-radius: 5px;
	background: white;
	padding: 22px;
	margin-bottom: 16px;

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
    background-color: transparent;
	}

	h1 {
		font-size: 24px;
	}

	p {
		color: #939599;
		cursor: pointer;
	}

	p:hover {
		color: #2b2a28;
	}
`;

export const Poster = styled.div`
	margin: 0 10px;
	padding: 0 10px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

export const UserName = styled.a`
	color: rgba(0, 0, 0, 0.65);
	font-weight: 500;
	:hover {
		color: #5cd12a;
	}
`;

export const EditBtn = styled.a`
	margin-left: 14px;
	padding-right: 10px;
	padding-left: 10px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	border-left: 1px solid rgba(0, 0, 0, 0.1);
	color: rgba(0, 0, 0, 0.65);

	:hover {
		color: #326ada;
	}
`;

export const DeleteBtn = styled.div`
	margin-left: 10px;
	cursor: pointer;

	color: rgba(0, 0, 0, 0.65);
	:hover {
		color: #fc3468;
	}
`;
