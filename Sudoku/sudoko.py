# An amazing library which is the sole reason
# why this program has been written in python
import numpy as np
import random
import itertools

correct = list(range(1,10))

# Hard-coded the starting point because it's
# faster than anything else

# Step 1: Starting point
# A known solved 2d array for Sudoku
sudo_list = np.array([
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4],
    [3, 1, 2, 6, 4, 5, 9, 7, 8],
    [6, 4, 5, 9, 7, 8, 3, 1, 2],
    [9, 7, 8, 3, 1, 2, 6, 4, 5],
])


# A Random Shuffler function to dry up the code
def shuffle_list(start, end, transpose=False):
    # Need this to modify the global scoped sudo_list
    global sudo_list

    if transpose:
        # np coming in handy
        np.random.shuffle(np.transpose(sudo_list[:, start:end]))
    else:
        np.random.shuffle(sudo_list[start:end, :])


# A unique sudoku generator
def sudokuGenerator():
    # Multiple for blocks used to increase randomness
    # Throw-away variables used for the loops to increase speed

    # Needed to modify the global scoped sudo_list
    global sudo_list

    # Anywhere between 5 to 10 random shuffling
    # for every step

    # Shuffling happens in 8 different manners

    # Step 2: Shuffling Col 1-3
    for _ in range(random.randint(5, 10)):
        shuffle_list(0, 3, True)

    # Step 3: Shuffling Col 4-6
    for _ in range(random.randint(5, 10)):
        shuffle_list(3, 6, True)

    # Step 4: Shuffling Col 7-9
    for _ in range(random.randint(5, 10)):
        shuffle_list(6, 9, True)

    # Step 5: Shuffling Row 1-3
    for _ in range(random.randint(5, 10)):
        shuffle_list(0, 3)

    # Step 6: Shuffling Row 4-6
    for _ in range(random.randint(5, 10)):
        shuffle_list(3, 6)

    # Step 7: Shuffling Row 7-9
    for _ in range(random.randint(5, 10)):
        shuffle_list(6, 9)

    # Step 8: Shuffling rows in sets of 3 (3x9)
    rows = np.array_split(sudo_list, 3)
    for _ in range(random.randint(5, 10)):
        # not using numpy's random function because
        # rows is a list, not a np.ndarray
        random.shuffle(rows)
    sudo_list = np.vstack(rows)

    # Step 9: Shuffling columns in sets of 3 (9x3)
    cols = np.array_split(sudo_list.T, 3)
    for _ in range(random.randint(5, 10)):
        # not using numpy function because cols
        # is a list, not a np.ndarray
        random.shuffle(cols)
    sudo_list = np.vstack(cols)

    return sudo_list.tolist()


# Sudoku Solution Validator.
# Called if provided solution differs
# from generated sudoku.
def sudokuCheck(rows):
    # Creates list of all columns
    cols = [col for col in list(zip(*rows))]
    squares, mr, mc, ms = [], [], [], []
    # Creates list of all squares
    for i in range(0, 9, 3):
        for j in range(0, 9, 3):
          squares.append(list(itertools.chain(*[row[j:j+3] for row in rows[i:i+3]])))
    
    for number, row in enumerate(rows, 1):
        if not (correct == sorted(row)):
            mr.append(number)
    for number, col in enumerate(cols, 1):
        if not (correct == sorted(col)):
            mc.append(number)
    for number, square in enumerate(squares, 1):
        if not (correct == sorted(square)):
            ms.append(number)
    return {'rows': mr, 'cols': mc, 'squares': ms,}

if __name__ == '__main__':
    print(sudokuCheck(sudokuGenerator()))
