import os
from langxchange.google_cs_helper import GoogleCloudStorageHelper

# --- Required environment variables ---
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "creds/crypto-lexicon-212720-a0f6d3407cb2.json"
os.environ["GCP_PROJECT_ID"] = "crypto-lexicon-212720"

# --- Initialize the helper ---
gcs = GoogleCloudStorageHelper()

# --- Define your test bucket and file ---
bucket_name = "ikolilu_main_storage"
file_to_upload = "./examples/example.txt"
blob_name = "uploaded_sample.txt"
file_to_download = "uploaded_sample.txt"

# --- Upload a file ---
# success = gcs.upload_file(bucket_name, file_to_upload, blob_name)
# print("📤 Upload successful:", success)

# --- List blobs ---
blobs = gcs.list_blobs(bucket_name)
print("📦 Files in bucket:", blobs)

# # --- Download the file back ---
# success = gcs.download_file(bucket_name, blob_name, file_to_download)
# print("📥 Download successful:", success)

# --- Optionally delete it ---
# gcs.delete_blob(bucket_name, blob_name)
# print("🗑️ Deleted:", blob_name)
