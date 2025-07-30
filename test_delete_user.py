#!/usr/bin/env python3
"""
Test script for delete user functionality
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_delete_user():
    """Test the delete user functionality"""
    
    # First, let's see what users exist
    print("1. Getting all users...")
    response = requests.get(f"{BASE_URL}/users")
    if response.status_code == 200:
        users = response.json()["users"]
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"  - {user['username']}")
    else:
        print(f"Failed to get users: {response.status_code}")
        return
    
    if not users:
        print("No users to test with. Please create some users first.")
        return
    
    # Test deleting a user (use the first user that's not the last one)
    test_user = users[0]["username"] if len(users) > 1 else None
    
    if not test_user:
        print("Cannot test deletion - only one user exists and we need at least 2 users.")
        return
    
    print(f"\n2. Testing deletion of user: {test_user}")
    
    # Delete the user
    response = requests.delete(f"{BASE_URL}/admin/delete-user/{test_user}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Successfully deleted user: {result['deleted_user']}")
        print(f"Message: {result['message']}")
    else:
        print(f"❌ Failed to delete user: {response.status_code}")
        print(f"Error: {response.text}")
    
    # Verify the user was deleted
    print("\n3. Verifying user was deleted...")
    response = requests.get(f"{BASE_URL}/users")
    if response.status_code == 200:
        remaining_users = response.json()["users"]
        print(f"Remaining users: {len(remaining_users)}")
        for user in remaining_users:
            print(f"  - {user['username']}")
        
        if test_user not in [u["username"] for u in remaining_users]:
            print("✅ User successfully removed from users list")
        else:
            print("❌ User still exists in users list")
    else:
        print(f"Failed to verify deletion: {response.status_code}")

if __name__ == "__main__":
    print("Testing Delete User Functionality")
    print("=" * 40)
    test_delete_user() 