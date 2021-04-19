import mongoose from 'mongoose';
import moment from "moment";

// Create Schema (데이터 모델)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required : true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["MainJuin", "SubJuin", "User"],
    default: "User",
  },
  register_date: {
    type: Date,
    default: moment().format("YYYY-MM-DD hh:mm:ss"), 
  },
  comments: [ 
    // 글쓴이가 포스트를 지우면 거기에 쓰여진 댓글도 다 사라져야 한다.
    // 그 포스트 아이디와 관련된 모든 걸 지우기 위해 그 때를 대비해 comments에 post_id 정보도 담는다
    {
      post_id: { 
        type: mongoose.Schema.Types.ObjectID,
        ref: "post",
      }, 
      comment_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

const User = mongoose.model("user", UserSchema);

export default User;
