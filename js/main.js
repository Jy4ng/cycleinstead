
var Main = {};
var map;
Main.init = function(){
    //# sourceURL=/js/main.js
    require(["esri/map", "esri/layers/ImageParameters", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/layers/ArcGISTiledMapServiceLayer", "esri/layers/WebTiledLayer", "esri/geometry/Extent", "esri/SpatialReference", "esri/config", "esri/layers/GraphicsLayer", "dojo/has", "dojo/on", "dojo/mouse", "esri/graphicsUtils", "esri/geometry/webMercatorUtils", "esri/geometry/Point", "esri/geometry/Polygon", "esri/tasks/GeometryService", "dojo/domReady!"], function(Map, ImageParameters, ArcGISDynamicMapServiceLayer, baseTileLayer, WebTiledLayer, Extent, SpatialReference, EsriConfig, GraphicsLayer, dojoHas, on, mouse, GraphicsUtils, webMercatorUtils, Point, Polygon, GeomService){

        EsriConfig.defaults.io.corsEnabledServers.push("maps.sa.gov.au");
        EsriConfig.defaults.io.corsEnabledServers.push("location.sa.gov.au");

        Main.setup = function(){

            //used in some helper function
            String.prototype.DPTItoProperCase = function(){
                return this.replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            };


            Main.isTouch = !!('ontouchstart' in window);

            //Warn IE8 users to update
            if (dojoHas("ie") == 8) {
                setTimeout(function(){
                    Main.ie8BrowserUpdate();
                }, 2000);
            }
            if (dojoHas("ie") <= 7) {
                setTimeout(function(){
                    Main.ie7BrowserUpdate();
                }, 2000);
            }

            //browser sniff window size, but don't redirect if browser is IE.
            if ($(window).width() < 768 && !(dojoHas("ie") > 1)) {
                var referrer = document.referrer.match(/m.maps.sa.gov.au\/cycleinstead/i);
                console.log("referrer :" + referrer);
                if (referrer) {
                    //no action, user came from the Mobile site on purpose
                }
                else {
                    var result = window.confirm("This will redirect to Cycle Instead mobile site");
                    if (result) {
                        location.href = "mobile";
                    }
                }
            }

            //remove 300ms lag on mobile touch events
            $(function(){
                FastClick.attach(document.body);
            });

            //Main.getLayerNames();
            Main.viewModel = getViewModel();
            Main.viewModel.populate();
            Main.viewModel.set("suggestedRides", suggestedRides.rides.sort(suggestedRides.sortRides));

            Main.geometryService = new GeomService(CI.properties.GeometryUrl);

            //references a proxy page in case the GET request for geometry exceeds the 2000 character limit imposed by some Web browsers.
            EsriConfig.defaults.io.proxyUrl = CI.properties.proxyUrl;
            EsriConfig.defaults.io.alwaysUseProxy = false;

            Main.createMap();
            var $bar = $('#loadingBar');
            $bar.width($bar.width() + 60);

			$("#TDUCompDontShow").kendoButton({
                click: function(e){
					document.cookie = "cycleInsteadTDUComp2015=true; expires=Mon, 26 Jan 2015 00:00:00 UTC";
				}
            });
            var jqxhr = $.getJSON("Utilities/json/ciJson.json", function(){
                console.log("start loading CI boundary polygon");
            }).done(function(json){
                console.log("loaded CI boundary polygon");
                Main.ciBoundaryPolygon = new Polygon(json);
            }).fail(function(){
                console.log("error loading CI boundary polygon");
            });

        };

        Main.onResizeMap = function(e){
            //map may not have loaded via ajax yet, subsequent events should not be a problem
            if (typeof map === "object") {
                map.resize();
            }
        };

        Main.createMap = function(){
            // Define levels of detail for map
            var lods = [{
                "level": 0,
                "resolution": 156543.03392800014,
                "scale": 5.91657527591555E8
            }, {
                "level": 1,
                "resolution": 78271.51696399994,
                "scale": 2.95828763795777E8
            }, {
                "level": 2,
                "resolution": 39135.75848200009,
                "scale": 1.47914381897889E8
            }, {
                "level": 3,
                "resolution": 19567.87924099992,
                "scale": 7.3957190948944E7
            }, {
                "level": 4,
                "resolution": 9783.93962049996,
                "scale": 3.6978595474472E7
            }, {
                "level": 5,
                "resolution": 4891.96981024998,
                "scale": 1.8489297737236E7
            }, {
                "level": 6,
                "resolution": 2445.98490512499,
                "scale": 9244648.868618
            }, {
                "level": 7,
                "resolution": 1222.99245256249,
                "scale": 4622324.434309
            }, {
                "level": 8,
                "resolution": 611.49622628138,
                "scale": 2311162.217155
            }, {
                "level": 9,
                "resolution": 305.748113140558,
                "scale": 1155581.108577
            }, {
                "level": 10,
                "resolution": 152.874056570411,
                "scale": 577790.554289
            }, {
                "level": 11,
                "resolution": 76.4370282850732,
                "scale": 288895.277144
            }, {
                "level": 12,
                "resolution": 38.2185141425366,
                "scale": 144447.638572
            }, {
                "level": 13,
                "resolution": 19.1092570712683,
                "scale": 72223.819286
            }, {
                "level": 14,
                "resolution": 9.55462853563415,
                "scale": 36111.909643
            }, {
                "level": 15,
                "resolution": 4.77731426794937,
                "scale": 18055.954822
            }, {
                "level": 16,
                "resolution": 2.38865713397468,
                "scale": 9027.977411
            }, {
                "level": 17,
                "resolution": 1.19432856685505,
                "scale": 4513.988705
            }, {
                "level": 18,
                "resolution": 0.597164283559817,
                "scale": 2256.994353
            }, {
                "level": 19,
                "resolution": 0.298582141647617,
                "scale": 1128.497176
            }];

            var initialExtent = new Extent(15330613, -4220683, 15504584, -4107404, new SpatialReference({
                wkid: 3857
            }));

            map = new Map("mapDiv", {
                logo: false,
                center: [138.6, -34.93],
                zoom: 14,
                //extent: initialExtent,
                maxZoom: 19,
                minZoom: 9,
                fadeOnZoom: true,
                fitExtent: true,
                autoResize: true,
                lods: lods,
                slider: false
            });

            Main.layersInit();
            var $bar = $('#loadingBar');
            var t = $bar.width();
            $bar.width($bar.width() + 60);
            var f = $bar.width();

        };

        Main.initGraphicsLayers = function(){
            Main.stopsGraphicsLayer = new GraphicsLayer({
                id: "searchGraphicsLayer",
                visible: true
            });

            Main.routeLayer = new GraphicsLayer({
                id: "routeLayer",
                visible: true
            });

            on(map, "layers-add-result", function(){
                //hide the loading screen
                $('#loader').fadeOut();
				/*if(document.cookie.indexOf('cycleInsteadTDUComp2015')<0){
					$('#TDUCompetition').modal('show');
				}*/
                var $bar = $('#loadingBar');
                $bar.width($bar.width() + 100);
            });

            map.addLayer(Main.routeLayer);
            //search on top so it's clickable
            map.addLayer(Main.stopsGraphicsLayer);
            var $bar = $('#loadingBar');
            $bar.width($bar.width() + 60);
        };

        Main.layersInit = function(e){
            MapNavigator.init();
            search.init();
            //ciMarker.init();
            locationList.init();
            alertList.init();
            routePanel.init();
            routing.init();
            pageslide.init();
            print.init();
            //identify.init();

            var $bar = $('#loadingBar');
            $bar.width($bar.width() + 60);

            Main.streetBasemap = new baseTileLayer(CI.properties.roadsURL, {
                id: "dptiStreetBasemap",
                visible: true
            });

            Main.imageryBasemap = new WebTiledLayer(CI.properties.imageryURL + "/${level}/${col}/${row}.png", {
                id: "satelliteBaseMap",
                visible: false,
                opacity: 1
            });

            //            Main.imageryBasemap = new baseTileLayer(CI.properties.imageryURL, {
            //                id: "satelliteBaseMap",
            //                visible: false,
            //                opacity: 1
            //            });

            Main.imageryLabelsBasemap = new baseTileLayer(CI.properties.imageryLabelsURL, {
                id: "labelBaseMap",
                visible: false
            });

            Main.topographicBasemap = baseTileLayer(CI.properties.topographicURL, {
                id: "topoBaseMap",
                visible: false
            });
            map.addLayers([Main.streetBasemap, Main.imageryBasemap, Main.imageryLabelsBasemap, Main.topographicBasemap]);

            var imgParams = new ImageParameters();
            imgParams.format = "PNG32";
            imgParams.transparent = true;

            Main.ciDynamicLayers = new ArcGISDynamicMapServiceLayer(CI.properties.DataDynamicUrl, {
                id: 'ciDynamicLayers',
                imageParameters: imgParams,
                visible: true,
                opacity: 1
            });

            map.addLayers([Main.ciDynamicLayers]);

            Main.initGraphicsLayers();
        };

        Main.ie8BrowserUpdate = function(){
            $('#browserWarning').modal('show');
            //location.href = "http://whatbrowser.org";
        };

        Main.ie7BrowserUpdate = function(){
            alert("You're running a version of Internet Explorer that we no longer support. Please update or use another browser to use Cycle Instead");
            location.href = "http://whatbrowser.org";
        };

        Main.getGraphicsExtent = function(graphics){
            return GraphicsUtils.graphicsExtent(graphics);
        };

        Main.addStopsGraphics = function(stops){
            Main.stopsGraphicsLayer.clear();
            for (var i = 0; i < stops.length; i++) {
                var pt;
                if (stops[i].geometry.spatialReference.wkid === 4326) {
                    pt = webMercatorUtils.geographicToWebMercator(new Point(stops[i].geometry.x, stops[i].geometry.y, new SpatialReference({
                        wkid: 4326
                    })));
                }
                search.addStopGraphic(pt, stops[i].attributes.index);
            }
        };

        Main.errorHandler = function(err){
            console.log('error: ', err);
        };

        Main.clearGraphicsLayers = function(){
            //previous feature layers need to be cleared if they exist, before the new query

            var t1 = map.graphicsLayerIds;

            for (i = 0; i < t1.length; i++) {
                var tempGraphics = map.getLayer(map.graphicsLayerIds[i]);
                if (typeof tempGraphics !== 'undefined') {
                    tempGraphics.clear();
                    //     tempGraphics.hide();
                }
            }
        };
        Main.setup();
    });
};
