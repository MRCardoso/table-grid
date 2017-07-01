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
    });