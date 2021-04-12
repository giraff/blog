import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { Button, Collapse, Container, Form, Nav, Navbar, NavbarToggler, NavItem } from 'reactstrap';
// 이 링크는 화면에서 바로 이동하기 때문에 새로고침을 방지하기 위해 Link 사용
import { Link } from 'react-router-dom';
import LoginModal from './auth/LoginModal';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT_REQUEST } from '../redux/types';
import RegisterModal from './auth/RegisterModal';
import SearchInput from './search/searchInput';

const AppNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {isAuthenticated, user, userRole} = useSelector(
    (state) => state.auth
  );
  console.log(userRole, "AppNavbaruserRole");
  
  const dispatch = useDispatch();
  // LOGOUT
  // 1. types에 LOGOUT 타입 이름 지정
  // 2. authReducer로 가서 action 타입에 따라 반환할 state 값을 표시 LOGOUT 만들기
  // 3. authSaga에서 action을 받아들일 함수와 타입을 바꿔줄 함수 만들기
  // 4. AppNavbar에서 작성

  const onLogout = useCallback(() => {
//메모이제이션된 콜백을 반환한다.
    dispatch({
      type: LOGOUT_REQUEST
    })
  }, [dispatch])

  useEffect(() => {
    setIsOpen(false)
  }, [user])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const addPostClick = () => {
    console.log("addPostClick")
  }
  const authLink = (
    <Fragment>
      <NavItem>
        {/* MainJuin에게만 보이는 게시글 작성 버튼 */}
        {userRole === "MainJuin" ? (
          <Form className="col mt-2">
            {/* 버튼 모양의 링크 형성 */}
            <Link to="post" className="btn btn-success block text-white px-3" onClick={addPostClick}>
              Add Post 
            </Link>
          </Form>
        ) : ""}
      </NavItem>
      {/* 회원 이름 띄우기 */}
      <NavItem className="d-flex justify-content-center">
        <Form className="col mt-2">
          {user && user.name ? (
            <Link to={`/user/${user.name}/profile`}>
            {/* 내용물이 채워지지 않고 테두리에만 색 넣기 */}
              <Button outline color="light" className="px-3">
                <strong>{user ? `Welcome ${user.name}` : ""}</strong>
              </Button>
            </Link>
          ): (
            <Button outline color="light" className="px-3">
              <strong>No User</strong>
            </Button>
          )}
        </Form>
      </NavItem>
        {/* 로그 아웃 버튼 */}
      <NavItem>
        <Form className="col">
          <Link onClick={onLogout} to="#">
            <Button outline color="light" className="mt-2" block>
              Logout
            </Button>
          </Link>
        </Form>
      </NavItem>
    </Fragment>
  )

  const guestLink = (
    <Fragment>
      <NavItem>
        <RegisterModal />
      </NavItem>
      <NavItem>
        <LoginModal />
      </NavItem>
    </Fragment>
  )
  return(
  <Fragment>
    <Navbar color="dark" dark expand="lg" className="sticky-top">
      <Container>
        <Link to="/" className="text-white text-decoration-none">
          Side Project's Blog(현정 블로그)
        </Link>
        <NavbarToggler onClick={handleToggle}/>
        <Collapse isOpen={isOpen} navbar>
          {/* 모바일 화면에서는 접힌채로 나와야한다. */}
          <SearchInput isOpen={isOpen} />
          <Nav className="ml-auto d-flex justify-content-around" navbar>
            {isAuthenticated ? authLink : guestLink}
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  </Fragment>
  )
}

export default AppNavbar;