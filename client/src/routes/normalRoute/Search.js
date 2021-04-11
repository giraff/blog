/** 검색 결과 화면 */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SEARCH_REQUEST } from '../../redux/types';
import { Row } from 'reactstrap';
import PostCardOne from '../../components/post/PostCardOne';

const Search = () => {
  const dispatch = useDispatch();
  //왜 let? 변할 수 있는 값이라서
  // url에 넘어온 parameter 값 가져오기
  let { searchTerm } = useParams();

  // 검색한 결과
  const { searchResult } = useSelector((state) => state.post);

  console.log('searchResult', searchResult);

  useEffect(() => {
    if(searchTerm) {
      dispatch({
        type:SEARCH_REQUEST,
        payload: searchTerm,
      })
    }
  },[dispatch, searchTerm]);

  return (
    <div>
      <h1> 검색 결과: "{searchTerm}"</h1>
      <Row>
        {/* 이후 searchInput 창 */}
        <PostCardOne posts={searchResult}></PostCardOne>
      </Row>
    </div>

  );
  
}

export default Search;