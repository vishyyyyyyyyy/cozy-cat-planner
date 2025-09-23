

## 🚀 Installation & Build Instructions

1. **Clone the repository:**
	```sh
	git clone https://github.com/vishyyyyyyyyy/cozy-cat-planner.git
	cd cozy-cat-planner
	```

2. **Install dependencies:**
	```sh
	npm install
	```

3. **Run the app in development mode:**
	```sh
	npm start
	```

4. **Build the desktop installer:**
	```sh
	npm run dist
	```
	The installer (.exe) will be created in the `dist/` folder. Double-click it to install the app and create a desktop shortcut.

**Note:**
- You need Node.js and npm installed on your computer.
- For Windows, make sure to run the build command in PowerShell or Command Prompt (not Git Bash).
- If you update the app, rebuild and reinstall to see changes.


##  🐾 Cozy Cat Planner 🐾

This is my entry for the Codedex monthly challenge!
https://www.codedex.io/community/monthly-challenge/submission/JNQqjFdVLcyZF48zEobN

This app was built with the help of GitHub Copilot as part of the challenge to use AI assistance in development.

Since college started just a month ago, I’ve been needing to organize my homework, clubs, hangouts I’m going to. I tried a few planners out online, but I didn’t like the styles or layout, so I’ve been wanting to create my own planner but not having enough time. This monthly challenge gave me a chance to bring my planner idea to life!!

This project is a revamp of one of my very first coding projects, Fat Cat Dressup. You can find it hereeee ⤷ ゛ ˎˊ˗ https://www.codedex.io/community/project-showcase/Q7Zq2NTzRczjDW3W3dOJ

This challenge allowed me to show how much I’ve grown as a developer and my designing abilities. I’m a little iffy on javascript so I used copilot to help translate the python code for saving sessions for fur colors, accessories, etc into javascript and make the whole project better!


Throughout development, I used Copilot to:
- Generate the Electron boilerplate and install dependencies
- Create the calendar and todo list panels
- Fix sizing issues and asset blurriness
- Translate Python logic to JavaScript for session saving
- Implement logic for screen capture of the cat
- Mass delete unused code and files
- Solve bugs (like using local time instead of UTC)
- Generate a .gitignore file
- Create animated falling leaves
- Explain code structure so I could manually fix things
- Apply quick code fixes (like border thickness, padding)

I learned that Copilot works best step-by-step, and sometimes I had to manually fix or review changes, especially for bigger refactors or when Copilot changed things I didn’t ask for. It also taught me about SVG assets and how to combine them for better quality and organization.

✨ Features
- Dress up your cat with different fur colors, costumes, and accessories
- Add, check off, and delete todos for any day
- Calendar view with clickable days and event/todo overview
- List view with 24-hour time slots and todos as bullet points
- Animated falling leaves background
- Kitty bubble with random messages and timed popups
- Custom app icon and desktop installer

🧠 Things I learned
- How to use Electron to build cross-platform desktop apps
- How to manage app state and localStorage for persistence
- How to create interactive UI elements and overlays
- How to package and distribute an Electron app with a custom icon
- That Copilot is great for generating boilerplate, quick fixes, and explanations, but manual review is important for big changes

🛠️ Future Improvements
- Add notifications/reminders for important events
- More costumes and accessories for the kitty
- Sync calendar/todos with Google Calendar
- Add more animated backgrounds for different seasons
