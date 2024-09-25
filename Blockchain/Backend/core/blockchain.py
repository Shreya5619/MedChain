import sys

sys.path.append("C:\\Users\\Shreya Prasad\\Desktop\\MedChain")

from Blockchain.Backend.core.block import Block
from Blockchain.Backend.core.blockheader import BlockHeader
from Blockchain.Backend.core.Tx import Trans
from Blockchain.Backend.util.util import hash256
from Blockchain.Backend.core.database.database import BlockchainDB
import time
import json

ZERO_HASH = "0" * 64
VERSION = 1
INITIAL_TARGET = 0x0000FFFF00000000000000000000000000000000000000000000000000000000


class Blockchain:
    def __init__(self):
        self.chain=self.fetch_last_block()

    def write_on_disk(self, block):
        blockchainDB = BlockchainDB()
        blockchainDB.write(block)

    def fetch_last_block(self):
        blockchainDB = BlockchainDB()
        return blockchainDB.lastBlock()

    def GenesisBlock(self):
        BlockHeight = 0
        prevBlockHash = ZERO_HASH
        self.addBlock(BlockHeight, prevBlockHash,'Manufacturer')

    def addBlock(self, BlockHeight, prevBlockHash,role):
        timestamp=int(time.time())
        trans= Trans("tx1", "drugB", "batch001", "ManufacturerA", "DistributorB", "Shipped", "Mumbai")
        Transaction = json.dumps(trans.to_dict())
        merkleroot=hash256(Transaction.encode()).hex()
        bits='ffff001f'
        blockheader=BlockHeader(VERSION,prevBlockHash,merkleroot,timestamp,bits)
        blockheader.mine()
        self.write_on_disk([Block(BlockHeight,1,blockheader.__dict__,1,Transaction).__dict__])

 
    def search_drug(self, drug_id):
        db=BlockchainDB()
        blockchain_data = db.read()  # Read all blocks from the blockchain
        results = []

        if not blockchain_data:
            print("Blockchain data is empty")
            return []

        for block in blockchain_data:
            transaction_str = block.get("Txs", "")  # Get the transaction string
            try:
                transactions = json.loads(transaction_str)
            except json.JSONDecodeError:
                print(f"Error decoding transaction in block {block['Height']}")
                continue  # Skip to the next block if decoding fails
            
            # Now that transactions is a dict, check if the drug ID matches
            if transactions.get("DrugID") == drug_id:
                results.append({
                    "BlockHeight": block["Height"],
                    "BlockHash": block["BlockHeader"]["blockHash"],
                    "Timestamp": block["BlockHeader"]["timestamp"],
                    "TransactionDetails": transactions
                })

        if results:
            print(f"Found {len(results)} transactions for drug ID {drug_id}")
        else:
            print(f"No transactions found for drug ID {drug_id}")
        
        return results

    def create_unique_drug_id(drug_name, manufacturer,batch,expiry_date,manu_date):
        timestamp = int(time.time())
        unique_id = hash256((str(timestamp)+drug_name+manufacturer+batch+str(expiry_date)+str(manu_date)).encode()).hex()
        return unique_id

    def main(self):
        lastBlock = self.fetch_last_block()
        if lastBlock is None:
            self.GenesisBlock()
            print("Genesis Block Created")
        else:
            lastBlock = self.fetch_last_block()
            BlockHeight = lastBlock["Height"] + 1
            print(f"Current Block Height is is {BlockHeight}")
            prevBlockHash = lastBlock["BlockHeader"]["blockHash"]
            self.addBlock(BlockHeight, prevBlockHash,'Manufacturer')
            
if __name__ == "__main__":
    b = Blockchain()  # Create an instance of the Blockchain class
    results = b.search_drug('drugA') 
   

