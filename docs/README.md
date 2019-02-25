## Functyped

| About | [Specs](./specs.md) | Usage |


Automatic real time **static type-checking** for Javascript functions through declarative syntax. This library provides  complete support to the language native data-types / primitives,  as well as to complex typed structures and custom types. 


```javascript
import './functyped.js';

// Declare your function  as you normally do
function stringCompare(a,b){
	return a==b
};

// Use the typefunction Constructor to declare the types signature 
// overloading your original function.
stringCompare = Typed.function( [ String, String ] , stringCompare ,  Boolean);

/* DEMO */
stringCompare( 'foo', 'bar'); 
// returns true;
stringCompare( 'foo', false); 
// TypeError : Invalid type found in argument 2. (Expecting "Number").
stringCompare( 'foo' ); 
// TypeError : Function expects 2 arguments. (1 provided)
```
```
