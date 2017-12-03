var conversions = [
  // Length
  {
    regex: /inch(es)?|in\.?/,
    target: " cm",
    conversion: x => x * 2.54
  },
  {
    regex: /foot|feet|ft\.?/,
    target: " m",
    conversion: x => x * 0.3048
  },
  {
    regex: /yards?|yd\.?/,
    target: " m",
    conversion: x => x * 0.9144
  },
  {
    regex: /miles?|mi\.?/,
    target: " km",
    conversion: x => x * 1.609344
  },
  // speed
  {
    regex: /mph/,
    target: " kph",
    conversion: x => x * 1.609344
  },
  // Mass
  {
    regex: /ounces?|oz/,
    target: " g",
    conversion: x => x * 28.35
  },
  {
    regex: /pounds?|lb[s\.]?/,
    target: " kg",
    conversion: x => x * 0.4536
  },
  // Temperature
  // Fahrenheit needs to be earlier in the list than F so that arr.find()
  // first tries to match the full Fahrenheit
  {
    regex: /°\s?Fahrenheit/,
    target: "° Celsius",
    conversion: x => (x - 32) * 5 / 9
  },
  {
    regex: /°\s?F/,
    target: "° C",
    conversion: x => (x - 32) * 5 / 9
  }
]

// Should match any number (does it?)
// Negatives are relative for Fahrenheit conversion
// These are different characters: - (char code 45) and − (char code 8722)
var re_number = /[−\-]?\d+(\.\d+)?/

// "One RegExp to rule them all, One RegExp to find them ..."
var re_all = new RegExp("(" + re_number.source + ")\\s?("
                            + conversions.map(x => x.regex.source).join("|")
                            + ")\\b",
                          "gi")

/**
* Replaces all occurences of imperial units in a string with appropriate metric
* units. Optional callback is applied to each replaced sub-string.
*/
function convertToMetric(text, callback) {
  callback = callback || (x => x)
  return text.replace(re_all, (oldText, value, _, unit) => {
    let conv = conversions.find(c => unit.match(c.regex))
    // some people might use char code 8722 instead of 45...
    value = value.replace("−", "-")
    let converted = conv.conversion(value)
    // Format with max decimal places of 2. Remove if its .00
    let fixed = converted.toFixed(2).replace(/\.00$/, '')
    let newText =  fixed + conv.target
    return callback(newText, oldText)
  })
}

// Finds all text nodes
function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}

// Walk thru child nodes and convert their values
function convertChildren(parentNode){
  // Find all text nodes
  let elements = textNodesUnder(parentNode);

  // Remove blanks
  elements = elements.filter((el)=>{
      return el.nodeValue.trim() !== '';
  });
  // Do conversion on each text node
  elements.forEach((el) => {
      if (el.parentNode && !el.childNodes.length) {
          let newHTML = convertToMetric(el.nodeValue,
              ((new_, old) => '<span class="__ametrican-highlight" title="' + strip(old) + '">' + strip(new_) + '</span>'))
          // Only update if changed
          if (newHTML !== el.nodeValue) {
              el.parentNode.innerHTML = el.parentNode.innerHTML.replace(el.nodeValue, newHTML)
          }
      }
  });
}

// Add some sanitation
function strip(html) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText;
}

// export functions for use in node.js
module.exports = {
  convertToMetric: convertToMetric,
}
