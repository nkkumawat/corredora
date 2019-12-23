var xml2js = require('xml2js').parseString;

module.exports = {
  getAttributes: (samlData) => {
    var attrHash = {}
    if(samlData){
      var assertion = samlData.Assertion
      if(assertion){
        var attributeStatement = assertion.AttributeStatement
        if(attributeStatement) {
          attributes = attributeStatement[0]
          if(attributes){
            var attrs = attributes.Attribute
            if(attrs) {
              attrs.forEach(atr => {
                key = atr['$']['Name'];
                value = atr['AttributeValue'][0]['_']
                attrHash[key] = value;
              });
            }
          }
        }
      }
      return attrHash;
    }
  }
}