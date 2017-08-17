## Get started

* Run `npm install` to install node modules
* Run `npm install -g gulp` to install Gulp
* Run `npm run serve`
NOTE: 
If you run this website on the file system, it is highly recommended to use Google Chrome with flag __--disable-web-security__.
As an option, you can also host the website on any server (IIS, node.js, Apache etc.).

## Tasks
* Run `serve` to start working with project (it is build html, open localhost and start you site)
* Run `build` to compile you project like dist version (minified and uglified) in dist folder
* Run `production` to compile you project like dist version (minified and uglified) in dist folder with the necessary files for production
* NOTE: if you use a terminal for running task, type `npm run` before task name. Command should look like `npm run serve`, `npm run build`, etc.

## Folder structure

* app - contains static files (fonts, images, documents, swf etc.)
	* resources - contains all static elements (fonts, images, documents, swf etc.)
	* scripts - contains all javascript code
	* styles - contains all styles 
	* templates - contains all Html pages parts
	
* dist - this folder contain release or development version of site
"# phonebook" 
