(function(g) {
  var output = document.getElementById("output");

  var tests = {
    "transition-color": {
      prop:"transition", val:"color 1s linear",
      css: {
        "#app.slide .page":{
          "_vendor_transform": "translate(0%, 0%)",
          "_vendor_transition": "_vendor_transform 500ms linear"
        },
        "#app.slide .old": {
          "_vendor_transform": "translate(-100%, 0%)"
        },
        "#app.slide .new": {
          "_vendor_transform": "translate(100%, 0%)"
        }
      },
      else_css: {
        "body": {
          "background-color": "#FF0000"
        }
      }
    },
    "backface-visibility": {
      prop:"backface-visibility", val:"hidden"
    },
    "transition-opacity": {
      prop:"transition", val:"opacity 1s linear"
    },
    "border-radius" : {
      prop:"border-radius", val:"5px",
      css: {
        "#output": {
          "_vendor_border-radius":"5px;"
        }
      }
    }
  };
  
  var css_obj = {
    "body": {
      "background-color": "#000000",
      "color": "#DCDCDC"
    },
    "#output": {
      "color": "#FFF",
      "font-size":"16px",
      "border":"1px solid #FFF",
      "padding":"20px",
      "margin":"20px"
    }
  }
  

  JSS.css(css_obj);


  for(var test in tests) {
    var trans = (tests[test].css ? JSS.cssIf(tests[test]) : JSS.test(tests[test]));
    log(trans, test+":");
  }  
  
  
  function log(str, desc) {
    desc = desc || "";
    if(typeof str == "object" && g.JSON && g.JSON.stringify) { str = JSON.stringify(str);}
    output.innerHTML += desc + str+"<br/><br/>";
  }
  
  
})(this);