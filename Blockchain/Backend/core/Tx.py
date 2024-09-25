import time
class Trans:
    def __init__(self, transaction_id, drug_id, batch_id, sender, receiver, status, location):
        self.transaction_id = transaction_id
        self.drug_id = drug_id
        self.batch_id = batch_id
        self.sender = sender
        self.receiver = receiver
        self.status = status
        self.location = location
        self.timestamp = int(time.time())

    def to_dict(self):
        return {
            "TransactionID": self.transaction_id,
            "DrugID": self.drug_id,
            "BatchID": self.batch_id,
            "Sender": self.sender,
            "Receiver": self.receiver,
            "Status": self.status,
            "Location": self.location,
            "Timestamp": self.timestamp
        }
