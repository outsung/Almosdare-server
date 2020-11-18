// Require
const AuthMiddleware = require('../../src/middlewares/auth.middleware');
const Chai = require('chai');
const Sinon = require('sinon');
const Jwt = require("jsonwebtoken");


describe('======== AuthMiddleware 테스트 ========', function(){
    
    let spyNext;
    let spyResponse;
    let stubJwtVerify;

    beforeEach(() => {
        spyNext = Sinon.spy();
        spyResponse = { status: Sinon.spy(), json: Sinon.spy() };
    });
    afterEach(() => {
        stubJwtVerify.restore();
    });

    it('req.headers.authorization 유효하면 res.jwt_user_idx 줘야한다', function(){
        stubJwtVerify = Sinon.stub(Jwt, "verify").yields(null, { idx: "some idx" });
        let requestForm = {
            headers: {
                authorization: "Bearer someToken"
            },
            jwt_user_idx: "init value"
        };
        
        AuthMiddleware[0](requestForm, spyResponse, spyNext);

        Sinon.assert.calledOnce(spyNext);
        Sinon.assert.notCalled(spyResponse.status);
        Sinon.assert.notCalled(spyResponse.json);
        Chai.expect(requestForm.jwt_user_idx).to.equal("some idx");
    });

    it('req.headers.authorization 없으면 res.jwt_user_idx를 null로 줘야한다', function(){
        stubJwtVerify = Sinon.stub(Jwt, "verify").yields(null, { idx: "some idx" });
        let requestForm = {
            headers: {
                authorization: ""
            },
            jwt_user_idx: "init value"
        };
        
        AuthMiddleware[0](requestForm, spyResponse, spyNext);
        
        Sinon.assert.calledOnce(spyNext);
        Sinon.assert.notCalled(spyResponse.status);
        Sinon.assert.notCalled(spyResponse.json);
        Chai.expect(requestForm.jwt_user_idx).to.null;
    });

    it('req.headers.authorization "Bearer "이 없으면 res.jwt_user_idx를 null로 줘야한다', function(){
        stubJwtVerify = Sinon.stub(Jwt, "verify").yields(null, { idx: "some idx" });
        let requestForm = {
            headers: {
                authorization: "someToken"
            },
            jwt_user_idx: "init value"
        };
        
        AuthMiddleware[0](requestForm, spyResponse, spyNext);

        Sinon.assert.calledOnce(spyNext);
        Sinon.assert.notCalled(spyResponse.status);
        Sinon.assert.notCalled(spyResponse.json);
        Chai.expect(requestForm.jwt_user_idx).to.null;
    });

    it('Jwt.verify에서 error가 존재하면 res.jwt_user_idx를 null로 줘야한다', function(){
        stubJwtVerify = Sinon.stub(Jwt, "verify").yields("some err", { idx: "some idx" });
        let requestForm = {
            headers: {
                authorization: "Bearer someToken"
            },
            jwt_user_idx: "init value"
        };
        
        AuthMiddleware[0](requestForm, spyResponse, spyNext);

        Sinon.assert.calledOnce(spyNext);
        Sinon.assert.notCalled(spyResponse.status);
        Sinon.assert.notCalled(spyResponse.json);
        Chai.expect(requestForm.jwt_user_idx).to.null;
    });

});