angular.module('table.grid',[
        'angularUtils.directives.dirPagination',
        'ui.bootstrap'
    ])
    .constant('tableConfig', {
        url: '',
        defaultFilter: '',        
        defaultLimit: 5,        
        defaultOrder: '-_id',
        defaultActions: ['view', 'edit', 'delete'],
        enableButtons: true,
        authentication: null,
        appLabels: {},
        deleteCallback: function(){}
    })
    .filter('round', function() {
        return function(str,type) {
            type = type == undefined ? 'ceil' : type;

            return ( String(str) == 'NaN' ? 1 : Math[type](str));
        }
    })
    .directive('tableGrid', function()
    {
        return {
            restrict: 'E',            
            scope: {
                model: '=model',// Array with the data object with the record dinamic or static
                fields: '=fields', // Array with the list of the field that contains in 'model'
                actions: '=?actions', // Array of the availables actions in the grid
                filter: '=?filter', // the databing with the filter for grid
                limit: '=?limit', // the limitation of the itens by page at the grid
                moduleName: '=?moduleName', // the name of the current module(interface)
                showBreadcrumb: '@showBreadcrumb', // the header of the Breadcrumb with the current path
                isOwner: '@isOwner', // define the owner of the records to set permission to view the 'actions'
                searchOptions: '=searchOptions', // the object with the options of the extra options sent to inner directive
                order: '@order' // Set the ordenation of the grid
            },
            templateUrl: "/src/templates/table-grid.html",//"grid-template.html",
            controller: ["$scope", "$location", "$filter",'tableConfig', /*"Authentication",*/ 
            function($scope, $location, $filter, tableConfig/*, Authentication*/)
            {
                if($scope.model == undefined || $scope.fields == undefined)
                {
                    throw new "the configuration base is not informed!";
                }
                var instanceId = null;
                $scope.currentPage = 1;
                
                $scope.moduleName = $scope.moduleName || $location.$$path.replace('/','');                
                $scope.showBreadcrumb = $scope.showBreadcrumb || true;                
                $scope.isOwner = $scope.isOwner || false;
                
                $scope.order = $scope.order || tableConfig.defaultOrder;
                $scope.limit = $scope.limit || tableConfig.defaultLimit;
                $scope.filter = $scope.filter || tableConfig.defaultFilter;
                $scope.actions = $scope.actions || tableConfig.defaultActions;

                $scope.addFilter = function(model, object, filters){
                    return $filter(filters[0])(this.renderLine(model,object),filters[1]);
                };
                $scope.renderLine = function(model,object,k){
                    if( typeof object.fk != 'undefined') {
                        if( typeof object.column == 'object')
                            return model[object.fk][object.column[k]];
                        else
                            return model[object.fk][object.column];
                    }
                    else{
                        return model[object.column];
                    }
                };
                $scope.renderTemplate = function(value, type)
                {
                    if( !(type in angular.appLabels) || angular.appLabels[type][value] == undefined )
                        return value;
                    
                    var label = angular.appLabels[type][value],
                        template = [
                            '<div class="label label-',label.class,'">',
                                typeof label.icon != 'undefined' 
                                    ? '<span class="glyphicon glyphicon-'+label.icon+'"></span>\n' 
                                    : '',
                                label.name,
                            '</div>'
                        ];
                    
                    return template.join('');
                };
            }],            
        }
    })    
    .directive('paginateSearchGrid', function()
    {
        return {
            restrict: 'E',
            templateUrl: "/src/templates/search-grid.html",//'search-grid.html',
            scope: {                
                moduleName: '=moduleName', // the name of the current module(interface)
                limit: '=?limit', // the limitation of the itens by page at the grid                
                filter: '=?filter', // the databing with the filter for grid
                withCreate: '=?withCreate', // define if the button 'new' will be show
                withSearch: '=?withSearch' // define if the input 'search' will be show
            },
            controller: ["$scope", "$location", "paginationService", "$timeout", "tableConfig",function($scope, $location, paginationService, $timeout, tableConfig)
            {                
                $scope.totalItems = 0;
                $scope.currentPage = 1;
                $scope.withSearch = $scope.withSearch || true;
                $scope.withCreate = $scope.withCreate || true;
                
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
                $scope.listen();

                $scope.createUrl = function(action)
                {
                    action = action == undefined ? "create" : action;
                    if( tableConfig.enableButtons == true )
                        return "/#!/"+$scope.moduleName+"/"+action
                    else
                        return "/#!"+$location.$$path;
                }
            }]
        }
    })
    .directive('headerGrid', function()
    {
        return {
            restrict: 'E',
            templateUrl: '/src/templates/header-grid.html',
            scope: {
                lines: '=?lines',
                save: '=save'
            },
            controller: ["$scope", "$location", function($scope, $location)
            {
                $scope.lines = $scope.lines || [];

                $scope.lines.reverse();
                $scope.lines[0].path = false;
                $scope.lines.reverse();
            }]
        }
    })
    .directive('labelItem', function()
    {        
        return {
            restrict: 'E',
            templateUrl: "/src/templates/label-grid.html",//'label-template.html',
            scope: {
                hasIcon: '@hasIcon',
                index: '=index',
                item: '@item',
                addIndex: '@addIndex' 
            },
            controller: ["$scope", "tableConfig", function($scope, tableConfig){
                $scope.data = tableConfig.appLabels[$scope.item][$scope.index];
                if ( $scope.data!= undefined && typeof $scope.data.name == 'object' && $scope.addIndex != undefined )
                    $scope.data.name = $scope.data.name[$scope.addIndex];
            }]
        };        
    })
    .directive('tableAction',function()
    {
        return {
            restrict: 'E',
            templateUrl: '/src/templates/table-action.html',
            scope: {
                module: '=module'
            },
            controller: ["$scope", "tableConfig", "$location", function($scope, tableConfig, $location)
            {
                $scope.delete = function(id)
                {
                    throw "No implemented";
                };
                $scope.createUrl = function(action)
                {
                    if( tableConfig.enableButtons == true )
                        return "/#!/"+$scope.module.name+"/"+$scope.module.id+"/"+action
                    else
                        return "/#!"+$location.$$path;
                }
            }]
        };
    });