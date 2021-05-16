elevation = {};
elevation.init = function(){
    //# sourceURL=widgets/elevation/js/elevation.js
    elevation.loadCSS("widgets/elevation/css/elevation.css");
};

elevation.createChart = function(seriesData, min){

    //    if ($("#elevationChart").data("kendoGrid")) {
    //        $("#elevationChart").data("kendoGrid").destroy();
    //    }
    $("#elevationChart").kendoChart({
        title: {
            text: "Elevation in Metres"
        },
        legend: {
            visible: false,
            position: "bottom"
        },
        chartArea: {
            margin: 0,
            padding: 0,
            width: (screen.width * 0.27),
            height: (screen.height * 0.2)
        },

        seriesDefaults: {
            type: "scatterLine",
            style: "smooth"
        },
        /*seriesDefaults: {
         type: "area",
         area: {
         line: {
         style: "smooth"
         }
         }
         }, */
        series: [{
            name: "E",
            data: seriesData
        }],
        xAxis: {
            mix: 0,
            labels: {
                format: "{0}Km",
                rotation: -90
            },
            title: {
                text: "Distance(km)"
            }
        },
        yAxis: {
            //max: 100,
            min: 0,
            labels: {
                format: "{0}m"
            },
            title: {
                text: "Elevation(m)"
            }
        },
        tooltip: {
            visible: true,
            format: "{1}m at {0} Kilometres"
        }
    });

    $(window).resize(function(){
        $("#elevationChart").data("kendoChart").refresh();
    });

    //    $("#elevationChart").kendoChart({
    //        categoryAxis: {
    //            field: "dt",
    //            labels: {
    //                template: "#= elevation.formatDate(value) #",
    //                step: 3,
    //                rotation: -90
    //            },
    //            axisCrossingValues: [0, 45]
    //        },
    //        series: [{
    //            field: "main.temp",
    //            name: "Temperature (&degC)",
    //            axis: "temperature",
    //            color: "#ffae00"
    //            //,
    //            //            tooltip: {
    //            //                visible: true,
    //            //                format: "{0}",
    //            //                template: "#= value #&degC"
    //            //            }
    //        }, {
    //            field: "main.humidity",
    //            name: "Humidity (%)",
    //            type: "area",
    //            axis: "humidity",
    //            color: "#007eff"
    //            //            ,
    //            //            tooltip: {
    //            //                visible: true,
    //            //                format: "{0}",
    //            //                template: "#= value #%"
    //            //            }
    //        }],
    //        seriesDefaults: {
    //            type: "line"
    //        },
    //        seriesHover: function(e){
    //            elevation.viewModel.set("currentHumidity", e.dataItem.main.humidity);
    //            elevation.viewModel.set("currentPressure", e.dataItem.main.pressure);
    //            elevation.viewModel.set("currentTemperature", e.dataItem.main.temp);
    //            elevation.viewModel.set("currentWindSpeed", e.dataItem.wind.speed);
    //            elevation.viewModel.set("currentWindDirection", e.dataItem.wind.deg);
    //            elevation.viewModel.set("currentDate", e.dataItem.dt);
    //        },
    //        dataSource: elevation.dataSource,
    //        valueAxes: [{
    //            name: "temperature",
    //            color: "#ffae00",
    //            min: 0,
    //            max: 45
    //        }, {
    //            name: "humidity",
    //            labels: {
    //                step: 2
    //            },
    //            color: "#007eff",
    //            min: 0,
    //            max: 110
    //        }]
    //    });
};

elevation.showRideProfile = function(){
    routing.route.createElevationInputs();

    //var tmpUrl = "http://api.geonames.org/srtm3JSON?username=dptigis&lats=" + routing.route.latitudes.join() + "&lngs=" + routing.route.longitudes.join();
    //var tmpUrl = "https://api.geonames.org/astergdemJSON?username=dptigis&lats=" + routing.route.latitudes.join() + "&lngs=" + routing.route.longitudes.join();
    var tmpUrl = "https://secure.geonames.org/astergdemJSON?username=dptigis&lats=" + routing.route.latitudes.join() + "&lngs=" + routing.route.longitudes.join();

    $.ajax({
        "url": tmpUrl,
        "dataType": "jsonp"
    }).done(function(data){

        var arr = [];

        for (var i = 0; i < data.geonames.length; i++) {
            arr.push(data.geonames[i].astergdem);
        }

        //console.log("geonames elevations data\n" + data);
        //console.log(arr);
        //console.log(arr2);

        //$("#rideElevationPopover").data("kendoMobileModalView").open();

        var seriesData = [];
        var minVal = 0;
        var minElev = Math.min.apply(Math, arr);
        var maxElev = Math.max.apply(Math, arr);
        if ((maxElev - minElev) < (minElev * 2)) {
            minVal = (minElev - 1);
        }
        for (var t = 0; t < arr.length; t++) {
            seriesData.push([routing.route.distances[t], arr[t]]);
        }
        console.log(seriesData);
        setTimeout(function(){
            elevation.createChart(seriesData, minVal);
        }, 500);
    }).fail(function(xhr, textStatus, errorThrown){
        console.log("error requesting elevation data: " + textStatus + " : " + errorThrown);
    });

    //        error: function(xhr, textStatus, errorThrown){
    //            console.log("error requesting elevation data: " + textStatus + " : " + errorThrown);
    //        }
    //    }

};

elevation.getForecast = function(ddY, ddX){

    $("#elevation").data("kendoWindow").open().center();

    $.ajax({
        type: "GET",
        url: "http://api.openweathermap.org/data/2.5/forecast",
        dataType: "jsonp",
        timeout: 20000,
        data: {
            //APPID: "f1a235cc2ec7717f45e0603fa83fa324",
            lat: ddY,
            lon: ddX,
            mode: "json",
            cnt: 1,
            _: 1382416108192
        },
        success: function(response){

            var data = response.list;
            for (var i = 0; i < data.length; i++) {
                data[i].main.temp = Math.round((data[i].main.temp - 273.15) * 10) / 10;
            }
            var dataSource = new kendo.data.DataSource({
                data: data
            });
            elevation.dataSource = dataSource;

            elevation.viewModel.set("cityName", response.city.name);

            elevation.initCharts();
        }
    });
};

elevation.loadCSS = function(url){
    console.log("appending elevation CSS");
    //    console.log(document.getElementsByTagName("head")[0]);
    var e = document.createElement("link");
    e.href = url;
    e.type = "text/css";
    e.rel = "stylesheet";
    e.media = "screen";
    document.getElementsByTagName("head")[0].appendChild(e);
};

elevation.handleError = function(err){
    console.log("Something broke: ", err);
};
