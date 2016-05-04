'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // Redirect to 404 when route not found
        $urlRouterProvider.otherwise(function ($injector) {
            $injector.get('$state').transitionTo('not-found', null, {
                location: false
            });
        });

        // Home state routing
        $stateProvider
            .state('places', {
                url: '/places',
                templateUrl: 'modules/core/client/places/places.client.view.html',
                controller: 'PlacesController'
            })
            .state('microcontrollers', {
                url: '/microcontrollers',
                templateUrl: 'modules/core/client/microcontrollers/microcontrollers-list/microcontrollers.client.view.html',
                controller: 'MicrocontrollersController',
                controllerAs: 'microcontrollersController'
            })
            .state('sensors', {
                url: '/sensors',
                templateUrl: 'modules/core/client/sensors/sensors-list/sensors.client.view.html',
                controller: 'SensorsController',
                controllerAs: 'sensorsController'
            })
            .state('actuators', {
                url: '/actuators',
                templateUrl: 'modules/core/client/actuators/actuators-list/actuators.client.view.html',
                controller: 'ActuatorsController'
            })
            .state('rules', {
                url: '/rules',
                templateUrl: 'modules/core/client/rules/rules-list/rules.client.view.html',
                controller: 'RulesController'
            })
            .state('home', {
                url: '/',
                templateUrl: 'modules/core/client/views/home.client.view.html'
            })
            .state('not-found', {
                url: '/not-found',
                templateUrl: 'modules/core/client/views/404.client.view.html',
                data: {
                    ignoreState: true
                }
            })
            .state('bad-request', {
                url: '/bad-request',
                templateUrl: 'modules/core/client/views/400.client.view.html',
                data: {
                    ignoreState: true
                }
            })
            .state('forbidden', {
                url: '/forbidden',
                templateUrl: 'modules/core/client/views/403.client.view.html',
                data: {
                    ignoreState: true
                }
            });
    }
]);
