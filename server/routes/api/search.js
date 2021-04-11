import express from 'express'
const router = express.Router();

import Post from '../../models/post';

router.get('/:searchTerm', async(req, res, next) => {
  try {
    // 포스트 여러개를 찾는 거라 findOne이 아닌 find
    const result = await Post.find({
      // title 기준으로 검색
      title: {
        $regex: req.params.searchTerm,
        $options: "i" //정규표현식을 덜 민감하게 insensitive
        // 요 조건으로 posts부분에서 category를 찾으라.
      },
    }, "posts")
    console.log(result, "Search result");
    res.send(result);
  }catch(e) {
    console.log(e);
    next(e);
  } 
});

export default router;