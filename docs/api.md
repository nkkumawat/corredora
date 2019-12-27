## How to access APIs
http basic auth
```
curl -u email:user_token -X POST  http://<host_url>/<end_point>
```

## Create a group

### request
```
POST /api/group
```
#### body
```json
  {
    "group_name": "STRING",
    "succ_callback": "STRING",
    "fail_callback": "STRING"
  }

```

### response
```json
{
    "status": true,
    "data": {
        "group": {
            "id": 10,
            "group_name": "group_name",
            "succ_callback": "https://google.com",
            "fail_callback": "https://google.com",
            "updatedAt": "2019-12-27T11:43:25.894Z",
            "createdAt": "2019-12-27T11:43:25.894Z"
        }
    }
}
```
<hr>


## Create a Identity provider
### request
 ```
 POST /api/idp
```
##### body 
```json
    {
      "group_id" : "INT",
      "sso_login_url": "STRING",
      "sso_logout_url": "STRING",
      "certificates": "STRING",
      "nameid_format": "STRING",
      "force_authn": "BOOLEAN",
    }
```
### response
```json
 {
    "status": true,
    "data": {
        "idpData": {
            "id": 7,
            "group_id": "5",
            "sso_login_url": "asfasfasfasf",
            "sso_logout_url": "fasfasf",
            "certificates": "fasfasf",
            "force_authn": true,
            "sign_get_request": false,
            "allow_unencrypted_assertion": false,
            "createdAt": "2019-12-26T16:41:39.000Z",
            "updatedAt": "2019-12-26T16:53:10.032Z"
        },
        "spData": {
            "id": 5,
            "group_id": "5",
            "entity_id": "http://local.bsstag.com:3000",
            "private_key": "",
            "certificate": "",
            "assert_endpoint": "http://local.bsstag.com:3000/saml/adfs/assert",
            "alt_private_keys": null,
            "alt_certs": null,
            "audience": null,
            "notbefore_skew": null,
            "force_authn": false,
            "auth_context": null,
            "nameid_format": "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
            "sign_get_request": false,
            "allow_unencrypted_assertion": false,
            "createdAt": "2019-12-26T16:45:41.000Z",
            "updatedAt": "2019-12-26T16:53:10.200Z"
        }
    }
}
```