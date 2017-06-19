/**
 * Object with configuration to enable the customize of this directive, aiming the furutes implementations
 */
(function(){
    'use strict';

    angular.module('table.grid')
    .constant('tableConfig', {        
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
        baseUrlTmpl: '/#!/{module}',
        viewUrlTmpl: '/{id}/view',
        editUrlTmpl: '/{id}/edit',
        createUrlTmpl: '/create',
        debugMode: false,
        url: '', // no implemented
        authentication: null, // no implemented
    })
}());