import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row } from 'reactstrap';
import { CATEGORY_FIND_REQUEST } from '../../redux/types';
import PostCardOne from '../../components/post/PostCardOne';

const CategoryResult = () => {

  const dispatch = useDispatch();
  let {categoryName} = useParams(); // 주소에서 params 부분을 따로 떼어올 수 있는 hooks
  const {categoryFindResult} = useSelector((state) => (state.post));
  console.log('categoryFindResult: ',categoryFindResult);

  useEffect(() => {
    dispatch({
      type: CATEGORY_FIND_REQUEST,
      payload: categoryName
    })
  },[dispatch, categoryName]);
  // 주소 창에 검색되는 categoryname이 달라질때마다 실행

  return (
    <>
      <h1 className="mb-3">Category: "{categoryName}"</h1>
      <Row>
        <PostCardOne
          posts={categoryFindResult.posts}
        />
      </Row>
    </>
  );
}

export default CategoryResult;