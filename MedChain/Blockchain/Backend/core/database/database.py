import os
import json


class BaseDB:
    def __init__(self):
        self.basepath = "data"
        # Ensure basepath directory exists
        if not os.path.exists(self.basepath):
            os.makedirs(self.basepath)
        self.filepath = os.path.join(self.basepath, self.filename)  # Use os.path.join for cross-platform paths

    def read(self):
        if not os.path.exists(self.filepath):
            return []

        with open(self.filepath, "r") as file:
            raw = file.read()  # Read the entire file

        if raw:
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                print(f"Error reading {self.filepath}, file may be corrupted.")
                return []
        else:
            data = []
        return data

    def write(self, item):
        # Ensure item is a list to handle appending correctly
        if not isinstance(item, list):
            item = [item]

        data = self.read()  # Read existing data

        # Append new item(s) to existing data
        data.extend(item)

        with open(self.filepath, "w") as file:
            file.write(json.dumps(data, indent=4))  # Write data as formatted JSON


class BlockchainDB(BaseDB):
    def __init__(self):
        self.filename = "blockchain.json"  # Define the filename before calling super
        super().__init__()

    def lastBlock(self):
        data = self.read()

        if data:
            return data[-1]  # Return the last block
        else:
            return None
class AccountDB(BaseDB):
    def __init__(self):
        self.filename = "account"
        super().__init__()