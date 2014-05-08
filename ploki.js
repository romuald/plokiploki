//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

var app = angular.module('plokiploki', []);
app.directive('plokiWheel', ['$parse', function($parse){
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            element.bind('wheel', function(event, delta){
                var foo = event.deltaY > 0 ? 1 : -1;

                var allowed = scope.$eval(attr.plokiWheel);
                var value = ngModel.$modelValue + foo;
                event.preventDefault();

                if (allowed.indexOf(value) != -1)  {
                    ngModel.$setViewValue(ngModel.$modelValue + foo, event);
                    scope.$digest()
                }
            });
        }
    };
}]);

app.controller('PlokiPlokiCtl', ['$scope', function($scope) {
    var all = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    var spe = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~'.split('');

    $scope.passlengths = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    $scope.speciallengths = [0, 1, 2, 3, 4, 5];

    $scope.passlength = 12;
    $scope.speciallength = 0;

    function genpassword() {
        var i, idx, pass=[];

        for (i=0; i < $scope.passlength; i++) {
            idx = (Math.random() * all.length) >>> 0;
            pass.push(all[idx]);
        }
        for (i=$scope.speciallength; i > 0; i--) {
            idx = (Math.random() * spe.length) >>> 0;
            pass.push(spe[idx]);
            pass.shift();
        }
        $scope.password = shuffle(pass).join('');
    };
    $scope.genpassword = genpassword;
    genpassword();

    $scope.$watch('passlength', genpassword);
    $scope.$watch('speciallength', genpassword);
    $scope.updown = function($delta) {
        console.log($delta);
    };

}]);
