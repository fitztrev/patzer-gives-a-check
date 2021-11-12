# Patzer Gives a Check

A chess training tool

https://fitztrev.github.io/patzer-gives-a-check

## Setup

```bash
git clone git@github.com:fitztrev/patzer-gives-a-check.git
cd patzer-gives-a-check
npm install
npm run start
```

## Re-generate puzzle data

A random subset of puzzles are taken from the [Lichess database](https://database.lichess.org/).

Download, extract, and place  `lichess_db_puzzle.csv` in `./puzzle-data/`.

```bash
python3 ./puzzle-data/generate.py
```

## Deploy to Github Pages

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

## To-Do

1. Implement pawn promotion dialog.
    For example, when a pawn promotes and either a queen or rook can check:
    ```
    kr6/p5R1/q1p4p/4Q3/8/P6P/1P2p2P/K7 b - - 3 43
    ```
    Right now, puzzles with promotion are skipped.

## Credits

Puzzles from [Lichess database](https://database.lichess.org/)

Sound effects from [Lichess puzzle storm](https://github.com/ornicar/lila)
