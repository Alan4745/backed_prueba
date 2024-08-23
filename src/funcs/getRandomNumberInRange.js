const getRandomNumberInRange = (num) => {
    if (num <= 0) return 0; // Manejo de números negativos o cero

    // let minFactor, maxFactor;

    // if (num <= 1000) {
    //     minFactor = 0.01;
    //     maxFactor = 0.1;
    // } else if (num >= 10000 && num <= 99999) {
    //     minFactor = 0.001;
    //     maxFactor = 0.01;
    // } else 
    //     minFactor = 0.0001;
    //     maxFactor = 0.001;
    // } else if (num >= 1000000 && num <= 9999999) {
    //     minFactor = 0.00001;
    //     maxFactor = 0.0001;
    // } else if (num >= 10000000 && num <= 99999999) {
    //     minFactor = 0.000001;
    //     maxFactor = 0.00001;
    // } else if (num >= 100000000 && num <= 999999999) {
    //     minFactor = 0.0000001;
    //     maxFactor = 0.000001;
    // } else 
    // minFactor = 0.00000001;
    // maxFactor = 0.0000001;

    const min = Math.ceil(num * 0.01);
    const max = Math.floor(num * 0.1);
    
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
};

module.exports = {
    getRandomNumberInRange
};
