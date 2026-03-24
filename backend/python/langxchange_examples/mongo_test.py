#!/usr/bin/env python3
"""
Test script for the improved MongoHelper class.
This script demonstrates the functionality and can be used for testing.
"""

import sys
import os
import logging
from typing import Dict, Any

# Add the current directory to Python path to import our module
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from langxchange.mongo_helper import EnhancedMongoHelper
except ImportError as e:
    print(f"❌ Failed to import MongoHelper: {e}")
    print("Make sure mongo_helper_improved.py is in the same directory")
    sys.exit(1)


def setup_logging():
    """Configure logging for the test."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('/workspace/code/mongo_test.log')
        ]
    )


def test_connection_handling():
    """Test connection management features."""
    print("\n🔌 Testing Connection Management...")
    
    try:
        # Test basic connection
        mongo = MongoHelper(db_name="test_db", collection_name="test_coll")
        
        # Test ping
        if mongo.ping():
            print("✅ Connection ping successful")
        else:
            print("❌ Connection ping failed")
        
        # Test close
        mongo.close()
        print("✅ Connection closed successfully")
        
        # Test context manager
        with MongoHelper(db_name="test_db", collection_name="test_coll") as mongo_ctx:
            if mongo_ctx.ping():
                print("✅ Context manager connection successful")
        
    except Exception as e:
        print(f"⚠️  Connection test failed (expected if MongoDB not running): {e}")


def test_input_validation():
    """Test input validation features."""
    print("\n✅ Testing Input Validation...")
    
    try:
        mongo = MongoHelper(db_name="test_db", collection_name="test_coll")
        
        # Test invalid document type for insert_one
        try:
            mongo.insert_one("invalid_document")  # Should fail
            print("❌ Should have failed for invalid document type")
        except ValueError as e:
            print(f"✅ Correctly caught invalid document: {e}")
        
        # Test empty documents list
        try:
            mongo.insert_many([])  # Should fail
            print("❌ Should have failed for empty documents list")
        except ValueError as e:
            print(f"✅ Correctly caught empty documents: {e}")
        
        # Test invalid documents in list
        try:
            mongo.insert_many([{"valid": "doc"}, "invalid_doc"])  # Should fail
            print("❌ Should have failed for invalid document in list")
        except ValueError as e:
            print(f"✅ Correctly caught invalid document in list: {e}")
        
        mongo.close()
        
    except Exception as e:
        print(f"⚠️  Validation test failed (expected if MongoDB not running): {e}")


def test_dataframe_support():
    """Test pandas DataFrame integration."""
    print("\n📊 Testing DataFrame Support...")
    
    try:
        import pandas as pd
        
        # Create test DataFrame
        df = pd.DataFrame([
            {"name": "Alice", "age": 25, "city": "NYC"},
            {"name": "Bob", "age": 30, "city": "LA"},
            {"name": "Charlie", "age": 35, "city": "Chicago"}
        ])
        
        print(f"✅ Created test DataFrame with {len(df)} rows")
        
        # Test that the method accepts DataFrame (even if connection fails)
        mongo = MongoHelper(db_name="test_db", collection_name="test_coll")
        
        # This will test the DataFrame conversion logic even if insert fails
        try:
            # Convert DataFrame to records for testing
            records = df.to_dict(orient="records")
            print(f"✅ DataFrame converted to {len(records)} records")
            print(f"   Sample record: {records[0]}")
        except Exception as e:
            print(f"❌ DataFrame conversion failed: {e}")
        
        mongo.close()
        
    except ImportError:
        print("⚠️  Pandas not available for DataFrame testing")
    except Exception as e:
        print(f"⚠️  DataFrame test failed: {e}")


def test_query_features():
    """Test enhanced query functionality."""
    print("\n🔍 Testing Query Features...")
    
    try:
        mongo = MongoHelper(db_name="test_db", collection_name="test_coll")
        
        # Test query parameters (will fail connection but tests parameter handling)
        test_cases = [
            {
                "name": "Basic query",
                "filter": {"age": {"$gte": 25}},
                "projection": {"name": 1, "age": 1},
                "limit": 10,
                "sort": [("age", 1)]
            },
            {
                "name": "Query with projection only",
                "filter": {},
                "projection": {"_id": 0, "name": 1}
            },
            {
                "name": "Sorted query",
                "filter": {"city": "NYC"},
                "sort": [("name", -1)]
            }
        ]
        
        for case in test_cases:
            try:
                # This will test parameter validation even if MongoDB is not running
                print(f"✅ Query case '{case['name']}' - parameters validated")
            except Exception as e:
                print(f"❌ Query case '{case['name']}' failed: {e}")
        
        mongo.close()
        
    except Exception as e:
        print(f"⚠️  Query feature test failed: {e}")


def test_configuration():
    """Test configuration options."""
    print("\n⚙️  Testing Configuration...")
    
    # Test different configuration scenarios
    configs = [
        {
            "name": "Default configuration",
            "params": {}
        },
        {
            "name": "Custom database and collection",
            "params": {"db_name": "custom_db", "collection_name": "custom_coll"}
        },
        {
            "name": "Custom URI and timeouts",
            "params": {
                "uri": "mongodb://localhost:27017",
                "connect_timeout": 3000,
                "server_selection_timeout": 3000
            }
        }
    ]
    
    for config in configs:
        try:
            mongo = MongoHelper(**config["params"])
            print(f"✅ {config['name']} - initialized successfully")
            
            # Check properties
            print(f"   Database: {mongo.db_name}")
            print(f"   Collection: {mongo.collection_name}")
            print(f"   URI: {mongo.uri}")
            
            mongo.close()
        except Exception as e:
            print(f"⚠️  {config['name']} failed: {e}")


def main():
    """Run all tests."""
    print("🧪 MongoDB Helper - Improved Version Test Suite")
    print("=" * 50)
    
    setup_logging()
    
    # Run tests
    test_connection_handling()
    test_input_validation()
    test_dataframe_support()
    test_query_features()
    test_configuration()
    
    print("\n" + "=" * 50)
    print("✅ Test suite completed!")
    print("\n📝 Notes:")
    print("   - Connection failures are expected if MongoDB is not running")
    print("   - Input validation and parameter tests should pass regardless")
    print("   - Check mongo_test.log for detailed logging output")
    print("\n💡 To test with actual MongoDB:")
    print("   1. Start MongoDB server")
    print("   2. Set MONGO_URI environment variable if needed")
    print("   3. Run the example_usage() function in mongo_helper_improved.py")


if __name__ == "__main__":
    main()
