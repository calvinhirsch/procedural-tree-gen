# Procedural Tree Generator (Javascript, HTML5)

This program procedurally draws trees when clicking and holding the mouse from the mouse location. It uses random angles and branch thickness calculated based on length.

![preview](https://github.com/calvinhirsch/procedural-tree-gen/blob/master/preview.gif)

## Installation & Use

To run, download the repository and open index.html. Click & hold to draw trees at the mouse location. Press z to undo.

To customize the trees, there are constants in script.js that determine different aspects of the generation.
```
const BRANCHMAXANGLE = Math.PI / 8;
const BRANCHLENGTH = 25;
const BRANCHINITWEIGHT = 1.2;
const BRANCHMAXWEIGHT = 10;
const BRANCHDEFAULTOPACITY = 0.35;
```