# Admin User Feature

## Overview

A special "admin" user has been implemented with the username "admin" that has restricted functionality compared to normal users. The admin user is **completely virtual** - it is **not** a regular user in the system and is never stored in the users file.

## Admin User Restrictions

### 1. Cannot Get Achievements
- Admin users cannot access the `/achievements/{username}` endpoint
- Returns 403 Forbidden error when trying to access achievements
- Admin users are redirected to admin panel instead of achievements page

### 2. Not Counted in Statistics
- Admin user is **completely excluded** from all normal statistics calculations
- Not included in user rankings
- Not counted in achievement popularity calculations
- Not included in overall user counts
- Admin achievements are excluded from total unlock counts
- **Admin is never added to the users file**

### 3. Cannot Access Personal Statistics
- Admin users cannot access `/statistics/{username}` endpoint
- Returns 403 Forbidden error when trying to access personal statistics
- Personal statistics tab is hidden for admin users

### 4. Cannot Be Managed Like Normal Users
- Admin user cannot be assigned achievements
- Admin user cannot be deleted
- Admin user is **not shown** in the users list for management
- Admin user is **not an option** in admin panel user selection dropdowns
- **Admin user is completely virtual and never stored**

## Frontend Behavior

### Login Flow
- When "admin" username is entered, user is automatically detected as admin
- Admin users are redirected directly to `/admin` page after login
- Normal users are redirected to `/achievements` page
- **Admin user is never added to the users file** - it remains completely virtual

### Navigation Restrictions
- Admin users cannot access `/achievements` page (redirected to admin)
- Normal users cannot see admin link in achievements page
- Admin users see "Back to Admin" link in statistics page
- Normal users see "Back" link in statistics page

### Admin Panel Access
- Only admin users can access the admin panel
- Admin users see statistics link in admin panel
- Normal users see "Back to Main Page" link in admin panel
- **Admin user is not an option** in user selection dropdowns
- User selection defaults to empty - admin must select a user

## Backend Implementation

### Key Changes Made

1. **Backend (`backend/main.py`)**:
   - Added `ADMIN_USERNAME = "admin"` constant
   - Added `is_admin_user()` helper function
   - Modified login endpoint to return `is_admin` flag
   - **Admin user is never added to users file** - completely virtual
   - Added admin user checks in all relevant endpoints
   - **Completely excluded admin from statistics calculations**
   - **Excluded admin achievements from total unlock counts**
   - Prevented admin from getting achievements or personal statistics

2. **Frontend (`frontend/src/App.js`)**:
   - Modified routing to redirect admin users to admin panel
   - Added admin user detection and routing logic
   - Updated login handler to accept admin status

3. **Login Component (`frontend/src/components/Login.js`)**:
   - Added admin user detection during login
   - Passes admin status to login handler
   - Admin users bypass normal user existence checks
   - **Admin user is never added to users list** - remains virtual

4. **Admin Panel (`frontend/src/components/AdminPanel.js`)**:
   - Added admin user checks to prevent managing admin achievements
   - Added warning when admin user is selected
   - Prevented admin user deletion
   - Added conditional navigation links
   - **Admin user is not shown in user selection dropdowns**
   - **User selection defaults to empty**

5. **Achievements Component (`frontend/src/components/Achievements.js`)**:
   - Removed admin link for normal users
   - Added admin user detection

6. **Statistics Component (`frontend/src/components/Statistics.js`)**:
   - Added admin user detection
   - Hide personal statistics tab for admin users
   - Show appropriate warning messages for admin users
   - Conditional navigation links

## Testing

A test script `test_admin_user.py` has been created to verify all admin user restrictions work correctly:

1. Admin login returns `is_admin: true`
2. Admin achievements access is blocked (403)
3. Admin personal statistics are blocked (403)
4. Admin is excluded from users list
5. Admin is completely excluded from statistics
6. Admin achievement assignment is blocked (403)
7. Admin user deletion is blocked (403)
8. **Admin is never added to users file**
9. **Admin remains virtual after multiple logins**

## Usage

### For Admin Users:
1. Login with username "admin"
2. Automatically redirected to admin panel
3. Can manage other users' achievements
4. Can view general statistics
5. Cannot access personal achievements or statistics
6. **Admin user is not an option in user selection dropdowns**
7. **Admin user is completely virtual and never stored**

### For Normal Users:
1. Login with any other username
2. Redirected to achievements page
3. Cannot access admin panel
4. Can view personal statistics
5. Can view general statistics

## Security Notes

- The admin user is hardcoded as "admin" username
- No password is required (as per existing system)
- Admin detection is based solely on username
- **Admin user is never stored in the users file**
- **Admin user is completely virtual and never persists**
- **Admin user is completely excluded from all normal user operations**
- In a production environment, proper authentication should be implemented

## Files Modified

- `backend/main.py` - Backend logic and API endpoints
- `frontend/src/App.js` - Routing and admin detection
- `frontend/src/components/Login.js` - Admin login handling
- `frontend/src/components/AdminPanel.js` - Admin panel restrictions
- `frontend/src/components/Achievements.js` - Remove admin access for normal users
- `frontend/src/components/Statistics.js` - Admin statistics handling
- `test_admin_user.py` - Test script for verification
- `ADMIN_USER_FEATURE.md` - This documentation 