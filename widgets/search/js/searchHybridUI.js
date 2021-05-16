// J - I suspect this is not used
//new StopMarker version

require(["esri/graphic", "esri/geometry/Point", "esri/SpatialReference", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "dojo/_base/Color", "dojox/gfx/Moveable", "dojo/on", "dojo/_base/connect", "dojo/touch", "esri/tasks/locator", "esri/geometry/webMercatorUtils"], function(Graphic, Point, SpatialReference, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Colour, Moveable, on, connect, touch, Locator, webMercatorUtils){
    search.initUI = function(){
        //# sourceURL=widgets/search/js/searchHybridUI.js
        search.loadCSS("widgets/search/css/search.css");

        $('#searchWidgetDiv').load('widgets/search/search.html', function(response, status, xhr){


            if (status === "error") {
                console.log("error loading autocomplete" + xhr.status + " | " + xhr.statusText + " | " + status);
            }

            var placeholder = "Enter location";

            //depending on user input type (enter, click, combination of both) different events fire, so need to handle all of them
            var searchBox = $("#searchInput").kendoAutoComplete({
                minLength: 3,
                delay: 100,
                height: 400,
                dataTextField: "address",
                placeholder: placeholder,
                suggest: false,
                //dataTextField: "",
                dataSource: search.dataSource,
                select: search.displayResult,
                //template: '<a href="\\#"><span class="k-content km-icon-locationMarkerHollow"></span></a>&nbsp;&nbsp; ${ data.address } &nbsp;<i><strong> ${ data.layerName }</strong></i>'
                template: '<a href="\\#"><span class="km-icon-locationMarkerHollow"></span></a><span class="text-primary">&nbsp;&nbsp; ${ data.address } &nbsp;<i> # if(typeof data.layerName !== "undefined"){# <strong> ${ data.layerName }</strong> #}# </i><span>'
            });
            $(".searchClearBox").click(function(){
                $("#searchInput").data("kendoAutoComplete").value("");
            });
            search.setupReverseGeocode();
        });

    };

    search.loadCSS = function(url){
        //    console.log(document.getElementsByTagName("head")[0]);
        var e = document.createElement("link");
        e.href = url;
        e.type = "text/css";
        e.rel = "stylesheet";
        e.media = "screen";
        document.getElementsByTagName("head")[0].appendChild(e);
    };

    search.setupReverseGeocode = function(){

        search.locator = new Locator(CI.properties.reverseGeocoderUrl);
        map.on("click", function(evt){

            //var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Colour([255, 0, 0]), 2), new Colour([255, 255, 0, 0.25]));
            //var tmpPolyGraphic = new Graphic(Main.ciBoundaryPolygon, sfs);
            //map.graphics.add(tmpPolyGraphic);

            if (Main.ciBoundaryPolygon.contains(evt.mapPoint)) {
                map.infoWindow.hide();
                $("#reverseGeocodingTile").show();
                //map.graphics.clear();
                search.locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(evt.mapPoint), 200, function(evt){
                    if (evt.address) {
                        var attributes = evt.address;

                        //this service returns geocoding results in geographic - convert to web mercator to display on map
                        // var location = webMercatorUtils.geographicToWebMercator(evt.location);
                        var point = webMercatorUtils.geographicToWebMercator(evt.location);
                        point.attributes = {};

                        if (Main.viewModel.stops.length < 5) {
                            search.addStopGraphic(point, Main.viewModel.stops.length + 1);
                        }
                        locationList.createTile(attributes, point);
                        $("#reverseGeocodingTile").hide();
                    }
                }, function(error){

                    //this service returns geocoding results in geographic - convert to web mercator to display on map
                    // var location = webMercatorUtils.geographicToWebMercator(evt.location);
                    var geogPoint = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                    var point = evt.mapPoint;

                    point.attributes = {};
                    var attributes = {};
                    attributes.name = "Latitude: " + geogPoint.y.toFixed(3) + ", Longitude: " + geogPoint.x.toFixed(3);

                    if (Main.viewModel.stops.length < 5) {
                        search.addStopGraphic(point, Main.viewModel.stops.length + 1);
                    }
                    locationList.createTile(attributes, point);
                    $("#reverseGeocodingTile").hide();
                });
            }
            else {
                console.log("outside network");
                $("#solvingRouteTile").hide();
                $("#stopOutsideNetworkTile").show(300).css("display", "table");
                setTimeout(function(){
                    $("#stopOutsideNetworkTile").hide();
                }, 5000);
                //locationList.deleteStop(Main.viewModel.get("stops").length);
                return;
            }
        });
    };

    search.displayResult = function(e){

        var autocomplete = $("#searchInput").data("kendoAutoComplete");

        //remove focus from search bar to get rid of keyboard
        setTimeout(function(){
            document.activeElement.blur();
        }, 300);

        var dataItem = this.dataItem(e.item.index());

        switch (dataItem.layerName) {
            case 'Councils':
                search.addressQuery(dataItem);
                break;
            case 'Hundreds':
                search.addressQuery(dataItem);
                break;
            case 'Postcodes':
                search.addressQuery(dataItem);
                break;
            case 'Designated Survey Areas':
                search.addressQuery(dataItem);
                break;
            case 'Suburbs':
                search.addressQuery(dataItem);
                break;
            case 'Address':
                //address search
                search.addressQuery(dataItem);
                break;
            case 'Place Name':
                //address search
                search.addressQuery(dataItem);
                break;
            default:
                search.addressQuery(dataItem);
            //console.log("Search widget did not resolve layer correctly to display results");
        }
    };

    search.createStop = function(address){
        //psuh stop to CI ViewModel
    };

    search.addStopGraphic = function(point, index){
        //var href = window.location.href.split("#")[0];
        //var url = href + 'images/markers/marker' + index + '.png';
        //var pushpin = new StopMarker(map, url, 24, 15, point, Main.stopsGraphicsLayer);
        var pushpin = new StopMarker(map, index+"", 24, 15, point, Main.stopsGraphicsLayer);
    };

    search.latLongUpdate = function(event, newIndex){
        //this service returns geocoding results in geographic - convert to web mercator to display on map
        // var location = webMercatorUtils.geographicToWebMercator(evt.location);
        var geogPoint = webMercatorUtils.webMercatorToGeographic(event.mapPoint);

        var name = "Latitude: " + geogPoint.y.toFixed(3) + ", Longitude: " + geogPoint.x.toFixed(3);

        Main.viewModel.updateStop(newIndex, name, geogPoint);
        routing.routeSolve();
    };

    search.updateGraphic = function(event, newIndex){
        search.locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(event.mapPoint), 100, function(evt){
            if (evt.address) {
                var name = evt.address.Street + ", " + evt.address.Locality + ", " + evt.address.Postcode;
                Main.viewModel.updateStop(newIndex, name, evt.location);
                routing.routeSolve();
            }
            else {
                //   search.latLongUpdate(evt);
            }
        }, function(err){
            search.latLongUpdate(event, newIndex);
        });
        //
        //        function(e, m, p){
        //            console.log("error with locator :" + e.details[0] + "," + e.message);
        //
        //            var unknownName = "Unknown location";
        //            Main.viewModel.updateStop(newIndex, unknownName, pt);
        //            routing.routeSolve();
        //        });
    };

    search.addressQuery = function(dataItem){
        var point = new Point(dataItem.location.x, dataItem.location.y, new SpatialReference({
            wkid: 3857
        }));
        point.attributes = {};

        if (Main.viewModel.stops.length < 5) {
            search.addStopGraphic(point, Main.viewModel.stops.length + 1);
        }
        setTimeout(function(){
            $("#searchInput").data("kendoAutoComplete").value("");
        }, 300);

        if (typeof dataItem.address !== "undefined") {
            dataItem.attributes.name = dataItem.address;
        }

        locationList.createTile(dataItem.attributes, point);
        map.centerAndZoom(point, CI.properties.zoomLevel);
        console.log("added geocode location");
    };
    search.initUI();
});
