pageslide = {};
pageslide.init = function(){
    //# sourceURL=widgets/pageslide/js/pageslide.js
    if (isTouchDevice()) {
        pageslide.loadCSS("widgets/pageslide/css/pageslideMobile.css");
    }
    else {
        pageslide.loadCSS("widgets/pageslide/css/pageslide.css");
    }
    // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) {
        $.fn.transition = $.fn.animate;
    }

    $('#pageSlide').load('widgets/pageslide/pageslide.html', function(response, status, xhr){

        $(".pageSlideOpen").click();
        //close either by button or swipe
        $("#pageSlide").on("swiperight", function(){
            pageslide.close();
        });

        $("#closePanelButton").click(pageslide.close);

        favourites.init();
        options.init();
        help.init();
    });
};

pageslide.close = function(){
    $("#mapDiv").css({
        marginRight: '0px'
    });
    $("#pageSlide").transition({
        right: "-=400"
    }, 500, function(){
        $("#pageSlide").hide();
        map.resize();
    });
};

pageslide.open = function(){
    $("#pageSlide").show().transition({
        opacity: 0.98,
        right: "+=400"
    }, 500, function(){
        $("#mapDiv").css({
            marginRight: '390px'
        }, 500);
        map.resize();
    });
};

pageslide.loadCSS = function(url){
    //    console.log(document.getElementsByTagName("head")[0]);
    var e = document.createElement("link");
    e.href = url;
    e.type = "text/css";
    e.rel = "stylesheet";
    e.media = "screen";
    document.getElementsByTagName("head")[0].appendChild(e);
};
