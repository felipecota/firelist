# Realtimeapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.9.

Start example: https://imasters.com.br/perfil/evelynmendes/?trace=3182418120&source=single

Live at: https://felipecota.github.io

## Development server

Run `git clone https://github.com/felipecota/realtimeapp` to clone this repository

Run `npm install` to install node and angular

You neeed to configure src/environments/environments.ts file with your configuration from firebase console.

export const environment = {
    production: true,
    limit: 1000,    
    firebase: {
        apiKey: "YOURKEYGOESHERE",
        authDomain: "????",
        databaseURL: "????",
        projectId: "????",
        storageBucket: "????",
        messagingSenderId: "????",
        appId: "????"
    },
    apiGeolocationKey: "YOURKEYGOESHERE"
  };

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Service Worker

To create service-worker.js file run `npm run sw`
