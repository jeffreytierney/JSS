(function(g) {
  g["JSS"] = {
    test: test,
    load: load,
    loadIf: loadIf
  };
  
  var rdashAlpha = /-([a-z])/ig;
  function camel(str) { return str.replace(rdashAlpha, camelUp); }
  function camelUp(all,letter) { return letter.toUpperCase(); }
  function upper(str) { if(!str) { return "";} var first = str.charAt(0); return first.toUpperCase()+str.substr(1);}
  
  function test(prop, val) {
    var w3_jsprop = camel(prop);
    var js_prop = upper(w3_jsprop);
    
    var css3 = {
      "webkit":{
        style:"-webkit-", 
        js_style:"webkit"+js_prop, 
        trans_evt: "webkitTransitionEnd", 
        anim_evt:"webkitAnimationEnd"
      },
      "moz":{
        style:"-moz-", 
        js_style:"Moz"+js_prop, 
        trans_evt: "transitionend", 
        anim_evt:"animationend"
      },
      "o":{
        style:"-o-", 
        js_style:"O"+js_prop, 
        trans_evt:"OTransitionEnd", 
        anim_evt:"OAnimationEnd"
      },
      "ms":{
        style:"-ms-", 
        js_style:"Ms"+js_prop, 
        trans_evt:"MsTransitionEnd", 
        anim_evt:"MsAnimationEnd"
      },
      "w3c":{
        style:"", 
        js_style:w3_jsprop, 
        trans_evt: "transitionend", 
        anim_evt:"animationend"
      }
    };
    
    var div, style, js_style, ret=null;
    try {
      for(var trans_type in css3) {
        style = css3[trans_type].style;
        js_style = css3[trans_type].js_style;
        var div = document.createElement('div');
        div.setAttribute('style',style+prop+":"+val+";");
        if(js_style in div.style) {
          ret = css3[trans_type];
          break;
        }
        div = null;
      }
    }catch(ex) {}
    div = null;
    return ret;
  };
  
  function load(css_obj, vendor) {
    vendor = vendor || "";
    var style_obj;
    // if there is not already a stylesheet to be used for the app (first time this gets created)
    if(!document.getElementById("app_stylesheet")) {
      var style_el = document.createElement("style");
      style_el.setAttribute("id", "app_stylesheet");
      style_el.setAttribute("type", "text/css");
      document.getElementsByTagName("head")[0].appendChild(style_el);
      style_obj = document.getElementById("app_stylesheet").sheet;
    }
    else {
      style_obj = document.getElementById("app_stylesheet").sheet;
    }
  
    // presumably this check is not necessary, but hey
    if(css_obj) {
      //cycle through all of the classes
      for(var selector in css_obj) {
        var property = "", val = "", obj;
        // cycle through each property for the definition
        if(typeof css_obj[selector] === "object") {
          obj = css_obj[selector];
          for (var each_prop in obj) {
            val = obj[each_prop];
            val = val.replace(/_vendor_/ig, vendor);
            
            each_prop = each_prop.replace(/_vendor_/ig, vendor);
            
            if(each_prop != "_") { property += each_prop + ": " + val + "; "; }
            else { property += val; }
            
          }
          obj = null;
        }
        else {
          val = css_obj[selector];
          val = val.replace(/_vendor_/ig, vendor);
          property += val;
        }
        selector = selector.replace(/_vendor_/ig, vendor);

        // add it in, and of course be nice to all browsers that handle it differently
        try {
          if (style_obj.insertRule) {
            style_obj.insertRule(selector + ' {' + property + '}', style_obj.cssRules.length);
          }
          else if (style_obj.addRule){
            style_obj.addRule(selector, ' {' + property + '}');
          }
        }catch(ex) {}
      
      }
    }
  };
  
  function loadIf(test_obj, css_obj) {
    if(!test_obj.prop || !test_obj.val) { return null; }
    var trans = test(test_obj.prop, test_obj.val);
    if (trans) { load(css_obj, trans.style); }
    return trans;
  }
  
})(this);