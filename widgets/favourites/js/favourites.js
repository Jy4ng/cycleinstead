favourites = {};

favourites.init = function(){
    require(["esri/geometry/webMercatorUtils", "esri/geometry/Point", "dojo/has", "esri/SpatialReference"], function(webMercatorUtils, Point, dojoHas, SpatialReference){

        favourites.setup = function(){
            //# sourceURL=widgets/favourites/js/favourites.js
            favourites.loadCSS("widgets/favourites/css/favourites.css");
            //add some IE support instead of text-hovers
            if (dojoHas("ie") <= 9) {
                favourites.loadCSS("widgets/favourites/css/favouritesIE.css");
            }
            $('#favouritesDiv').load('widgets/favourites/favourites.html', function(response, status, xhr){

                if (status === "error") {
                    console.log("error loading favourites" + xhr.status + " | " + xhr.statusText + " | " + status);
                }

                kendo.bind($("#favouriteStopsList"), Main.viewModel);
                kendo.bind($("#favouriteRoutesList"), Main.viewModel);
                kendo.bind($("#recommendedRidesList"), Main.viewModel);


                if (Main.viewModel.favouriteLocations.length > 0) {
                    $("#zeroStopsFavouritesLabel").hide();
                }
                if (Main.viewModel.savedRoutes.length > 0) {
                    $("#zeroRoutesFavouritesLabel").hide();
                }

                $('#favouritesDiv a').on('click', function(e){
                    e.preventDefault();
                    $(this).tab('show');
                });

                $("#favouritesButton").on('click', function(e){
                    e.stopPropagation();
                    pageslide.open();

                    $('#favouritesTab a[href="#favouritesDiv"]').tab('show'); // Select tab by name
                });

                $("#ridesToggleHeader").on('click', function(){
                    var rrList = $("#recommendedRidesList");
                    if (rrList.is(":visible")) {
                        $("#openRecRidesButton").attr('class', 'km-icon-down-open-big');
                        $("#recommendedRidesList").hide(300);
                    }
                    else {
                        $("#openRecRidesButton").attr('class', 'km-icon-up-open-big');
                        $("#recommendedRidesList").show(300);
                    }
                });

                //                $("#layersAccordion").click(function(e){
                //                    console.log("clicked layers accordion");
                //                    e.stopPropagation();
                //                });
                //
                //                $("#optionsDiv").click(function(e){
                //                    console.log("clicked Options div");
                //            //
                //                });

                //                $("#pageSlide").click(function(e){
                //                    //e.stopPropagation();
                //                });

                // Close the pageslide if the document is clicked or the users presses the ESC key, unless the pageslide is modal
                //                $("#mapDiv").bind('click keyup', function(e){
                //                    // If this is a keyup event, let's see if it's an ESC key
                //                    if (e.type == "keyup" && e.keyCode != 27) {
                //                        return;
                //                    }
                //                pageslide.close()
                //                });

                $('#favouritesButton').popover({
                    placement: 'bottom',
                    content: 'favourite added',
                    trigger: 'manual'
                });
            });
        };

        favourites.stopClick = function(index){
            var stp = Main.viewModel.favouriteLocations[index - 1];

            var geom = webMercatorUtils.geographicToWebMercator(new Point(stp.geometry.x, stp.geometry.y, new SpatialReference({
                wkid: 4326
            })));

            if (Main.viewModel.stops.length < 5) {
                search.addStopGraphic(geom, Main.viewModel.stops.length + 1);
            }

            locationList.createTile(stp.attributes, geom);
            Main.viewModel.numberStops();

            //CIMobile.mapHelpers.setFeatures(CIMobile.viewModel.getJsonStops());
            map.setExtent(Main.getGraphicsExtent(Main.stopsGraphicsLayer.graphics), true);
            if (Main.viewModel.getJsonStops().length > 1) {
                routing.routeSolve();
            }
        };

        favourites.recommendedRideClick = function(index){
            var rt = Main.viewModel.suggestedRides[index - 1];
            Main.viewModel.set("stops", rt.stops);
            Main.viewModel.set("preferences", rt.preferences);
            Main.viewModel.numberStops();
            Main.addStopsGraphics(Main.viewModel.getJsonStops());
            map.setExtent(Main.getGraphicsExtent(Main.stopsGraphicsLayer.graphics), true);
            routing.routeSolve();
        };

        favourites.routeClick = function(index){
            var rt = Main.viewModel.savedRoutes[index - 1];
            Main.viewModel.set("stops", rt.stops);
            Main.viewModel.set("preferences", rt.preferences);
            Main.viewModel.numberStops();
            Main.addStopsGraphics(Main.viewModel.getJsonStops());
            map.setExtent(Main.getGraphicsExtent(Main.stopsGraphicsLayer.graphics), true);
            routing.routeSolve();
        };

        favourites.removeFavouriteLocation = function(index){
            index--;
            if (index > -1) {
                Main.viewModel.removeFavouriteLocation(index);
            }
            if (index === 0) {
                $("#zeroStopsFavouritesLabel").show();
            }
            //            if (index > -1) {
            //                Main.viewModel.favouriteLocations.splice(index, 1);
            //            }
        };

        favourites.removeFavouriteRoute = function(index){
            index--;
            if (index > -1) {
                Main.viewModel.removeFavouriteRoute(index);
            }
            if (index === 0) {
                $("#zeroRoutesFavouritesLabel").show();
            }
        };

        favourites.addFavouriteStop = function(index){
            var pt = Main.viewModel.stops[index - 1];
            var noMatch = true;
            for (var i = 0; i < Main.viewModel.favouriteLocations.length; i++) {
                if (Main.viewModel.favouriteLocations[i].geometry === pt.geometry) {
                    noMatch = false;
                }
            }
            if (noMatch) {
                Main.viewModel.addFavouriteLocation(pt);
                $('#favouritesButton').popover('show');
                $("#zeroStopsFavouritesLabel").hide();
                setTimeout(function(){
                    $('#favouritesButton').popover('hide');
                }, 3000);
                return;
            }
        };

        favourites.loadCSS = function(url){
            //    console.log(document.getElementsByTagName("head")[0]);
            var e = document.createElement("link");
            e.href = url;
            e.type = "text/css";
            e.rel = "stylesheet";
            e.media = "screen";
            document.getElementsByTagName("head")[0].appendChild(e);
        };
        favourites.setup();
    });
};
