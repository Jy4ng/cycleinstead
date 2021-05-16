routePanel = {};

routePanel.init = function(){

    require(["esri/SpatialReference", "esri/geometry/Point"], function(SpatialReference, Point){

        routePanel.setup = function(){
            //# sourceURL=widgets/routePanel/js/routePanel.js
            routePanel.loadCSS("widgets/routePanel/css/routePanel.css");

            $('#routePanelDiv').load('widgets/routePanel/routePanel.html', function(response, status, xhr){

                if (status === "error") {
                    console.log("error loading routePanel" + xhr.status + " | " + xhr.statusText + " | " + status);
                }

                //no usefull data bindings for Bootstrap button, so events connected through jquery
                // $('.btn').button();
                $("#unsealedButton").click(function(){
                    if (Main.viewModel.restrictions.length === 1 && Main.viewModel.restrictions[0] === "oneway") {
                        $("#unsealedButtonText").text("No");
                        Main.viewModel.set("restrictions", ["oneway", "RestrictionUnsealed"]);
                        routing.routeSolve();
                    }
                    else {
                        $("#unsealedButtonText").text("Yes");
                        Main.viewModel.set("restrictions", ["oneway"]);
                        routing.routeSolve();
                    }
                });

                $(".routeOptions").change(function(){
                    //this change happens before the new binding happens, so wait
                    setTimeout(function(){
                        routing.routeSolve();
                    }, 500);
                });

                $("#printRouteButton").click(function(){
                    $("#printingRouteTile").show(300).css("display", "table");
                    try {
                        //map.setExtent(Main.mapHelpers.getGraphicsExtent(CIMobile.mapHelpers.featureLayer.graphics), true)
                        var t = routing.route.routeResults[0].route.geometry;
                        var ext = t.getExtent();
                        map.setExtent(ext, true);
                    }
                    catch (e) {
                        var r = e;
                    }
                    setTimeout(function(){
                        print.printMap();
                    }, 1000);
                });

                $("#exportRouteButton").click(function(){
                    exporter.gpx();
                });

                $("#routeDetailsToggleButton").click(function(){
                    //$("#directionsListView").toggle(300);
                    $("#detailsDiv").toggle(300);
                    elevation.showRideProfile();
                    $("#routeOptionsDiv").hide(300);
                    map.infoWindow.hide();
                     $("#routeOptionsToggleButton").removeClass("active");
                });

                $("#routeOptionsToggleButton").click(function(){
                    $("#routeOptionsDiv").toggle(300);
                    $("#detailsDiv").hide(300);
                });

                $("#favouriteRouteButton").on("click", function(){
                    $("#zeroRoutesFavouritesLabel").hide();
                    Main.viewModel.saveRoute();
                    $('#favouritesButton').popover('show');
                    setTimeout(function(){
                        $('#favouritesButton').popover('hide');
                    }, 1000);
                });

                kendo.bind(".routeOptions", Main.viewModel);

                $("#speedSlider").data("kendoSlider").bind("change", function(e){
                    console.log("slider changed : " + e);
                    routing.route.setRouteSummary(Main.viewModel.preferences.averageSpeed, Main.viewModel.stops.slice(0, Main.viewModel.stops.length));
                });


                $.ajax({
                    url: "Utilities/js/routeHelpers.js",
                    success: function(){
                        routing.route = getRoute();
                        kendo.bind($("#directionsListView"), routing.route.viewModel);
                        kendo.bind("#directionsListSummary", routing.route.viewModel);
                        kendo.bind("#directionsListDetails", routing.route.viewModel);

                        $("#directionsListView").on('click mouseover', ".directionLink", function(event){
                            var recordNumber = event.target.id.replace("directionID", "");
                            routePanel.directionClick(recordNumber);
                        });

                        elevation.init();

                    },
                    dataType: "script",
                    error: function(xhr, textStatus, errorStatus){
                        console.log("script failed to load - URL " + url + " , error" + xhr + " : " + textStatus + " | " + errorStatus);
                    }
                });
                $('.routeTooltip').tooltip();
            });
        };

        routePanel.toggleMETInfo = function(){
            $("#carbonMETinfo").toggle();
        };

        routePanel.directionClick = function(recordNumber){
            map.infoWindow.hide();
            var index = parseInt(recordNumber, 10) - 1;
            //console.log(obj.dataItem.attributes.index);
            //console.log(obj.dataItem.index);
            var dir = routing.route.routeResults[0].directions.features[index];
            var pnt = dir.geometry.paths[0][0];
            var atts = dir.attributes;
            var point = new Point(pnt[0], pnt[1]);
            map.infoWindow.resize(150, 75);
            map.infoWindow.setContent(atts.text);
            map.infoWindow.show(point);
            setTimeout(function(){
                map.centerAndZoom([pnt[0], pnt[1]], 17);
                //map.panRight();
            }, 500);
            console.log(dir);
        };

    });
    routePanel.setup();
};



routePanel.loadCSS = function(url){
    //    console.log(document.getElementsByTagName("head")[0]);
    var e = document.createElement("link");
    e.href = url;
    e.type = "text/css";
    e.rel = "stylesheet";
    e.media = "screen";
    document.getElementsByTagName("head")[0].appendChild(e);
};
