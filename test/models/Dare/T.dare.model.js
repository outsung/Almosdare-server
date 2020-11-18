// require
const Mongoose = require('mongoose');
const DareModel = require("../../../src/models/Dare/dare.model");
const Chai = require('chai');
const Sinon = require('sinon');

describe('======== DareModel 테스트 ========', function(){

    describe('DareModel 스키마 유요성 테스트', function(){
        it('스키마 필수 요소는 정해져 있다', function(done){
            const d = new DareModel.Schema();
            
            d.validate(function(err){
                // dare 필수 요소
                Chai.expect(err.errors.creator).to.exist;
                Chai.expect(err.errors.place).to.exist;
                Chai.expect(err.errors.date).to.exist;
                
                done();
            });
        });

        it('과거로 약속을 잡는다면?');
    });
    
    describe('DareModel 메소드 테스트', function(){
        
        describe('getDareByUser 테스트', function(){
            
            afterEach(() => Sinon.verifyAndRestore());

            it('사용되는 쿼리는 정해져 있다', function(){
                Sinon.stub(DareModel.Schema, 'find');
                const expectedIdx = Mongoose.Types.ObjectId();
                
                DareModel.Func.getDareByUser(expectedIdx);

                Sinon.assert.calledWith(DareModel.Schema.find, {$or: [{creator: expectedIdx}, {invited: {$in : expectedIdx}}]});
            });

            it('반환값은 정해져 있다', async function(){
                const expectedDare = [{
                    _id: "idx",
                    creator: Mongoose.Types.ObjectId(),
                    place: "some place",
                    date: "some date",
                    pending: [Mongoose.Types.ObjectId()],
                    invited: [Mongoose.Types.ObjectId()],
                    temp: "temp",
                }];
                Sinon.stub(DareModel.Schema, 'find').returns(expectedDare);

                const fineDare = await DareModel.Func.getDareByUser('idx');
                
                Chai.expect(fineDare[0].idx).to.exist;
                Chai.expect(fineDare[0].creator).to.exist;
                Chai.expect(fineDare[0].place).to.exist;
                Chai.expect(fineDare[0].date).to.exist;
                Chai.expect(fineDare[0].invited).to.exist;
                Chai.expect(fineDare[0].pending).to.exist;
                Chai.expect(fineDare[0].temp).to.not.exist;
            });

        });

        describe('getPendingDareByUser 테스트', function(){
            
            afterEach(() => Sinon.verifyAndRestore());
            
            it('사용되는 쿼리는 정해져 있다', function(){
                Sinon.stub(DareModel.Schema, 'find');
                const expectedIdx = Mongoose.Types.ObjectId();
                
                DareModel.Func.getPendingDareByUser(expectedIdx);

                Sinon.assert.calledWith(DareModel.Schema.find, {pending: {$in : expectedIdx}});
            });

            it('반환값은 정해져 있다', async function(){
                const expectedDare = [{
                    _id: "idx",
                    creator: Mongoose.Types.ObjectId(),
                    place: "some place",
                    date: "some date",
                    pending: [Mongoose.Types.ObjectId()],
                    invited: [Mongoose.Types.ObjectId()],
                    temp: "temp",
                }];
                Sinon.stub(DareModel.Schema, 'find').returns(expectedDare);

                const fineDare = await DareModel.Func.getPendingDareByUser('idx');
                
                Chai.expect(fineDare[0].idx).to.exist;
                Chai.expect(fineDare[0].creator).to.exist;
                Chai.expect(fineDare[0].place).to.exist;
                Chai.expect(fineDare[0].date).to.exist;
                Chai.expect(fineDare[0].invited).to.exist;
                Chai.expect(fineDare[0].pending).to.exist;
                Chai.expect(fineDare[0].temp).to.not.exist;
            });
        });
    });

});