/**
 * Popcorn is a JavaScript embedded DSL designed for quick, ease and
 * flexible JSON object generation. The core modules provides a basic set
 * of generators for most common JavaScript types, and combinators to build
 * new generators for any kind of data. Additional modules extend the 
 * functionality with random generators, dictionaries, network type 
 * generators for IP or mac address and more. <br/>
 * <br/>
 * Main purpose of this framework is mock object generation for testing
 * of JSON services and browser side JavaScript code. Since with this 
 * DSL thousands of test cases can be expressed in just few lines of code, 
 * it makes for a great driver for data-driven test engines. <br/>
 * <br/>
 * 
 * Quick start:
 * <pre><code>
 * with(Popcorn.Core) {
 * with(Popcorn.Common) { // Load other modules as needed.
 *
 *   var base_object = { // Define the base object.
 *     id : 1, 
 *     name : 'Woody'
 *   };
 * 
 *   var generator = { // Define the generator object.
 *     id : range(10, 20),
 *     name : list('Buzz', 'Slinky')
 *   };
 * 
 *   // And run it!
 *   var results = generate(generator, base_object);
 * }}
 * </code></pre>
 *
 * @project Popcorn
 * @timestamp
 * @author Adam Smyczek
 * @author Brian Wilkerson
 * @description Popcorn - a DSL for JSON
 */

// --------------------------------------------------------------------------

// Global interface definitions

/** @scope Popcorn */

/**
 * A generator is a function that takes one argument and 
 * returns a value. Popcorn provides functions to create
 * and combine generators to build any kind of data.
 * See README for more information.
 *
 * @ifunction {any} generator
 * @param {any} input - any variable, object, etc.
 */

/**
 * A combinator function is used by {@link Popcorn.Core.seq} and
 * {@link Popcorn.Core.replicate} to accumulate results of 
 * subsequent generator executions.
 *
 * @ifunction {any} combinator
 * @param {any} r - the combined result from previous executions 
 *   or the initial value on first call.
 * @param {any} n - the result of the current generator execution.
 * @return the new accumulated result.
 *
 * @see Popcorn.Core.seq
 * @see Popcorn.Core.replicate
 */

