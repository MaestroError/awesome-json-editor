# awesome-json-editor
The most awesome interface for generating and editig JSON.   
it's powered with .aje format (aje is json data defined specificaly for AwesomeJsonEditor)  
You can easly customize UI, just edit vue components, add some more css or even change html structure, just use same events

## Technologies
- [Tailwind CSS](https://tailwindcss.com/)
- [Vue.js](https://vuejs.org/)

## Download
``git clone https://github.com/MaestroError/awesome-json-editor``

#### To Do  

#### groups & custom actions
allowActions options must be setted true if you need to use custom actions:
- deny deletes - denies deletion of input on some groups
- import denies - denies to use some inputs on some groups
- import groups - creates new groups with predefined inputs

grouping logic: all - for all cards, card-{INT} by card depth and {card_key} by card name    
you can add new input types by using `addType` method - don't forget to add new input type component .js file in `js/components` folder