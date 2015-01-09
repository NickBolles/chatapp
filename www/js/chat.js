var app = angular.module('chat', [])

.controller('ChatCtrl', ['$scope', '$ionicModal', '$timeout', 'socket', '$filter',
    function($scope, $ionicModal, $timeout, socket, $filter){
        $scope.sort = 'sent';
        $scope.toggleReverse = function(){
            $scope.reverse = ($scope.reverse == false);
            $scope.order($scope.sort,$scope.reverse);
        };

        $scope.reverse = false;
        var orderBy = $filter('orderBy');
        $scope.order = function(predicate, reverse) {
            $scope.messages = orderBy($scope.messages, predicate, reverse);
        };
        $scope.order('sent',true);
        $scope.messages = [];
        socket.on('init', function (data) {
            //$scope.name = data.name;
            //$scope.users = data.users;
            $scope.messages = data.messages;
            console.log("socket initiated");

        });

        socket.on('message', function (message) {

            console.log("Message Recieved: " + JSON.stringify(message));
            $scope.messages.push(message);
            console.log($scope.messages);
        });

        socket.on('change:name', function (data) {
            changeName(data.oldName, data.newName);
        });

        socket.on('user:join', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has joined.'
            });
            $scope.users.push(data.name);
        });


        $scope.sendMessage = function () {
            socket.emit('message',  $scope.newMessage);

            // add the message to our model locally
            //$scope.messages.push();

            // clear message box
            $scope.newMessage = '';
        };

    }]);

