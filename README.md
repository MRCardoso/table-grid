# Angular Table grid

**NOTE:** The angular version supperted currently is `angular-1.5.x`
 
## Installation
````
$ bower install mrc-table-grid --save
````

Add the css and javascript files

```Html
<link rel="stylesheet" type="text/css" href="./bower_components/table-grid/dist/table-grid.css">
<script language="JavaScript" src="./bower_components/table-grid/dist/table-grid.js"></script>
```

Add the dependence in the your module:

```Javascript
angular.module('app', ['table.grid'])
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
// this variable will be responsable to create the breadcrumb
$scope.lines = [{path: 'role', label: 'Role'}];

$scope.limit = 10;
$scope.module = 'Role';
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

## Arguments Availables

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

for the property 'fields' the availables properties are:
* **label:** the string with text of the column
* **column:** the property name of the lines in the 'model' to be rendered
* **type:** the type of template to be rendered in the line, the options are:
  * **simple:** Render a simple databind
  * **template:** Render a template with other directive(label-item)
  * **link:** Render a simple databind with a link href
  * **filter:** Render a simple databind with angular filter
  * **image:**: Render an image, No implement
* **url:** used together 'type="link"', Create a link, when your value is 'view' create a local url to view action of the current module
* **icon:** used together 'type="template"', Show or hide the icon of the label directive(label-item)
* **fk:** The object of the foreign key, this case the property 'column' get the value inner this object
* **filter:** used together 'type="filter"', an array the first is the 'filter name', the second is the 'value for the filter'


## Changelog

Please see the [releases page](https://github.com/MRCardoso/table-grid/releases) for details
of each released version.

## Licence

MIT
