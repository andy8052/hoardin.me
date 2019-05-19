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
  apiKey: "pk_live_6B1D8DB636069522",
  logoutOnDeactivation: false,
});

export default {
  // MetaMask,
  Fortmatic
};
