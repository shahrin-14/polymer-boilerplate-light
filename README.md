# Polymer Boilerplate Light

This is a boilerplate for [Polymer](http://www.polymer-project.org/) 2.0 with minimal tools and dependencies for people behind proxies and firewalls in a locked computer.

## Features

* Minimal tools. Only used NPM and Gulp. No Bower or Polimer-CLI.

## Prerequisites
We only need [Gulp](http://gulpjs.com/) to be installed globally.

```
#Run the following to install gulp globally
npm install -g gulp
#Run this line to install all project specific dependent items
npm install
```

## Project Structure
All code that is used for development is in the 'src' folder. There we have 2 main folders:

*   CustomComponents

 Items in this folder will go through the build process

*   StaticComponents

 Components that you get online, which you want to make a reference to will be placed here. See [Pre Build](#pre-build).
 
## Pre Build
Run `gulp initialize-ExternalResources`
This task downloads all external resources required into specified location (See the ExternalResources array in gulpfile.js).
Do change the following code accordingly if you are behind a proxy.
```
return download(resource.url, {
              //proxy : "http://<my-proxy-server>:<port-number>"
            })
```
Run `gulp build-ExternalResources`
This task copies items from src/StaticComponents to dist/StaticComponents

## Build
Run `gulp build`

This task performs the following:

*   Cleans the dist folder except for dist/StaticComponents
*   Copies all corresponding files into the dist folder except for dist/CustomComponents (which will go through the build process below) and dist/StaticComponents (which is manually maintained in the Pre Build step above)
*   HTML files in folder src/CustomComponents will be separated into HTML and JS files using crisper
*   ES6 JS syntax will be transformed using Babel
*   Specified files will be aggregated for optimization using Vulcanize

## Run
Run `gulp serve`
Then open a browser and log on to [http://localhost:3000/](http://localhost:3000/)