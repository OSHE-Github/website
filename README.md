## Development

### Setting up your enviroment
1. Ensure [Node.js](https://nodejs.org/en/) is installed and the version, as reported by `node -v`, is `>= 8.0.0`.
2. Clone this repository.
3. Inside the resulting directory, run `npm i` to install dependencies.
4. See below for details on using Gulp.

### Using Gulp
This project uses [Gulp](http://gulpjs.com) to run automated tasks for development and production builds. The tasks are as follows:
- `gulp serve`: starts a live-reloading development server for rapidly prototyping
- `gulp build:production`: builds the website and puts resulting files in the `dist/` directory
- `gulp build:clean`: deletes the `dist/` directory


### Example workflow
1. Set up your enviroment.
2. Start the Gulp devleopment server with `gulp serve`.
3. Make changes to `data.json` (add more photos, change a bio, remove a team member).
4. Watch changes magically appear in your browser on the fly.
5. When you're done making changes,
  - Stop `gulp serve`
  - Run `gulp build:production`
  - Copy all files from the resulting `dist/` directory to the server.

**The distrubtion directory (`dist/`) is ephemeral; do not manually make changes to files contained within it.**
