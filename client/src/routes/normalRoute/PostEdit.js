// PostWrite와 매우 흡사

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { 
  Button, 
  Col, 
  Form, 
  FormGroup, 
  Input, 
  Label, 
  Progress 
} from 'reactstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import { editorConfiguration } from '../../components/editor/editorConfig';
import Myinit from "../../components/editor/UploadAdapter";
import { POST_EDIT_UPLOADING_REQUEST } from '../../redux/types';
const PostEdit = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [form, setValues] = useState({ title: "", contents: "", fileUrl: "" });
  const dispatch = useDispatch();
  const { postDetail } = useSelector((state) => state.post);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // CKEditor의 인스턴스 (메모리에 올려지는 데이터)에 직접 접근하기 위해서는
  // const data = editor.getData()
  // 함수를 이용하여 데이터를 뽑아낼 수 있다.
  // But 우리는 '사진'을 하나씩 보여주는 블로그 형식
  // 사진을 오로지 에디터에서 맨 처음 업로드한 사진만 나오도록 할 것이다.

  //indexOf : 주어진 값과 일치하는 텍스트의 첫 시작 인덱스 값을 반환
  const getDataFromCKEditor = (event, editor) => {
    const data = editor.getData();
    console.log(data);

    // 글 자체에 이미지가 여러개 있더라도 아래 코드는
    // 컨텐츠의 맨 처음부터 아래로 훑기 때문에
    // 맨 처음 이미지만 걸리게 된다 
    if(data && data.match("<img src=")) {
      // 1. whereImg_start : <img src= 라는 텍스트가 시작하는 인덱스 숫자 반환 
      const whereImg_start = data.indexOf("<img src=");
      console.log(whereImg_start); // 시작하는 위치

      let whereImg_end = ""; // 끝나는 부분
      let ext_name_find = ""; // 확장자
      let result_Img_Url = "";

      // 일반적으로 많이 쓰는 확장자 명 (앞으로 추가 가능)
      const ext_name = ["jpeg", "jpg", "png", "jpg"];

      for (let i = 0; i < ext_name.length; i++) {
        if(data.match(ext_name[i])) {
          console.log(data.indexOf(`${ext_name[i]}`));
          ext_name_find = ext_name[i];
          whereImg_end = data.indexOf(`${ext_name[i]}`);
        }
      }

      console.log(ext_name_find,'ext_name_find');
      console.log(whereImg_end,'whereImg_end');

      // 파일 이름 잘라내기 (최종 이미지 파일 주소 저장)
      if(ext_name_find === "jpeg") {
        result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 4);
      } else {
        result_Img_Url = data.substring(whereImg_start + 10, whereImg_end + 3);
      }
      
      // 이미지 주소 저장
      console.log(result_Img_Url);
      setValues({
        ...form,
        fileUrl: result_Img_Url,
        contents: data
      })
   } else { // 그림파일이 없는 경우
      setValues({
        ...form,
        fileUrl: process.env.REACT_APP_BASIC_URL,

        contents: data
      })
   }

  }

const onSubmit = async (e) => {
    await e.preventDefault();
    const { title, contents, category, fileUrl} = form;
    const token = localStorage.getItem("token");
    const id = postDetail._id;
    const body = { title, contents, category, fileUrl, token, id };
    dispatch({
      type: POST_EDIT_UPLOADING_REQUEST,
      payload: body,
    });
};

// postDetail의 title, contents, category, fileUrl이 달라졌다고 하면
// 그것을 저장하기 위한 useEffect
useEffect(()=> {
  setValues({
    title: postDetail.title,
    contents: postDetail.contents,
    category: postDetail.category,
    fileUrl: postDetail.fileUrl,
  });
}, [postDetail.title, postDetail.contents, postDetail.category, postDetail.fileUrl]);

  // 렌더링 할 것
  return (
    <div>
      {isAuthenticated ? (
        <Form onSubmit={onSubmit}>
          <FormGroup className="mb-3">
            <Label for="title">Title</Label>
            <Input
              defaultValue={postDetail.title}
              type="text"
              name="title"
              id="title"
              className="form-control"
              onChange={onChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="category">Category</Label>
            {console.log(postDetail.category)}
            <Input
              defaultValue={postDetail.category.categoryName}
              type="text"
              name="category"
              id="category"
              className="form-control"
              onChange={onChange}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <Label for="content">Content</Label>
            <CKEditor
              data={postDetail.contents}
              editor={ClassicEditor}
              config={editorConfiguration}
              onReady={Myinit}
              onBlur={getDataFromCKEditor}
            />
            <Button
              color="success"
              block
              className="mt-3 col-md-2 offset-md-10 mb-3"
            >
              제출하기
            </Button>
          </FormGroup>
        </Form>
      ) : (
        <Col width={50} className="p-5 m-5">
          <Progress animated color="info" value={100} />
        </Col>
      )}
    </div>
  );
}


export default PostEdit;