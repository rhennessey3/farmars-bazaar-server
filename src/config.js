module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/farmers-bazaar',
    DATABASE_URL: process.env.DB_URL || 'postgres://jxsjdcwrehagbq:3c02a47f10871c3fe78046a1f6c01a8ad0c3a997152736e3de5ae84baaf9cd2e@ec2-34-237-247-76.compute-1.amazonaws.com:5432/d8k1p8acthhnt0',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CLIENT_ORIGIN: '*'
}
