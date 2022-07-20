import { networks } from './config'
import { Network } from './types'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { coins} from '@cosmjs/amino';
import { nebula, getSigningNebulaClient } from "@nghuyenthevinh2000/nebulajs"
import { SigningStargateClient } from "@nghuyenthevinh2000/nebulajs/node_modules/@cosmjs/stargate"
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Long } from "@osmonauts/helpers";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

const {
    createProject,
    deleteProject,
    withdrawAllTokens
} = nebula.launchpad.MessageComposer.withTypeUrl

const {
    enableIDO,
    commitParticipation
} = nebula.ido.MessageComposer.withTypeUrl

const rpcEndpoint = "http://localhost:26657/"

const getNetwork = (network_name: string) => networks[network_name] as Network;

const signAndBroadcast = async ({
    client,
    chainId,
    address,
    msgs,
    fee,
    memo = ''
}: {
    client: SigningStargateClient,
    chainId: string,
    address: string,
    msgs: any[],
    fee: any,
    memo: string
}) => {
    const { accountNumber, sequence } = await client.getSequence(address);
    const txRaw = await client.sign(address, msgs, fee, memo, {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId
    });
    const txBytes = TxRaw.encode(txRaw).finish();
    return await client.broadcastTx(txBytes);
};

async function sendCreateProject({project_title, project_information, mnemonic} : 
    {   
        project_title: string,
        project_information: string,
        mnemonic: string
    }) {

    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {prefix: getNetwork("nebula").bech32Prefix})

    const accs = await signer.getAccounts()

    const msg = createProject({
        owner: accs[0].address,
        projectTitle: project_title,
        projectInformation: project_information
    })

    const fee = {
        amount: coins(100, 'unebula'),
        gas: "100000"
    };

    const client = await getSigningNebulaClient({
        rpcEndpoint,
        signer // OfflineSigner
    });

    const res = signAndBroadcast({
        client,
        chainId: 'nebula-1',
        address: accs[0].address,
        msgs: [msg],
        fee,
        memo: ''
    })

    return res
}

(async () => {
    try {
        const res = await sendCreateProject({
            project_title: "title",
            project_information: "description",
            mnemonic: "wonder repeat occur couch purity bomb million slight common myself coin thunder nominee despair impulse jewel butter girl spray profit holiday punch found volume"
        });

        console.log(res)

        const msg = createProject({
            owner: "",
            projectTitle: "",
            projectInformation: ""
        })

        console.log(msg)

        const msg1 = deleteProject({
            owner: "",
            projectId: Long.fromString("1"),
        })

        console.log(msg1)

        const msg2 = withdrawAllTokens({
            owner: "",
            projectId: Long.fromString("1"),
        })

        console.log(msg2)

        const msg3 = enableIDO({
            owner: "",
            projectId: Long.fromString("1"),
            tokenForDistribution: coins(1000000000, 'unebula'),
            tokenListingPrice: coins("1000000", "uusdt"),
            allocationLimit: [],
            startTime: new Date(),
        })

        console.log(msg3)

        const ms4 = commitParticipation({
            participant: "",
            tokenCommit: coins("1000000", "uusdt"),
            projectId: Long.fromString("1")
        })

        console.log(ms4)
    } catch (e) {
        console.log(e)
    }
})();