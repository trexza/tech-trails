/**
 * Created by Senthil Kumar on 14-06-2016.
 */
var firstApp = angular.module('firstApp', []);
firstApp.controller('FirstController', function($scope) {
    $scope.inputData = {input1:{value:"", state:""}, input2:{value:"", state:""}};
    $scope.focusGot = function(input){
        $scope.inputData[input]['value']='';
        $scope.inputData[input]['state']='Focus Gained';
    };

    $scope.focusLost = function(event, input){
        var element = angular.element(event.target);
        $scope.inputData[input]['value']=element.val().toUpperCase();
        $scope.inputData[input]['state']='Focus Lost';
    }

    $scope.keyState='';
    $scope.keyStrokes=[];
    $scope.keyPress = function(event){
        if(event.keyCode == 13){
            $scope.keyState='Enter Pressed';
            $scope.keyStrokes=[];
        }else{
            $scope.keyStrokes.push(event.keyCode);
        }
    }

    $scope.first = 'Some';
    $scope.last = 'One';
    $scope.heading = 'Message: ';
    $scope.updateMessage = function() {
        $scope.message = 'Hello ' + $scope.first +' '+ $scope.last + '!';
    };
});

firstApp.value('start', 200);
firstApp.controller('SumController', ['$scope', 'start', function($scope, start) {
    $scope.start = start;
    $scope.current = start;
    $scope.change = 1;
    $scope.difference = 1;
    $scope.inc = function(){
        $scope.current += $scope.change;
        $scope.diff();
    }
    $scope.dec = function(){
        $scope.current -= $scope.change;
        $scope.diff();
    }
    $scope.diff = function(){
        $scope.difference = $scope.current - $scope.start;
    }
}]);

firstApp.controller('MathController', function($scope){
    $scope.Math = window.Math;
    $scope.growArr = [1];
    $scope.shrinkArr = [];
});

firstApp.controller('PlaneController', ['$scope','filterFilter',function($scope, filterFilter){
    $scope.planes = [
        {make: 'Boeing', model: '777', capacity: 440},
        {make: 'Boeing', model: '747', capacity: 700},
        {make: 'Airbus', model: 'A380', capacity: 850},
        {make: 'Airbus', model: 'A340', capacity: 420},
        {make: 'McDonnell Douglas', model: 'DC10', capacity: 380},
        {make: 'McDonnell Douglas', model: 'MD11', capacity: 410},
        {make: 'Lockheed', model: 'L1011', capacity: 380}];

    $scope.filteredPlanes = $scope.planes;
    $scope.column = 'make';
    $scope.reverse = true;
    $scope.setSort = function(column){
        $scope.column = column;
        $scope.reverse = !$scope.reverse;
    }
    $scope.filterString = '';
    $scope.setfilter = function(){
        $scope.filteredPlanes = filterFilter($scope.planes, $scope.filterString);
    }
}]);

firstApp.controller('ColorController', function($scope){
    $scope.colors=['red','green','blue'];
    $scope.color='';
    $scope.myColor={colr:'',hits:'',missis:''};
    $scope.hits=0;
    $scope.misses=0;
    $scope.changeCount=0;
    $scope.currentChange='';
    $scope.changeColor = function(colrr){
        $scope.color=colrr;
        $scope.hits=0;
        $scope.misses=0;
    };
    $scope.hit=function(){
        $scope.hits += 1;
    };
    $scope.miss=function(){
        $scope.misses += 1;
    };
    $scope.$watch('color', function(newValue, oldValue){

        $scope.myColor.colr=newValue;
    });
    $scope.$watchGroup(['hits', 'misses'],function(newvalue, oldvalue){
        $scope.myColor.hits=newvalue[0];
        $scope.myColor.missis=newvalue[1];
    });
    $scope.$watchCollection('myColor', function(newValue,oldValue){
        $scope.changeCount +=1;
        $scope.currentChange= newValue.properties;
    });
});

firstApp.controller('Races', function($scope){
    $scope.names = ['Frodo', 'Aragorn', 'Legolas', 'Gimli'];
    $scope.person = $scope.names[0];
    $scope.changePerson = function(){
        $scope.person = this.name;
        $scope.$broadcast('CharacterChanged', this.name);
    }
    $scope.$on('CharacterDeleted', function(event, removedName){
       var i = $scope.names.indexOf(removedName);
        $scope.names.splice(i,1);
        $scope.person = $scope.names[0];
        $scope.$broadcast('CharacterChanged', $scope.person);
    });
}).controller('Character', function($scope){
    $scope.info = {'Frodo': { weapon: 'Sting',
                              race: 'Hobbit'},
                   'Aragorn': { weapon: 'Sword',
                              race: 'Man'},
                   'Legolas': { weapon: 'Bow',
                              race: 'Elf'},
                   'Gimli': { weapon: 'Axe',
                              race: 'Dwarf'}};
    $scope.currentInfo = $scope.info['Frodo'];
    $scope.deleteChar= function(){
        delete $scope.info[$scope.person];
        $scope.$emit('CharacterDeleted',$scope.person);
    };
    $scope.$on('CharacterChanged',function(event, newCharacter){
        $scope.currentInfo = $scope.info[newCharacter];
    });
});

firstApp.controller('FirstService', ['$scope', '$http', function($scope, $http){

    $scope.storeItems = {};
    $scope.shelfItems = {};
    $scope.restockStatus = '';
    $scope.getItemsStatus = '';

    $scope.restock = function(){
        $scope.restockStatus ='Restock Triggered...';
        $http.get('/reset/data')
            .success(function(data, status, headers, config) {

                $scope.storeItems = data;
                $scope.shelfItems =  angular.copy($scope.storeItems);

            })
            .error(function(data, status, headers, config) {

                $scope.restockStatus = data;
            })

        $scope.restockStatus ='Restock Complete';
        $scope.getItemStatus ='';
    };

    $scope.reorder = function(buyItem){
        $http.post('buy/item', {item:buyItem})
            .success(function(data, status, headers, config) {
                if($scope.storeItems.hasOwnProperty(buyItem)){
                    $scope.storeItems[buyItem] = data;
                } else {
                    $scope.storeItems[buyItem] = data;
                }
                $scope.restockStatus = '';
            })
            .error(function(data, status, headers, config) {
                $scope.restockStatus = data;

            })
    }

    $scope.getItem = function(item){
        if($scope.storeItems[item] > 0){
            $scope.storeItems[item] -= 1;
            $scope.shelfItems[item] += 1;
            $scope.getItemStatus ='';
        } else {
            $scope.restockStatus = 'Not Enough Stock. Please Reorder';
        }

    };


    $scope.useItem = function(item){
        if($scope.shelfItems[item] > 0){
            $scope.shelfItems[item] -= 1;
        } else {
            $scope.getItemStatus = 'Empty shelf. Please get from stock';
        }
    }

}]);

firstApp.controller('LibraryService', ['$scope', '$http', function($scope, $http){

    $scope.book = '';
    $scope.bookid = '';
    $scope.cost = '';
    $scope.authr = '';
    $scope.fullString = '';
    $scope.findBorrow = function(){
        console.log($scope.book);
        $http.get('/findborrow/'+$scope.book)
            .success(function(data, status, headers, config) {
                
                $scope.fullString = JSON.parse(data.info);
                $scope.bookid = $scope.fullString[0].bookId;
                $scope.cost = '$'+$scope.fullString[0].costPerday;
                $scope.authr = $scope.fullString[0].author;

                console.log($scope.fullString[0]);
                console.log($scope.fullString[0].bookId);

            })
            .error(function(data, status, headers, config) {

                $scope.fullString = data;
            })
    }

}]);