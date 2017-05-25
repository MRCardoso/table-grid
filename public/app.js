'use strict';
angular.module("tg", [
        'ngRoute',
        'table.grid',
        'app.controller'
    ])
    .config(['$routeProvider', 'tableConfig', function($routeProvider, tableConfig)
        {
            angular.extend(tableConfig, {
                enableButtons: false,
                appLabels: { "status": {
                    "0": { "name": "Inativo", "class": "default", "icon": "ban-circle" },
                    "1": { "name": "Ativo", "class": "success", "icon": "ok-circle"}
                }}
            });

            $routeProvider.
                when('/',{
                    templateUrl: '/views/default.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }
    ]);