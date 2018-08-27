class PaymentDecorator {
    constructor() {
        this.lastPositionsPayments = [0.25, 0.5, 0.75, 1];
    }

    /**
     * Computes and sets the penalizing payment for each player.
     * @param {Array[Object]} pData the standings to decorate with the penalization payment.
     */
    decorate(pData) {
        let paymentTable = this._buildPaymentsTable(pData.length);
        let paidUsers = 0;
        for (let i = pData.length - 1; i >= 0 && paidUsers < this.lastPositionsPayments.length; i--) {
            let j = i;
            while (i > 0 && pData[i].position == pData[i-1].position) i--;
            let count = j - i + 1;
            let money = 0;
            for (let k = i; k <= j; k++) money += paymentTable[k];
            money /= count;
            for (let k = i; k <= j; k++) pData[k].payment = money;
            paidUsers += count;
        }
    }

    _buildPaymentsTable(pLength) {
        let noPayments = new Array(pLength - this.lastPositionsPayments.length);
        noPayments.fill(0);
        return noPayments.concat(this.lastPositionsPayments);
    }
}

module.exports = PaymentDecorator;
