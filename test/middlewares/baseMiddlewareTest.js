// require
const Sinon = require('sinon');
const Chai = require('chai');


// middleware에 badRequest(필드 누락)이 들어왔을 때 validResponse과 같은지 확인하는 함수
function ifFieldDoseNotExist(middleware, badRequest, validResponse){
    const spyNext = Sinon.spy();
    const stubResponse = {
        status: Sinon.stub(),
        json: Sinon.stub(),
    };
    stubResponse.status.returns(stubResponse);

    middleware(badRequest, stubResponse, spyNext);
    
    it('next()는 한번도 호출돼선 안된다', function(){
        Chai.expect(spyNext.notCalled).to.be.true;
    });

    it('필드에 따른 Response을 줘야한다', function(){
        Sinon.assert.calledWith(stubResponse.status, validResponse.status);
        Sinon.assert.calledWith(stubResponse.json, validResponse.json);
    });
}

// Verify 미들웨어의 테스트 함수
function middlewareVerifyTest(middleware, requestForm){
    
    context('Expect', function(){
        context('유효한 요청이 들어왔을 때', function(){
            it('next()는 한번만 호출해야한다', async function(){
                const spyNext = Sinon.spy();
        
                await middleware(requestForm, {}, spyNext);
                Chai.expect(spyNext.calledOnce).to.be.true;
            })
        })
    });
    
    context('Exception', function(){
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
    });

}

// Action 미들웨어의 테스트 함수
function middlewareActionTest(){
}

module.exports = {
    ifFieldDoseNotExist: ifFieldDoseNotExist,
    middlewareVerifyTest: middlewareVerifyTest,
    middlewareActionTest : middlewareActionTest,
};
