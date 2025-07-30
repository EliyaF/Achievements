import requests
import json

# Test the statistics endpoints
BASE_URL = "http://localhost:8000"

def test_statistics():
    try:
        # Test general statistics
        response = requests.get(f"{BASE_URL}/statistics")
        if response.status_code == 200:
            data = response.json()
            print("✅ General statistics endpoint working")
            print(f"Total users: {data['overall_stats']['total_users']}")
            print(f"Total achievements: {data['overall_stats']['total_achievements']}")
            print(f"Total unlocks: {data['overall_stats']['total_unlocks']}")
        else:
            print(f"❌ General statistics failed: {response.status_code}")
            
        # Test user statistics (assuming there's at least one user)
        response = requests.get(f"{BASE_URL}/users")
        if response.status_code == 200:
            users = response.json()['users']
            if users:
                test_user = users[0]['username']
                response = requests.get(f"{BASE_URL}/statistics/{test_user}")
                if response.status_code == 200:
                    data = response.json()
                    print("✅ User statistics endpoint working")
                    print(f"User: {data['username']}")
                    print(f"Achievements: {data['achievements_count']}/{data['total_achievements']}")
                    print(f"Rank: #{data['rank']}")
                else:
                    print(f"❌ User statistics failed: {response.status_code}")
            else:
                print("⚠️ No users found to test user statistics")
        else:
            print(f"❌ Users endpoint failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_statistics() 