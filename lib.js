if (!conversions) {
  var conversions = []
  // Arguments: regex, target, [plural,] function
  let addConv = function(regex, target, arg3, arg4) {
    conversions.push({
      regex: regex,
      target: target,
      plural: arg4 ? arg3 : target,
      conversion: arg4 ? arg4 : arg3,
    })
  }
  // Length
  let in_to_cm = x => x * 2.54
  addConv(/in\.?/, "cm", in_to_cm)
  addConv(/inch(es)?/, "centimeter", "centimeters", in_to_cm)
  let ft_to_m = x => x * 0.3048
  addConv(/foot|(feet)/, "meter", "meters", ft_to_m)
  addConv(/ft\.?/, "m", ft_to_m)
  let yd_to_m = x => x * 0.9144
  addConv(/yard(s)?/, "meter", "meters", yd_to_m)
  addConv(/yd\.?/, "m", yd_to_m)
  let mile_to_m = x => x * 1.609344
  addConv(/mi\.?/, "km", mile_to_m)
  addConv(/miles?/, "kilometer", "kilometers", mile_to_m)
  // Speed
  addConv(/mph/, "km/h", mile_to_m)
  // Mass
  let oz_to_g = x => x * 28.35
  addConv(/oz/, "g", oz_to_g)
  addConv(/ounces?/, "gram", "grams", oz_to_g)
  let lb_to_kg = x => x * 0.4536
  addConv(/lb[s\.]?/, "kg", lb_to_kg)
  addConv(/pounds?/, "kilogram", "kilograms", lb_to_kg)
  addConv(/short tons?|us tons?/, "metric ton", "metric tons", x => x * 0.907185)
  addConv(/long tons?|imperial tons?/, "metric ton", "metric tons", x => x * 1.01605)
  // Temperature
  let f_to_c = x => (x - 32) * 5 / 9
  addConv(/°\s?F/, "° C", f_to_c)
  addConv(/°\s?Fahrenheit/, "° Celsius", f_to_c)

  // Should match any number (does it?)
  // Negatives are relative for Fahrenheit conversion
  // These are different characters: - (char code 45) and − (char code 8722)
  let re_number = /[−\-]?\d+(\.\d+)?/

  // "One RegExp to rule them all, One RegExp to find them ..."
  var re_all = new RegExp("(" + re_number.source + ")(\\s?)("
                              + conversions.map(x => x.regex.source).join("|")
                              + ")\\b", "gi")

  // Ensure the regular expression match the complete unit and are case insensitive
  conversions = conversions.map(c => {
    c.regex = new RegExp(c.regex.source + "$", "i")
    return c
  })
}

/**
* Replaces all occurences of imperial units in a string with appropriate metric
* units. Optional callback is applied to each replaced sub-string.
*/
function convertToMetric(text, callback) {
  callback = callback || (x => x)
  return text.replace(re_all, (oldText, value, _, delimiter, unit) => {
    let conv = conversions.find(c => unit.match(c.regex))
    // some people might use char code 8722 instead of 45...
    value = value.replace("−", "-")
    let converted = conv.conversion(value)
    // Format with max decimal places of 2. Remove if its .00
    let fixed = converted.toFixed(2).replace(/\.00$/, '')
    // No delimter for ° F conversions
    if (unit.startsWith("°")) {
      delimiter = ""
    } else if (delimiter == "") {
      delimiter = " "
    }
    let newText =  fixed + delimiter + (fixed == 1 ? conv.target : conv.plural)
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
