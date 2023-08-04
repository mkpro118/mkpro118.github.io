function add_bias(weighted, bias) {
    const result = Array.from({length: weighted.length})

    for (let i = 0; i < result.length; i++) {
        const inner = Array.from({length: weighted[i].length})
        for (let j = 0; j < inner.length; j++) {
            inner[j] = weighted[i][j] + bias[j]
        }
        result[i] = inner
    }

    return result
}


function matmul(matrixA, matrixB) {
    const numRowsA = matrixA.length
    const numColsA = matrixA[0].length
    const numRowsB = matrixB.length
    const numColsB = matrixB[0].length

    if (numColsA !== numRowsB) {
        throw new Error("Invalid matrices for multiplication: Incompatible dimensions.")
    }

    const result = new Array(numRowsA)
    for (let i = 0; i < numRowsA; i++) {
        result[i] = new Array(numColsB).fill(0)
    }

    for (let i = 0; i < numRowsA; i++) {
        for (let j = 0; j < numColsB; j++) {
            for (let k = 0; k < numColsA; k++) {
                result[i][j] += matrixA[i][k] * matrixB[k][j]
            }
        }
    }

    return result
}

function tanh(arr) {
    return arr.map(Math.tanh)
}

function tanh2d(mat) {
    return mat.map(tanh)
}

function softmax(arr) {
    const max = Math.max(...arr)
    const exp = arr.map(x => Math.exp(x - max))
    const sum = exp.reduce((a, b) => a + b)
    return exp.map(x => x / sum)
}

function softmax2d(mat) {
    return mat.map(softmax)
}

function argmax(arr) {
    return arr.indexOf(Math.max(...arr))
}

function load_config() {
  return new Promise((resolve, reject) => {
    fetch('https://raw.githubusercontent.com/mkpro118/CS540/main/P6/Saved%20Models/Model%202.json')
      .then(data => data.json())
      .then(json => resolve(json))
      .catch(err => reject(err))
  })
}

async function create_layers() {
    config = await load_config()

    dense1 = new Dense(config.layers.layer1.weights, config.layers.layer1.bias[0], tanh2d)
    dense2 = new Dense(config.layers.layer2.weights, config.layers.layer2.bias[0], tanh2d)
    dense3 = new Dense(config.layers.layer3.weights, config.layers.layer3.bias[0], softmax2d)

    return [dense1, dense2, dense3]
}

class Dense {
    constructor(weights, biases, activation) {
        this.weights = weights
        this.biases = biases
        this.activation = activation
    }

    forward(X) {
        return this.activation(add_bias(matmul(X, this.weights), this.biases))
    }
}

class Sequential {
    constructor(layers) {
        this.layers = layers
        this.labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }

    predict(X) {
        if (!Array.isArray(X[0])) {
            X = [X]
        }
        for (const layer of this.layers) {
            X = layer.forward(X)
        }
        return this.labels.charAt(argmax(X[0]))
    }
}


async function get_model() {
    config = load_config()
    layers = await create_layers(config)
    model = new Sequential(layers)

    return model
}

const default_model = get_model()
