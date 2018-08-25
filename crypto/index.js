var crypto = require('crypto'),
    algorithm = 'aes-128-ecb',
    password = '1eVRiqy7b9Uv7ZMM';


function encryptar(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  }
  
  function desencryptar(text){
      var decipher = crypto.createDecipher(algorithm,password)
      var dec = decipher.update(text,'hex','utf8')
      dec += decipher.final('utf8');
      return dec;
  }

  module.exports = {
    encryptar,
    desencryptar
}