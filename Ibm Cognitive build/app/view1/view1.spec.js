'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var loginCtrl = $controller('loginCtrl');
      expect(loginCtrl).toBeDefined();
    }));

  });
});