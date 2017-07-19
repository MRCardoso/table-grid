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
angular.module('table.grid').run(['$templateCache', function($templateCache) {$templateCache.put('header-grid.html','<ul class="breadcrumb">\r\n    <li><a ng-href="/#!/">Home</a></li>\r\n    <li ng-repeat="row in lines">\r\n        <a ng-href="/#!/{{row.path}}" data-ng-show="row.path !== false">\r\n            <span data-ng-bind="row.label"></span>\r\n        </a>\r\n        <span data-ng-bind="row.label" data-ng-show="row.path===false"></span>\r\n    </li>\r\n</ul>');
$templateCache.put('label-grid.html','<div class="label label-{{data.class}}" uib-tooltip="{{item}} : {{data.name}}" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\r\n    <span ng-show="hasIcon" class="glyphicon glyphicon-{{data.icon}}"></span>\r\n    <span ng-bind="data.name"></span>\r\n</div>');
$templateCache.put('search-grid.html','<div ng-class="{\'template-head\': pagBottom == false, \'template-foot\': pagBottom == true}">\r\n    <div class="col-md-4">\r\n        <div ng-show="totalItems > limit">\r\n            <div class="text-center">\r\n                <dir-pagination-controls max-size="4" boundary-links="true" on-page-change="changePage(newPageNumber)"></dir-pagination-controls>\r\n            </div>\r\n        </div>\r\n        <div ng-show="totalItems == 0 && (filter != null && filter != \'\')">\r\n            <span class="glyphicon glyphicon-info-sign"></span>\r\n            Nenhum resultado encontrado para <strong>\'{{filter}}\'</strong>\r\n        </div>\r\n    </div>\r\n    \r\n    <div class="col-md-8" ng-if="withSearch">\r\n        <div class="input-group">    \r\n            <div class="input-group-btn" ng-if="changeLimit==false">\r\n                <a ng-href class="btn btn-default" style="cursor: move">\r\n                    <i ng-bind="currentPage+\'/\'+(totalItems/limit | round)+\' - \'+totalItems"></i>\r\n                </a>\r\n            </div>\r\n            <div class="input-group-btn" ng-if="changeLimit==true">\r\n                <div class="btn-group" role="group">\r\n                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\r\n                        <i ng-bind="currentPage+\'/\'+(totalItems/limit | round)+\' - \'+totalItems"></i>\r\n                        <span class="caret"></span>\r\n                    </button>\r\n                    <ul class="dropdown-menu">\r\n                        <li ng-repeat="item in limits" ng-class="{\'active\': item==limit}">\r\n                            <a role="button" ng-click="updateLimit(item)">{{item}}</a>\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n            <input type="text" ng-model="$parent.filter" ng-model-options="filterOptions" ng-change="listen()" class="form-control" placeholder="procure por um registro...">\r\n            <div class="input-group-btn" ng-show="withCreate==true">\r\n                <a ng-href="{{$root.createUrl(moduleName, null, \'create\')}}" class="btn btn-primary">\r\n                    <span class="glyphicon glyphicon-plus"></span>\r\n                    Novo\r\n                </a>\r\n            </div>    \r\n        </div>\r\n    </div>\r\n    \r\n    <div class="clear"></div>\r\n</div>');
$templateCache.put('table-action.html','<div ng-if="actions.length>0 || customAction.length>0">\r\n    \r\n    <a ng-repeat="act in customAction" \r\n        ng-href="{{$root.createUrl(name, id, act.name)}}" \r\n        class="no-underline label label-{{act[\'label-ico\']}}"\r\n        uib-tooltip="{{act.label}}" tooltip-placement="top" tooltip-trigger="mouseenter">\r\n        <i class="glyphicon glyphicon-{{act.ico}}"></i>\r\n    </a>\r\n    \r\n    <a ng-if="actions.indexOf(\'view\') != -1" ng-href="{{$root.createUrl(name, id, \'view\')}}" class="no-underline label label-warning"\r\n       uib-tooltip="Visualizar" tooltip-placement="top" tooltip-trigger="mouseenter">\r\n        <span class="glyphicon glyphicon-eye-open"></span>\r\n    </a>\r\n    <a ng-if="actions.indexOf(\'edit\') != -1" ng-href="{{$root.createUrl(name, id, \'edit\')}}" class="no-underline label label-primary"\r\n       uib-tooltip="Editar" uib-tooltip-placement="top" tooltip-trigger="mouseenter">\r\n        <span class="glyphicon glyphicon-edit"></span>\r\n    </a>\r\n    <a ng-if="actions.indexOf(\'remove\') != -1" ng-href role="button" ng-click="delete(id)" class="no-underline label label-danger"\r\n       uib-tooltip="Remover" tooltip-placement="top" tooltip-trigger="mouseenter">\r\n        <span class="glyphicon glyphicon-remove"></span>\r\n    </a>\r\n</div>');
$templateCache.put('table-grid.html','<!--Block with breadcrumb-->\r\n<header-grid ng-if="showBreadcrumb==true" lines="lines"></header-grid>\r\n\r\n<!--Block with pagination, search and add button-->\r\n<paginate-search-grid \r\n    filter="filter" \r\n    limit="limit" \r\n    with-search="withSearch" \r\n    with-create="withCreate" \r\n    change-limit="changeLimit" \r\n    module-name="moduleName"\r\n    filter-options="filterOptions">\r\n</paginate-search-grid>\r\n\r\n<!--Block with table template default-->\r\n<table class="table table-striped table-bordered table-hover content table-responsive">\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat="f in fields">\r\n                <a role="button" ng-click="reOrder(f)" class="dark-link" ng-if="f.sort != undefined && f.sort==true">\r\n                    <i class="glyphicon glyphicon-triangle-{{ort[f.fk!=undefined?f.fk+\'.\'+f.column:f.column] == \'-\' ? \'top\' : \'bottom\'}}"></i>\r\n                </a>\r\n                {{f.label}}\r\n            </th>\r\n            <th ng-if="withActions">A\xE7\xF5es</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr dir-paginate="model in model | orderBy: order | filter: filter | itemsPerPage: limit" current-page="currentPage">\r\n            <td ng-repeat="f in fields">                \r\n                <div ng-if="f.type==\'simple\'" ng-bind="renderLine(model, f, true)"\r\n                    uib-tooltip="{{renderLine(model, f, false)}}" tooltip-placement="top" tooltip-trigger="mouseenter"></div>\r\n\r\n                <div ng-if="f.type==\'filter\'">\r\n                    <span ng-bind="addFilter(model, f, f.filter)"></span>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'link\' && f.url !=\'undefined\'">\r\n                    <a ng-href="{{f.url==\'view\' ? $root.createUrl(moduleName, model[primaryKey],\'view\') : f.url }}" ng-bind="renderLine(model, f, true)"\r\n                    uib-tooltip="{{renderLine(model, f, false)}}" tooltip-placement="top" tooltip-trigger="mouseenter"></a>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'image\'">\r\n                    <!---image-s3 url="renderLine(model, f)" path="f.pathImage" with-user-id="{{f.userId}}" alt="imagem" class="image-thumb-4"></image-s3-->\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'template\'">\r\n                    <div ng-if="f.content!= \'undefined\'" bind-html-compile="f.content"></div> \r\n                    <label-item ng-if="f.content == \'undefined\'" has-icon="f.icon" item="{{f.column}}" index="model[f.column]"></label-item>\r\n                </div>\r\n            </td>\r\n            <td ng-if="withActions" style="text-align: center; padding-left: 0.4%; padding-right: 0.4%;">\r\n                <table-action id="model[primaryKey]" name="moduleName" actions="actions" custom-action="customAction"></table-action>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n<paginate-search-grid ng-if="pagBottom==true" filter="filter" limit="limit" with-search="false" with-create="false" module-name="moduleName" pag-bottom="true"></paginate-search-grid>');}]);
/**
 * Object with configuration to enable the customize of this directive, aiming the furutes implementations
 */
angular.module('table.grid')
    .constant('tableConfig', {        
        defaultFilter: '',        
        defaultLimit: 5,        
        defaultPrimaryKey: '_id',
        defaultOrientation: '-', // (-) DESC | () ASC
        defaultActions: ['view', 'edit', 'remove'],
        enableButtons: true,
        appLabels: { "status": {
            "0": { "name": "Inativo", "class": "default", "icon": "ban-circle" },
            "1": { "name": "Ativo", "class": "success", "icon": "ok-circle"}
        }},
        baseUrlTmpl: '/#!/{module}',
        viewUrlTmpl: '/{id}/view',
        editUrlTmpl: '/{id}/edit',
        createUrlTmpl: '/create',
        debugMode: false,
        url: '', // no implemented
        authentication: null, // no implemented
    });
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
angular.module('table.grid')
    .directive('tableGrid', function(){
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
                | bool, Show or hide the column 'actions' on the grid
                | ----------------------------------------------------------------
                |*/
                withActions: '=?withActions',
                /*
                | ----------------------------------------------------------------
                | usage in directive(headerGrid)
                | ----------------------------------------------------------------
                */                
                lines: '=?lines',
                /*
                | -------------------------------------------------------------------
                | usage in directive(paginateSearchGrid)
                | -------------------------------------------------------------------
                */
                withSearch: '=?withSearch',
                withCreate: '=?withCreate',
                pagBottom: '=?pagBottom',
                changeLimit: '=?changeLimit',
                filterOptions: '=?filterOptions',
                /*
                | -------------------------------------------------------------------
                | usage in directive(tableAction)
                | -------------------------------------------------------------------
                */
                actions: '=?actions',
                customAction: "=?customAction"
            },            
            controller: ["$scope", "$location", "$filter",'tableConfig', '$compile', "$sce", function($scope, $location, $filter, tableConfig, $compile, $sce)
            {
                if($scope.model == undefined || $scope.fields == undefined)
                {
                    throw "the configuration base is not informed!";
                }
                var instanceId = null;                
                
                $scope.currentPage = 1;
                
                $scope.moduleName = $scope.moduleName || $location.$$path.replace('/','');
                $scope.showBreadcrumb = $scope.showBreadcrumb != undefined ? $scope.showBreadcrumb : true;
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
    });
angular.module('table.grid')
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
    .filter('trustAsHtml', ["$sce", function($sce) {
        return $sce.trustAsHtml;
    }]);