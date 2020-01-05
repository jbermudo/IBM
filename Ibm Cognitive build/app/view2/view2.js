'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'registerEmployee'
  });
}])

app.controller('registerEmployee', function($scope, $http) {

  $scope.data = [];

  $scope.submit = function(){

  $http ({
    method: 'POST',
    url: 'http://localhost:3000/users',
    data: $scope.user

  }).then(function successCallback(response){
      if($scope.user.username == null || $scope.user.password == null){
        console.log("Input Field Required");
      }else{
        $scope.data.push(response.data);
        console.log(response.data);
        console.log("success");
      }
      
  }), function errorCallback(response){
    console.log(response);
    }
  }
});