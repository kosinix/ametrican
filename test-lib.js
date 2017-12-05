#!/bin/node

// Simple script to test lib.convertToMetric()
// Run without arguments for normal tests:
// `node test-lib.js`
// To test the performance run:
// `node test-lib.js --perf <optinal-count>`

const lib = require("./lib.js")

// Layout: `test-string`: `expected-result`
// `expected-result` may be `null` if we don't expect changes.
let tests = {
  // mile -> km
  "1 mile": "1.61 kilometers",
  "0.62 miles": "1 kilometer",
  "20mi": "32.19 km",
  "100 miles is longer than 1 mile": "160.93 kilometers is longer than 1.61 kilometers",
  "A \"mil\" should be ignored as in 10 milion": null,
  "There are 2 milestones": null,
  // pounds -> kilos
  "1 pound": "0.45 kilograms",
  "0.5 pound": "0.23 kilograms",
  "1 lb": "0.45 kg",
  "No space between num and unit: 2.2lbs.": "No space between num and unit: 1 kg.",
  // inch -> centimeter
  "1 inch": "2.54 centimeters",
  "2 in. is short": "5.08 cm. is short",
  "12 inches": "30.48 centimeters",
  "2 inchworms are crawling.": null,
  // Fahrenheit -> Celsius
  "Water boils at 212° Fahrenheit.": "Water boils at 100° Celsius.",
  "Body temp: 98.6° F": "Body temp: 37° C",
  "32°F": "0° C",
  "−40° F": "-40° C", // − instead of -
  "-40°F": "-40° C",
  "10° Fusel": null,
  // miles per hour
  "100 mph": "160.93 km/h",
  "Don't drive faster than 80mi/h!": "Don't drive faster than 128.75 km/h!",
  "20 miles per hour": "32.19 kilometers per hour",
  // ton
  "100 short tons": "90.72 metric tons",
  "1 US ton": "0.91 metric tons",
  "10 long ton": "10.16 metric tons",
  "10 imperial ton": "10.16 metric tons",
  // Plural
  "1.102 short tons": "1 metric ton",
}

function runTests(silent) {
  let count = 0
  let errors = 0
  for (key in tests) {
    count++
    let result = lib.convertToMetric(key)
    let expected = tests[key] || key
    if (result != expected) {
      errors++
      if (!silent) {
        console.log("Test #" + count + " failed\n" +
            "\tInput:    \"" + key + "\"\n" +
            "\tExpected: \"" + expected + "\"\n" +
            "\tOutput:   \"" + result + "\"")
      }
    }
  }
  if (!silent) {
    console.log("Ran " + count + " tests; " + errors + " errors.")
  }
}

// Run the normal tests <count> times
function runPerfTest(count) {
  count = count || 10000 // arbitrary number
  console.log("Running tests " + count + " times. Stay put.")
  let average_time = null
  for (let i = 0; i < count; i++) {
    // Only print the first results, the rests should be the same
    let start = process.hrtime()
    runTests(true)
    let time_nano = process.hrtime(start)[1] // let's just ignore seconds here
    if (average_time) {
      average_time = (average_time + time_nano) / 2
    } else {
      average_time = time_nano
    }
  }
  console.log("Average time: " + average_time.toFixed() + "ns")
}


console.time("Total time")
runTests()
// Optionaly run performance test.
const args = process.argv
if (args[2] == "--perf") {
  runPerfTest(args[3])
}
console.timeEnd("Total time")
