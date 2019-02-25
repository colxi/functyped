## Functyped : Specifications

| [Home](./README.md) | Specs | Usage | Install | Expand |


<div id="cols" class="cols">
	<div class="">
       <h3>About :</h3>
    lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  v lorem ipsum dolorem amet  v v v lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  lorem ipsum dolorem amet  
    </div>
	<div class="">
        <h3>Characteristics & features :</h3>
        - Tiny (6Kb minified)<br>
        - No dependencies<br>
        - Multi enviroment & crossbrowser (Node, Chrome, Firefox, Safari, Edge...)<br>
        - Multiple function declaration styles : Overload / Inline / Interfaces <br>
        - Declarative / Imperative typechecks available<br>
        - Complex type structures supported<br>
        - Configurable<br>
        - Expandable (custom types)<br>
    </div>
</div>



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