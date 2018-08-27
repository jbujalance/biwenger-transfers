class PositionDecorator {
    constructor() {
    }

    /**
     * Sets the same position to the users with the same number of points.
     * @param {Array[Object]} pData the array of objects to decorate
     */
    decorate(pData) {
        for(let i = 1; i < pData.length; i++) {
            if (pData[i].points == pData[i-1].points) {
                pData[i].position = pData[i-1].position;
            }
        }
    }
}

module.exports = PositionDecorator;
