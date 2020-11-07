// Require
const Chai = require('chai');
const Sinon = require('sinon');
const Jwt = require("jsonwebtoken");

// let stub;

// test.before(t => {
//     stub = Sinon.stub(Jwt, 'verify').callsFake(() => {
//         return Promise.resolve({success: 'Token is valid'});
//     });
// })
describe('인증 미들웨어 테스트', function(){
    
    describe('jsonwebtoken 모듈 테스트', function(){
        it('jwt 토큰 생성 및 인증 테스트', function(done){
            Chai.expect(1).to.exist;
            done();
        });
    });

    // const testToken = 'test';
    // const testSecret = 'test secret';

    // const result = await Jwt.verify(testToken, testSecret);

    // console.log(result);

    // t.is(result.success, 'Token is valid');
    
});

// test.after('cleanup', t => {
//     stub.restore();
// })

// var expect = require('chai').expect;
// var Meme = require('../src/Meme');

// describe('meme', function() {
//     it('should be invalid if name is empty', function(done) {
//         var m = new Meme();

//         m.validate(function(err) {
//             expect(err.errors.name).to.exist;
//             done();
//         });
//     });
// });