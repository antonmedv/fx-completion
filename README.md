# fx-completion

Bash completion for [fx](https://github.com/antonmedv/fx)

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
