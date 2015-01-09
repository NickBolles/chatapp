(function(){
    var app = angular.module('utils', ['ui.router', 'ng-iscroll', 'data']);
    app.service('ModalService', ['$modal',
        function ($modal) {

            var modalDefaults = {
                backdrop: true,
                keyboard: true,
                modalFade: true,
                templateUrl: 'modal.html'
            };

            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?'
            };

            this.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };

            this.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $modalInstance.close(result);
                        };
                        $scope.modalOptions.close = function (result) {
                            $modalInstance.dismiss('cancel');
                        };
                    }
                }

                return $modal.open(tempModalDefaults);
            };

        }]);
    app.service( 'utils', [ '$rootScope','$settings', '$location', function( $rootScope, $settings ) {
        var service = {
            resizeAmt: 0,
            resize : function(){
                //console.log('Resizing app... Window is ' + $(window).height() + ' header is ' + $(".header").outerHeight() + ' content is ' + $('.content').outerHeight() + ' Detail Item is ' + $('.detailItem').outerHeight() + ' Item List Wrapper is ' + ($('.content').outerHeight()-$('.detailItem').outerHeight()))
                $('.content').css({
                    "margin-top": $("#header").outerHeight(),
                    "height":(($(window).height()-$("#header").outerHeight()))
                });
                $('.custom-item-list-wrapper').css({
                    "height": ((($(window).height()-$("#header").outerHeight())-$('.custom-detail-item').outerHeight())-5)
                });
                service.resizeAmt++;
                console.log(service.resizeAmt);
                //console.log('done resizing app... Window is ' + $(window).height() + ' header is ' + $(".header").outerHeight() + ' content is ' + $('.content').outerHeight() + ' Detail Item is ' + $('.detailItem').outerHeight() + ' Item List Wrapper is ' + ($('.content').outerHeight()-$('.detailItem').outerHeight()))
            },
            
            isData:function(data){
                //test for each type of data that could be passed in
                if ( data.terms ){
                    if (data.terms.length > 0){
                        return true;
                    }else{
                        return false;
                    }
                }
                else if ( data.courses ){
                    if (data.courses.length > 0){
                        return true;
                    }else{
                        return false;
                    }
                }
                else if ( data.assigns ){
                    if (data.assigns.length > 0){
                        return true;
                    }else{
                        return false;
                    }
                }
                else if(data.assignName){
                    if (data.assignName !== ""){
                        return true
                    }else{
                        return false
                    }
                }
                else{
                    return false;
                }
            }


        };
        $('#app').on('click tap', "#loader-bg",function(){service.loading(false)});
        $('#app').append('<div id="loader-bg" class="topcoat-overlay-bg"></div><div class="ui-loader"><div class="loader"><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div><div class="circle"></div></div></div>');//<img id="loading-icon" src="img/spinner.png" class="ui-icon-loading"/></div>

        return service;
    }]);
})();
function toStr(input, formatted) {
    formatted = (formatted == undefined) ? false:formatted;
    if (input !== undefined) {
        var output;
        if (typeof input !== 'string') {
            //input is not a string, check to see if its an object, if it is stringify it
            //console.log('UserData is not an object');
            if (typeof input == 'object') {
                if (testing) {
                    console.log('input is an object, stringifying it...');
                }
                if (formatted){
                    output = JSON.stringify(input, null, 3);
                }else{
                    output = JSON.stringify(input);
                }
                return output;
            } else {
                //input is not an object, log an error and return nothing
                if (testing) {
                    console.log('ERROR: user data is not an object...Unable to stringify');
                }
                return;
            }
        } else {
            return input;
        }
    }
}
function toObj(input){
    if (input != 'undefined'){
        var output;
        if (typeof input !== 'object'){
            //input is not an object, check to see if its a string, if it is parse it
            if (typeof input == 'string'){
                if (testing){console.log('input is a string, parsing it...');};
                output = JSON.parse(input);
                return output;
            }else{
                //input is not a string, log an error and return false
                if (testing){console.log('ERROR: user data is not a string...');};
                return;
            }
        }else{
            //input is allready an object, return it
            return input;
        }
    }
}
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
var testData;
function testUserData(){
    testData = localStorage.getItem('user');
    console.log(testData);
    console.log(testData = toObj(testData));
}