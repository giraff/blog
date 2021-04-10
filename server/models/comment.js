import mongoose from 'mongoose';
import moment from 'moment';

const CommentSchema = new mongoose.Schema({
  contents: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: moment().format("YYYY-MM-DD hh:mm:ss"),
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  creatorName: { // 댓글을 달 때 작성자 이름을 따로 만들어놔서 데이터베이스의 부담을 덜고자 함.
    type: String
  },
});

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;