// require
require('dotenv').config();

const Base = require("../baseMiddlewareTest");
const UserMiddleware = require("../../../src/middlewares/User/user.middleware");
const UserModel = require("../../../src/models/User/user.model");
const Crypto = require("crypto");
const Chai = require('chai');
const Sinon = require('sinon');
const Jwt = require("jsonwebtoken");

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

        describe('Base Verify', function(){ Base.middlewareVerifyTest(UserMiddleware.getUserByIdx[0], basicRequest); });

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

    describe('==== signup 테스트 ====', function(){
        const basicRequest = {
            body: {
                id: "some id",
                password: "some password",
                nickname: "some nickname"
            },
            params: {}
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                message : "User added"
            }
        };

        
        describe('Verify', function(){

            describe('Base Verify', function(){
                
                before(() => { Sinon.stub(UserModel.Schema, 'exists').returns(false); });
                after(() => { Sinon.restore(); });
    
                context('middlewareVerifyTest', function(){
                    Base.middlewareVerifyTest(UserMiddleware.signup[0], basicRequest);
                });

                context('UserModel.Schema.exists 테스트', function(){
                    it('사용되는 쿼리는 정해져있다', function(){ Sinon.assert.calledWith(UserModel.Schema.exists, {id: basicRequest.body.id}); });
                });

            });

            describe('UserModel.Schema.exists가 true 일 때', function(){
                const exceptionResponse = {
                    status: 200,
                    json: {
                        result: -1,
                        message: "id : Already exists"
                    }
                };
                let spyNext, stubResponse;

                before(async () => {
                    Sinon.stub(UserModel.Schema, 'exists').returns(true);
                    spyNext = Sinon.spy();
                    stubResponse = {
                        status: Sinon.stub(),
                        json: Sinon.stub(),
                    };
                    stubResponse.status.returns(stubResponse);

                    await UserMiddleware.signup[0](basicRequest, stubResponse, spyNext);
                });
                after(() => { Sinon.restore(); });
    
                it('사용되는 쿼리는 정해져있다', function(){
                    Sinon.assert.calledWith(UserModel.Schema.exists, {id: basicRequest.body.id});
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
                    const SALT = "__salt__";
                    const PASSWORD = "__password__";
                    let buf, key, user;

                    before(() => {
                        buf = { toString: Sinon.stub().returns(SALT) };
                        key = { toString: Sinon.stub().returns(PASSWORD) };
                        user = { save: Sinon.stub().returns({
                            _id: "user save idx",
                            id: basicRequest.body.id,
                            nickname: basicRequest.body.nickname,
                        })};
                        Sinon.stub(Crypto, 'randomBytes').yields(null, buf);
                        Sinon.stub(Crypto, 'pbkdf2').yields(null, key);
                        Sinon.stub(UserModel, 'Schema').returns(user);
                        
                        UserMiddleware.signup[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(Crypto.randomBytes, 64);
                        Sinon.assert.calledWith(buf.toString, "base64");
                        Sinon.assert.calledWith(Crypto.pbkdf2, basicRequest.body.password, SALT, Number(process.env.CRYPTO_COUNT), 12, "sha512");
                        Sinon.assert.calledWith(key.toString, "base64");
                        Sinon.assert.calledWithNew(UserModel.Schema, {
                            id: basicRequest.body.id,
                            password: PASSWORD,
                            salt: SALT,
                            nickname: basicRequest.body.nickname
                        });
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                    it('TimelineModel add 테스트');
                });

            });

            describe('Exception', function(){

                describe('Crypto.randomBytes이 error일 때', function(){
                    const ERROR = "__Crypto.randomBytes error__";
                    const exceptionResponse = {
                        status: 500,
                        json: {
                            result: -1,
                            message: "Server error",
                            reason: JSON.stringify(ERROR)
                        }
                    };
                    let buf, key, user;
                    
                    before(() => {
                        buf = { toString: Sinon.stub() };
                        key = { toString: Sinon.stub() };
                        user = { save: Sinon.stub() };
                        Sinon.stub(Crypto, 'randomBytes').yields(ERROR, null);
                        Sinon.stub(Crypto, 'pbkdf2');
                        Sinon.stub(UserModel, 'Schema');
                        
                        UserMiddleware.signup[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(Crypto.randomBytes, 64);
                        Sinon.assert.notCalled(buf.toString);
                        Sinon.assert.notCalled(Crypto.pbkdf2);
                        Sinon.assert.notCalled(key.toString);
                        Sinon.assert.notCalled(UserModel.Schema);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

                describe('Crypto.pbkdf2이 error일 때', function(){
                    const ERROR = "__Crypto.pbkdf2 error__";
                    const SALT = "__salt__";
                    const exceptionResponse = {
                        status: 500,
                        json: {
                            result: -1,
                            message: "Server error",
                            reason: JSON.stringify(ERROR)
                        }
                    };
                    let buf, key, user;
                    
                    before(() => {
                        buf = { toString: Sinon.stub().returns(SALT) };
                        key = { toString: Sinon.stub() };
                        user = { save: Sinon.stub() };
                        Sinon.stub(Crypto, 'randomBytes').yields(null, buf);
                        Sinon.stub(Crypto, 'pbkdf2').yields(ERROR, null);
                        Sinon.stub(UserModel, 'Schema');
                        
                        UserMiddleware.signup[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(Crypto.randomBytes, 64);
                        Sinon.assert.calledWith(buf.toString, "base64");
                        Sinon.assert.calledWith(Crypto.pbkdf2, basicRequest.body.password, SALT, Number(process.env.CRYPTO_COUNT), 12, "sha512");
                        Sinon.assert.notCalled(key.toString);
                        Sinon.assert.notCalled(UserModel.Schema);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

                it('UserModel.save가 error 일 때 ?');
            });
        });

    });

    describe('==== login 테스트 ====', function(){
        const basicRequest = {
            body: {
                id: "some id",
                password: "some password",
            },
            params: {}
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                idx: "some idx",
                id: "some id",
                nickname: "some nickname",
                profileImageUrl: "some profileImageUrl",
                accessToken: "__token__",
                tokenType: "Bearer",
            }
        };

        describe('Base Verify', function(){ Base.middlewareVerifyTest(UserMiddleware.login[0], basicRequest); });
        
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
                    const C_PASSWORD = "correct password";
                    const SALT = "__salt__";
                    let key;

                    before(async () => {
                        key = { toString: Sinon.stub().returns(C_PASSWORD) };
                        Sinon.stub(UserModel.Schema, 'findOne').returns({
                            _id: basicResponse.json.idx,
                            id: basicResponse.json.id,
                            salt: SALT,
                            password: C_PASSWORD,
                            nickname: basicResponse.json.nickname,
                            profileImageUrl: basicResponse.json.profileImageUrl,
                        });
                        Sinon.stub(Crypto, 'pbkdf2').yields(null, key);
                        Sinon.stub(Jwt, 'sign').returns(basicResponse.json.accessToken);
                        
                        await UserMiddleware.login[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findOne, {id: basicRequest.body.id});
                        Sinon.assert.calledWith(Crypto.pbkdf2, basicRequest.body.password, SALT, Number(process.env.CRYPTO_COUNT), 12, "sha512");
                        Sinon.assert.calledWith(key.toString, "base64");
                        Sinon.assert.calledWith(Jwt.sign, { idx: basicResponse.json.idx }, process.env.AUTH_SALT, { expiresIn: 86400 });
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                    it('TimelineModel add 테스트');
                });

            });

            describe('Exception', function(){

                describe('UserModel.Schema.findById이 null일 때', function(){
                    const exceptionResponse = {
                        status: 200,
                        json: {
                            result: -1,
                            message: "Login failed",
                        }
                    };
                    let key;

                    before(async () => {
                        key = { toString: Sinon.stub() };
                        Sinon.stub(UserModel.Schema, 'findOne').returns(null);
                        Sinon.stub(Crypto, 'pbkdf2');
                        Sinon.stub(Jwt, 'sign');
                        
                        await UserMiddleware.login[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findOne, {id: basicRequest.body.id});
                        Sinon.assert.notCalled(Crypto.pbkdf2);
                        Sinon.assert.notCalled(key.toString);
                        Sinon.assert.notCalled(Jwt.sign);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

                describe('Crypto.pbkdf2이 error일 때', function(){
                    const ERROR = "__Crypto.pbkdf2 error__";
                    const exceptionResponse = {
                        status: 500,
                        json: {
                            result: -1,
                            message: "Server error",
                            reason: JSON.stringify(ERROR)
                        }
                    };
                    const SALT = "__salt__";
                    let key;

                    before(async () => {
                        key = { toString: Sinon.stub() };
                        Sinon.stub(UserModel.Schema, 'findOne').returns({ salt: SALT });
                        Sinon.stub(Crypto, 'pbkdf2').yields(ERROR, null);
                        Sinon.stub(Jwt, 'sign');
                        
                        await UserMiddleware.login[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findOne, {id: basicRequest.body.id});
                        Sinon.assert.calledWith(Crypto.pbkdf2, basicRequest.body.password, SALT, Number(process.env.CRYPTO_COUNT), 12, "sha512");
                        Sinon.assert.notCalled(key.toString);
                        Sinon.assert.notCalled(Jwt.sign);
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Chai.expect(spyNext.notCalled).to.be.true;
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                    });
                });

                describe('패스워드가 틀렸을 때', function(){
                    const exceptionResponse = {
                        status: 200,
                        json: {
                            result: -1,
                            message: "Login failed",
                        }
                    };
                    const SALT = "__salt__";
                    let key;

                    before(async () => {
                        key = { toString: Sinon.stub().returns("invalid password") };
                        Sinon.stub(UserModel.Schema, 'findOne').returns({
                            _id: basicResponse.json.idx,
                            id: basicResponse.json.id,
                            salt: SALT,
                            password: "correct password",
                            nickname: basicResponse.json.nickname,
                            profileImageUrl: basicResponse.json.profileImageUrl,
                        });
                        Sinon.stub(Crypto, 'pbkdf2').yields(null, key);
                        Sinon.stub(Jwt, 'sign');
                        
                        await UserMiddleware.login[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findOne, {id: basicRequest.body.id});
                        Sinon.assert.calledWith(Crypto.pbkdf2, basicRequest.body.password, SALT, Number(process.env.CRYPTO_COUNT), 12, "sha512");
                        Sinon.assert.calledWith(key.toString, "base64");
                        Sinon.assert.notCalled(Jwt.sign);
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

    describe('==== patchProfileImage 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx : "token",
            body: {},
            params: {},
            file: { location: "some profileImageUrl" },
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                idx: "some idx",
                id: "some id",
                nickname: "some nickname",
                profileImageUrl: "some profileImageUrl",
            }
        };

        describe('Verify', function(){
            describe('Base Verify', function(){
                context('middlewareVerifyTest', function(){
                    Base.middlewareVerifyTest(UserMiddleware.patchProfileImage[0], basicRequest);
                });
            });
            context('req.file.location가 undefined 일 때', function(){
                const badRequest = {
                    jwt_user_idx : "token",
                    body: {},
                    params: {},
                    file: { location: undefined },
                }
                const stubResponse = { 
                    status: Sinon.stub().returnsThis(),
                    json: Sinon.stub()
                };
                const spyNext = Sinon.spy();
                const exceptionResponse = {
                    status: 500,
                    json: {
                        result: -1,
                        message: "Server error",
                        reason: "profile image upload error"
                    },
                }

                UserMiddleware.patchProfileImage[0](badRequest, stubResponse, spyNext);

                it('next()는 호출돼선 안된다', function(){ Sinon.assert.notCalled(spyNext); });
                it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                    Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                    Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                });

            });
        });
        
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
                        Sinon.stub(UserModel.Schema, 'findByIdAndUpdate').returns({
                            _id: basicResponse.json.idx,
                            id: basicResponse.json.id,
                            nickname: basicResponse.json.nickname,
                            profileImageUrl: basicResponse.json.profileImageUrl,
                        });

                        await UserMiddleware.patchProfileImage[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findByIdAndUpdate,
                            basicRequest.jwt_user_idx, {profileImageUrl : basicRequest.file.location}, {new: true});
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Sinon.assert.notCalled(spyNext);
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                    it('TimelineModel add 테스트');
                });

            });

            describe('Exception', function(){

                describe('UserModel.Schema.findByIdAndUpdate이 null일 때', function(){
                    const exceptionResponse = {
                        status: 200,
                        json: {
                            result: -1,
                            message: "Can't find anyone",
                        }
                    };

                    before(async () => {
                        Sinon.stub(UserModel.Schema, 'findByIdAndUpdate').returns(null);

                        await UserMiddleware.patchProfileImage[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });
                    
                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(UserModel.Schema.findByIdAndUpdate,
                            basicRequest.jwt_user_idx, {profileImageUrl : basicRequest.file.location}, {new: true});
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Sinon.assert.notCalled(spyNext);
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