// A custom tiny unit test framework
// requires 'core.js'

// Stat handling
var tests_count = 0;
var tests_passed = 0;
var tests_failed = 0;

// Core lib reference
var core = Popcorn.Core;

// Basic assertion function just compares 
// expect to result value
var assert = function(expects, result, desc) {
  // Update test counter
  tests_count++;
  document.getElementById('tests_count').innerHTML = tests_count;

  // Run assert
  if (passed(expects, result, desc)) {
    write_passed(desc);
  } 

  // Update result counters
  var p = document.getElementById('tests_passed');
  p.innerHTML = tests_passed;
  if (tests_count == tests_passed) {
    p.setAttribute('class', 'ok');
  }
  p = document.getElementById('tests_failed');
  p.innerHTML = tests_failed;
  if (tests_failed > 0) {
    p.setAttribute('class', 'error');
  }
};

// Expects result to be true
var assertTrue = function(result, desc) {
  assert(true, result, desc);
};

// Expects a false result
var assertFalse = function(result, desc) {
  assert(false, result, desc);
};

// Assert with generator as argument
var assertGen = function(generator, input, expects, desc) {
  if (core.isArray(generator)) {
    assert(expects, core.map(function(g) { return g(input).result; }, generator), desc);
  } else if (core.isFunction(expects)) {
    assertTrue(expects(generator(input).result), desc);
  } else {
    assert(expects, generator(input).result, desc);
  }
};

// Assert generator throws an exception
var assertException = function(gen, input, desc) {
  try {
    gen(input);
    write_failed(desc, "Exception expected, but not thrown!");
  } catch(e) {
    write_passed(desc);
  }
};

// Custom recursive value comparator with
// support for object and array comparison.
var passed = function(expects, result, desc) {
  if (core.isObject(expects)) {
    for (var name in expects) {
      if (!passed(expects[name], result[name], desc)) {
       write_failed(desc, "Error: expected '" + expects[name] + "' but result is '" + result[name] + "' !");
       return false;
      }
    }
  } else if (core.isArray(expects)) {
    if (expects.length != result.length) {
      write_failed(desc, "Error: array length mismatch, expecting '" + expects.length + 
          "' but result is '" + result.length + "' !");
      return false;
    }
    for (var i = 0; i < expects.length; i++) {
      if (!passed(expects[i], result[i], desc)) {
        write_failed(desc, "Error: expected '" + expects[i] + "' but result is '" + result[i] + "' !");
        return false;
      }
    }
  } else {
    if (expects !== result) {
      write_failed(desc, "Error: expected '" + expects + "' but result is '" + result + "' !");
      return false;
    }
  }
  return true;
};

// Writes test case passed massage
var write_passed = function(desc) {
  tests_passed++;
  document.writeln(desc + " - <span class='ok'>OK</span><br/>");
};

// Writes test failed message
var write_failed = function(desc, msg) {
  tests_failed++;
  document.writeln(desc + " - <span class='error'>" + msg + "</span><br/>");
};

