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
            controller: 'employerController',
            controller: 'aboutUser'
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
                            window.localStorage.setItem('age', account[i].age);
                            window.localStorage.setItem('location', account[i].location);
                            window.localStorage.setItem('experience', account[i].experience);
                            window.localStorage.setItem('degree', account[i].degree);
                            window.localStorage.setItem('university', account[i].university);
                            window.localStorage.setItem('email', account[i].email);
                            window.localStorage.setItem('phone', account[i].phone);
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
        window.location.href = "index.html";
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
app.controller('showCredentials', function ($http, $scope,$rootScope) {
    //Check user login exist
    let user_id = window.localStorage.getItem('id');
    if (!user_id) {
        window.location.href = 'index';
    }
    //Get account name from local storage
    let name = window.localStorage.getItem('name');
    document.getElementById("account-name").innerHTML = name;
    //Get account type from local storage
    let type = window.localStorage.getItem('type');
    //Iterate accounts
    $http.get('accounts.json').then(function (response) {
        let data = response.data;
        let head = document.getElementById("head");
        let jobs = document.getElementById("jobs");
        function card() {
            if(type == 'employee'){
                $http.get('jobs.json').then(function (response) {
                    let type = window.localStorage.getItem('type');
                    let data = response.data;
                    for (let i in data) {
                        let container = document.getElementById("controller");
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
            
                        let sendResume = document.createElement("a");
                     
                        sendResume.setAttribute("class","btn btn-primary");
                        sendResume.innerHTML = "Send Resume";
                        sendResume.setAttribute("data-toggle","modal");
                        sendResume.setAttribute("style","padding: 5px;color: white;")
                        sendResume.setAttribute("data-target","#staticBackdrop");   
                        
                        div.append(span, pLoc, p, pDesc, sendResume);
            
                        container.append(div);
                    }
                    
                });
            }
            for (let i in data) {
                if (type == 'employee') {
                     head.remove();
                     
                } else {
                    jobs.remove();
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
                    divCard.append(imgEl, pEl);
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
            let type = window.localStorage.getItem('type');

            let postJob = document.getElementById("post-job");

            if(type == "employer"){
            
            }else{
                postJob.remove();
                let postJobLi = document.getElementById("post-job-li");
                let a = document.createElement("a");
                a.setAttribute("class","nav-link");
                a.setAttribute("href","#");
                a.innerHTML = userName;
                postJobLi.append(a);
            }

})

app.controller('job', function ($http, $scope, $rootScope) {
    $rootScope.$on("job", function(){
        $scope.job();
     });
    $scope.job = function () {
    $http.get('jobs.json').then(function (response) {
        let type = window.localStorage.getItem('type');
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

            let sendResume = document.createElement("a");
         
            sendResume.setAttribute("class","btn btn-primary");
            sendResume.innerHTML = "Login to Send Resume";
            sendResume.setAttribute("data-toggle","modal");
            sendResume.setAttribute("style","padding: 5px;color: white;")
            sendResume.setAttribute("data-target","#staticBackdrop");   
            
            div.append(span, pLoc, p, pDesc, sendResume);

            container.append(div);
        }
        
    });
    }
});

app.controller('active-navlink', function ($scope, $rootScope) {
    $scope.navbarLink = function (elem) {
        let navlink = document.getElementById("navLink");
        let navlink2 = document.getElementById("navLink2");
        document.getElementById("header").style.marginTop = "-4px"

        if (elem == "navLink") {
            navlink.classList.add("menu-link-active");
            navlink2.classList.remove("menu-link-active");
            $rootScope.$emit("job", {});

        } else if (elem == "navLink2") {
            navlink2.classList.add("menu-link-active");
            navlink.classList.remove("menu-link-active");
        }
    }
})

app.controller("employerController", function ($http, $scope) {
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

app.controller("aboutUser", function($http){
            let name = window.localStorage.getItem('name');
            let email = window.localStorage.getItem('email');
            let phone = window.localStorage.getItem('phone');
            let age = window.localStorage.getItem('age');
            let university = window.localStorage.getItem('university');
            let location = window.localStorage.getItem('location');
            let experience = window.localStorage.getItem('experience');
            let degree = window.localStorage.getItem('degree');


            let cardBody = document.getElementById("aboutMecard")
            let div = document.createElement("div");
            div.setAttribute("class","card-body");

            let p = document.createElement("p");
            p.setAttribute("style","float: right;margin-right: 83px;");
            p.setAttribute("class","card-text");
            p.innerHTML = '<strong>Email: </strong> <span> ' + email + '</span>'

            let p2 = document.createElement("p");
            p2.setAttribute("class","card-text");
            p2.innerHTML = '<strong>Name: </strong> <span> ' + name + '</span>'

            let p3 = document.createElement("p");
            p3.setAttribute("style","float: right;margin-right: 83px;");
            p3.setAttribute("class","card-text");
            p3.innerHTML = '<strong>Phone: </strong> <span> ' + phone + '</span>'

            let p4 = document.createElement("p");
            p4.setAttribute("class","card-text");
            p4.innerHTML = '<strong>Age: </strong> <span> ' + age + '</span>'

            
            let p5 = document.createElement("p");
            p5.setAttribute("style","float: right;margin-right: 77px;;");
            p5.setAttribute("class","card-text");
            p5.innerHTML = '<strong>University: </strong> <span> ' + university + '</span>'

            let p6 = document.createElement("p");
            p6.setAttribute("class","card-text");
            p6.innerHTML = '<strong>Location: </strong> <span> ' + location + '</span>'

            let p7 = document.createElement("p");
            p7.setAttribute("class","card-text");
            p7.innerHTML = '<strong>Experience: </strong> <span> ' + experience + '</span>'

            let p8 = document.createElement("p");
            p8.setAttribute("class","card-text");
            p8.innerHTML = '<strong>Degree: </strong> <span> ' + degree + '</span>'

            div.append(p,p2,p3,p4,p5,p6,p7,p8);
            cardBody.append(div);
  
});