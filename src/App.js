import React, {Component} from 'react';
import { render } from "react-dom";
import './App.css';
import Web3Provider, { useWeb3Context, Web3Consumer } from "web3-react";
import { ethers } from "ethers";
// import Web3Provider, { Connectors } from 'web3-react'
import Connectors from './Components/Connection.js'
import queryString from 'query-string'
let QRCode = require('qrcode.react');

const bStyle = {
   display: 'inline-block',
   padding:'0.35em 1.2em',
   border:'0.1em solid #000000',
   margin:'0 0.3em 0.3em 0',
   borderRadius:'0.12em',
   boxSizing: 'border-box',
   textDecoration:'none',
   fontWeight:'300',
   color:'#000000',
   textAlign:'center',
}

function App() {
  const values = queryString.parse(window.location.search)
  let hasAddress = values.address == undefined ? false : true
  console.log(hasAddress)

  return (
    <Web3Provider connectors={Connectors} libraryName="ethers.js">
      <div className="App" 
      style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        {hasAddress ?
        <TippingPage /> :
        <UserLogin />
        }
      </div>
    </Web3Provider>
  );
}

function TippingPage() {
  const context = useWeb3Context();

  console.log(context);

  if (context.error) {
    console.error("Error!");
  }

  const [transactionHash, setTransactionHash] = React.useState();

  function sendTransaction() {
    const signer = context.library.getSigner();

    signer
      .sendTransaction({
        to: queryString.parse(window.location.search).address,
        value: ethers.utils.bigNumberify("50000000000000000")
      })
      .then(({ hash }) => {
        setTransactionHash(hash);
      });
  }

  return (
    <React.Fragment>
      <h1>🐲 Share Some Loot 🐲</h1>

      {context.error && (
        <p>An error occurred, check the console for details.</p>
      )}

      {(
        <QRCode value={queryString.parse(window.location.search).address} />
      )}
      <br />
      <br />

      {(!context.active) && (Object.keys(Connectors).map(connectorName => (
        <button
          style={bStyle}
          key={connectorName}
          disabled={context.connectorName === connectorName}
          onClick={() => context.setConnector(connectorName)}
        >
          Enter The 🐲 Lair
        </button>
      )))}

      <br />
      <br />
      

      {(context.active || (context.error && context.connectorName)) && (
        <button style={bStyle} onClick={() => context.unsetConnector()}>
          {context.active ? "Logout" : "Reset"}
        </button>
      )}

      {(context.active || (context.error && context.connectorName)) && (
        <button style={bStyle} onClick={() => window.location.href = window.location.href.split('?')[0]}>
          {context.active ? "Go To My Profile" : "Reset"}
        </button>
      )}

      {context.active && context.account && !transactionHash && (
        <button style={bStyle} onClick={sendTransaction}>Tip 0.05 ETH</button>
      )}

      {transactionHash && <p>{transactionHash}</p>}
    </React.Fragment>
  );
}

function UserLogin() {
  const context = useWeb3Context();

  console.log(context);

  if (context.error) {
    console.error("Error!");
  }

  const wyreWidget = "https://verify.testwyre.com/widget/v1?env=test&operation=debitcard&accountId=AC_1234&authType=secretKey&destCurrency=ETH&sourceCurrency=USD&sourceAmount=0.01&dest=ethereum:" + context.account + "&redirectUrl=https://hoardin.me/"
  console.log(wyreWidget)
  return (
    <React.Fragment>
      <h1>🐲 Your Stash 🐲</h1>

      <Web3ConsumerComponent />

      {context.error && (
        <p>An error occurred, check the console for details.</p>
      )}

      {(!context.active) && (Object.keys(Connectors).map(connectorName => (
        <button
          style={bStyle}
          key={connectorName}
          disabled={context.connectorName === connectorName}
          onClick={() => context.setConnector(connectorName)}
        >
          Enter The 🐲 Lair
        </button>
      )))}

      <br />
      <br />

      {(context.active || (context.error && context.connectorName)) && (
        <>
        <button style={bStyle} onClick={() => context.unsetConnector()}>
          {context.active ? "Logout" : "Reset"}
        </button>
        <button style={bStyle} onClick={() => window.location.href = wyreWidget}>
          {context.active ? "Add Funds" : "Reset"}
        </button>
        </>
      )}

    </React.Fragment>
  );
}

function Web3ConsumerComponent() {
  const [balance, setBalance] = React.useState();

  const context = useWeb3Context();
  if (context.active) {
    context.library.getBalance(context.account).then((bal) => {
        // balance is a BigNumber (in wei); format is as a sting (in ether)
        let etherString = ethers.utils.formatEther(bal);
        setBalance(etherString);
    });
  }

  return (
    <Web3Consumer>
      {context => {
        const { active, connectorName, account, networkId, library } = context;

        return (
          active && (
            <React.Fragment>
              <p>Account: {account || "None"}</p>
              <p>Stash: {balance || "None"} ETH</p>
            </React.Fragment>
          )
        );
      }}
    </Web3Consumer>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);


export default App;
