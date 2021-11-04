import _ from 'lodash'
import Vue from 'vue/dist/vue.js'
import { Chess as ChessJS } from 'chess.js'
import { Chessground } from 'chessground';

import puzzles from './puzzles.js'

// Have Vue ignore HTML elements from Chessground's svg board
Vue.config.ignoredElements = [/^cg-/, 'coords', 'piece', 'coord', 'square']

new Vue({
    el: '#app',

    data: {
        chessgroundInstance: null,
        chessJsInstance: null,
        puzzle: {
            id: null,
            fen: null,
        },
        userFoundChecks: [],
        userScore: 0,

        wrongAnswer: false,
        showAnswers: false,
    },

    computed: {
        validChecks: function() {
            return this.chessJsInstance.moves({ verbose: true })
                .filter(move => /\+|\#/.test(move.san))
        },
        toMove: function() {
            return this.chessJsInstance.turn() === 'w' ? 'white' : 'black'
        },
    },

    mounted: function(){
        this.chessgroundInstance = Chessground(document.getElementById('chessground'))

        this.loadNewPuzzle()
    },

    methods: {
        loadNewPuzzle: function() {
            let puzzle = _.sample(puzzles).split(',')

            this.puzzle.id = puzzle[0]
            this.puzzle.fen = puzzle[1]

            this.chessJsInstance = new ChessJS(this.puzzle.fen)

            // If this puzzle has no checks, skip it
            if (_.isEmpty(this.validChecks)) {
                this.loadNewPuzzle()
            }

            this.userFoundChecks = []
            this.showAnswers = false

            this.setupChessground()
        },

        setupChessground: function() {
            let legalMoves = this.chessJsInstance.moves({ verbose: true })

            let moves = new Map()
            legalMoves.forEach(function(move) {
                if (!moves.has(move.from)) {
                    moves.set(move.from, [])
                }

                moves.get(move.from).push(move.to)
            })

            this.chessgroundInstance.set({
                fen: this.puzzle.fen,
                orientation: this.toMove,
                lastMove: [],
                movable: {
                    free: false,
                    dests: moves,
                    events: {
                        after: function(from, to) {
                            let check = _.find(this.validChecks, {from, to})

                            if (check && ! _.includes(this.userFoundChecks, check)) {
                                this.userScore++
                                this.userFoundChecks = _.union(this.userFoundChecks, [check])
                            }

                            if (! check) {
                                this.wrongAnswerProvided()
                            }

                            this.setupChessground()
                        }.bind(this)
                    },
                },
            })
        },

        checkAnswers: function() {
            if (this.userFoundChecks.length === this.validChecks.length) {
                this.loadNewPuzzle()
            } else {
                this.wrongAnswerProvided()
            }
        },

        wrongAnswerProvided: function() {
            this.resetUserScore()

            this.wrongAnswer = true
            setTimeout(function(){
                this.wrongAnswer = false
            }.bind(this), 1000)
        },

        revealAnswers: function() {
            this.resetUserScore()

            this.showAnswers = ! this.showAnswers
        },

        resetUserScore: function() {
            this.userScore = 0
        },
    },
})
