let conversions = [
  // length
  {
    regex: /inch(es)?|in\.?/,
    target: "cm",
    conversion: x => x * 2.54
  },
  {
    regex: /foot|feet|ft\.?/,
    target: "m",
    conversion: x => x * 0.3048
  },
  {
    regex: /yards?|yd\.?/,
    target: "m",
    conversion: x => x * 0.9144
  },
  {
    regex: /miles?|mi\.?/,
    target: "km",
    conversion: x => x * 1.6093
  },
  // mass
  {
    regex: /ounces?|oz/,
    target: "g",
    conversion: x => x * 28.35
  },
  {
    regex: /pounds?|lb[s\.]?/,
    target: "kg",
    conversion: x => x * 0.4536
  },
]

// Should match any number (does it?)
let re_number = /\d+(\.\d+)?/

// "One RegExp to rule them all, One RegExp to find them ..."
let re_all = new RegExp("\\b(" + re_number.source + ")\\s?("
                            + conversions.map(x => x.regex.source).join("|")
                            + ")\\b",
                          "gi")

/**
* Replaces all occurences of imperial units in a string with appropriate metric
* units. Optional callback is applied to each replaced sub-string.
*/
function convertToMetric(text, callback) {
  callback = callback || (x => x)
  return text.replace(re_all, (oldValue, value, _, unit) => {
    let conv = conversions.find(c => unit.match(c.regex))
    let converted = conv.conversion(value)
    // Format with max decimal places of 2. Remove if its .00
    let fixed = converted.toFixed(2).replace(/\.00$/, '')
    let newValue =  fixed + " " + conv.target
    return callback(newValue, oldValue)
  })
}
