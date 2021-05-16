routing = {};
//# sourceURL=js/routing.js
routing.init = function(){
    require(["esri/tasks/RouteParameters", "esri/tasks/RouteTask", "esri/tasks/FeatureSet", "esri/SpatialReference", "esri/units", "esri/graphic", "esri/symbols/SimpleLineSymbol", "dojo/_base/Color"], function(routeParams, RouteTask, FeatureSet, SpatialReference, units, Graphic, sls, Color){

        routing.firstSolve = true;
        routing.routeSolve = function(){
            //console.log("routeSolve");
            if (routing.firstSolve) {
                routing.firstSolve = false;
                options.addBikeDirectLayer();
            }

            $("#invalidRouteTile").hide();
            if (Main.viewModel.stops.length > 1) {
                $("#solvingRouteTile").show(300).css("display", "table");
            }
            Main.routeLayer.clear();
            if (Main.viewModel.stops.length > 1) {
                var tmpStops = Main.viewModel.stops.slice(0, Main.viewModel.stops.length);
                routing.jsonStops = tmpStops;
                //console.log("tmpStops");
                // console.log(tmpStops);
                //console.log(tmpStops2);
                routing.solveRoute(routing.routeSuccess);
            }
        };

        routing.reverseRoute = function(){
            var stps = Main.viewModel.getJsonStops();
            var stpsReverse = stps.reverse();
            Main.viewModel.set("stops", stpsReverse);
            Main.viewModel.numberStops();
            routing.routeSolve();
            Main.stopsGraphicsLayer.graphics.reverse();
            locationList.reNumberStopGraphics();
        };

        routing.clearAll = function(){
            Main.viewModel.set("stops", []);
            Main.routeLayer.clear();
            Main.stopsGraphicsLayer.clear();
            $("#routePanel").hide(300);
            $("#routeInfoPanel").hide(300);
        };

        routing.removeStop = function(obj){
            //console.log(obj);
            index = parseInt(routing.element.prop("id").replace("removeStop", ""), 10) - parseInt(1, 10);
            //console.log("index: " + index);
            Main.viewModel.removeStop(index);
            $("#stpActions" + (index + 1)).hide();
            routing.routeSolve();
        };

        routing.addFavourite = function(obj){
            //console.log(obj);
            index = parseInt(routing.element.prop("id").replace("addFavourite", ""), 10) - parseInt(1, 10);
            //console.log("index: " + index);
            var favESRI = {
                attributes: Main.viewModel.stops[index].attributes,
                geometry: Main.viewModel.stops[index].geometry
            };
            //console.log(favESRI);
            Main.viewModel.addFavouriteLocation(favESRI);
            $("#stpActions" + (index + 1)).hide();
            routing.routeSolve();
        };

        routing.addCurrentLocation = function(){
            var pos = {};
            pos.geometry = Main.geolocation.currentPositionESRIJson();
            pos.attributes = {
                name: "My Location"
            };
            Main.viewModel.addStop(pos);
            routing.routeSolve();
        };

        routing.routeSuccess = function(rt){
            if (Main.viewModel.stops.length < 2) {
                $("#routePanel").hide(300);
                $("#routeInfoPanel").hide(300);
                Main.routeLayer.clear();
                $("#solvingRouteTile").hide();
                console.log("cleared route layer - less than 2 stops");
                return;
            }
            $("#solvingRouteTile").hide();
            routing.route.routeResults = rt.result.routeResults;
            routing.route.setRouteDirections();
            routing.route.setRouteSummary(Main.viewModel.preferences.averageSpeed, Main.viewModel.stops.slice(0, Main.viewModel.stops.length));
            routing.setRouteGraphic(rt.result.routeResults[0].directions);
            elevation.showRideProfile();
        };

        routing.setRouteGraphic = function(route){
            //console.log("input route");
            //console.log(route);
            var routeGraphic = new Graphic(route.mergedGeometry, routing.routeSymbol);
            Main.routeLayer.add(routeGraphic);
            $("#solvingRouteTile").hide();
            $("#routeInfoPanel").show(300);
            $("#routePanel").show(300);
            $("#routeOptionsToggleButton").addClass("active");
            $("#routeOptionsDiv").show(300);
            $("#detailsDiv").hide(300);
        };

        routing.createElevationInputs = function(){
            var lats = [];
            var longs = [];
            var dists = [];
            var dirArray = routing.viewModel.routeDirections.slice(0, this.viewModel.routeDirections.length);
            if (dirArray.length < 21) {
                for (var i = 0; i < dirArray.length; i++) {
                    //var obj = {};
                    lats.push(parseFloat(dirArray[i].latitude));
                    longs.push(parseFloat(dirArray[i].longitude));
                    dists.push(parseFloat((dirArray[i].runningTotalNumeric / 1000).toFixed(2)));
                    /*obj.latitude = parseFloat(dirArray[i].latitude);
                     obj.longitude = parseFloat(dirArray[i].longitude);
                     obj.distance = parseFloat((dirArray[i].runningTotalNumeric / 1000).toFixed(2));
                     obj.elevation = null;*/
                }
            }
            else {
                var amount = Math.ceil(dirArray.length / 20);
                for (var j = 0; j < dirArray.length; j += amount) {
                    //var obj = {};
                    lats.push(parseFloat(dirArray[j].latitude));
                    longs.push(parseFloat(dirArray[j].longitude));
                    dists.push(parseFloat((dirArray[j].runningTotalNumeric / 1000).toFixed(2)));
                    /*obj.latitude = parseFloat(dirArray[j].latitude);
                     obj.longitude = parseFloat(dirArray[j].longitude);
                     obj.distance = parseFloat((dirArray[j].runningTotalNumeric / 1000).toFixed(2));
                     obj.elevation = null;*/
                }
            }
            routing.latitudes = lats;
            routing.longitudes = longs;
            routing.distances = dists;
        };

        routing.setup = function(){
            Main.viewModel.set("routeSolveFunction", routing.routeSolve);
            routing.networkEndPoint = CI.properties.networkUrl;
            routing.routeSymbol = new sls().setColor(new Color([209, 0, 116, 0.7])).setWidth(5);
            routing.routeParameters = null;
            routing.routeTask = null;
            routing.solvedRoute = null;
            routing.jsonStops = null;
            routing.restrictionAttributes = Main.viewModel.restrictions;
            // Set up parameters for route solve callback is the function name to be called on solve success
            routing.setRouteParameters = function(callback){
                if (!routing.routeParameters) {
                    routing.routeParameters = new routeParams();
                }
                routing.routeParameters.returnRoutes = true;
                routing.routeParameters.returnDirections = true;
                routing.routeParameters.restrictionAttributes = routing.restrictionAttributes;
                routing.routeParameters.directionsLengthUnits = units.METERS;
                routing.routeParameters.outSpatialReference = new SpatialReference({
                    wkid: 4326
                });
                routing.routeParameters.stops = new FeatureSet();
                if (!routing.routeTask) {
                    routing.routeTask = new RouteTask(routing.networkEndPoint + Main.viewModel.preferences.routeType);
                }
                var self = routing;
                routing.routeTask.on("solve-complete", function(rt){
                    //alert("solved");
                    self.solvedRoute = rt;
                    //console.log(self.solvedRoute);
                    callback(rt);
                });
                routing.routeTask.on("error", function(err){
                    console.log(err);
                    alert("route error" + err);
                });
            };

            routing.deferredRoutes = [];
            // solve the route
            routing.solveRoute = function(callback){
                var self = routing;
                routing.routeParameters.stops.features = [];
                routing.routeParameters.restrictionAttributes = Main.viewModel.get("restrictions").slice(0, Main.viewModel.get("restrictions").length);
                var networkMethod = Main.viewModel.get("preferences.routeType");
                var route = new RouteTask(routing.networkEndPoint + networkMethod);
                route.on("solve-complete", function(rt){
                    //alert("solved");
                    self.solvedRoute = rt;
                    //console.log(self.solvedRoute);
                    callback(rt);
                });
                route.on("error", function(error){
                    if (error.error.message === "Request canceled") {
                        //do nothing
                        return;
                    }
                    if (error.error.code === 400 && (error.error.details[0].indexOf("unlocated") > -1)) {
                        console.log("routing error" + error);
                        $("#solvingRouteTile").hide();
                        $("#stopOutsideNetworkTile").show(300).css("display", "table");
                        setTimeout(function(){
                            $("#stopOutsideNetworkTile").hide();
                        }, 6000);
                        locationList.deleteStop(Main.viewModel.get("stops").length);
                        return;
                    }
                    //else we assume it's a routing error
                    console.log("routing error" + error);
                    $("#solvingRouteTile").hide();
                    $("#invalidRouteTile").show(300).css("display", "table");
                    setTimeout(function(){
                        $("#invalidRouteTile").hide();
                    }, 5000);


                    //alert("Unable to find a valid route. One of your stops may not be accessible. You could also try increasing the maximum allowable gradient or allow unsealed surfaces");
                });
                console.log(routing.networkEndPoint + Main.viewModel.preferences.routeType);
                //routing.routeTask.url = routing.networkEndPoint + Main.viewModel.preferences.routeType;
                for (var i = 0; i < routing.jsonStops.length; i++) {
                    var stp = new Graphic(routing.jsonStops[i]);
                    routing.routeParameters.stops.features.push(stp);
                }
                //if there are existing routes being solved, cancel them
                for (var i = 0; i < routing.deferredRoutes.length; i++) {
                    routing.deferredRoutes[i].cancel();
                    routing.deferredRoutes.splice(i, 1);
                    console.log("**********************Cancelled a deferred routesolve******************************");
                }

                //routing.routeTask.solve(routing.routeParameters);
                var deferredRoute = route.solve(routing.routeParameters);
                routing.deferredRoutes.push(deferredRoute);
            };

            routing.setRouteParameters(routing.routeSuccess);
            //Main.viewModel.stops = testStops;
            //Main.viewModel.numberStops();
            //routing.jsonStops = Main.viewModel.stops.slice(0, Main.viewModel.stops.length);
            //routing.solveRoute(routing.routeSuccess);
        };
        routing.setup();
    });
};
