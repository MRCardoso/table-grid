# Angular Table grid

**NOTE:** The angular version supperted currently is `angular-1.5.x`
 
## Installation
````
$ bower install mrc-table-grid --save
````

Add the css and javascript files

```Html
<link rel="stylesheet" type="text/css" href="./bower_components/table-grid/dist/css/table-grid.min.css">
<script language="JavaScript" src="./bower_components/table-grid/dist/js/table-grid.min.js"></script>
```

Add the dependence in the your module:

```Javascript
angular.module('app', ['table.grid'])
```


## Simple Example

Html code to add in the view:

```Html
<table-grid 
    limit="limitation"
    model="model"
    actions="actions"
    custom-action="actionCustom"
    show-breadcrumb="breadcrumb"
    module-name="moduleName"
    with-search="showSearch"
    with-create="showCreate"
    with-actions="showActions"
    change-limit="changeLimit"
    lines="lines"
    order="name"
    fields="[
        {label: 'Nome', column: 'name', type:'simple',sort:true}, 
        {label: 'Tipo', column: 'type', type:'simple', sort:true}, 
        {label: 'Link', column: 'name', url: 'https://google.com/', type:'link', sort:true }, 
        {label: 'Link', column: 'name', url: 'view', type:'link', sort:true }, 
        {label: 'File', column: 'file', type:'simple',sort:false}, 
        {label: 'User', column: 'name', fk: 'userId', type:'simple',sort:true}, 
        {label: 'Status', column: 'status', type:'template'}, 
        {label: 'Criação', column: 'created', filter: ['date', 'dd/MM/yyyy'], type:'filter'}, 
    ]">
 </table-grid>
```

Script code to add in the Controller:

```javascript
$scope.moduleName = 'Users';
$scope.hasIcon = true;
$scope.changeLimit=false;
$scope.breadcrumb=false;
$scope.showCreate = true;
$scope.showSearch = true;
$scope.limitation = 10;
$scope.actions = ['view', 'edit', 'remove'];
$scope.model = [{ _id: 1, name: 'Example 1', type: '1', status: 1, created: new Date() }];
$scope.lines = [{path: 'users', label: 'Users'}];
$scope.actionCustom = [
    {"name": "config", "label": "Configuração", "label-ico":"info", "ico": "cog"},
    {"name": "photo", "label": "Fotos", "label-ico":"default", "ico": "picture"},
];

// create your own method delete
$scope.$root.delete = function(id)
{
    console.log(id);
};
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

* **moduleName:** The name of the current module
* **model:** The data object with the records(the pattern for id in each line, is the same that mongodb '_id')
* **fields** The availables properties are:
  * **label:** The string with text of the column
  * **column:** The string with property name of the lines in the 'model' to be rendered
  * **type:** The string with kind of template to be render the line, the options are:
    * **simple:** Render a simple databind
    * **template:** Render a template with other directive(label-item)
    * **link:** Render a simple databind with a link href
    * **filter:** Render a simple databind with angular filter
    * **image:** Render an image, No implement
    * **sort:** Show or hide the option to ordenation ASC DESC the column
  * **url:** used together 'type="link"', when is '**view**', the url is relative('{baseUrlTmpl}/{viewUrlTmpl}')
  * **icon:** used together 'type="template"', Show or hide the icon of the label directive(label-item)
  * **fk:** The object of the foreign key, this case the property 'column' get the value inner this object
  * **filter:** used together 'type="filter"', an array the first is the 'filter name', the second is the 'value for the filter'
* **limit:** (default: tableConfig.defaultLimit) The limitation of the itens by page
* **filter:** (default: tableConfig.defaultFilter) The databing to filter the grid
* **order:** (default: orientation+tableConfig.defaultPrimaryKey) The ordenation of the grid
* **actions:** (default: tableConfig.defaultActions) Actions availables grid options
* **showBreadcrumb:** (default: true) Show or hide the header Breadcrumb
* **withSearch:** (default true) Show or hide the field with search in the grid
* **withCreate:** (default true) Show or hide the button for create new item in the grid
* **primaryKey:** (default: tableConfig.defaultPrimaryKey) Define which field the primary key
* **orientation:** (default: tableConfig.defaultOrientation) The ordenation default of the grid
* **withActions:** (default: true) Show or hide the column 'actions' on the grid
* **changeLimit:** (default: false) Add a dropdown with the custom limits
* **lines:** The same that (header-grid)
* **customAction:** (default: []) Equal to the directive(table-action)
* **pagBottom:** Show or hide pagination on bottom in the grid
* **filterOptions:** Additional options of the events into ngModel in search input

```Html
<table-grid
    [model="Array({})"]
    [fields="Array({})"]
    [actions="Array"]
    [filter="ngBing"]
    [limit="String|int"]
    [module-name="String"]
    [show-breadcrumb="Bool"]
    [is-owner="Bool"]
    [order="String"]
    [primary-key="String|int"]
    [orientation="String"]
    [with-search="Bool"]
    [with-create="Bool"]
    [with-actions="Bool"]
    [change-limit="Bool"]
    [lines="Array({})"]
    [custom-action="Array({})"]
    [pag-bottom="Bool"]
    [search-options="{}"]>
</table-grid>
```

## paginate-search-grid
* **moduleName:** The name of the current module(interface) 
* **limit:** (default: tableConfig.defaultLimit) The limitation of the itens by page at the grid
* **filter:** (default: tableConfig.defaultFilter) The databing with the filter for grid 
* **withCreate:** (default: true) Show and hide the 'new' button
* **withSearch:** (default: true) Show and hide the 'search' input
* **changeLimit:** (default: false), Enable the dropdown with the list of limitation custom
* **pagBottom:** (default: false) Show or hide pagination on bottom in the grid
* **filterOptions:** (default: {updateOn: 'default'}) Additional options of the events into ngModel in search input

```Html
<paginate-search-grid
    [module-name="String"]
    [limit="String|int"]
    [filter="ngBing"]
    [with-create="Bool"]
    [with-search="Bool"]
    [change-limit="Bool"]
    [pag-position="String"]
    [pag-bottom="Bool"]
    [search-options="{}"]>
</paginate-search-grid>
```

## header-grid
* **lines:** the properties for render a breadcrumb
  * **path:** string|bool, the action of the link, local url, when is false olny render the 'label'
  * **label:** string, the name of the current breadcrumb

```Html
<header-grid [lines="Array({})"]></header-grid>
```
  
## label-item
* **hasIcon:** (default: true) Show or hide the icon of the label
* **index:** The value of the current line, for get the text in appLabels according your value
* **item:** The property in appLabels
* **addIndex:** Use when the value in appLabels is an array

```Html
<label-item
    [has-icon="Bool"]
    [index="String"]
    [item="String"]
    [add-index="String"]>
</label-item>
```

## table-action
* *module: The name of the current module(interface) (depreciated)* 
* **id:** Primary Key of the item
* **name:** The name of the current module
* **actions:** The actions availables grid options
* **customAction:** The availables properties are:
  * **name:** The name of the action in request default(/{module}/{id}/{name})
  * **label:** The title in the tooltip when on mouseover
  * **label-ico:** The class of the label bootstrap, pattern is here: 'label label-{label-ico}'
  * **ico:** The class of the icon bootstrap, pattern is here: 'glyphicon glyphicon-{ico}'

```Html
<table-action
    [id="String|int"]
    [name="String"]
    [actions="Array"]
    [custom-action="Array({})"]>
</table-action>
```

## Changelog

Please see the [releases page](https://github.com/MRCardoso/table-grid/releases) for details
of each released version.

## Licence

MIT
