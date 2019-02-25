## Functyped


<table align="center">
    <tr>
        <td align="center">
        Automatic **static type-checking** for javascript functions through declarative syntax, providing  complete support to the language native data-types / primitives,  as well as to complex typed structures and custom types.
        </td>
        <td>
        ```javascript
require('functyped');

// Declare a function that recieves two Numbers, and returns a Boolean
const myFunc = Typed.function( [ Number, Number ] , (a,b)=>{ return a==b },  Boolean);

myFunc(1,'2');
// Uncaught TypeError : Invalid type found in argument 2. (Expecting a "Number").
```
        </td>
    </tr>
</table>



**Characteristics & features :**
- Tiny (6Kb minified)
- No dependencies
- Multi enviroment & crossbrowser (Node, Chrome, Firefox, Safari, Edge...)
- Multiple function declaration styles : Overload / Inline / Interfaces 
- Declarative / Imperative typechecks available
- Complex type structures supported
- Configurable
- Expandable (custom types)

**Supported types :**

<table align="center">
    <tr>
        <td align="center">Boolean</td>
        <td align="center">Number</td>
        <td align="center">String</td>
        <td align="center">Array</td>
        <td align="center">Function</td>
    </tr>
    <tr>
        <td align="center">Object</td>
        <td align="center">Symbol</td>
        <td align="center">Promise</td>
        <td align="center">Date</td>
        <td align="center">Error</td>
    </tr>
    <tr>
        <td align="center">undefined</td>
        <td align="center">null</td>
        <td align="center">*Any* </td>
        <td align="center">*Structured { } / [ ]*</td>
        <td align="center">*Custom*</td>
    </tr>
</table>


**Example :**
Inline declaration example (other declarations methods are available):
```javascript
require('functyped');

// Declare a function that recieves two Numbers, and returns a Boolean
const myFunc = Typed.function( [ Number, Number ] , (a,b)=>{ return a==b },  Boolean);

myFunc(1,'2');
// Uncaught TypeError : Invalid type found in argument 2. (Expecting a "Number").
```

> **Important** :  Type checks are performed at execution time, adding an extra overhead to the function calls, with obvious effects in performance. Check the Performance section in this documentation for more information, as well as recommendations.


## Package distribution 

Install using Npm :
```
$ npm install functyped
```

Clone with Git :
```
$ git clone https://github.com/colxi/functyped
```
Add to your HTML head :
```
<script src="https://colxi.github.io/functyped/functyped.js"></script>
```

The library can be imported using ES6 `import`, and Node `require`. In both cases no assignment needs to be performed, the global object `Typed		` is created automatically.

---
### Syntax
```
Typed.function( parametersTypes , yorFunction, returnType [, bindging] )
```
**Parameters** :
- `parameterTypes` : Array containing the primitive types for each parameter. (Array wrapper is not needed if function has just a parameter)
- `yorFunction` : Function to be type tested. ( Arrow functions are not allowed when binding )
- `returnType` : Type for the function return value.
- `binding` : (optional) Context to be binded to the function (if binding is provided, the parameter `function` cant't be an arrow function)

**Returns** :
Function with automatic type checking

## Usage
Typed functions can be initialized through different approaches. Each one, provides a different set of advantages and follows different codding style conventions. Use the initialization that better fits  for your purposes.


#### 1- Overload
Probably the most clean and less intrusive, considering it lets you implement your code the same way you normaly do, and later on,  overload the typing specifications.
```javascript
//declare your function normaly
function myFunc(a,b){
	return a===b;
};
// perform overloading
myFunc = Typed.function(  [ Number, Number ] , myFunc, Boolean );

myFunc(6,8); // returns false
```

#### 2 - Inline
Probably the most compact declaration approach. Types are set when function is declared.
```javascript
// declare the typed function
let myFunc = Typed.function( [ Number, Number ] , (a,b)=>{
	return a===b;
}, Boolean );

myFunc(6,8); // returns false
```
#### 3 - Interfaces
In some languages `Interfaces` are declared at the top of your code, and are used to specify the details of the types expected by the function parameters, and return value.

Interfaces can be declared using the following method: 
```
Typed.interface( parameterTypes , interfaceId ,  returnType);
```
**Parameters:**
- `parameterTypes` : Array containing the primitive types for each parameter. (Array wrapper is not needed if function has just a parameter)
- `interfaceId` : Unique String with the name of the interface 
- `returnType` : Type for the function return value.

The initializacion syntax for Interfaced functions is the simplest one.
Because the types have already been declared in the `Interface`, you only need to provide the fuction referente (and optionally the binding) to the `Typed.function()` Constructor


```javascript
// declare the interface
Typed.interface( [ Number, Number ] , 'myFunc' ,  Boolean);

// declare a function using the interface id as the function name
function myFunc(a,b){ return a===b }
// Perform overloading (but it could be declared inline instead)
myFunc = Typed.function( myFunc );

myFunc(6,8); // returns false
```

The real power if `Inerfaces`  resides in the fact that `Interfaces` can be re-used accross diferent functions, with common type specifications.

```javascript
// declare the interface
Typed.interface( [ Number, Number ] , 'myInterface' ,  Boolean);

// declare a function using the interface Name as the function name
let myFunc = function myInterface(a,b){ return a===b }
// declare another function using the same interface Name
let myFunc2 = function myInterface(a,b){ return a!==b }

// Perform overloading (they could be declared inline too)
myFunc = Typed.function( myFunc );
myFunc2 = Typed.function( myFunc2 );


myFunc(6,8);  // returns false
myFunc2(6,8); // returns true

```
> Note :  Arrow functions can't be used with interfaces, since they lack of function name ( which used as interface identifier )


## Typed structures
The type-check engine comes with the most common types checks implemented. They can be used to perform tests against single variables, but they can also be used to define complex structures.


```javascript
let t_structure = {
	name : String,
    scores : [ Number, Number, Number, Number],
    address : {
    	city : String,
	    zipCode : Number
    }
}

let sayHi = Typed.function( t_structure , x=>{
	console.log('Hi' + x.name + '!');
    return true;
}, Boolean );

sayHi({
	name : 'Phil',
    scores : [ 55, 23, 74, 12],
    address : {
    	city : 'Barcelona',
	    zipCode : 08001
    }
})
```
As you can see in the example, `Typed Objects Structure` and `Typed  Array Structured` are supported, as well as nesting.

**The type checks performed in both Typed Structures are strict in the sense that Array length / Object structure (keys) must match, in order to pass the checks.**

## Binding
In some circunstances , you will need to bind your function to a specific context, and the `binding` parameter lets you accomplish that.

> Note : Binding is not possible when arrow functions are used.

Example for each declaration approach :

```javascript
// Declare the context to be used for binding
let myObj = {  myProp : 123 };

/* OVERLOAD DECLARATION WITH BINDING */
let myFunc = function(a){ return a===this.myProp; };
myFunc = Typed.function( Number , myFunc, Boolean , myObj );
myFunc(123); // returns true

/* INLINE DECLARATION WITH BINDONG */
let myFunc = Typed.function( Number  , function(a){
  return a===this.myProp;
} , Boolean , myObj );
myFunc(123); // returns true

/* INTERFACED DECLARATION WITH BINDONG */
Typed.interface( Number, 'myInterface' , Boolean );
let myFunc = function myInterface(a){ return a===this.myProp };
myFunc = Typed.function( myFunc, myObj );
myFunc(123); // returns true

```

## Imperative type checks
If you prefer to perform the checks manualy, inside your functions there is a method available for it. If type check does not pass, an Error is thrown and execution stopped.

```
Typed.validate( values, types );
```
**Parameters** :
- `values`  : Values to be type-checked. If more than one is provided, they must be enclosed inside an Array.
- `types` :  Expected Types for each provided value. If more than one type is provided, they must be enclosed inside an Array 

**Usage** :
```javascript
myFunction(a,b,c){
	// validate the function argument types (error if fails)
	Typed.validate( arguments, [String, Boolean, Number] );
    /* rest of the function */
    return;
}
```
> Note : `Typed.validate()` is not affected by the `Typed.enabled` directive.

## Safe type checks
You can test value types, to check if they match the expected type, using the `Typed.test()` method. No errors are thrown when testing, instead a `Boolean` value is returned, indicating if the test was succesfull or failed instead.

```
Typed.test( values, types );
```

**Parameters** :
- `values`  : Values to be type-checked. If more than one is provided, they must be enclosed inside an Array.
- `types` :  Expected Types for each provided value. If more than one type is provided, they must be enclosed inside an Array 

**Usage** :
```javascript
Typed.test( 123, Number ); // returns true
Typed.test( [123, 456] , [Number,Boolean] ); // returns false
```

## Adding new Types
Using the `Typed.addType()` method , more types can be added easilly.

```
Typed.addType( type , test )
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

```
## Configuration
Two properties are provided to modify the type check engine behavior

```
Typed.enabled = true | false
```

**Enable/disable the full engine** ; You can disable the type checks by setting this property to false. If is set to false before any function is declared , your code will not suffer from the type check performance lose.

```
Typed.warings = true | false
```
**Enable/disable notifiacion mode** : If enabled, no Errors will be thrown and informative warning will be triggered instead.



## Performance


Because of the loosely typed nature of javascript, no type check is performed at compilation time. It is the developer who needs to perform those checks by their own, at execution time. 

> A continuous check on the used variables values comes obviously with a performance penalty, especially when it's widespread.

A system able to automatize this task in your functions requires the usage of wrappers over those functions, which, in turn, also adds another layer of performance reduction.

Personally, I think an automated type-check system can be especially useful in development enviroments, but should be disabled in **demanding production enviroments**.

The `Typed.enabled` property allows to completelly disable the type-checks without affecting the behavior of your code, and giving back the native execution performance. 
**It is important to understand that it is necessary to disable the engine before any function is declared, otherwise the function wrappers will still be generated.**

Since the imperative type-check method (`Typed.validate()`) is not affected by the `Typed.enabled` directive, it still can be used to perform critical type checks, in scenarios where type-checking is mandatory (like user input validation)

In result, you can enjoy a complete static type check experience, without any performance downside, or code style pollution (thanks to overload declaration syntax)

Performance tests : https://jsperf.com/functyped/