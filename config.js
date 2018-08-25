module.exports = {
  port: process.env.PORT || 3005,
  db: process.env.MONGODB_URI || 'mongodb://localhost:27017/simepdb',   
  //db: process.env.MONGODB_URI || 'mongodb://admin:adminTinf0r@ds131942.mlab.com:31942/simepdb',
  SECRET_TOKEN: 'miclavedetokens'
}
