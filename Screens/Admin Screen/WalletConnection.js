import React, { useEffect, useState } from 'react'
import { useAccount, useSignMessage, useContractRead, useContractWrite } from 'wagmi'
import { W3mButton } from '@web3modal/wagmi-react-native';
import {Text, View, TouchableOpacity} from "react-native";
import { ContractABI, ContractAddress } from '../../Constants/Constants';

function IsWalletConnected({conected}){
    const {address, isConnected, isDisconnected} = useAccount();
  
    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message: 'gm wagmi frens'
      })
      const [connectedStateNotified, setConnectedStateNotified] = useState(false);



    useEffect(() => {
        if (!connectedStateNotified && isConnected) {
          conected = isConnected;
          setConnectedStateNotified(true);
        }
      }, [isConnected, conected, connectedStateNotified]);

    return (
        <>
        <View>
        
        <W3mButton />
        </View>
        </>
    )
}


function StartElecctionContract({voter, candid}){
    const {data, isError, isLoading, isSuccess} = useContractRead({
        address: ContractAddress,
        abi: ContractABI,
        functionName:"vote",
        args:[voter, candid]

    });

    console.log(JSON.stringify(data))

    return (
        <View>
        {isLoading && <Text>Loading</Text>}
        {isSuccess && <Text>Response: {data?.toString()}</Text>}
        {isError && <Text>Error reading contract</Text>}
      </View>
    )
}

function GetResultContract(){
    const {data, isError, isLoading, isSuccess} = useContractRead({
        address: ContractAddress,
        abi: ContractABI,
        functionName: "getResult"
    })

    console.log(data);

    return (
        <View>
        {isLoading && <Text>Loading</Text>}
        {isSuccess && <Text>Response: {data?.toString()}</Text>}
        {isError && <Text>Error reading contract</Text>}
      </View>
    )
}

export {IsWalletConnected, StartElecctionContract, GetResultContract};
