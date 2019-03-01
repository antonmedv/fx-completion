# fx-completion

Bash completion for [fx](https://github.com/antonmedv/fx)

<p align="center"><img src="https://user-images.githubusercontent.com/141232/53610000-f5e89000-3bfb-11e9-9fa7-b457ac921911.gif" width="440" alt=""></p>

## Install

```bash
npm i -g fx-completion
```

And add to your _.bash_profile_ file next line:
```bash
source <(fx-completion --bash)
```

## Usage

Fields of JSON file provided only if _fx_ used with file as first argument. 

```bash
$ fx data.json <Tab>
```

## License

MIT
