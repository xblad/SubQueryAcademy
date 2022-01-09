import {SubstrateEvent} from "@subql/types";
import {Account, Transfer} from "../types";
import {Balance} from "@polkadot/types/interfaces";

export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [fromAddress, toAddress, amount]}} = event;
    
    logger.info(`fromAddress: ${fromAddress}, toAddress: ${toAddress}, amount: ${amount}`);

    const toAccount = await Account.get(toAddress.toString());
    if (!toAccount) {
        await new Account(toAddress.toString()).save();
    }

    const transfer = new Transfer(`${event.block.block.header.number.toBigInt()}-${event.idx}`);
    transfer.toId = toAddress.toString();
    transfer.blockNumber = event.block.block.header.number.toBigInt();
    transfer.amount = (amount as Balance).toBigInt();
    
    await transfer.save();
}
