// require
const Base = require("../baseMiddlewareTest");
const UserMiddleware = require("../../../src/middlewares/User/user.middleware");

// const Jwt = require("jsonwebtoken");
// const Crypto = require("crypto");
// const TimelineModel = require("../../models/Timeline/timeline.model");

describe('======== UserMiddleware 테스트 ========', function(){

    describe('getUserByJwt 테스트', function(){
        const requestForm = {
            jwt_user_idx: "token",
            body: {},
            params: {}
        };
        const responseForm = {
            result: "",

        };
        context('Verify', function(){
            Base.middlewareVerifyTest(UserMiddleware.getUserByJwt[0], requestForm);
        });
        it('Action', function(){

            // Base.middlewareActionTest(UserMiddleware.getUserByJwt[1], );
            
            /*
                res에 result가 있는가?;

            */


            /* success

            validResponse = {
                "result": 1,
                "idx": "5f9c7ced7e18780017f4f8fd",
                "id": "01012345678",
                "nickname": "test"
            }
            */

            /* fail

            {
                유저 idx 가 있는경우
            }

            */
            UserMiddleware.getUserByJwt[1]()
        });
    });
    describe('getUserById 테스트', function(){
        const requestForm = {
            jwt_user_idx : "token",
            body: {},
            params: {
                id: "test_id"
            }
        };
        context('Verify', function(){
            Base.middlewareVerifyTest(UserMiddleware.getUserById[0], requestForm);
        });
        it('Action');
    });
    describe('getUserByIdx 테스트', function(){
        const requestForm = {
            jwt_user_idx : "token",
            body: {},
            params: {
                idx: "test_idx"
            }
        };
        context('Verify', function(){
            Base.middlewareVerifyTest(UserMiddleware.getUserByIdx[0], requestForm);
        });
        it('Action');
    });


});