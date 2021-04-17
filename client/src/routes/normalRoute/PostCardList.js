import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { POSTS_LOADING_REQUEST } from '../../redux/types';
import { Helmet } from 'react-helmet';
import { Alert, Row } from 'reactstrap';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import PostCardOne from '../../components/post/PostCardOne';
import Category from '../../components/post/Category';

const PostCardList = () => {
  //reducer 등록해놓은 거 가져오기
  const {posts, categoryFindResult, loading, postCount } = useSelector((state) => state.post)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: POSTS_LOADING_REQUEST,
      payload: 0 // postSaga의 loadPosts 함수에서 쓸 payload
// post가 13개라고 하면 처음에 0을 넘겨주고 총 postCount 에서 6을 빼서 그 값을 넘겨준다 
// 결국 총 Count에서 6을 빼서 남은 숫자가 있을 때까지 6씩 차감이 반복된다. 
    })
  },[dispatch]);

  //////////////////////////////////
   // 전 생애 주기에서 살아남을 수 있는 유일한 hooks = useRef
   // - useRef는 직접적으로 node 객체 돔에 접근할 수 있다. 
   // - useEffect 나 useCallback 안 에서도 값을 무사히 저장할 수 있다.
  // useEffect, useCallback 내부에서 상태 state 값을 저장하고 빼오기 위해서는 일반적인 useState는 접근이 불가
  // useEf0fect useCallback 안에서 변화된 값에 접근하기 위해선 반드시 useRef를 사용해야한다.
  
  // lastPostElementRef (useCallback) 안에서 값을 관리할 useRef들
  const skipNumberRef = useRef(0);
  const postCountRef = useRef(0);
  const endMsg = useRef(false);


  postCountRef.current = postCount - 6

  // useCallback 함수

  const useOnScreen = (options) => {
    const lastPostElementRef = useRef()
    const [visible, setVisible] = useState(false);
    
    useEffect(()=> {
      const observer = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting);

        if(entry.isIntersecting) {
          let remainPostCount = postCountRef.current - skipNumberRef.current;
          if(remainPostCount >= 0){
            dispatch({
              type: POSTS_LOADING_REQUEST,
              payload: skipNumberRef.current + 6,
            });
            skipNumberRef.current += 6;
          } else {
            endMsg.current = true;
          }
        }
      }, options);
      
      if (lastPostElementRef.current) {
        observer.observe(lastPostElementRef.current);
      }

      const LastElementReturnFunc = () => {
        if(lastPostElementRef.current) {
          observer.unobserve(lastPostElementRef.current);
        }
      };

      return LastElementReturnFunc;
    }, [lastPostElementRef, visible, options]);

    return [lastPostElementRef, visible];
  }

  const [lastPostElementRef] = useOnScreen({
    threshold: "0.9"
    // 브라우저 view 값에 따라 intersection이 작동이 안될 수 있음
    // (스크롤을 하면서 1픽셀 감지되면 그때 작동하도록 되어있음)
    // 브라우저 view를 너무 축소시켜 화면 끝에 div가 걸리지 않아 스크롤링이 불가하면 인터섹션도 작동 안 함
    // 그래서 threshold를 넣어서 90%만 보여도 감지되도록 하기.
  })
//  const lastPostElementRef = useCallback((node) => {  
    // observer가 현재 있는 곳에서 인터섹션 옵저버가 활동할 것이다.
    // observer.current = new IntersectionObserver((entries) => {
      // console.log(entries);
      // 간격을 감지하는 옵저버가 1px 정도를 감지하게 되면, isIntersecting이 true가 된다.
      // if (entries[0].isIntersecting) { 
        // 
        // let remainPostCount = postCountRef.current - skipNumberRef.current;
        // if(remainPostCount >= 0){
        //   dispatch({
        //     type: POSTS_LOADING_REQUEST,
        //     payload: skipNumberRef.current + 6,
        //   });
        //   skipNumberRef.current += 6;
        // } else {
        //   endMsg.current = true;
        // }
      // }

    // })

    // 과하게 계산하지 않도록 observer.current에 값이 있으면 바로 연결을 끝어준 뒤
    // if(observer.current) observer.current.disconnect()

    // 현재 노드가 있다면,
    // if(node) {
      // console.log(node);
      // 옵저버 개시하기
      // observer.current.observe(node)
    // }

    // 무한 반복 시스템
  // }, [dispatch, loading]);
  //////////////////////////////////

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
        {/* 화면이 계속 나오다가 아래 div 값이 1px이라도 보이면 div 안에서 감지함
        
        infite Scroller의 메소드는 intersection observer. 
        인터섹션 옵저버는 가장 최신의 브라우저에서만 작동하고 explorer에서는 작동 안 함
        보통, babel을 통해 자바스크립트 문법 호환성을 보장해주지만 babel 조차도 호환 안 됨.
        mx에서도 explorer을 버렸기 때문에 익스플로러에 적용될 가능성은 앞으로도 없음. 
        explorer에선 인터섹션 옵저버 사용 불가능함.
        */}

        {/* 하단 무한 스크롤을 위한  인터섹션 옵저버 */}
        {/* 인터섹션 옵저버 사용을 위해 감지가 될만한 div(노드 객체) 생성 후 감지할 노드 돔에다 직접 ref 값을 달아주기 */}
        <div ref={lastPostElementRef}> 
          {loading && GrowingSpinner}
        </div>
        {loading ? "" // 로딩 중이면 아무것도 안 보여주고
        : endMsg ? // 로딩 끝났는데 엔드 메시지가 존재한다(endMsg === true) 하면, 더이상 포스트가 없다(endMsg) 문구를 띄운다 
          <div>
            <Alert color="danger" className="text-center font-weight-bolder">
              더이상의 포스트는 없습니다
            </Alert>
          </div>
        : "" // 로딩 끝난 후 endMsg가 false면 아직 보여줄 포스트가 남아있으므로 아무것도 안 보여준다.
        } 
    </Fragment>
  )
}

export default PostCardList;