import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { POSTS_LOADING_REQUEST } from '../../redux/types';
import { Helmet } from 'react-helmet';
import { Row } from 'reactstrap';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import PostCardOne from '../../components/post/PostCardOne';
import Category from '../../components/post/Category';

const PostCardList = () => {
  //reducer 등록해놓은 거 가져오기
  const {posts, categoryFindResult, loading, postCount } = useSelector((state) => state.post)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: POSTS_LOADING_REQUEST})
  },[dispatch])

  return (
    <Fragment>
      <Helmet title="Home"/>
        <Row className="border-bottom border-top border-primary py-2 mb-3">
          {/* 오로지 카테고리 (Category.js) 불러오기 */}
          <Category posts={categoryFindResult}/>
        </Row>
        <Row>
          {posts ? <PostCardOne posts={posts} /> : GrowingSpinner}  
        </Row> 
    </Fragment>
  )
}

export default PostCardList;