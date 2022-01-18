export class Stock {
    constructor(symbol, type, lastDividend, fixedDividend, parValue, price, VWSPrice) {
        this.symbol = symbol;
        this.type = type;
        this.lastDividend = lastDividend;
        this.fixedDividend = fixedDividend;
        this.parValue = parValue;
        this.VWSPrice = VWSPrice;
        if (price) {
            
            this.setPrice(price);
        }
    };
   
    setPrice = price => {
        this.price = price;
        /*Given any price as input, calculate the dividend yield*/
        this.calculateDividendYield();
         /*Given any price as input, calculate the P/E Ratio*/
        this.calculatePERatio();
    };
   /*Calculate VWS price based on the trade in past 15 minutes*/
   /*VWS price is calculated by adding up the price multiplied by the quantity of shares traded
    and then dividing by the total quantity of shares traded*/
    calculateVWSPrice = (trades) => {
        let VWSPriceDividend = 0;
        let VSWPriceDivisor = 0;
        for (let trade of trades) {
            VWSPriceDividend += trade.price * trade.quantity;
            VSWPriceDivisor += trade.quantity;
        }
        this.VWSPrice = VWSPriceDividend / VSWPriceDivisor;
       
    }

/* Calculate Dividend yield method.For stock type common,dividend yield=Last dividend/price
   For stock type preferred,dividend yield=(Fixed dividend * parvalue)/price*/
    calculateDividendYield = () => {
        if (this.type === stockTypes.common) {
            if (this.isNumber(this.lastDividend) && this.isHigherThanZero(this.price)) {
                this.dividendYield = this.lastDividend / this.price;
            }
            else {
                this.dividendYield = null;
            }
        } else if (this.type === stockTypes.preferred) {
            if(this.isNumber(this.fixedDividend) &&
                this.isNumber(this.parValue) &&
                this.isHigherThanZero(this.price)) {
                this.dividendYield = this.fixedDividend * this.parValue / this.price;
            }
            else {
                this.dividendYield = null;
            }
        }
    };
/*Calculate P/E Ratio method*/
/*P/E Ratio is calculated by price/dividendyield*/
    calculatePERatio = () => {
        if(this.isNumber(this.price) && this.isHigherThanZero(this.dividendYield)) {
            this.peRatio = this.price / this.dividendYield;
        }
    };
/*check the input type is a number */
    isNumber = (number) => {
        return number && typeof number === 'number';
    }
/*check the input type is greater than zero*/ 
    isHigherThanZero = (number) => {
        return this.isNumber(number) && number > 0;
    }
}
/*Stock symbol */
export const stockSymbols = Object.freeze({
    TEA: 'TEA',
    POP: 'POP',
    ALE: 'ALE',
    GIN: 'GIN',
    JOE: 'JOE'
});
/*Type*/
export const stockTypes = Object.freeze({
    common: 'Common',
    preferred: 'Preferred',
});