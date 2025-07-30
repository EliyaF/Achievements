from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime

app = FastAPI(title="Achievements API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class User(BaseModel):
    username: str

class Achievement(BaseModel):
    id: str
    name: str
    description: str
    image_url: str
    unlocked: bool = False

class UserAchievement(BaseModel):
    username: str
    achievement_id: str
    unlocked_at: str

class AdminUpdate(BaseModel):
    username: str
    achievement_id: str
    unlocked: bool

# In-memory storage (in production, use a proper database)
USERS_FILE = "users.json"
ACHIEVEMENTS_FILE = "achievements.json"
USER_ACHIEVEMENTS_FILE = "user_achievements.json"

# Initialize default data
def init_default_data():
    # Check if achievements file exists, if not create it with default achievements
    if not os.path.exists(ACHIEVEMENTS_FILE):
        # Default achievements structure
        default_achievements = [
            {
                "id": "finish_training",
                "name": "סיום חפיפות",
                "description": "השלמתי חפיפות בהצלחה",
                "image_url": "/images/finish_training.png"
            },
            {
                "id": "caused_break",
                "name": "בריק למכשיר",
                "description": "גרמתי לבריק למכשיר",
                "image_url": "/images/caused_break.png"
            },
            {
                "id": "critical_sd",
                "name": "SD קריטי",
                "description": "ריזלבתי SD קריטי",
                "image_url": "/images/critical_sd.png"
            },
            {
                "id": "found_bug",
                "name": "מצאתי באג",
                "description": "מצאתי באג בקוד של הצוות",
                "image_url": "/images/found_bug.png"
            },
            {
                "id": "uploaded_version",
                "name": "הוצאת גרסה",
                "description": "הוצאתי גרסה למודול",
                "image_url": "/images/uploaded_version.png"
            },
            {
                "id": "wrote_code",
                "name": "כתיבת קוד",
                "description": "כתבתי קוד שהתמרגג למאסטר",
                "image_url": "/images/wrote_code.png"
            },
            {
                "id": "improved_ci",
                "name": "שיפורי CI",
                "description": "שיפרתי את הCI של הצוות",
                "image_url": "/images/improved_ci.png"
            },
            {
                "id": "did_cr",
                "name": "CR",
                "description": "עשיתי CR לחבר צוות",
                "image_url": "/images/did_cr.png"
            }
        ]
        
        with open(ACHIEVEMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(default_achievements, f, indent=2, ensure_ascii=False)
    
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, indent=2, ensure_ascii=False)
    
    if not os.path.exists(USER_ACHIEVEMENTS_FILE):
        with open(USER_ACHIEVEMENTS_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, indent=2, ensure_ascii=False)

# Load data functions
def load_achievements():
    try:
        with open(ACHIEVEMENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_users():
    try:
        with open(USERS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def load_user_achievements():
    try:
        with open(USER_ACHIEVEMENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_users(users):
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(users, f, indent=2, ensure_ascii=False)

def save_user_achievements(user_achievements):
    with open(USER_ACHIEVEMENTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(user_achievements, f, indent=2, ensure_ascii=False)

# Initialize data on startup
init_default_data()

@app.get("/")
def read_root():
    return {"message": "Achievements API is running"}

@app.post("/login")
def login(user: User):
    """Simple login - just track the username"""
    users = load_users()
    
    # Check if user exists, if not add them
    if user.username not in [u["username"] for u in users]:
        users.append({"username": user.username, "created_at": datetime.now().isoformat()})
        save_users(users)
    
    return {"message": f"Welcome {user.username}!", "username": user.username}

@app.get("/achievements/{username}")
def get_user_achievements(username: str):
    """Get all achievements with unlock status for a specific user"""
    achievements = load_achievements()
    user_achievements = load_user_achievements()
    
    # Get unlocked achievement IDs for this user
    unlocked_ids = [ua["achievement_id"] for ua in user_achievements if ua["username"] == username]
    
    # Add unlock status to each achievement
    for achievement in achievements:
        achievement["unlocked"] = achievement["id"] in unlocked_ids
    
    return {"achievements": achievements, "username": username}

@app.get("/achievements")
def get_all_achievements():
    """Get all available achievements (admin endpoint)"""
    achievements = load_achievements()
    return {"achievements": achievements}

@app.post("/admin/update-achievement")
def update_user_achievement(update: AdminUpdate):
    """Admin endpoint to update user achievement status"""
    # In a real app, you'd check for admin authentication here
    # For now, we'll allow any request
    
    achievements = load_achievements()
    user_achievements = load_user_achievements()
    
    # Check if achievement exists
    achievement_exists = any(a["id"] == update.achievement_id for a in achievements)
    if not achievement_exists:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    # Check if user exists
    users = load_users()
    user_exists = any(u["username"] == update.username for u in users)
    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update or add user achievement
    existing_index = None
    for i, ua in enumerate(user_achievements):
        if ua["username"] == update.username and ua["achievement_id"] == update.achievement_id:
            existing_index = i
            break
    
    if update.unlocked:
        if existing_index is not None:
            # Update existing
            user_achievements[existing_index]["unlocked_at"] = datetime.now().isoformat()
        else:
            # Add new
            user_achievements.append({
                "username": update.username,
                "achievement_id": update.achievement_id,
                "unlocked_at": datetime.now().isoformat()
            })
    else:
        # Remove achievement if exists
        if existing_index is not None:
            user_achievements.pop(existing_index)
    
    save_user_achievements(user_achievements)
    
    return {
        "message": f"Achievement {update.achievement_id} {'unlocked' if update.unlocked else 'locked'} for user {update.username}",
        "username": update.username,
        "achievement_id": update.achievement_id,
        "unlocked": update.unlocked
    }

@app.get("/users")
def get_all_users():
    """Get all users (admin endpoint)"""
    users = load_users()
    return {"users": users}

@app.delete("/admin/delete-user/{username}")
def delete_user(username: str):
    """Admin endpoint to delete a user and all their achievements"""
    # In a real app, you'd check for admin authentication here
    # For now, we'll allow any request
    
    users = load_users()
    user_achievements = load_user_achievements()
    
    # Check if user exists
    user_exists = any(u["username"] == username for u in users)
    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Safety check: prevent deleting the last user
    if len(users) <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the last user in the system")
    
    # Remove user from users list
    users = [u for u in users if u["username"] != username]
    save_users(users)
    
    # Remove all achievements for this user
    user_achievements = [ua for ua in user_achievements if ua["username"] != username]
    save_user_achievements(user_achievements)
    
    return {
        "message": f"User {username} and all their achievements have been deleted",
        "deleted_user": username
    }

@app.get("/statistics")
def get_statistics():
    """Get comprehensive statistics about achievements and users"""
    users = load_users()
    achievements = load_achievements()
    user_achievements = load_user_achievements()
    
    # Calculate user statistics
    user_stats = []
    for user in users:
        user_achievement_count = len([ua for ua in user_achievements if ua["username"] == user["username"]])
        user_stats.append({
            "username": user["username"],
            "achievements_count": user_achievement_count,
            "total_achievements": len(achievements),
            "completion_percentage": round((user_achievement_count / len(achievements)) * 100, 2) if len(achievements) > 0 else 0
        })
    
    # Sort users by achievement count (descending)
    user_stats.sort(key=lambda x: x["achievements_count"], reverse=True)
    
    # Calculate achievement popularity
    achievement_popularity = []
    for achievement in achievements:
        unlock_count = len([ua for ua in user_achievements if ua["achievement_id"] == achievement["id"]])
        popularity_percentage = round((unlock_count / len(users)) * 100, 2) if len(users) > 0 else 0
        achievement_popularity.append({
            "id": achievement["id"],
            "name": achievement["name"],
            "description": achievement["description"],
            "image_url": achievement["image_url"],
            "unlock_count": unlock_count,
            "popularity_percentage": popularity_percentage
        })
    
    # Sort achievements by popularity (descending)
    achievement_popularity.sort(key=lambda x: x["unlock_count"], reverse=True)
    
    # Calculate overall statistics
    total_users = len(users)
    total_achievements = len(achievements)
    total_unlocks = len(user_achievements)
    average_achievements_per_user = round(total_unlocks / total_users, 2) if total_users > 0 else 0
    most_popular_achievement = achievement_popularity[0] if achievement_popularity else None
    least_popular_achievement = achievement_popularity[-1] if achievement_popularity else None
    
    # Calculate recent activity (achievements unlocked in the last 30 days)
    from datetime import datetime, timedelta
    thirty_days_ago = datetime.now() - timedelta(days=30)
    recent_unlocks = [
        ua for ua in user_achievements 
        if datetime.fromisoformat(ua["unlocked_at"]) > thirty_days_ago
    ]
    
    return {
        "overall_stats": {
            "total_users": total_users,
            "total_achievements": total_achievements,
            "total_unlocks": total_unlocks,
            "average_achievements_per_user": average_achievements_per_user,
            "recent_unlocks_count": len(recent_unlocks)
        },
        "user_rankings": user_stats,
        "achievement_popularity": achievement_popularity,
        "most_popular_achievement": most_popular_achievement,
        "least_popular_achievement": least_popular_achievement,
        "recent_activity": recent_unlocks
    }

@app.get("/statistics/{username}")
def get_user_statistics(username: str):
    """Get detailed statistics for a specific user"""
    users = load_users()
    achievements = load_achievements()
    user_achievements = load_user_achievements()
    
    # Check if user exists
    user_exists = any(u["username"] == username for u in users)
    if not user_exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's achievements
    user_achievement_list = [ua for ua in user_achievements if ua["username"] == username]
    user_achievement_ids = [ua["achievement_id"] for ua in user_achievement_list]
    
    # Calculate user's position in rankings
    all_user_stats = []
    for user in users:
        user_achievement_count = len([ua for ua in user_achievements if ua["username"] == user["username"]])
        all_user_stats.append({
            "username": user["username"],
            "achievements_count": user_achievement_count
        })
    
    all_user_stats.sort(key=lambda x: x["achievements_count"], reverse=True)
    user_rank = next((i + 1 for i, stat in enumerate(all_user_stats) if stat["username"] == username), 0)
    
    # Get user's achievement details
    user_achievement_details = []
    for ua in user_achievement_list:
        achievement = next((a for a in achievements if a["id"] == ua["achievement_id"]), None)
        if achievement:
            user_achievement_details.append({
                "id": achievement["id"],
                "name": achievement["name"],
                "description": achievement["description"],
                "image_url": achievement["image_url"],
                "unlocked_at": ua["unlocked_at"]
            })
    
    # Calculate completion percentage
    completion_percentage = round((len(user_achievement_list) / len(achievements)) * 100, 2) if len(achievements) > 0 else 0
    
    return {
        "username": username,
        "achievements_count": len(user_achievement_list),
        "total_achievements": len(achievements),
        "completion_percentage": completion_percentage,
        "rank": user_rank,
        "total_users": len(users),
        "achievements": user_achievement_details
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 