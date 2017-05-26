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
        deleteCallback: function(){} // no implemented
        // factoryTable: informe a factory to use in the callback 'remove'
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
            templateUrl: "table-grid.html",//"/src/templates/table-grid.html",
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
            templateUrl: 'search-grid.html',//"/src/templates/search-grid.html",
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
            templateUrl: 'header-grid.html', //'/src/templates/header-grid.html',
            scope: {
                lines: '=?lines',
                save: '=save'
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
            templateUrl: 'label-grid.html',//"/src/templates/label-grid.html",
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
            templateUrl: 'table-action.html',//'/src/templates/table-action.html',
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
angular.module('table.grid').run(['$templateCache', function($templateCache) {$templateCache.put('header-grid.html','<div ng-class="{\'border content content-large\': save == true}">\r\n    <ul class="breadcrumb">\r\n        <li><a ng-href="/#!/">Home</a></li>\r\n        <li ng-repeat="row in lines">\r\n            <a ng-href="/#!/{{row.path}}" data-ng-show="row.path !== false">\r\n                <span data-ng-bind="row.label"></span>\r\n            </a>\r\n            <span data-ng-bind="row.label" data-ng-show="row.path===false"></span>\r\n        </li>\r\n    </ul>\r\n</div>');
$templateCache.put('label-grid.html','<div class="label label-{{data.class}}" uib-tooltip="{{item}} : {{data.name}}" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\r\n    <span ng-show="hasIcon" class="glyphicon glyphicon-{{data.icon}}"></span>\r\n    <span ng-bind="data.name"></span>\r\n</div>');
$templateCache.put('search-grid.html','<div class="template-head">\r\n    <div class="col-md-4">\r\n        <div ng-show="totalItems > limit">\r\n            <div class="text-right">\r\n                <dir-pagination-controls max-size="4" boundary-links="true" on-page-change="changePage(newPageNumber)"></dir-pagination-controls>\r\n            </div>\r\n        </div>\r\n        <div ng-if="totalItems == 0 && (filter != null && filter != \'\')">\r\n            <span class="glyphicon glyphicon-info-sign"></span>\r\n            Nenhum resultado encontrado para <strong>\'{{filter}}\'</strong>\r\n        </div>\r\n    </div>\r\n    <div class="col-md-8" ng-if="withSearch">\r\n        <div class="input-group">    \r\n            <div class="input-group-btn">\r\n                <a ng-href class="btn btn-default" style="cursor: move">\r\n                    <i ng-bind="currentPage+\'/\'+(totalItems/limit | round)+\' - \'+totalItems"></i>\r\n                </a>\r\n            </div>\r\n            <input type="text" ng-model="$parent.filter" ng-change="listen()" class="form-control" placeholder="procure por um registro...">\r\n            <div class="input-group-btn" ng-show="withCreate==true">\r\n                <a ng-href="{{createUrl()}}" class="btn btn-primary">\r\n                    <span class="glyphicon glyphicon-plus"></span>\r\n                    Novo\r\n                </a>\r\n            </div>    \r\n        </div>\r\n    </div>\r\n    <div class="clear"></div>\r\n</div>');
$templateCache.put('table-action.html','<div ng-if="module.actions.length>0">\n    <a ng-if="module.actions.indexOf(\'view\') != -1" ng-href="{{createUrl(\'view\')}}" class="no-underline label label-warning"\n       tooltip="Visualizar" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-eye-open"></span>\n    </a>\n    <a ng-if="module.actions.indexOf(\'edit\') != -1" ng-href="{{createUrl(\'edit\')}}" class="no-underline label label-primary"\n       tooltip="Editar" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-edit"></span>\n    </a>\n    <a ng-if="module.actions.indexOf(\'remove\') != -1" ng-href role="button" ng-click="delete(module.id)" class="no-underline label label-danger"\n       tooltip="Remover" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-remove"></span>\n    </a>\n</div>');
$templateCache.put('table-grid.html','<!--Block with breadcrumb-->\r\n<header-grid lines="$parent.lines" save="false"></header-grid>\r\n<div ng-if="searchOptions != undefined">\r\n    <!--Block with pagination, search and add button-->    \r\n    <paginate-search-grid filter="$parent.filter" limit="limit" with-search="searchOptions.withSearch" with-create="searchOptions.withCreate" module-name="searchOptions.moduleName"></paginate-search-grid>\r\n</div>\r\n\r\n<!--Block with table template default-->\r\n<table class="table table-striped table-bordered table-hover content table-responsive">\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat="f in fields">{{f.label}}</th>\r\n            <th>A\xE7\xF5es</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr dir-paginate="model in model | orderBy: order | filter: filter | itemsPerPage: limit" current-page="currentPage">\r\n            <td ng-repeat="f in fields">\r\n                <div ng-if="f.type==\'simple\'" ng-bind="renderLine(model, f)"></div>\r\n\r\n                <div ng-if="f.type==\'filter\'">\r\n                    <span ng-bind="addFilter(model, f, f.filter)"></span>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'link\' && f.url !=\'undefined\'">\r\n                    <a ng-href="{{f.url==\'view\' ? \'/#!/\'+moduleName+\'/\'+model._id : f.url }}" ng-bind="renderLine(model, f)"></a>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'image\'">\r\n                    <image-s3 url="renderLine(model, f)" path="f.pathImage" with-user-id="{{f.userId}}" alt="imagem" class="image-thumb-4"></image-s3>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'template\'">\r\n                    <label-item has-icon="f.icon" item="{{f.column}}" index="model[f.column]"></label-item>\r\n                </div>\r\n            </td>\r\n            <td align="center">\r\n                <div ng-if="!isOwner">\r\n                    <table-action module="{id: model._id, name: moduleName, actions: actions}"></table-action>\r\n                </div>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n</table>');}]);