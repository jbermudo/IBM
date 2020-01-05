'use strict';

let app = angular.module('myApp.view1', ['ngRoute'])

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'loginCtrl',
            controller: 'Logout'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard.html'
        })
        .otherwise({
            redirectTo: '/'
        })
}])

//login 
app.controller('loginCtrl', function($http, $scope, $location, $timeout, $window, $rootScope, $sce) {
    $scope.submit = function() {
        $http.get('accounts.json').then(function(response) {
            $scope.accounts = response.data;
            let account = response.data;
            let uname = $scope.username;
            let pword = $scope.password;
            let isLogged = false;

            $scope.showError = false; // set Error flag
            $scope.showSuccess = false; // set Success Flag

            if (uname == null || pword == null) {
                $scope.showError = true;
                $scope.error = "Username / Password Required";
                return false;
            } else {
                for (let i in account) {
                    if (uname == account[i].username && pword == account[i].password) {
                        //post

                        isLogged = true;
                        $scope.error = "Login Success"
                        $timeout(function() {
                            window.localStorage.getItem("saved", JSON.stringify(account[i]));
                            window.location.href = '/dashboard';
                        }, 3000);
                        break;

                    } else {
                        $scope.error = "Invalid Account"
                        continue;
                    }
                } //for
            } //else

            //set error or success
            if (isLogged) {
                $scope.showError = false;
                $scope.showSuccess = true;
            } else {
                $scope.showError = true;
                $scope.showSuccess = false;
            }
        });
    }
});

//logout
app.controller('Logout', function($scope, $location) {
    $scope.logout = function() {
        window.location.href = "/index";
    }
});
//getting credentials

app.controller('showCredentials', function($http, $scope) {
    $http.get('accounts.json').then(function(response) {
        console.log(response.data);
        let data = response.data;

        function card() {
            for (let i in data) {
                let mainDiv = document.getElementById("deck");
                let divCard = document.createElement("div");
                divCard.setAttribute("class", "card");
                divCard.setAttribute("style", "width: 18rem;");
                let imgEl = document.createElement("img");
                imgEl.setAttribute("class", "card-img-top");
                imgEl.setAttribute("src", data[i].image);
                imgEl.setAttribute("alt", "Card image cap");
                let pEl = document.createElement("p");
                let pText = document.createTextNode(data[i].name);
                pEl.setAttribute("class", "card-text");
                pEl.append(pText);
                let pEl2 = document.createElement("p");
                let pText2 = document.createTextNode(data[i].skill);
                pEl2.setAttribute("class", "card-text");
                pEl2.append(pText2);
                divCard.append(imgEl, pEl, pEl2);

                mainDiv.append(divCard);
            }

        }
        card();
        $scope.credentials = data;
    })
})