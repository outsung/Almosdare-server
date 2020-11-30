// require
const Base = require("../baseMiddlewareTest");
const TimelineMiddleware = require("../../../src/middlewares/Timeline/timeline.middleware");
const TimelineModel = require('../../../src/models/Timeline/timeline.model');
const Chai = require('chai');
const Sinon = require('sinon');


describe('======== TimelineMiddleware 테스트 ========', function(){

    describe('==== getByTime 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx: "token",
            body: {},
            params: {
                limit: 1
            }
        };
        const basicResponse = {
            status: 200,
            json: {
                result: 1,
                data: [{
                    idx: "1 some idx",
                    user: "1 some user idx",
                    message: "1 some message",
                }]
            }
        };

        describe('Verify', function(){
            describe('Base Verify', function(){
                Base.middlewareVerifyTest(TimelineMiddleware.getByTime[0], basicRequest)
            });
            it('req.params.limit가 숫자가 아닐 때')
        });

        describe('Action', function(){
            let stubResponse, spyNext;

            before(() => {
                stubResponse = { 
                    status: Sinon.stub().returnsThis(),
                    json: Sinon.stub()
                };
                spyNext = Sinon.spy();
            });

            describe('Expect', function(){

                describe('유효한 요청이 들어왔을 때', function(){
                    const TIMELINE = [{
                        _id: "1 some idx",
                        user: "1 some user idx",
                        message: "1 some message",
                        temp: "1 temp",
                    }];
                    let stubFindReturn;

                    before(async () => {
                        stubFindReturn = {limit: () => {}};
                        Sinon.stub(TimelineModel.Schema, 'find').returns(stubFindReturn);
                        Sinon.stub(stubFindReturn, "limit").returns(TIMELINE);
                        Sinon.stub(Date, "now").returns("some time");
                        
                        await TimelineMiddleware.getByTime[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });


                    it('사용되는 쿼리는 정해져 있다', function(){
                        Sinon.assert.calledWith(TimelineModel.Schema.find,
                            {$and: [{createdAt: {$lte: basicRequest.params.before || Date.now()}}, {user: basicRequest.jwt_user_idx}]});
                        Sinon.assert.calledWith(stubFindReturn.limit, Number(basicRequest.params.limit));
                    });
                    it('next()는 호출돼선 안된다', function(){
                        Sinon.assert.notCalled(spyNext);
                    });
                    it('stubResponse.status, stubResponse.json은 정해져 있다', function(){
                        Sinon.assert.calledWith(stubResponse.status, basicResponse.status);
                        Sinon.assert.calledWith(stubResponse.json, basicResponse.json);
                    });
                });

            });
        });
        
    });

});