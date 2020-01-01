## How to install
```bash
git clone https://github.com/nkkumawat/Saml-SSO
cd Saml-SSO
npm i
```

change database credentials in config/config.json
```
"database": {
  "username": "root", 
  "password": "Root@1234",
  "database": "samlApp",
  "host": "localhost",
  "dialect": "mysql"
},
"host": "http://localhost",
"secret":  "dummy",
"certificate-life": 1000,
"token-life": 900,
"password-salt-rounds": 10
```
#### start the app
```bash
pm2 start
```

