# fx-completion

Bash completion for [fx](https://github.com/antonmedv/fx)

<p align="center"><img src="https://user-images.githubusercontent.com/141232/53619009-4ffb4c80-3c20-11e9-9e58-6ed729b945e0.gif" width="584" alt=""></p>

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

## TODO

[x] Bash
[ ] Zsh
[ ] Fish

## License

MIT
