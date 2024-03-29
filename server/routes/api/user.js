// user와 관계된 라우터

// JWT 웹 토큰 방식 - JSON 토큰 안에 일정한 정보를 담아 로그인, 글 작성 할 때 오직 인증된 사람만 글을 쓸 수 있도록 하기
// 웹에서 토큰을 보내주면 서버에서 인증을 해서 만약 성공 시 글을 쓸 수 있거나 로그인을 하도록 함

//서버 측에서 유저가 로그인 했는지 보관하고 있을 필요 없고 단지 요청이 있을 때 토큰 값이 유효한지만 판단해 접근 여부 결정

// npm i bcryptjs jsonwebtoken

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../config/index';
const {JWT_SECRET} = config;
import User from '../../models/user'

const router = express.Router();

// @routes      GET api/user
// @desc        GET all user
// @access      public

// 유저 검색
router.get('/', async(req, res) => {
  try{
    // 유저 검색
    const users = await User.find();
    // 유저가 존재하지 않으면
    if(!users) throw Error("No users");
    // 유저가 존재하면 성공 코드 보내고 유저 정보 json으로 넘기기
    res.status(200).json(users);
  }catch(e) {
    console.log(e);
    res.status(400).json({msg: e.message}); //400 상태 코드를 json 형태로 보내 실패를 알림
  }
});

// 회원가입 - 유저 작성 - POST

// @routes      POST api/user
// @desc        Register user
// @access      public

router.post('/', (req, res) => {  
  // express 서버에선 대부분의 정보가 req.body에 담겨있다.
  const {name, email,password} = req.body;

  //Simple validation
  if(!name || !email || !password) {
    return res.status(400).json({msg: "모든 필드를 채워주세요"});
  };

  // Check for existing user 이미 존재하는 이메일이 있는지 확인
  User.findOne({email}).then(user => {
    if(user) return res.status(400).json({msg: "이미 가입된 유저가 존재합니다."});
    
    // newUser 정보 인스턴스화
    const newUser = new User({
      name, email, password
    });

    // bcrypt 작성
    bcrypt.genSalt(10, (err, salt) => { //salt 값 생성 
      bcrypt.hash(newUser.password, salt, (err, hash) => { // newUser의 password와 salt값 합쳐 해시값 생성
        if(err) throw err;
        newUser.password = hash; // 해시값 생성 완료 시 newUser password에 hash 값으로 갱신
        newUser.save().then((user) => { // newUser을 save하기
          jwt.sign( //jwt 웹 토큰 생성 및 등록
            {id: user.id},
            JWT_SECRET, //JWT_SECRET
            {expiresIn: 3600}, //jwt 만기일
            (err, token) => { // 생성된 token 가지고
              if(err) throw err;
              res.json({ // res에 json 형태로 token과 user 정보 내보내기
                token, 
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              })
            }
          )
        });
      });
    }); 
  });
});

// 프로필 페이지 (비밀번호 수정 기능만)
//@route    POST api/user/:username/profile
//@desc     POST Edit Password
//@access   Private
router.post('/:username/profile', async(req, res) => {
  try {
    const {previousPassword, password, rePassword, userId} = req.body;
    // 구조 분해
    
    const result = await User.findById(userId, 'password'); // userId로 찾은 계정의 password를 가져옴
    
    bcrypt.compare(previousPassword, result.password) // bcrypt 를 통해 이전 패스워드와 계정에 있던 패스워드 일치 여부 확인
    .then((isMatch) => {
      if(!isMatch) { //일치 하지 않음
        console.log('비밀번호 불일치');
        return res.status(400).json({
          match_msg: "기존 비밀 번호와 일치하지 않습니다."
        })
      } else {
        // 새 비밀번호 등록
        if(password === rePassword) {
          console.log('비밀번호 확인됨');
          bcrypt.genSalt(10, (err, salt) => { // salt 생성 (2의 10승번 계산해서 salt 제작)
            bcrypt.hash(password, salt, (err, hash) => { // hash 값 만들기 (새 비밀번호에 salt를 넣어서 새 비밀번호를 해쉬값(임의의 값)으로 만들어준다)
              if(err) throw err; // 만약 에러가 나면 에러 던져버림
              result.password = hash; // result의 password 값을 hash로 교체하고
              result.save();// result 저장
            })
          })
          
          res.status(200).json({
            success_msg: "비밀번호가 업데이트 되었습니다."
          })

        } else {
          console.log('비밀번호 비교 확인 틀림');

          res.status(400).json({
            fail_msg: "입력한 값이 새 비밀번호와 동일하지 않습니다"
          })
        }
      }
    })
  } catch (e) {
    console.log(e);
  }
})

export default router;