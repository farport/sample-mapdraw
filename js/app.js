(function(){
    /**
     * Create a bounding box for the coords passed.  Return an object with following
     * properties: left, top, width, height
     * 
     * @param {*} coords from an area
     * @param {*} offsetLeft 
     * @param {*} offsetTop 
     */
    function getBoundingBox(coords, offsetLeft, offsetTop) {
        var minX=null;
        var minY=minX;
        var maxX=-null;
        var maxY=maxX;

        // Coords is expected to be a series of X, Y pairs
        for(var i=0;i<coords.length;i+=2){
            // Setting minX and maxX
            var x = parseInt(coords[i]);
            if (minX == null) {
                minX = x;
                maxX = x;
            } else if( x < minX ) {
                minX = x;
            } else if( x > maxX) {
                maxX = x;
            }

            // Setting minY and maxY
            var y = parseInt(coords[i+1]);
            if (minY == null) {
                minY = y;
                maxY = y;
            } else if( y < minY ) {
                minY = y;
            } else if( y > maxY) {
                maxY = y;
            }
        }

        return {
            "left": minX + offsetLeft,
            "top": minY + offsetTop,
            "width": maxX-minX,
            "height": maxY-minY
        }
    }

    /**
     * Draw the image on a canvas over the given image map coordinates.
     * 
     * Note: it is expected that image file exists with the same name as
     *       canvas name
     * 
     * @param {*} idcanvas 
     * @param {*} coords_attr 
     */
    function drawBox(idcanvas, coords_attr) {
        var coords = coords_attr.split(",");
        var map_offset = $('#base_map').offset();
        var box = getBoundingBox(coords, map_offset.left, map_offset.top);

        var canvas=document.getElementById(idcanvas);
        var ctx=canvas.getContext("2d");
        var img=new Image();
        img.onload=start;

        img.src='images/' + idcanvas + '.png';
        function start(){
            console.log("box = left: ", box.left, "; top: ", box.top, "; width:", box.width, "; height:", box.height);

            canvas.width = box.width;
            canvas.height = box.height;
            canvas.style.left = box.left;
            canvas.style.top = box.top;

            ctx.drawImage(img,0,0,box.width,box.height);
        }
    }

    /**
     * Clear the given id canvas
     * @param {*} idcanvas 
     */
    function clearBox(idcanvas) {
        var canvas=document.getElementById(idcanvas);
        var ctx=canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = 0;
        canvas.height = 0;
        
    }

    // Initialize the image map
    $('img')
        .mapster({
            mapKey: 'state'
        })
        .mapster('resize', 800, 494)
    ;

    // Trap the hover event for all map areas
    $('.map-area').hover(
        function() {
            var state = $(this).attr('state');
            var idCanvas = "canvas_" + state;
            var coords = $(this).attr('coords');
            console.log("IN state: " + state);        
            drawBox(idCanvas, coords);
        },
        function(){
            var state = $(this).attr('state');
            var idCanvas = "canvas_" + state;
            console.log("OUT state: " + state);
            clearBox(idCanvas);
        }
    )

})();