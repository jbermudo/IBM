'use strict';
let app = angular.module("myApp", []);
//Login
app.controller('loginCtrl', function ($http, $scope, $timeout) {
    $scope.submit = function () {
        $http.get('/account').then(function (response) {
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
                    if (uname == account[i].userid && pword == account[i].password) {
                        //post
                        isLogged = true;
                        $scope.error = "Login Success! Welcome " + account[i].firstname + " " + account[i].lastname;
                        console.log(account[i]);
                        $timeout(function () {
                            //Store browser database
                            window.localStorage.setItem('id', account[i]._id);
                            window.localStorage.setItem('firstname', account[i].firstname);
                            window.localStorage.setItem('lastname', account[i].lastname);
                            window.localStorage.setItem('email', account[i].email);
                            window.localStorage.setItem('type',account[i].type);
                            window.localStorage.setItem('logged_timestamp', Date.now());
                            if (account[i].type == "trainingCenter") {
                                window.location.href = 'dashboard.html';
                            } else {
                                window.location.href = 'dashboard.html';
                            }

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
    };

    $scope.registerJobseeker = function (account) {
        let e = document.getElementById("selection");
        let choices = e.options[e.selectedIndex].value;


        $scope.data = [
            {
                userid: account.userid,
                firstname: account.firstname,
                lastname: account.lastname,
                password: account.password,
                email: account.email,
                type: choices,
                image: "../images/images.png"
            }
        ];

        $http.post('/account',  $scope.data).then(function (response) {

            
        });

    }
});
//End Login

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
        window.location.href = "profile.html";
    }
});

app.controller('Home', function ($scope, $location) {
    $scope.home = function () {
        window.location.href = "dashboard.html";
    }
});

//getting credentials
app.controller('showCredentials', function ($http, $scope) {
    let user_id = window.localStorage.getItem('id');
    if (!user_id) {
        window.location.href = 'index.html';
    }
    //Get account name from local storage
    let firstname = window.localStorage.getItem('firstname');
    let lastname = window.localStorage.getItem('lastname');

    document.getElementById("account-name").innerHTML = firstname + " " + lastname;
    //Get account type from local storage
    let type = window.localStorage.getItem('type');
    //Iterate accounts
    $http.get('accounts.json').then(function (response) {
        let data = response.data;
        let head = document.getElementById("head");
        let jobs = document.getElementById("jobs");
        function card() {
            if (type == 'jobseeker') {

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

                        sendResume.setAttribute("class", "btn btn-primary");
                        sendResume.innerHTML = "Send Resume";
                        sendResume.setAttribute("data-toggle", "modal");
                        sendResume.setAttribute("style", "padding: 5px;color: white;")
                        sendResume.setAttribute("data-target", "#exampleModal");

                        div.append(span, pLoc, p, pDesc, sendResume);

                        container.append(div);
                    }

                });
            }
            for (let i in data) {
                if (type == 'jobseeker') {
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

        function checkSession() {
            let logged_timestamp = window.localStorage.getItem('logged_timestamp');
            let user_id = window.localStorage.getItem('id');
            if (logged_timestamp) {
                let now = Date.now();
                let session_time = 7; //Days
                //Compute log timestamp if more that 5 mins
                let diff = logged_timestamp - now;
                diff = diff + (((session_time * 24) * 60) * 1000); //7 days
                // diff = diff + (session_time * 1000); //5 secs
                const isTimeout = diff < 0;
                console.log(diff);
                if (isTimeout && user_id) {
                    window.localStorage.clear();
                    window.location.href = "index.html";
                }
            }
        }
        checkSession();
    });
});


app.controller("userProfile", function ($http, $scope) {
    //get usernam,image,skill in window localStorage
    let firstname = window.localStorage.getItem('firstname');
    let lastname = window.localStorage.getItem('lastname');

    let img = window.localStorage.getItem('image');
    let skill = window.localStorage.getItem('skill');
    let type = window.localStorage.getItem('type');

    let postJob = document.getElementById("post-job");

    if (type == "employer") {

    } else {
        postJob.remove();
        let postJobLi = document.getElementById("post-job-li");
        let a = document.createElement("a");
        a.setAttribute("class", "nav-link");
        a.setAttribute("href", "#");
        a.innerHTML = firstname + " " + lastname;
        postJobLi.append(a);
    }

});


app.controller("aboutUser", function ($http) {
    let firstname = window.localStorage.getItem('firstname');
    let lastname = window.localStorage.getItem('lastname');

    let email = window.localStorage.getItem('email');

    let cardBody = document.getElementById("aboutMecard")
    let div = document.createElement("div");
    div.setAttribute("class", "card-body");

    let p = document.createElement("p");
    p.setAttribute("style", "float: right;margin-right: 83px;");
    p.setAttribute("class", "card-text");
    p.innerHTML = '<strong>Email: </strong> <span class="text"> ' + email + '</span>'

    let p2 = document.createElement("p");
    p2.setAttribute("class", "card-text");
    p2.innerHTML = '<strong>Name: </strong> <span class="text"> ' + firstname + " " + lastname + '</span>'

    div.append(p, p2);
    cardBody.append(div);

});

app.controller('job', function ($http, $scope, $rootScope) {

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

            sendResume.setAttribute("class", "btn btn-primary");
            sendResume.innerHTML = "Login to Send Resume";
            sendResume.setAttribute("data-toggle", "modal");
            sendResume.setAttribute("style", "padding: 5px;color: white;")
            sendResume.setAttribute("data-target", "#staticBackdrop");

            div.append(span, pLoc, p, pDesc, sendResume);

            container.append(div);
        }

    });
});
app.controller('active-navlink', function ($scope, $rootScope) {
    $scope.navbarLink = function (elem) {
        let navlink = document.getElementById("navLink");
        let navlink2 = document.getElementById("navLink2");
        document.getElementById("header").style.marginTop = "-4px"

        if (elem == "navLink") {
            navlink.classList.add("menu-link-active");
            navlink2.classList.remove("menu-link-active");

        } else if (elem == "navLink2") {
            navlink2.classList.add("menu-link-active");
            navlink.classList.remove("menu-link-active");
        }
    }
});


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
});
