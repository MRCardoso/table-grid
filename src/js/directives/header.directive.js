angular.module('table.grid')
    .directive('headerGrid', function(){
        return {
            restrict: 'E',
            templateUrl: 'header-grid.html',
            scope: {
                /*
                | --------------------------------------------------
                | Array, the properties, to render a breadcrumb:
                | --------------------------------------------------
                | path: string|bool, the action of the link, local url, when is false olny render the 'label'
                | label: string, the name of the current breadcrumb
                |*/
                lines: '=?lines'
            },
            controller: ["$scope", "$location", "tableConfig", function($scope, $location, tableConfig)
            {
                $scope.lines = $scope.lines || [];
                
                if( $scope.lines.length > 0 )
                {
                    $scope.lines.reverse();
                    $scope.lines[0].path = false;
                    $scope.lines.reverse();
                }
                
                if( tableConfig.debugMode ) console.log("headerGrid", $scope);
            }]
        }
    });