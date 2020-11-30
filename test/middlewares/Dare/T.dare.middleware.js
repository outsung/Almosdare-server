// require
const Base = require("../baseMiddlewareTest");
const DareMiddleware = require("../../../src/middlewares/Dare/dare.middleware");
const DareModel = require("../../../src/models/Dare/dare.model");
const Chai = require('chai');
const Sinon = require('sinon');

describe('======== DareMiddleware 테스트 ========', function(){
    describe('==== create 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx: "token",
            body: {
                place: {
                    name: "some name",
                    latitude: "some latitude",
                    longitude: "some longitude",
                },
                date: "some date",
            },
            params: {}
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                idx: "some idx",
            }
        };

        
        describe('Verify', function(){

            describe('Base Verify', function(){ Base.middlewareVerifyTest(DareMiddleware.create[0], basicRequest); });

            describe('req.body.place.name이 false 일 때', function(){
                const badRequest = {
                    jwt_user_idx : "token",
                    body: {
                        place: {
                            latitude: "some latitude",
                            longitude: "some longitude",
                        },
                        date: "some date",
                    },
                    params: {},
                }
                const exceptionResponse = {
                    status: 200,
                    json: {
                        result: -1,
                        message: "place.name : Field is empty"
                    }
                };
                let spyNext, stubResponse;

                before(() => {
                    spyNext = Sinon.spy();
                    stubResponse = {
                        status: Sinon.stub().returnsThis(),
                        json: Sinon.stub(),
                    };

                    DareMiddleware.create[0](badRequest, stubResponse, spyNext);
                });
                after(() => { Sinon.restore(); });
    
                it('next()는 호출돼선 안된다', function(){
                    Chai.expect(spyNext.notCalled).to.be.true;
                });
                it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                    Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                    Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                });
            
            });

            describe('req.body.place.latitude이 false 일 때', function(){
                const badRequest = {
                    jwt_user_idx : "token",
                    body: {
                        place: {
                            name: "some name",
                            longitude: "some longitude",
                        },
                        date: "some date",
                    },
                    params: {},
                }
                const exceptionResponse = {
                    status: 200,
                    json: {
                        result: -1,
                        message: "place.latitude : Field is empty"
                    }
                };
                let spyNext, stubResponse;

                before(() => {
                    spyNext = Sinon.spy();
                    stubResponse = {
                        status: Sinon.stub().returnsThis(),
                        json: Sinon.stub(),
                    };

                    DareMiddleware.create[0](badRequest, stubResponse, spyNext);
                });
                after(() => { Sinon.restore(); });
    
                it('next()는 호출돼선 안된다', function(){
                    Chai.expect(spyNext.notCalled).to.be.true;
                });
                it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                    Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                    Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                });
            
            });

            describe('req.body.place.longitude이 false 일 때', function(){
                const badRequest = {
                    jwt_user_idx : "token",
                    body: {
                        place: {
                            name: "some name",
                            latitude: "some latitude",
                        },
                        date: "some date",
                    },
                    params: {},
                }
                const exceptionResponse = {
                    status: 200,
                    json: {
                        result: -1,
                        message: "place.longitude : Field is empty"
                    }
                };
                let spyNext, stubResponse;

                before(() => {
                    spyNext = Sinon.spy();
                    stubResponse = {
                        status: Sinon.stub().returnsThis(),
                        json: Sinon.stub(),
                    };

                    DareMiddleware.create[0](badRequest, stubResponse, spyNext);
                });
                after(() => { Sinon.restore(); });
    
                it('next()는 호출돼선 안된다', function(){
                    Chai.expect(spyNext.notCalled).to.be.true;
                });
                it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                    Sinon.assert.calledWith(stubResponse.status, exceptionResponse.status);
                    Sinon.assert.calledWith(stubResponse.json, exceptionResponse.json);
                });
            
            });

        });
        
        it('Action');

    });

});
