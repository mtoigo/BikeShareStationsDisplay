var hugeDCTV = angular.module('hugeDCTV', []);

hugeDCTV.constant('appConfig', {
  bikeshareXMLFeed: '/bikeshare/bikeStations.xml',
  officeLocation: {
    lat: Math.abs(38.9072561),
    lon: Math.abs(-77.0238183)
  },
  refreshIntervalMinutes: 3
});


hugeDCTV.controller('bikeshare',  ['$scope' , '$http', 'appConfig', function($scope, $http, appConfig) {
  
  var updateStations = function() {

    console.log('Updating bikeshare stations');

    $http({method: 'GET', url: appConfig.bikeshareXMLFeed}).
      success(function(data, status, headers, config) {

        var parser = new DOMParser();
        var stationFeed = parser.parseFromString(data, "text/xml");
        var stationList = stationFeed.getElementsByTagName("station");

        var extractFromXML = function(keyName, position) {
          return stationFeed.getElementsByTagName(keyName)[position].childNodes[0].nodeValue;
        };

        $scope.stations = [];
        for (var i = 0;i < stationList.length; i++) {

          var stationLat = extractFromXML('lat', i);
          var stationLon = extractFromXML('long', i);

          var bikes = parseInt(extractFromXML('nbBikes', i));
          var totalBikes = bikes + parseInt(extractFromXML('nbEmptyDocks', i));

          var station = {
            name: extractFromXML('name', i),
            bikes: bikes,
            totalBikes: totalBikes,
            percent: Math.round((bikes / totalBikes) * 100) + '%',
            distance: Math.sqrt((Math.abs(appConfig.officeLocation.lat - stationLat)) + (Math.abs(appConfig.officeLocation.lon - Math.abs(stationLon))))
          };
          $scope.stations.push(station);
        }
        $scope.stations = _.sortBy($scope.stations, function(station) { return station.distance; }).slice(0, 10);
      });
  }

  updateStations();
  setInterval(updateStations, appConfig.refreshIntervalMinutes * 1000 * 60);
}]);

hugeDCTV.controller('metro',  ['$scope' , '$http', 'appConfig', function($scope, $http, appConfig) {
  // http://api.wmata.com/StationPrediction.svc/json/GetPrediction/E01?api_key=kfgpmgvfgacx98de9q3xazww
  console.log('metro controller');
}]);