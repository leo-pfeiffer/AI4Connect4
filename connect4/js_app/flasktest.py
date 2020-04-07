from __future__ import print_function

import math
from flask import Flask, render_template, request

import os
import numpy as np

from lib.players import AlphaBeta

app = Flask(__name__)
app.secret_key = 's3cr3t'
app.debug = True
app._static_folder = os.path.abspath("templates/static/")

@app.route('/', methods=['GET'])
def index():
    title = 'Welcome to Teisendorf'
    return render_template('connect_html.html', title=title)


@app.route('/ai-action', methods=['GET', 'POST'])
def ai_action():

    # POST request
    if request.method == 'POST':
        print('Incoming..')
        gameBoard = request.get_json(force=True)['gameBoard']
        print(gameBoard)  # parse as JSON
        x = call_Alphabeta(gameBoard)

        # return jsonify(x), 200
        return str(x), 200


def gameBoard_to_matrix(gameBoard):
    gameBoard = {int(k): v for k, v in gameBoard.items()}
    gameBoard = [list(v.values()) for v in gameBoard.values()]

    mapping = {'free': 0, 'red': 1, 'yellow': 2}
    gameBoard = [[mapping[x] for x in col] for col in gameBoard]

    gameBoardMatrix = np.array(gameBoard).T[:-2]

    return gameBoardMatrix


def call_Alphabeta(gameBoard):
    board = gameBoard_to_matrix(gameBoard)
    AB = AlphaBeta(board=board, no=2, name='AlphaBeta', depth=2)
    selected_col = AB.selector(board, -math.inf, math.inf, True)
    return selected_col


def matrix_to_gameBoard(gameBoardMatrix):
    """
    Not currently needed, but maybe later.
    """
    gameBoardMatrix = np.array(gameBoardMatrix).T
    gameBoard = [x + [0, 0] for x in gameBoardMatrix.tolist()]
    mapping = {0: 'free', 1: 'red', 2: 'yellow'}
    gameBoard = [[mapping[x] for x in col] for col in gameBoard]
    gameBoard = {str(k1): {str(k2): v2 for k2, v2 in zip(range(9), v1)} for k1, v1 in zip(range(7), gameBoard)}

    return gameBoard    # return this to GET request


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
