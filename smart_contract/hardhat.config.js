require('@nomiclabs/hardhat-waffle'); //waffle is a hardhat plugin for building smart contract tests
require('dotenv').config() //needed to load variables from .env

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: process.env.ALCHEMY_URL,
      accounts: [process.env.PRIVATE_KEY] //takes in your private key. todo: make a .env file with your details and pass it here
    }
  }
}