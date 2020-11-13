// Require
const Chai = require('chai');
const Sinon = require('sinon');
const Jwt = require("jsonwebtoken");
const AuthMiddleware = require('../../src/middlewares/auth.middleware');


describe('AuthMiddleware 테스트', function(){
    describe('jsonwebtoken 모듈 테스트', function(){
        it('jwt 토큰 생성 과 확인이 일치 해야함', function(done){
            // let stub;
            // before(function(){
            //     stub = Sinon.stub(Jwt, 'verify').callsFake(() => {
            //         return Promise.resolve({success: 'Token is valid'});
            //     });
            // }) 
            Chai.expect(1).to.exist;
            done();
        });
    });
    
    describe('req.header.authorization의 값이 이상할 때 jwt_user_idx를 null로 처리 해야함', function(){
        // let req;
        // let res;

        // let nextSpy;
        // beforeEach(function(){
        //     req = { authorization: "Bearer token" };
        //     res = { };
        //     Sinon.stub(Jwt, "verify").callsFake(function(){
        //         return {idx: "123"};
        //     });
        // });
        // afterEach(function(){
        //     Sinon.restore();
        // });
        
        // it('', function(done){
        //     AuthMiddleware[0](req, res, nextSpy);
        //     res.jwt_user_idx === "123"; 
        //     it('next는 무조건 한번 실행 해야함', function(){ Chai.expect(nextSpy.calledOnce).to.be.true; });
        // });
        // it('', function(done){
        //     AuthMiddleware[0](req, res, nextSpy);
        //     res.jwt_user_idx === "123"; 
        //     it('next는 무조건 한번 실행 해야함', function(){ Chai.expect(nextSpy.calledOnce).to.be.true; });
        // });
        // it('', function(done){
        //     AuthMiddleware[0](req, res, nextSpy);
        //     res.jwt_user_idx === "123"; 
        //     it('next는 무조건 한번 실행 해야함', function(){ Chai.expect(nextSpy.calledOnce).to.be.true; });
        // });
    });

    describe('req.header.authorization의 값을 jwt_user_idx에 확인 후 대입 해야함', function(){
        // let req;
        // let res;
        // let nextSpy;
        // before(function(){
        //     nextSpy = Sinon.spy();
        //     req = { authorization: "Bearer token" };
        //     res = { };
        //     Sinon.stub(Jwt, "verify").callsFake(function(){
        //         return {idx: "123"};
        //     });
        // })
        
        // it('', function(done){
        //     AuthMiddleware[0](req, res, nextSpy);
        //     res.jwt_user_idx === "123"; 
        // })
        // it('next는 무조건 한번 실행 해야함', function(){ Chai.expect(nextSpy.calledOnce).to.be.true; });
    });

    // describe('', function(){
        
    //     let req;
    //     let res;
    //     let nextSpy;
    //     before(function(){
    //         nextSpy = Sinon.spy();
    //         req = { authorization: "Bearer token" };
    //         res = { };
    //         Sinon.stub(Jwt, "verify").callsFake(function(){
    //             return {idx: "123"};
    //         });
    //     })
    //     it('next는 무조건 한번 실행 해야함', function(){ Chai.expect(nextSpy.calledOnce).to.be.true; });
    // })
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