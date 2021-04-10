// 
import express from 'express';

// 글을 쓰기 위해 mongoDB 모델을 불러오기
import Post from '../../models/post';
import User from '../../models/user';
import Category from '../../models/category';
import auth from '../../middleware/auth';
import Comment from '../../models/comment';

// express의 Router을 불러와 router 변수에 담기
const router = express.Router();

import multer from 'multer' //multer-s3 사용하기 위해 반드시 필요한 기본 multer 라이브러리
import multerS3 from "multer-s3";
import path from 'path';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import moment from 'moment';
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY
})

const uploadS3 = multer({
  // storage : multer S3 storage를 사용 설정은 액세스 키, 버킷 이름, 지역, 파일 식별자를 설정해준다.
  storage: multerS3({
    s3, // AWS의 accessKey ID와 secretAccessKey
    bucket: "giraffproject0402", // AWS 버킷 명
    region: "ap-northeast-2", // AWS 지역 : ap(아시아 태평양)-northeast(북)-Korean(일본이 1, 한국은 2)
    key(req,file,cb) {
      // 파일을 불러와 보낼 때 파일 이름은 우연의 일치로 서로 같을 수 있다. 파일 이름에 업로드한 날짜를 심어주어 파일간의 구별이 가능하도록 설정
      // ext는 파일 확장자를 의미하며 이것만 분리한다.
      const ext = path.extname(file.originalname); //확장자 이름은 파일의 오리지널 이름의 ext을 가져오고 그것은 path.extname을 이용해 따온다.
      const basename = path.basename(file.originalname, ext); // basename은 확장자를 제외한 파일의 오리지널 이름을 가져온다
      cb(null, basename + new Date().valueOf() + ext); // callback 함수에 처음은 null을 보내고, basename + 현재 시각 + 확장자 형태로 파일 이름을 보낸다.
    }
  }),
  // 파일의 limits를 설정해준다.
  limits: {
    fileSize: 100*1024*1024 
    // 100MB
  },
});

// @route     POST api/post/image (app 설정 참고)
// @desc      create a Post
// @access    private (글 쓰는 것도 나만 접근 가능하므로 이미지 역시 마찬가지)

// 게시판에 파일을 보내고 나서 editor 상에 보여주기 위한 라우터
router.post("/image", uploadS3.array("upload", 5),async(req, res, next) => {
  // post 요청 주소는 /image, 여러개를 보낼 수 있으므로 array(5개)
  // next는 에러가 나면 다음으로 넘긴다.
  try {
    // image란 주소를 통해 그림 파일을 배열 형태로 업로드 해버리면, req에 주소가 들어온다.
    // req에 들어온 AWSS3로 보내게 되면 그 주소가 req로 들어오게 되는데 그 req 중 files이라는 곳에 location이라는 곳이 있는데
    // file이 배열로 오면, 그 각 파일의 요소에 담긴 location을 찍어달라.
    console.log(req.files.map((v) => v.location))
    res.json({uploaded: true, url: req.files.map((v)=> v.location)});
    // 배열 형태로 주소를 찍어달라
  } catch(e) {
    // 만약 에러를 잡았다면, 에러를 보여주세요
    console.log(e);
    res.json({uploaded: false, url: null})
  }
});

// 모든 post를 검색
router.get('/', async(req, res) => {
  const postFindResult = await Post.find();
  const categoryFindResult = await Category.find();
  const result = {postFindResult, categoryFindResult};

  console.log(postFindResult, "All Post Get");
  res.json(result);

});
//@routes Post api/post
//@desc   Create a Post
//@access private

// post 작성
// middleware의 auth에 의해 토큰 값을 넘겨준 인증된 사용자만 글을 쓸 수 있게 함
router.post("/", auth, uploadS3.none(), async (req, res, next) => {
  try {
    console.log(req, "req");
    const { title, contents, fileUrl, creator, category } = req.body;
    const newPost = await Post.create({
      title,
      contents,
      fileUrl,
      creator: req.user.id,
      date: moment().format("YYYY-MM-DD hh:mm:ss"),
    });

    const findResult = await Category.findOne({
      categoryName: category,
    });

    console.log(findResult, "Find Result!!!!");

    if ((findResult)=== null || (findResult) === undefined) {
      const newCategory = await Category.create({
        categoryName: category,
      });
      await Post.findByIdAndUpdate(newPost._id, {
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: { posts: newPost._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: newPost._id,
        },
      });
    } else {
      await Category.findByIdAndUpdate(findResult._id, {
        $push: { posts: newPost._id },
      });
      await Post.findByIdAndUpdate(newPost._id, {
        category: findResult._id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: newPost._id,
        },
      });
    }
    return res.redirect(`/api/post/${newPost._id}`);
  } catch (e) {
    console.log(e);
  }
});
//@routes   Post api/post/:id
//@desc     Detail Post
//@access   public

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "name")
      .populate({ path: "category", select: "categoryName" });
    post.view += 1;
    post.save();
    console.log(post);
    res.json(post);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

// Comment Route

// @route  Get api/post/comments
// @desc   Get All Comments
// @access publid

router.get('/:id/comments', async(req, res) => {
  try{
    const comment = await Post.findById(req.params.id).populate({
      path: "comments", 
    });
    // comments를 만드는 건 comment ref이지만 여기서 참조할 이름은 Post 모델의 comments이다
    const result = comment.comments
    console.log(result, "comment load");
    res.json(result) //result를 보내주세요 (댓글)
    // post 아이디 검색
    // 댓글을 달기 위해선 어떤 포스트인지  
  } catch(e) {
    console.log(e);
    res.json(e);
  }
});

// 댓글 올리는 부분
router.post('/:id/comments', async(req, res, next) => {
  const newComment = await Comment.create({
    contents: req.body.contents,
    creator: req.body.userId,
    creatorName: req.body.userName,
    post: req.body.id,
    date: moment().format("YYYY-MM-DD hh:mm:ss")
  })

  console.log(newComment);
  try{
    //req.body.id로 넘어온 post ID를 찾아서 
    // 해당 post의 comments에 newComment의 id를 넣어준다
    await Post.findByIdAndUpdate(req.body.id, {
      $push: {
        comments: newComment._id          
      }
    })

    // 유저 정보에 댓글 정보 추가
    await User.findByIdAndUpdate(req.body.userId, {
      $push: {
        // User 모델 구조 참고
        comments: {
          post_id: req.body.id,
          comment_id: newComment._id
        }
      }
    })
    res.json(newComment)
  } catch(e) {
    console.log(e);
    next(e)
  }
});


// @route   delete api/post/:id
// @desc    Delete Post
// @access  authenticated (private, 오직 작성한 사람만이 가능)

router.delete('/:id', auth, async(req, res) => {
  await Post.deleteMany({_id: req.params.id})
  await Comment.deleteMany({post: req.params.id}) // 해당 포스트와 관련된 댓글 모두 지워주기
  // user 정보 업데이트 (유저 정보에서 댓글, 게시글 정보 삭제)
  await User.findByIdAndUpdate(req.user.id, {
    $pull: {
      posts: req.params.id,
      comments: { post_id: req.params.id }
    } // pull : mongoose 배열 삭제 연산, User 모델에서 찾은 현사용자의 정보 중 post 배열을 찾아 포스트 정보를 제거한다.
  });

  // category 작업 (카테고리에서 포스트 제거)
  const CategoryUpdateResult = await Category.findOneAndUpdate(
    {posts: req.params.id},
    {$pull: {posts: req.params.id}},
    {new : true} // you should set the new option to true to return the document after update was applied.
    // 업데이트를 적용하고 싶다면, 반드시 {new: true} 옵션을 설정해줘야 한다.
  )
  if(CategoryUpdateResult && CategoryUpdateResult.posts.length === 0) {
    await Category.deleteMany({_id: CategoryUpdateResult});
  }
  return res.json({success: true});
})

//@route  GET api/post/:id/edit
//@desc   Edit a Post
//@access private

// 수정을 위해 포스트를 찾고 정보를 내보낸다.
router.get("/:id/edit", auth, async(req, res, next) => {
  try{
    const post = await Post.findById(req.params.id).populate("creator", "name");
    res.json(post);
  }catch(e) {
    console.error(e);
  }
});

// 수정 완료 후 포스트 게시
router.post("/:id/edit", auth, async(req, res, next) => {
  console.log(req,'api/post/:id/edit');
  const {body : {title, contents, category, fileUrl, id}} = req;
  //req -> body -> title, contents, fileUrl, id를 구조분해
  try {
    // Post를 id로 찾고, title, contents, fileUrl, date를 업데이트한다.
    const modified_post = await Post.findByIdAndUpdate(
      id, {
        title, contents, fileUrl, date: moment().format("YYYY-MM-DD hh:mm:ss")
      },
      { new: true } // Update 사용 시 {new:true} 옵션 추가해야함
    );

    const findResult = await Category.findOne({
      categoryName: category,
    });

    if ((findResult)=== null || (findResult) === undefined) {
      const newCategory = await Category.create({
        categoryName: category,
      });
      await Post.findByIdAndUpdate(modified_post._id, {
        $push: { category: newCategory._id },
      });
      await Category.findByIdAndUpdate(newCategory._id, {
        $push: { posts: modified_post._id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: modified_post._id,
        },
      });
    } else {
      await Category.findByIdAndUpdate(findResult._id, {
        $push: { posts: modified_post._id },
      });
      await Post.findByIdAndUpdate(modified_post._id, {
        category: findResult._id,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          posts: modified_post._id,
        },
      });
    }

    console.log(modified_post, "edit modified");
    res.redirect(`/api/post/${modified_post.id}`);
    // 수정하면 수정한 날짜로 다시 업데이트 하고 싶으면 date를 현재 시각으로 조정
  } catch(e){ 
    console.error(e);
  }
})


// category
router.get('/category/:categoryName', async(req, res, next) => {
  try {
    const result = await Category.findOne({
      categoryName: {
        $regex: req.params.categoryName,
        $options: "i" //정규표현식을 덜 민감하게 insensitive
        // 요 조건으로 posts부분에서 category를 찾으라.
      },
    }, "posts").populate({ path: "posts" });
    console.log(result, "Category Find result");
    res.send(result);
  }catch(e) {
    console.log(e);
    next(e);
  } 
});
//router들을 모듈화해서 노출하기
export default router;