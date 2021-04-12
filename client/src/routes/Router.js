import React, { Fragment } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppNavbar from '../components/AppNavbar';
import { Container } from 'reactstrap';
import { Redirect, Switch, Route } from 'react-router';
import PostCardList from './normalRoute/PostCardList';
import PostWrite from './normalRoute/PostWrite';
import PostDetail from './normalRoute/PostDetail';
import Search from './normalRoute/Search';
import CategoryResult from './normalRoute/CategoryResult';
import { EditProtectedRoute, ProfileProtectedRoute } from './protectedRoute/ProtectedRoute';
import PostEdit from './normalRoute/PostEdit';
import Profile from './normalRoute/Profile';

const MyRouter = () => (
  <Fragment>
    <AppNavbar />
    <Header />
     <Container id="main-body">
       <Switch>
         <Route path="/" exact component={PostCardList}/>
         <Route path="/post" exact component={PostWrite}/>
         <Route path="/post/:id" exact component={PostDetail}/>
         <EditProtectedRoute 
            path="/post/:id/edit" exact component={PostEdit}
         />
         <ProfileProtectedRoute 
            path="/user/:userName/profile" exact component={Profile} />
         <Route path="/post/category/:categoryName" exact component={CategoryResult}/>
         <Route path="/search/:searchTerm" exact component={Search}/>
         <Redirect from="*" to="/"></Redirect>
       </Switch>
     </Container>
    <Footer />
  </Fragment>
);

export default MyRouter;