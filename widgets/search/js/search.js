search = {};
search.maximumGeocodeResults = 6;

search.init = function(){
    //# sourceURL=widgets/search/js/search.js

    search.AddressGeocoderUrl = CI.properties.AddressGeocoderUrl;
    //load seperate UI code
    $.ajax({
        //url to your UI code
        url: "widgets/search/js/searchHybridUI.js",
        success: null,
        dataType: "script",
        error: function(xhr, textStatus, errorStatus){
            console.log("script failed to load - URL " + url + " , error" + xhr + " : " + textStatus + " | " + errorStatus);
        }
    });

    search.dataSource = new kendo.data.DataSource({
        serverFiltering: true,
        //type: "odata", // specifies data protocol
        //pageSize: 10, // limits result set
        //serverPaging: true,
        transport: {
            read: {
                url: search.AddressGeocoderUrl,
                dataType: "jsonp",
                data: {
                    f: "pjson",
                    outSR: "3857",
                    //outFields: "loc_name",
                    outFields: "unitType, unitNumber, houseNumber, streetName, streetType, streetDir, locality, suburb, postcode, state, loc_name, placeName",
                    searchExtent: '138.0,-35.68,139.52,-34.4',
                    singleLine: function(){
                        return $("#searchInput").data("kendoAutoComplete").value();
                    }
                }
            }
        },
        schema: {
            data: function(response){
                var tempArray;
                if (response.candidates.length > search.maximumGeocodeResults) {
                    tempArray = response.candidates.slice(0, search.maximumGeocodeResults);
                    search.renameDataSources(tempArray);
                    search.geocodeLength = tempArray.length;
                    return tempArray;
                }
                else {
                    tempArray = response.candidates;
                    search.renameDataSources(tempArray);
                    search.geocodeLength = tempArray.length;
                    return tempArray;
                }
            }
        }
    });
};

search.renameDataSources = function(tempArray){
    for (var i = 0; i < tempArray.length; i++) {
        switch (tempArray[i].attributes.loc_name) {
            case "SuburbPostcode":
                tempArray[i].layerName = "Suburbs";
                break;
            case "Postcode":
                tempArray[i].layerName = "Postcodes";
                break;
            case "SAGAF_PLUS":
                tempArray[i].layerName = "Address";
                break;
            case "Gazetteer":
                tempArray[i].layerName = "Place Name";
                break;
            case "LGA":
                tempArray[i].layerName = "Councils";
                break;
            case "Hundred":
                tempArray[i].layerName = "Hundreds";
        }
    }
    return tempArray;
};
