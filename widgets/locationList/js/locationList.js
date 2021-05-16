locationList = {};

require(["esri/symbols/PictureMarkerSymbol", "esri/geometry/webMercatorUtils"], function(PictureMarkerSymbol, webMercatorUtils){

    locationList.init = function(){
        //# sourceURL=widgets/locationList/js/locationList.js
        locationList.loadCSS("widgets/locationList/css/locationList.css");
        $('#locationListDiv').load('widgets/locationList/locationList.html', function(response, status, xhr){

            if (status === "error") {
                console.log("error loading locationList" + xhr.status + " | " + xhr.statusText + " | " + status);
            }

            kendo.bind($("#stopListView"), Main.viewModel);

            $("#stopListView").kendoSortable({
                container: $("#stopListView"),
                filter: ">div.sortable",
                axis: "y",
                cursor: "move",
                placeholder: function(element){
                    return element.clone().css("opacity", 0.3);
                },
                hint: function(element){
                    return element.clone().css("width", "500px").removeClass("k-state-selected");
                },
                change: function(e){
                    locationList.reorderList(e);
                    locationList.reNumberStopGraphics();
                }
            });

            //            $('.hoverGlow').tooltip({
            //                'placement': 'right',
            //                'trigger': 'hover',
            //                'delay': {
            //                    show: 500
            //                }
            //            });

            $(document.body).tooltip({
                'selector': "[title]",
                'placement': 'right',
                'trigger': 'hover',
                'delay': {
                    show: 1000
                }
            });
        });
    };

    locationList.showFavouriteButton = function(index){
        $(".addFavourite" + index).show(300);
        favourites.addFavouriteStop(index);
    };

    locationList.reorderList = function(e){
        //sort out stop list
        Main.viewModel.reorderStops(e.oldIndex, e.newIndex);
        //sort out the graphic
        var graphics = Main.stopsGraphicsLayer.graphics;
        var temp = graphics[e.oldIndex];
        //removes graphic from previous position
        graphics.splice(e.oldIndex, 1);
        //adds to new position
        graphics.splice(e.newIndex, 0, temp);
        $("#solvingRouteTile").show(300).css("display", "table");
        routing.routeSolve();
    };

    //    locationList.relabelList = function(){
    //        //renumber the tile label
    //        data = locationList.dataSource.data();
    //        for (var i = 0; i < data.length; i++) {
    //            data[i].attributes.index = i + 1;
    //        }
    //        locationList.dataSource.data(data);
    //    };

    locationList.deleteStop = function(index){
        Main.viewModel.removeStop(index - 1);
        Main.stopsGraphicsLayer.remove(Main.stopsGraphicsLayer.graphics[index - 1]);

        if (Main.viewModel.stops.length < 2) {
            $("#routePanel").hide(300);
            $("#routeInfoPanel").hide(300);
            Main.routeLayer.clear();
            console.log("cleared route layer - less than 2 stops");
            map.infoWindow.hide();
        }
        else {
            $("#solvingRouteTile").show().css("display", "table");
        }
        routing.routeSolve();
        locationList.reNumberStopGraphics();
    };

    locationList.reNumberStopGraphics = function(){
        for (var i = 0; i < Main.stopsGraphicsLayer.graphics.length; i++) {
            Main.stopsGraphicsLayer.graphics[i].setSymbol(new PictureMarkerSymbol({
                url: location.protocol + '//' + location.hostname.replace("test.","") + '/cycleinstead/images/markers/marker' + (i + 1) + '.png',
                contentType: "image/png",
                width: 15,
                height: 24,
                type: "esriPMS",
                yoffset: 9
            }));
        }
    };

    locationList.loadCSS = function(url){
        //    console.log(document.getElementsByTagName("head")[0]);
        var e = document.createElement("link");
        e.href = url;
        e.type = "text/css";
        e.rel = "stylesheet";
        e.media = "screen";
        document.getElementsByTagName("head")[0].appendChild(e);
    };

    locationList.createTile = function(attributes, point){

        var feature = {};
        feature.geometry = webMercatorUtils.webMercatorToGeographic(point);
        feature.attributes = attributes;

        //too many stops, don't add further stops, just create warning
        if (Main.viewModel.stops.length === 5) {

            if ($("#maxAlertsTile").is(":visible")) {
                //do nothing, warning already exists
                return;
            }

            $("#maxAlertsTile").show().css("display", "table");
            setTimeout(function(){
                $("#maxAlertsTile").hide(300);
            }, 3000);
            return;
        }
        //valid number of stops, so add a new stopTile and a new stop
        else {
            if (Main.viewModel.stops.length === 0) {
                $("#addDestinationTile").show(300);
                var destinationMessage = Main.isTouch ? "Enter a destination above or tap on the map" : "Enter a destination above or click on the map";
                $("#addLocationMessage").text(destinationMessage);
            }

            if (Main.viewModel.stops.length >= 1) {
                $("#addDestinationTile").hide(300);
            }
            //            if (address.length > 50) {
            //                stopTile.attributes.name = address.substring(0, 49) + "...";
            //            }
            //            else {
            var name = {};

            if (typeof attributes.loc_name === "POINTS_OF_INTE") {

            }

            if (typeof attributes.unitType !== "undefined" && attributes.unitType !== "" && attributes.unitNumber !== "") {
                name = attributes.unitType + " " + attributes.unitNumber + ", " + attributes.houseNumber + " " + attributes.streetName + " " + attributes.streetType + " " + attributes.streetDir + ", " + attributes.locality + ", " + attributes.postcode;
                feature.attributes = {};
                feature.attributes.name = name;
            }
            else
                if (typeof attributes.streetName !== "undefined" && attributes.streetName !== "") {
                    name = attributes.houseNumber + " " + attributes.streetName + " " + attributes.streetType + " " + attributes.streetDir + ", " + attributes.locality + ", " + attributes.postcode;
                    feature.attributes = {};
                    feature.attributes.name = name;
                }
                else
                    if (typeof attributes.Street !== "undefined" && attributes.Street !== null) {
                        name = attributes.Street + ",  " + attributes.Locality + ", " + attributes.Postcode;
                        feature.attributes = {};
                        feature.attributes.name = name;
                    }
                    else
                        if (typeof attributes.suburb !== "undefined" && attributes.suburb !== "" && typeof attributes.postcode !== "undefined" && attributes.postcode !== null) {
                            name = attributes.suburb + ", " + attributes.postcode;
                            feature.attributes = {};
                            feature.attributes.name = name;
                        }
                        else
                            if (typeof attributes.postcode !== "undefined" && attributes.postcode !== "") {
                                name = attributes.postcode;
                                feature.attributes = {};
                                feature.attributes.name = name;
                            }
                            else
                                if (typeof attributes.placeName !== "undefined" && attributes.placeName !== "") {
                                    name = attributes.placeName;
                                    feature.attributes = {};
                                    feature.attributes.name = name;
                                }
                                else {
                                    name = attributes.name || attributes.address;
                                    feature.attributes = {};
                                    feature.attributes.name = name;
                                }
            //}
            Main.viewModel.addStop(feature);
        }

        //if there are 2 or more stops, show solving route tile
        if (Main.viewModel.stops.length >= 2) {
            routing.routeSolve();
        }
    };
});
