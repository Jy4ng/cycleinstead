// J - I suspect this isn't used
//# sourceURL=widgets/search/js/stopMarker.js
// represents wrapper for DragableGraphic
// map      - instance of esri.Map
// imgUrl   - string-based image url
// height   - image height in pixels
// height   - image width  in pixels
// mapPoint - instance of esri.geometry.Point

var stopMarkerImageData ={
    m1:"iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAHwSURBVEhLvZU7SEJRGMdPU0tLSwXtFdLeFEFQQxDUXEtBFBgaFEFFRVSQ0mIQ0ZuGXpLo0tAQ9KAgGnykIpqPW5rSAzOoKTj12b1d7Xz3oUJ/+A1y/+fn4dzv3kv+NaldO4127VOuZZ1GWtZorM9CU1YX5S+rz93YIXWTIeog/SieomGaMJ2pE3s1BlSCEWlalpd6q+fQhXKEGyWkXL8FXaCGhOGYlbrIAFr2VUzT98sIhcBNwTpw3rzmJ0/GE7QYqDHSz5ePtAwiJQSSm9eiNFBnYgrh5lVeQ3+lD73SwmD7pij0lE4wBfhHEIE4ZXOnhXI7vNXMZwiLR5iCmwymz89BtKqEcDy87ntcyifREmD/Ro3QX5uxw3DDEloC/grhN9aLdu6IQnjUsJLAm+1GURhfOheFECfRoUVAaYcww7xGTKh1gykKZJ+hlrke11lZIeRvUUBO6CR6XAYJ1i1klQXk7jLXtiUtfD5wMAuUeDzxSQshvrIpdCFG1uxJJTp7hC7GSO45lIUQude/gLdkXJ0MwvWYUUkm8DDwdXWBccBEADrISgk1raAyINZtzl34ehpAZQBfyT3+KvYrGKxfzF+YWL1ghAmbPX8hJPNt7qucKUwGiY6K78rkylXhQgiMCfPtLST3HduU01tUCAn5ApV5icZDq2RKAAAAAElFTkSuQmCC",
    m2:"iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAIlSURBVEhLvZVPaBNBFMbHkyBeelGLdwvFe08iCO2hIOjFS3upIAgtraAItVQRDZjiJYKEtmoR1NZiSC499CBUi4L0kDSky5L/WxMa6p82h9aL8Oy3mc3uZt6mmwb84GMY8s1vJ/Pezor/qup8nEpD78nof0nF/hdUvhmhajRJ8mf/2pxYopS4Qwkxwnrj2F2qhD77A2vdQRbCudg73RyqdT1hFzZz4ZIH1BiJsAv8uBL8qEKT4pYrpJ2YoB9TK/T31z5BGDFPiduuHIzzlpiaEHQG9DOP6qBG7X0turKWf8+t2dBMT0gJ4CHVWMqEJ8QwbV57I5FE2a4pJZ+7OmcDNzruKwHrr8XlHEdgiQNmu586gMfHlYDtYXMs9M1KHJnwxhweInEH7XL6gRKwjB1it3/0bRPWeN6W0+cdOyxcDLMhOHkAQyEgjJhzudLgOxuIV40LwdgRhKrrnYH6mTZ6K7xqA6F1MaqEnDDNrLZdJKfRwxJjK3/5lSvkDasVyemt0agKhKwAKtZMuMas7LoY42FQrudZy0Djymtv4M8PiXrQr7dXdG8gpJ96yC7k7Oo9L5UCy+xizjsLicOBULPr37J2ctIfDDJuLLIQp/EyyLg/oR04EMw28mHK986wMLh8fbF14O6nDAuDZaR1pc+pX8HchedHB1ZmvyjASix+dCDkvM31s4/bg0Gle/ZduTPzrX0ghDZRvr3t6PvAWzLGIj6AQvwDsTilr4QpN40AAAAASUVORK5CYII=",
    m3:"iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAImSURBVEhLvZVPSBRRHMenkyBdvKjQvQXprKcIhO0gBHXpUpeEoIO4QRGmVIQGKV0MRFJzEfyTS8vupcCDsCkG0WFX0WFY3T9jIw6abHuoLsLT7/Ze82beb9bRBb/wZZnZ7/u8N/N+vzfauao8l2bWvXlmdrxnxY4JtvMgzsqJNcb/Dq7tvk9sXXvMMloX6Y0LT5g9vBQMrLcMkhDKxfC76lA99JocWM2Fdh+o2RUnBwSxPbioQte0h65Q4fo4KyfXmdDhwR+2P5Q6frePXDkY75tj/glBOWA091cAlH5/LbqywqXodwe62TasBLBCWFxv357mSFaZUM7CuVtRB7jR8FwJCKf571ZoiOMY0+v7lNxWyxsJWPdUCcgGAK8FwqNRGUzIccfl0vSCDMmbAqFTqBycvSKtsHBtlAzZPZ8VKO5RWevurANEq1Eh2dggIXmzhHdHlx0gtKp1KyFhbAws5H101DDHOMrfmPwfyLW+rVhcAwaIkHeFu90JFQiJgDzYKxS23C2rWoSGQWJVKAGUh9wtf429ykTe1jNvTvkDf37MuMJBvJcy/IGQ0fiSHEjZVXt+sl4tkIMplz5kTgZC1Y5/Yf3is2AwyLwfIyGy0Qw8HkwoBwoEk4V8kvLhMRIG73TGTg/89WWThME8cnplL6tfwdzVkbMD7fEVBWgn02cHQvJpblwaqA0GWb3OWVka+1Y7EEKZKN/eWvTjzgwzI/EAQE07AiNKptjSzWnwAAAAAElFTkSuQmCC",
    m4:"iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAHpSURBVEhL1ZVPKINhHMcfJyUXFw7uJjlzklJzWCnuLpRSFooUCynKxoWSGJaLfxEXBwc15CCHbZq3tZmZJsufZhcu6uG7va+9r/f3/tmcfOp7ePd8f5/ed+/zvi/736Q3fTzRsc3jtlV+Z1vhD917PL1/xcVl89w7DnmQDXI/s5O5LhriyblTc2KhxklKqNxZl/SlgmWaHNRLrElDGrfvkQNmknQeK6XPLi+/Yv1kGQmyAf75+s4Bbox6fVApjNTPqUpSfN9JeS4zMkAJEXREHWPXZWNkCYlUu0RVFi1htM0jExYPkyXkI/SUSfogqCu8qZnNCYWKcbKEYRBrdhsKcSWijrFY46KqIJQ4MjcCIhwbCcO1sjPEk/G7IN2IsGXm+7jHUJho38gJgXwxWjefGYY0+5ux8HHxTCkMsN6fRWlYD7kMe1jU5LhtWStY+Ni7rxYCeUkZ7UsOsD5aBvDfyctS8LRoCeOt69rCl12/omwmT96QthCEyifIQSqKvadFYuqIHKaS2vIbC4He61+KUDpqTgbiXTukRB48XWLdHNgOlAghN7IRt9ZlUoY8dO7kL3w7iZAyRKzkT7hK/RWMNiwULky6z1XC5IGvcCGQfx5ClZN/k4HESO7lm1q++LsQYJuovr0kjH0BC26kTqHSno4AAAAASUVORK5CYII=",
    m5:"iVBORw0KGgoAAAANSUhEUgAAABQAAAAgCAYAAAASYli2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAIcSURBVEhLvZVNSBtBGIbHU0G89GIF7wrSuycpCHoQBHvxYi8VCh7EFCNSFZXSFtT2YqGE+ougVoMhuSh4KPiDgnhITHUJakxWIwm1JebQngqjb9xxf+bbZE2gL7yEZN7vyczsN7PsvyrzLcgTL5e52jTN401T/LLDxzP+MNeGnet8YJUfsh4eYp2kj0p6eWp8yxlYqRklIZTjDV9zQ5XqEbIwl2P1NlC100cWOHFq9LsMDbPX5tCbNU4pEzg05WDst4a509XYhhRCISUKCKdn93XoSe24FBBAtAq+By3jVkefz+rAo8dDUkAAz1vnpTHKpzWfDMBHfVJA6N/vv/efVx+3bvfLLWXh0+oxHag8GZYCAmTVn924lIWPnxpmGHvmkQKYiVI6kN27H6w7OzshzMaaT7xY1IE4ataA1eHbPxCi9jXp2daB0AHrkkLCmKURGGucNI2jhzWMrrPmmftApOJdtl2w5LsCt2nJ4nfhZJdfBkIigD2yE06QEXbAXDQMitZ+zoYwA3S+8Unj6VqXCqstc/bAXyshqSCff25E7IFQpPwtWUjZ1Ht2SnxYJ4spp5dC+YFQrutfWCkbdAaD1FdeEmI0DoMWdya0AwWCyUbOp7OGCRIGX7Z7Hw683jwhYbAWebiOq+S3YLTuS+HA1OSOBEwFgoUDIeNtHql8XxwMSvTrd2V6Yq94IIQ2kd69xeiibYGrLp8DIGM3x8Or/1UeerEAAAAASUVORK5CYII="

}

function StopMarker(map, imgUrl, height, width, mapPoint, graphicsLayer){

    this._map = map; // parent map
    this._graphicsLayer = graphicsLayer;
    this._initialLocation = mapPoint; // initial location of stopMarker
    this._height = height; // stopMarker image height
    this._width = width; // stopMarker image width
    this._imgUrl = imgUrl; // stopMarker image url
    this._dragableGraphic = null; // reference to DragableGraphic object
    // initializes object
    this._init = function(){
        // create PictureMarkerSymbol
        var sO = {
            //url: this._imgUrl,
            contentType: "image/png",
            width: this._width,
            height: this._height,
            type: "esriPMS",
            yoffset: 9
        }
        if(imgUrl.indexOf("http")===0){
            sO.url = imgUrl;
        }else{
            var id = stopMarkerImageData["m" + imgUrl];
            sO.imageData = id;
        }
        var symbol = new esri.symbol.PictureMarkerSymbol(
            /*url: this._imgUrl,
            contentType: "image/png",
            width: this._width,
            height: this._height,
            type: "esriPMS",
            yoffset: 9*/
            sO
        );

        // create graphic object based on symbol
        var graphic = new esri.Graphic(this._initialLocation);
        graphic.setSymbol(symbol);
		graphic.setAttributes( {"stopIndex":parseInt(imgUrl)} );
        // add graphic object to the map
        this._graphicsLayer.add(graphic);

        // create DragableGraphic object to provide drag'n'drop ability for graphic object
        this._dragableGraphic = new DragableGraphic(this._map, graphic, graphicsLayer);
    }

    // releases resources used by object
    this.Dispose = function(){
        if (this._dragableGraphic != null) {
            // remove graphic object from the map
            this._graphicsLayer.remove(this._dragableGraphic._graphic);

            // call Dispose of DragableGraphic
            this._dragableGraphic.Dispose();
        }
    }
    // returns the current location of stopMarker on the map
    this.GetCurrentLocation = function(){
        if (this._dragableGraphic != null)
            return this._dragableGraphic._currentLocation;
        else
            return null;
    }

    this._init(); // initialize object
}

// represents wrapper for graphic object to provide drag'n'drop ability
// map     - instance of esri.Map
// graphic - instance of esri.Graphic
function DragableGraphic(map, graphic, graphicsLayer){

    this._map = map; // parent map
    this._graphicsLayer = graphicsLayer;
    this._graphic = graphic; // moveable graphic object
    this._currentLocation = graphic.geometry; // current location of graphic object
    this._isInUse = false; // true if graphic object is in dragging
    this._onMouseDownHandler = null; // pointer to onMouseDown    event handler
    this._onMouseUpHandler = null; // pointer to onMouseUp      event handler
    this._onMouseDragHandler = null; // pointer to onMouseDrag    event handler
    this._onMouseDragEndHandler = null; // pointer to onMouseDragEnd event handler
    // initializes object
    this._init = function(){
        // bind to onMouseDown that fires when graphic object is clicked on
        if (this._onMouseDownHandler == null)
            this._onMouseDownHandler = dojo.connect(this._graphicsLayer, "onMouseDown", this, this.onMouseDown);
    }

    // releases resources used by object
    this.Dispose = function(){
        // disconnect from onMouseDown
        if (this._onMouseDownHandler != null) {
            dojo.disconnect(this._onMouseDownHandler);
            this._onMouseDownHandler = null;
        }

        // if graphic object is in use, release it
        if (this._isInUse) {
            this._map.enableMapNavigation(); // enable default left button behavior
            this.unbindDragNDropEvents(); // disconnect from drag'n'drop events
            this._isInUse = false; // mark graphic object as not in use
        }
    }

    // binds to drag'n'drop events
    this.bindToDragNDropEvents = function(){
        // bind to onMouseDrag that fires when graphic object is being dragged
        if (this._onMouseDragHandler == null)
            this._onMouseDragHandler = dojo.connect(this._map, "onMouseDrag", this, this.onMouseDrag);
        // bind to onMouseDragEnd that fires when graphic object is dropped
        if (this._onMouseUpHandler == null)
            this._onMouseUpHandler = dojo.connect(this._graphicsLayer, "onMouseUp", this, this.onMouseUp);
    }

    // unbinds from drag'n'drop events
    this.unbindDragNDropEvents = function(){
        // disconnect from onMouseDrag
        if (this._onMouseDragHandler != null) {
            dojo.disconnect(this._onMouseDragHandler);
            this._onMouseDragHandler = null;
        }
        // disconnect from onMouseUp
        if (this._onMouseUpHandler != null) {
            dojo.disconnect(this._onMouseUpHandler);
            this._onMouseUpHandler = null;
        }
    }

    // fires when graphic object is clicked on
    this.onMouseDown = function(event){
        console.log("************************mouseDown");
        if (event.button != 0) // ignore if clicked button is not a left one
            return;

        // ignore if clicked graphic object is not an object contained in the current DragableGraphic-object
        if (event.graphic != this._graphic)
            return;

        // if graphic object isn't in use yet, start using it
        if (!this._isInUse) {
            this._isInUse = true; // mark graphic object as in use
            this._map.disableMapNavigation(); // prevent default left button behavior
            this.bindToDragNDropEvents(); // connect to drag'n'drop events
        }
    }

    // fires when graphic object is dropped
    this.onMouseUp = function(event){
        if (event.button != 0) // ignore if clicked button is not a left one
            return;

        // ignore if clicked graphic object is not an object contained in the current DragableGraphic-object
        if (event.graphic != this._graphic)
            return;

        // if graphic object is in use, release it
        if (this._isInUse) {
            this._currentLocation = event.mapPoint; // preserve end graphic object location
            this._graphic.setGeometry(event.mapPoint); // move graphic object to the end location
            this._map.enableMapNavigation(); // enable default left button behavior
            this.unbindDragNDropEvents(); // disconnect from drag'n'drop events
            //var newIndex = this._graphic.symbol.url.replace(/[A-Za-z\/.$-]/g, "");
			//var newIndex = this._graphic.symbol.url.replace("http://","").replace(/[A-Za-z\/.$-]/g, "");
			var newIndex = this._graphic.attributes.stopIndex;
            newIndex = parseInt(newIndex, 10) - 1;
            search.updateGraphic(event, newIndex);
            this._isInUse = false; // mark graphic object as not in use
        }
    }

    // fires when graphic object is being dragged
    this.onMouseDrag = function(event){
        if (this._isInUse) {
            this._currentLocation = event.mapPoint; // preserve a new graphic object location
            this._graphic.setGeometry(event.mapPoint); // move graphic object to the new location
        }
    }

    this._init(); // initialize object
}
