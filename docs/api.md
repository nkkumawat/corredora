## How to access APIs
http basic auth
```
curl -u email:user_token -X POST  http://<host_url>/<end_point>
```

## Get the token

### request

```
POST /api/get-token
```

### response

```json
{
    "status": true,
    "data": {
        "token: 'token-string'
    }
}

```

## Verify the token sent by app

### request

```
POST /api/verify-token
```

#### body
```json
   {
      "token" : "STRING" 
    }
```
### response

```json
{
    "status": true,
    "data": {
        "valid": true,
        "data": {
            "id": 5,
            "group_id": 1,
            "email": "narendra@something.com",
            "username": "username",
            "attributes": "{\"firstName\":\"Narendra\",\"last\":\"Kumawat\"}",
            "saml_attributes": "{\"firstName\":\"Narendra\",\"lastName\":\"Kumawat\",\"nameID\":\"narendra@something.com\"}",
            "createdAt": "2019-12-24T16:55:39.000Z",
            "updatedAt": "2019-12-24T16:55:39.000Z"
        }
    }
}

```
<hr>
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


## Get a group

### request
```
GET /api/group
```
#### query
```json
  "group_id": "INT"
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


## Get groups in bulk

### request
```
GET /api/groups
```
#### query
```json
    {
      "offset": "INT",//default 0
      "limit": "INT",
    }
```

### response
```json
{
    "status": true,
    "data": {
        "group": [
            {
                "id": 2,
                "group_name": "afs",
                "succ_callback": "sfsdfsdifsd",
                "fail_callback": "sehtetewfasfasf",
                "createdAt": "2019-12-30T16:10:16.000Z",
                "updatedAt": "2020-01-01T13:13:38.000Z"
            },
            {
                "id": 3,
                "group_name": "fsdfsdfsd",
                "succ_callback": "fsdfdsfsdf",
                "fail_callback": "fsdfsdfsdfsdf",
                "createdAt": "2019-12-30T16:10:16.000Z",
                "updatedAt": "2020-01-01T13:13:38.000Z"
            }
        ]
    }
}
```


## Get groups IDP data

### request
```
GET /api/group/<group_id>/idp
```

### response
```json
{
    "status": true,
    "data": {
        "idpData": {
            "id": 1,
            "group_id": 2,
            "sso_login_url": "https://dev.com/app//sso/saml",
            "sso_logout_url": "https://dev.com/app/sso/saml",
            "certificates": "",
            "force_authn": true,
            "sign_get_request": false,
            "allow_unencrypted_assertion": false,
            "createdAt": "2019-12-30T16:13:32.000Z",
            "updatedAt": "2019-12-30T16:16:47.000Z",
            "sp_datum": {
                "id": 1,
                "group_id": 2,
                "entity_id": "http://localhost:3000",
                "private_key": "",
                "certificate": "",
                "assert_endpoint": "http://localhost:3000/assert",
                "alt_private_keys": null,
                "alt_certs": null,
                "audience": null,
                "notbefore_skew": null,
                "force_authn": false,
                "auth_context": null,
                "nameid_format": "string:urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                "sign_get_request": false,
                "allow_unencrypted_assertion": false,
                "createdAt": "2019-12-30T16:16:47.000Z",
                "updatedAt": "2019-12-30T16:16:47.000Z"
            },
            "group": {
                "id": 2,
                "group_name": "afs",
                "succ_callback": "sfsdfsdifsd",
                "fail_callback": "sehtetewfasfasf",
                "createdAt": "2019-12-30T16:10:16.000Z",
                "updatedAt": "2020-01-01T13:13:38.000Z"
            }
        }
    }
}
```


## Get groups Mappers data

### request
```
GET /api/group/<group_id>/mappers
```

### response
```json
{
    "status": true,
    "data": {
        "mappers": [
            {
                "id": 2,
                "group_id": 2,
                "saml_attribute": "nknknkknknknknnkkn",
                "user_attribute": "lname",
                "createdAt": "2019-12-30T16:17:47.000Z",
                "updatedAt": "2020-01-01T18:15:30.000Z"
            }
        ]
    }
}
```

## Get groups users data

### request
```
GET /api/group/<group_id>/users
```

### response
```json
{
    "status": true,
    "data": {
        "users": [
            {
                "id": 1,
                "group_id": 2,
                "name_id": null,
                "email": null,
                "username": null,
                "attributes": null,
                "saml_attributes": null,
                "createdAt": "2019-10-10T00:00:00.000Z",
                "updatedAt": "2019-10-10T00:00:00.000Z",
                "sessions": []
            }
        ]
    }
}
```
## Delete a group

### request
```
DELETE /api/group
```
#### body
```json
  "group_id": "INT"
```

### response
```json
{
    "status": true,
    "data": {
        "deleted": true
    }
}
```
## Update a group

### request
```
PATCH /api/group
```
#### body
```json
   parmas = {
      "group_id": "INT",
      "group_name": "STRING", // optional
      "succ_callback": "STRING", // optional
      "fail_callback": "STRING" //optional
    }
```

### response
```json
{
    "status": true,
    "data": {
        "updated": true
    }
}
```
<hr>
## Create a mapper

### request
```
POST /api/mapper
```
#### body
```json
  {
    "group_id": "STRING",
    "saml_attribute": "STRING",
    "user_attribute": "STRING"
  }

```

### response
```json
{
    "status": true,
    "data": {
        "group": {
            "id": 10,
            "group_id": 10,
            "saml_attribute": "EMaiL",
            "user_attribute": "email",
            "updatedAt": "2019-12-28T17:43:25.894Z",
            "createdAt": "2019-12-28T17:43:25.894Z"
        }
    }
}
```

## Get a mapper

### request
```
GET /api/mapper
```
#### query
```json
  {
    "mapper_id": "INT",
  }

```

### response
```json
{
    "status": true,
    "data": {
        "mapper": {
            "id": 2,
            "group_id": 2,
            "saml_attribute": "lastName",
            "user_attribute": "lname",
            "createdAt": "2019-12-30T16:17:47.000Z",
            "updatedAt": "2019-12-30T16:17:47.000Z"
        }
    }
}
```

## Get mappers in bulk

### request
```
GET /api/mapper
```
#### query
```json
    {
      "offset": "INT",//default 0
      "limit": "INT",
    }
```

### response
```json
{
    "status": true,
    "data": {
        "mappers": [
            {
                "id": 2,
                "group_id": 2,
                "saml_attribute": "lastName",
                "user_attribute": "lname",
                "createdAt": "2019-12-30T16:17:47.000Z",
                "updatedAt": "2020-01-01T18:15:30.000Z"
            }
        ]
    }
}
```


## Update a mapper

### request
```
PATCH /api/mapper
```
#### body
```json
{
    "mapper_id": "INT",
    "group_id": "INT",
    "saml_attribute": "STRING",
    "user_attribute": "STRING"
}
```

### response
```json
{
    "status": true,
    "data": {
        "updated": true
    }
}
```

## Delete a mapper

### request
```
DELETE /api/mapper
```
#### body
```json
  {
    "mapper_id": "INT",
  }

```

### response
```json
{
    "status": true,
    "data": {
        "deleted": true
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
            "entity_id": "http://localhost",
            "private_key": "",
            "certificate": "",
            "assert_endpoint": "http://localhost/saml/adfs/assert",
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


## Get a Identity provider
### request
 ```
 GET /api/idp
```
##### query 
```json
    {
      "idp_id" : "INT",
    }
```
### response
```json
 {
    "status": true,
    "data": {
        "idpData": {
            "id": 1,
            "group_id": 2,
            "sso_login_url": "https://sso/saml",
            "sso_logout_url": "https://sso/saml",
            "certificates": "",
            "force_authn": true,
            "sign_get_request": false,
            "allow_unencrypted_assertion": false,
            "createdAt": "2019-12-30T16:13:32.000Z",
            "updatedAt": "2019-12-30T16:16:47.000Z",
        },
        "spData": {
            "id": 1,
            "group_id": 2,
            "entity_id": "http://localhost",
            "private_key": "",
            "certificate": "",
            "assert_endpoint": "http://localhost/saml/demoNk/assert",
            "alt_private_keys": null,
            "alt_certs": null,
            "audience": null,
            "notbefore_skew": null,
            "force_authn": false,
            "auth_context": null,
            "nameid_format": "string:urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
            "sign_get_request": false,
            "allow_unencrypted_assertion": false,
            "createdAt": "2019-12-30T16:16:47.000Z",
            "updatedAt": "2019-12-30T16:16:47.000Z"
        }
    }
}
```


## Get Identity providers in bulk
### request
 ```
 GET /api/idp
```
##### query 
```json
   {
      "offset": "INT", //default 0
      "limit": "INT",
    }
```
### response
```json
 {
    "status": true,
    "data": {
        "idpData": [
            {
                "id": 1,
                "group_id": 2,
                "sso_login_url": "https://dev.com/app//exkozo1jhe6uVD5pZ0h7/sso/saml",
                "sso_logout_url": "https://dev.com/app//sso/saml",
                "certificates": "",
                "force_authn": true,
                "sign_get_request": false,
                "allow_unencrypted_assertion": false,
                "createdAt": "2019-12-30T16:13:32.000Z",
                "updatedAt": "2019-12-30T16:16:47.000Z",
                "sp_datum": {
                    "id": 1,
                    "group_id": 2,
                    "entity_id": "http://localhost:3000",
                    "private_key": "",
                    "certificate": "",
                    "assert_endpoint": "http://localhost:3000/saml/demoNk/assert",
                    "alt_private_keys": null,
                    "alt_certs": null,
                    "audience": null,
                    "notbefore_skew": null,
                    "force_authn": false,
                    "auth_context": null,
                    "nameid_format": "string:urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                    "sign_get_request": false,
                    "allow_unencrypted_assertion": false,
                    "createdAt": "2019-12-30T16:16:47.000Z",
                    "updatedAt": "2019-12-30T16:16:47.000Z"
                }
            }
        ]
    }
}
```
