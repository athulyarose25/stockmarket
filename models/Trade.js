export class Trade {
    constructor(stockSymbol, quantity, action, price) {
        this.stockSymbol =  stockSymbol;
        this.quantity = quantity;
        this.action = action;
        this.price = price;
        this.timestamp = new Date();
    }
}
/*Trade action type*/
export const actionTypes = {
    BUY: 'Buy',
    SELL: 'Sell'
}