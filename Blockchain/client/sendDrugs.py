from Blockchain.Backend.util.util import decode_base58
from Blockchain.Backend.core.Script import Script
from Blockchain.Backend.core.Tx import  TxOut, Tx
from Blockchain.Backend.core.database.database import AccountDB
from Blockchain.Backend.core.EllepticCurve.EllepticCurve import PrivateKey
import time


class SendDrugs:
    def __init__(self, fromAccount, toAccount, transaction_id, batch_id, drug_id, status, location):
        self.FromPublicAddress = fromAccount
        self.toAccount = toAccount
        self.transaction_id = transaction_id
        self.drug_id = drug_id
        self.batch_id = batch_id
        self.status = status
        self.location = location
        self.timestamp = int(time.time())

    def scriptPubKey(self, PublicAddress):
        """
        Generate a scriptPubKey for the given public address.
        :param PublicAddress: Blockchain address.
        :return: Script for the address.
        """
        h160 = decode_base58(PublicAddress)
        script_pubkey = Script().p2pkh_script(h160)
        return script_pubkey

    def getPrivateKey(self):
        """
        Retrieve the sender's private key for signing the transaction.
        :return: Private key of the sender.
        """
        AllAccounts = AccountDB().read()
        for account in AllAccounts:
            if account["PublicAddress"] == self.FromPublicAddress:
                return account["privateKey"]

    def prepareTxOut(self):
        """
        Prepare transaction outputs for the receiver and the sender (remaining stock).
        :return: List of TxOut objects.
        """
        TxOuts = []
        to_scriptPubkey = self.scriptPubKey(self.toAccount)
        TxOuts.append(TxOut(self.quantity, to_scriptPubkey))

        # Remaining stock for the sender
        self.remainingStock = self.getAvailableStock() - self.quantity
        TxOuts.append(TxOut(self.remainingStock, self.scriptPubKey(self.FromPublicAddress)))

        return TxOuts

    def getAvailableStock(self):
        """
        Retrieve the total available stock of the drug for the sender.
        :return: Total quantity of available stock.
        """
        # This method would query the database or blockchain to get the sender's stock.
        # For demonstration, we return a placeholder value.
        return 100  # Assume the sender has 100 units of the drug available.

    def signTx(self):
        """
        Sign the transaction inputs with the sender's private key.
        """
        secret = self.getPrivateKey()
        priv = PrivateKey(secret=secret)

        for index, input in enumerate(self.TxIns):
            self.TxObj.sign_input(index, priv, self.scriptPubKey(self.FromPublicAddress))

    def prepareTransaction(self):
        """
        Prepare and return the transaction object for the drug transfer.
        :return: Signed Tx object if stock is sufficient; otherwise, False.
        """
        # Check stock availability
        if self.getAvailableStock() >= self.quantity:
            self.TxOuts = self.prepareTxOut()
            self.TxObj = Tx(1, [], self.TxOuts, 0)  
            self.TxObj.TxId = self.TxObj.id()
            self.signTx()
            return self.TxObj
        else:
            print("Insufficient stock to complete the transaction.")
            return False
