import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Card, Input, Row, Col, Form, Select, Button } from "antd";

import { ADD_POST_REQUEST } from "../redux/modules/post";

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

	const dispatch = useDispatch();

	const { categories } = useSelector(state => state.categories);
	const children = [];
	for (let i = 0; i < categories.length; i++) {
		children.push(
			<Option key={categories[i]} value={categories[i]}>
				{categories[i]}
			</Option>
		);
	}

	// const addPost = useCallback(() => {
	// 	return dispatch({
	// 		type: ADD_POST_REQUEST
	// 	});
	// }, []);
	const onChangeLink = useCallback(e => {
		setLink(e.target.value);
	}, []);

	const onChangeTitle = useCallback(e => {
		setTitle(e.target.value);
	}, []);

	const onChangeDesc = useCallback(e => {
		setDesc(e.target.value);
	}, []);

	const submitForm = useCallback(e => {
		e.preventDefault();

		const formData = new FormData();

		// append로 추가하지않고 직접 태그에 name 속성을 사용했다.
		// formData.append("content", text);

		dispatch({
			type: ADD_POST_REQUEST,
			data: formData
		});
	}, []);

	return (
		<NewPostFormWrapper>
			<Row gutter={24}>
				<Col className="gutter-row" span={12}>
					<h1>새 포스트 작성</h1>
					<Form onSubmit={submitForm}>
						<div className="label">링크</div>
						<Input placeholder="http://" name="link" value={link} onChange={onChangeLink}></Input>
						<div className="label">제목(필수)</div>
						<Input
							placeholder="링크를 입력하시면 자동으로 입력됩니다"
							name="title"
							value={title}
							onChange={onChangeTitle}></Input>
						<div className="label" value={description} onChange={onChangeDesc}>
							부가 설명(선택)
						</div>
						<Input name="description" value={description} onChange={onChangeDesc}></Input>
						<div className="label">카테코리(필수)</div>
						<Select
							mode="multiple"
							style={{ width: "100%" }}
							placeholder="카테고리를 선택해주세요"
							name="category"
							required>
							{children}
						</Select>
						<SubmitBtn size="large" htmlType="submit">등록하기</SubmitBtn>
					</Form>
				</Col>
				<Col className="gutter-row" span={12} style={{ marginTop: 80 }}>
					<p style={{ fontSize: 16, color: "#939599" }}>
						링크를 입력하면 자동으로 해당 링크 콘텐츠의 제목이 입력됩니다. 제목이 입력되지 않을 시 직접 입력하셔야
						합니다. 물론 자동으로 제목이 입력되어도 자유롭게 수정 가능합니다. 서평의 경우 도서명으로 검색 가능하도록{" "}
						<strong>[인간관계론]</strong> 이런 방식으로 도서명을 제목에 추가해 붙여주셔도 좋습니다.
					</p>
				</Col>
			</Row>
		</NewPostFormWrapper>
	);
};

export default NewPost;
