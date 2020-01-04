const BiwengerClient = require('../rest/biwenger-client');

class BonusAdjuster {

    constructor() {
        this.restClient = new BiwengerClient();
    }

    adjustBonuses(pStandings) {
        let amounts = this._getAmountsToPost(pStandings);
        let reason = 'Biwenger Companion - Bonus adjustment';
        this.restClient.postBonus(reason, amounts)
            .then(res => console.log('Bonus have been adjusted'))
            .catch(err => console.error('Error while adjusting the bonus: ' + err));
    }

    _getAmountsToPost(pStandings) {
        let amounts = {};
        let toAdjust = this._getStandingsToAdjust(pStandings);
        for (let points in toAdjust) {
            let adjustment = this._getAdjustmentInPointsGroup(toAdjust[points]);
            amounts = {...amounts, ...adjustment};
        }
        return amounts;
    }

    _getStandingsToAdjust(pStandings) {
        let grouped = this._generatePointsBuckets(pStandings);
        return this._filterOutSingleStandingBuckets(grouped);
    }

    _generatePointsBuckets(pStandings) {
        let grouped = {};
        pStandings.forEach(standing => {
            if (!standing.bonus) {
                // If the bonus is not defined in the standing, it means that this user ended the round with negative money, and was not given any bonus.
                // Thus, these users should not be taken into account for the bonus adjustment 
                return;
            }
            let currentPoints = standing.points;
            if (currentPoints in grouped) {
                grouped[currentPoints].push(standing);
            } else {
                grouped[currentPoints] = [standing];
            }
        });
        return grouped;
    }

    _filterOutSingleStandingBuckets(pGrouped) {
        return Object.keys(pGrouped)
            .filter(points => pGrouped[points].length > 1)
            .reduce((filtered, points) => {
                filtered[points] = pGrouped[points];
                return filtered;
            }, {});
    }

    _getAdjustmentInPointsGroup(pGroup) {
        let adjustment = {};
        const avg = this._getPositionMeanBonusInGroup(pGroup);
        pGroup.forEach(standing => {
            adjustment[standing.biwengerUserId] = avg - standing.bonusReasons.bonusRoundPosition;
        });
        return adjustment;
    }

    _getPositionMeanBonusInGroup(pGroup) {
        let sum = pGroup.reduce((sum, standing) => sum + standing.bonusReasons.bonusRoundPosition, 0);
        return sum / pGroup.length;
    }
}

module.exports = BonusAdjuster;
