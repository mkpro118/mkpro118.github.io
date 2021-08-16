import numpy as np
import random

sudo_list = np.array(\
[[1, 2, 3, 4, 5, 6, 7, 8, 9],
[4, 5, 6, 7, 8, 9, 1, 2, 3],
[7, 8, 9, 1, 2, 3, 4, 5, 6],
[2, 3, 1, 5, 6, 4, 8, 9, 7],
[5, 6, 4, 8, 9, 7, 2, 3, 1],
[8, 9, 7, 2, 3, 1, 5, 6, 4],
[3, 1, 2, 6, 4, 5, 9, 7, 8],
[6, 4, 5, 9, 7, 8, 3, 1, 2],
[9, 7, 8, 3, 1, 2, 6, 4, 5],])



def r(m,n,t=False):
    global sudo_list
    if t:
        np.random.shuffle(np.transpose(sudo_list[:, m:n]))
    else:
        np.random.shuffle(sudo_list[m:n, :])
        

def sudokuGenerator():
    global sudo_list
    # Step 3: Shuffling Col 1-3
    for i in range(random.randint(5, 10)):
        r(0,3,True)
    # Step 4: Shuffling Col 4-6
    for i in range(random.randint(5, 10)):
        r(3,6,True)
    # Step 5: Shuffling Col 7-9
    for i in range(random.randint(5, 10)):
        r(6,9,True)
    # Step 6: Shuffling Row 1-3
    for i in range(random.randint(5, 10)):
        r(0,3)
    # Step 7: Shuffling Row 4-6
    for i in range(random.randint(5, 10)):
        r(3,6)
    # Step 8: Shuffling Row 7-9
    for i in range(random.randint(5, 10)):
        r(6,9)
    # Step 9: Shuffling rows in sets of 3
    rows = np.array_split(sudo_list, 3)
    for i in range(random.randint(5, 10)):
        random.shuffle(rows)
    sudo_list = np.vstack(rows)
    # Step 10: Shuffling columns in sets of 3
    col = np.array_split(sudo_list.T, 3)
    for i in range(random.randint(5, 10)):
        random.shuffle(col)
    sudo_list = np.vstack(col)

    return sudo_list
