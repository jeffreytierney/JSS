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
      }
    },
    "backface-visibility": {
      prop:"backface-visibility", val:"hidden"
    },
    "transition-opacity": {
      prop:"transition", val:"opacity 1s linear"
    }
  };
  

  for(var test in tests) {
    var trans = JSS.test(tests[test].prop,tests[test].val);
    log(trans, test+":");
    if(trans && tests[test].css) { JSS.load(tests[test].css, trans.style)}
  }  
  
  function log(str, desc) {
    desc = desc || "";
    if(typeof str == "object" && g.JSON && g.JSON.stringify) { str = JSON.stringify(str);}
    output.innerHTML += "<br/><br/>"+desc + str;
  }
  
  
})(this);