/**
 * table-grid - AngularJS module to easily the criation of tables of display data
 * 
 * Copyright 2017 Marlon R Cardoso <marlonrcardoso@yahoo.com.br>
 */
angular
    .module('table.grid',[
        'angularUtils.directives.dirPagination',
        'ui.bootstrap'
    ])
    /**
     * Object with configuration to enable the customize of this directive, aiming the furutes implementations
     */
    .constant('tableConfig', {        
        defaultFilter: '',        
        defaultLimit: 5,        
        defaultOrder: '-_id',
        defaultActions: ['view', 'edit', 'remove'],
        enableButtons: true,
        appLabels: { "status": {
            "0": { "name": "Inativo", "class": "default", "icon": "ban-circle" },
            "1": { "name": "Ativo", "class": "success", "icon": "ok-circle"}
        }},
        url: '', // no implemented
        authentication: null, // no implemented
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
            templateUrl: "table-grid.html",      
            scope: {
                /*
                | ----------------------------------------------------------------
                | Array, the data object with the record dinamic or static
                | ----------------------------------------------------------------
                |*/
                model: '=model',
                /*
                | ----------------------------------------------------------------
                | Array, the list of the field that contains in 'model'
                | ----------------------------------------------------------------
                | The available properties:
                | label: the string with text of the column
                | column: the property name of the lines in the 'model' to be rendered
                | type: the type of template to be rendered in the line
                | url: with the property 'type="link"', create a link, when your value is 'view' create a local url to view action of the current module
                | icon: with the property 'type="template"', show or hide the icon of the label
                | fk: The object of the foreign key, this case the property 'column' get the value inner this object
                | filter: Render a line with angular.filter, An array with two options, the first is the 'filter name', the second is the 'value for the filter'
                |*/ 
                fields: '=fields',
                /*
                | ----------------------------------------------------------------
                | Array of the availables actions in the grid
                | ----------------------------------------------------------------
                | array, the defaul options are 'view, edit, remove'
                |*/
                actions: '=?actions',
                /*
                | ----------------------------------------------------------------
                | string, the databing with the filter for grid
                | ----------------------------------------------------------------
                |*/
                filter: '=?filter',
                /*
                | ----------------------------------------------------------------
                | int, the limitation of the itens by page at the grid, default: 5
                | ----------------------------------------------------------------
                |*/
                limit: '=?limit',
                /*
                | ----------------------------------------------------------------
                | string, the name of the current module(interface), default: current path
                | ----------------------------------------------------------------
                |*/
                moduleName: '=?moduleName',
                /*
                | ----------------------------------------------------------------
                | bool, show or hide the header Breadcrumb, default: true
                | ----------------------------------------------------------------
                |*/
                showBreadcrumb: '=?showBreadcrumb',
                /*
                | ----------------------------------------------------------------
                | string, define the owner of the records to set permission to view the 'actions'
                | ----------------------------------------------------------------
                |*/
                isOwner: '=?isOwner',
                /*
                | ----------------------------------------------------------------
                | object, the object with the options of the extra options sent to inner directive(paginateSearchGrid)
                | ----------------------------------------------------------------
                | will be replaced by two properties
                | withSearch: bool
                | withCreate: bool
                |*/
                searchOptions: '=?searchOptions',
                /*
                | ----------------------------------------------------------------
                | string, Set the ordenation of the grid
                | ----------------------------------------------------------------
                |*/
                order: '@order',
                /*
                | ----------------------------------------------------------------
                | string, Set de primary key for each line
                | ----------------------------------------------------------------
                |*/
                primaryKey: '@primaryKey',
                /*
                | ----------------------------------------------------------------
                | Array, the array with object with the breadcrumb,  equal to the directive(headerGrid)
                | ----------------------------------------------------------------
                | lines: '=?lines'
                */                
            },            
            controller: ["$scope", "$location", "$filter",'tableConfig', /*"Authentication",*/ 
            function($scope, $location, $filter, tableConfig/*, Authentication*/)
            {
                if($scope.model == undefined || $scope.fields == undefined)
                {
                    throw "the configuration base is not informed!";
                }
                var instanceId = null;
                $scope.currentPage = 1;
                
                $scope.moduleName = $scope.moduleName || $location.$$path.replace('/','');
                $scope.showBreadcrumb = $scope.showBreadcrumb != undefined ? $scope.showBreadcrumb : true;
                $scope.isOwner = $scope.isOwner != undefined ? $scope.isOwner : false;
                
                $scope.order = $scope.order || tableConfig.defaultOrder;
                $scope.limit = $scope.limit || tableConfig.defaultLimit;
                $scope.filter = $scope.filter || tableConfig.defaultFilter;
                $scope.actions = $scope.actions || tableConfig.defaultActions;
                $scope.primaryKey = $scope.primaryKey || '_id';

                $scope.addFilter = function(model, object, filters){
                    if( filters.length == 2 )
                        return $filter(filters[0])(this.renderLine(model,object),filters[1]);
                    else return '-';
                };
                $scope.renderLine = function(model,object,k){
                    if( typeof object.fk != 'undefined') {                        
                        if( model[object.fk] != undefined && model[object.fk][object.column] != undefined )
                            return model[object.fk][object.column];
                        else
                            return '-';
                    }
                    else{
                        return model[object.column] == undefined ? '-' : model[object.column];
                    }
                };

                $scope.createUrl = function(path, param)
                {
                    if( param != undefined)
                    {
                        return '/#!/'+path+'/'+param;
                    }
                    return '/#!/'+path+'/';
                }
            }],            
        }
    })    
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
                withSearch: '=?withSearch'
            },
            controller: ["$scope", "$location", "paginationService", "$timeout", "tableConfig",function($scope, $location, paginationService, $timeout, tableConfig)
            {
                $scope.totalItems = 0;
                $scope.currentPage = 1;
                $scope.withSearch = $scope.withSearch != undefined ? $scope.withSearch : true;
                $scope.withCreate = $scope.withCreate != undefined ? $scope.withCreate : true;
                
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
            controller: ["$scope", "$location", function($scope, $location)
            {
                $scope.lines = $scope.lines || [];
                
                if( $scope.lines.length > 0 )
                {
                    $scope.lines.reverse();
                    $scope.lines[0].path = false;
                    $scope.lines.reverse();
                }                
            }]
        }
    })
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
            }]
        };        
    })
    .directive('tableAction',function()
    {
        return {
            restrict: 'E',
            templateUrl: 'table-action.html',
            scope: {
                /*
                | -------------------------------------------------------------------
                | string, the name of the current module(interface)
                | -------------------------------------------------------------------
                */
                module: '=module'
            },
            controller: ["$scope", "tableConfig", "$location", function($scope, tableConfig, $location)
            {
                $scope.delete = function(id)
                {
                    if( typeof $scope.$root.delete === 'function')
                        $scope.$root.delete(id);
                    else
                        throw "The current controller no have 'delete' method";
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