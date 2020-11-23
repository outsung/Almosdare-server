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
                Chai.expect(err.errors.invited).to.exist;
                
                done();
            });
        });
        it('invited.length가 1보다 작다면 실패해야한다', function(done){
            const d = new DareModel.Schema({
                creator: Mongoose.Types.ObjectId(),
                date: new Date(), 
                place: {},
                invited: [],
            });
            
            d.validate(function(err){
                Chai.expect(err.errors.invited).to.exist;
                done();
            });
        });
        it('invited.length가 1보다 크다면 성공해야한다', function(done){
            const d = new DareModel.Schema({
                creator: Mongoose.Types.ObjectId(),
                date: new Date(), 
                place: {},
                invited: [Mongoose.Types.ObjectId()],
            });
            
            d.validate(function(err){
                Chai.expect(err).to.not.exist;
                done();
            });
        });

        it('과거로 약속을 잡는다면?');
    });
    
    describe('DareModel 메소드 테스트', function(){
        
        describe('getDareByUser 테스트', function(){
            
            afterEach(() => Sinon.verifyAndRestore());

            it('사용되는 쿼리는 정해져 있다', function(){
                const dares = [];
                Sinon.stub(DareModel.Schema, 'find').returns(dares);
                Sinon.stub(dares, 'sort');

                const expectedIdx = Mongoose.Types.ObjectId();
                
                DareModel.Func.getDareByUser(expectedIdx);

                Sinon.assert.calledWith(DareModel.Schema.find, {$or: [{creator: expectedIdx}, {invited: {$in : expectedIdx}}]});
                Sinon.assert.calledWith(dares.sort, {updatedAt: -1});
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
                Sinon.stub(expectedDare, 'sort').returns(expectedDare);
                
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
                const dares = [];
                Sinon.stub(DareModel.Schema, 'find').returns(dares);
                Sinon.stub(dares, 'sort');

                const expectedIdx = Mongoose.Types.ObjectId();
                
                DareModel.Func.getPendingDareByUser(expectedIdx);

                Sinon.assert.calledWith(DareModel.Schema.find, {pending: {$in : expectedIdx}});
                Sinon.assert.calledWith(dares.sort, {updatedAt: -1});
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
                Sinon.stub(expectedDare, 'sort').returns(expectedDare);

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