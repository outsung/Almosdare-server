// require
const Base = require("../baseMiddlewareTest");
const AppointmentMiddleware = require("../../../src/middlewares/Appointment/appointment.middleware");
const DareModel = require("../../../src/models/Dare/dare.model");
const InstantModel = require("../../../src/models/Instant/instant.model");
const UserModel = require("../../../src/models/User/user.model")
const Chai = require('chai');
const Sinon = require('sinon');


describe('======== AppointmentMiddleware 테스트 ========', function(){

    describe('==== getAppointment 테스트 ====', function(){
        const basicRequest = {
            jwt_user_idx: "token",
            body: {},
            params: {}
        };

        describe('Base Verify', function(){Base.middlewareVerifyTest(AppointmentMiddleware.getAppointment[0], basicRequest)});

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
                    const idxTransrationUser = idx => idx ? {
                        _id: `user ${idx.split("_")[0]} idx`,
                        id: `user ${idx.split("_")[0]} id`,
                        nickname: `user ${idx.split("_")[0]} nickname`,
                        profileImageUrl: `user ${idx.split("_")[0]} profileImageUrl`
                    } : null;
                    
                    const invitedInstant = [{
                        idx: "1",
                        invited: ["1_idx"],
                        pending: []
                    }];
                    const pendingInstant = [{
                        idx: "2",
                        invited: [],
                        pending: ["1_idx", "2_idx", "3_idx"]
                    }];
                    const invitedDare = [{
                        idx: "3",
                        creator: "4_idx",
                        place: "some place",
                        date: "some date",
                        invited: ["4_idx", "5_idx", "6_idx"],
                        pending: [],
                    }];
                    const pendingDare = [{
                        idx: "4",
                        creator: "7_idx",
                        place: "some place",
                        date: "some date",
                        invited: [],
                        pending: ["7_idx", "8_idx", "9_idx", "10_idx"]
                    }];

                    const basicResponse = {
                        status: 200,
                        json: {
                            result: 1,
                            data: {
                                invitedInstant: [{
                                    idx: invitedInstant[0].idx,
                                    invited: invitedInstant[0].invited.map(idx => {
                                        const user = idxTransrationUser(idx);
                                        return {
                                            idx: user._id,
                                            id: user.id,
                                            nickname: user.nickname,
                                            profileImageUrl: user.profileImageUrl
                                        }
                                    }),
                                    pending: invitedInstant[0].pending,
                                }],
                                pendingInstant: [{
                                    idx: pendingInstant[0].idx,
                                    invited: pendingInstant[0].invited,
                                    pending: pendingInstant[0].pending.map(idx => {
                                        const user = idxTransrationUser(idx);
                                        return {
                                            idx: user._id,
                                            id: user.id,
                                            nickname: user.nickname,
                                            profileImageUrl: user.profileImageUrl
                                        }
                                    }),
                                }],
                                invitedDare: [{
                                    idx: invitedDare[0].idx,
                                    creator: invitedDare[0].creator,
                                    place: invitedDare[0].place,
                                    date: invitedDare[0].date,
                                    invited: invitedDare[0].invited.map(idx => {
                                        const user = idxTransrationUser(idx);
                                        return {
                                            idx: user._id,
                                            id: user.id,
                                            nickname: user.nickname,
                                            profileImageUrl: user.profileImageUrl
                                        }
                                    }),
                                    pending: invitedDare[0].pending,
                                }],
                                pendingDare: [{
                                    idx: pendingDare[0].idx,
                                    creator: pendingDare[0].creator,
                                    place: pendingDare[0].place,
                                    date: pendingDare[0].date,
                                    invited: pendingDare[0].invited,
                                    pending: pendingDare[0].pending.map(idx => {
                                        const user = idxTransrationUser(idx);
                                        return {
                                            idx: user._id,
                                            id: user.id,
                                            nickname: user.nickname,
                                            profileImageUrl: user.profileImageUrl
                                        }
                                    }),
                                }]
                            }
                        }
                    };

                    before(async () => {
                        Sinon.stub(InstantModel.Func, 'getInstantByUser').returns(invitedInstant);
                        Sinon.stub(InstantModel.Func, 'getPendingInstantByUser').returns(pendingInstant);
                        Sinon.stub(DareModel.Func, 'getDareByUser').returns(invitedDare);
                        Sinon.stub(DareModel.Func, 'getPendingDareByUser').returns(pendingDare);

                        Sinon.stub(UserModel.Schema, 'findById').callsFake(idxTransrationUser);
                        
                        await AppointmentMiddleware.getAppointment[1](basicRequest, stubResponse, spyNext);
                    });
                    after(() => { Sinon.restore(); });

                    it('InstantModel, DareModel를 사용할 때 전달한 인자는 정해져 있다', function(){
                        Sinon.assert.calledWith(InstantModel.Func.getInstantByUser, basicRequest.jwt_user_idx);
                        Sinon.assert.calledWith(InstantModel.Func.getPendingInstantByUser, basicRequest.jwt_user_idx);
                        Sinon.assert.calledWith(DareModel.Func.getDareByUser, basicRequest.jwt_user_idx);
                        Sinon.assert.calledWith(DareModel.Func.getPendingDareByUser, basicRequest.jwt_user_idx);
                    });
                    it('UserModel.Schema.findById 사용되는 횟수는 정해져 있다', function(){
                        Sinon.assert.callCount(UserModel.Schema.findById, 10);
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

                it('findById가 null일 때');

            });

        });
        
    });

});