import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'; //dispatch 
import Helmet from 'react-helmet'; //크롬 사이트 이름을 바꿔줄 때 보호
import {
  POST_DETAIL_LOADING_REQUEST,
  // POST_DETAIL_LOADING_SUCCESS,
  // POST_DETAIL_LOADING_FAILURE,
  POST_DELETE_REQUEST,
  // POST_DELETE_SUCCESS,
  // POST_DELETE_FAILURE,
  USER_LOADING_REQUEST
} from '../../redux/types'; //액션 타입 이름들
import { Button, Col, Row, Container } from 'reactstrap'; 
import { Link } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faCommentDots,
  faMouse
} from '@fortawesome/free-solid-svg-icons';
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import { editorConfiguration } from '../../components/editor/editorConfig';
import Comments from '../../components/comments/comments';


const PostDetail = (req) => {
  const dispatch = useDispatch(); // reducer, saga 변화시키기 (넣기)
  const {postDetail, creatorId, title, loading} = useSelector(
    (state) => state.post
  ) // reducer의 값 가져오기
  const {userId, userName} = useSelector((state) => state.auth);// auth에서 작성한 사람 아이디랑 이름
  // reducer 로 내보낸 것이 현 시점 auth, post, router (reducer) 참고, 
  // 그 중 post는 postReducer 에   isAuthenticated,posts,postDetail,postCount,loading,error,creatorIdcategoryFindResulttitle ,searchBy, searchResult 중 하나를 불러올 수 있다.

  /** 48강 */
  const {comments} = useSelector((state) => state.comment);
  // detail 클릭 시 포스트 아이디가 url에 들어온다.
  console.log('post Detail req');
  console.log(req)

  useEffect(() => {
    dispatch({
      type: POST_DETAIL_LOADING_REQUEST, //
      payload: req.match.params.id,
    })
    // 타입을 dispatch로 날려주면 redux-saga에서 서버쪽으로 요청
    // req...id를 가지고 포스트를 검색해서 포스트 내용을 가져오도록 작동

    // delete 버튼 자체는 글 쓴 사람에게만 보여야 하므로, dispatch를 통해 유저 정보 가져오기
    dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem("token") // 개발자 도구 - application 탭 - localstorage - token 키에서 확인 가능
    })
  },[dispatch, req.match.params.id])

  //function
  // 글을 지우는 함수 => 상태 변화가 없기 때문에 redux는 사용 안 함!!! saga만 사용
  // 인증 받은 사용자만 눈에 보이도록
  const onDeleteClick = () => {
    dispatch({
      type: POST_DELETE_REQUEST,
      payload: {
        id: req.match.params.id,
        token: localStorage.getItem("token")// 글은 무조건 글 작성자만 지울 수 있도록 (인증)
        // 글 작성자인지 아닌지 여부는 token 안에 있는 정보로 확인이 가능하다.
      }
    })
  }
  
  const EditButton = (
    <>
      <Row className="d-flex justify-content-center pb-3">
        {/* Home으로 가는 버튼 */}
        <Col className="col-md-3 mr-md-3">
          <Link to="/" className="btn btn-primary btn-block">Home</Link>
        </Col>
        {/* Edit Post 게시글 수정 버튼 */}
        <Col className="col-md-3 mr-md-3">
          <Link to={`/post/${req.match.params.id}/edit`} className="btn btn-success btn-block">Edit post</Link>
        </Col>
        {/* 삭제 버튼 (삭제 버튼 자체는 링크 필요 없음) */}
        <Col className="col-md-3">
          <Button className="btn-block btn-danger" onClick={onDeleteClick}>
            Delete
          </Button>
        </Col>
      </Row>
    </>
  )
  // 본인 인증이 안 된 경우, 보여지는 상단 탭
  const HomeButton = (
    <>
      <Row className="d-flex justify-content-center pb-3">
        {/* flexbox justify-content-center padding bottom 3 정도 */}
        <Col className="col-sm-12 com-md-3">
          {/* 모바일 화면만큼 작아졌을 때는 col-sm-12 = 모든 칸 꽉 채우고, 그렇지 않으면 일반적으로 3의 크기를 가져라  */}
          <Link to="/" className="btn btn-primary btn-block">Home</Link>
        </Col>
      </Row>
    </>
  )
  
  const Body = (
    <>
      {userId === creatorId ? EditButton : HomeButton}
      <Row className="border-bottom border-top border-primary p-3 mb-3 d-flex justify-content-between">
        {(() => {
          console.log(postDetail);
          if(postDetail && postDetail.creator) {
            return (
              <Fragment>
              <div className="font-weight-bold text-big">
                <span className="mr-3">
                  <Button color="info">
                    {postDetail.category ? postDetail.category.categoryName: "None"}
                  </Button>
                </span>
                {postDetail.title}
              </div>
              <div className="mt-2">{postDetail.creator.name}</div>
              </Fragment>
            )
          }
        })()}
      </Row>
      {postDetail && postDetail.comments ? (
        <Fragment>
          <div className="d-flex justify-content-end align-items-baseline small">
            <FontAwesomeIcon icon={faPencilAlt} />
              &nbsp;
              <span>{postDetail.date}</span>
              &nbsp;&nbsp;
              <FontAwesomeIcon icon={faCommentDots} />
              &nbsp;
              <span>{postDetail.comments.length}</span>
              &nbsp;&nbsp;
              <FontAwesomeIcon icon={faMouse} />
              &nbsp;
              <span>{postDetail.view}</span>
          </div>
          {/* 에디터를 사용해서 뷰 하지 않으면 글씨가 이상해짐 볼 때 쓰는 에디터 = 벌룬 에디터 */}
          <Row className="mb-3">
            <CKEditor 
              editor={BalloonEditor}
              data={postDetail.contents}
              config={editorConfiguration}
              disable="true"
            />
          </Row>
          {/* 48강 댓글 영역 */}
          <Row>
            <Container className="mb-3 border border-blue rounded">
              {/* comment를 배열 다루는 map 사용해서 표시 */}
              {
                Array.isArray(comments) ? comments.map(
                  ({contents, creator, date, _id, creatorName}) => (
                    <div key={_id}>
                      <Row className="justify-content-between p-2">
                        <div className="font-weight-bold">
                          {creatorName ? creatorName : creator}
                        </div>
                        <div className="text-small">
                          <span className="font-weight-bold">
                            {date.split(" ")[0]}
                          </span>
                          <span className="font-weight-light">
                            {" "}
                            {date.split(" ")[1]}
                          </span>
                        </div>
                      </Row>
                      <Row className="p-2">
                        <div>
                          {contents}
                        </div>
                      </Row>
                      <hr />
                    </div>
                  )
                ) : "Creator"}
                {/* 모듈화를 많이 할 수록 리액트의 리렌더링을 줄여준다 - 48강 */}
                <Comments
                  id={req.match.params.id}  // post 아이디 넘겨주기 (댓글 달 때 어떤 포스트 댓글인지 명확히 하기 위함)
                  userId={userId} // 작성자 아이디 넘겨주기 (auth 에서 유저이름과 아이디를 가져온다. 댓글은 오직 로그인 인증 된 유저만 가능하기 때문에 넘겨준다 )
                  userName={userName} 
                />
            </Container>
          </Row>
        </Fragment>
      ): (<h1>HI</h1>)}
    </>
  );
  
  
  
  // 윗부분, 어떤 정보블 가져오는 구역은 컨테이너 ,렌더링하는 곳은 프레젠터 
  //
  console.log(title);
  return (
    <div>
      <Helmet title={`Post | ${title}`} />
      {loading === true ? GrowingSpinner : Body} 
    </div> 
  );
}

export default PostDetail;