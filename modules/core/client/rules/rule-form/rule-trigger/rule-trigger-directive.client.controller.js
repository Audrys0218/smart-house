'use strict';

angular.module('core')
    .controller('RuleTriggerController',
        function($scope, sensorsOptionsModel, sensorsTypesModel, operatorsModel) {

            $scope.name = 'trigger_name_' + $scope.index;

            $scope.operators = operatorsModel.model;

            $scope.sensorsOptionsModel = sensorsOptionsModel.model;

            $scope.trigger.compareType = $scope.trigger.compareType || '>';

            sensorsOptionsModel.load().then(function() {
                $scope.trigger.sensor = $scope.trigger.sensor || sensorsOptionsModel.model.sensorsOptions[0].id;

                $scope.getMin = function() {
                    var selectedOptionType = sensorsOptionsModel.model.sensorsOptions.find(function(s){
                        return s.id === $scope.trigger.sensor;
                    }).type;

                    return sensorsTypesModel.model[selectedOptionType].min;
                };

                $scope.getMax = function() {
                    var selectedOptionType = sensorsOptionsModel.model.sensorsOptions.find(function(s){
                        return s.id === $scope.trigger.sensor;
                    }).type;

                    return sensorsTypesModel.model[selectedOptionType].max;
                };

                $scope.getValidationMessage = function(){
                    var min = $scope.getMin(),
                        max = $scope.getMax();

                    if(typeof $scope.trigger.value === 'undefined' ||
                        typeof $scope.trigger.value === 'string' ||
                        $scope.trigger.value < min ||
                        $scope.trigger.value > max){
                        return 'Value should be between ' + min + ' and ' + max;
                    }

                    return '';
                };
            });
        });
