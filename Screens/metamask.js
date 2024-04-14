import '@walletconnect/react-native-compat'
import { WagmiConfig, useAccount } from 'wagmi'
import { goerli } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal,W3mButton  } from '@web3modal/wagmi-react-native'
import {Text} from 'react-native';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'f286bd4ac2b98a856be257bf5d1f69ba'

// 2. Create config
const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}

const chains = [goerli]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  chainImages: {
    1: 'https://my.images.com/eth.png'
  }
})

export default function Metamask() {


  return (
    <WagmiConfig config={wagmiConfig}>
      <W3mButton />
      <Web3Modal />
    </WagmiConfig>
  )
}