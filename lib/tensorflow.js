// packages
const tf = require('@tensorflow/tfjs')

console.log(tf)

// imports
// const picsClean = require('../images/clean_litter_boxes')
// const picsDirty = require('../images/dirty_litter_boxes')
//
// console.log(picsClean)

module.exports.trainModel = async () => {
    const model = tf.sequential()

    // config two-dimensional convolution layer
    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }))
    // config max pooling layer
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }))
    // repeat (modified) convolution layer on results from prev layer
    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 16,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'VarianceScaling'
    }))
    // repeat pooling layer
    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2]
    }))
    // flatten output from prev layer to vector
    model.add(tf.layers.flatten())
    // dense (fully connected) layer to perform final classification
    model.add(tf.layers.dense({
        units: 2,
        kernelInitializer: 'VarianceScaling',
        activation: 'softmax'
    }))

    // define the optimizer
    const LEARNING_RATE = 0.15
    const optimizer = tf.train.sgd(LEARNING_RATE)

    // compile the model
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    })

    // how many examples the model should "see" before making a parameter update
    const BATCH_SIZE = 1
    // how many batches to train the model for
    const TRAIN_BATCHES = 100
    const TEST_BATCH_SIZE = 1000
    const TEST_ITERATION_FREQUENCY = 1
    const data = {}

    for (let i = 0; i < TRAIN_BATCHES; i++) {
        const batch = data.nextTrainBatch(BATCH_SIZE)

        let testBatch
        let validationData
        // Every few batches test the accuracy of the mode.
        if (i % TEST_ITERATION_FREQUENCY === 0) {
            testBatch = data.nextTestBatch(TEST_BATCH_SIZE)
            validationData = [
                testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
            ]
        }

        // The entire dataset doesn't fit into memory so we call fit repeatedly with batches
        const history = await model.fit(
            batch.xs.reshape([BATCH_SIZE, 28, 28, 1]),
            batch.labels,
            {
                batchSize: BATCH_SIZE,
                validationData,
                epochs: 1
            }
        )

        const loss = history.history.loss[0]
        const accuracy = history.history.acc[0]

        // ... plotting code ...
        console.log(loss, accuracy)
    }


    // console.log(model)

    return {}
}
