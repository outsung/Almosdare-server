// require
const Mongoose = require('mongoose');
const InstantModel = require("../../../src/models/Instant/instant.model");
const Chai = require('chai');
const Sinon = require('sinon');

describe('======== InstantModel 테스트 ========', function(){

    describe('InstantModel 스키마 유요성 테스트', function(){
        it('InstantModel 스키마 필수 요소는 정해져 있다', function(done){
            const i = new InstantModel.Schema();
            
            i.validate(function(err){
                // instant 필수 요소
                Chai.expect(err.errors.invited).to.exist;
                
                done();
            });
        });
        it('InstantModel invited.length가 1보다 작다면 실패해야한다', function(done){
            const i = new InstantModel.Schema({invited: []});
            
            i.validate(function(err){
                Chai.expect(err.errors.invited).to.exist;
                done();
            });
        });
        it('InstantModel invited.length가 1보다 크다면 성공해야한다', function(done){
            const i = new InstantModel.Schema({invited: [Mongoose.Types.ObjectId()]});
            
            i.validate(function(err){
                Chai.expect(err).to.not.exist;
                done();
            });
        });
    });
    
    describe('InstantModel 메소드 테스트', function(){
        
        describe('getInstantByUser 테스트', function(){
            
            afterEach(() => Sinon.verifyAndRestore());

            it('getInstantByUser 사용되는 쿼리는 정해져 있다', function(){
                Sinon.stub(InstantModel.Schema, 'find');
                const expectedIdx = Mongoose.Types.ObjectId();
                
                InstantModel.Func.getInstantByUser(expectedIdx);

                Sinon.assert.calledWith(InstantModel.Schema.find, {invited: {$in : expectedIdx}});
            });

            it('getInstantByUser 반환값은 정해져 있다', async function(){
                const expectedInstant = [{
                    pending: [Mongoose.Types.ObjectId()],
                    invited: [Mongoose.Types.ObjectId()],
                    _id: "idx",
                    temp: "temp",
                }];
                Sinon.stub(InstantModel.Schema, 'find').returns(expectedInstant);

                const fineInstant = await InstantModel.Func.getInstantByUser('idx');
                
                Chai.expect(fineInstant[0].invited).to.exist;
                Chai.expect(fineInstant[0].pending).to.exist;
                Chai.expect(fineInstant[0].idx).to.exist;
                Chai.expect(fineInstant[0].temp).to.not.exist;
            });

        });

        describe('getPendingInstantByUser 테스트', function(){
            
            afterEach(() => Sinon.verifyAndRestore());
            
            it('getPendingInstantByUser에 사용되는 쿼리는 정해져 있다', function(){
                Sinon.stub(InstantModel.Schema, 'find');
                const expectedIdx = Mongoose.Types.ObjectId();
                
                InstantModel.Func.getPendingInstantByUser(expectedIdx);

                Sinon.assert.calledWith(InstantModel.Schema.find, {pending: {$in : expectedIdx}});
            });

            it('getPendingInstantByUser 반환값은 정해져 있다', async function(){
                const expectedInstant = [{
                    pending: [Mongoose.Types.ObjectId()],
                    invited: [Mongoose.Types.ObjectId()],
                    _id: "idx",
                    temp: "temp",
                }];
                Sinon.stub(InstantModel.Schema, 'find').returns(expectedInstant);

                const fineInstant = await InstantModel.Func.getPendingInstantByUser('idx');
                
                Chai.expect(fineInstant[0].invited).to.exist;
                Chai.expect(fineInstant[0].pending).to.exist;
                Chai.expect(fineInstant[0].idx).to.exist;
                Chai.expect(fineInstant[0].temp).to.not.exist;
            });
        });
    });

});