// require
const Base = require("../baseMiddlewareTest");
const UserMiddleware = require("../../../src/middlewares/User/user.middleware");
const UserModel = require("../../../src/models/User/user.model");
const Chai = require('chai');
const Sinon = require('sinon');


// const Jwt = require("jsonwebtoken");
// const Crypto = require("crypto");
// const TimelineModel = require("../../models/Timeline/timeline.model");

describe('======== UserMiddleware 테스트 ========', function(){

    describe('==== getUserByJwt 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx: "token",
            body: {},
            params: {}
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                idx: "some idx",
                id: "some id",
                nickname: "some nickname",
                profileImageUrl: "some profileImageUrl"
            }
        };

        describe('Base Verify', () => Base.middlewareVerifyTest(UserMiddleware.getUserByJwt[0], basicRequest));

        // Base.middlewareActionTest(UserMiddleware.getUserByJwt[1], basicResponse);
        describe('Action', function(){
            let stubResponse, spyNext;

            before(() => {
                stubResponse = { 
                    status: Sinon.stub(),
                    json: Sinon.stub()
                };
                stubResponse.status.returns(stubResponse);
                spyNext = Sinon.spy();
            });

            describe('Expect', function(){

                describe('유효한 요청이 들어왔을 때', function(){
                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findById').returns({
                            _id: "some idx",
                            id: "some id",
                            nickname: "some nickname",
                            profileImageUrl: "some profileImageUrl"
                        });
                        await UserMiddleware.getUserByJwt[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });

                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findById, basicRequest.jwt_user_idx);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                });

            });

            describe('Exception', function(){

                describe('UserModel.Schema.findById이 null일 때', function(){
                    const exceptionResponse = {
                        status: 200,
                        json: {
                            result: -1,
                            message: "Can't find anyone"
                        }
                    };

                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findById').returns(null);
                        await UserMiddleware.getUserByJwt[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findById, basicRequest.jwt_user_idx);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

            });
        });

    });

    describe('==== getUserById 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx : "token",
            body: {},
            params: {
                id: "some id"
            }
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                idx: "some idx",
                id: "some id",
                nickname: "some nickname",
                profileImageUrl: "some profileImageUrl"
            }
        };
        
        describe('Base Verify', function(){ Base.middlewareVerifyTest(UserMiddleware.getUserById[0], basicRequest); });
    
        // Base.middlewareActionTest(UserMiddleware.getUserById[1], basicResponse);
        describe('Action', function(){
            let stubResponse, spyNext;

            before(() => {
                stubResponse = { 
                    status: Sinon.stub(),
                    json: Sinon.stub()
                };
                stubResponse.status.returns(stubResponse);
                spyNext = Sinon.spy();
            });

            describe('Expect', function(){

                describe('유효한 요청이 들어왔을 때', function(){
                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findOne').returns({
                            _id: "some idx",
                            id: "some id",
                            nickname: "some nickname",
                            profileImageUrl: "some profileImageUrl"
                        });
                        await UserMiddleware.getUserById[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });

                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findOne, {id: basicRequest.params.id});
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                });

            });

            describe('Exception', function(){

                describe('UserModel.Schema.findOne이 null일 때', function(){
                    const exceptionResponse = {
                        status: 200,
                        json: {
                            result: -1,
                            message: "Can't find anyone"
                        }
                    };

                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findOne').returns(null);
                        await UserMiddleware.getUserById[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });

                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findOne, {id: basicRequest.params.id});
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

            });
        });

    });

    describe('==== getUserByIdx 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx : "token",
            body: {},
            params: {
                idx: "some idx"
            }
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                idx: "some idx",
                id: "some id",
                nickname: "some nickname",
                profileImageUrl: "some profileImageUrl"
            }
        };

        describe('Verify', function(){ Base.middlewareVerifyTest(UserMiddleware.getUserByIdx[0], basicRequest); });

        // Base.middlewareActionTest(UserMiddleware.getUserByIdx[1], basicResponse);
        describe('Action', function(){
            let stubResponse, spyNext;

            before(() => {
                stubResponse = { 
                    status: Sinon.stub(),
                    json: Sinon.stub()
                };
                stubResponse.status.returns(stubResponse);
                spyNext = Sinon.spy();
            });

            describe('Expect', function(){

                describe('유효한 요청이 들어왔을 때', function(){
                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findById').returns({
                            _id: "some idx",
                            id: "some id",
                            nickname: "some nickname",
                            profileImageUrl: "some profileImageUrl"
                        });
                        await UserMiddleware.getUserByIdx[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });

                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findById, basicRequest.params.idx);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                });

            });

            describe('Exception', function(){

                describe('UserModel.Schema.findById이 null일 때', function(){
                    const exceptionResponse = {
                        status: 200,
                        json: {
                            result: -1,
                            message: "Can't find anyone"
                        }
                    };

                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findById').returns(null);
                        await UserMiddleware.getUserByIdx[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });

                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findById, basicRequest.params.idx);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

            });
        });
        
    });

});