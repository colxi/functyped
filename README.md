## Function-typed

Statically typed functions for javascript , with expandable types support.

**Characteristics & features :**
- Tiny (0 Kb)
- No dependencies
- Multi enviroment & crossbrowser (Node, Chrome, Firefox, Safari, Edge...)
- Multiple function declaration styles : Overload / Inline / Interfaces 
- Declarative / Imperative typechecks available
- Complex type structures allowed
- Configurable 
- Expandable (custom types)

| Types | | | | |
|--------|--------|--------|--------|--------|
| Boolean | Number | String | Array | Function |
| Promise | Object | Date | Symbol| Error |
| null | undefined | Error | structure []* | structured {}* |

> *For more information about Typed structures , check the corresponding section in this documentation 

Inline declaration example (other declarations methods are available):
```javascript
require('functon-typed');

// Declare a function that recieves two Numbers, and returns a Boolean
const myFunc = Typed.function( [ Number, Number ] , (a,b)=>{ return a==b },  Boolean);

myFunc(1,'2');
// Uncaught TypeError : Invalid type found in argument 2. (Expecting a "Number").

```

---
### Syntax
```
Typed.function( parametersTypes , yorFunction, returnType [, bindging] )
```
**Parameters** :
- `parameterTypes` : Array containing the primitive types for each parameter. (Array is not needed if function has just a parameter)
- `yorFunction` : Function to be type tested. ( Arrow functions not allowed when binding )
- `returnType` : Type for the function return value.
- `binding` : (optional) Context to be binded to the function (if binding is provided, the parameter `function` cant't be an arrow function)

**Returns** :
Function with automatic type checking

## Usage
Typed functions can be initialized through different approaches. Each one, provides a different set of advantages and follows different codding style conventions. Use the initialization that better fits  for your purposes.


#### 1- Overload
Probably the most clean and less intrusive, considering it lets you implement your code in the same way you normally do, and later on,  overload the typing specifications.
```javascript
//declare your function normally
function myFunc(a,b){
	return a===b;
};
// perform the overloading
myFunc = Typed.function(  [ Number, Number ] , myFunc, Boolean );

myFunc(6,8); // returns false
```

#### 2 - Inline
Probably the most compact declaration approach. Types are set when function is declared.
```javascript
// declare the strong typed function
let myFunc = Typed.function( [ Number, Number ] , (a,b)=>{
	return a===b;
}, Boolean );

myFunc(6,8); // returns false
```
#### 3 - Interfaces
Interfaces are normally declared at the top of your code, and are used to specify the details of the types used by your function parameters, and return value.

The initializacion syntax for Interfaced functions is the simplest one.
Because the types have already been declared in the Interface, you only need to provide the fuction referente (and optionally the binding)


```javascript
// declare the interface
Typed.interface( [ Number, Number ] , 'myFunc' ,  Boolean);

// declare a function using the interface Name as the function name
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
> Note :  Arrow functions can't be used with interfaces, because of the lack of the function name used as interface identifier


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
As you can see in the example, `Typed Structured Objects` and `Typed Structured Arrays` are supported, and is capable of handling nested structures.

**The type checks performed in both Typed Structures are `strict` , length of arrays must match, and exact object structure (keys) is required, in order to pass the checks.**

## Binding
In some circumstances , you will need to bind your function to a specific context, and the `binding` parameter lets you accomplish that.

> Note : Binding is not possible when arrow functions are used 

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


## Safe type checks
You can test value types, to check if they match the expected type, using the `Typed.test()` method. No errors are thrown when testing,l instead a `Boolean` value is returned, indicating if the test was succesful or failes.

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
Using the `Typed.addType()` method , more types can be added easilly. Native types and custom types are supported.

```
Typed.addType( type , test )
```
**Arguments :**
- `type` : Token representing the type
- `test` : Function that will perform the test, and return a Boolean

**Usage :**
```javascript
// adding a native type
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

**Enable/disable the full engine** ; You can disable the type checks by setting this property to false. If is set to false, before any function is declared ,your code will not suffer from the type check performance performance lose.

```
Typed.warings = true | false
```
**Enable/disable notifiacion mode** : If enabled, now Errors will be thrown and instead informative warning will be triggered.



## Performance 


