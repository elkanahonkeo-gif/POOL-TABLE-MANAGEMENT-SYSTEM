# Cue House: Pool Table Management System

A desktop user interface for a pool hall: login, dashboard, pool tables, customers, playing sessions, reservations, payments, staff management, and settings. Amounts show in US dollars and Kenyan Shillings.

## Files

- `index.html`: the page layout (all screens and forms).
- `style.css`: colors, layout, and styling.
- `app.js`: all the logic (login, sessions, timers, customers, reservations, payments, staff, and saving).
- `README.md`: this file.

Keep all files in the same folder. No installation or build step is needed.

## Run it on GitHub Pages

1. Upload the four files to the main folder of a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose **main** and **/ (root)**, then click **Save**.
4. Wait about two minutes, then open the link GitHub shows (`https://your-username.github.io/your-repository/`).

Open the Pages link, not the `github.com/.../index.html` file page, which shows code instead of running the app.

## Default login

- Username: `Elikanah`
- Password: `pool2026`

Change them in **Settings → Cashier account** after your first login.

## Shared data

The app loads and saves its data to one online JSON store using `fetch()`:

- Store address: `https://api.npoint.io/f7be49bad932c062e822` (set as `SHARE_URL` in `app.js`).
- On opening the page, the app loads the shared data with a GET request.
- After each change (about one second later), it saves the whole record with a PUT request, falling back to POST if needed.
- Every 15 seconds, the page checks for changes made by other users and updates the screen.
- The status line in **Settings → Database & saved names** shows whether the data is shared, saved, or offline.

If the store can't be reached, the app keeps working and saves in that browser only.

## Important security warning

This store is public. Anyone who knows the address can read all the data, including staff usernames and passwords, and can overwrite it. Do not enter real passwords or customer personal details until a private store with login protection is set up, such as a Supabase or Firebase project with access rules. Ask for help to make that change.

## Settings you may want to change

Open `app.js` in a text editor and look near the top of the script:

- `KES_PER_USD = 129`: the exchange rate for converting dollars to shillings. Update it to the current rate.
- `HOURLY_KES = 500`: the price per hour for every table, in shillings.
- `SHARE_URL`: the online store address.

## Limitations

- Text messages and owner alarms only work while the page is open. Sending real SMS needs a server and an SMS provider.
- Two people editing at the same moment can overwrite each other's changes, because the whole record is saved at once.
- There is no login security on the online store yet (see the warning above).
