<link rel="stylesheet" href="style.css">
| [Home](./README.md) | About | Usage | Install | [Types](./types.md)  |

# Types


<div id="cols" class="cols">
	<div class="text-justified">
One of the objectives in the development on Funtyped was to avoid introducing new exotic identifiers, and use instead all the currently available elements from the language, in order to keep everything simple and famiiar.<br> 
In the table are listed all the supported by Functyped out-of-the-box :
    </div>
	<div class="types-container">
        <table id="supported-types" align="center">
			<tr>
				<td align="center">Boolean</td>
				<td align="center">Number</td>
				<td align="center">String</td>
			</tr>
			<tr>
				<td align="center">Array</td>
				<td align="center">Function</td>
				<td align="center">Object</td>
			</tr>
			<tr>
				<td align="center">Symbol</td>
				<td align="center">Promise</td>
				<td align="center">Date</td>
			</tr>
			<tr>
				<td align="center">Error</td>
				<td align="center">null</td>
				<td align="center">undefined</td>
			</tr>
			<tr>
				<td align="center">Any</td>
				<td align="center">Structures</td>
				<td align="center">Custom</td>
			</tr>
		</table>
    </div>
</div>


---

## 1. Any (Type)

`Any` is a special data-type that behaves as a `wildcard`. When used the typechecks will always pass, any data type is allowed.


```javascript

// Generate a typed function that expects any type as an argument, 
// and returns a Boolean
let sayHi = Typed.function( Any , x=>{
    console.log('Hi' + x + '!');
    return true;
}, Boolean );


// Test
sayHi('foo'); // typecheck pass

sayHi(123); // typecheck pass


```




## 2. Typed Structures

The supported data types can be used to define complex data structures, based in Arrays and Objects, that will be used to perform the type checks.
Nested structures are also supported.

> The type checks performed in both Typed Structures are strict in the sense that Array length / Object structure (keys) must match, in order to pass the checks.

In the following example is shown a complex Typed Sructure, with some nesting.

```javascript
// declare the typed structure
let t_structure = {
    name : String,
    scores : [ Number, Number, Number, Number],
    address : {
    	city : String,
        zipCode : Number
    }
}

// Generate a typed function that expects a 
// t_structure (previously declared) and returns a Boolean
let sayHi = Typed.function( t_structure , x=>{
    console.log('Hi' + x.name + '!');
    return true;
}, Boolean );


// Test the type check
sayHi({
    name : 'Phil',
    scores : [ 55, 23, 74, 12],
    address : {
    	city : 'Barcelona',
        zipCode : 08001
    }
})
```




## 3. Custom Types

Using the `Typed.typedef()` method , more types can be added easilly.

```
Typed.typedef( type , test )
```
**Arguments :**
- `type` : Reference representing the new Type (Constructor, String, Symbol...)
- `test` : Function that will perform the test, and return a Boolean

**Example :**
```javascript
// adding a browser native object
Typed.addType( HTMLElement , x=> x instanceof HTMLElement );

// adding a custom type
const Integer = Symbol('Integer');
Typed.addType( Integer , x=> Number.isInteger(x) );


// define a new type based in a typed Structure
const myStruct = {
	name:String,
	surname : String
};
Typed.addType( myStruct , x=> Typed.test( x, myStruct) );
```
