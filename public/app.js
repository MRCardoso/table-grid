'use strict';
angular.module("tg", [
        'ngRoute',
        'table.grid',
        'app.controller'
    ])
    .config(['$routeProvider', 'tableConfig', function($routeProvider, tableConfig)
        {
            angular.extend(tableConfig, {
                debugMode:true, 
                appLabels: { "status": {
                    "0": { "name": "Inativo", "class": "default"},
                    "1": { "name": "Ativo", "class": "success", "icon": "ok-circle"}
                }, "type": {
                    "1": { "name": "Low", "class": "info", "icon": "unchecked"},
                    "2": { "name": "Average", "class": "warning", "icon": "expand"},
                    "3": { "name": "High", "class": "danger", "icon": "collapse-up"}
                }, "element": {
                    "1": { "name": "Fire", "class": "danger", "icon": "fire"},
                    "2": { "name": "Rain", "class": "primary", "icon": "flash"},
                    "3": { "name": "High", "class": "success", "icon": "apple"}
                } },
                viewUrlTmpl: '/{id}',
            });

            $routeProvider.
                when('/',{
                    templateUrl: '/views/default.html'
                })
                .when('/label',{
                    templateUrl: '/views/label.html',
                    controller: "TableController"
                })
                .when('/action',{
                    templateUrl: '/views/table-action.html',
                    controller: "TableController"
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);