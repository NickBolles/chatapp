(function(){
    var app = angular.module('user', ['ui.router', 'ng-iscroll', 'data']);
    
    app.service( 'user', [ '$rootScope','$settings', 'userMessages', '$http', '$progressView', '$q', '$cookies', function( $rootScope, $settings, userMessages , $http, $progressView, $q, $cookies) {
        var service = {
            firstName:"",
            lastName:"",
            email:"",
            pass:"",
            uuid:"",
            appName: $settings.settings.appName,
            appId: $settings.settings.appId,
            loggedIn:false,
            loggingIn:false,
            messages:userMessages,
            saveUser: function(toStoreUser){
                var data = (toStoreUser) ? toStoreUser: {email: service.email, pass: service.pass, name: service.firstName, userData: service.userData.data};
                localStorage.setItem('user', toStr(data));
            },
            loadUser:function(deferred){
                deferred = (deferred) ? deferred : $q.defer();
                var storedUser = toObj(localStorage.getItem('user'));
                if (storedUser){
                    service.email = storedUser.email;
                    service.pass = storedUser.pass;
                    service.firstName = storedUser.firstName;
                    service.userData.data = storedUser.userData;
                    service.loggedIn = false;

                    service.login(service.email, service.pass, function(){
                        service.loggedIn = true;
                        console.log("logged In and Synced Successfully!");
                        $rootScope.$broadcast('loggedIn');
                        deferred.resolve();
                    },
                    function(){
                        console.log("Failed to login!");
                        deferred.resolve();
                    });
                }
                deferred.resolve();
            },
            login:function(email, pass, success, fail, getData){
                getData = getData ? getData:true; //THIS IS NOT IMPLIMENTED ON THE SERVER YET
                $progressView.show("Logging In...");
                if (email != "" && pass != "" && !service.loggingIn){
                    service.loggingIn = true;
                    $http({
                        method  : 'POST',
                        url     : $settings.settings.loginPage.loginURL,
                        data: $.param({email: email, pass : pass, appId: service.appId, appName: service.appName}),
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
                    }).success(function(data) {
                        console.log(toStr(data));
                        if (data.message === "Logged In") {
                            $cookies.email = email;
                            $cookies.pass = pass;
                            //TODO GET NAME OUT OF RETURN AND ADD IT INTO SAVE USER LOGIN
                            //TODO get newly returned user and get data out of it
                            service.email = email;
                            service.pass = pass;
                            service.firstName = data.user.firstName;
                            service.loggedIn = true;
                            service.loggingIn = false;
                            service.userMessages.conversations = data.user.messages;
                            service.saveUser();
                            $progressView.hide();
                            console.log("Progressview hidden, syncing data");
                            if (success){
                                success();
                            }

                        } else {
                            $progressView.hide();
                            service.loggedIn = false;
                            service.loggingIn = false;
                            if (fail){
                                fail(data.message);
                            }
                        }
                    }).error(function(data){
                        if (data.message){
                            //errorMessage = e.responseJSON.message;
                        }else{
                            //errorMessage = 'Error Connecting with Server. Please Try Again';
                        }
                        service.loggingIn = false;
                        $progressView.hide();
                        if (fail){
                            fail();
                        }
                    });
                }
                else{
                    if(fail){
                        fail({message:'Please Enter an Email & a Password'});
                    }
                }
            },
            //The server now will login the user and return userData when registering
                            //This will not login after successfully registering, use registerAndLogin() for this
            register:function(user, success, fail){
                if (user.email != "" && user.pass != "" && user.firstName != ""&& user.uuid != ""){
                    user.appName = $settings.settings.appName;
                    user.appId = $settings.settings.appId;
                    $http({
                        method  : 'POST',
                        url     : $settings.settings.loginPage.registerURL,
                        data    : $.param(user),  // pass in data as strings
                        headers : { 'Content-Type': 'application/x-www-form-urlencoded'}  // set the headers so angular passing info as form data (not request payload)
                    }).success(function(data) {
                        console.log(data);
                        if (data.message === "Account Created") {
                            $cookies.email = user.email;
                            $cookies.pass = user.pass;
                            //TODO GET NAME OUT OF RETURN AND ADD IT INTO SAVE USER LOGIN
                            //TODO get newly returned user and get data out of it
                            service.email = user.email;
                            service.pass = user.pass;
                            service.firstName = data.user.firstName;
                            service.loggedIn = true;
                            service.loggingIn = false;
                            service.userMessages.conversations = data.user.messages;
                            service.saveUser();
                            $progressView.hide();
                            console.log("Progressview hidden, syncing data");
                            if (success){
                                success();
                            }
                        } else {
                            if (fail){
                                fail(data.message);
                            }
                        }
                    }).error(function(data){
                        if (fail){
                            fail(data.message);
                        }
                    });
                }
                else{
                    if(fail){
                        fail({message:'Please Enter an Email & Password'});
                    }
                }
            },
            logout: function(){
                service.firstName = "";
                service.email = "";
                service.pass = "";
                service.uuid = "";
                localStorage.removeItem('user');
                service.loggedIn = false;
                $rootScope.$state.go('start');
            },
            startUp: function () {
                var deferred = $q.defer();
                service.loadUser(deferred);
                service.userData.user = service;
                return deferred.promise;

            }
        };

        $rootScope.$on('saveUser', function(){service.saveUser()});
        $rootScope.$on('userDataUpdate', function(){service.saveUser()});
        return service;
    }]);
    app.service( 'messages', [ '$rootScope','$settings', '$http', 'utils', '$progressView', function( $rootScope, $settings , $http, utils, $progressView) {
        //This service could be transformed into an object with prototypes to find the items and such. This may be easier to use instead of userData.data.<whatever> it would be userData.<whatever>

        var service = {
            conversations: {},
            user: {}


        };

        return service;
    }]);
})();