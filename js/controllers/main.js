'use strict';

angular.module('testApp')
    .controller('MainCtrl', function ($scope) {


        $scope.menuColumns = [
            {"field": "description", "title": "Description"},
            {"field": "owner", "title": "Owner"},
            {"field": "currentBalance", "title": "Current Balance" }
        ];

        $scope.navProps = {
            animationTime: 0.2
        }
    });
