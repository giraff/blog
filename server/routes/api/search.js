import express from "express";


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