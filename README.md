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

## The default configuration are: 
```javascript
{        
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
    baseUrlTmpl: '/#!/{module}', // Is the base url for each module, ex: 'myapp/#!/users'
    viewUrlTmpl: '/{id}/view', // the default action to view, ex: 'myapp/#!/users/1/view'
    editUrlTmpl: '/{id}/edit', // the default action to edit, ex: 'myapp/#!/users/1/edit'
    createUrlTmpl: '/create', // the default action to create, ex: 'myapp/#!/users/create'
    debugMode: false,
    url: '', // no implemented
    authentication: null, // no implemented
}
```

### Exists a filter that create the url with base in the pattern of the configs '*UrlTmpl'
```javascript
    $filter('renderUrl')("users", null, "create"); // output: myapp/#!/users/create'
    $filter('renderUrl')("users", "1", "edit"); // output: myapp/#!/users/1/edit
    $filter('renderUrl')("users", "1", "view"); // output: myapp/#!/users/1/view
    $filter('renderUrl')("users", "1", "config"); // output: myapp/#!/users/1/config
```

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
  * **url:** used together 'type="link"', when is '**view**', the url is relative('{baseUrlTmpl}/{viewUrlTmpl}')
  * **icon:** used together 'type="template"', Show or hide the icon of the label directive(label-item)
  * **fk:** The object of the foreign key, this case the property 'column' get the value inner this object
  * **filter:** used together 'type="filter"', an array the first is the 'filter name', the second is the 'value for the filter'
* **actions:** Array of the actions availables grid options
* **limit:** the limitation of the itens by page
* **filter:** the databing to filter the grid
* **order:** The ordenation of the grid
* **isOwner:** define when the 'actions' each line will be show:no implement
* **showBreadcrumb:** no implement
* **moduleName:** The name of the current module
* *searchOptions: Array with the options sent to children directive(paginate-search)(depreciate)*
* **withSearch:** bool, Show or hide the field with search in the grid,(default true)
* **withCreate:** bool, Show or hide the button for create new item in the grid,(default true)
* **primaryKey:** String, define which field the primary key, (Default: '_id')
* **orientation:** String, The ordenation default of the grid
* **withActions:** bool, Show or hide the column 'actions' on the grid
* **changeLimit:** bool, Add a dropdown with the custom limits (Default: false)
* **lines:** Array, The same that (header-grid)
* **customAction:** Array, equal to the directive(table-action)

## paginate-search-grid
* **moduleName:** The name of the current module(interface) 
* **limit:** The limitation of the itens by page at the grid, default: 5
* **filter:** The databing with the filter for grid 
* **withCreate:** show and hide the 'new' button, default: true
* **withSearch:** show and hide the 'search' input, default: true
* **changeLimit:** bool, enable the dropdown with the list of limitation custom (Default: false)

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
* *module: The name of the current module(interface) (depreciated)* 
* **id:** String, Primary Key of the item
* **name:** String, the name of the current module
* **actions:** Array of the actions availables grid options
* **customAction:** Array, The availables properties are:
  * **name:** The name of the action in request default(/{module}/{id}/{name})
  * **label:** The title in the tooltip when on mouseover
  * **label-ico:** The class of the label bootstrap, pattern is here: 'label label-{label-ico}'
  * **ico:** The class of the icon bootstrap, pattern is here: 'glyphicon glyphicon-{ico}'


## Changelog

Please see the [releases page](https://github.com/MRCardoso/table-grid/releases) for details
of each released version.

## Licence

MIT
