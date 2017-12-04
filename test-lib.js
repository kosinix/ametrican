#!/bin/node

const lib = require("./lib.js")

// test-string: expected-result or null if we expect no changes
let tests = {
  // mile -> km
  "1 mile": "1.61 km",
  "0.62 mile": "1 km",
  "20mi": "32.19 km",
  "100 miles is longer than 1 mile": "160.93 km is longer than 1.61 km",
  "A \"mil\" should be ignored as in 10 milion": null,
  "There are 2 milestones": null,
  // pounds -> kilos
  "1 pound": "0.45 kg",
  "0.5 pound": "0.23 kg",
  "1 lb": "0.45 kg",
  "No space between num and unit: 2.2lbs.": "No space between num and unit: 1 kg.",
  // inch -> centimeter
  "1 inch": "2.54 cm",
  "2 in. is short": "5.08 cm. is short",
  "12 inches": "30.48 cm",
  "2 inchworms are crawling.": null,
  // Fahrenheit -> Celsius
  "Water boils at 212° Fahrenheit.": "Water boils at 100° Celsius.",
  "Body temp: 98.6° F": "Body temp: 37° C",
  "32°F": "0° C",
  "−40° F": "-40° C", // − instead of -
  "-40°F": "-40° C",
  "10° Fusel": null,
  // miles per hour
  "100 mph": "160.93 kph",
  "Don't drive faster than 80mi/h!": "Don't drive faster than 128.75 km/h!",
  "20 miles per hour": "32.19 km per hour",
  // ton
  "100 short ton": "90.72 metric ton",
  "1 US ton": "0.91 metric ton",
  "10 long ton": "10.16 metric ton",
  "10 imperial ton": "10.16 metric ton",
}

let count = 0
let errors = 0
for (key in tests) {
  count++
  let result = lib.convertToMetric(key)
  let expected = tests[key] || key
  if (result != expected) {
    console.log("Test #" + count + " failed\n" +
        "\tInput:    \"" + key + "\"\n" +
        "\tExpected: \"" + expected + "\"\n" +
        "\tOutput:   \"" + result + "\"")
    errors++
  }
}
console.log("Ran " + count + " tests; " + errors + " errors.")
