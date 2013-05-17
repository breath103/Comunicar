(function ($) {
    function KSize(width,height){
        this.width  = width;
        this.height = height;
        this.ratio  = height/width;
    }
    KSize.prototype.validateWithValue = function(valueForInvalidateValue){
        this.width  = this.width?this.width:valueForInvalidateValue;
        this.height = this.height?this.height:valueForInvalidateValue;
        this.ratio = this.height/this.width;
        return this;
    }
    function limit(min, value, max) {
        if (value < min) return min;
        else if (value > max) return max;
        else return value;
    }

    $(document).ready(function () {
        $(window).resize(function () {
            $(".keep-aspect-ratio").each(function () {
                var e = $(this);

                var paperRatio = parseFloat(e.attr("aspect-ratio"));
                var $parent = $(e.parent());
                var minSize = new KSize(parseFloat(e.css("min-width")), parseFloat(e.css("min-height"))).validateWithValue(-1000000);
                var maxSize = new KSize(parseFloat(e.css("max-width")), parseFloat(e.css("max-height"))).validateWithValue(1000000);
                var currentSize = new KSize($parent.width(), $parent.height());

                if (paperRatio < currentSize.ratio) {
                    var width = limit(minSize.width, currentSize.width, maxSize.width);
                    e.width(width);
                    e.height(width * paperRatio);
                    e.css({
                        "left": 0,
                        "top": (height - e.height()) / 2
                    });
                }
                else {
                    var height = limit(minSize.height, currentSize.height, maxSize.height);
                    e.height(height);
                    e.width(height / paperRatio);
                    e.css({
                        "left": (currentSize.width - e.width()) / 2,
                        "top": 0
                    });
                }
            });
        });
        $(window).trigger("resize");
    });
})(jQuery);