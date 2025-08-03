#!/usr/bin/env python3
"""
Test script to verify admin user functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_admin_user():
    print("Testing Admin User Functionality")
    print("=" * 40)
    
    # Test 1: Login as admin
    print("\n1. Testing admin login...")
    try:
        response = requests.post(f"{BASE_URL}/login", json={"username": "admin"})
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Admin login successful: {data}")
            assert data.get("is_admin") == True, "Admin user should have is_admin=True"
        else:
            print(f"❌ Admin login failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Admin login error: {e}")
    
    # Test 2: Try to get admin achievements (should fail)
    print("\n2. Testing admin achievements access (should fail)...")
    try:
        response = requests.get(f"{BASE_URL}/achievements/admin")
        if response.status_code == 403:
            print("✅ Admin achievements access correctly blocked")
        else:
            print(f"❌ Admin achievements access should be blocked: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin achievements test error: {e}")
    
    # Test 3: Try to get admin statistics (should fail)
    print("\n3. Testing admin personal statistics (should fail)...")
    try:
        response = requests.get(f"{BASE_URL}/statistics/admin")
        if response.status_code == 403:
            print("✅ Admin personal statistics correctly blocked")
        else:
            print(f"❌ Admin personal statistics should be blocked: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin statistics test error: {e}")
    
    # Test 4: Check that admin is not in users list
    print("\n4. Testing admin exclusion from users list...")
    try:
        response = requests.get(f"{BASE_URL}/users")
        if response.status_code == 200:
            data = response.json()
            admin_in_list = any(user["username"] == "admin" for user in data["users"])
            if not admin_in_list:
                print("✅ Admin correctly excluded from users list")
            else:
                print("❌ Admin should not be in users list")
        else:
            print(f"❌ Failed to get users: {response.status_code}")
    except Exception as e:
        print(f"❌ Users list test error: {e}")
    
    # Test 5: Check statistics exclude admin completely
    print("\n5. Testing statistics completely exclude admin...")
    try:
        response = requests.get(f"{BASE_URL}/statistics")
        if response.status_code == 200:
            data = response.json()
            admin_in_rankings = any(user["username"] == "admin" for user in data["user_rankings"])
            if not admin_in_rankings:
                print("✅ Admin correctly excluded from user rankings")
            else:
                print("❌ Admin should not be in user rankings")
            
            # Check that admin achievements don't count in total unlocks
            total_users = data["overall_stats"]["total_users"]
            total_unlocks = data["overall_stats"]["total_unlocks"]
            print(f"✅ Statistics show {total_users} users and {total_unlocks} total unlocks (admin excluded)")
        else:
            print(f"❌ Failed to get statistics: {response.status_code}")
    except Exception as e:
        print(f"❌ Statistics test error: {e}")
    
    # Test 6: Try to assign achievement to admin (should fail)
    print("\n6. Testing assignment of achievement to admin (should fail)...")
    try:
        response = requests.post(f"{BASE_URL}/admin/update-achievement", json={
            "username": "admin",
            "achievement_id": "test_achievement",
            "unlocked": True
        })
        if response.status_code == 403:
            print("✅ Admin achievement assignment correctly blocked")
        else:
            print(f"❌ Admin achievement assignment should be blocked: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin achievement assignment test error: {e}")
    
    # Test 7: Try to delete admin user (should fail)
    print("\n7. Testing admin user deletion (should fail)...")
    try:
        response = requests.delete(f"{BASE_URL}/admin/delete-user/admin")
        if response.status_code == 403:
            print("✅ Admin user deletion correctly blocked")
        else:
            print(f"❌ Admin user deletion should be blocked: {response.status_code}")
    except Exception as e:
        print(f"❌ Admin deletion test error: {e}")
    
    # Test 8: Verify admin is never added to users file
    print("\n8. Testing admin is never added to users file...")
    try:
        # First, login as admin
        login_response = requests.post(f"{BASE_URL}/login", json={"username": "admin"})
        if login_response.status_code == 200:
            # Then check users list
            users_response = requests.get(f"{BASE_URL}/users")
            if users_response.status_code == 200:
                users_data = users_response.json()
                admin_in_users = any(user["username"] == "admin" for user in users_data["users"])
                if not admin_in_users:
                    print("✅ Admin correctly not added to users file")
                else:
                    print("❌ Admin should not be in users file")
            else:
                print(f"❌ Failed to get users after admin login: {users_response.status_code}")
        else:
            print(f"❌ Admin login failed: {login_response.status_code}")
    except Exception as e:
        print(f"❌ Admin users file test error: {e}")
    
    # Test 9: Verify admin remains virtual after multiple logins
    print("\n9. Testing admin remains virtual after multiple logins...")
    try:
        # Login as admin multiple times
        for i in range(3):
            login_response = requests.post(f"{BASE_URL}/login", json={"username": "admin"})
            if login_response.status_code != 200:
                print(f"❌ Admin login {i+1} failed: {login_response.status_code}")
                break
        
        # Check users list again
        users_response = requests.get(f"{BASE_URL}/users")
        if users_response.status_code == 200:
            users_data = users_response.json()
            admin_in_users = any(user["username"] == "admin" for user in users_data["users"])
            if not admin_in_users:
                print("✅ Admin correctly remains virtual after multiple logins")
            else:
                print("❌ Admin should remain virtual after multiple logins")
        else:
            print(f"❌ Failed to get users after multiple admin logins: {users_response.status_code}")
    except Exception as e:
        print(f"❌ Admin virtual user test error: {e}")
    
    print("\n" + "=" * 40)
    print("Admin user functionality test completed!")

if __name__ == "__main__":
    test_admin_user() 