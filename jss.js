(function(g) {
  // global object to expose to the world
  g["JSS"] = {
    g: {},
    test: test,
    css: css,
    cssIf: cssIf
  };
  
  // some helpers, inspired by jQuery's css property name handling
  var rdashAlpha = /-([a-z])/ig;
  function camel(str) { return str.replace(rdashAlpha, camelUp); }
  function camelUp(all,letter) { return letter.toUpperCase(); }
  function upper(str) { if(!str) { return "";} var first = str.charAt(0); return first.toUpperCase()+str.substr(1);}
  
  // should come up with a better way to blacklist certain false positives for certain browsers
  // i hate doing it this way
  var is_ie8 = !!(navigator.userAgent.indexOf("MSIE 8") > -1);
  
  // if you want to test whether a browser supports a specific css property / transition / etc
  // pass in the name of the property, and a valid value for that property, 
  // as an object (ex: {prop:"transition", val:"color 1s linear"})
  // and you will get back either an object that you can use going forward to handle js events, css definitions, etc (if supported)
  // or null (not supported)
  function test(test_obj) {
    var w3_jsprop = camel(test_obj.prop);
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
      // loops through test object, creating a div and setting the properly prefixed test style for each browser
      // then checks to see if that added property sticks around after being set
      // if so, short circuit the tests, and return the object that we are currently checking
      for(var trans_type in css3) {
        style = css3[trans_type].style;
        js_style = css3[trans_type].js_style;
        var div = document.createElement('div');
        div.setAttribute('style',style+test_obj.prop+":"+test_obj.val+";");
        if(js_style in div.style) {
          // should come up with a better way to blacklist certain false positives for certain browsers
          // i hate doing it this way
          if(is_ie8 && test_obj.prop.toLowerCase() === "transition") { continue; }
          ret = css3[trans_type];
          break;
        } 
        div = null;
      }
    }catch(ex) {}
    div = null;
    return ret;
  };
  
  // takes a javascript object literal, and optionally a vendor prefix for setting vendor specific styles
  function css(css_obj, vendor) {
    vendor = vendor || "";
    var style_obj;
    // if there is not already a stylesheet to be used for the app (first time this gets created) create one
    if(!document.getElementById("app_stylesheet")) {
      var style_el = document.createElement("style");
      //style_el.setAttribute("id", "app_stylesheet");
      //style_el.setAttribute("type", "text/css");
      style_el.id = "app_stylesheet";
      style_el.type = "text/css";
      document.getElementsByTagName("head")[0].appendChild(style_el);
      style_obj = document.getElementById("app_stylesheet").sheet;
    }
    else {
      style_obj = document.getElementById("app_stylesheet").sheet;
    }
    if(!style_obj) {
      style_obj = document.styleSheets[document.styleSheets.length - 1];
    }
  
    // presumably this check is not necessary, but hey
    if(css_obj) {
      //cycle through all of the classes
      for(var selector in css_obj) {
        var styles = "", val = "", obj;
        // you can either define a set of styles for a selector as a single string
        // or as a child object with each property / value as a key / value pair of that object
        // if its an object, we need to iterate and build a single long string to set
        if(typeof css_obj[selector] === "object") {
          obj = css_obj[selector];
          for (var each_prop in obj) {
            val = obj[each_prop];
            val = val.replace(/_vendor_/ig, vendor);
            
            each_prop = each_prop.replace(/_vendor_/ig, vendor);
            styles += each_prop + ": " + val + "; ";
            
          }
          obj = null;
        }
        // otherwise, we just need to use what we are given
        else {
          val = css_obj[selector];
          val = val.replace(/_vendor_/ig, vendor);
          styles += val;
        }
        selector = selector.replace(/_vendor_/ig, vendor);

        // add it in, and of course be nice to all browsers that handle it differently
        try {
          if (style_obj.insertRule) {
            style_obj.insertRule(selector + ' {' + styles + '}', style_obj.cssRules.length);
          }
          else if (style_obj.addRule){
            style_obj.addRule(selector, styles, -1);
          }
        }catch(ex) {}
      
      }
    }
  };
  
  // if you have styles you only want to conditionally add if they are supported, you can combine the calls
  // and pass a test_obj that has a 
  function cssIf(test_obj, css_obj, else_obj) {
    else_obj = test_obj.else_css || else_obj || ("css" in test_obj && css_obj);
    css_obj = test_obj.css || css_obj;
    if(!test_obj.prop || !test_obj.val || !css_obj) {
      return null; 
    }
    var trans = test(test_obj);
    if (trans) { css(css_obj, trans.style); }
    else if(else_obj) { css(else_obj); }
    return trans;
  };
  
})(this);