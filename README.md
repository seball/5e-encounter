# 5eEncounter

<div align="center">
    <img src="/assets/portrais/portrait-1.webp" alt="Battle Manager Preview 1" width="250" style="display: inline-block; margin: 0 10px"/>
    <img src="/assets/portrais/portrait-2.webp" alt="Battle Manager Preview 2" width="250" style="display: inline-block; margin: 0 10px"/>
    <img src="/assets/portrais/portrait-3.webp" alt="Battle Manager Preview 3" width="250" style="display: inline-block; margin: 0 10px"/>
</div>

A powerful tool for managing your tabletop RPG encounters and battles.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository

```bash
git clone https://github.com/seball/5e-encounter.git
cd 5e-encounter
```

2. Install dependencies

```bash
npm install
```

### Running Locally

- Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm run watch`: Builds the app in watch mode for development
- `npm run prettier`: Format code using Prettier
- `npm run lint`: Lint TypeScript files
- `npm run generate-avatar-list`: Generate the avatar list
- `npm run deploy-pages`: Deploy to GitHub Pages (make sure to change --base-href)

## Manual

### 1. Prepare Battlefield

- Choose monster from list or create your own monster
- For player character create your own - no statblock creation is required
- For editing character simple right click on character cart and hit edit from the context menu

### 2. Set the Initiative

- Provide the values this can be overriden
- You can also roll for initiative on the UI screen using the roll dice
- Drag and drop sorted list if needed

### 3. Start Battle

- Navigate characters by using next or previous this will open current character statblock
- For viewing other characters during the combat right click on character card and click view

### 4. Others

- Use mouse scroll to quickly increase or decrease value for heal or damage
- In settings sections you can:
  - Import/export your encounters
  - Manage your custom statblocks
  - Save and load your battlefields
  - Add AI API key for generating the statblocks via AI
- To add custom statblock right click on character card and choose "add to monster list"
- Getting AI API key is free (see the options section)
- By right clicking on character card there are numerous other options that would help for creating your encounter

## Pro Tip 💡

Right-click menu on character cards provides quick access to most commonly used features. Explore these options to streamline your encounter management!

## Support

If you find this app helpful please consider supporting me with $1

[![Buy Me A Coffee](/assets/icons/blue-button.png)](https://buymeacoffee.com/s3ball)

## Contact

Feel free to request new features or report bugs at [s3ball@proton.me](mailto:s3ball@proton.me)

## License

This project is under dual license:

- Software components are licensed under MIT License with Commons Clause
- Creative assets are licensed under CC BY-NC 4.0

See the [LICENSE.md](LICENSE.md) file for details.
