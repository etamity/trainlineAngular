 /**
 * Create by Joey Etamity 
 * Date: 23/07/2016
 */
 app.directive('ngslider', function ($timeout) {
        return {
          restrict: 'E',
          transclude: 'true',
          scope: {
             'value': '='
          },
          template: '<input type="text" data-provide="slider" data-slider-tooltip="hide" />',
          link: function (scope, element, attrs) {
            var $slider = $(element);
            $slider.slider({
              ticks: [0, 4, 8, 12, 16, 20],  // time speed value
              ticks_labels: ['1x', '4x', '8x','12x', '16x', '20x'],
              ticks_snap_bounds: 20}).slider('setValue', scope.value);
            $slider.change(function (e){
                var value = e.value.newValue;
                scope.$apply(function(){
                    scope.value = value;
                });
              
     
            });

           }
         }
    });