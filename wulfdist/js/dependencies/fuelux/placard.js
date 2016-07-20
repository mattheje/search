!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){var b=a.fn.placard,c={accepted:"onAccept",cancelled:"onCancel"},d=function(b,c){var d=this;this.$element=a(b),this.options=a.extend({},a.fn.placard.defaults,c),this.$accept=this.$element.find(".placard-accept"),this.$cancel=this.$element.find(".placard-cancel"),this.$field=this.$element.find(".placard-field"),this.$footer=this.$element.find(".placard-footer"),this.$header=this.$element.find(".placard-header"),this.$popup=this.$element.find(".placard-popup"),this.actualValue=null,this.clickStamp="_",this.previousValue="",-1===this.options.revertOnCancel&&(this.options.revertOnCancel=this.$accept.length>0),this.isInput=this.$field.is("input"),this.$field.on("focus.fu.placard",a.proxy(this.show,this)),this.$field.on("keydown.fu.placard",a.proxy(this.keyComplete,this)),this.$accept.on("click.fu.placard",a.proxy(this.complete,this,"accepted")),this.$cancel.on("click.fu.placard",function(a){a.preventDefault(),d.complete("cancelled")}),this.ellipsis()};d.prototype={constructor:d,complete:function(a){var b=this.options[c[a]],d={previousValue:this.previousValue,value:this.$field.val()};b?(b(d),this.$element.trigger(a+".fu.placard",d)):("cancelled"===a&&this.options.revertOnCancel&&this.$field.val(this.previousValue),this.$element.trigger(a+".fu.placard",d),this.hide())},keyComplete:function(a){this.isInput&&13===a.keyCode?(this.complete("accepted"),this.$field.blur()):27===a.keyCode&&(this.complete("cancelled"),this.$field.blur())},destroy:function(){return this.$element.remove(),a(document).off("click.fu.placard.externalClick."+this.clickStamp),this.$element.find("input").each(function(){a(this).attr("value",a(this).val())}),this.$element[0].outerHTML},disable:function(){this.$element.addClass("disabled"),this.$field.attr("disabled","disabled"),this.hide()},ellipsis:function(){var a,b,c;if("true"===this.$element.attr("data-ellipsis"))if(a=this.$field.get(0),this.$field.is("input"))a.scrollLeft=0;else if(a.scrollTop=0,a.clientHeight<a.scrollHeight){for(this.actualValue=this.$field.val(),this.$field.val(""),c="",b=0;a.clientHeight>=a.scrollHeight;)c+=this.actualValue[b],this.$field.val(c+"..."),b++;c=c.length>0?c.substring(0,c.length-1):"",this.$field.val(c+"...")}},enable:function(){this.$element.removeClass("disabled"),this.$field.removeAttr("disabled")},externalClickListener:function(a,b){(b===!0||this.isExternalClick(a))&&this.complete(this.options.externalClickAction)},getValue:function(){return null!==this.actualValue?this.actualValue:this.$field.val()},hide:function(){this.$element.hasClass("showing")&&(this.$element.removeClass("showing"),this.ellipsis(),a(document).off("click.fu.placard.externalClick."+this.clickStamp),this.$element.trigger("hidden.fu.placard"))},isExternalClick:function(b){var c,d,e=this.$element.get(0),f=this.options.externalClickExceptions||[],g=a(b.target);if(b.target===e||g.parents(".placard:first").get(0)===e)return!1;for(c=0,d=f.length;d>c;c++)if(g.is(f[c])||g.parents(f[c]).length>0)return!1;return!0},setValue:function(a){this.$field.val(a),this.$element.hasClass("showing")||this.ellipsis()},show:function(){var b;if(!this.$element.hasClass("showing")){if(b=a(document).find(".placard.showing"),b.length>0){if(b.data("fu.placard")&&b.data("fu.placard").options.explicit)return;b.placard("externalClickListener",{},!0)}this.previousValue=this.$field.val(),this.$element.addClass("showing"),null!==this.actualValue&&(this.$field.val(this.actualValue),this.actualValue=null),this.$header.length>0&&this.$popup.css("top","-"+this.$header.outerHeight(!0)+"px"),this.$footer.length>0&&this.$popup.css("bottom","-"+this.$footer.outerHeight(!0)+"px"),this.$element.trigger("shown.fu.placard"),this.clickStamp=(new Date).getTime()+(Math.floor(100*Math.random())+1),this.options.explicit||a(document).on("click.fu.placard.externalClick."+this.clickStamp,a.proxy(this.externalClickListener,this))}}},a.fn.placard=function(b){var c,e=Array.prototype.slice.call(arguments,1),f=this.each(function(){var f=a(this),g=f.data("fu.placard"),h="object"==typeof b&&b;g||f.data("fu.placard",g=new d(this,h)),"string"==typeof b&&(c=g[b].apply(g,e))});return void 0===c?f:c},a.fn.placard.defaults={onAccept:void 0,onCancel:void 0,externalClickAction:"cancelled",externalClickExceptions:[],explicit:!1,revertOnCancel:-1},a.fn.placard.Constructor=d,a.fn.placard.noConflict=function(){return a.fn.placard=b,this},a(document).on("focus.fu.placard.data-api","[data-initialize=placard]",function(b){var c=a(b.target).closest(".placard");c.data("fu.placard")||c.placard(c.data())}),a(function(){a("[data-initialize=placard]").each(function(){var b=a(this);b.data("fu.placard")||b.placard(b.data())})})});