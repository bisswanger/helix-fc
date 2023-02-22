# Franklin sample project

Test conversion of https://fc.de/fc-info/startseite/

## Environments
- Preview: https://main--helix-fc--bisswanger.hlx.page/
- Live: https://main--helix-fc--bisswanger.hlx.live/

## Installation

```sh
npm i
```

## Tests

```sh
npm tst
```

## Local development

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `helix-fc` directory in your favorite IDE and start coding :)
