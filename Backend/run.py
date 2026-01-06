from flask import Flask, request, jsonify
from web3 import Web3
import json
from eth_account import Account
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) 

infura_url = os.getenv("INFURA_URL_SEPOLIA")
w3 = Web3(Web3.HTTPProvider(infura_url))


contract_address = os.getenv("CONTRACT_ADDRESS_SEPOLIA")
with open('MedChainABI.json', 'r') as abi_file:
    contract_abi = json.load(abi_file)

medchain_contract = w3.eth.contract(address=contract_address, abi=contract_abi)
print("Functions:", medchain_contract.functions)



# from eth_account import Account

private_key = os.getenv("PRIVATE_KEY") # NEVER hardcode in production; use env vars
account = Account.from_key(private_key)
receiver_address = os.getenv("RECEIVER_ADDRESS")

print("Using account:", account.address)# nonce = w3.eth.get_transaction_count(account.address)

def send_add_transaction(drugId, batchId,senderPubKey, receiverPubKey, status):
    print("Preparing to send addTransaction with:", drugId, batchId, senderPubKey, receiverPubKey, status)
    
    receiver = receiver_address
    receiver = Web3.to_checksum_address(receiver)
    nonce = w3.eth.get_transaction_count(account.address)
    print("Current nonce:", nonce)
    gas_estimate = medchain_contract.functions.addTransaction(
    drugId,
    batchId,
    senderPubKey,
    receiverPubKey,
    status
).estimate_gas({'from': account.address})

    txn = medchain_contract.functions.addTransaction(
        drugId,
        batchId,
        senderPubKey,
        receiverPubKey,
        status
    ).build_transaction({
        'chainId': 11155111,
        'gas': gas_estimate + 10000,  # Add some padding
        'gasPrice': w3.to_wei('10', 'gwei'),
        'nonce': nonce,
    })

    print("Built transaction:", txn)
    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
    print("Signed transaction:", signed_txn)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print("Transaction sent with hash:", tx_hash.hex())
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print("Transaction receipt:", receipt)
    return receipt


@app.route('/add', methods=['POST'])
def add():
    print("Received /add request")
    data = request.get_json()
    print("Request data:", data)
    try:
        receipt = send_add_transaction(
            data['drugId'],
            data['batchId'],
            data['senderPubKey'],       # Make sure the frontend sends this field with a valid address
            data['receiverPubKey'],
            data['status']
        )
        return jsonify({"message": "Transaction successful", "tx_hash": receipt.transactionHash.hex()}), 200
    except Exception as e:
        print("Error adding transaction:", str(e))
        return jsonify({"error": str(e)}), 500



@app.route('/genId', methods=['POST'])
def generate_drug():
    data = request.get_json()
    drugId = data.get("drugId")
    manufacturer_pub_key = data.get("manufacturer_pub_key")
    batch = data.get("batch")
    manuDate = data.get("manuDate")
    expDate = data.get("expDate")
    if not all([drugId, manufacturer_pub_key, batch, manuDate, expDate]):
        return jsonify({"message": "Missing required fields"}), 400
    try:
        drug_id = ""
        drug_id = medchain_contract.functions.generateDrugId( drugId, batch, manuDate, expDate,manufacturer_pub_key ).call()
        print("Generated Drug ID (hex):", drug_id)
        return jsonify({"drug_id": drug_id}), 200

    except Exception as e:
        print("Error creating drug:", str(e))
        return jsonify({"message": f"Drug creation failed: {str(e)}"}), 500

@app.route('/searchDrug', methods=['POST'])
def search_drug():
    data = request.get_json()
    batchId = data.get('batchId')
    if not batchId:
        return jsonify({"message": "Missing 'batchId' field"}), 400
    try:
        # Call getDrugTransactions to fetch the full transaction history of the drug
        transactions = medchain_contract.functions.getDrugTransactions(batchId).call()
        
        # transactions is an array of tuples matching DrugTransaction struct
        # Each tuple: (drugId, batch, sender, receiver, status, location, timestamp)
        tx_list = []
        for tx in transactions:
            tx_dict = {
                "drugId": tx[0],
                "batch": tx[1],
                "senderPubKey": tx[2],
                "receiverPubKey": tx[3],
                "status": tx[4],
                "timestamp": tx[5]
            }
            tx_list.append(tx_dict)
        print("Drug transactions:", tx_list)
        return jsonify({"drug_transactions": tx_list}), 200
    except Exception as e:
        print("Error searching drug:", str(e))
        return jsonify({"message": f"Drug search failed: {str(e)}"}), 500


@app.route('/drugsByUser', methods=['GET'])
def drugs_by_user():
    user_pub_key = request.args.get('user')
    if not user_pub_key:
        return jsonify({"message": "Missing 'user' query parameter"}), 400
    try:
        # Call getTransactionsByPublicKey from the smart contract
        transactions = medchain_contract.functions.getTransactionsByPublicKey(user_pub_key).call()
        
        # transactions is an array of tuples matching DrugTransaction struct
        # Each tuple: (drugId, batch, senderPubKey, receiverPubKey, status, timestamp)
        tx_list = []
        for tx in transactions:
            tx_dict = {
                "drugId": tx[0],
                "batch": tx[1],
                "senderPubKey": tx[2],
                "receiverPubKey": tx[3],
                "status": tx[4],
                "timestamp": tx[5]
            }
            tx_list.append(tx_dict)
        
        return jsonify(tx_list), 200
    except Exception as e:
        print("Error fetching transactions by user:", str(e))
        return jsonify({"message": f"Failed to fetch transactions: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True)