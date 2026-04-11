import os
from algosdk import account, mnemonic

def generate_algorand_account():
    # Generate a new Algorand account
    private_key, address = account.generate_account()
    
    # Get the mnemonic backup phrase
    passphrase = mnemonic.from_private_key(private_key)
    
    print("="*60)
    print("ALGORAND TESTNET ACCOUNT GENERATED!")
    print("="*60)
    print(f"Address: {address}")
    print(f"Mnemonic: {passphrase}")
    print("="*60)
    print("\n[ACTION REQUIRED]:")
    print("1. Go to the Algorand TestNet Dispenser (e.g., https://bank.testnet.algorand.network/ or https://dispenser.testnet.aws.algodev.network/)")
    print("   and fund the above Address with TestNet ALGO.")
    print("2. Copy the Mnemonic phrase and save it in your `backend/.env` file like so:\n")
    print(f"ALGORAND_MNEMONIC=\"{passphrase}\"")
    print("\nDone! Once funded, your application can deploy student data to the TestNet.")

if __name__ == "__main__":
    generate_algorand_account()
