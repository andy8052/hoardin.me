import React, {Component} from 'react';
import { render } from "react-dom";
import './App.css';
import Web3Provider, { useWeb3Context, Web3Consumer } from "web3-react";
import { ethers } from "ethers";
// import Web3Provider, { Connectors } from 'web3-react'
import Connectors from './Components/Connection.js'
import queryString from 'query-string'
let QRCode = require('qrcode.react');


function App() {
  const values = queryString.parse(window.location.search)
  let hasAddress = values.address == undefined ? false : true
  console.log(hasAddress)

  return (
    <Web3Provider connectors={Connectors} libraryName="ethers.js">
      <div className="App">
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
      <h1>Tipping Page</h1>

      <Web3ConsumerComponent />

      {context.error && (
        <p>An error occurred, check the console for details.</p>
      )}

      {(
        <QRCode value={queryString.parse(window.location.search).address} />
      )}
      <br />
      <br />

      {Object.keys(Connectors).map(connectorName => (
        <button
          key={connectorName}
          disabled={context.connectorName === connectorName}
          onClick={() => context.setConnector(connectorName)}
        >
          Activate {connectorName}
        </button>
      ))}

      <br />
      <br />
      

      {(context.active || (context.error && context.connectorName)) && (
        <button onClick={() => context.unsetConnector()}>
          {context.active ? "Logout" : "Reset"}
        </button>
      )}

      {(context.active || (context.error && context.connectorName)) && (
        <button onClick={() => window.location.href = window.location.href.split('?')[0]}>
          {context.active ? "Go To My Profile" : "Reset"}
        </button>
      )}

      {context.active && context.account && !transactionHash && (
        <button onClick={sendTransaction}>Tip 0.05 ETH</button>
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

  const wyreWidget = "https://verify.testwyre.com/widget/v1?env=test&operation=debitcard&accountId=AC_1234&authType=secretKey&destCurrency=ETH&sourceCurrency=USD&sourceAmount=0.01&dest=ethereum:" + context.account + "&redirectUrl=https://hoardin-me.netlify.com/"
  console.log(wyreWidget)
  return (
    <React.Fragment>
      <h1>🐲 Your account 🐲</h1>

      <Web3ConsumerComponent />

      {context.error && (
        <p>An error occurred, check the console for details.</p>
      )}

      {Object.keys(Connectors).map(connectorName => (
        <button
          key={connectorName}
          disabled={context.connectorName === connectorName}
          onClick={() => context.setConnector(connectorName)}
        >
          Login With {connectorName}
        </button>
      ))}

      <br />
      <br />

      {(context.active || (context.error && context.connectorName)) && (
        <>
        <button onClick={() => context.unsetConnector()}>
          {context.active ? "Logout" : "Reset"}
        </button>
        <button onClick={() => window.location.href = wyreWidget}>
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
              <p>Balnce: {balance || "None"} ETH</p>
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
