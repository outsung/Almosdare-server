// require
const UserModel = require("../../../src/models/User/user.model");
const Chai = require('chai');

describe('======== UserModel 테스트 ========', function(){
    
    describe('UserModel 스키마 유요성 테스트', function(done){
        it('스키마 필수 요소는 정해져 있다', function(done){
            const u = new UserModel.Schema();
            
            u.validate(function(err){
                // user 필수 요소
                Chai.expect(err.errors.id).to.exist;
                Chai.expect(err.errors.password).to.exist;
                Chai.expect(err.errors.salt).to.exist;
                Chai.expect(err.errors.nickname).to.exist;
                
                done();
            });
        });
    });

});