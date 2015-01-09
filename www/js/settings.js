(function() {
    var app = angular.module('settings', []);
    app.service('$settings', ['$rootScope', '$http', '$q', function ($rootScope, $http, $q) {
        var service = {
            settings: {},
            loadDefaults: function (deferred) {
                $http({method: 'GET', url: 'data/defaults.json'})
                    .success(function (data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        var uuid = Math.uuid();
                        data.appId = uuid;
                        service.settings = data;
                        console.log('Default Settings Loaded Successfully');
                        console.log('service.settings is ' + toStr(service.settings, true));
                        service.saveSettings();
                        service.settingsLoaded(deferred);
                    })
                    .error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.log('Error getting defaults');
                    });
            },
            saveSettings: function () {
                var settingsJSON = JSON.stringify(service.settings);
                localStorage.setItem('appSettings', settingsJSON);
            },
            startUp: function () {
                var deferred = $q.defer();

                service.loadDefaults(deferred);

                //TODO: REMOVE THIS COMMENT FOR PRODUCTION
                /*
                service.settings = localStorage.getItem('appSettings');
                //because the settings are still a string we need to see if service.settings is equal
                //to the string "null" not the value null
                //Along with the above we need !service.settings because if there is no local
                //storage item 'appSettings' Then it will return the value null, not the string null
                if (!service.settings || service.settings === "null" || service.settings === "undefined" || service.settings === undefined) {
                    //Settings don't exist, load defaults from file
                    service.loadDefaults(deferred);
                } else {
                    service.settingsLoaded(deferred);
                }

                */
                return deferred.promise;

            },
            settingsLoaded: function (deferred) {
                //The loaded settings are still a string, parse them into a JS object
                service.settings = toObj(service.settings);
                //prevent multiple increments of launch num by making sure its
                //10 seconds past the last time that the app was started
                var t = moment.utc().format("X");
                if ((t - service.settings.lastLaunch) > 10) {
                    ++service.settings.launchNum;
                    service.settings.lastLaunch = t;
                }
                service.saveSettings();
                //console.log(toStr(service.settings));
                deferred.resolve();
            }
        };

        return service;
    }]);

})();