/** 검색 인풋 창 인터페이스 */
import React, { Fragment, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SEARCH_REQUEST } from '../../redux/types';
import { Form, Input } from 'reactstrap';

// React 구성 요소 이름은 대문자로 시작해야합니다.
const SearchInput = () => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({searchBy:""});
  
  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    });
    console.log(form)
  } 

  const resetValue = useRef(null);

  const onSubmit = async(e) => {
    await e.preventDefault();
    const {searchBy} = form;

    dispatch({
      type: SEARCH_REQUEST,
      payload: searchBy
    });

    console.log(searchBy, "Submit Body");
    resetValue.current.value=""
    // resetValue (검색 인풋 창을 렌더링 될 때마다 빈 값으로 해주세요)
  }
  return(
    <Fragment>
      <Form onSubmit={onSubmit} className="col mt-2">
        <Input
          name="searchBy"
          onChange={onChange}
          innerRef={resetValue}  
        />
      </Form>
    </Fragment>


  );
}

export default SearchInput;