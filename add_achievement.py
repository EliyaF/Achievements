#!/usr/bin/env python3
"""
Simple script to add new achievements to the system.
Run this script to interactively add new achievements.
"""

import json
import os
from datetime import datetime

def add_achievement():
    print("🎯 Achievement Manager")
    print("=" * 40)
    
    # Get achievement details
    achievement_id = input("Enter achievement ID (e.g., 'speed_runner'): ").strip()
    name = input("Enter achievement name (e.g., 'Speed Runner'): ").strip()
    description = input("Enter description (e.g., 'Complete a task in under 5 minutes'): ").strip()
    
    print("\nImage options:")
    print("1. Use placeholder with text")
    print("2. Use placeholder with emoji")
    print("3. Use custom URL")
    print("4. Use local image")
    
    image_choice = input("Choose image option (1-4): ").strip()
    
    if image_choice == "1":
        text = input("Enter text for image (e.g., 'Speed+Runner'): ").strip()
        color = input("Enter color (4CAF50, FF9800, 9C27B0, 2196F3, F44336, 00BCD4, 8BC34A, 607D8B): ").strip() or "4CAF50"
        image_url = f"https://via.placeholder.com/150/{color}/FFFFFF?text={text}"
    elif image_choice == "2":
        emoji = input("Enter emoji (e.g., 🏃, 🏆, ⚡): ").strip()
        color = input("Enter color (4CAF50, FF9800, 9C27B0, 2196F3, F44336, 00BCD4, 8BC34A, 607D8B): ").strip() or "4CAF50"
        image_url = f"https://via.placeholder.com/150/{color}/FFFFFF?text={emoji}"
    elif image_choice == "3":
        image_url = input("Enter full image URL: ").strip()
    elif image_choice == "4":
        filename = input("Enter image filename (put image in frontend/public/images/): ").strip()
        image_url = f"/images/{filename}"
    else:
        print("Invalid choice, using default placeholder")
        image_url = f"https://via.placeholder.com/150/4CAF50/FFFFFF?text={name.replace(' ', '+')}"
    
    # Create achievement object
    achievement = {
        "id": achievement_id,
        "name": name,
        "description": description,
        "image_url": image_url
    }
    
    # Add to achievements_config.py
    config_file = "backend/achievements_config.py"
    
    if os.path.exists(config_file):
        with open(config_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find the position to insert new achievement
        lines = content.split('\n')
        insert_pos = None
        
        for i, line in enumerate(lines):
            if "# Add your custom achievements below this line:" in line:
                insert_pos = i + 1
                break
        
        if insert_pos is not None:
            # Create the new achievement line
            achievement_line = f'    {{\n        "id": "{achievement_id}",\n        "name": "{name}",\n        "description": "{description}",\n        "image_url": "{image_url}"\n    }},'
            
            # Insert the new achievement
            lines.insert(insert_pos, achievement_line)
            
            # Write back to file
            with open(config_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines))
            
            print(f"\n✅ Achievement '{name}' added successfully!")
            print(f"📁 Updated: {config_file}")
            print("\n🔄 Restart the backend server to see the new achievement.")
            
        else:
            print("❌ Could not find insertion point in config file")
    else:
        print("❌ Config file not found")

if __name__ == "__main__":
    add_achievement() 