import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window; //this gives us access to the ethereum object on our browser (type window.ethereum on your browser console). It is only accessable if metamask is installed

//a contract that lets you get your contract from the blockchain
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: '' }); //get's our transaction form data by keeping track of the state
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value })); //prevState is inbuilt in react and keeps track of the previous state. This command eventually reads the inputs from the formData 
    } //this will update the form data with inputs depending on the name of the input field

    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert('Please install MetaMask');
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.to,
                addressFrom: transaction.from,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(), //converts the timestamp to a more readable format
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18) //converts our amount back to eth from hexadecimal  
            }));
            console.log(structuredTransactions);

            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error)
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                return alert('Please install MetaMask');
            } //if no wallet is installed
            const accounts = await ethereum.request({ method: 'eth_accounts' }); //request for accounts. This request is an RPC request
            
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
    
                getAllTransactions();
            } else {
                console.log('No account found');
            }
    
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object.')
        }
    }   //This checks if our wallet is connected and get's our account/transaction info

    const checkIfTransactionsExist = async () => {
        try {
            //if (!ethereum) return alert('Please install MetaMask');
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount)
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert('Please install MetaMask');
            
            const get_accounts = await ethereum.request({ method: 'eth_requestAccounts' }); //gives us an array of all our accounts

            setCurrentAccount(get_accounts[0]); //sets the default account to the 1st account in the array
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert('Please install MetaMask');
            //get data from the transaction form to here
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount); //converts the amount to gwei

            await ethereum.request({ 
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //reps 21000 gwei in hexadecimal
                    value: parsedAmount._hex //converts to hexadecimal
                }]
            });

            const transaction = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            const transactionHash = transaction.hash;
            setIsLoading(true);
            console.log(`Loading - ${transactionHash}`);
            await transaction.wait(); //waits for our transaction to be completed

            setIsLoading(false);
            console.log(`Success - ${transactionHash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
            window.location.reload(); //refreshes the page each time we add a new transaction. The .location remains at the point the user was last at
    
        } catch (error) {
            console.log(error);
            throw new Error('No ethereum object');
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionContext.Provider value={{ connectWallet: connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}> {/*the key and value have the same name you can alternatively just pass the value alone if they have the same name*/}
            {children}
        </TransactionContext.Provider>
    )
} //This is a context provider we use this in main.jsx and it let's the entire application access the values, states or props passed into it