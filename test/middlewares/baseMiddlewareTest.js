// require
const Sinon = require("sinon");
const Chai = require('chai');


// middleware에 badRequest(필드 누락)이 들어왔을 때 validResponse과 같은지 확인하는 함수
function ifFieldDoseNotExist(middleware, badRequest, validResponse){
    const nextSpy = Sinon.spy();
    const stubResponse = {
        status: function(status){
            this.status = status;
            return this;
        },
        json: function(json){
            this.json = json;
            return this;
        }
    };

    middleware(badRequest, stubResponse, nextSpy);
    
    it('필드가 누락되었을 때 next()는 한번도 호출돼선 안된다', function(){
        Chai.expect(nextSpy.notCalled).to.be.true;
    });

    it('필드가 누락되었을 때 필드에 따른 Response을 줘야한다', function(){
        Chai.expect(stubResponse.status === validResponse.status).to.be.true;
        Chai.expect(JSON.stringify(stubResponse.json) === JSON.stringify(validResponse.json)).to.be.true;
    });
}

// Verify 미들웨어의 테스트 함수
function middlewareVerifyTest(middleware, requestForm){
    
    it('유효한 요청이 들어왔을때 next()는 한번만 호출해야한다', function(){
        const nextSpy = Sinon.spy();

        middleware(requestForm, {}, nextSpy);
        Chai.expect(nextSpy.calledOnce).to.be.true;
    })
    
    // req.jwt_user_idx
    if(Object.keys(requestForm).includes("jwt_user_idx")){
        // jwt_user_idx가 존재하지 않는 badRequest;
        const badRequest = {
            body: {},
            params: {}
        };
        Object.assign(badRequest.body, requestForm.body);
        Object.assign(badRequest.params, requestForm.params);
        
        context('jwt_user_idx 핃드 누락', function(){
            ifFieldDoseNotExist(middleware, badRequest, {
                status: 401,
                json: "Available after login"
            });
        });
    }
    
    // req.body
    Object.keys(requestForm).map(bodyOrParams => {
        if(!["body", "params"].includes(bodyOrParams)) return;

        Object.keys(requestForm[bodyOrParams]).map(field => {
            const badRequest = {};
            const badObject = {};
            Object.assign(badRequest, requestForm);
            Object.assign(badObject, requestForm[bodyOrParams]);

            delete badObject[field];
            badRequest[bodyOrParams] = badObject;
            context(`${field} 핃드 누락`, function(){
                ifFieldDoseNotExist(middleware, badRequest, {
                    status: 200,
                    json: {
                        result: -1,
                        message: `${field} : Field is empty`,
                    }
                });
            });
        });

    });

}

// Action 미들웨어의 테스트 함수
function middlewareActionTest(middleware, requestForm){
    
    it('유효한 요청이 들어왔을때 next()는 한번만 호출해야한다', function(){
        const nextSpy = Sinon.spy();

        middleware(requestForm, {}, nextSpy);
        Chai.expect(nextSpy.calledOnce).to.be.true;
    })
    
    // req.jwt_user_idx
    if(Object.keys(requestForm).includes("jwt_user_idx")){
        // jwt_user_idx가 존재하지 않는 badRequest;
        const badRequest = {
            body: {},
            params: {}
        };
        Object.assign(badRequest.body, requestForm.body);
        Object.assign(badRequest.params, requestForm.params);
        
        context('jwt_user_idx 핃드 누락', function(){
            ifFieldDoseNotExist(middleware, badRequest, {
                status: 401,
                json: "Available after login"
            });
        });
    }
    
    // req.body
    Object.keys(requestForm).map(bodyOrParams => {
        if(!["body", "params"].includes(bodyOrParams)) return;

        Object.keys(requestForm[bodyOrParams]).map(field => {
            const badRequest = {};
            const badObject = {};
            Object.assign(badRequest, requestForm);
            Object.assign(badObject, requestForm[bodyOrParams]);

            delete badObject[field];
            badRequest[bodyOrParams] = badObject;
            context(`${field} 핃드 누락`, function(){
                ifFieldDoseNotExist(middleware, badRequest, {
                    status: 200,
                    json: {
                        result: -1,
                        message: `${field} : Field is empty`,
                    }
                });
            });
        });

    });

}

module.exports = {
    ifFieldDoseNotExist: ifFieldDoseNotExist,
    middlewareVerifyTest: middlewareVerifyTest,
    middlewareActionTest : middlewareActionTest,
};
