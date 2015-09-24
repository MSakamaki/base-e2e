'use strict';

describe('Angular Fullstack Top Page', ()=> {

  beforeEach(()=> browser.get('http://localhost:9000/'));

  it('click Features', done=> {

    return e2eTestHelper.capture.take('テスト開始')
      .then(()=> browser.wait(()=> e2eTestHelper.po.app.main.verification()))
      .then(()=> expect(e2eTestHelper.po.app.main.lblAlloAllo.getText()).toBe('\'Allo, \'Allo!'))
      .then(()=> e2eTestHelper.po.app.main.clickFeatures(1))

      .then(()=> e2eTestHelper.capture.take('Features２行目をクリックした', 'ココでテストが完了する。', [{
          type:'text',
          text: 'ここが押された',
          position: [320,420],
          color: 'blue',
        },{
          type: 'rect',
          position: [350,460, 300,50],
        },]))
      .then(()=> done());
  });

});
