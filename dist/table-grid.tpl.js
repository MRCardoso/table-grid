angular.module('table.grid').run(['$templateCache', function($templateCache) {$templateCache.put('header-grid.html','<ul class="breadcrumb">\r\n    <li><a ng-href="/#!/">Home</a></li>\r\n    <li ng-repeat="row in lines">\r\n        <a ng-href="/#!/{{row.path}}" data-ng-show="row.path !== false">\r\n            <span data-ng-bind="row.label"></span>\r\n        </a>\r\n        <span data-ng-bind="row.label" data-ng-show="row.path===false"></span>\r\n    </li>\r\n</ul>');
$templateCache.put('label-grid.html','<div class="label label-{{data.class}}" uib-tooltip="{{item}} : {{data.name}}" uib-tooltip-placement="top" uib-tooltip-trigger="mouseenter">\r\n    <span ng-show="hasIcon" class="glyphicon glyphicon-{{data.icon}}"></span>\r\n    <span ng-bind="data.name"></span>\r\n</div>');
$templateCache.put('search-grid.html','<div class="template-head">\r\n    <div class="col-md-4">\r\n        <div ng-show="totalItems > limit">\r\n            <div class="text-right">\r\n                <dir-pagination-controls max-size="4" boundary-links="true" on-page-change="changePage(newPageNumber)"></dir-pagination-controls>\r\n            </div>\r\n        </div>\r\n        <div ng-if="totalItems == 0 && (filter != null && filter != \'\')">\r\n            <span class="glyphicon glyphicon-info-sign"></span>\r\n            Nenhum resultado encontrado para <strong>\'{{filter}}\'</strong>\r\n        </div>\r\n    </div>\r\n    <div class="col-md-8" ng-if="withSearch">\r\n        <div class="input-group">    \r\n            <div class="input-group-btn">\r\n                <a ng-href class="btn btn-default" style="cursor: move">\r\n                    <i ng-bind="currentPage+\'/\'+(totalItems/limit | round)+\' - \'+totalItems"></i>\r\n                </a>\r\n            </div>\r\n            <input type="text" ng-model="$parent.filter" ng-change="listen()" class="form-control" placeholder="procure por um registro...">\r\n            <div class="input-group-btn" ng-show="withCreate==true">\r\n                <a ng-href="{{createUrl()}}" class="btn btn-primary">\r\n                    <span class="glyphicon glyphicon-plus"></span>\r\n                    Novo\r\n                </a>\r\n            </div>    \r\n        </div>\r\n    </div>\r\n    <div class="clear"></div>\r\n</div>');
$templateCache.put('table-action.html','<div ng-if="module.actions.length>0">\n    <a ng-if="module.actions.indexOf(\'view\') != -1" ng-href="{{createUrl(\'view\')}}" class="no-underline label label-warning"\n       tooltip="Visualizar" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-eye-open"></span>\n    </a>\n    <a ng-if="module.actions.indexOf(\'edit\') != -1" ng-href="{{createUrl(\'edit\')}}" class="no-underline label label-primary"\n       tooltip="Editar" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-edit"></span>\n    </a>\n    <a ng-if="module.actions.indexOf(\'remove\') != -1" ng-href role="button" ng-click="delete(module.id)" class="no-underline label label-danger"\n       tooltip="Remover" tooltip-placement="top" tooltip-trigger="mouseenter">\n        <span class="glyphicon glyphicon-remove"></span>\n    </a>\n</div>');
$templateCache.put('table-grid.html','<!--Block with breadcrumb-->\r\n<header-grid ng-if="showBreadcrumb==true" lines="$parent.$parent.lines"></header-grid>\r\n\r\n<!--Block with pagination, search and add button-->\r\n<paginate-search-grid filter="filter" limit="limit" with-search="searchOptions.withSearch" with-create="searchOptions.withCreate" module-name="moduleName"></paginate-search-grid>\r\n\r\n<!--Block with table template default-->\r\n<table class="table table-striped table-bordered table-hover content table-responsive">\r\n    <thead>\r\n        <tr>\r\n            <th ng-repeat="f in fields">{{f.label}}</th>\r\n            <th>A\xE7\xF5es</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr dir-paginate="model in model | orderBy: order | filter: filter | itemsPerPage: limit" current-page="currentPage">\r\n            <td ng-repeat="f in fields">\r\n                <div ng-if="f.type==\'simple\'" ng-bind="renderLine(model, f)"></div>\r\n\r\n                <div ng-if="f.type==\'filter\'">\r\n                    <span ng-bind="addFilter(model, f, f.filter)"></span>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'link\' && f.url !=\'undefined\'">\r\n                    <a ng-href="{{f.url==\'view\' ? \'/#!/\'+moduleName+\'/\'+model._id : f.url }}" ng-bind="renderLine(model, f)"></a>\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'image\'">\r\n                    <!---image-s3 url="renderLine(model, f)" path="f.pathImage" with-user-id="{{f.userId}}" alt="imagem" class="image-thumb-4"></image-s3-->\r\n                </div>\r\n\r\n                <div ng-if="f.type==\'template\'">\r\n                    <label-item has-icon="f.icon" item="{{f.column}}" index="model[f.column]"></label-item>\r\n                </div>\r\n            </td>\r\n            <td align="center">\r\n                <div ng-if="!isOwner">\r\n                    <table-action module="{id: model._id, name: moduleName, actions: actions}"></table-action>\r\n                </div>\r\n            </td>\r\n        </tr>\r\n    </tbody>\r\n</table>');}]);