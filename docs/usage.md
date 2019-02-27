<link rel="stylesheet" href="style.css">
| [Home](./README.md) | Usage | Install | [Types](./types.md)  |


## Syntax

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


