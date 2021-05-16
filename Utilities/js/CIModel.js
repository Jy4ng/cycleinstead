//Cycle Instead Model
//# sourceURL=./Utilities/js/CIModel2.js
function getViewModel(){
    var cycleInsteadViewModel = kendo.observable({
        gpsActive: true,
        gpsFollow: false,
        gpsAccuracy: null,
        gpsStartUp: true,
        onGPSChange: function(){
            if (this.get("gpsActive")) {
                //map.getLayer("gpsLayer").show();
                setWatch();
            }
            else {
                //map.getLayer("gpsLayer").hide();
                clearWatch();
            }
        },
        // Choices available to user for travel
        preferenceTypes: {
            routeTypes: [{
                id: "quietest",
                name: "Low Traffic"
            }, {
                id: "maximisepaths",
                name: "Maximise Paths"
            }, {
                id: "fastest",
                name: "Fastest"
            }],
            averageSpeeds: [5, 10, 15, 20, 25, 30, 35, 40, 45],
            maxGradients: ["", 2, 4, 6, 8, 10, 12, 14]
        },
        // default preferences
        preferences: {
            routeType: "quietest",
            averageSpeed: 20,
            maxGradient: "",
            travelUnsealed: false
        },
        restrictions: ["oneway", "RestrictionUnsealed"],
        // array of stops - maximim 5 . Stop is esri geometry point with attributes (name, index)
        stops: [],
        // last solved route is a list of stops and user preferences.
        lastSolvedRoute: null,
        // saved routes is a list of routes (route is a list of stops + user preferences + name)
        savedRoutes: [],
        //home location is a stop (esri geometry point)
        homeLocation: [],
        // favourite locations is a list of stops (stop - esri geometry point)
        favouriteLocations: [],
        //
        activeDynamicLayers: [],
        POI: [],
        POIVisibleLayers: [],
        cycleLayers: [],
        cycleVisibleLayers: [],
        setLayerVis: function(){
            var arr = $.map(this.get("POI"), function(n, i){
                if (n.visible)
                    return (n.layerId);
            });
            this.set("POIVisibleLayers", arr);
            var arr2 = $.map(this.get("cycleLayers"), function(n, i){
                if (n.visible)
                    return (n.layerId);
            });
            this.set("cycleVisibleLayers", arr2);
            return true;
        },
        suggestedRides: [],
        locatorSuggestions: [],
        addStop: function(esriPointGeometry){
            var tmpArray = this.stops.slice(0, this.stops.length)
            if (tmpArray.length < 5) {
                tmpArray.push(esriPointGeometry);
            }
            else {
                alert("Maximum of 5 stops exceeded!");
            }
            this.set("stops", tmpArray);
            this.numberStops();
        },
        removeStop: function(index){
            //console.log(index);
            if (index > -1) {
                this.stops.splice(index, 1);
            }
            this.numberStops();
        },
        updateStop: function(index, name, esriPointGeometry){
            var tmpStops = this.stops.slice(0, this.stops.length);
            tmpStops[index].attributes.name = name;
            tmpStops[index].geometry.x = esriPointGeometry.x;
            tmpStops[index].geometry.y = esriPointGeometry.y;
            this.set("stops", tmpStops);
            this.numberStops();
        },
        reorderStops: function(fromIndex, toIndex){
            this.stops.splice(toIndex, 0, this.stops.splice(fromIndex, 1)[0]);
            this.numberStops();
        },
        numberStops: function(){
            //alert("number it");
            var tmpStpArray = this.stops.slice(0, this.stops.length);
            //var stp;
            var num = 1;
            for (var i = 0; i < tmpStpArray.length; i++) {
                //for (var stp = 0; stp < tmpStpArray.length; stp++){
                tmpStpArray[i].attributes.index = num;
                tmpStpArray[i].attributes.recno = num;
                //console.log(" ///// index: " + (parseInt(stp) + parseInt("1")));
                //console.log(" ///// index: " + num);
                num = num + 1;
            }
            //console.log("tmpStpArray");
            //console.log(tmpStpArray);
            this.set("stops", tmpStpArray);
            //this.stops = tmpStpArray;
        },
        getJsonStops: function(){
            return this.stops.slice(0, this.stops.length);
        },
        addFavouriteLocation: function(esriPointGeometry){
            if (this.favouriteLocations.length < 10) {
                this.favouriteLocations.push(esriPointGeometry);
                //var tmpArray = this.favouriteLocations.slice(0, this.favouriteLocations.length);
                this.numberFavouriteLocations();
            }
            else {
                alert("Maximum of 10 favourites exceeded");
            }
        },
        removeFavouriteLocation: function(index){
            if (index > -1) {
                this.favouriteLocations.splice(index, 1);
                this.numberFavouriteLocations();
            }
        },
        numberFavouriteLocations: function(){
            var tmpArray = this.favouriteLocations.slice(0, this.favouriteLocations.length);
            for (var i = 0; i < tmpArray.length; i++) {
                tmpArray[i].attributes.index = i + 1;
            }
            this.set("favouriteLocations", tmpArray);
            this.saveToStorage("favouriteLocations", this.favouriteLocations);
        },
        addHomeLocation: function(esriPointGeometry){
            this.homeLocation.splice(0, this.homeLocation.length);
            this.homeLocation.push(esriPointGeometry);
            if (typeof(Storage) != "undefined") {
                this.saveToStorage("homeLocation", this.homeLocation)
            }
            else {
                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toGMTString();
                document.cookie = "homeLocation=[" + JSON.stringify(this.homeLocation) + "]; " + expires;
            }
            //console.log("storage - homeLocation");
            //console.log(localStorage.getItem("homeLocation"));
        },
        removeHomeLocation: function(){
            this.homeLocation.splice(0, 1);
        },
        removeSavedRoute: function(index){
            if (index > -1) {
                this.savedRoutes.splice(index, 1);
                this.saveToStorage("savedRoutes", this.savedRoutes);
            }
        },
        removeFavouriteRoute: function(index){
            if (index > -1) {
                this.savedRoutes.splice(index, 1);
                this.numberRoutes();
            }
        },
        favouritesVisble: function(){
            if (this.get("savedRoutes").length > 0 || this.get("favouriteLocations").length > 0) {
                return true;
            }
            else {
                return false;
            }
        },
        populate: function(){
            if (typeof(Storage) != "undefined") {
                if (localStorage.getItem("favouriteLocations")) {
                    var savedData = JSON.parse(localStorage.getItem("favouriteLocations"));
                    //console.log("%%% favourites");
                    //console.log(savedData);
                    for (var i = 0; i < savedData.length; i++) {
                        this.favouriteLocations.push(savedData[i]);
                    }
                    //if (savedData) this.set("favouriteLocations",savedData);
                }
                if (localStorage.getItem("homeLocation")) {
                    var savedData = JSON.parse(localStorage.getItem("homeLocation"));
                    //console.log(" %%%% home")
                    /*console.log(savedData);
                     console.log(Array.isArray(savedData));
                     console.log(savedData[0]);
                     */
                    if (savedData) {
                        this.homeLocation.push(savedData[0]);
                    }
                    console.log("finished home");
                }
                if (localStorage.getItem("savedRoutes")) {
                    var savedData = JSON.parse(localStorage.getItem("savedRoutes"));
                    if (savedData)
                        this.set("savedRoutes", savedData);
                }
                if (localStorage.getItem("lastSolvedRoute")) {
                    var savedData = JSON.parse(localStorage.getItem("lastSolvedRoute"));
                    if (savedData)
                        this.set("lastSolvedRoute", savedData);
                }
            }
            else {
                console.log("no Local Storage");
            }
        },
        saveRoute: function(){
            if (this.stops.length > 1) {
                var route = {};
                var name = "";
                var stpArray = this.stops.slice(0, this.stops.length);
                for (var i = 0; i < stpArray.length; i++) {
                    if (i == 0) {
                        name += "From: " + stpArray[i].attributes.name;
                    }
                    else
                        if (i == (stpArray.length - 1)) {
                            name += " - To: " + stpArray[i].attributes.name;
                        }
                        else {
                            name += " - Via: " + stpArray[i].attributes.name;
                        }
                }
                route.stops = this.stops.slice(0, this.stops.length);
                route.preferences = this.preferences;
                route.name = name;
                route.index = null;
                this.savedRoutes.push(route);
                this.numberRoutes();
                //this.saveToStorage("savedRoutes", this.savedRoutes);
            }
            else {
                alert("Minimum 2 stops required to save a trip");
            }
        },
        saveLastRoute: function(){
            var route = {};
            route.stops = this.stops;
            route.preferences = this.preferences;
            route.name = name;
            this.lastSolvedRoute = route;
            if (typeof(Storage) != "undefined") {
                this.saveToStorage("lastSolvedRoute", this.lastSolvedRoute);
            }
            else {
                var d = new Date();
                d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toGMTString();
                document.cookie = "lastSolvedRoute" + "=" + JSON.stringify(this.lastSolvedRoute) + "; " + expires;
            }
        },
        numberRoutes: function(){
            var tmpArray = this.savedRoutes.slice(0, this.savedRoutes.length);
            for (var i = 0; i < tmpArray.length; i++) {
                tmpArray[i].index = i + 1;
            }
            this.set("savedRoutes", tmpArray);
            this.saveToStorage("savedRoutes", this.savedRoutes);
        },
        saveToStorage: function(key, valueObject){
            if (typeof(Storage) != "undefined") {
                localStorage.setItem(key, JSON.stringify(valueObject));
            }
        },
        changeRestrictions: function(obj){
            //console.log(this.preferences.travelUnsealed);
            //console.log(obj);
            this.set("restrictions", ["oneway"]);
            if (!this.preferences.travelUnsealed)
                this.restrictions.push("RestrictionUnsealed");
            if (this.preferences.maxGradient === 0)
                this.preferences.maxGradient = "";
            if (!isNaN(parseInt(this.preferences.maxGradient))) {
                this.restrictions.push("RestrictionMax" + this.preferences.maxGradient);
            }
            //call the route solve function. User sets the name of this function
            this.routeSolveFunction();
        },
        routeSolveFunction: null,
        resetItem: function(obj){
            var param = obj.sender.element["0"].dataset.parameter;
            //console.log(param);
            tmpVal = this.get(param);
            this.set(param, tmpVal);
        }
    });
    return cycleInsteadViewModel;
}
