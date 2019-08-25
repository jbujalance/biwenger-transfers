/**
 * Translates the global payments aggregation into an HTML table.
 * @param payments an array of user payment aggregations objects with the keys biwengerId, name and payment.
 * @returns A string representing an HTML table with two columns: the user name and its global payment.
 */
module.exports.paymentsToHtmlTable = function (payments) {
    return _buildTable(payments);
}

_buildRow = function (payment) {
    let html = '<tr>';
    html += `<td>${payment.name}</td>`;
    html += `<td>${payment.payment}€</td>`;
    html += '</tr>';
    return html;
}

_buildTableBody = function (payments) {
    let html = '<tbody>';
    payments.forEach(payment => {
        html += _buildRow(payment);
    });
    html += '</tbody>';
    return html;
}

_buildTableHeader = function() {
    let html = '<thead><tr>';
    html += '<th>Nombre</th>';
    html += '<th>Paga</th>';
    html += '</tr></thead>';
    return html;
}

_buildTable = function (payments) {
    let html = '<table>';
    html += _buildTableHeader();
    html += _buildTableBody(payments);
    html += '</table>';
    return html;
}

module.exports.buildDetailsFooter = function() {
    return '<p>More details at <a href="https://biwenger-companion-front.firebaseapp.com" target="_blank" rel="noopener">Biwenger Companion</a></p>';
}