angular.module('table.grid')
    .filter('renderUrl', ['tableConfig',function(tableConfig){
        return function(path, param, type){
            var urlBase = tableConfig.baseUrlTmpl.replace('{module}', path);
            var args = '';            
            if( typeof param == 'object' && param != null )
            {
                var params = [];
                for(var i in param){
                    params.push(param[i]);
                }
                args = '/'+ params.join('/');
            }
            else
            {
                switch(type){
                    case 'create': args = tableConfig.createUrlTmpl; break;
                    case 'edit': args = tableConfig.editUrlTmpl.replace('{id}', param);break;
                    case 'view': args = tableConfig.viewUrlTmpl.replace('{id}', param); break;
                    default: args = "/"+param+"/"+type; break;
                }                
            }
            return urlBase+args;
        }
    }])
    .filter('round', function() {
        return function(str,type) {
            type = type == undefined ? 'ceil' : type;

            return ( String(str) == 'NaN' ? 1 : Math[type](str));
        }
    })
    .filter('trustAsHtml', ["$sce", function($sce) {
        return $sce.trustAsHtml;
    }]);