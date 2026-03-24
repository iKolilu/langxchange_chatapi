"""
Example usage of the Enhanced Google Drive Helper Class

This script demonstrates various features and capabilities of the enhanced
Google Drive helper class.

Author: Langxchange
Date: 2025-07-11
"""

import os
import json
from pathlib import Path
from langxchange.google_drive_helper import EnhancedGoogleDriveHelper, GoogleDriveError, create_example_config


def progress_callback(current: int, total: int) -> None:
    """Custom progress callback function."""
    percentage = (current / total) * 100 if total > 0 else 0
    print(f"Progress: {percentage:.1f}% ({current:,}/{total:,} bytes)")


def main():
    """Main demonstration function."""
    try:
        # Initialize with custom configuration
        config = create_example_config()
        
        # Initialize Google Drive Helper
        drive = EnhancedGoogleDriveHelper(
            credentials_path="creds/client_secret_871795364254-6s2e4dhn7gij71fvqlp3a7b5mmmb4m00.apps.googleusercontent.com.json",
            token_path="creds/token.pickle",
            config=config
        )
        
        print("✅ Google Drive Helper initialized successfully!")
        
        # Example 1: Get storage quota
        print("\n📊 Storage Quota Information:")
        try:
            quota = drive.get_storage_quota()
            print(f"Total: {quota['limit']:,} bytes")
            print(f"Used: {quota['usage']:,} bytes")
            print(f"Available: {quota['limit'] - quota['usage']:,} bytes")
        except GoogleDriveError as e:
            print(f"❌ Error getting quota: {e}")
        
        # Example 2: Create a test folder
        print("\n📁 Creating test folder...")
        try:
            folder_id = drive.create_folder(
                name="Test Folder - Enhanced Drive Helper",
                description="Created by Enhanced Google Drive Helper"
            )
            print(f"✅ Created folder with ID: {folder_id}")
        except GoogleDriveError as e:
            print(f"❌ Error creating folder: {e}")
            return
        
        # Example 3: Search for files
        print("\n🔍 Searching for PDF files...")
        try:
            pdf_files = drive.search_files(
                query="mimeType='application/pdf'",
                max_results=10
            )
            print(f"Found {len(pdf_files)} PDF files:")
            for file in pdf_files[:3]:  # Show first 3
                print(f"  - {file['name']} (ID: {file['id']})")
        except GoogleDriveError as e:
            print(f"❌ Error searching files: {e}")
        
        # Example 4: Create test files for upload
        test_files = []
        for i in range(3):
            file_path = f"/tmp/test_file_{i}.txt"
            with open(file_path, 'w') as f:
                f.write(f"This is test file {i}\nCreated for Google Drive upload test\n")
            test_files.append(file_path)
        
        # Example 5: Single file upload with progress
        print(f"\n📤 Uploading single file: {test_files[0]}")
        try:
            file_id = drive.upload_file(
                file_path=test_files[0],
                parent_id=folder_id,
                description="Test file uploaded with progress tracking",
                progress_callback=progress_callback
            )
            print(f"✅ Uploaded file with ID: {file_id}")
            
            # Get file metadata
            metadata = drive.get_file_metadata(file_id)
            print(f"File name: {metadata['name']}")
            print(f"File size: {metadata.get('size', 'Unknown')} bytes")
            
        except GoogleDriveError as e:
            print(f"❌ Error uploading file: {e}")
        
        # Example 6: Batch upload files
        print(f"\n📤 Batch uploading {len(test_files)} files...")
        try:
            results = drive.batch_upload_files(
                file_paths=test_files,
                parent_id=folder_id,
                progress_callback=progress_callback
            )
            
            successful = [r for r in results if r['status'] == 'success']
            failed = [r for r in results if r['status'] == 'failed']
            
            print(f"✅ Successfully uploaded: {len(successful)} files")
            print(f"❌ Failed uploads: {len(failed)} files")
            
            if failed:
                for result in failed:
                    print(f"  Failed: {result['file_path']} - {result['error']}")
            
        except GoogleDriveError as e:
            print(f"❌ Error in batch upload: {e}")
        
        # Example 7: List files in folder
        print(f"\n📋 Files in test folder:")
        try:
            files_in_folder = drive.list_files_in_folder(folder_id)
            print(f"Found {len(files_in_folder)} files:")
            for file in files_in_folder:
                print(f"  - {file['name']} ({file['mimeType']})")
        except GoogleDriveError as e:
            print(f"❌ Error listing files: {e}")
        
        # Example 8: Download a file
        if files_in_folder:
            print(f"\n📥 Downloading file...")
            try:
                first_file = files_in_folder[0]
                download_path = f"/tmp/downloaded_{first_file['name']}"
                
                drive.download_file(
                    file_id=first_file['id'],
                    output_path=download_path,
                    progress_callback=progress_callback
                )
                print(f"✅ Downloaded to: {download_path}")
                
            except GoogleDriveError as e:
                print(f"❌ Error downloading file: {e}")
        
        # Example 9: Copy a file
        if files_in_folder:
            print(f"\n📄 Copying file...")
            try:
                original_file = files_in_folder[0]
                copy_id = drive.copy_file(
                    file_id=original_file['id'],
                    new_name=f"Copy of {original_file['name']}"
                )
                print(f"✅ Created copy with ID: {copy_id}")
                
            except GoogleDriveError as e:
                print(f"❌ Error copying file: {e}")
        
        # Example 10: Share a file (commented out to avoid unwanted sharing)
        """
        if files_in_folder:
            print(f"\n🔗 Sharing file...")
            try:
                file_to_share = files_in_folder[0]
                permission_id = drive.share_file(
                    file_id=file_to_share['id'],
                    type_='anyone',
                    role='reader'
                )
                print(f"✅ Shared file with permission ID: {permission_id}")
                
            except GoogleDriveError as e:
                print(f"❌ Error sharing file: {e}")
        """
        
        # Example 11: Advanced search with filters
        print(f"\n🔍 Advanced search - Recent files...")
        try:
            recent_files = drive.search_files(
                query="modifiedTime > '2025-01-01T00:00:00'",
                max_results=5
            )
            print(f"Found {len(recent_files)} recent files:")
            for file in recent_files:
                print(f"  - {file['name']} (Modified: {file.get('modifiedTime', 'Unknown')})")
        except GoogleDriveError as e:
            print(f"❌ Error in advanced search: {e}")
        
        # Cleanup test files
        print(f"\n🧹 Cleaning up test files...")
        for file_path in test_files:
            if os.path.exists(file_path):
                os.remove(file_path)
        
        print(f"\n✅ Demo completed successfully!")
        
        # Close the drive helper
        drive.close()
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


def demo_error_handling():
    """Demonstrate error handling capabilities."""
    print("\n🛡️ Error Handling Demo:")
    
    try:
        # Try to initialize with invalid credentials
        drive = EnhancedGoogleDriveHelper(credentials_path="nonexistent.json")
    except GoogleDriveError as e:
        print(f"✅ Caught expected error: {e}")
    
    # More error handling examples would go here...


def demo_export_functionality():
    """Demonstrate Google Docs export functionality."""
    print("\n📄 Export Functionality Demo:")
    
    # This would require actual Google Docs files to export
    # Commented out for safety
    """
    try:
        drive = EnhancedGoogleDriveHelper()
        
        # Search for Google Docs
        docs = drive.search_files("mimeType='application/vnd.google-apps.document'", max_results=1)
        
        if docs:
            doc = docs[0]
            print(f"Exporting document: {doc['name']}")
            
            # Export as PDF
            drive.export_google_doc(
                file_id=doc['id'],
                export_format='application/pdf',
                output_path=f"/tmp/{doc['name']}.pdf"
            )
            print(f"✅ Exported as PDF")
            
    except GoogleDriveError as e:
        print(f"❌ Export error: {e}")
    """


if __name__ == "__main__":
    print("🚀 Enhanced Google Drive Helper - Demo Script")
    print("=" * 50)
    
    # Check if credentials file exists
    if not os.path.exists("creds/client_secret_871fvqlp3a7b5mmmb4m00.apps.googleusercontent.com.json"):
        print("❌ credentials.json not found!")
        print("Please download your OAuth2 credentials from Google Cloud Console")
        print("and save them as 'credentials.json' in the current directory.")
        exit(1)
    
    main()
    # demo_error_handling()
    # demo_export_functionality()
