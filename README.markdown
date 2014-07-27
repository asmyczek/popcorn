Popcorn - the JSON fuzzer
=========================

## Description

Popcorn is a JavaScript embedded DSL designed for fast, easy and
flexible JSON object generation. Popcorn core modules provides a basic set
of generators for most common JavaScript types and combinators to build
new generators for any kind of data. Additional modules extend the 
functionality with random generators, dictionaries, network type
generators for IP or mac addresses and more.

Popcorn can be used to generate mock objects for testing of JSON services
or browser side JavaScript code. With Popcorn thousands of test cases
can be expressed in just few lines of code which makes it a great driver for
data driven test engines.

You can give it a try at [popcorn maker](http://mu-labs.googlecode.com/svn/trunk/eng/tools/popcorn/popcorn_maker.html).

## Getting started

The library consists of several independent loadable modules build on
top of the core framework. To setup the generator:

  1. Load only required modules or module All.
  2. Define base test case JSON object.
  3. Define generator object and assign generators to attributes you intend to fuzz.
  4. Run `permutate` or `circulate` function to generate test objects.

For example:

<pre><code>
	// Load modules containing generators used in this scope.
	with({ core: Popcorn.Core, comm: Popcorn.Common }) {

		var base_object = { // Define the base test case object.
			id   : 1, 
			name : 'Woody'
		};

		var generator = { // Define the generator object. 
			name : comm.list('Buzz', 'Slinky') // Alter only the name attribute.
		};

		// And run...
		var results = core.permutate(generator, base_object);

	}
</code></pre>

## Generators 101

In the basics, generators are functions that take one argument value 
and return a result value with an optional state. Core function
`gen()` creates the most basic generator that substituts any input with
the parameter value passed to `gen()`.
<pre><code>
	var g = gen('test'); // Create a generator g with value 'test'.
	g('any input')       // Execute the generator g. The result is 'test'.
</code></pre>

Another basic combinator is `prepend()`:

<pre><code>
	var p = prepend('Hello ');
	p('world'); // returns 'Hello world'
	p('Buzz'); // returns 'Hello Buzz', etc.
</code></pre>

Some generators accept other generators or generator arrays as argument.
For example `append(g)` executes the generator `g` and appends the
result to the input value:

<pre><code>
	var r = random().int(), // See next section for random generators.
	    a = append(r);
	    a('user'); // Will return for example 'user42' or 'user573' etc.
</code></pre>

Generator `chain()` can be used to execute generators in sequence.
For example a random user name genarator can be implemented as following:

<pre><code>
	var r = random().int(),
	    u = chain(r, function(i) { return append('-' + i); });
	    u('admin'); // Will return for example 'admin-385' or 'admin-712', etc.
</code></pre>

`chain()` takes the random generator and a function as argument. It executes 
the generator and passes the result to the function that returns a new generator 
as result. `chain()` always has to return another generator, so it can be 
chained with another generator or just evaluated.

Random user name generator can be useful already. We can extract it
into a separate library and use with any other generator, for example:

<pre><code>
	var randomUser = chain(random().int(), function(i) { return append('-' + i); });
	repeat(10, randomUser)('user'); // Generates 10 random user names `user-xyz`.
</code></pre>

Popcors not only support permutations on first attribute level, but on object compositions (currently supported for `permutate()` only), for example:

<pre><code>
var generator = {
	id   : range(1, 3),
	name : {
       first : list('Buzz', 'Slinky'),
       last  : 'Toy'
    }
};
</code></pre>

Try [popcorn_maker.html](http://mu-labs.googlecode.com/svn/trunk/eng/tools/popcorn/popcorn_maker.html)
and see [API documentation](http://mu-labs.googlecode.com/svn/trunk/eng/tools/popcorn/docs/api_dev/index.html)
for more information and the complete generator list.

## Random generators

Core module defines a random generator object and a library class
which can be extended with custom generators. Constructor function 
`random()` creates the random generator object. It accepts an optional
seed value as argument.
Build in random generator functions are:

  - `int()` - range function that returns an integer in a predefined defined rage.
  - `element()` - returns one element from the provided dictionary.

For example:

<pre><code>
  var r = random();
  r.int(100, 200); // Returns a random int in the range from 100 to 200
  r.element(['a', 'b', 'c']); // Returns one of the chars in argument array.
</code></pre>

To extend the random object with a custom generator, assign 
the generator to the `RandomLib` class defined in Core:

<pre><code>
	RandomLib.myRandGenerator = function() {
		... 
		// this.int()(); call to core int() generator
    //               which returns next int value.
		... 
	};
</code></pre>

and use as `random().myRandGenerator()`.
Most modules extend the random object with custom generator.
See `Common.alpha` or `Network.emailAddress` for more details.

## Dictionaries

Module Dictionary provides functions to build dictionaries
from JavaScript arrays. Constructor function `dictionary()`
takes an array as argument and returns the dictionary object.
Currently three generator functions are supported by dictionary 
objects:

  - `list()` - a range function which returns all or a subset of elements.
  - `element()` - returns one random dictionary element.
  - `elements()` - returns n random elements.

Popcorn provides several default dictionaries for most common
names, surnames, passwords, domains etc.

## State and variables

Generation process maintains a state object which is accessible by any generator.
`permutate()` and `circulate()` functions
take an optional state object as argument. If this is not provided,
an empty object is created.

To access the state use `withState()` generator, for example:

<pre><code>
var generator = {
	id  : withState(function(s) { s.id = 1; return gen(s.id); }),
	user: withState(function(s) { return gen('user-' + s.id); })
};
</code></pre>

The first generator sets an id attribute on the state object
and returns a generator for this id. Newly assigned id attribute
of the state object is used by the second generator to create user names of the form 'user-id'. 
Similar to `chain()` generator, `withState()` has to return another
generator as result.

To simplify access to the state object, Popcorn provides functions to 
store generator results in variables `setVar()` and access those with `withVar()`.
Above example can be simplified to:

<pre><code>
var generator = {
	id  : setVar('id', random().int()),
	user: withVar('id', function(id) { return gen('user-' + id); })
};
</code></pre>

## JSON object generators

Popcorn supports two JSON generation functions, `permutate()`
and `circulate()`. If two or more attribute generators are defined 
in one object or inner object, `permutate()` will generate object
with all permutations between the values generated by the attribute
generators. For example the generator 
<pre><code>
var generator = {
	id  : range(1, 4),
	user: list('admin', 'guest')
};
</code></pre>

will return:

<pre><code>
[{ id: 1, user: 'admin' },
 { id: 1, user: 'guest' },
 { id: 2, user: 'admin' },
 { id: 2, user: 'guest' },
 { id: 3, user: 'admin' },
 { id: 3, user: 'guest' },
 { id: 4, user: 'admin' },
 { id: 4, user: 'guest' }]
</code></pre>

when executed with `permutate()`.

`circulate()` in opposite to `permutate()` combines the results
of all attribute generators together. `circulate()` for the
above generator will return:

<pre><code>
[{ id: 1, user: 'admin' },
 { id: 2, user: 'guest' },
 { id: 3, user: 'admin' },
 { id: 4, user: 'guest' }]
</code></pre>

If no count is provided, circulate generates an object array
of the length of the longest attribute generator (here 'id').
All other attribute values circulate (here 'user').

Additionally to the generator and base object, both functions 
take an optional result count, a state object and a result transformer
as argument. By default only the result of the generation is
returned by these function. Use `id()` as result transformer
to return the final state as well.

## Build

Just load the Core, Common and other modules as needed. 
Use [jGrouseDoc](http://code.google.com/p/jgrousedoc/) to build 
API docs. Update 'build.properties' file with the location
of the jGrouseDoc project and run ant.

## License

BSD License, see LICENSE for more information.

