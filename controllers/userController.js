var mapperService = require("../services/mapperService")
var userService = require("../services/userService")
module.exports = {
  createUser: (groupId, attributes) => {
    return new Promise((resolve, reject) => {
      mapperService.getGroupMappers({group_id: groupId}).then(mappers => {
        var userParams = {
          attributes: {}
        }
        mappers.forEach(mapper => {
          if(mapper.user_attribute === "email"){
            userParams['email'] = attributes[mapper.saml_attribute]
          } else if(mapper.user_attribute === "username") {
            userParams['username'] = attributes[mapper.saml_attribute]
          } else {
            userParams["attributes"][mapper.user_attribute] = attributes[mapper.saml_attribute]
          }
        });
        if(userParams['email'] == null || userParams['email'] == "undefined") {
          userParams["email"] = attributes.nameID
        }
        if(userParams['username'] == null || userParams['username'] == "undefined") {
          userParams["username"] = attributes.nameID
        }
        userParams['attributes'] = JSON.stringify(userParams['attributes'])
        userParams['group_id'] = groupId;
        userParams['saml_attributes'] = JSON.stringify(attributes);
        userParams['name_id'] = attributes.nameID
        userService.createUser(userParams).then(user => {
          resolve(user);
        }).catch(err => {
          console.log(err)
          reject(err);
        })
      }).catch(err => {
        console.log(err)
        reject(err);
      })
    })
    
  }
}