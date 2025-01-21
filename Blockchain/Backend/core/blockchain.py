import sys
sys.path.append('C:\\Users\\Shreya Prasad\\Desktop\\MedChain')
import time
import json
from Blockchain.Backend.core.block import Block
from Blockchain.Backend.core.blockheader import BlockHeader
from Blockchain.Backend.core.Tx import Trans
from Blockchain.Backend.util.util import hash256
from Blockchain.Backend.core.database.database import BlockchainDB

ZERO_HASH = "0" * 64
VERSION = 1
INITIAL_TARGET = 0x0000FFFF00000000000000000000000000000000000000000000000000000000

class Blockchain:
    def __init__(self):
        self.chain = self.fetch_last_block()

    def write_on_disk(self, block_data):
        """Write block data to the blockchain database."""
        blockchainDB = BlockchainDB()
        blockchainDB.write(block_data)

    def fetch_last_block(self):
        blockchainDB = BlockchainDB()
        last_block = blockchainDB.lastBlock()
        if not last_block:
            print("No blocks found in the blockchain.")
        return last_block

    def GenesisBlock(self):
        BlockHeight = 0
        prevBlockHash = ZERO_HASH
        self.addBlock(BlockHeight, prevBlockHash, 'Manufacturer', None, None, None, None, None, None)

    def addBlock(self, BlockHeight, prevBlockHash, manufacturer, trans_id=None, drug_id=None, batch_id=None, dist=None, status=None, location=None):
        timestamp = int(time.time())
        # If no transaction data is provided, create a default empty transaction.
        if trans_id and drug_id and batch_id and dist and status and location:
            trans = Trans(trans_id, drug_id, batch_id, manufacturer, dist, status, location)
            transaction_data = json.dumps(trans.to_dict())
        else:
            transaction_data = json.dumps({})  # Empty transaction data for genesis or default block
        
        merkleroot = hash256(transaction_data.encode()).hex()  # Generate Merkle root for the block.
        bits = 'ffff001f'  # Set the mining difficulty target (this can be dynamic).
        
        # Create block header and mine it.
        blockheader = BlockHeader(VERSION, prevBlockHash, merkleroot, timestamp, bits)
        blockheader.mine()  # Mining the block (will need implementation based on difficulty)
        
        # Write block data to disk.
        
        block_data = Block(BlockHeight, 1, blockheader.__dict__, 1, transaction_data).__dict__
        self.write_on_disk([block_data])

    def search_drug(self, drug_id):
        """Search for a drug's transaction history in the blockchain."""
        db = BlockchainDB()
        blockchain_data = db.read()  # Fetch all blockchain data.
        results = []
        if not blockchain_data:
            print("Blockchain data is empty.")
            return results
        for block in blockchain_data:
            transaction_str = block.get("Txs", "")
            try:
                transactions = json.loads(transaction_str)
            except json.JSONDecodeError:
                print(f"Error decoding transaction in block {block['Height']}. Skipping this block.")
                continue
            if transactions.get("DrugID") == drug_id:
                print(1)
                results.append({
                    "BlockHeight": block["Height"],
                    "BlockHash": block["BlockHeader"]["blockHash"],
                    "Timestamp": block["BlockHeader"]["timestamp"],
                    "TransactionDetails": transactions
                })

        if results:
            print(f"Found {len(results)} transactions for drug ID {drug_id}.")
        else:
            print(f"No transactions found for drug ID {drug_id}.")
        
        return results

    def create_unique_drug_id(self, drug_name, manufacturer, batch, expiry_date, manu_date):
        unique_data = f"{drug_name}{manufacturer}{batch}{expiry_date}{manu_date}"
        unique_id = hash256(unique_data.encode()).hex()
        return unique_id

    def main(self,person_from,drug_id,batch_id,person_to,status,loc):
        last_block = self.fetch_last_block()
        timestamp = int(time.time())
        unique_data = f"{timestamp}{person_from}{drug_id}{batch_id}{person_to}{status}{loc}"
        trans_id = hash256(unique_data.encode()).hex()
        if last_block is None:
            self.GenesisBlock()
            print("Genesis Block Created.")
        else:
            block_height = last_block["Height"] + 1
            print(f"Current Block Height is {block_height}.")
            prev_block_hash = last_block["BlockHeader"]["blockHash"]
            
            # Example of creating a new block (can be customized further based on your use case)
            self.addBlock(block_height, prev_block_hash, person_from,trans_id,drug_id,batch_id,person_to,status,loc)

if __name__ == "__main__":
    blockchain = Blockchain()
