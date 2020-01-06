## Corredora 
* SAML based communication between Service Provider and Identity Provider.
* SP Initiated and IDP Initiated SSO with the same configuration.
* Give Full control to Service provider to manage configurations.
* REST APIs to Automate the configuration.
* Choice in database (mysql/postgres/mssql) to configure the app.
* Easy to configure.

### How to install
```bash
$ git clone https://github.com/nkkumawat/corredora
$ cd corredora
$ npm install
```
#### Configure the app
Change database credentials in config/config.json
```js
"database": {
  "username": "root", 
  "password": "root",
  "database": "samlapp",
  "host": "localhost",
  "dialect": "mysql" //(mysql/mssql/postgres)
}
```

<code>host</code> host name where app is running<br>
<code>port</code> port number where app is running<br>
<code>secret</code> host secret to sign jwt token<br>
<code>certificate-life</code> SP cerificate validity time (in days)<br>
<code>token-life</code> token life in seconds<br>
<code>admin</code> admin credentials<br>
<code>log-dir</code> log file directory (development.log)<br>


### 
#### To start the app
```bash
pm2 start
```
### Documentation
Click [here](./docs) for documentaion.
Click [Narendra Kumawat – Medium](https://medium.com/@narendra11510145) for blogs.

### Contribute
Thank you for your interest in contributing to this open source project!
To contribute follow the below guidelines
* Create an issue and comment on issue that you are solving.
* Fix the issue 
* Raise a Pull request.
