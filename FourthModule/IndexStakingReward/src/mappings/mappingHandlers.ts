import {SubstrateEvent} from "@subql/types";
import {StakingReward} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleStakingRewarded(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;

    const reward = new StakingReward(`${event.block.block.header.number}-${event.idx}`);
    reward.account = account.toString();
    reward.balance = (newReward as Balance).toBigInt();
    reward.date = event.block.timestamp;
    reward.blockHeight = event.block.block.header.number.toNumber();
    
    await reward.save();
}
