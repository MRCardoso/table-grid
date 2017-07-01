angular.module('table.grid')
    .directive('tableAction',function()
    {
        return {
            restrict: 'E',
            templateUrl: 'table-action.html',
            scope: {
                /*
                | -------------------------------------------------------------------
                | String, Primary Key of the item
                | -------------------------------------------------------------------
                */
                id: '=?id',
                /*
                | -------------------------------------------------------------------
                | String, the name of the current module
                | -------------------------------------------------------------------
                */
                name: "=?name",
                /*
                | -------------------------------------------------------------------
                | Array, The enabled actions
                | -------------------------------------------------------------------
                */
                actions: "=?actions",
                /*
                | -------------------------------------------------------------------
                | Array, The action custom for the label-items
                | -------------------------------------------------------------------
                | name: The name of the action in request default(/{module}/{id}/{name}), 
                | label: The title in the tooltip when on mouseover
                | label-ico: The class of the label bootstrap, pattern is here: 'label label-{label-ico}'
                | ico: The class of the icon bootstrap, pattern is here: 'glyphicon glyphicon-{ico}'
                */
                customAction: "=?customAction"
            },
            controller: ["$scope", "tableConfig", "$location", "$filter", function($scope, tableConfig, $location, $filter)
            {
                $scope.id = $scope.id || 0;
                $scope.name = $scope.name || '-';
                $scope.actions = $scope.actions || [];
                $scope.customAction = $scope.customAction || [];

                $scope.delete = function(id)
                {
                    if( id != undefined && id != 0 )
                    {
                        if( typeof $scope.$root.delete === 'function')
                            $scope.$root.delete(id);
                        else
                            throw "The current controller no have 'delete' method";
                    }
                    else{
                        throw "The informed 'id' no is valid";
                    }
                };

                if( tableConfig.debugMode ) console.log("tableAction", $scope);
            }]
        };
    });