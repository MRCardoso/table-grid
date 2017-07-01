angular.module('table.grid')
    .directive('paginateSearchGrid', function()
    {
        return {
            restrict: 'E',
            templateUrl: 'search-grid.html',
            scope: {
                /*
                | -------------------------------------------------------------------
                | string, the name of the current module(interface)
                | -------------------------------------------------------------------
                */
                moduleName: '=moduleName',
                /*
                | -------------------------------------------------------------------
                | int, the limitation of the itens by page at the grid, default: 5
                | -------------------------------------------------------------------
                */
                limit: '=?limit',
                /*
                | -------------------------------------------------------------------
                | string, the databing with the filter for grid
                | -------------------------------------------------------------------
                */
                filter: '=?filter',
                /*
                | -------------------------------------------------------------------
                | bool, define if the button 'new' will be show, default: true
                | -------------------------------------------------------------------
                */
                withCreate: '=?withCreate',
                /*
                | -------------------------------------------------------------------
                | bool, define if the input 'search' will be show, default: true
                | -------------------------------------------------------------------
                */
                withSearch: '=?withSearch',
                /*
                | ----------------------------------------------------------------
                | bool, enable the dropdown with the list of limitation custom
                | ----------------------------------------------------------------
                |*/
                changeLimit: '=?changeLimit',
                /*
                | -------------------------------------------------------------------
                | bool, show or hide pagination on bottom in the grid
                | -------------------------------------------------------------------
                | default: false
                */
                pagBottom: '=?pagBottom',
                /*
                | -------------------------------------------------------------------
                | Array, additional options of the events into ngModel in search input
                | -------------------------------------------------------------------
                */
                filterOptions: '=?filterOptions'
            },
            controller: ["$scope", "$location", "paginationService", "$timeout", "tableConfig", "$filter",function($scope, $location, paginationService, $timeout, tableConfig,$filter)
            {
                $scope.totalItems = 0;
                $scope.currentPage = 1;
                $scope.limits = [5,10,25,50,100,1000];
                $scope.withSearch = $scope.withSearch != undefined ? $scope.withSearch : true;
                $scope.withCreate = $scope.withCreate != undefined ? $scope.withCreate : true;
                $scope.pagBottom = $scope.pagBottom != undefined ? $scope.pagBottom : false;
                $scope.changeLimit = $scope.changeLimit != undefined ? $scope.changeLimit : false;
                $scope.filterOptions = $scope.filterOptions || { updateOn: 'default'};
                
                $scope.limit = $scope.limit || tableConfig.defaultLimit;
                $scope.filter = $scope.filter || tableConfig.defaultFilter;
                
                $scope.changePage = function(p)
                {
                    $scope.currentPage = p;
                };

                $scope.listen = function()
                {
                    $timeout(function()
                    {
                        var instanceId = paginationService.getLastInstanceId();
                        
                        if(instanceId != null)
                            $scope.totalItems = paginationService.getCollectionLength(instanceId);
                        else
                            $scope.listen();
                    }, 100);
                };

                $scope.updateLimit = function(l){
                    $scope.limit = l;
                }
                $scope.listen();

                if( tableConfig.debugMode ) console.log("paginateSearchGrid", $scope);
            }]
        }
    });