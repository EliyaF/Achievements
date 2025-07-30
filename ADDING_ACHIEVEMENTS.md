# 🎯 How to Add Achievements

## **Method 1: Interactive Script (Easiest)**

Run the interactive script to add achievements:

```bash
python add_achievement.py
```

This will guide you through:
- Achievement ID and name
- Description
- Image selection (placeholder, emoji, custom URL, or local image)

## **Method 2: Manual Configuration**

Edit `backend/achievements_config.py` and add your achievement:

```python
{
    "id": "your_achievement_id",
    "name": "Your Achievement Name", 
    "description": "Description of what the user needs to do",
    "image_url": "https://your-image-url.com/image.png"
},
```

## **Image Options**

### 1. **Placeholder Images (Recommended for quick setup)**
```python
"image_url": "https://via.placeholder.com/150/4CAF50/FFFFFF?text=Your+Text"
```

**Colors available:**
- 🟢 Green: `4CAF50`
- 🟠 Orange: `FF9800` 
- 🟣 Purple: `9C27B0`
- 🔵 Blue: `2196F3`
- 🔴 Red: `F44336`
- 🔵 Cyan: `00BCD4`
- 🟢 Light Green: `8BC34A`
- ⚫ Gray: `607D8B`

### 2. **Emoji Images**
```python
"image_url": "https://via.placeholder.com/150/4CAF50/FFFFFF?text=🏆"
```

### 3. **Custom URLs**
```python
"image_url": "https://your-domain.com/images/achievement.png"
```

### 4. **Local Images**
1. Put your image in `frontend/public/images/`
2. Reference it like this:
```python
"image_url": "/images/your-image.png"
```

## **Example Achievements**

```python
# Speed-based achievement
{
    "id": "speed_runner",
    "name": "Speed Runner",
    "description": "Complete a task in under 5 minutes",
    "image_url": "https://via.placeholder.com/150/FF9800/FFFFFF?text=Speed+Runner"
},

# Emoji-based achievement
{
    "id": "champion",
    "name": "Champion",
    "description": "Win 10 competitions",
    "image_url": "https://via.placeholder.com/150/4CAF50/FFFFFF?text=🏆"
},

# Local image achievement
{
    "id": "custom_badge",
    "name": "Custom Badge",
    "description": "Earn a special custom badge",
    "image_url": "/images/custom-badge.png"
}
```

## **After Adding Achievements**

1. **Restart the backend server** to load new achievements
2. **Test in the admin panel** to unlock achievements for users
3. **Check the achievements page** to see the new achievements

## **Tips**

- Use descriptive IDs (e.g., `speed_runner`, `first_win`)
- Keep names short but clear
- Use descriptive descriptions that explain what the user needs to do
- Test with placeholder images first, then replace with custom images
- Use consistent colors for similar types of achievements

## **Troubleshooting**

- **Images not showing?** Check the URL is accessible
- **Achievement not appearing?** Restart the backend server
- **Admin panel not working?** Make sure both frontend and backend are running 