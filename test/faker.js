'use strict';

const _ = require('lodash');
const faker = require('faker');


// https://github.com/Marak/faker.js#setting-a-randomness-seed
const seed = 322;
const float_option = { min: 0, max: 1, precision: 0.01 };

class FreedomFaker {

    constructor() {
        faker.seed(seed);

        this.faker = faker;
    }

    get native() {
        return this.faker;
    }

    get lorem() {
        return this.faker.lorem;
    }

    get random() {
        return this.faker.random;
    }

    get name() {
        return this.faker.name;
    }

    get address() {
        return this.faker.address;
    }

    word() {
        return this.faker.random.word();
    }

    /**
     *
     * @returns {String}
     */
    email() {
        return _.clone(this.faker.internet.email());
    }

    /**
     *
     * @param {Object} [options={precision:1}]
     * @param {Number} [options.max]
     * @param {Number} [options.min]
     * @param {Number} [options.precision=1]
     * @returns {Number}
     */
    number(options) {
        return this.faker.random.number({precision: 1, ...options});
    }

    /**
     * Returns money amount
     *
     * @param digitCount number of places the generate digit should have
     * @returns {Number}
     */
    money(digitCount) {
        let money = this.number() + this.float();

        if (digitCount) {
            const lowerBound = Math.pow(10, digitCount - 1);
            const upperBound = Math.pow(10, digitCount);

            money = (Math.floor(Math.random() * upperBound) + lowerBound)
                + this.float();
        }

        return money;
    }

    negativeNumber() {
        return Math.abs(this.number()) * -1;
    }

    float() {
        return this.faker.random.number(float_option);
    }
}

module.exports = new FreedomFaker();
