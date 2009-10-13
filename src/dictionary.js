/**
 * @module Popcorn.Dictionary
 * @requires Popcorn.Core
 */

/**
 * Base functions and objects to build dictionaries.
 *
 * @namespace Popcorn.Dictionary
 * @author Adam Smyczek
 * @author Brian Wilkerson
 */
Popcorn.Dictionary = function (core) {

  var lib = {};

  /**
   * Creates a {@link Dict} object for an dictionary array. <br/>
   * For example:
   * <pre>
   *   The pronouns dictionary
   *     var pronoun = dictionary(['I', 'you', 'he', 'she', 'it']);
   *   provides generators:
   *     pronoun.list(), pronoun.element(), etc.
   * </pre>
   *
   * @function {object} dictionary
   * @param {any[]} dict - a dictionary array.
   * @return a dictionary object.
   */
  var dictionary = lib.dictionary = function(dict) {

    /**
     * A base dictionary object provides common
     * generators for array dictionaries.
     *
     * @object Popcorn.Dictionary.Dict
     */
    return {

      /**
       * Creates a generator to list dictionary elements.
       * By default all dictionary elements are listed. If 'n' > dict.length 
       * the resulting elements are repeated in loop.
       * 'list' is a range function that takes no arguments, or
       * one or two integer arguments.
       *
       * @function {generator} list
       * @paramset No arguments - the generator returns the entire dictionary.
       * @paramset One int argument - the generator returns the first n elements.
       * @param {integer} n - element count.
       * @paramset two int arguments - the generator returns elements from n to m
       * @param {integer} n - from list index
       * @param {integer} m - to list index
       *
       * @see Popcorn.Utils.args2range
       */
      list : function() { 
               var mm = core.args2range(arguments, 0, dict.length),
                   ar = dict, r = new Array(l); 
               while (ar.length < mm[1]) ar = ar.concat(dict); 
               for (var i = 0, l = mm[1] - mm[0]; i < l; i++) {
                 r[i] = core.gen(ar[mm[0] + i]);
               }
               return r;
             },

      /**
       * 'element' returns one random dictionary element.
       * This generator uses a random generator 'rand' if 
       * provided, otherwise creates a new {@link Popcorn.Core.random}
       * generator.
       *
       * @function {generator} element
       * @param {random} rand - a random generator 'random()'.
       * 
       * @see Popcorn.Core.random
       */
      element : function(rand) { 
                 var r = rand || core.random();
                 return core.lazy(function() { return r.element(dict); }); 
               }

    };

  };

  // ------ Lorem ipsum ------

  var lorem_ipsum = [
    'Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipisicing', 'elit,',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua.', 'Ut', 'enim', 'ad', 'minim', 'veniam,', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
    'commodo', 'consequat.', 'Duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
    'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
    'pariatur.', 'Excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident,',
    'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
    'est', 'laborum.'];

  /** @scope Popcorn.Dictionary */

  /** 
   * Generate a <a target="_blank" href="http://en.wikipedia.org/wiki/Lorem_ipsum">lorem ipsum</a> 
   * content of the length 'n'. 
   * This function returns the lorem ipsum if 'n' is not defined.
   *
   * @function {generator} loremIpsum
   * @param {integer} n - optional length of the generated lorem ipsum content.
   */
  var loremIpsum = lib.loremIpsum = function(n) {
    var l = n || lorem_ipsum.length;
    return core.gen(lorem_ipsum.slice(0, l).join(" "));
  };

  return lib;

}(Popcorn.Core);

