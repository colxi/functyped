/*
* @Author       : colxi
* @Webpage      : github.com/colxi
* @FirstRelease : February 2020
*/

(function(){
	"use strict"

	const Any = Symbol('Any');
	
	const _Interfaces = {};

	/*
	 * _Types Object : Container to store the collection off supported types, and 
	 * the methods to test/identify them. More types can be added
	 * using the Typed.addType() method
	 */
	const _Types = new Map();
	_Types.set( Any       , x=>{ return true } );
	_Types.set( Boolean   , x=>{ return typeof x === 'boolean' } );
	_Types.set( Number    , x=>{ return typeof x === 'number' } );
	_Types.set( String    , x=>{ return typeof x === 'string' } );
	_Types.set( Array     , x=>{ return Array.isArray(x) } );
	_Types.set( Function  , x=>{ return typeof x === 'function' } );
	_Types.set( Promise   , x=>{ return !!x && (typeof x === 'object' || typeof x === 'function') && typeof x.then === 'function' } );
	_Types.set( Object    , x=>{ return x && typeof x === 'object' } );
	_Types.set( Date      , x=>{ return x instanceof Date } );
	_Types.set( Symbol    , x=>{ return typeof x === 'symbol' } );
	_Types.set( Error     , x=>{ return x instanceof Error } );
	_Types.set( null      , x=>{ return !x && typeof x === 'object' } );
	_Types.set( undefined , x=>{ return typeof x === 'undefined' } );



	/* 
	 * _isArrowFunction() : Basic check to identify an arrow Function.
	 */
	const _isArrowFunction = function(f){
		if( typeof f === 'function' && f instanceof Function && !f.hasOwnProperty('prototype') ) return true;
		else return false;
	}


	/* 
	 * _isPlainObject() : Function to test if an object is a plain object, i.e. is constructed
	 * by the built-in Object constructor and inherits directly from Object.prototype
	 * or null. Some built-in objects pass the test, e.g. Math which is a plain object
	 * and some host or exotic objects may pass also.
	 */
	const _isPlainObject = function(obj) {
		// Basic check for Type object that's not null
		if (typeof obj == 'object' && obj !== null) {
		  // If Object.getPrototypeOf supported, use it
		  if (typeof Object.getPrototypeOf == 'function') {
			  var proto = Object.getPrototypeOf(obj);
			  return proto === Object.prototype || proto === null;
		  }
		  // Otherwise, use internal class
		  // This should be reliable as if getPrototypeOf not supported, is pre-ES5
		  return Object.prototype.toString.call(obj) == '[object Object]';
		}
		// Not an object
		return false;
	}


	/* 
	 * _typeExists() : Check if the provided type exists in the supported Types definitions (_Types)
	 * It can handle complex types  based in Arrays and Literal objects, containing
	 * in their keys/properties types (deep typing), using recursion.
	 */
	const _typeExists = function( type ){
		// check if type exist in types definitions
		// ( prevent an array with a Primitive inside, return false positives )
		if( !Array.isArray(type) && _Types.has( type ) ) return true;
		// if does not exist, perform some extra checks to support 
		// comples & nested types in Arrays ( [] ) and  Objects ( {} )

		// handle Arrays.
		if( Array.isArray(type) ){
			// reject empty arrays
			if( !type.length ) return false;
			//  Inspect each array index 
			for( let i=0; i<type.length; i++) if(!_typeExists( type[i] ) ) return false;
			return true;
		}
		
		// handle Objects. Inspect each object property
		else if( _isPlainObject( type ) ){
			// Rejects empty objects, 
			if( !Object.keys(type).length ) return false;
			// Inspect all object properties (included non enumerable ones)
			let props = Object.getOwnPropertyNames(type)
			for(let i=0; i<props.length;i++) if( !_typeExists( type[ props[i] ] ) ) return false;   
			return true;
		}
		
		// if is not a plain object or an array return false
		else return false;
		
	}


	/*
	 * _throwTypeError() : Throws and error, showing the stack trace details. If 
	 * the engine is set to throw warning, warning will be printed, and exection
	 * will not be blocked with an Error.
	 */
	const _throwTypeError = function( msg ){
		let err = new Error();
		// remove the last two levels of the stack trace
		let stack = err.stack.split('\n').slice(3).join('\n');
		// if warning mode is enabled, trhow a warning 
		if(Typed.warnings){
			console.warn( `${msg}\n${stack}`);
			return false;
		}
		// ... instead, finishes execution with an Error
		throw `${msg}\n${stack}`;
	}


	/*
	 * Typed : Public Object, containing the methods and properties that conform
	 * the library ublic API
	 */
	const Typed = {
		// Engine can be disabled by setting enables property to false
		// in consequence no tests will be performed
		enabled      : true,
		// if warnings is set to true, the engine will only display warnings
		// when types mismatchs are detected (instead of Errors)
		warnings     : false,
		// keep a counter on registered functions
		__fn__       : 0,
		// Add new types to the supportes types collection
		addType : function(type, test){
			if( !_Types.has(type) ){
				throw new Error('Typed.addType() : Provided type already exists.');
			}
			else _Types.set( type , test );
		},
		// Method to declare new typed functions interfaces
		interface : function( parameterTypes , ifaceName, returnType){
			if(arguments.length !== 3 )  throw new Error('Expecting 3 arguments');
			// force an Array in first argument (parameter types)	
			if( !Array.isArray( parameterTypes ) ) parameterTypes = [parameterTypes];
			// check if forth argument array contents, are all supported types
			for(let i=0; i<parameterTypes.length; i++) if( !_typeExists( parameterTypes[i] ) )  throw new Error('Type "'+parameterTypes[i].name+'" , assigned to argument '+ (i+1) +' is not supported');

			// check if second argument is a valid string 
			if(typeof ifaceName !== 'string') throw new Error('Second argument (InterfaceName) must be a string')
			ifaceName = ifaceName.trim();

			// Check if third argument is a supported Type (return type)
			if( !_typeExists( returnType ) )  throw new Error('Type "'+returnType.name+'" , assigned to function return value is not supported');
			if( !ifaceName.length ) throw new Error('Invalid interface name');
			// ensure the provided interface name does not already exist
			if( _Interfaces.hasOwnProperty(ifaceName) ) throw new Error('Interface with this name already exiwts');
				
			// set the interface
			_Interfaces[ifaceName] = { returnType , parameterTypes };
			
			return true;
		},
		// Method to declare new typed functions. If 1 or 2 arguments are passed, 
		// searches de types definitions in the interfaces, using the funciton name
		// If more arguments are passed, iniitializes the typed function with them
		function : function( a,b,c,d ){ 
			let returnType , func , parameterTypes , binding;
		
			/** INPUT VALIDATION & INITIALIZATION **/
			
			// throw error if no arguments are passed
			if(arguments.length===0) throw new Error('Typed.function() : Arguments expected');
			
			// If 1 or 2 arguments are passed, use Interface based initialization
			if(arguments.length===1 || arguments.length===2 ){
				if(typeof a !== 'function' ) throw new Error('Typed.function() : Expected a function in first argument (when using Interface).');
				// first argument has to a be a function  but arrow functions not allowed
				if( _isArrowFunction(a) ) throw new Error('Typed.function() : Arrow functions are not allowed when using Interfaces.');
				// throw error if interface has not been declared
				if( !_Interfaces.hasOwnProperty(a.name) ) throw new Error('Typed.function() : Interface "'+a.name+'" has not been declared.');
				// check if function arguments count, matches  parameters types count
				if(a.length !== _Interfaces[a.name].parameterTypes.length)  throw new Error('Typed.function() : Provided function accepts '+a.length+' parameters, but there are '+_Interfaces[a.name].parameterTypes.length+' declared by the interface ("'+a.name+'").');
				
				func = a;
				binding = b || false;
				returnType = _Interfaces[a.name].returnType;
				parameterTypes = _Interfaces[a.name].parameterTypes;
			}
			
			// Use regular initialization
			else{
				// first argument (parameterTypes) needs to be an array
				if( !Array.isArray( a ) ) a = [a];
				// check if first argument array contents, are all supported types
				for(let i=0; i<a.length; i++) if( !_typeExists( a[i] ) )  throw new Error('Typed.function() : Unsupported type "'+a[i].name+'" , assigned to argument ' + (i+1) + '.');
				
				// Check if third argument is a supported Type (return type)
				if( !_typeExists( c ) )  throw new Error('Typed.function() : Unsupported type for Function return value "'+c.name+'".');
				// check if second argument is a function (typed function)
				if( typeof b !== 'function' ) throw new Error('Typed.function() : Expected a function in second argument');
				// arrow functions not allowed when binding is set up
				if( _isArrowFunction(b) && d ) throw new Error('Typed.function() : Arrow functions are not allowed when using binding');
				// check if function arguments count, matches  parameters types count
				if(b.length !== a.length)  throw new Error('Typed.function() : Provided function accepts '+b.length+' parameters, but there are '+a.length+' in the provided types definition.')
				returnType = c;
				func = b;
				parameterTypes = a;
				binding = d || false;
			}
			
			// if engine is disabled (Typed.enabled==false), return callback function as it is
			if( !Typed.enabled ) return (binding) ? func.bind(binding) : func;
			
			// increase the counter
			Typed.__fn__++;
			
			/**  CALLBACK FUNCTION HANDLER **/
			
			return function(...args){
				// if engine is disabled dont perform tests
				if( !Typed.enabled ) return (binding) ? func.bind(binding) : func;
				
				// validate arguments
				Typed.validate( args, parameterTypes , false);
				
				let result = (binding) ? func.bind(binding)(...args) : func(...args);
				// validate return value if its not Any
				if( returnType !== Any ) Typed.validate(result, returnType , true);
				return(result);
			}
		},
		// throws errr if any element fails
		validate : function( args, parameterTypes , isReturnValue = false ){
			if( !Array.isArray(args) ) args = [args];
			if( !Array.isArray(parameterTypes) ) parameterTypes = [parameterTypes];
			
			if(!isReturnValue){
				// throw error if the args and the types count dont match
				if(args.length !== parameterTypes.length){
					return _throwTypeError(`TypeError : Invalid number of argments (Expected : ${args.length})`);
				}
			}
				
			for(let i=0; i<args.length;i++){ 
				let location = isReturnValue ? 'return value' : 'argument ' + (i+1);
				
				if( !Typed.test( args[i], parameterTypes[i],i ) ){
					// if basic test fails,  perform deeper tests to
					// identify reason of failure to output information
					// about the error condition and typology
							
					if(  Array.isArray( parameterTypes[i] ) ){
						if( Array.isArray( args[i] ) ){
							// both are typed structures(array)
							return _throwTypeError(`TypeError : Invalid Typed Array structure found in ${location}.`);
						}else{
							// not a typed structures (array)
							return _throwTypeError(`TypeError : Invalid type found in ${location}. (Expecting a "Typed Array structure").`);
						}
					}
					
					else if( _isPlainObject( parameterTypes[i] ) ){
						if( _isPlainObject( args[i] ) ){
							// both are typed structures (array)
							return _throwTypeError(`TypeError : Invalid Typed Object structure found in ${location}.`);
						}else{
							// not a typed structures (array)
							return _throwTypeError(`TypeError : Invalid type found in ${location}. (Expecting a "Typed Object structure").`);
						}
					} 
					
					else return _throwTypeError(`TypeError : Invalid type found in ${location}. (Expecting a "${parameterTypes[i].name}").`);
				}
			}
		},
		// return true false
		test : function( element, type , isRecursion=false){
			// if its not a reecursive call, allow parameters to be passed
			// wihout being contained in an array container, but normalize 
			// them inside an array before starting
			if( !isRecursion ){
				if( !Array.isArray(element) ) element = [element];
				if( !Array.isArray(type) ) type = [type];
			}
			
			// check if type exists and perform the type test
			if( !Array.isArray(type)  && _Types.has( type ) ){
				return _Types.get( type )( element );
			};
			
			// if does not exist, perform some extra checks to support structured
			// types definitions, declared with Arrays ( [] ) and  Objects ( {} )
			
			// handle Arrays.
			if( Array.isArray(type) ){
				// both type and element need to be an array
				if( !Array.isArray(element) ) return false;
				// ...with the same length
				if( element.length !== type.length ) return false;
				// reject empty arrays
				if( !element.length ) return false;

				//  Inspect each array index 
				for( let i=0; i<element.length; i++) if(!Typed.test( element[i] , type[i] , true) ) return false;

				return true;
			}
		
			// handle Objects. Inspect each object property
			else if( _isPlainObject( type ) ){
				// both type and element have to be a plain object
				if(  !_isPlainObject( element ) ) return false
				// ...with same amount of properties
				if( Object.keys(type).length !== Object.keys(element).length ) return false;
				// Rejects empty objects, 
				if( !Object.keys(type).length ) return false;
				// Inspect all object properties (included non enumerable ones)
				let props = Object.getOwnPropertyNames(type)
				for(let i=0; i<props.length;i++) if( !Typed.test( element[ props[i] ] ,type[ props[i] ],true ) ) return false;   
				return true;
			}
			
			// if is not a plain object or an array return false
			else return false;

		}
	}


	// Detect the root object, and set the Typed API object in it 
	// `window`in the browser,
	// 'self' in WebWorkers
	// `global` in Node
 	let r = typeof window === 'object' && window.self === window && window ||
			typeof self === 'object' && self.self === self && self ||
			typeof global === 'object' && global.global === global && global;
     r.Typed = Typed;
	 
	 // make the Any type public
	 r.Any = Any;

	
})();
