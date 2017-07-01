'use strict';

angular.module("app.controller",[])
    .controller('TableController', ['$scope', function ($scope)
    {
        $scope.searcher = '';
        $scope.breadcrumb=false;
        $scope.pagBottom=false;
        $scope.moduleName = 'Default';
        $scope.hasIcon = true;
        $scope.showCreate = true;
        $scope.limitation = 10;
        $scope.actions = ['view', 'edit', 'remove'];
        $scope.lines = [
            {path: '', label: 'Default'},
            {path: 'in', label: 'data'}
        ];
        $scope.showSearch = true;
        $scope.limits = [5,10,15,20,25,30,35,40,45,50];
        $scope.model = [];

        $scope.addAction = function(action){
            let index = $scope.actions.indexOf(action);
            if( index != -1 )
                $scope.actions.splice(index,1);
            else
                $scope.actions.push(action);
        };

        $scope.$root.delete = function(id){
            console.log(id);
        };
        
        var words = 'a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z';

        for(let i = 0; i<2000; i++)
        {
            let word = [];
            let wdList = words.split('|');
            let date = new Date();
            wdList = wdList.concat([i, date.getDate(), date.getFullYear()]);
            
            for(let w = 0; w <= 20; w++)
            {
                var key = Math.floor(Math.random() * wdList.length + 0);
                word.push(wdList[key]);
            }
            $scope.model.push({
                _id: i,
                name: word.join(''),
                type: i,
                userId: {_id: i+10, name: 'user name' +i},
                status: Math.floor(Math.random() * 2 + 0), // `${i%2==0?1:0}`,
                created: date
            })
        }

        $scope.actionCustom = [
            {"name": "config", "label": "Configuração", "label-ico":"info", "ico": "cog"},
            {"name": "photo", "label": "Fotos", "label-ico":"default", "ico": "picture"},
        ];
    }]);