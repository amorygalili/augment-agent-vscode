# Webview Frontend

This directory contains the React-based frontend code for the VSCode extension's webview interface.

## Structure

```
webview/
├── src/
│   ├── components/          # React components
│   │   ├── ChatApp.tsx     # Main chat application
│   │   ├── MessageList.tsx # Message display
│   │   ├── MessageInput.tsx # User input
│   │   └── ...
│   ├── index.tsx           # Entry point
│   └── types.ts            # TypeScript type definitions
├── public/
│   └── index.html          # HTML template
├── tsconfig.json           # TypeScript configuration
└── webpack.config.js       # Webpack build configuration
```

## Development

The webview has its own build process separate from the main extension:

- **Build**: `npm run build:webview`
- **Watch**: `npm run watch:webview`
- **Type Check**: `npm run check-types:webview`

## Technologies

- **React 19** with TypeScript
- **Material-UI** for components and theming
- **Webpack** for bundling
- **VSCode Webview API** for extension communication

## Build Output

The built files are output to `../dist/webview/`:
- `bundle.js` - The compiled React application
- `index.html` - The HTML template
- `bundle.js.map` - Source maps for debugging
