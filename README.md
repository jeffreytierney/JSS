# JSS

## What is JSS?

JSS is an easy, cross-browser way to use javascript to generate style rules for your web app.

Rather than setting inline style properties on individual elements, which is how most javascript based css interaction works, JSS allows you
to create document level style rules that will be treated just as lines in a regular static css file, or embedded style tag would.

## When should I use JSS?

JSS is not intended to replace the use of actual CSS files in traditional web sites, but rather to supplement them to provide a method
to dynamicically update or create style rules that can change based on a changing document.

Additionally, JSS is great for using in modular javascript based application components such as bookmarklets or plugins.  
Frequently, these types of modular components require downloading or including an additional css file to define styles that the component will require.
This can add extra http requests, and can make maintenance, distribution and re-use of these components more difficult than necessary.
JSS aims to solve this problem by allowing the css and javascript necessary for these components to be self contained inside of the single js file, 
while still maintaining a level of separation between presentation and functionality.

## What are the benefits of using JSS?

CSS's syntax is similar enough to Javascript Object Notation (JSON) syntax that there is nothing new to learn. 
(style definitions are contained within curly braces, with the property name (the key) separated from the property value 
(the value) via a colon and each braced style definition is itself a value for the selector rule (or rules) that it is being defined for)

However, since all keys and values are now inside of a javascript object, they can be either string literals (or numbers), variables that hold previously evaluated strings (or numbers), 
or functions that evaluate to strings (or numbers), giving you an additional layer of flexibility in your style definitions, allowing you to create or modify rules based on the current 
state of the content of your page.

Just like in server side css templating solutions, you can use variables to represent things like colors or heights that you intend to reuse, 
and that now only need to be maintained and updated in one spot.  Additionally you could define mixins, or groups of properties that you can easily 
apply in multiple places, and again only have to worry about updating them in one spot.

Finally, since you are creating real document style rules, you can take advantage of the cascading nature of css. 
For example: If you have a ul with 4 li elements floated left, with the width set to 25% each, but you want to add a 5th, and have them all 
take on a width of 20%, here is what you would do with jquery (or any css selector based js lib, not to pick on jquery):

`$("ul li").css({width:"20%"});`

And Here is what you would do with JSS:

`JSS.css({"ul li":{width:"20%"}});`

Its about the same as far as statement length goes, but what happens afterwards is where the benefit comes into play...
The first one will iterate over each matching element, setting an inline style value directly on the element, and triggering a document reflow each time.
The second, JSS version, will add the style rule to the document, causing a single reflow, during which the new value will be applied to all matching elements at once.

## How do i use JSS?

JSS's interface is simple... there are only 3 methods (and one of them is a convenience method that combines the other two for you).
The only methods available are JSS.test, JSS.css, and JSS.cssIf.

### JSS.test(test_obj)
JSS.test takes 1 parameter, an object literal that should have two properties, `test_obj.prop` and `test_obj.val`.  
`prop` is the name of the vendor prefixed property that you want to test a browser for (such as "transition")
and value is a valid value for that property (such as "color 1s linear").  If the browser supports it, you will get returned an object
that contains the proper vendor prefix, the proper vendor javascript property that you can use, as well as the proper vendor-prefixed transition / animation end event that you can listen for.

`JSS.test({prop:"transition", val:"color 1s linear"});`

### JSS.css(css_obj)
JSS.css takes 1 parameter, an object literal that contains all of your css rules to be added.

`JSS.css({
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
});`

