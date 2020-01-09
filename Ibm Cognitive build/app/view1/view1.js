'use strict';

let app = angular.module('myApp.view1', ['ngRoute'])

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'loginCtrl',
            controller: 'Logout',
            controller: 'Profile',
            controller: 'userProfile',
            controller: 'Home',
            controller: 'active-navlink',
            controller: 'employer'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}])

//login 
app.controller('loginCtrl', function ($http, $scope, $location, $timeout, $window, $rootScope, $sce) {
    $scope.submit = function () {
        $http.get('accounts.json').then(function (response) {
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
                        $scope.error = "Login Success! Welcome " + account[i].name;
                        $timeout(function () {
                            //Store browser database
                            window.localStorage.setItem('id', account[i].id);
                            window.localStorage.setItem('username', account[i].username);
                            window.localStorage.setItem('name', account[i].name);
                            window.localStorage.setItem('skill', account[i].skill);
                            window.localStorage.setItem('image', account[i].image);
                            window.localStorage.setItem('type', account[i].type);
                            window.localStorage.setItem('logged_timestamp', Date.now());
                            window.location.href = '/dashboard';
                        }, 2000);
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
app.controller('Logout', function ($scope, $location) {
    $scope.logout = function () {
        window.localStorage.clear();
        window.location.href = "/index";
    }
});
//profile
app.controller('Profile', function ($scope, $location) {
    $scope.profile = function () {
        window.location.href = "/profile";
    }
});
//profile
app.controller('Home', function ($scope, $location) {
    $scope.home = function () {
        window.location.href = "/dashboard";
    }
});
//getting credentials

app.controller('showCredentials', function ($http, $scope) {
    //Check user login exist
    let user_id = window.localStorage.getItem('id');
    if (!user_id) {
        window.location.href = '/index';
    }
    //Get account name from local storage
    let name = window.localStorage.getItem('name');
    document.getElementById("account-name").innerHTML = name;

    //Get account type from local storage
    let type = window.localStorage.getItem('type');
    //Iterate accounts
    $http.get('accounts.json').then(function (response) {
        let data = response.data;

        function card() {
            for (let i in data) {
                if (type == 'employee') {
                    console.log("employee");
                } else {
                    let mainDiv = document.getElementById("controller");
                    let divCol = document.createElement("div");
                    divCol.setAttribute("class", "col-lg-3 col-sm-4");
                    divCol.setAttribute("style", "padding: 10px;");
                    let divCard = document.createElement("div");
                    divCard.setAttribute("class", "card");
                    // divCard.setAttribute("style", "width: 18rem;");
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
                    //Download Button
                    let downloadBtn = document.createElement("a");
                    let downloadBtnTxt = document.createTextNode("Download Resume");
                    downloadBtn.setAttribute("class", "btn-primary");
                    downloadBtn.setAttribute("style", "padding: 10px; display: table; margin: auto auto;");
                    if (!data[i].resume) {
                        downloadBtn.disabled = true;
                    } else {
                        downloadBtn.setAttribute("href", data[i].resume);
                    }
                    downloadBtn.append(downloadBtnTxt);
                    //Append
                    divCard.append(imgEl, pEl, pEl2);
                    if (type == "employer") {
                        divCard.append(downloadBtn);
                    }
                    divCol.append(divCard)
                    mainDiv.append(divCol);
                }
            }

        }
        card();
        $scope.credentials = data;
    })
})

app.controller("userProfile", function ($http, $scope) {
    //get usernam,image,skill in window localStorage
    let userName = window.localStorage.getItem('name');
    let img = window.localStorage.getItem('image');
    let skill = window.localStorage.getItem('skill');

    //get id of card
    let card = document.getElementById("card")
    //create Element image
    let image = document.createElement("img");
    image.setAttribute("class", "card-img-top");
    image.setAttribute("src", img);
    image.setAttribute("alt", "Card image cap");
    //create element div
    let cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    //create element h5
    let h5 = document.createElement("card-title");
    h5.setAttribute("class", "card-title");
    h5.innerHTML = userName;
    //create element p
    let p = document.createElement("p");
    p.setAttribute("class", "card-text");
    p.innerHTML = skill;
    //append
    card.append(image, cardBody, h5, p);

})


app.controller('job', function ($http, $scope) {
    $http.get('jobs.json').then(function (response) {
        let data = response.data;
        for (let i in data) {
            let container = document.getElementById("job");
            let div = document.createElement("div");
            div.setAttribute("class", "jumbotron");

            let span = document.createElement("span");
            span.setAttribute("class", "jobtitle")
            span.innerHTML = data[i].jobtitle;

            let p = document.createElement("p");
            p.setAttribute("class", "company")
            p.innerHTML = "<span class='companyDesc'>Company: </span> " + data[i].company;

            let pLoc = document.createElement("p");
            pLoc.setAttribute("class", "location")
            pLoc.innerHTML = "<span class='spanLoc'><i class='fas fa-map-marker-alt'></i></span> " + data[i].location;


            let pDesc = document.createElement("p");
            pDesc.setAttribute("class", "description")
            pDesc.innerHTML = "<span class='spanDesc'>Job Description:</span> " + data[i].jobDescription;

            div.append(span, pLoc, p, pDesc)

            container.append(div);
        }
    });
});

app.controller('active-navlink', function ($scope) {
    $scope.navbarLink = function (elem) {
        let navlink = document.getElementById("navLink");
        let navlink2 = document.getElementById("navLink2");
        document.getElementById("row-flex-card").style.marginTop = "-40px";
        if (elem == "navLink") {
            navlink.classList.add("menu-link-active");
            navlink2.classList.remove("menu-link-active");

        } else if (elem == "navLink2") {
            navlink2.classList.add("menu-link-active");
            navlink.classList.remove("menu-link-active");
        }
    }
})

app.controller("employer", function ($http) {

    $http.get('employer.json').then(function (response) {
        let data = response.data;
        for (let i in data) {
            let rowflexCard = document.getElementById("row-flex-card");
            let divCol = document.createElement("div");
            divCol.setAttribute("class", "col-lg-4 col-sm-4");
            let a = document.createElement("a");
            a.setAttribute("href", "#");
            let im = document.createElement("img");
            im.setAttribute("src", data[i].image);
            // im.setAttribute("style", "width: 60%; position: absolute;top: 18px;")
            divCol.append(a, im);
            rowflexCard.append(divCol);

        }
    })
})