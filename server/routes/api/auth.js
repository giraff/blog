import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../../middleware/auth';
import config from '../../config/index';
const {JWT_SECRET} = config;

// Model
import User from '../../models/user';

const router = express();

// 로그인
// @route POST api/auth
// @desc  Auth user
// @access public

router.post('/', (req,res) => {
  const {email, password} = req.body;

  //Simple validation
  if(!email || !password) {
    return res.status(400).json({msg: "모든 필드를 채워주세요"});
  }

  //모두 다 채워졌다! 이미 존재하는 유저인지 확인
  User.findOne({email}).then((user) => {
    if(!user) return res.status(400).json({msg: "유저가 존재하지 않습니다."});

    // 만약 존재하는 유저라면, 패스워드 검증
    bcrypt.compare(password, user.password).then((isMatch) => {
      if(!isMatch) return res.status(400).json({msg:"비밀번호가 일치하지 않습니다."});

      // 로그인! 로그인 하고 나서 토큰 값 발행해줌
      jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: "2 days"}, (err, token) => {
        if(err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      });
    });
    // bcrypt.compare(현재 로그인 할 때 작성한 패스워드, 대조 시 우리가 가지고 있는 유저 정보에 담겨있는 식별용 패스워드)

  });
});


// LOGOUT
// 프론트에서 리덕스 saga를 이용해 처리할 것이기 때문에
// 오로지 응답만 주어지게 된다면 나머지 과정은 리덕스를 이용해 처리할 것임.
// 따로 서버에서 해줄 건 없고 로그아웃 성공 메시지만 보내준다.

router.post('/logout', (req, res) => {
  res.json("로그아웃 성공");
})

// 

router.get('/user', auth, async(req, res) => {
  try{
    // User 모델에서 현재 req의 user의 아이디로 찾아내고 패스워드는 생략해서 나오도록 설정
    const user = await User.findById(req.user.id).select("-password");
    if(!user) throw Error("유저가 존재하지 않습니다.");
    res.json(user);

  }catch(e) {
    console.log(e);
    res.status(400).json({msg: e.message});
  }
})

export default router;