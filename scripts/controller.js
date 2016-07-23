  /**
 * Create by Joey Etamity 
 * Date: 23/07/2016
 */
  app.controller('MainCtrl',  ['$scope','mapLoaderService','PathAnimationService','settings','$interval',function ($scope,mapLoaderService,PathAnimationService,settings,$interval) {
  		
  		  $scope.forwardSpeedX = 0; 
        $scope.maxSpeed = settings.maxSpeed;
        $scope.minSpeed = settings.minSpeed;
        $scope.dynamicSpeed = true;

        mapLoaderService.Bakerloo_Line(function(svg){

          var paths =  $('#lines path').get();

          // when forwardSpeedX value change, rebuild the animation
          $scope.$watch('forwardSpeedX',function(){
            $scope.duration = settings.duration / ($scope.forwardSpeedX || 1)  ;
            $scope.delay = settings.delay / ($scope.forwardSpeedX || 1) ;
            resetAnimation();
            startAnimation();
          })

          // Optional requirement from task
          $scope.changeConstantSpeed = function(){
              resetAnimation();
              startAnimation();
          };

          // Create train element, and start animation
          var startTrainService = function (reverse){
                var train = svg.append("circle");
                train.attr("id",'train')
                .style("visibility", "hidden")
                .attr("r",10);
                if (reverse === true)
                {
                  train.attr("class","reverse");
                }
                
                PathAnimationService.start(train,paths,$scope,reverse);
          }

          startAnimation();


          var startFromHeathrow,startFromElephant;


          function startAnimation(){
            startTrainService(true);
            startFromElephant =  $interval(function(){
              startTrainService(true);
            },$scope.duration);

            if ($scope.dynamicSpeed == true){

              startTrainService(false);
                   startFromHeathrow=  $interval(function(){
                    startTrainService(false);
                  },$scope.duration);

              }
          }


          function resetAnimation(){
            $interval.cancel(startFromElephant);
            $interval.cancel(startFromHeathrow);
            d3.selectAll("circle#train").remove();
          }


        });

    }])