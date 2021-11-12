import csv
import json
import os
from random import sample

number_of_puzzles_to_include = 10000

puzzle_db = os.path.join(os.path.dirname(__file__), './lichess_db_puzzle.csv')
puzzle_json_output = os.path.join(os.path.dirname(__file__), './puzzles.json')

with open(puzzle_db) as f:
    reader = csv.reader(f)
    puzzles = sample(list(reader), number_of_puzzles_to_include)

# Delete unnecessary puzzle data
for puzzle in puzzles:
    # We only need the first move in the correct answer sequence
    puzzle[2] = puzzle[2].split(' ', 1)[0]
    # Remove columns we don't need
    del puzzle[3:9]

with open(puzzle_json_output, 'w') as f:
    json.dump(puzzles, f, indent=4)
