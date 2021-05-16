alertList = {};

alertList.init = function(){
    //# sourceURL=widgets/alertList/js/alertList.js

    alertList.loadCSS("widgets/alertList/css/alertList.css");

    $('#alertListDiv').load('widgets/alertList/alertList.html', function(response, status, xhr){

        if (status === "error") {
            console.log("error loading alertList" + xhr.status + " | " + xhr.statusText + " | " + status);
        }

        var startMessage = Main.isTouch ? "Enter a starting location above or tap on the map" : "Enter a starting location above or click on the map";
        $("#addLocationMessage").text(startMessage);

        $("#invalidRouteInfoButton").click(function(){
            $('#invalidRouteModal').modal('show');
        });

         $("#outsideNetworkInfoButton").click(function(){
            $('#stopOutsideInfoModal').modal('show');
        });




        //        alertList.viewModel = kendo.observable({
        //            alertTiles: [],
        //            alertTilesCount: function(){
        //                return this.get("alertTiles").length;
        //            },
        //            currentTile: null
        //        });
        //
        //        var dataSource = new kendo.data.DataSource({
        //            data: alertList.viewModel.get("alertTiles"),
        //            pageSize: 10
        //        });
        //
        //        $("#alertListView").kendoListView({
        //            dataSource: dataSource,
        //            selectable: true,
        //            change: function(){
        //                var index = this.select().index(), dataItem = this.dataSource.view()[index];
        //                alertList.viewModel.set("currentTile", index);
        //            },
        //            template: kendo.template($("#alertTemplate").html())
        //        });
        //        kendo.bind($("#alertListView"), alertList.viewModel);





    });
};

alertList.loadCSS = function(url){
    //    console.log(document.getElementsByTagName("head")[0]);
    var e = document.createElement("link");
    e.href = url;
    e.type = "text/css";
    e.rel = "stylesheet";
    e.media = "screen";
    document.getElementsByTagName("head")[0].appendChild(e);
};
