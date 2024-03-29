import React from 'react';
import { Badge, Button, Card, CardBody, CardImg, CardTitle, Row } from 'reactstrap';
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMouse} from '@fortawesome/free-solid-svg-icons';

const PostCardOne = ({posts}) => {
  return(
    <>
    {
      Array.isArray(posts) ? posts.map((post) => {
        return (
          <div key={post._id} className="col-md-4">
            <Link to={`/post/${post._id}`} className="text-dark text-decoration-none">
              <Card>
                <CardImg top alt="card image" src={post.fileUrl}/>
                <CardBody>
                  <CardTitle className="text-truncate d-flex justify-content-between">
                    <span className="text-truncate">{post.title}</span>
                    <span>
                      <FontAwesomeIcon icon={faMouse} />
                      &nbsp;&nbsp;
                      <span>{post.view}</span>
                    </span>
                  </CardTitle>
                  <Row>
                    <Button color="warning" className="p-1 btn-block">
                      Comments <Badge color="light">{post.comments ? post.comments.length : 0}</Badge>
                    </Button>
                  </Row>
                </CardBody>
              </Card>
            </Link>
          </div>
        )
      })
      :
      <>
      </>
    }
    </>
  );  

}

export default PostCardOne;