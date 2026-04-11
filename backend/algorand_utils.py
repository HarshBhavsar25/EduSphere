import os
import json
from algosdk.v2client import algod
from algosdk import transaction, mnemonic
from algosdk.error import AlgodHTTPError

ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

def get_algod_client():
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

def save_student_to_blockchain(student_dict):
    """
    Saves a student profile to the Algorand TestNet by making a 0-ALGO transaction
    to oneself, appending the student data into the transaction 'note' field.
    Returns the Transaction ID string.
    """
    passphrase = os.environ.get('ALGORAND_MNEMONIC')
    if not passphrase:
        print("WARNING: ALGORAND_MNEMONIC not set in environment. Skipping blockchain upload.")
        return None

    try:
        private_key = mnemonic.to_private_key(passphrase)
        sender_address = mnemonic.to_public_key(passphrase)
    except Exception as e:
        print(f"ERROR: Invalid ALGORAND_MNEMONIC: {e}")
        return None

    client = get_algod_client()
    
    # Pre-process the student dict for blockchain storage (convert ObjectId to str)
    def serialize_values(obj):
        if not isinstance(obj, dict):
            return obj
        res = {}
        for k, v in obj.items():
            if k == '_id':
                res['id'] = str(v)
            else:
                res[k] = str(v) if not isinstance(v, (int, float, bool, list, dict, type(None))) else v
        return res
    
    student_data_clean = serialize_values(student_dict)

    note_text = json.dumps({"type": "student_record", "data": student_data_clean})
    note_bytes = note_text.encode()

    # Get network parameters for transactions
    try:
        params = client.suggested_params()
    except Exception as e:
        print(f"ERROR: Could not get Algorand network params: {e}")
        return None

    # Construct the transaction (0 ALGO to self)
    txn = transaction.PaymentTxn(
        sender=sender_address,
        sp=params,
        receiver=sender_address,
        amt=0,
        note=note_bytes
    )

    # Sign the transaction
    signed_txn = txn.sign(private_key)

    # Submit the transaction
    try:
        tx_id = client.send_transaction(signed_txn)
        print(f"Algorand Transaction successfully signed and sent! TX ID: {tx_id}")
        
        # We can wait for confirmation (this adds ~3 seconds to API response but guarantees the data is stored)
        transaction.wait_for_confirmation(client, tx_id, 4)
        print(f"Algorand Transaction {tx_id} confirmed in block.")
        
        return tx_id
    except AlgodHTTPError as e:
        print(f"ERROR submitting transaction to Algorand TestNet: {e}")
        return None
    except Exception as e:
        print(f"ERROR: Algorand transaction failed: {e}")
        return None
