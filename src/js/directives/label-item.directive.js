angular.module('table.grid')
    .directive('labelItem', function()
    {        
        return {
            restrict: 'E',
            templateUrl: 'label-grid.html',
            scope: {
                /*
                | ---------------------------------------------------------------------------
                | bool, show or hide the icon of the label, default: true
                | ---------------------------------------------------------------------------
                */
                hasIcon: '=?hasIcon',
                /*
                | ---------------------------------------------------------------------------
                | int, the value of the current line, for get the text in appLabels according your value
                | ---------------------------------------------------------------------------
                */
                index: '=?index',
                /*
                | ---------------------------------------------------------------------------
                | string, the property in appLabels
                | ---------------------------------------------------------------------------
                */
                item: '@item',
                /*
                | ---------------------------------------------------------------------------
                | int, use when the value in appLabels is an array
                | ---------------------------------------------------------------------------
                */
                addIndex: '@addIndex'
            },
            controller: ["$scope", "tableConfig", function($scope, tableConfig)
            {
                $scope.hasIcon = $scope.hasIcon != undefined ? $scope.hasIcon : true;
                var itens = tableConfig.appLabels[$scope.item];
                
                if( itens != undefined && itens[$scope.index] != undefined )
                {
                    $scope.data = itens[$scope.index];

                    if ( $scope.data!= undefined && typeof $scope.data.name == 'object' && $scope.addIndex != undefined )
                        $scope.data.name = $scope.data.name[$scope.addIndex];
                }
                
                if( tableConfig.debugMode ) console.log("labelItem", $scope);
            }]
        };        
    });