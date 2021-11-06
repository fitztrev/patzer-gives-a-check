import _ from 'lodash'
import Vue from 'vue/dist/vue.js'
import { Chess as ChessJS } from 'chess.js'
import { Chessground } from 'chessground'

import puzzles from './puzzles.js'

// Have Vue ignore HTML elements from Chessground's svg board
Vue.config.ignoredElements = [/^cg-/, 'coords', 'piece', 'coord', 'square']

new Vue({
    el: '#app',

    data: {
        chessgroundInstance: null,
        chessJsInstance: null,
        puzzleId: null,
        userFoundChecks: [],

        streakScore: 0,
        streakIsOver: false,
    },

    computed: {
        validChecks: function () {
            return this.chessJsInstance
                .moves({ verbose: true })
                .filter((move) => /\+|\#/.test(move.san))
        },
        toMove: function () {
            return this.chessJsInstance.turn() === 'w' ? 'white' : 'black'
        },
        userMissingChecks: function () {
            return _.xor(this.validChecks, this.userFoundChecks)
        },
    },

    mounted: function () {
        this.chessgroundInstance = Chessground(
            document.getElementById('chessground')
        )

        this.newStreak()

        // Register keyboard shortcut for pressing "Done"
        document.addEventListener(
            'keypress',
            function (key) {
                if (key.code === 'Space' && !this.streakIsOver) {
                    this.checkAnswers()
                }
            }.bind(this)
        )
    },

    methods: {
        loadNewPuzzle: function () {
            let puzzle = _.sample(puzzles).split(',')

            this.puzzleId = puzzle[0]

            this.chessJsInstance = new ChessJS(puzzle[1])

            // The Lichess puzzle starts after the first move, so play the first move
            this.chessJsInstance.move(puzzle[2].split(' ')[0], { sloppy: true })

            // If any of the checks are pawn promotions, skip.
            // Need to implement the promotion dialog first.
            if (
                _.some(this.validChecks, function (check) {
                    return check.san.includes('=')
                })
            ) {
                this.loadNewPuzzle()
            }

            this.userFoundChecks = []

            this.setupChessground()
        },

        setupChessground: function () {
            let legalMoves = this.chessJsInstance.moves({ verbose: true })

            let moves = new Map()
            legalMoves.forEach(function (move) {
                if (!moves.has(move.from)) {
                    moves.set(move.from, [])
                }

                moves.get(move.from).push(move.to)
            })

            this.chessgroundInstance.set({
                fen: this.chessJsInstance.fen(),
                orientation: this.toMove,
                lastMove: [],
                movable: {
                    free: false,
                    dests: moves,
                    events: {
                        after: function (from, to) {
                            let check = _.find(this.validChecks, { from, to })

                            if (
                                check &&
                                !_.includes(this.userFoundChecks, check)
                            ) {
                                this.incrementScore()
                                this.userFoundChecks = _.union(
                                    this.userFoundChecks,
                                    [check]
                                )
                            }

                            if (!check) {
                                this.endStreak()
                            }

                            this.setupChessground()
                        }.bind(this),
                    },
                },
            })
        },

        checkAnswers: function () {
            if (this.userFoundChecks.length === this.validChecks.length) {
                // If there were 0 checks in the puzzle, award a point for getting it right
                if (this.userFoundChecks.length === 0) {
                    this.incrementScore()
                }

                this.loadNewPuzzle()
            } else {
                this.endStreak()
            }
        },

        incrementScore: function () {
            if (!this.streakIsOver) {
                this.streakScore++
            }
        },

        newStreak: function () {
            this.streakScore = 0
            this.streakIsOver = false
            this.loadNewPuzzle()
        },

        endStreak: function () {
            this.streakIsOver = true
        },
    },
})
