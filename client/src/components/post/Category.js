import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from 'reactstrap';
const Category = ({
  posts
}) => {
  console.log(posts);
  return(
    <>
      {Array.isArray(posts) ?
        posts.map(({_id, categoryName, posts}) => (
          <div key={_id} className="mx-1 mt-1 my_category">
            <Link
              to={`post/category/${categoryName}`}
              className="text-dark text-decoration-none"
            >
              {/* 해쉬태그 = 글에 일정 단어를 정해주고 그걸 클릭하면 단어를 검색해서 똑같은 해쉬태그를 가진 글을 보여준다 =>
                  해쉬태그와 검색은 같은 메커니즘이다. 해쉬태그나 카테고리나 매우 유사하다. 해시태그나 카테고리나 링크를 달아줘서 검색을 할 수 있다
              */}
              <span className="ml-1">  
                <Button color="info">
                  {categoryName}{" "}
                  <Badge color="light"> {posts.length} </Badge>
                </Button>

              </span>
            </Link>
          </div>
        ))
      :  <>
        </>
      }
    </>
  );
}

export default Category;