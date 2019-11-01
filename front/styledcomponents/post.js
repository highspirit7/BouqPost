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
		border-radius: 4px;

		@media (max-width: 1024px) {
			width: 140px;
			height: 116px;
		}

		@media (max-width: 414px) {
			width: 88px;
			height: 68px;
		}
	}

	.contents {
		display: inline-block;

		.desktop {
			@media (max-width: 1024px) {
				display: none;
			}
		}

		.tablet {
			@media (min-width: 1024px) {
				display: none;
			}
		}
	}

	.likeBtn {
		border: 1px solid rgb(147, 149, 153, 0.6);
		border-radius: 20px;
		background-color: transparent;

		@media (max-width: 1024px) {
			margin-right: 1rem;
		}
	}

	p {
		color: #939599;
		cursor: pointer;

		@media (max-width: 1024px) {
			margin-bottom: 0.5em;
		}
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

	@media (max-width: 1024px) {
		border: 0;
		margin: 0;
		padding: 0;
		margin-bottom: 0.4rem;
	}
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

export const Title = styled.a`
	color: #2b2a28;
	font-size: 20px;
	font-weight: 500;

	@media (max-width: 1024px) {
		font-size: 18px;
	}
`;
