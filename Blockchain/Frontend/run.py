import sys
sys.path.append('C:\\Users\\Shreya Prasad\\Desktop\\MedChain')
from flask_cors import CORS
from flask import Flask, request, jsonify
from Blockchain.Backend.core.Tx import Trans
from Blockchain.Backend.core.blockchain import Blockchain  # Import the Blockchain class

app = Flask(__name__)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Initialize blockchain instance
blockchain = Blockchain()

@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "POST":
        # Extract details from the request body
        data = request.get_json()
        # Required fields to simulate a blockchain transaction
        drug_name = data.get("drug_name")
        batch = data.get("batch")
        sender = data.get("sender")
        receiver = data.get("receiver")
        status = data.get("status")
        location = data.get("location")
        print(drug_name, batch, sender, receiver, status, location)

        # Validate that all fields are provided
        if not all([drug_name, batch, sender, receiver, status, location]):
            return jsonify({"message": "All fields are required"}), 400
        

        # Try creating a new transaction object
        try:
            # Create the transaction object
            tx = Trans(
                transaction_id=f"tx_{hash(drug_name + batch)}",  # Unique tx_id generation
                drug_id=drug_name,
                batch_id=batch,
                sender=sender,
                receiver=receiver,
                status=status,
                location=location,
            )

            # Add the transaction to the blockchain on successful creation
            blockchain.main(sender,tx.transaction_id,drug_name,batch,receiver,status,location)
            print("Transaction added to the blockchain")

            # Return a successful response with transaction details
            return jsonify({"message": "Transaction successfully created and added to blockchain", "transaction": tx.to_dict()}), 200

        except Exception as e:
            # Handle error if transaction creation fails
            return jsonify({"message": f"Transaction creation failed: {str(e)}"}), 500

@app.route("/genId", methods=["GET", "POST"])
def genId():
    if request.method == "POST":
        # Extract details from the request body
        data = request.get_json()
        # Required fields to simulate a blockchain transaction
        drug_name = data.get("drug_name")
        batch = data.get("batch")
        manDate = data.get("manu_date")
        expDate = data.get("exp_date")

        # Validate that all fields are provided
        if not all([drug_name, batch,manDate,expDate]):
            return jsonify({"message": "All fields are required"}), 400
        
        try:
            # Create the transaction object
            tx = Trans(
                transaction_id=f"{abs(hash(drug_name + batch + manDate + expDate))}",  # Unique tx_id generation
                drug_id=drug_name,
                batch_id=batch,
                sender="Manufactured",
                receiver="Manufactured",
                status="Manufactured",
                location="",
            )
            print(tx)
            # Add the transaction to the blockchain on successful creation
            blockchain.main(tx.sender,tx.transaction_id,drug_name,batch,tx.receiver,tx.status,tx.location)
            print("Drug created and added to blockchain successfully!")

            # Return a successful response with transaction details
            return jsonify({"message": "Drug successfully created and added to blockchain", "drug_id": tx.transaction_id}), 200

        except Exception as e:
            # Handle error if transaction creation fails
            return jsonify({"message": f"Drug creation failed: {str(e)}"}), 500

def main():
    # Start the Flask application
    app.run(debug=True)


if __name__ == "__main__":
    main()