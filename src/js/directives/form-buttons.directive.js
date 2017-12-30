angular.module('table.grid')
    .directive('formButtons', function()
    {
        return {
            restrict: 'E',
            templateUrl: 'form-buttons.html',
            scope: {
                /*
                | ---------------------------------------------------------------------------
                | string, the id of the record with is a update
                | ---------------------------------------------------------------------------
                */
                id: "=id",
                /*
                | ---------------------------------------------------------------------------
                | string, the base path of the current module
                | ---------------------------------------------------------------------------
                */
                name: "=?name",
                /*
                | ---------------------------------------------------------------------------
                | string, which buttons should be used (view|save)
                | ---------------------------------------------------------------------------
                */
                type: "@type",
                /*
                | ---------------------------------------------------------------------------
                | string, The text show together extraData param
                | ---------------------------------------------------------------------------
                */
                label: "@label",
                /*
                | ---------------------------------------------------------------------------
                | string, Additional data to be show in with the type equal to 'view'
                | ---------------------------------------------------------------------------
                */
                extraData: "=?extraData",
                /*
                | -------------------------------------------------------------------
                | Array, The enabled actions
                | -------------------------------------------------------------------
                */
                actions: "=?actions",
                /*
                | ---------------------------------------------------------------------------
                | string, The kind of render for each text in the buttons(text|icon|text-icon)
                | ---------------------------------------------------------------------------
                */
                renderText: "@renderText" 
            },
            controller: ["$scope", "$filter", function($scope, $filter)
            {
                $scope.actions = $scope.actions || [];
                $scope.type = (angular.isDefined($scope.type) ? $scope.type : 'save');
                $scope.renderText = (angular.isDefined($scope.renderText) ? $scope.renderText : 'text');
                
                $scope.hasIcon = function(){
                    return /(icon|text-icon)/.test($scope.renderText); 
                };
                $scope.hasText = function(){
                    return /(text|text-icon)/.test($scope.renderText);
                };
                $scope.actionAllow = function(string){
                    return ($scope.actions.indexOf(string) != -1 ? true : false);
                };
            }]
        }
    });