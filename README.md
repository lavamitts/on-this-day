# Biddenham Village website WordPress SCSS

This folder contains the SCSS and CSS files used to customise the biddenham.org.uk website.

## How to use

Form this folder, run one of these scripts:

To generate a compressed version of the CSS (preferred) which watches as changes are made

`sass --watch ./scss/otd.scss:./css/otd.css --no-source-map --style=compressed`

To generate an uncompressed version of the CSS (for testing) which watches as changes are made:

`sass --watch ./scss/otd.scss:./css/otd.css --no-source-map --style=expanded`

As a one-off CSS generation script, run this:

`sass ./scss/otd.scss ./css/otd.css --no-source-map --style=compressed`

or this:

`sass ./scss/otd.scss ./css/otd.css --no-source-map --style=expanded`

## Installation

This uses the Dart Sass command-line interface (CLI), which is part of the sass npm package.

To install this globally:

`npm install -g sass`
