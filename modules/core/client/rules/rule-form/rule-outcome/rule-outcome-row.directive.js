'use strict';

angular.module('core')
    .directive('ruleOutcomeRow', function () {
        return {
            restrict: 'E',
            require: '^form',
            templateUrl: 'modules/core/client/rules/rule-form/rule-outcome/rule-outcome-row.html',
            scope: {
                onRemove: '&',
                index: '=',
                outcome: '='
            },
            controller: function ($scope, actuatorsOptionsModel, actuatorsTypesModel) {

                $scope.actuatorsOptionsModel = actuatorsOptionsModel.model;

                $scope.name = 'outcome_name_' + $scope.index;

                actuatorsOptionsModel.load().then(function(){
                    $scope.outcome.actuator = $scope.outcome.actuator || actuatorsOptionsModel.model.actuatorsOptions[0].id;

                    $scope.getMin = function() {
                        var selectedOptionType = actuatorsOptionsModel.model.actuatorsOptions.find(function(a){
                            return a.id === $scope.outcome.actuator;
                        }).type;

                        return actuatorsTypesModel.model[selectedOptionType].min;
                    };

                    $scope.getMax = function() {
                        var selectedOptionType = actuatorsOptionsModel.model.actuatorsOptions.find(function(s){
                            return s.id === $scope.outcome.actuator;
                        }).type;

                        return actuatorsTypesModel.model[selectedOptionType].max;
                    };

                    $scope.getValidationMessage = function(){
                        var min = $scope.getMin(),
                            max = $scope.getMax();

                        if(!$scope.outcome.value || $scope.outcome.value < min || $scope.outcome.value > max){
                            return 'Value should be between ' + min + ' and ' + max;
                        }

                        return '';
                    };
                });
            },
            link: function ($scope, element, attr, ctrl) {
                $scope.form = ctrl;
            }
        };
    });