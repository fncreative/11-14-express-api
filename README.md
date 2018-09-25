![cf](https://i.imgur.com/7v5ASc8.png) 11: Express
======

## Travis CI
[![Build Status](https://travis-ci.com/fncreative/11-14-express-api.svg?branch=master)](https://travis-ci.com/fncreative/11-14-express-api)

## Express-API
 This application allows you to create, request and delete entries for an album list.
 
## Getting Started
- Fork this repository
- Clone this repository onto your machine.
- The local repository should now contain a folder structure that matches the one shown below.
    - lib/ : contains module definitions
    - data/ : contains the text files used by the program
    - __tests__/ : contains jest unit tests
 - In your terminal you will need to install dependencies using 
the command:  npm i 
- To run test open your terminal use the command: npm run test

## Error Handling
- If users' request doesn't contain an album title or year then the application will send a 400 status code.
- If user makes a request that the server is unable to respond to, the application will send a 404 status.   

## Author 
- Daniel Frey
