import sys
sys.path.append("C:\\Users\\Shreya Prasad\\Desktop\\MedChain")
from Blockchain.Backend.core.EllepticCurve.EllepticCurve import Sha256Point
from Blockchain.Backend.util.util import hash256, hash160
from Blockchain.Backend.core.database.database import AccountDB
import secrets
import time

class DrugAccount:
    def __init__(self):
        self.privateKey = None
        self.publicAddress = None
        self.transactionHistory = []  # Stores transaction records

    def createKeys(self):
        Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798
        Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8

        G = Sha256Point(Gx, Gy)

        # Generate a random private key
        self.privateKey = secrets.randbits(256)

        # Generate the corresponding public key
        unCompressedPublicKey = self.privateKey * G
        xpoint = unCompressedPublicKey.x
        ypoint = unCompressedPublicKey.y

        # Determine the compressed public key format
        if ypoint.num % 2 == 0:
            compressedKey = b"\x02" + xpoint.num.to_bytes(32, "big")
        else:
            compressedKey = b"\x03" + xpoint.num.to_bytes(32, "big")

        # Generate the public address (hash160 of compressed public key)
        hsh160 = hash160(compressedKey)

        main_prefix = b"\x00"
        newAddr = main_prefix + hsh160
        checksum = hash256(newAddr)[:4]
        newAddr = newAddr + checksum

        # Base58 encoding
        BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
        count = 0
        for c in newAddr:
            if c == 0:
                count += 1
            else:
                break

        num = int.from_bytes(newAddr, "big")
        prefix = "1" * count
        result = ""

        while num > 0:
            num, mod = divmod(num, 58)
            result = BASE58_ALPHABET[mod] + result

        # Set the public address
        self.publicAddress = prefix + result

        print(f"Private Key: {self.privateKey}")
        print(f"Public Address: {self.publicAddress}")
        print(f"Xpoint: {xpoint}")
        print(f"Ypoint: {ypoint}")

    def recordTransaction(self, transaction_id, drug_id, batch_id, status, location):
        """
        Records a transaction for drug transfer
        """
        timestamp = int(time.time())
        transaction = {
            "transaction_id": transaction_id,
            "drug_id": drug_id,
            "batch_id": batch_id,
            "status": status,
            "location": location,
            "timestamp": timestamp
        }
        self.transactionHistory.append(transaction)

    def getTransactionHistory(self):
        """
        Returns the transaction history of this account.
        """
        return self.transactionHistory

    def saveAccount(self):
        """
        Save account details (private key, public address, transaction history) to a database.
        """
        account_data = {
            "privateKey": self.privateKey,
            "publicAddress": self.publicAddress,
            "transactionHistory": self.transactionHistory
        }
        AccountDB().write([account_data])
        print("Account details saved to database.")

# Example usage
if __name__ == "__main__":
    # Create a new drug account
    drug_account = DrugAccount()
    drug_account.createKeys()

