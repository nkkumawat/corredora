## Login/Logout with OKTA
### Admin panel login URl 
<host_name>/admin/login

##### Step 1:
* Create a group for your customer
* Provide group name, success callback anf failure callback.
![Image of Login Flow with OKTA](./images/okta_1.png)

##### Step 2:
* Click on the group name.
![Image of Login Flow with OKTA](./images/okta_2.png)

##### Step 3:
* On sidebar click on Identity Provider and then click on New Identity Provider.
![Image of Login Flow with OKTA](./images/okta_3.png)

##### Step 4:
* Fill all details provided by the IDP metadata.
![Image of Login Flow with OKTA](./images/okta_4.png)

##### Step 5:
* Use Metadata URL for SP metadata.
![Image of Login Flow with OKTA](./images/okta_5.png)

##### Step 6:
* Share this metadata with the IDP Provider.
![Image of Login Flow with OKTA](./images/okta_6.png)

##### Step 7:
* Create Mappers for the use saml attribute. 
![Image of Login Flow with OKTA](./images/okta_7.png)
