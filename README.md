# Angular Table grid

Run the example, in the terminal, open the browser in 'http://localhost:3000/'

````
$ node server
````
 
### Installation
````
$ bower install mrc-table-grid --save
````

Add the css and javascript files

```javascript
<link rel="stylesheet" type="text/css" href="./bower_components/table-grid/dist/table-grid.css">
<script language="JavaScript" src="./bower_components/table-grid/dist/table-grid.js"></script>
```

Add the dependence in the your module:

```
angular.module('app', ['ngRoute','ngResource','ui.bootstrap','angularUtils.directives.dirPagination', 'table.grid'])
```


## Example

Html code to add in the view:

```Html
<table-grid 
     limit="limit"
     model="model"
     actions="actions"
     module-name="module"
     search-options="{withSearch: withSearch, withCreate: withSearch, moduleName: module}"
     fields="[
         {label: 'Nome', column: 'name', type:'simple'},
         {label: 'Status', column: 'status', type:'template'}, 
         {label: 'Criação', column: 'created', filter: ['date', 'dd/MM/yyyy'], type:'filter'}, 
     ]">
 </table-grid>
```

Script code to add in the Controller:

```javascript
$scope.limit = 10;
$scope.module = 'test';
$scope.actions = ['edit', 'remove'];
$scope.showCreate = true;
$scope.showSearch = true;
$scope.model = [];
// this variable will be responsable to create the breadcrumb
$scope.lines = [{path: 'role', label: 'Role'}];

for(let i = 0; i<50; i++)
{
    $scope.model.push({
        _id: i,
        name: `Example ${i}`,
        type: '1',
        status: `${i%2==0?1:0}`,
        created: new Date()
    })
}
```

# arguments availables

name    | value | Observation
--------|------ | -----------
model   | Array | Array with the data object with the records
fields  | Array | Array with the list of the field, inner on 'model'
actions | Array | Array of the availables grid options
limit   | int   | the limitation of the itens by page
filter  | string | the databing to filter the grid
order   | string | The ordenation of the grid
isOwner  | bool  | define when the 'actions' each line will be show:no implement
showBreadcrumb | bool   | no implement
moduleName     | string | The name of the current module
searchOptions  | Array  | Array with the options sent to children directive(paginate-search)
