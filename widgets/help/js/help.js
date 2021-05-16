help = {};

help.init = function(){
    //# sourceURL=widgets/help/js/help.js
    help.loadCSS("widgets/help/css/help.css");
    help.loadCSS("widgets/bootstrapTour/css/bootstro.min.css");

    $('#helpDiv').load('widgets/help/help.html', function(response, status, xhr){

        if (status === "error") {
            console.log("error loading help" + xhr.status + " | " + xhr.statusText + " | " + status);
        }

        $('#helpTabButton').click(function(e){
            e.preventDefault();
            $(this).tab('show');
        });

        $("#helpButton").click(function(e){
            e.stopPropagation();
            pageslide.open();
            $('#helpTab a[href="#helpDiv"]').tab('show'); // Select tab by name
        });

        $("#searchTourLink").click(function(){
            bootstro.start('#searchInput');
        });

        $("#locateButtonTourLink").click(function(){
            pageslide.close();
            bootstro.start('#locateButton', {
                onExit: function(){
                    pageslide.open();
                }
            });
        });

        $(".favouritesTourLink").click(function(){
            pageslide.close();
            bootstro.start('#favouritesButton', {
                onExit: function(){
                    pageslide.open();
                }
            });
        });

        $(".optionsTourLink").click(function(){
            pageslide.close();
            bootstro.start('#optionsButton', {
                onExit: function(){
                    pageslide.open();
                }
            });
        });

        $("#deleteLocationTourLink").click(function(){
            if (Main.viewModel.stops.length > 0) {
                bootstro.start('.deleteButton');
            }
            else {
                alert("Add a new location first");
            }
        });

        $("#addFavouriteLocationTourLink").click(function(){
            if (Main.viewModel.stops.length > 0) {
                bootstro.start('.stopName.stopTableCell');
            }
            else {
                alert("Add a new location first");
            }
        });

        $("#addFavouriteRouteTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#favouriteRouteButton');
            }
            else {
                alert("Add 2 new locations, then you can save the route as a favourite");
            }
        });

        $("#clearAllTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#clearAllButton');
            }
            else {
                alert("In order to clear a route, add two locations first");
            }
        });

        $("#routeTypeTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#routeTypeSelect');
            }
            else {
                alert("In order to change your route options, please add two locations first");
            }
        });

        $("#gradientTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#gradientPanel');
            }
            else {
                alert("In order to change your route options, please add two locations first");
            }
        });

        $("#speedTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#speedPanel');
            }
            else {
                alert("In order to change your route options, please add two locations first");
            }
        });

        $("#unsealedTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#unsealedPanel');
            }
            else {
                alert("In order to change your route options, please add two locations first");
            }
        });

        $("#printTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#printRouteButton');
            }
            else {
                alert("In order to print a route, please add two locations first");
            }
        });

        $("#detailsTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#routeDetailsToggleButton');
            }
            else {
                alert("In order to see details of your route, please add two locations first");
            }
        });

        $("#gpxTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#exportRouteButton');
            }
            else {
                alert("In order to export a route to GPX, please add two locations first");
            }
        });

        $('#helpVideoLink').click(function(){
            var src = '//www.youtube.com/embed/wYNEGVDdkik?enablejsapi=1';
            $('#helpVideoModal iframe').attr('src', src);
            $('#helpVideoModal').modal('show');
        });

        $('#helpVideoModal').on('hidden.bs.modal', function(e){
            var div = document.getElementById("ciHelpVideo");
            var iframe = div.getElementsByTagName("iframe")[0].contentWindow;
            func = 'pauseVideo';
            iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
        });

        $("#dragTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('.stopIndex.stopTableCell');
            }
            else {
                alert("In order to re-order your locations, add at least two locations first");
            }
        });

        $("#gpxTourLink").click(function(){
            if (Main.viewModel.stops.length > 1) {
                bootstro.start('#exportRouteButton');
            }
            else {
                alert("In order to see route options, add two locations first");
            }
        });



    });




};

help.loadCSS = function(url){
    var e = document.createElement("link");
    e.href = url;
    e.type = "text/css";
    e.rel = "stylesheet";
    e.media = "screen";
    document.getElementsByTagName("head")[0].appendChild(e);
};
