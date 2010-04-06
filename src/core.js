/**
 * 'Core' module combines 'Utils' and 'Core' namespace.
 *
 * @module Popcorn.Core
 */

/**
 * Root Popcorn namespace.
 *
 * @namespace Popcorn
 * @author Adam Smyczek
 */
var Popcorn = Popcorn || {}; 

// --------------------------------------------------------------------------

/**
 * 'Utils' namespace contains helper functions used by all Popcorn modules.
 *
 * @namespace Popcorn.Utils
 * @author Adam Smyczek
 */
Popcorn.Utils = function () {

  var lib = {};

  /**
   * Applies function 'f' on all elements of array 'as'. <br/>
   * <code>map(f, as) => [f(as[i])]</code>
   *
   * @function {any[]} map
   * @param {function} f - function.
   * @param {any[]} as - input array.
   */
  var map = lib.map = function(f, as) {
    var ar = arrayOf(as), 
        l  = as.length,
        r  = [];
    for (var i = 0; i < l; i++) r[i] = f(ar[i]);
    return r;
  };

  /**
   * Creates a new object with the argument objects as prototype.
   *
   * @function {object} clone
   * @param {object} o - the object to clone.
   */
  var clone = lib.clone = function(o) {
    O.prototype = o; 
    return new O();
  };
  var O = function() {};

  /**
   * Merges argument objects together.
   * This function copies all attributes of all argument 
   * objects into one. Use with care, name conflicts are 
   * not handled, attributes can be overwritten.
   *
   * @function {object} merge
   * @param {object+} os - one ore more objects to merge.
   */
  var merge = lib.merge = function() {
    var args = args2array(arguments), r = {}, arg;
    for (var i = 0, l = args.length; i < l; i++) {
      arg = args[i];
      for (name in arg) {
        r[name] = arg[name];
      }
    }
    return r;
  };

  /**
   * Converts JavaScript function arguments to an array. <br/>
   * For example:
   * <pre>
   *   function() {
   *     var args = args2array(arguments);
   *     <i>...</i>
   *   }
   * </pre>
   *
   * @function {any[]} args2array
   * @param {arguments} args - the JavaScript function 'arguments'.
   */
  var args2array = lib.args2array = function(args) {
    return Array.prototype.slice.apply(args);
  };

  /**
   * Function arguments parser for 'range' functions. <br/>
   * A 'range' function performs operations on an input 
   * range between a min and max integer value. 
   * A 'range' function takes no arguments, or one or two 
   * integer arguments. Bases on arguments the function is 
   * called with and the provided default 'min' and 'max' 
   * values, 'args2rage' returns the following range array:
   * <ul>
   *   <li>no args  -> [min, max]</li>
   *   <li>one arg  -> [min, arg one]</li>
   *   <li>two args -> [arg one, arg two]</li>
   * </ul>
   * For example:
   * <pre>
   *   function() {
   *     var min_max = args2range(arguments);
   *     <i>...</i>
   *   }
   * </pre>
   * @see Popcorn.Common.range for an example range function.
   *
   * @function {any[]} args2range
   * @param {arguments} args - the JavaScript function 'arguments'.
   * @param {integer} min - range min value used when no arguments are passed to the range function.
   * @param {integer} max - range max value used when no or one argument is passed to the range function.
   */
  var args2range = lib.args2range = function(args, min, max) {
    var a0 = min, a1 = max, as = args2array(args);
    switch(as.length) {
      case 1 : a1 = intOf(as[0]);
               break;
      case 2 : a0 = intOf(as[0]),
               a1 = intOf(as[1]);
               break;
    }
    return [Math.min(a0, a1), Math.max(a0, a1)];
  };

  /**
   * 'typeOf' extends JavaScript 'typeof' operator with
   * support for 'null', 'undefined', 'array' and 
   * 'date' types.
   * See '<a target="_blank" href="http://javascript.crockford.com/remedial.html">Remedial JavaScript</a>'
   * for more details.
   *
   * @function {string} typeOf
   * @param {any} inp - any variable, object etc.
   * @return a string representation of the type, for example 'null', 'array', 'data'.
   */
  var typeOf = lib.typeOf = function(inp) {
    var undefined;
    if (inp === null) return 'null';
    if (inp === undefined) return 'undefined';

    var ot = typeof(inp);
    if (ot !== 'object') return ot;
    if ((typeof(inp.length) === 'number') &&
      !(inp.propertyIsEnumerable('length')) &&
      (typeof(inp.splice) === 'function')) {
        return 'array';
      }
    if (!isNaN (new Date(inp).getDate())) {
      return 'date';
    }
    return 'object';
  };

  /**
   * @function {boolean} isNull
   * @param {any} inp - any variable, object etc.
   * @return true if the input is null.
   */
  var isNull = lib.isNull = function(inp) {
    return typeOf(inp) === 'null';
  };

  /**
   * @function {boolean} isUndefined
   * @param {any} inp - any variable, object etc.
   * @return true if the input is undefined.
   */
  var isUndefined = lib.isUndefined = function(inp) {
    return typeOf(inp) === 'undefined';
  };

  /**
   * @function {boolean} isString
   * @param {any} inp - any variable, object etc.
   * @return true if the input is a string.
   */
  var isString = lib.isString = function(inp) {
    return typeOf(inp) === 'string';
  };

  /**
   * @function {boolean} isNumber
   * @param {any} inp - any variable, object etc.
   * @return true if the input is a number.
   */
  var isNumber = lib.isNumber = function(inp) {
    return typeOf(inp) === 'number';
  };

  /**
   * @function {boolean} isInt
   * @param {any} inp - any variable, object etc.
   * @return true if the input is an int.
   */
  var isInt = lib.isInt = function(inp) {
    try {
      var i = numberOf(inp);
      return Math.floor(i) === i;
    } catch(e) {
      return false;
    }
  };

  /**
   * @function {boolean} isFunction
   * @param {any} inp - any variable, object etc.
   * @return true if the input is a function.
   */
  var isFunction = lib.isFunction = function(inp) {
    return typeOf(inp) === 'function';
  };

  /**
   * @function {boolean} isArray
   * @param {any} inp - any variable, object etc.
   * @return true if the input is an array.
   */
  var isArray = lib.isArray = function(inp) {
    return typeOf(inp) === 'array';
  };

  /**
   * @function {boolean} isDate
   * @param {any} inp - any variable, object etc.
   * @return true if the input is a date object.
   */
  var isDate = lib.isDate = function(inp) {
    return typeOf(inp) === 'date';
  };

  /**
   * @function {boolean} isObject
   * @param {any} inp - any variable, object etc.
   * @return true if the input is an object (not an array of function).
   */
  var isObject = lib.isObject = function(inp) {
    return typeOf(inp) === 'object';
  };

  /**
   * @function {string} stringOf
   * @param {any} inp - any variable, object etc.
   * @return the input object if it is a string and throws an exception otherwise.
   * @throws an exception if input is not a string.
   */
  var stringOf = lib.stringOf = function(inp) {
    if (!isString(inp)) {
      throw "Invalid input '" + inp + "', expecting a String!";
    }
    return inp;
  };

  /**
   * @function {number} numberOf
   * @param {any} inp - any variable, object etc.
   * @return the input object if it is a number and throws an exception otherwise.
   * @throws an exception if input is not a number.
   */
  var numberOf = lib.numberOf = function(inp) {
    if (!isNumber(inp)) {
      throw "Invalid input '" + inp + "', expecting a Number!";
    }
    return inp;
  };

  /**
   * 'intOf' truncates the input to an int if the input object is a number.
   * An exception is thrown when the input is not a number.
   *
   * @function {integer} intOf
   * @param {any} inp - any variable, object etc.
   * @return the input object if it is an int and throws an exception otherwise.
   * @throws an exception if input is not an int.
   */
  var intOf = lib.intOf = function(inp) {
    try {
      return Math.floor(numberOf(inp));
    } catch(e) {
      throw "Invalid input '" + inp + "', expecting an Integer!";
    }
  };

  /**
   * @function {function} functionOf
   * @param {any} inp - any variable, object etc.
   * @return the input object if it is a function and throws an exception otherwise.
   * @throws an exception if input is not a function.
   */
  var functionOf = lib.functionOf = function(inp) {
    if (!isFunction(inp)) {
      throw "Invalid input '" + inp + "', expecting a Function!";
    }
    return inp;
  };

  /**
   * @function {date} dateOf
   * @param {any} inp - any variable, object etc.
   * @return the input object if it is a date object or a date string.
   * @throws an exception if input is not a date object.
   */
  var dateOf = lib.dateOf = function(inp) {
    var d = (isString(inp))? new Date(Date.parse(inp)) : inp;
    if (!isDate(d)) {
      throw "Invalid input '" + inp + "', expecting an Date object or parsable date string!";
    }
    return d;
  };

  /**
   * @function {any[]} arrayOf
   * @param {any} inp - any variable, object etc.
   * @return the input object if it is an array and throws an exception otherwise.
   * @throws an exception if input is not an array.
   */
  var arrayOf = lib.arrayOf = function(inp) {
    if (!isArray(inp)) {
      throw "Invalid input '" + inp + "', expecting an Array!";
    }
    return inp;
  };
  
  return lib;

}(); 

// --------------------------------------------------------------------------

/**
 * 'Core' namespace defines the basic generators for JavaScript primitive types
 * and objects. <br/>
 * The generator library is build on top of the monadic combinators
 * 'return' and 'bind' called 'gen' and 'chain'. However for 
 * better performance most internal generators have imperative implementations.<br/>
 *
 * @namespace Popcorn.Core
 * @author Adam Smyczek
 */
Popcorn.Core = function (utils) {

  // This package object extends utils.
  var lib = utils.clone(utils);

  // ------ Basic operators ------

  /**
   * 'gen' creates a generator that returns the argument value 'v' 
   * when executed on any input object. 'gen' is basically a generator
   * constructor that wraps any value into a generator.<br/>
   * For example:
   * <pre>
   *   var g = gen('test');
   *   g('any input') will return 'test'.
   * </pre>
   *
   * @function {generator} gen
   * @param {any} inp - any variable, object etc.
   * @return a {@link generator} which executed returns the value 'v'.
   */
  var gen = lib.gen = function(v) {
    return function (_, s) { return { result: v, state: s }; };
  };

  /**
   * Use 'chain' to execute generators in sequence. 'chain' 
   * executes the argument generator or generator array 'g'
   * and passes the result to the parameter function 'f'.
   * 'f' may evaluate the result but always has to return 
   * a new generator. 'chain' itself is a generator that can 
   * be evaluated or passed to another chain or other 
   * generator function.<br/>
   * For example:
   * <pre>
   *   var g = chain(gen(1), function(r) { return gen(r + 1); });
   *   g('any input') will evaluate to 2.
   * </pre>
   *
   * @function {generator} chain
   * @paramset 
   * @param {generator} g - a {@link generator}
   * @param {function} f - a function that takes the result of the generator
   * 'g' and returns a new generator as result.
   *
   * @paramset 
   * @param {generator[]} gs - {@link generator} array
   * @param {function} f - a function that takes the array result 
   *   of all generators 'gs' and returns a new generator as result.
   *
   * @return the 'chain' generator.
   */
  var chain = lib.chain = function(g, f) {
    return function(o, s) {
      if (utils.isArray(g)) {
        var r = seq(g, cConcat)(o, s);
        return f(r.result)(o, r.state);
      } else {
        var r = g(o, s);
            a = f(r.result);
        return (utils.isArray(a))? seq(a, cConcat)(o, r.state) : a(o, r.state);
      }
    };
  };

  /**
   * 'seq' executes the generators 'gs' and combines the result using
   * {@link combinator} function 'f'. Combinator 'f' is called on every 
   * step with the result of previous executions ('init' value on first call) 
   * and the result of the current generator evaluation. <br/>
   * For example:
   * <pre>
   *   var g = seq([gen('a'), gen('b'), gen('c')], cJoin, 0);
   *   g('any input') will return 'abc'.
   * </pre>
   *
   * @function {generator} seq
   * @param {generator[]} gs - {@link generator} array.
   * @param {combinator} f - {@link combinator} function.
   * @param {any} init - the initial value passed on first call to the {@link combinator}.
   *
   * @see Popcorn.Core.cConcat
   * @see Popcorn.Core.cJoin
   *
   * @return the sequence generator that evaluates the generators 'gs' when executed.
   */
  var seq = lib.seq = function(gs, f, init) {
    return function(o, s) {
      if (gs.length > 0) {
        var r = init, ns = s, ir;
        for (var i = 0, l = gs.length; i < l; i++) {
          ir = gs[i](o, ns);
          r = f(r, ir.result, i);
          ns = ir.state;
        };
        return { result: r, state: ns };
      }
      return { result: o, state: s };
    };
  };

  /**
   * Repeats value 'v' 'n'-times and returns the resulting array.
   * If parameter 'v' is an array, the subsequent results are concatenated.
   * 'repeat' is commonly used with object generators, for example:
   * <pre>
   *   var gen = {
   *     name : repeat(3, gen('abc'))
   *   }
   *   will generate three objects { name : 'abc' } when evaluated with {@link generate}.
   * </pre>
   * See {@link Popcorn.Core.generate} for details.
   *
   * @function {any[]} repeat
   * @param {integer} n - repeat count.
   * @param {any} v - object or generator to repeat.
   */
  var repeat = lib.repeat = function(n, v) {
    var c  = Math.max(1, utils.intOf(n)),
        vs = [];
    if (utils.isArray(v)) {
      while (c--) vs.push.apply(vs, v);
    } else if (utils.isFunction(v)) {
      while (c--) vs.push(v);
    } else {
      while (c--) vs.push(gen(v));
    }
    return vs;
  };

  /**
   * 'replicate' executes generator 'g' 'n'-times and combines 
   * the results using {@link combinator} function 'f'. 
   * This function is a specialization of {@link seq}. <br/> 
   * Example:
   * <pre>
   *   var overflow = replicate(gen('A'), cJoin, '');
   *   overflow(5) generates 'AAAAA'
   * </pre>
   *
   * @function {generator} replicate
   * @param {generator} g - a {@link generator}.
   * @param {combinator} f - {@link combinator} function.
   * @param {any} init - the initial value for the {@link combinator} function 'f'.
   * @see Popcorn.Core.seq
   * @return the replicator generator
   */
  var replicate = lib.replicate = function(g, f, init) {
    return function(n) {
      var c  = Math.max(1, utils.intOf(n)),
          gs = [];
      for (var i = 0; i < c; i++) gs[i] = g;
      return seq(gs, f, init);
    };
  };

  /**
   * 'cConcat' {@link combinator} function concatenates the results 
   * of generators executed in sequence into one array. <br/>
   * For example:
   * <pre>
   *   seq([gen(1), gen(2)], cConcat)() => [1,2]
   * </pre>
   * 'cConcat' can be used in combination with {@link seq] and {@link replicate}.
   *
   * @function {any} cConcat
   * @param {any} r - combined result of previous executions.
   * @param {any} n - result of current generator evaluation.
   */
  var cConcat = lib.cConcat = function(r, n) { return (r || []).concat(n); };

  /**
   * 'cJoin' combinator function joins the results of generators
   * executed in sequence into one string. <br/>
   * For example:
   * <pre>
   *   seq([gen(1), gen(2)], cJoin)() => '12'
   * </pre>
   * 'cJoin' can be used in combination with {@link seq] and {@link replicate}.
   *
   * @function {any} cJoin
   * @param {any} r - combined result of previous executions.
   * @param {any} n - result of current generator evaluation.
   */
  var cJoin = lib.cJoin = function(r, n) { return (r || '') + n; };

  // ------ Handling objects ------

  /**
   * 'property' applies generator 'g' on an object property of name 
   * 'name' and returns the resulting object. 'property' acts as a 
   * property selector and is a generator itself that can be 
   * evaluated or passed to other generators. <br/>
   * For example:
   * <pre>
   *   var o    = { name:'Woody', toy:'cowboy' };
   *   var name = property('name');
   *   name(gen('Buzz'))(o) will return the object { name:'Buzz', toy:'cowboy' }
   * </pre>
   *
   * @function {generator} property
   * @param {string} name - object property name.
   */
  var property = lib.property = function(name) {
    return function(g) { 
      return function(o, s) { 
        var r = g(o[name]);
        o[name] = r.result;
        return { result: o, state: r.state };
      };
    };
  };

  /**
   * Executes generators 'gs' on an input object
   * and returns the updated object. <br/>
   * For example:
   * <pre>
   *   var o    = { name: 'Woody', toy: 'cowboy' };
   *   var name = property('name');
   *   var toy  = property('toy');
   *   update([name(gen('Buzz')), toy(gen('action figure'))])(o) will return the object 
   *   { name:'Buzz', toy:'action figure' }
   * </pre>
   *
   * @function {generator} update
   * @param {generator[]} gs - {@link generator} array.
   */
  var update = lib.update = function(gs) { 
    return seq(gs, function(r, n) { return r || n; }); 
  };

  // New object constructor function used for object
  // 'mutate' and 'permutate' functions.
  var O = function() {};

  /**
   * 'mutate' executes generators 'gs' on an object property
   * of name 'name'. The result is an array that contains
   * one result object for every generator result value.<br/>
   * For example:
   * <pre>
   *   var o = { name: 'Woody', age:2 };
   *   mutate('name', [gen('Buzz'), gen('Woody')](o) will return 
   *   the object array [{ name:'Buzz', age:2 }, { name:'Woody', age:2 }]
   * </pre>
   *
   * @function {generator} mutate
   * @param {string} name - object property name.
   * @param {generator[]} gs - {@link generator} array.
   */
  var mutate = lib.mutate = function(name, gs) {
    return function(o, s) {
      if (gs.length > 0) {
        var r = [], ns = s, n;
        for(var i = 0, l = gs.length; i < l; i++) {
          var gr = gs[i](o[name], ns);
          ns = gr.state;

          // Mutate on an array
          if (utils.isArray(gr.result)) {
            for (var j = 0, jl = gr.result.length; j < jl; j++) {
              O.prototype = o;
              n = new O();
              n[name] = gr.result[j];
              r.push(n);
            }

          // Mutate on a group generator
          } else if (utils.isObject(gr.result) && (gr.result._array_result === true)) {
            var ogr = (utils.isArray(gr.result._generator))?
                  seq(gr.result._generator, cConcat)(o[name], ns) :
                  gr.result._generator(o[name], ns);
            ns = ogr.state;
            O.prototype = o;
            n = new O();
            n[name] = ogr.result;
            if (gr.result._join_result === true) n[name] = n[name].join();
            r.push(n);

          // Mutate on an inner-object
          } else if (utils.isObject(gr.result)) {
            var ogr = generateWithState(gr.result, o[name], ns);
            ns = ogr.state;
            for (var k = 0, kl = ogr.result.length; k < kl; k++) {
              O.prototype = o;
              n = new O();
              n[name] = ogr.result[k];
              r.push(n);
            }

          // All other values
          } else {
            n = new O();
            n[name] = gr.result;
            r.push(n);
          }
        };
        return { result: r, state: ns };
      }
      return { result: [o], state: s };
    };
  };

  /**
   * 'permutate' applies every generator on all
   * results from previous generator executions 
   * beginning with the input object. See examples 
   * for details.
   *
   * @function {generator} permutate
   * @param {generator[]} gs - {@link generator} array.
   */
  var permutate = lib.permutate = function(gs) {

    // Recursive permutate helper applies 
    // generator 'g' on all objects 'os'.
    var per_impl = function(g, os, s) {
      var rs = [], rr, ns = s, r;
      for (var i = 0, l = os.length; i < l; i++) {
        O.prototype = os[i];
        r = g(new O(), ns);
        ns = r.state;
        rs.push.apply(rs, r.result);
      }
      return { result: rs, state: ns };
    };

    return function(o, s) {
      if (gs.length > 0) {
        var rs = [o], ns = s, r;
        for (var i = 0, l = gs.length; i < l; i++) {
          r = per_impl(gs[i], rs, ns);
          ns = r.state;
          rs = r.result;
        }
        return { result: rs, state: ns };
      }
      return { result: [o], state: s };
    };
  };

  /** 
   * Main object generator execution function.
   * 'generate' executes the argument object generator 
   * 'gen' on the base test case 'base' and returns the 
   * resulting object array.<br/>
   * For example: 
   * <pre>
   *   var base = { name: 'Woody', age:2 }; 
   *   var gen  = { name: list('Buzz', 'Slinky'), age:range(2,4) }; 
   *   generate(gen, base) will return the array: 
   *    [{ name: 'Buzz',   age: 2 },
   *     { name: 'Buzz',   age: 3 }, 
   *     { name: 'Buzz',   age: 4 }, 
   *     { name: 'Slinky', age: 2 }, 
   *     { name: 'Slinky', age: 3 }, 
   *     { name: 'Slinky', age: 4 }]
   * </pre>
   *
   * @function {object[]} generate
   * @param {object} gen - the generator object.
   * @param {object} base - the base test case object.
   * @param {object} state - an optional state object that
   *    can be read and manipulated by any generator.
   */
  var generate = lib.generate = function(generator, base, state) {
    return generateWithState(generator, base, state).result;
  };

  /**
   * Same as {@link generate} but returns the generator result object:
   *
   * <pre><code>
   *   {
   *     result: value,    // generator result
   *     state : state_obj // state object passed to the generate function
   *   }
   * </code></pre>
   *
   * This function may become handy if the generators
   * manipulate the state object, for example to accumulate statistics
   * that need to be accessed after the generation process finished.
   */
  var generateWithState = lib.generateWithState = function(generator, base, state) {
    var s = state || {};
    var v, prop, gs = [];
    for (var name in generator) {
      v     = generator[name];

      // Handle arrays
      if (utils.isArray(v)) {
        gs.push(mutate(name, v));

      // Handle functions
      } else if (utils.isFunction(v)) {
        gs.push(mutate(name, [v]));

      // and everything else
      } else {
        gs.push(mutate(name, [gen(v)]));
      }
    }

    return permutate(gs)(base, s);
  };

  // ------ State and variables ------

  /**
   * 'setVar' stores the result of one generator that can be used
   * as input to another generator in same generation process. <br/>
   * For example:
   *
   * <pre>
   *   var g = {
   *     int   : setVar('my_rand', random().int()),
   *     plus1 : withVar('my_rand', function(i) { return gen(i + 1); })
   *   }
   * </pre>
   *
   * The random integer value generated for attribute 'int' is stored
   * in the state object under the attribute name 'my_rand' and referenced
   * using {@link withVar} function.
   *
   * @function {generator} setVar
   * @param {string} name - variable name the generator value is stored for.
   * @param {generator} g - the generator to execute.
   * @return result of the generator 'g'.
   */
  var setVar = lib.setVar  = function(name, g) {
    return function(o, s) { 
      var r = g(o, s);
      r.state[name] = r.result;
      return gen(r.result)(o, r.state);
    };
  };

  /**
   * 'withVar' provides access to variables stored using {@link setVar}
   * generator. It takes the variable name and a function as argument. 
   * The value of the variable is passed to the function that has 
   * to return another generator as result. 
   * For an example see {@link setVar} generator.
   *
   * @function {generator} withVar
   * @param {string} name - variable name.
   * @param {function} f - takes the variable as argument and returns 
   *     a new generator as result.
   */
  var withVar = lib.withVar = function(name, f) {
    return function (o, s) { 
      return f(s[name])(o, s);
    };
  }; 

  /**
   * Creates a generator that returns the value of the
   * variable 'name' when executed. For example:
   *
   * <pre>
   *   var g = {
   *     att1 : setVar('my_rand', random().int()),
   *     att2 : varGen('my_rand')
   *   }
   * </pre>
   * will generate an object with same value for 
   * both attributes.
   *
   * @function {generator} varGen
   * @param {string} name - variable name.
   */
  var varGen = lib.varGen = function(name) {
    return function (o, s) { 
      return gen(s[name])(o, s);
    };
  };

  /**
   * 'withState' provides access to the state object.
   * The function 'f' takes the state object as argument
   * and returns another generator as result. All modifications
   * to the state object are visible to other generators.
   * For example:
   *
   * <pre>
   *   var g = {
   *     int : withState(function(s) { s.init = 10; return random().int(); } ),
   *     add : withState(function(s) { return gen(s.init + 10); } )
   *   }
   * </pre>
   *
   * @function {generator} withState
   * @param {function} f - takes the state object as argument and 
   *    returns a new generator as result.
   */
  var withState = lib.withState = function(f) {
    return function (o, s) { 
      return f(s)(o, s);
    };
  }; 

  /**
   * Group generator results into array
   *
   * @function {generator} array
   * @param {function} g - the generator to wrap
   */
  // A work-around for not supporting seq-monad yet!
  var array = lib.array = function(g) {
      return gen({ _array_result : true, _generator : g });
  };

  // ------ Core random generators ------

  /**
   * Creates a linear congruential random generator object using an optional 
   * 'seed' value. If 'seed' is not defined, the default JavaScript Math.random() 
   * function is used. See Wikipedia 
   * <a href="http://en.wikipedia.org/wiki/Linear_congruential_generator">LCR</a>
   * for details.
   *
   * @function {random} random
   * @param {integer} seed - an optional seed.
   * @return the random generator object.
   */
  var random = lib.random = function(seed) {
    var m = 4294967296, // 2^32
        a = 1103515245, // glibc conform multiplier
        c = 12345,      // and increment
        s = seed || Math.floor(Math.random() * m),
        x = s % m;

    // Moves to the next pseudo-random value in the sequence
    // and generates next int in the range from min to max.
    var nextInt = function(min, max) {
        x = (a * x + c) % m;
        return Math.floor(min + x/m * (max - min));
    };

    /**
     * Random generator object.
     * This object implements all {@link Popcorn.Core.RandomLib}
     * generator functions.
     *
     * @object Popcorn.Core.Random
     */
    var rand = utils.clone(RandomLib);

    /**
     * A random integer generator. 'int' is a rage function
     * that generates a value between min and max, depending
     * on arguments the function is called with.
     *
     * @function {generator} int
     * @paramset No arguments - the generator returns a random value between 0 and 100.
     * @paramset One int argument - the generator returns a random value between 0 and max.
     * @param {integer} max - max value.
     * @paramset Two int argument - the generator returns a random value between min and max.
     * @param {integer} min - from integer
     * @param {integer} max - to integer
     * @return a generator which executed generates a random integer.
     */
    rand.int = function() { 
      var mm = utils.args2range(arguments, 0, 1000); 
      return lazy(function() { return gen(nextInt(mm[0], mm[1])); }); 
    };

    /**
     * 'element' picks a random element from provided argument array 'as'.
     *
     * @function {generator} element
     * @param {any[]} as - array
     * @return the element generator which executed returns a random element
     * from argument array 'as'.
     */
    rand.element = function(as) { 
      if (as.length > 0) { 
        return lazy(function() { return gen(as[nextInt(0, as.length)]); }); 
      } 
      throw "Empty array or string!"; 
    };

    return rand;
  };

  /**
   * Extensible library class for random generators.
   * 'RandomLib' can be extended by other modules as following:
   * <pre>
   *   core.RandomLib.randomAlpha = function() {...}; 
   * </pre>
   * Once the module is loaded, 'randomAlpha' is available
   * in the {@link Random} object and can be executed as:
   * <pre>
   *   random().randomAlpha();
   * </pre>
   *
   * @class Popcorn.Core.RandomLib
   * @see Popcorn.Common.alpha
   */
  var RandomLib = lib.RandomLib = {}; 
  
  // ------ Other generator functions ------

  /** @scope Popcorn.Core */

  /**
   * Lazy generator evaluation wrapper
   * used for example by random generators. <br/>
   * For example:
   * <pre>
   *   var g1 = gen(Math.random());
   *   var g2 = lazy(function() { return gen(Math.random()); });
   *   g1 will always return the same value and g2 a different one
   *   when executed.
   * </pre>
   *
   * @function {generator} lazy
   * @param g - the {@link generator} to wrap.
   */
  var lazy = lib.lazy = function(g) {
    return function(o, s) { return g(o, s)(o, s); };
  };

  /**
   * 'mapGen' is a helper function that
   * converts all elements of an array to
   * generators. <br/>
   * <code>magGen(as) -> [gen(as[i])]</code>
   *
   * @function {generator[]} mapGen
   * @param {any[]} vs - array.
   */
  var mapGen = lib.mapGen = function(vs) {
    return utils.map(gen, vs);
  };

  return lib;

}(Popcorn.Utils);


