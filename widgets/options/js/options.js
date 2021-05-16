options = {};

options.init = function(){
    //# sourceURL=widgets/options/js/options.js
    options.loadCSS("widgets/options/css/options.css");

    $('#optionsDiv').load('widgets/options/options.html', function(response, status, xhr){

        if (status === "error") {
            console.log("error loading options" + xhr.status + " | " + xhr.statusText + " | " + status);
        }

        $('#optionsDiv a').click(function(e){
            e.preventDefault();
            $(this).tab('show');
        });

        var t = $("#optionsButton");

        $("#optionsButton").click(function(e){
            e.stopPropagation();
            pageslide.open();
            $('#optionsTab a[href="#optionsDiv"]').tab('show'); // Select tab by name
        });

        $(".basemapButton").click(function(e){
            options.changeBasemap($(this).text().trim());
        });

        options.populateLegend(CI.properties.DataDynamicUrl + "/legend");

        $("#layerBtnShowPOI").click(function(){
            if ($("#layerBadgePOIShow").text() === "Yes") {
                $("#layerBadgePOIShow").text("No");
            }
            else {
                $("#layerBadgePOIShow").text("Yes");
            }
            options.updateDisplayLayers();
        });

        map.on("zoom-end", function(z){
            options.updateTransparency(z.level);
            options.updateDisplayLayers();
        });

        kendo.bind($("#cycleLayersList"), Main.viewModel);
        kendo.bind($("#poiLayersList"), Main.viewModel);
    });
};

options.updateTransparency = function(z){
    if (z > 15) {
        Main.ciDynamicLayers.setOpacity(0.8);
    }
    else
        if (z > 11) {
            Main.ciDynamicLayers.setOpacity(0.6);
        }
        else
            if (z > 8) {
                Main.ciDynamicLayers.setOpacity(0.4);
            }
};

options.getDistinctArray = function(arr){
    var dups = {};
    return arr.filter(function(el){
        var hash = el.valueOf();
        var isDup = dups[hash];
        dups[hash] = true;
        return !isDup;
    });
};

options.layersOn = [];
options.updateDisplayLayers = function(){
    var visibleLayerIds = Main.ciDynamicLayers.visibleLayers;
    var newLayers = [];
    var switchPOI = $("#layerBadgePOIShow").text();
    var level = map.getLevel();

    if (level < 16) {
        $("#layerBtn2").addClass("disabled");
        $("#layerBtn2").removeClass("active");
        if ($("#layerBadge2").text() === "On") {
            options.layersOn.push(2);
        }
        $("#layerBadge2").text("Off");
    }
    else {
        for (var k = 0; k < options.layersOn.length; k++) {
            var id = "#layerBadge" + options.layersOn[k];
            var t = $(id).text("On");
            $("#layerBadge" + options.layersOn[k]).text("On");
            $("#layerBtn" + options.layersOn[k]).addClass("active");
            options.layersOn.splice(k, 1);
            k--;
        }
        $("#layerBtn2").removeClass("disabled");
    }

    $(".countBadge").each(function(index, element){
        if ($(this).text() === "On") {
            //add current id to temp layer, which then gets joined to visible layers
            var currentId = $(this).attr('id');
            currentId = currentId.replace("layerBadge", "");
            currentId = parseInt(currentId, 10);
            newLayers.push(currentId);
        }
    });

    console.log("level: " + level);
    if (level > 14 && switchPOI === "Yes") {
        console.log("turned on POI layers");
        var arr = $.map(options.POI, function(n, i){
            return (n.layerId);
        });
        console.log(arr);
        var newVisLayers = arr.concat(newLayers);
        newVisLayers = options.getDistinctArray(newVisLayers);
        Main.ciDynamicLayers.setVisibleLayers(newVisLayers);
    }
    else {
        console.log("turned on specific layers");
        Main.ciDynamicLayers.setVisibleLayers(newLayers);
    }

};

options.addBikeDirectLayer = function(){
    //    var visibleLayerIds = Main.ciDynamicLayers.visibleLayers;
    //    var newLayers = [options.cycleLayers[0].layerId];
    //    var newVisLayers = visibleLayerIds.concat(newLayers);
    //    newVisLayers = options.getDistinctArray(newVisLayers);
    //    Main.ciDynamicLayers.setVisibleLayers(newVisLayers);

    var id = options.cycleLayers[0].layerId;

    if ($("#layerBadge" + id).text() === "Off") {
        $("#layerBadge" + id).text("On");
    }

    options.updateDisplayLayers();



};

options.changeBasemap = function(baseMap){
    if (baseMap === "Road") {
        Main.streetBasemap.show();
        Main.imageryBasemap.hide();
        Main.imageryLabelsBasemap.hide();
        Main.topographicBasemap.hide();
    }
    else
        if (baseMap === "Satellite") {
            Main.streetBasemap.hide();
            Main.imageryBasemap.show();
            Main.imageryLabelsBasemap.show();
            Main.topographicBasemap.hide();
        }
        else {
            Main.streetBasemap.hide();
            Main.imageryBasemap.hide();
            Main.imageryLabelsBasemap.hide();
            Main.topographicBasemap.show();
        }
};

options.legend = [];
options.POI = [];
options.cycleLayers = [];
options.visibleLayers = [];

options.populateLegend = function(url){
    $.getJSON(url + "?f=json&callback=?", function(resp){
        console.log("response");
        console.log(resp);
        options.legend = resp.layers;
        //, "Suggested Rides"
        var searchArray = ["Bikedirect Network"];
        var notIncluded = ["Suggested Rides"];
        for (var i = 0; i < resp.layers.length; i++) {
            var ln = resp.layers[i].layerName.toLowerCase();
            resp.layers[i].visible = false;
            if ($.inArray(resp.layers[i].layerName, searchArray) > -1) {
                options.cycleLayers.push(resp.layers[i]);
            }
            else {
                if ($.inArray(resp.layers[i].layerName, notIncluded) === -1) {
                    options.POI.push(resp.layers[i]);
                }
            }
        }
        Main.viewModel.set("POI", options.POI);
        Main.viewModel.set("cycleLayers", options.cycleLayers);

        $(".btnLayer").on("click", function(evt){

            var id = $(this).attr('id');
            id = id.replace("layerBtn", "");
            id = parseInt(id, 10);

            if ($("#layerBadge" + id).text() === "Off") {
                $("#layerBadge" + id).text("On");
            }
            else {
                $("#layerBadge" + id).text("Off");
            }

            options.updateDisplayLayers();
        });
    });
};

options.loadCSS = function(url){
    //    console.log(document.getElementsByTagName("head")[0]);
    var e = document.createElement("link");
    e.href = url;
    e.type = "text/css";
    e.rel = "stylesheet";
    e.media = "screen";
    document.getElementsByTagName("head")[0].appendChild(e);
};
