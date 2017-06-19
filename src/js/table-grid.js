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
            'ui.bootstrap'
        ])
        .filter('renderUrl', ['tableConfig',function(tableConfig){
            return function(path, param, type){
                var urlBase = tableConfig.baseUrlTmpl.replace('{module}', path);
                var args = '';            
                if( typeof param == 'object' && param != null )
                {
                    var params = [];
                    for(var i in param){
                        params.push(param[i]);
                    }
                    args = '/'+ params.join('/');
                }
                else
                {
                    switch(type){
                        case 'create': args = tableConfig.createUrlTmpl; break;
                        case 'edit': args = tableConfig.editUrlTmpl.replace('{id}', param);break;
                        case 'view': args = tableConfig.viewUrlTmpl.replace('{id}', param); break;
                        default: args = "/"+param+"/"+type; break;
                    }                
                }
                return urlBase+args;
            }
        }])
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
                    | sort: Show or hide the option to ordenation ASC DESC the column
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
                    | bool, Show or hide the header Breadcrumb, default: true
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
                    | string, the ordenation default of the grid, ASC DESC
                    | ----------------------------------------------------------------
                    |*/
                    orientation: '@orientation',
                    /*
                    | ----------------------------------------------------------------
                    | bool, Show or hide the field with search in the grid
                    | ----------------------------------------------------------------
                    |*/
                    withSearch: '=?withSearch',
                    /*
                    | ----------------------------------------------------------------
                    | bool, Show or hide the button 'create' in the grid
                    | ----------------------------------------------------------------
                    |*/
                    withCreate: '=?withCreate',
                    /*
                    | ----------------------------------------------------------------
                    | bool, Show or hide the column 'actions' on the grid
                    | ----------------------------------------------------------------
                    |*/
                    withActions: '=?withActions',
                    /*
                    | ----------------------------------------------------------------
                    | bool, enable the dropdown with the list of limitation custom
                    | ----------------------------------------------------------------
                    |*/
                    changeLimit: '=?changeLimit',
                    /*
                    | ----------------------------------------------------------------
                    | Array, the array with object with the breadcrumb
                    | ----------------------------------------------------------------
                    | equal to the directive(headerGrid)
                    */
                    lines: '=?lines',
                    /*
                    | -------------------------------------------------------------------
                    | Array, The action custom for the label-items
                    | -------------------------------------------------------------------
                    | equal to the directive(tableAction)
                    */
                    customAction: "=?customAction",
                },            
                controller: ["$scope", "$location", "$filter",'tableConfig', function($scope, $location, $filter, tableConfig)
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
                    $scope.withSearch = $scope.withSearch != undefined ? $scope.withSearch : true;
                    $scope.withCreate = $scope.withCreate != undefined ? $scope.withCreate : true;
                    $scope.withActions = $scope.withActions != undefined ? $scope.withActions : true;
                    $scope.changeLimit = $scope.changeLimit != undefined ? $scope.changeLimit : false;
                    $scope.orientation = $scope.orientation != undefined ? $scope.orientation : tableConfig.defaultOrientation;

                    $scope.order = $scope.order || $scope.orientation+tableConfig.defaultPrimaryKey;
                    $scope.limit = $scope.limit || tableConfig.defaultLimit;
                    $scope.filter = $scope.filter || tableConfig.defaultFilter;
                    $scope.actions = $scope.actions || tableConfig.defaultActions;
                    $scope.primaryKey = $scope.primaryKey || tableConfig.defaultPrimaryKey;
                    $scope.customAction = $scope.customAction || [];

                    $scope.ort = {};

                    for(var fs in $scope.fields)
                    {
                        var objC = $scope.fields[fs];
                        var key = (objC.fk != undefined ? objC.fk+'.'+objC.column : objC.column);                    
                        $scope.ort[key] = $scope.orientation;
                    }

                    $scope.addFilter = function(model, object, filters)
                    {
                        if( filters.length == 2 )
                            return $filter(filters[0])(this.renderLine(model,object),filters[1]);
                        else return '-';
                    };
                    $scope.renderLine = function(model,object,limited)
                    {
                        var  pvCallBack = function(limited, string){
                            if( (limited == true && typeof string === 'string') && string.length > 20 ) {
                                return string.substr(0,20)+"...";
                            }
                                
                            return string;
                        };
                        if( typeof object.fk != 'undefined') {                        
                            if( model[object.fk] != undefined && model[object.fk][object.column] != undefined ) {
                                return pvCallBack(limited, model[object.fk][object.column]);
                            }
                        }
                        else if (model[object.column] != undefined) {
                            return pvCallBack(limited, model[object.column]);
                        }
                        return '-';
                    };

                    $scope.reOrder = function(item){
                        var key = (item.fk != undefined ? item.fk+'.'+item.column : item.column);
                        $scope.orientation = ($scope.orientation == '-' ? '': '-');
                        $scope.order = $scope.orientation + item.column;
                        $scope.ort[key] = $scope.orientation;
                    };

                    if( tableConfig.debugMode ) console.log("tableGrid", $scope);
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
                    withSearch: '=?withSearch',
                    /*
                    | ----------------------------------------------------------------
                    | bool, enable the dropdown with the list of limitation custom
                    | ----------------------------------------------------------------
                    |*/
                    changeLimit: '=?changeLimit',
                    /*
                    | -------------------------------------------------------------------
                    | string, the position of the template
                    | -------------------------------------------------------------------
                    | default:'top', available top|bottom
                    */
                    pagPosition: '@pagPosition',
                },
                controller: ["$scope", "$location", "paginationService", "$timeout", "tableConfig", "$filter",function($scope, $location, paginationService, $timeout, tableConfig,$filter)
                {
                    $scope.totalItems = 0;
                    $scope.currentPage = 1;
                    $scope.limits = [5,10,25,50,100,1000];
                    $scope.withSearch = $scope.withSearch != undefined ? $scope.withSearch : true;
                    $scope.withCreate = $scope.withCreate != undefined ? $scope.withCreate : true;
                    $scope.pagPosition = $scope.pagPosition != undefined ? $scope.pagPosition : 'top';
                    $scope.changeLimit = $scope.changeLimit != undefined ? $scope.changeLimit : false;
                    
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
                    
                    if( tableConfig.debugMode ) console.log("labelItem", $scope);
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
        })
        .run(["$rootScope", "$filter", function($rootScope, $filter){            
            $rootScope.createUrl = function(path, param, action)
            {
                return $filter('renderUrl')(path, param, action);
            };
        }]);
}());