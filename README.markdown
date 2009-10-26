Popcorn - a DSL for JSON
========================

## Description

Popcorn is a JavaScript embedded DSL designed for quick, easy and
flexible JSON object generation. The core modules provides a basic set
of generators for most common JavaScript types, and combinators to build
new generators for any kind of data. Additional modules extend the 
functionality with random generators, dictionaries, network type
generators for IP or mac address and more.

Popcorn can be used to generate mock objects for testing of JSON services
or browser side JavaScript code. Since with this DSL thousands of test cases
can be expressed in just few lines of code, it makes for a great driver for
data driven test engines.

To see the DSL in action try 'popcorn_maker.html'.

## Build

Just load the Core, Common and other modules as needed. 
Use [jGrouseDoc](http://code.google.com/p/jgrousedoc/) to build 
API docs. Update 'build.properties' file with the location
of the jGrouseDoc project and run ant.

## Getting started

The library consists of several independent loadable modules build on
top of the Core module. You can load only the modules you like to use 
or module All that combines all generators together.
To setup the generator:

  1. Define the base test case JSON object.
  2. Define the generator object and assign generators to attributes you like to alter.
  3. Run the `generate` function on the generator and base object.

For example:

<pre><code>
	// Load modules containing generators used in this scope.
	with(Popcorn.Core) { 
	with(Popcorn.Common) {   

		var base_object = { // Define the base test case object.
			id   : 1, 
			name : 'Woody'
		};

		var generator = { // Define the generator object. 
			name : list('Buzz', 'Slinky') // Alter only the name attribute.
		};

		// And run...
		var results = generate(generator, base_object);

	} }
</code></pre>

## Generators 101

In the basics, generators are functions that take one argument and return
a result value and an optional state. The Core module function `gen()` 
creates the most basic generator that returns the argument value passed to 
`gen()` ignoring the argument the generator itself is called with:

<pre><core>
	var g = gen('test'); // Create a generator g with value 'test'.
	g('any input')       // Execute the generator g. The result is 'test'.
</core></pre>

In comparison with `gen()`, `prepend()` uses the input value, for example:

<pre><core>
	var p = prepend('Hello ');
	p('world'); // returns 'Hello world'
	p('Buzz'); // returns 'Hello Buzz', etc.
</core></pre>

Some generators accept other generators or generator arrays as argument.
For example `append(g)` executes the generator `g` and appends the
result to the input value:

<pre><core>
	var r = random().int(), // See next section for random generators.
	    a = append(r);
	    a('user'); // Will return for example 'user42' or 'user573' etc.
</core></pre>

If you like to pass a generated value to another generator that does not 
accept a generator as argument, use `chain()` function to execute these
generators in sequence. For example to build random user names of the 
form '<user>-<random int>' you can define a generator as following:

<pre><core>
	var r = random().int(),
	    u = chain(r, function(i) { return append('-' + i); });
	    u('admin'); // Will return for example 'admin-385' or 'admin-712', etc.
</core></pre>

`chain()` takes the random generator and a function as argument. It executes 
the generator and passes the result to the function that returns a new generator 
as result. `chain()` always has to return another generator. This way it can
be evaluated or chained again to build new generators.

The previous example seems to be quite useful already. We can extract it
into a separate library and used with any other generator, for example:

<pre><core>
	var randomUser = chain(random().int(), function(i) { return append('-' + i); });
	repeat(10, randomUser)('user'); // Generates 10 random user names `user-xyz`.
</core></pre>

It is possible to define generators not only on root attributes of an object 
but on attributes of cascading objects as well, for example:

<pre><core>
var generator = {
	id   : range(1, 3),
	name : {
       first : list('Buzz', 'Slinky'),
       last  : 'Toy'
    }
};
</core></pre>

See 'popcorn_maker.html' and API documentation for more information and 
the complete generator list.

## Random generators

The Core module defines a random generator object and a library class that 
can be extended with custom random generators. The constructor function 
`random()` creates the random object. It accepts an optional seed value 
as argument.
The random generator functions provided by the Core modules are:

  - `int()` - range function that returns an integer in a defined rage.
  - `element()` - picks one random element from the provided array.

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
		// this.int()(); can be used here.
		... 
	};
</code></pre>

and use as `random().myRandGenerator()`.
Most modules extend the random object with custom generator.
See `Common.alpha` or `Network.emailAddress` for more details.

## Dictionaries

Module Dictionary provides functions to build dictionaries
from JavaScript arrays. The constructor function `dictionary()`
takes an array as argument and returns the dictionary object.
Currently two generator functions are supported by the dictionary 
object:

  - `list()` - a range function which returns all or a subset of elements.
  - `element()` - picks a random dictionary element.

Popcorn comes with several default dictionaries for most common
names, surnames, passwords, domains etc.

## State and variables

The generation process maintains a state object that is accessible and
modifiable by all generators. The `generate()` function takes an optional
state object as argument. If this is not provided, an empty object is created.

To access the state use `withState()` generator, for example:

<pre><core>
var generator = {
	id  : withState(function(s) { s.id = 1; return gen(s.id); }),
	user: withState(function(s) { return gen('user-' + s.id); })
};
</core></pre>

The first generator sets an id attribute on the state object
and returns a generator for this id. The state object id attribute
is used in the second generator to create user names of the form 'user-1'. 
Similar to `chain()` generator, `withState()` has to return another
generator as result.

To simplify access to the state object, Popcorn provides functions to 
store generator results in variables and access this variables in other
generators, `setVar()` and `withVar()`. Using these generators,
the example above could be simplified to:

<pre><core>
var generator = {
	id  : setVar('id', random().int()),
	user: withVar('id', function(id) { return gen('user-' + id); })
};
</core></pre>

## License

BSD License, see LICENSE for more information.

