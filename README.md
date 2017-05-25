## Angular directive for create table grid

### Run the example, in the terminal, open the browser in 'http://localhost:3000/'
```` $ node server ````
 
### Installation
```` $ bower install mrc-table-grid ````

### Include the files
`````
<link rel="stylesheet" type="text/css" href="./bower_components/table-grid/dist/table-grid.css">
<script language="JavaScript" src="./bower_components/table-grid/dist/table-grid.js"></script>
`````

### Add the dependence in the your module:
``` angular.module('app', ['ngRoute','ngResource','ui.bootstrap','angularUtils.directives.dirPagination', 'table.grid']) ```

#### Example
#### View
```
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

#### Controller
```
$scope.limit = 10;
$scope.module = 'test';
$scope.actions = ['edit', 'remove'];
$scope.showCreate = true;
$scope.showSearch = true;
$scope.model = [];

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
