import {SubstrateEvent} from "@subql/types";
import {StakingReward, SumReward} from "../types";
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

function createSumReward(accountId: string): SumReward {
    const entity = new SumReward(accountId);
    entity.totalReward = BigInt(0);
    return entity;
}

export async function handleSumRewarded(event: SubstrateEvent): Promise<void> {
    const {event: {data: [account, newReward]}} = event;
    
    let entity = await SumReward.get(account.toString());
    if (entity === undefined) {
        entity = createSumReward(account.toString());
    }

    entity.totalReward += (newReward as Balance).toBigInt();
    entity.blockheight = event.block.block.header.number.toNumber();
    await entity.save();
}
