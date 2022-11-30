import React , {useState , useEffect} from 'react'
import { ContractInstance, signer, signMessage } from "./config";

import { ethers } from "ethers";
import * as Styled from "./style"
import BigNumber from 'bignumber.js';

const WalletConnect = () => {
    const { ethereum } = window;
    const [walletconnected , setWalletConnected] = useState(false)
    const [userAccount, setUserAccount] = useState("");
    const [balance, setBalance] = useState("");

    // useEffect(()=> {
    //    const promise = ethereum._metamask.isUnlocked()
    //    promise.then((value) =>
    //    {
    //     console.log("value",value)
    //    })
    // })


  useEffect(()=> {
    calcualteEquaction()
  },[])
   

  const calcualteEquaction = () => {
   let x = new BigNumber(2)
   let y = new BigNumber(3)
    y  = (y.plus(3)).times(2)
    console.log("result " , y)
  }


    useEffect(() => {
        if (localStorage.getItem("address")) {
          handleAccountChange(localStorage.getItem("address"));
          setWalletConnected(true);
        }
      }, [localStorage.getItem("address")]);


    const handleBalanceChange = async (_address) => {
        const _balance = await ethereum.request({
          method: "eth_getBalance",
          params: [String(_address), "latest"],
        });
        // let balance = new BigNumber()
        setBalance(Number(_balance)/Math.pow(10,18));
      };

    const handleAccountChange =  (address) => {
        console.log("address",address)
        if (address && address?.length > 0) {
            setUserAccount(address.toString());
            localStorage.setItem("address", address);
            handleBalanceChange(address.toString());
            setWalletConnected(true);
        }else{
          ethereum.request({method: "eth_accounts"}).then((data) => {
            if(data.length == 0 ) {
              console.log("DATA",data)
              setWalletConnected(false)
              setUserAccount("")
              setBalance("")
              localStorage.removeItem("address");
              // window.location.reload();
            }
          })
      
        }
    }

    const connectwallet = async () => {
        if(window.ethereum !== 'undefined'){
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
              });
            localStorage.setItem("address", accounts[0]);
            handleAccountChange(accounts[0]);
            if (ethereum?.chainId != "0x61") {
                try {
                  ethereum
                    .request({
                      method: "wallet_switchEthereumChain",
                      params: [{ chainId: "0x61" }],
                    })
                    .then((data) => {});
                } catch (switchError) {
                  if (switchError.code === 4902) {
                    try {
                      await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                          {
                            chainId: "0x61",
                            chainName: "Binance Testnet",
                            rpcUrls: [
                              "https://data-seed-prebsc-1-s1.binance.org:8545/",
                            ] /* ... */,
                          },
                        ],
                      });
                    } catch (addError) {
                      console.log(addError);
                    }
                  }
                }
              }

              await signMessage("hey there")
        }else if(!window.ethereum){
            alert("MetaMask Not Installed")
        }

    }

    const disconnect = () => {
        localStorage.removeItem("address");
        ethereum.on('disconnect',
        window.location.reload()
        );
        
    }

  

    ethereum && ethereum.on("accountsChanged", handleAccountChange);
    ethereum &&
      ethereum.on("chainChanged", (_chainId) => {
        console.log("chainId", _chainId);
        if (_chainId != "0x61") {
          try {
            ethereum
              .request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x61" }],
              })
              .then((data) => console.log(data));
          } catch (err) {
            console.log("err", err);
          }
        }
      });
 
  return (
    <Styled.Container>
       {!walletconnected ?  <Styled.Button onClick={connectwallet}>
            Connect Wallet
        </Styled.Button> 
        :
        <Styled.Data>
         address:
         <Styled.Span>{userAccount}</Styled.Span>
         <br/>
         balance:{Number(balance).toFixed(4)}
         <br/>
         <Styled.Button onClick={disconnect}>Disconnect</Styled.Button>
        </Styled.Data> 
        
        }
    </Styled.Container>
  )
}

export default WalletConnect