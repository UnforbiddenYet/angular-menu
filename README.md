angular-menu
=====================

An Angular directive for showing an offscreen menu on swipe or on click.
Supports 4 sides(top, right, bottom and left) and 4 effects (overlay, push, reveal, bounce).

##Dependencies:

 - Greensock(for animating)
 - ng-touch(optional, for swipe support)

##How to use:

  1. Just add angular-menu.js to your project and set templateUrl to a proper template path;
  2. Edit templates/angular-menu-template.html due to your needs;
  3. Include ```<div my-aside menu-items="menuColumns" effect-type="push" properties="navProps">``` to your html file and add content to this div. It would be wrapped automatically by directive;
  4. Define menuColumns and navProps in the scope of your controller. Feel free to rename the variables;
  5. Change styles for your needs;

## Example
Please see example in index.html
