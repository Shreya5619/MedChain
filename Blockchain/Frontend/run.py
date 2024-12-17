from flask import Flask, render_template, request, jsonify
from Blockchain.Backend.core.Tx import Trans
from Blockchain.Backend.core.blockchain import Blockchain

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def wallet():
    if request.method == "POST":
        # Extract details from the request body
        data = request.get_json()

        drug_name = data.get("drug_name")
        batch = data.get("batch")
        manufacturer = data.get("manufacturer")
        distributor = data.get("distributor")
        status = data.get("status")
        location = data.get("location")

        # Validate required fields
        if not all([drug_name, batch, manufacturer, distributor, status, location]):
            return jsonify({"message": "All fields are required"}), 400

        # Create a new transaction object
        try:
            tx = Trans(
                tx_id=f"tx_{hash(drug_name + batch)}",
                drug_name=drug_name,
                batch=batch,
                manufacturer=manufacturer,
                distributor=distributor,
                status=status,
                location=location
            )

            # Simulate adding the transaction to the mempool
            if not hasattr(app, "MEMPOOL"):
                app.MEMPOOL = {}

            app.MEMPOOL[tx.tx_id] = tx.to_dict()
            return jsonify({"message": "Transaction added to memory pool", "transaction": tx.to_dict()}), 200
        except Exception as e:
            return jsonify({"message": f"Error creating transaction: {str(e)}"}), 500

    # For GET requests, return a message or a form if needed
    return render_template("wallet.html", message="Send a POST request with transaction details.")


def main(utxos=None, mempool=None):
    # Initialize the global UTXOS and MEMPOOL
    app.UTXOS = utxos if utxos else {}
    app.MEMPOOL = mempool if mempool else {}
    app.run(debug=True)


if __name__ == "__main__":
    main()
