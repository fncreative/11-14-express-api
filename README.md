![cf](https://i.imgur.com/7v5ASc8.png) Express
======

## Travis CI
[![Build Status](https://travis-ci.com/fncreative/11-14-express-api.svg?branch=master)](https://travis-ci.com/fncreative/11-14-express-api)

## Express-API
 This application allows you to create, request and delete entries for an album list. The contents of which will
 be stored in a MongoDB.
 
## Getting Started
- Fork this repository
- Clone this repository onto your machine.
- The local repository should now contain a folder structure that matches the one shown below.
    - lib/ : contains module definitions
    - data/ : contains the text files used by the program
    - __test__/ : contains jest unit tests
 - In your terminal you will need to install dependencies using 
the command:  npm i 
- To run test open your terminal use the command: npm run test

## Running in the command line

``http GET :3000/api/albums`` will retrieve all of the stored albums<br />
``http GET :3000/api/albums/<insert id>`` will retrieve a specific stored album<br />
``http POST :3000/api/albums title: '<album title>' year:'<album year>'`` will create a new album record<br/>
``http PUT :3000/api/albums/<insert id here> title: '<album title>' year:'<album year>'`` will update a single record<br/>
``http DELETE :3000/api/albums/<insert id here>`` will delete an album from storage
 
## Error Handling
- If users' request doesn't contain an album title or year then the application will send a 400 status code.
- If user makes a request that the server is unable to respond to, the application will send a 404 status.   

## Author 
- Daniel Frey
