## How to install
```bash
git clone https://github.com/nkkumawat/Saml-SSO
cd Saml-SSO
npm i
```
#### Configure the app
Change database credentials in config/config.json
```json
"database": {
  "username": "root", 
  "password": "root",
  "database": "samlapp",
  "host": "localhost",
  "dialect": "mysql" //(mysql/mssql/postgres)
}
```

<code>host</code> host name where app is running
<code>port</code> port number where app is running
<code>secret</code> host secret to sign jwt token
<code>certificate-life</code> SP cerificate validity time (in days)
<code>token-life</code> token life in seconds
<code>admin</code> admin credentials
<code>log-dir</code> log file directory (development.log)


#### To start the app
```bash
pm2 start
```

