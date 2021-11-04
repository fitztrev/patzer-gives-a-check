# How Many Checks?

https://fitztrev.github.io/how-many-checks

## Setup

```bash
git clone git@github.com:fitztrev/how-many-checks.git
cd how-many-checks
npm install
npm run start
```

## Deploy to Github Pages

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

## To-Do

1. BUG: Implement pawn promotion dialog
    For example, when a pawn promotes and either a queen or rook can check:
    ```
    kr6/p5R1/q1p4p/4Q3/8/P6P/1P2p2P/K7 b - - 3 43
    ```

1. Better way to include puzzle data?
    Right now, just the first 5000 puzzles from the Lichess database are included.

1. Add sound effects?
    Upon each move or just upon completion of each puzzle? Error sound effect when playing a non-check move?
