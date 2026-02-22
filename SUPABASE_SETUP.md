# Supabase Setup Guide for 3D Gallery

This guide will help you set up Supabase to enable shareable galleries with unique URLs.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project name**: `3D Gallery` (or whatever you prefer)
   - **Database Password**: Choose a strong password (save it somewhere safe!)
   - **Region**: Select the closest region to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be set up

## Step 2: Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy and paste the contents of `supabase-setup.sql` file
4. Click "Run" to execute the SQL
5. You should see a success message

## Step 3: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click "Create a new bucket"
3. Enter bucket name: `gallery-photos`
4. **Make sure "Public bucket" is checked** (so shared photos are accessible)
5. Click "Create bucket"

### Set Storage Policies

1. Click on the `gallery-photos` bucket
2. Go to **Policies** tab
3. Click "New Policy"
4. For **INSERT**:
   - Click "For full customization"
   - Policy name: `Allow public uploads`
   - Target roles: `public`
   - USING expression: `true`
   - Check: `true`
   - Click "Review" then "Save policy"

5. For **SELECT** (view):
   - Click "New Policy" again
   - Policy name: `Allow public reads`
   - Target roles: `public`
   - Operation: SELECT
   - USING expression: `true`
   - Click "Review" then "Save policy"

## Step 4: Get Your API Credentials

1. Go to **Settings** (gear icon) in the left sidebar
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (long string of characters under "Project API keys")

## Step 5: Configure Your App

1. In your project folder, create a new file named `.env`
2. Copy the contents from `env.example.txt`
3. Replace the placeholder values with your actual Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

4. Save the file

## Step 6: Restart Your Dev Server

1. Stop your development server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. The app should now be connected to Supabase!

## Step 7: Test the Feature

1. Open your gallery at `http://localhost:3000`
2. Upload some photos
3. Customize the gallery (sky mode, music, etc.)
4. Click "Save & Share Gallery" at the bottom left
5. You should see a success message and a shareable URL
6. Copy the URL and open it in a new browser window/incognito mode
7. You should see your customized gallery!

## How It Works

### For Gallery Creators:
1. Customize your gallery with photos, sky mode, and music
2. Click "Save & Share Gallery"
3. Get a unique URL like: `yoursite.com?g=abc123xyz`
4. Share that URL with your loved one

### For Gallery Viewers:
1. Open the shared URL
2. See the customized gallery instantly
3. No login required!

## Features

✅ **Unique URLs** - Each gallery gets a unique ID  
✅ **Photo Storage** - Images are stored in Supabase Storage  
✅ **Public Sharing** - No authentication needed to view  
✅ **Auto-Save** - Updates to the same gallery ID when re-saving  
✅ **Custom Music** - YouTube URLs are saved with the gallery  
✅ **Sky Modes** - Chosen sky mode is saved  

## Troubleshooting

### "Failed to save gallery"
- Check that your `.env` file exists and has the correct credentials
- Make sure you restarted the dev server after creating `.env`
- Check browser console for detailed error messages

### "Failed to load gallery"
- The gallery ID might be invalid
- Check that the database table was created correctly
- Verify the Storage bucket exists and has public policies

### Images not showing
- Check that the `gallery-photos` bucket is public
- Verify storage policies allow public reads
- Check browser console for CORS errors

## Security Notes

- The current setup allows anyone to create and update galleries (no authentication)
- This is perfect for sharing with loved ones
- For production use with many users, consider adding authentication
- Supabase free tier limits:
  - 500MB database space
  - 1GB storage
  - 2GB bandwidth per month

## Need Help?

Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)

