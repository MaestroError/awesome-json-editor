# awesome-json-editor
The most awesome interface for generating and editig JSON.   
it's powered with .aje format (aje is json data defined specificaly for AwesomeJsonEditor)  
You can easily customize UI, just edit vue components, add some more css or even change html structure, just use same events

## Technologies
- [Tailwind CSS](https://tailwindcss.com/)
- [Vue.js](https://vuejs.org/)

## Download
``git clone https://github.com/MaestroError/awesome-json-editor``

#### To Do  
- check&add: need a possibility to add a default object (as a configuration), for creating the more advanced user experience ??
- check&add: need to add a new configuration for disabling/enabling data types and naming them. ??

### Future advancement
- Refactor aje Class, make it simple and add comments for everything
- Rename parts of aje more logically
- Advance aje's API to make it more flexible and readable, add separate methods for all element of class
- Standardize configs and write documentation for every entry in config
- Make it easy to use, add getting started guide and Docs for methods (API of aje)
- Make components buildable as class, make ready to use methods from aje and their templates overridable
- Create examples (with default UI and others)
- Write docs to explain how to manage it from server and save/use it like admin panel
- Find out how to serve aje class as separate module for: JS, Node & Vue to use in any custom UI
- Find out all unnecessary lines of code and remove
- Make this UI Buildable inside any div element, to be served from CDN
- Try to make example for server-side use as admin panel and add it in docs

## Features
Main features for AJE

#### Input types:
Already created input types:
- string
- int
- array
- object
- image
- custom object (with import groups utility)

#### groups & custom actions
allowActions option must be setted true if you need to use custom actions:
- deny deletes - denies deletion of input on some groups
- import denies - denies to use some inputs on some groups
- import groups - creates new groups with predefined inputs

grouping logic: all - for all cards, card-{INT} by card depth and {card_key} by card name    
you can add new input types by using `addType` method - don't forget to add new input type component .js file in `js/components` folder