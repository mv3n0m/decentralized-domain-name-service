import { ethers } from 'ethers';
import logo from '../assets/logo.svg';

const Navigation = ({ account, setAccount }) => {

  const connectAccount = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }

  return (
    <nav>
      <div className='nav__brand'>
        <img src={ logo } alt="logo" />
        <h2>ETH Daddy</h2> 
        <ul className='nav__links'>
          <li><a href="/">Domains names</a></li>
          <li><a href="/">Websites & Hosting</a></li>
          <li><a href="/">Commerce</a></li>
          <li><a href="/">Email & Marketing</a></li>
        </ul>
      </div>
      <button className='nav__connect' onClick={() => account || connectAccount()}>
        { account ? account.slice(0, 6) + "....." + account.slice(-4) : "Connect" }
      </button>
    </nav>
  );
}

export default Navigation;