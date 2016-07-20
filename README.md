(C) 2015 Nokia Solutions and Networks. All rights reserved.

# Nokia Web UI Look & Feel (Nokia WULF)

Light-weight and responsive implementation of Nokia Web Look & Feel as is defined in OT3:  
https://sharenet-ims.inside.nokiasiemensnetworks.com/Download/D521667724 or  
https://confluence.inside.nsn.com/download/attachments/293570140/OT30_styleguide_august_2014%5B1%5D.pdf?version=1&modific$


# Instructions (END USAGE)

Distribution package contains folders:

Wulffulldist/Wulfdist folder with subfolders can be copied as it is to your web system,
and that provides you the Nokia L&F.
You need to include the following statements to your main web page:
```html
<link href="wulfdist/css/wulf.css" rel="stylesheet">
<script src="wulfdist/js/dependencies/jquery.min.js"></script>
<script src="wulfdist/js/wulf.js"></script>
```
Some components require adding further includes, those you see from the component examples in the demo system.
You can use the demo-frame.html page to view the separate components and also the examples.

It is recommended that you ignore the WULF in your own projects proofing / code analysis tools
(for example by adding the wulfdist folder inside the .jshintignore file in your project).

jQuery is a dependency and is included with the distribution, but if you do not want to
host jQuery yourself, you can use a CDN, like the one provided by Google and include
it using a script tag:
    https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js


# Folder Structure Explained (DEVELOPER)

- bootstrap - pure, original bs sources (NO FILE MODIFICATION TO THIS LOCATION)  
- w-less - new, additional scripts developed for wulf, overrides bootstrap components
- test - unit test source files (nodeunit)

The following folders are for new, additional components developed for wulf, including OT fonts/images as needed
- w-fonts
- w-img
- w-js

- w-css         css definitions for the demo
- w-examples    js for the examples
- w-demo        demo including examples
- w-license     needed license files from the 3rd party components

GENERATED FOLDERS (don't edit folder content directly, it is generated via grunt compilation)
- wulffulldist              WULF examples and additions
- wulffulldist/wulfdist     WULF DISTRIBUTION

The other folders including the root level contain reference implementations of some common UI functions.
Feel free to reuse the codes.

# Files Explained
- demo-frame.html -  containing visual examples of all LF components for demo purpose,
  does not require web server

# Compilation commands Explained (DEVELOPER)
If you need to compile WULF, use the grunt.
Here are few commonly needed/used compilation options:
- dist - compiles all, cleans distribution folders, copies files to distribution folders
- test - xxx
- watch - tracks if there are any changes in the listed folders, in case of changes it compiles
- src, test, less, demo, examples files, ... TBD

When fetching/pulling changes from origin/upstream, please run dist at least once to ensure
that you have the correct/updated files in the distribution locations. In case of error in execution
run it second time (as there are occasional folder removal problems).

When using the components, please use only those which you find from WULF demo-frame.html (as those
are styled according to OT3). If you use directly the Bootstrap components the L&F is not from OT3.

# Tips
If needed, fuelux.css import declaration should always reside before wulf.css declaration in html
