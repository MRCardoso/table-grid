/**
 * table-grid - AngularJS module to easily the criation of tables of display data
 * 
 * Copyright 2017 Marlon R Cardoso <marlonrcardoso@yahoo.com.br>
 */
(function(){
    'use strict';
    angular
        .module('table.grid',[
            'angularUtils.directives.dirPagination',
            'ui.bootstrap',
            'angular-bind-html-compile'
        ])
        .run(["$rootScope", "$filter", function($rootScope, $filter){            
            $rootScope.createUrl = function(path, param, action)
            {
                return $filter('renderUrl')(path, param, action);
            };
        }]);
}());