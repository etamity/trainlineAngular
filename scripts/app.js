'use strict';
/**
 * Create by Joey Etamity 
 * Date: 23/07/2016
 */
window.app = angular
  .module('trainSimApp', ['ngRoute'])
    // Default settings
  .factory('settings', function() {
      return {
        delay: 30 * 1000, // stop 30 Seconds at every station
        duration: 3 * 60 * 1000, //  train dispature in every 3 minutes,
        maxSpeed: 40,    //  default maximun train speed 40mph
        minSpeed: 20, //  default minimun train speed 20mph
        forwardSpeedX: 10  // fast forward speed
      }
  })
  .service('mapLoaderService',function(){

     // Bakerloo Line map loader
     this.Bakerloo_Line = function(callback){
          d3.xml("/images/Bakerloo_Line.svg").mimeType("image/svg+xml").get(function(error, svg) {
             $("#mapDiv").append(svg.documentElement);
             var svgDom = d3.select('svg');
              callback(svgDom);
            });
           
         }
      // Piccadilly Line map loader
     this.Piccadilly_Line = function (callback){

     }

    // Central Line map loader
     this.Central_Line = function (callback){

     }
  })
  .service('PathAnimationService', function(){
      //Get path start point for placing marker
      var PathAnimation = function(marker,paths,settings,reverse,onFinished){

            var self = this;

            this.pathStartPoint = function (path) {
                var d = path.attr("d"),
                dsplitted = d.split(" ");
                return dsplitted[1].split(",");
              }

            function endTransition(){

              // do some callback when train stop at station
                if (self.onComplete){
                    self.onComplete();
                }
              var nextNode = self.reverse === true ? self.currentNode.previousElementSibling: self.currentNode.nextElementSibling;
               if (nextNode)
                {
                  self.currentNode = nextNode;
                  self.transition(d3.select(self.currentNode));
               }else{

                  self.marker.remove();
               }
            }


            this.transition = function (path, delay ) {
                var l = path.node().getTotalLength();
             
                var realLength = l * 10000 ; // not real sure about the SVG scale factor, so temporary set to 1:10000

                var getSpeed = function (l){

                  var maxSpeed = 20 * l / 100;  // ((40mph - 20mph) * length / 100) mph

                  var speed =  settings.minSpeed + maxSpeed;  //  20mph + maxSpeed

                  speed = speed > 40 ? 40 : speed;  //  limit speed between 20mph - 40mph

                  return settings.constantSpeed ? settings.maxSpeed : speed;
                }                
                var speed =  getSpeed(l) ;
          
                this.duration = realLength / speed / (settings.forwardSpeedX || 1)  ;

                this.marker.transition()
                    .duration( this.duration )
                    .delay(delay || this.delay)
                    .attrTween("transform", this.translateAlong(path.node()))
                    .on("start",function(){
                        self.marker.style("visibility", "visible")
                    })
                    .on("end", endTransition);// infinite loop

              }
            

            this.translateAlong = function (path) {
                var l = path.getTotalLength();
                return function(i) {
                  return function(t) {
                      var p = self.reverse === true ? path.getPointAtLength(l - t - t * l) : path.getPointAtLength(t * l);
                      var centerX = p.x - 5 - 122;  // lines offset 122
                      var centerY = p.y - 5 ;
                    return "translate(" + centerX + "," + centerY + ")";   //Move marker
                  }
                }
              }

            this.reverse = reverse;
            var path = d3.select(paths[0]);
            this.currentNode = paths[0];

        
            var startPoint = this.pathStartPoint(path);
            this.marker = marker;
            this.onComplete = onFinished;
            this.delay = settings.delay;
            this.marker.attr("transform", "translate(" + startPoint + ")");

            this.transition(path,1);
      };

      this.start = function (marker,paths,settings,reverse,onFinished){
            var pathsArr = paths.slice();
            if (reverse === true ){
               pathsArr = pathsArr.reverse();
            }
            // start animation
            var animation = new PathAnimation(marker,pathsArr,settings,reverse,onFinished);
        
      }

      return this;
  })
  .config(function($routeProvider, $locationProvider){

        $routeProvider
            .when('/', {templateUrl: 'views/main.html',controller: 'MainCtrl'})
            .otherwise({ redirectTo: '/'});

            // remove the # from the url
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
          });

  });

