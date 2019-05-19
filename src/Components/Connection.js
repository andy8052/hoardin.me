import { Connectors } from "web3-react";  
import { useWeb3Context } from 'web3-react';
import FortmaticApi from "fortmatic";
const {
  InjectedConnector,
  FortmaticConnector
} = Connectors;

const MetaMask = new InjectedConnector({ supportedNetworks: [1, 4] })

const Fortmatic = new FortmaticConnector({
  api: FortmaticApi,
  apiKey: "pk_test_13A1FD4E48D9438E",
  logoutOnDeactivation: false,
  testNetwork: 'rinkeby'
});

export default {
  // MetaMask,
  Fortmatic
};