# UniBitX Web Wallet

## Development server

Install nvm via `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash`

`export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"`

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

Then use nvm to install node via `nvm install 12`

Tell nvm to use the version of node we just installed with `nvm use 12`

Then finally install Angular with this command `npm install -g @angular/cli`

Now your ready to type `ng serve` for a dev server. 

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Develop

### Updating firestore indexes

If you have updated the firestore index it is important to also add the changes to source control. In the firebase CLI, run `firebase firestore:indexes` to get the JSON, then overwrite the content of the `firestore.indexes.json` file in the root of the project folder.

### Updating firestore security rules

If you have updated the firestore rules it is important to also add the changes to source control. In the firebase console, copy the rules text and overwrite the content of the `firestore.rules` file in the root folder of the project.

## Set firebase environment variables

Read more about [Firebase environment variables here](https://firebase.google.com/docs/functions/config-env).

### Set TRTL apps id and secret

Turtle app ID: `firebase functions:config:set trtlapp.id="YOUR APP ID"`
Turtle app secret: `firebase functions:config:set trtlapp.secret="YOUR APP SECRET"`

### Set the SendGrid API key

`firebase functions:config:set sendgrid.apikey="YOUR API KEY"`
`firebase functions:config:set sendgrid.resetpintemplate="TEMPLATE ID"`

### Set coinmarketcap API key

Set the coinmarketcap API key in the environment variables:

`firebase functions:config:set coinmarketcap.apikey="YOUR API KEY"`

This API key is used for collection price information.
