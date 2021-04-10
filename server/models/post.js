// 글쓰는 것에 관련된 모델들
import mongoose from 'mongoose';
import moment from 'moment';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true, // 향후에 운영하게될 블로그 검색창에서 제목으로 검색하도록 할 것임
    // 인덱스를 제목에 주게 되면 검색 기능 향상에 도움을 줌.
  },
  contents: {
    type: String,
    required: true,
  },
  view: {
    type: Number,
    default: -2, // 처음 작성한 사람도 조회하게 되기 때문에 기본값으로 -2
  },
  fileUrl:{ // 게시글의 이미지 주소를 저장하기 위함.
    type: String,
    default: "https://source.unsplash.com/random/301x201",
    //random으로 unsplash에서 이미지 가져와서 적용하기
  },
  category: { // category 모듈과 post를 연동하기 위해 작성
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  }, // 한 개의 게시물은 한 개의 카테고리만 가지도록 일단 지정
  date:{
    type: String,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment"
    },
  ],
  creator:{// 작성자 : user와 post를 연동하기 우함
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"

  },
});

const Post = mongoose.model("post", postSchema);

export default Post;