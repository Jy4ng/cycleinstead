MapNavigator = {};

//to handle correctly this needs to be 250 or below
MapNavigator.initExtent = {};
MapNavigator.ie = false;
MapNavigator.init = function(){
    require(["esri/map", "dojo/on", "esri/toolbars/navigation", "esri/symbols/PictureMarkerSymbol", "esri/graphic", "esri/geometry/webMercatorUtils", "esri/geometry/Point"], function(Map, on, Navigation, PictureMarkerSymbol, Graphic, webMercatorUtils, Point){

        MapNavigator.setup = function(){
            //@ sourceURL=widgets/MapNavigator/js/mapNavigator.js
            MapNavigator.loadCSS("widgets/MapNavigator/css/mapNavigator.css"); //dynamically load .css file
            //on(map, "load", function(){
            MapNavigator.navToolbar = new Navigation(map);
            MapNavigator.createMapNavigator();
            //});

            //        $.get('widgets/MapNavigator/mapNavigator.html', function(data){
            //            $('#mapNavigatorDiv').html(data);
            //
            //        });

        };

        MapNavigator.loadCSS = function(url){
            console.log("appending MapNavigator CSS");
            // console.log(document.getElementsByTagName("head")[0]);
            var e = document.createElement("link");
            e.href = url;
            e.type = "text/css";
            e.rel = "stylesheet";
            e.media = "screen";
            document.getElementsByTagName("head")[0].appendChild(e);
        };

        MapNavigator.createMapNavigator = function(){

            MapNavigator.initExtent = map.extent;
            MapNavigator.sliderInFocus = false;

            var levels = [];

            $.each(map.__tileInfo.lods, function(l){
                levels.push(l.level);
            });

//            $('#mapNavigatorDiv').mouseenter(function(){
//                $('#mapNavigatorDiv').fadeTo('fast', 1);
//            });
//
//            $('#mapNavigatorDiv').mouseleave(function(){
//                $('#mapNavigatorDiv').fadeTo('fast', 0.7);
//            });

            var t = $('#locateButton');


            $('#locateButton').click(function(){
                MapNavigator.getLocation();
            });
        };
        
        MapNavigator.getLocation = function(){
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(MapNavigator.locationSuccess, MapNavigator.locationError, {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000
                });
            }
            else {
                alert("Your browser doesn't support locating your position");
            }
        };

        MapNavigator.locationSuccess = function(location){
            //map.graphics.clear();
            var mapPoint = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude, location.coords.latitude));

            //search.locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(mapPoint), 100);

            var attributes = {};
            attributes.address = "My location";

            if (Main.viewModel.stops.length < 5) {
                search.addStopGraphic(mapPoint, Main.viewModel.stops.length + 1);
            }
            locationList.createTile(attributes, mapPoint);
        };

        MapNavigator.locationError = function(error){
            console.log("location error" + error);
        };
        MapNavigator.setup();
    });
};
