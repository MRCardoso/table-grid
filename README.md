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
     search-options="{withSearch: withSearch, withCreate: withSearch}"
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
$scope.model = [{ _id: 1, name: 'Example 1', type: '1', status: 1, created: new Date() }];
```

# Directives API
Are five direcive, which together create a table of data, with search, paginations, and default actions for each line 'view', 'edit', 'delete',  in the angular 1 pattern. The directive '**table-grid**' is the main, but the other directives can be use devided when required.
    
## table-grid

* **model:** Array with the data object with the records(the pattern for id in each line, is the same that mongodb '_id')
* **fields** The availables properties are:
  * **label:** the string with text of the column
  * **column:** the string with property name of the lines in the 'model' to be rendered
  * **type:** The string with kind of template to be render the line, the options are:
    * **simple:** Render a simple databind
    * **template:** Render a template with other directive(label-item)
    * **link:** Render a simple databind with a link href
    * **filter:** Render a simple databind with angular filter
    * **image:**: Render an image, No implement
  * **url:** used together 'type="link"', when is '**view**', the url is relative('/#!/'+moduleName+'/'+line._id)
  * **icon:** used together 'type="template"', Show or hide the icon of the label directive(label-item)
  * **fk:** The object of the foreign key, this case the property 'column' get the value inner this object
  * **filter:** used together 'type="filter"', an array the first is the 'filter name', the second is the 'value for the filter'
* **actions:** Array of the availables grid options
* **limit:** the limitation of the itens by page
* **filter:** the databing to filter the grid
* **order:** The ordenation of the grid
* **isOwner:** define when the 'actions' each line will be show:no implement
* **showBreadcrumb:** no implement
* **moduleName:** The name of the current module
* **searchOptions:** Array with the options sent to children directive(paginate-search)

## paginate-search-grid
* **moduleName:** The name of the current module(interface) 
* **limit:** The limitation of the itens by page at the grid, default: 5
* **filter:** The databing with the filter for grid 
* **withCreate:** show and hide the 'new' button, default: true
* **withSearch:** show and hide the 'search' input, default: true


## header-grid
* **lines:** the properties for render a breadcrumb
  * **path:** string|bool, the action of the link, local url, when is false olny render the 'label'
  * **label:** string, the name of the current breadcrumb
  
  
## label-item
* **hasIcon:** Show or hide the icon of the label, default: true
* **index:** The value of the current line, for get the text in appLabels according your value
* **item:** The property in appLabels
* **addIndex:** Use when the value in appLabels is an array

## table-action
* **module:** The name of the current module(interface)


## Changelog

Please see the [releases page](https://github.com/MRCardoso/table-grid/releases) for details
of each released version.

## Licence

MIT
