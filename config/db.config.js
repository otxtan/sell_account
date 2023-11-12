module.exports = {
    // HOST: "192.168.1.161",
    HOST: "localhost",
    PORT: "1433",
    USER: 'sa',
    PASSWORD: "sa",
    DB: "sellaccount",
    dialect: "mssql", //'mysql'
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
}