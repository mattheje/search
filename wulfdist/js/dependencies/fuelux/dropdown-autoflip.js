!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){function b(b){a(b).css({visibility:"hidden"}),c(b)?b.parent().addClass("dropup"):b.parent().removeClass("dropup"),a(b).css({visibility:"visible"})}function c(a){var b=d(a),c={};return c.parentHeight=a.parent().outerHeight(),c.parentOffsetTop=a.parent().offset().top,c.dropdownHeight=a.outerHeight(),c.containerHeight=b.overflowElement.outerHeight(),c.containerOffsetTop=b.isWindow?b.overflowElement.scrollTop():b.overflowElement.offset().top,c.fromTop=c.parentOffsetTop-c.containerOffsetTop,c.fromBottom=c.containerHeight-c.parentHeight-(c.parentOffsetTop-c.containerOffsetTop),c.dropdownHeight<c.fromBottom?!1:c.dropdownHeight<c.fromTop?!0:c.dropdownHeight>=c.fromTop&&c.dropdownHeight>=c.fromBottom?c.fromTop>=c.fromBottom:void 0}function d(b){var c,d;return b.attr("data-target")?(c=b.attr("data-target"),d=!1):(c=window,d=!0),a.each(b.parents(),function(b,e){return"visible"!==a(e).css("overflow")?(c=e,d=!1,!1):void 0}),{overflowElement:a(c),isWindow:d}}a(document.body).on("click.fu.dropdown-autoflip","[data-toggle=dropdown][data-flip]",function(c){"auto"===a(this).data().flip&&b(a(this).next(".dropdown-menu"))}),a(document.body).on("suggested.fu.pillbox",function(c,d){b(a(d)),a(d).parent().addClass("open")}),a.fn.dropdownautoflip=function(){}});