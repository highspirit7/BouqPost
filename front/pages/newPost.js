import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Card, Input, Row, Col, Form, Select, Button } from "antd";
import Router from "next/router";
// import client from "cheerio-httpcli";

import { ADD_POST_REQUEST, SCRAPING_REQUEST } from "../redux/modules/post";

const NewPostFormWrapper = styled(Card)`
	width: 88%;
	margin: 0 auto;
	border-radius: 6px;

	h1 {
		font-size: 30px;
	}

	input {
		margin-bottom: 10px;
	}

	.label {
		color: #747575;
		font-size: 15px;
		font-weight: 500;
	}
`;

const SubmitBtn = styled(Button)`
	margin-top: 14px;
	padding-right: 34px;
	padding-left: 34px;
	background-color: #03c6fc;
	border-color: #03c6fc;
	color: white;
	font-size: 20px;
`;
const { Option } = Select;

const NewPost = () => {
	const [link, setLink] = useState("");
	const [title, setTitle] = useState("");
	const [description, setDesc] = useState("");
	const [category, setCategory] = useState([]);

	const dispatch = useDispatch();

	const { myInfo } = useSelector(state => state.user);
	const { providedCategories } = useSelector(state => state.categories);
	const { isScraping, scrapedData } = useSelector(state => state.post);

	//리덕스 사용해서 기본적으로 넣어둔 카테고리 가져오는 코드
	const children = [];
	for (let i = 0; i < providedCategories.length; i++) {
		children.push(
			<Option key={providedCategories[i]} value={providedCategories[i]}>
				{providedCategories[i]}
			</Option>
		);
	}

	useEffect(() => {
		if (!myInfo) {
			alert("새 포스트를 작성하시려면 로그인이 필요합니다");
			Router.push("/login");
		}

		if (scrapedData.title) {
			setTitle(scrapedData.title);
		}
	}, [myInfo, scrapedData]);

	const onChangeLink = useCallback(e => {
		setLink(e.target.value);
	}, []);

	const onChangeTitle = useCallback(e => {
		setTitle(e.target.value);
	}, []);

	const onChangeDesc = useCallback(e => {
		setDesc(e.target.value);
	}, []);

	const onChangeCategory = useCallback(value => {
		setCategory(value);
	}, []);

	const handleBlur = () => {
		if (link) {
			dispatch({
				type: SCRAPING_REQUEST,
				url: link
			});
		}
	};

	const submitForm = useCallback(
		e => {
			e.preventDefault();

			const formData = new FormData();

			// append로 추가하지않고 직접 태그에 name 속성을 사용했다.
			//FormData 브라우저 정책상 콘솔로그로 확인 불가하지만 아래와 같은 방식으로 확인 가능.
			formData.append("link", link);
			formData.append("title", title);
			formData.append("description", description);

			category.forEach(category => {
				formData.append("category", category);
			});

			for (var key of formData.keys()) {
				console.log(key);
			}

			for (var value of formData.values()) {
				console.log(value);
			}

			dispatch({
				type: ADD_POST_REQUEST,
				data: formData
			});
		},
		[link, title, description, category]
	);

	return (
		<NewPostFormWrapper>
			<Row gutter={24}>
				<Col className="gutter-row" span={12}>
					<h1>새 포스트 작성</h1>
					<Form onSubmit={submitForm}>
						<div className="label">링크</div>
						<Input placeholder="http://" value={link} onChange={onChangeLink} onBlur={handleBlur}></Input>
						<div className="label">제목(필수)</div>
						<Input
							placeholder={isScraping ? "링크 콘텐츠 제목을 추출 중입니다" : "링크를 입력하시면 자동으로 입력됩니다"}
							value={title}
							onChange={onChangeTitle}></Input>
						<div className="label" value={description} onChange={onChangeDesc}>
							부가 설명(선택)
						</div>
						<Input value={description} onChange={onChangeDesc}></Input>
						<div className="label">카테코리(필수)</div>
						<Select
							mode="multiple"
							style={{ width: "100%" }}
							placeholder="카테고리를 선택해주세요"
							onChange={onChangeCategory}
							required>
							{children}
						</Select>
						<SubmitBtn size="large" htmlType="submit">
							등록하기
						</SubmitBtn>
					</Form>
				</Col>
				<Col className="gutter-row" span={12} style={{ marginTop: 80 }}>
					<p style={{ fontSize: 16, color: "#939599" }}>
						네이버와 다음 블로그를 제외하고 링크를 입력하면 대부분의 경우 자동으로 해당 링크 콘텐츠의 제목이 입력될
						것입니다.<br></br>자동 입력되지 않는다면 직접 해당 링크 콘텐츠의 제목을 입력해주십시오. 물론 자동으로 제목이
						입력되어도 자유롭게 수정 가능합니다.
					</p>
					<p style={{ fontSize: 16, color: "#939599" }}>
						서평의 경우 도서명으로 검색 가능하도록 <strong>[인간관계론]</strong> 이런 방식으로 도서명을 제목에 추가해
						붙여주셔도 좋습니다.
					</p>
				</Col>
			</Row>
		</NewPostFormWrapper>
	);
};

export default NewPost;
