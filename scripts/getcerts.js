https://www.hacksparrow.com/nodejs/https-ssl-certificate.html


 
Your email address
 
Your Name
Subscribe to my newsletter.

Homenodejshttps-ssl-certificate.html
Node.js: HTTPS SSL Certificate
Mar 22, 2012
#node.js
#ssl
#https
How to set up a Node.js HTTPS server#
Need to use HTTPS for a project? Or just wondering how easy or tough it is to implement HTTPS in Node.js? In this post I'll show you how to set up an HTTPS Node.js server on your local system.

First off, we'll need to create a SSL certificate for our server. The recommended way is to get your certificate signed by a Certificate Authority, but for testing purposes we will sign it ourself.

$ openssl genrsa -out hacksparrow-key.pem 1024 
$ openssl req -new -key hacksparrow-key.pem -out certrequest.csr
... bunch of prompts
$ openssl x509 -req -in certrequest.csr -signkey hacksparrow-key.pem -out hacksparrow-cert.pem
In the second command, when prompted for "Common Name (eg, YOUR name) []:", do not give your name. It is actually the domain name field, so enter your domain name. Not giving your domain name will result in "domain mismatch" errors.
There you have it - your SSL certificate. Nothing prevents this certificate from being used on a production server, but browsers will show a loud warning to its users about the 'dubious' nature of the certificate. If you are serious about your reputation, better not use a self-signed certificate at all.

Now that we are done with the acquiring of an SSL certificate, let's set up our HTTPS server.

var https = require('https');
var fs = require('fs');

var hskey = fs.readFileSync('hacksparrow-key.pem');
var hscert = fs.readFileSync('hacksparrow-cert.pem')

var options = {
    key: hskey,
    cert: hscert
};

https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("Hi from HTTPS");
}).listen(8000);
Setting up an HTTPS Node.js server is that easy. In case you are using the Express.js Web framework, do this to set up an HTTPS Express server:

var fs = require('fs');

var hskey = fs.readFileSync('hacksparrow-key.pem');
var hscert = fs.readFileSync('hacksparrow-cert.pem')

var options = {
    key: hskey,
    cert: hscert
};
var app = require('express').createServer(options);
Very simple again.

If you are a business enterprise, it is highly recommended that you get your SSL certificate signed by a reputed and authorized CA. Good luck with your project / experiment.

 Tweet this |  Share on LinkedIn | 

Related
Node.js: Exiting from the Node console
How to exit from the Node.js command line So you loaded the Node REPL console by typing node at the command line, played around with it and want to get back to your OS command line. Press CTRL+c (eve...

Aug 01, 2011
Node.js: exports vs module.exports
What is the difference between exports and module.exports in Node.js? Let's first take a look at what the module object is all about. Create a file named run.js with the following content.

May 27, 2019
Node.js: Installing on Windows
How to install Node.js and npm on Windows Installing Node.js and npm on Windows is a very straightforward process. There are two versions of Node.js that can be downloaded: Current - the latest versi...

Oct 26, 2011
Copyright © 2019 Hage Yaapa