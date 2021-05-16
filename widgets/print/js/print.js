var print = {};
print.init = function(){
    require(["esri/tasks/PrintTask", "esri/tasks/PrintParameters", "esri/tasks/PrintTemplate", "esri/request"], function(PrintTask, PrintParameters, PrintTemplate, esriRequest){

        print.setup = function(){
            //# sourceURL=widgets/print/js/print.js
            print.printTask = new PrintTask(CI.properties.printUrl);
            print.printParams = new PrintParameters();
            print.printTemplate = new PrintTemplate();
            print.printTemplate.exportOptions = {
                width: 800,
                height: 1010,
                dpi: 96
            };
            print.printTemplate.preserveScale = false;
            print.printTemplate.format = "png32";
            print.printTemplate.layout = "MAP_ONLY";
            print.printParams.map = map;
            print.printParams.template = print.printTemplate;
        };

        print.fixUrls = function(ioArgs){
            var url = document.URL.substring(0, document.URL.indexOf('#'));
            if (url === "") {
                url = document.URL;
            }
            //ioArgs.content.Web_Map_as_JSON = ioArgs.content.Web_Map_as_JSON.replace(/widgets\/search\/images/g, url + "widgets/search/images")
			ioArgs.content.Web_Map_as_JSON = ioArgs.content.Web_Map_as_JSON.replace(/.gif/g, ".png");
            //ioArgs.content.Web_Map_as_JSON = ioArgs.content.Web_Map_as_JSON.replace(/test.maps/g, "maps");
            //ioArgs.content.Web_Map_as_JSON = ioArgs.content.Web_Map_as_JSON.replace(/mapsdev.dpti.sa.gov.au\/CycleInstead/g, "test.maps.sa.gov.au\/CycleInstead");
            return ioArgs;
        };

        print.printMap = function(){
            //esriRequest.setRequestPreCallback(print.fixUrls);
            var wmj = print.printTask._getPrintDefinition(map,print.printParams);
            wmj.exportOptions = {
                dpi:print.printTemplate.exportOptions.dpi,
                outputSize:[print.printTemplate.exportOptions.width,print.printTemplate.exportOptions.height]
            };
            wmj = JSON.stringify(wmj);
            wmj = wmj.replace(/https/g, "http");
            console.log("** WEB MAP **\n",wmj);
            //esriRequest.setRequestPreCallback(print.fixUrls);
            var data = {
                Web_Map_as_JSON:wmj,
                Format:"png32",
                f:"json",
                Layout_Template:"MAP_ONLY"
            }
            $.ajax({
                type: "POST",
                url: CI.properties.printUrl.replace(/maps.sa/g,"sdsi.sa") + "/execute",
                data: data,
                success: function(res){
                    console.log("AJAX print",res);
                    result = res.results[0].value.url;
                    var url = document.URL.substring(0, document.URL.indexOf('#'));
                    if (url === "") {
                        url = document.URL;
                    }
                    var html = "<html><head></head><body><div id=\"heading\"><h2>Cycle Instead Journey Planner Map</h2></div><img id=\"map\" alt=\"map\" src=\"" + result.replace("sdsi.", "maps.") + "\" /><br/>";
                    var details = $("#directionsListDetails").text();
                    var tmpList = $("#directionsListView").html();
                    var dList = "" + tmpList;
                    dList = dList.replace(/images/g, "" + url.replace(/https/g,"http") + "images");
                    var summ = details.substring(details.indexOf("Route from"),details.indexOf("Total Distance"));
                    html += "<div style=\"page-break-after: always\"><h3>" + summ + "</h3><br/><br/>Directions on page 2</div>";
                    //dList = dList.replace(/.gif/g, ".png");
                    html += "<div id=\"content\"><ul><div id=\"heading2\"><h4>Cycle Instead Journey Planner Directions</h4>" + details + "</ul></div>";
                    html += "<ul>" + dList + "</ul>";
                    html += "<div style=\"margin-top:15px; font-size: smaller\" id=\"carbonSaving\"><span style=\"font-weight:bold\">1. Carbon Saving</span> (by not making a car trip) is based on an estimate of average CO<sup>2</sup> (225 grams per km) across a sample of vehicles for the urban cycle (Cycle Instead Journey Planner applys to metropolitan Adelaide). Source: Adelaide Carpool website for CO2 generated per kilometre.  Calculated by Southern Cross University <a target=\"_blank\" href=\"http://www.adelaidecarpool.com.au/\">http://www.adelaidecarpool.com.au/.</a></div>";
                    html += "<div style=\"font-size: smaller\" id=\"caloriesBurned\"><span style=\"font-weight:bold\">2. Kilojules Burned</span> is based on the popular equation - <span style=\"font-style:italic;color:green\">Calories = (((METs * 3.5 * weight in kg) / 200) * duration in minutes)</span> MET is metabolic equivalent task and cycling at 5km/h has a MET of 2, 25km/h has a MET of 10 and 50km/h has a MET of 17 (approximate figures). Weight is assumed to be 75 kg. Data obtained from University of South Carolina - Prevention Research Centre.</div>";
                    //html += "</body>";
                    html += "</body><style>body {font-family: open-sans, sans-serif; font-size: 9pt;margin-left:15px}table {font-size: 100%;width: 100%; border-bottom: 1px solid silver}ul {    list-style-type: none; margin: 0px;    padding: 2px;    max-width: 700px}#content2 {page-break-before: always;position: relative;} .pull-right {  float: right !important;} #map {position: relative;} #summary {display: block; padding-bottom: 2em;}</style>";
                    html += "</html>";
                    //pWin.document.write(html);
                    html = html.replace(/test.maps/g, "maps");
                    html = html.replace(/mapsdev.dpti.sa.gov.au\/CycleInstead/g, "maps.sa.gov.au\/CycleInstead");
                    console.log(html);
                    $("#reportHtml").val(html);
                    $("#PDFForm").submit();
                    $("#printingRouteTile").hide(300);
                },
                dataType: "json"
            });

            /*print.printTask.execute(print.printParams, function(result){
                //                var pWin = window.open();
                //                pWin.document.title = "Cycle Instead Print";
                //                pWin.document.write('<link rel="stylesheet" type="text/css" href="widgets/print/css/print.css"/>');
                //                pWin.document.write("<body><img id=\"map\" src=\"" + result.url.replace("sdsi.", "maps.") + "\" /><br/>");
                //                pWin.document.write("<div id=\"content\"><ul>" + $("#directionsListDetails").html());
                //                pWin.document.write($("#directionsListView").html() + "</ul></div></body");
                //pWin.print();
                var url = document.URL.substring(0, document.URL.indexOf('#'));
                if (url === "") {
                    url = document.URL;
                }
                var html = "<html><head></head><body><div id=\"heading\"><h4>Cycle Instead Journey Planner Map</h4></div><img id=\"map\" alt=\"map\" src=\"" + result.url.replace("sdsi.", "maps.") + "\" /><br/>";
                var details = $("#directionsListDetails").text();
                var tmpList = $("#directionsListView").html();
                var dList = "" + tmpList;
                dList = dList.replace(/images/g, "" + url + "images");
                html += "<div id=\"content\"><ul><div id=\"heading2\"><h4>Cycle Instead Journey Planner Directions</h4>" + details + "</ul></div>";
                html += dList;
                html += "</body>";
                html += "</body><style>body {font-family: open-sans, sans-serif; font-size: 9pt;}table {font-size: 100%;width: 100%; border-bottom: 1px solid silver}ul {    list-style-type: none; margin: 0px;    padding: 2px;    max-width: 700px}#content {page-break-before: always;position: relative;} .pull-right {  float: right !important;} #map {position: relative;} #summary {display: block; padding-bottom: 2em;}</style>";
                html += "</html>";
                //pWin.document.write(html);
                html = html.replace(/test.maps/g, "maps");
                html = html.replace(/mapsdev.dpti.sa.gov.au\/CycleInstead/g, "test.maps.sa.gov.au\/CycleInstead");
                console.log(html);
                $("#reportHtml").val(html);
                $("#PDFForm").submit();
                $("#printingRouteTile").hide(300);
            }, function(err){
                console.log("error with print" + err);
                $("#printingRouteTile").hide(300);
            });*/
        };

        print.loadCSS = function(url){
            var e = document.createElement("link");
            e.href = url;
            e.type = "text/css";
            e.rel = "stylesheet";
            e.media = "screen";
            document.getElementsByTagName("head")[0].appendChild(e);
        };
        print.setup();
    });
};
