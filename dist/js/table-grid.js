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
angular.module('table.grid').run(['$templateCache', function($templateCache) {$templateCache.put('form-buttons.html','<div class="clear"></div>\n\n<div class="button-group">\n    <!-- BUTTONS TO INTERFACE \'view\' -->\n    <div ng-if="type==\'view\'">\n        <div class="col-md-7 text-left">\n            <strong>{{label}}</strong>\n            <em class="text-muted">\n                <span ng-bind="extraData"></span>\n            </em>\n        </div>\n        <a ng-href="/#!/{{name}}" class="btn btn-default" uib-tooltip="Voltar" tooltip-placement="top" tooltip-trigger="mouseenter">\n            <i ng-if="hasIcon()" class="glyphicon glyphicon-chevron-left"></i>\n            <span ng-if="hasText()">Voltar</span>\n        </a>\n        <a ng-if="actionAllow(\'edit\')" ng-href="{{$root.createUrl(name, id, \'edit\')}}" class="btn btn-warning" uib-tooltip="Editar" uib-tooltip-placement="top" tooltip-trigger="mouseenter">\n            <i ng-if="hasIcon()" class="glyphicon glyphicon-edit"></i>\n            <span ng-if="hasText()">Editar</span>\n        </a>\n        <a ng-if="actionAllow(\'create\')" ng-href="{{$root.createUrl(name, id, \'create\')}}" class="btn btn-primary" uib-tooltip="Novo" tooltip-placement="top" tooltip-trigger="mouseenter">\n            <i ng-if="hasIcon()" class="glyphicon glyphicon-plus"></i>\n            <span ng-if="hasText()">Novo</span>\n        </a>\n    </div>\n    \n    <!-- BUTTONS TO INTERFACE \'create|update\' -->\n    <div ng-if="type==\'save\'">\n        <a ng-href="/#!/{{name}}" class="btn btn-default" uib-tooltip="Voltar" tooltip-placement="top" tooltip-trigger="mouseenter">\n            <i ng-if="hasIcon()" class="glyphicon glyphicon-chevron-left"></i>\n            <span ng-if="hasText()">Voltar</span>\n        </a>\n        <a ng-if="actionAllow(\'view\') && id" ng-href="{{$root.createUrl(name, id, \'view\')}}" class="btn btn-warning" uib-tooltip="Visualizar" tooltip-placement="top" tooltip-trigger="mouseenter">\n            <i ng-if="hasIcon()" class="glyphicon glyphicon-eye-open"></i>\n            <span ng-if="hasText()">Visualizar</span>\n        </a>\n        <button ng-if="actionAllow(\'edit\')" class="btn btn-blue" uib-tooltip="Salvar" tooltip-placement="top" tooltip-trigger="mouseenter">\n            <i ng-if="hasIcon()" class="glyphicon glyphicon-ok-sign"></i>\n            Salvar\n        </button>\n    </div>\n</div>');
$templateCache.put('header-grid.html','<ul class="breadcrumb">\n    <li><a ng-href="/#!/">Home</a></li>\n    <li ng-repeat="row in lines">\n        <a ng-href="/#!/{{row.path}}" data-ng-show="row.path !== false">\n            <span data-ng-bind="row.label"></span>\n        </a>\n        <span data-ng-bind="row.label" data-ng-show="row.path===false"></span>\n    </li>\n</ul>');
$templateCache.put('label-grid.html','<div class="label label-{{data.class}}" uib-tooltip="{{item}} : {{data.name}}" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\n    <span ng-show="hasIcon" class="glyphicon glyphicon-{{data.icon}}"></span>\n    <span ng-bind="data.name"></span>\n</div>');
$templateCache.put('search-grid.html','<div ng-class="{\'template-head\': pagBottom == false, \'template-foot\': pagBottom == true}">\n    <div class="col-md-4">\n        <div ng-show="totalItems > limit">\n            <div class="text-center">\n                <dir-pagination-controls max-size="4" boundary-links="true" on-page-change="changePage(newPageNumber)"></dir-pagination-controls>\n            </div>\n        </div>\n        <div ng-show="totalItems == 0 && (filter != null && filter != \'\')">\n            <span class="glyphicon glyphicon-info-sign"></span>\n            Nenhum resultado encontrado para <strong>\'{{filter}}\'</strong>\n        </div>\n    </div>\n    \n    <div class="col-md-8" ng-if="withSearch">\n        <div class="input-group">    \n            <div class="input-group-btn" ng-if="changeLimit==false">\n                <a ng-href class="btn btn-default" style="cursor: move">\n                    <i ng-bind="currentPage+\'/\'+(totalItems/limit | round)+\' - \'+totalItems"></i>\n                </a>\n            </div>\n            <div class="input-group-btn" ng-if="changeLimit==true">\n                <div class="btn-group" role="group">\n                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\n                        <i ng-bind="currentPage+\'/\'+(totalItems/limit | round)+\' - \'+totalItems"></i>\n                        <span class="caret"></span>\n                    </button>\n                    <ul class="dropdown-menu">\n                        <li ng-repeat="item in limits" ng-class="{\'active\': item==limit}">\n                            <a role="button" ng-click="updateLimit(item)">{{item}}</a>\n                        </li>\n                    </ul>\n                </div>\n            </div>\n            <input type="text" ng-model="$parent.filter" ng-model-options="filterOptions" ng-change="listen()" class="form-control" placeholder="procure por um registro...">\n            <div class="input-group-btn" ng-show="withCreate==true">\n                <a ng-href="{{$root.createUrl(moduleName, null, \'create\')}}" class="btn btn-primary">\n                    <span class="glyphicon glyphicon-plus"></span>\n                    Novo\n                </a>\n            </div>    \n        </div>\n    </div>\n    \n    <div class="clear"></div>\n</div>');
$templateCache.put('table-action.html','<div ng-if="actions.length>0 || customAction.length>0">\n    \n    <a ng-repeat="act in customAction" \n        ng-href="{{$root.createUrl(name, id, act.name)}}" \n        class="no-underline label label-{{act[\'label-ico\']}}"\n        uib-tooltip="{{act.label}}" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <i class="glyphicon glyphicon-{{act.ico}}"></i>\n    </a>\n    \n    <a ng-if="actions.indexOf(\'view\') != -1" ng-href="{{$root.createUrl(name, id, \'view\')}}" class="no-underline label label-warning"\n       uib-tooltip="Visualizar" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-eye-open"></span>\n    </a>\n    <a ng-if="actions.indexOf(\'edit\') != -1" ng-href="{{$root.createUrl(name, id, \'edit\')}}" class="no-underline label label-primary"\n       uib-tooltip="Editar" uib-tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-edit"></span>\n    </a>\n    <a ng-if="actions.indexOf(\'remove\') != -1" ng-href role="button" ng-click="delete(id)" class="no-underline label label-danger"\n       uib-tooltip="Remover" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-remove"></span>\n    </a>\n</div>');
$templateCache.put('table-grid.html','<!--Block with breadcrumb-->\n<header-grid ng-if="showBreadcrumb==true" lines="lines"></header-grid>\n\n<!--Block with pagination, search and add button-->\n<paginate-search-grid \n    filter="filter" \n    limit="limit" \n    with-search="withSearch" \n    with-create="withCreate" \n    change-limit="changeLimit" \n    module-name="moduleName"\n    filter-options="filterOptions">\n</paginate-search-grid>\n\n<!--Block with table template default-->\n<table class="table table-striped table-bordered table-hover content table-responsive">\n    <thead>\n        <tr>\n            <th ng-repeat="f in fields">\n                <a role="button" ng-click="reOrder(f)" class="dark-link" ng-if="f.sort != undefined && f.sort==true">\n                    <i class="glyphicon glyphicon-triangle-{{ort[f.fk!=undefined?f.fk+\'.\'+f.column:f.column] == \'-\' ? \'top\' : \'bottom\'}}"></i>\n                </a>\n                {{f.label}}\n            </th>\n            <th ng-if="withActions">A\xE7\xF5es</th>\n        </tr>\n    </thead>\n    <tbody>\n        <tr dir-paginate="model in model | orderBy: order | filter: filter | itemsPerPage: limit" current-page="currentPage">\n            <td ng-repeat="f in fields">                \n                <div ng-if="f.type==\'simple\'" ng-bind="renderLine(model, f, true)"\n                    uib-tooltip="{{renderLine(model, f, false)}}" tooltip-placement="top" tooltip-trigger="mouseenter"></div>\n\n                <div ng-if="f.type==\'filter\'">\n                    <span ng-bind="addFilter(model, f, f.filter)"></span>\n                </div>\n\n                <div ng-if="f.type==\'link\' && f.url !=undefined">\n                    <a ng-href="{{f.url==\'view\' ? $root.createUrl(moduleName, model[primaryKey],\'view\') : f.url }}" ng-bind="renderLine(model, f, true)"\n                    uib-tooltip="{{renderLine(model, f, false)}}" tooltip-placement="top" tooltip-trigger="mouseenter"></a>\n                </div>\n\n                <div ng-if="f.type==\'template\'">\n                    <!-- Inform a custom template with a text ou html tag -->\n                    <div ng-if="f.content!= undefined" bind-html-compile="f.content"></div> \n                    <label-item ng-if="f.content == undefined" has-icon="f.icon" item="{{f.column}}" index="model[f.column]"></label-item>\n                </div>\n            </td>\n            <td ng-if="withActions" style="text-align: center; padding-left: 0.4%; padding-right: 0.4%;">\n                <table-action id="model[primaryKey]" name="moduleName" actions="actions" custom-action="customAction"></table-action>\n            </td>\n        </tr>\n    </tbody>\n</table>\n<paginate-search-grid ng-if="pagBottom==true" filter="filter" limit="limit" with-search="false" with-create="false" module-name="moduleName" pag-bottom="true"></paginate-search-grid>');}]);
/**
 * Object with configuration to enable the customize of this directive, aiming the furutes implementations
 */
angular.module('table.grid')
    .constant('tableConfig', {        
        defaultFilter: '',        
        defaultLimit: 5,        
        defaultPrimaryKey: '_id',
        defaultOrientation: '-', // (-) DESC | () ASC
        defaultActions: ['view', 'edit', 'remove','create'],
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
            controller: ["$scope", "$filter", "tableConfig", function($scope, $filter, tableConfig)
            {
                $scope.actions = $scope.actions || tableConfig.defaultActions;
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
                | content: Render a custom content, html tag, simple string, used when the type equal to 'template'
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