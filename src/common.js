/**
 * @module Popcorn.Common
 * @requires Popcorn.Core
 */

/**
 * A collection of most common generators.
 *
 * @namespace Popcorn.Common
 * @author Adam Smyczek
 */
Popcorn.Common = function (core) {

  var lib = {};

  // Some internal constants
  var alpha     = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var digit     = '0123456789';
  var alpha_num = alpha + digit;

  /**
   * 'range' generator creates a list of integer generators
   * in the range from min to max. This is a range function
   * and accepts no arguments, or one or two integer arguments. 
   * For example:
   * <pre>
   *   var o = { int : 0 }
   *   var gen = { int : range(1, 3);
   *   generate(gen, o) will return:
   *   [{ int : 1 }, { int : 2 }, { int : 3 }]
   * </pre>
   *
   * @function {generator[int]} range
   * @paramset No arguments - generates a range from 0 to 100.
   * @paramset One int argument - generates a range from 0 to max.
   * @param {integer} max - range max value.
   * @paramset two int arguments - from-to range.
   * @param {integer} min - from integer
   * @param {integer} max - to integer
   *
   * @see Popcorn.Utils.args2range
   */
  var range = lib.range = function() {
    var mm = core.args2range(arguments, 0, 100),
        l  = mm[1] - mm[0],
        r  = [];
    for (var i = 0; i <= l; i++) r[i] = core.gen(mm[0] + i);
    return r;
  };

  /**
   * Converts input arguments into a generator array [gen(arguments[i])]. <br/>
   * For example:
   * <pre>
   *   var o = { name : 'Woody' }
   *   var gen = { name : list('Buzz', 'Slinky');
   *   generate(gen, o) will return:
   *   [{ name : 'Buzz' }, { name : 'Slinky' }]
   * </pre>
   *
   * @function {generator[any]} list
   * @param {any+} args - the values to generate.
   */
  var list = lib.list = function() {
    var args = core.args2array(arguments);
    return function(o, s) {
      var rs = [], r;
      for (var i = 0, l = args.length; i < l; i++) {
        r = args[i];
        if (core.isArray(r)) {
          rs.push.apply(rs, list.apply(this, r)(o, s).result);
        } else {
          rs.push(r);
        }
      }
      return { result: rs, state: s };
    };
    // return core.mapGen(core.args2array(arguments));
  };

  /**
   * Joins arguments together. Generator arguments
   * are evaluated and array arguments join recursive.
   *
   * @function {generator} join
   * @param {any+} args - values, arrays or generators.
   */
  var join = lib.join = function() {
    var args = core.args2array(arguments);
    return function(o, s) {
      var rs = "", ns = s, r;
      for (var i = 0, l = args.length; i < l; i++) {
        var r = args[i];
        switch(core.typeOf(r)) {
          case 'function' :
            var gr = r(o, s);
            rs += gr.result;
            ns = gr.state;
            break;
          case 'array' :
            var gr = join.apply(this, r)(o, s);
            rs += gr.result;
            ns = gr.state;
            break;
          default:
            rs += r;
            break;
        }
      }
      return { result: rs, state: ns };
    };
  };

  // ------ Prepend/append generators ------

  // Internal prepend/append function prepends/appends 
  // to default value based on handler function.
  var pre_a_pend = function(h) {
    return function(g) {
      return function(o, s) {
        switch (core.typeOf(g)) {
          case 'array'    : 
            var rs = [], ns = s, r;
            for (var i = 0, l = g.length; i < l; i++) {
              r = pre_a_pend(h)(g[i])(o, ns);
              rs.push.apply(rs, r.result);
              ns = r.state;
            }
            return { result: rs, state: ns };
          case 'function' : 
            return core.chain(g, function(r) { return core.gen(h(r, o)); })(o, s); 
          default         : 
            return { result: h(g, o), state: s };
        };
      };
    };
  };

  /**
   * Prepends a value to the attribute value of the base object.
   * Prepend takes a value, an array or a generator as argument. <br/>
   * For example:
   * <pre>
   *   var o = { name : 'Head' }
   *   generate({ name : prepend('Mr. Potato ') }, o) will generate:
   *   [{ name : 'Mr. Potato Head' }]
   * </pre>
   *
   * @function {generator} prepend 
   * @paramset Value
   * @param {any} inp - the value to prepend. 
   * @paramset Array
   * @param {any[]} ar - the values to prepend. The resulting array
   *   contains one object for every array element.
   * @paramset generator
   * @param {generator} gen - the generator of which result is prepended
   *   to the base object value.
   */
  var prepend = lib.prepend = pre_a_pend(function(a, b) { return a + b; });
  
  /**
   * Appends a value to the attribute value of the base object.
   * See {@link prepend} for details.
   *
   * @function {generator} append 
   * @paramset Value
   * @param {any} inp - the value to append. 
   * @paramset Array
   * @param {any[]} ar - the values to append. The resulting array
   *   contains one object for every array element.
   * @paramset generator
   * @param {generator} gen - the generator of which result is appended
   *   to the base object value.
   */
  var append  = lib.append  = pre_a_pend(function(a, b) { return b + a; });

  // ------ Random generators extensions ------

  // Internal string generator builder.
  // Creates a generator for an argument char set,
  // see alpha and alphaNum.
  var randomString = function(char_set) {
    return function() {
      var mm      = core.args2range(arguments, 1, 100),
          int     = this.int(mm[0], mm[1]),
          element = this.element(char_set);
      return core.lazy(function(o, s) {
        var l = int().result, r = "";
        for (var i = 0; i < l; i++) r += element().result;
        return core.gen(r);
      });
    };
  };

  /** @scope Popcorn.Core.Random */
    
  /**
   * The range function 'alpha' generates a random alpha string. 
   * The length of the string depends on the arguments this
   * function is called with.
   *
   * @function {generator} alpha
   * @paramset No arguments - generates an alpha string of length between 0 and 100.
   * @paramset One int argument - generates an alpha string of length between 0 and 'max'.
   * @param {integer} max - max string length.
   * @paramset two int arguments - length range.
   * @param {integer} min - min length
   * @param {integer} max - max length
   *
   * @see Popcorn.Utils.args2range
   */
  core.RandomLib.alpha    = randomString(alpha);

  /**
   * Same as {@link alpha} but generates an alpha numeric string.
   *
   * @function {generator} alphaNum
   * @paramset No arguments - generates an alphaNum string of length between 0 and 100.
   * @paramset One int argument - generates an alphaNum string of length between 0 and 'max'.
   * @param {integer} max - max string length.
   * @paramset two int arguments - length range.
   * @param {integer} min - min length
   * @param {integer} max - max length
   *
   * @see Popcorn.Utils.args2range
   */
  core.RandomLib.alphaNum = randomString(alpha_num);

  /** @scope Popcorn.Common */

  /**
   * Date generator.
   *
   * @function {generator} date
   * @param {date} d - the JavaScript date object or a date string representation, for example 'Sep. 13 2009'.
   * @param {string} format - the output format, possible values are: date, hours, minutes, seconds, time, gmt.
   * By default date generates the local time string.
   */
  var date = lib.date = function(d, format) {
    var cdate = core.dateOf(d);
    switch(format) {
      case 'date'   : return core.gen(cdate.getDate());
      case 'hours'  : return core.gen(cdate.getHours());
      case 'minutes': return core.gen(cdate.getMinutes());
      case 'seconds': return core.gen(cdate.getSeconds());
      case 'time'   : return core.gen(cdate.getTime());
      case 'gmt'    : return core.gen(cdate.toString());
      default       : return core.gen(cdate.toLocaleString());
    }
  };

  /**
   * A convenience function that creates a generator for current date/time.
   *
   * @function {generator} now
   * @param {string} format - the output format, possible values are: date, hours, minutes, seconds, time, gmt.
   * By default data prints the local time string.
   * @see Popcorn.Common.date
   */
  var now = lib.now = function(format) {
    return date(new Date(), format);
  };

  return lib;

}(Popcorn.Core);

