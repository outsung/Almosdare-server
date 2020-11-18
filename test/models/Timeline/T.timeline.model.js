// require
const Mongoose = require('mongoose');
const TimelineModel = require("../../../src/models/Timeline/timeline.model");
const Chai = require('chai');
const Sinon = require('sinon');

describe('======== TimelineModel 테스트 ========', function(){
    
    describe('TimelineModel 스키마 유요성 테스트', function(){
        
        it('스키마 필수 요소는 정해져 있다', function(done){
            const t = new TimelineModel.Schema();
        
            t.validate(function(err){
                // timeline 필수 요소
                Chai.expect(err.errors.user).to.exist;
                Chai.expect(err.errors.message).to.exist;
                
                done();
            });
        });

    });

    describe('TimelineModel 메소드 테스트', function(){
        
        describe('add 테스트', function(){
            let t;
            let stubSave;
            
            before(() => {
                t = new TimelineModel.Schema({
                    user_idx: Mongoose.Types.ObjectId(),
                    message: "some message"
                });

                Sinon.stub(TimelineModel, 'Schema').returns(t);
            });

            beforeEach(() => stubSave = Sinon.stub(t, 'save'));
            afterEach(() => stubSave.restore());

            it('유요한 필드가 들어왔을때 save 호출이 되어야 한다', function(){
                TimelineModel.Func.add(Mongoose.Types.ObjectId(), "some message");
                
                Chai.expect(stubSave.calledOnce).to.true;
            });

            it('user_idx 필드가 비어있으면 save 호출돼선 안된다', function(){
                TimelineModel.Func.add("", "some message");
                
                Chai.expect(stubSave.notCalled).to.true;
            });
            it('message 필드가 비어있으면 save 호출돼선 안된다', function(){
                TimelineModel.Func.add(Mongoose.Types.ObjectId(), "");
                
                Chai.expect(stubSave.notCalled).to.true;
            });
            it('user_idx는 ObjectId가 아니면 save 호출돼선 안된다', function(){
                TimelineModel.Func.add("not idx", "some message");
                
                Chai.expect(stubSave.notCalled).to.true;
            });

        });

    });

});