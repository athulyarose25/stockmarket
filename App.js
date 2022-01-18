import React, { Component } from 'react';
import './App.css';
import Stocks from "./components/Stocks";
import {Stock, stockSymbols, stockTypes} from "./models/Stock";
import Trades from "./components/Trades";
import {actionTypes, Trade} from "./models/Trade";

class App extends Component {
    state = {
        stocks: [],
        geometricMean: null,
        trades: [],
        newTrade: {
            stockSymbol: '',
            quantity: '',
            action: ''
        }
      
    }

    componentDidMount() {
        this.setState({stocks: this.initStocks()})
    }

    render() {
    
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Simple Stock Market</h1>
                </header>
                <h3>Stocks</h3>
                 <div>
                            
                    <Stocks stocks={this.state.stocks}
                            onPriceChange={(event, index) => this.stockPriceChangeHandler(event, index)}
                    />
                     <span>GBCE All Share Index: {this.state.geometricMean ? this.state.geometricMean.toFixed(2) : ' '}</span>
                    <div>
                        <button onClick={()=>{this.updateAllVWSPrices()}}>Update all VWS Prices</button>
                    </div>  
                    <div className="styles" >
                    <h3> New Trade</h3>
                    <div >
                        <span>Stock Symbol: </span>
                        <select
                            name='stockSymbol'
                            value={this.state.newTrade.stockSymbol}
                            onChange={this.inputChangeHandler}
                        >
                            <option></option>
                            <option>{stockSymbols.TEA}</option>
                            <option>{stockSymbols.POP}</option>
                            <option>{stockSymbols.ALE}</option>
                            <option>{stockSymbols.GIN}</option>
                            <option>{stockSymbols.JOE}</option>
                        </select>
                    </div>
                    <div >
                        <span>Quantity: </span>
                        <input
                            name='quantity'
                            type='number'
                             min="0"
                            value={this.state.newTrade.quantity}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div>
                     <input type="radio" value={actionTypes.BUY} checked={this.state.newTrade.action === actionTypes.BUY} onChange={this.inputChangeHandler} name='action' />Buy  
                     <input type="radio" value={actionTypes.SELL} checked={this.state.newTrade.action === actionTypes.SELL} onChange={this.inputChangeHandler} name='action' />Sell 
                     </div>
                     <button onClick={() => {this.createTradeHandler()}}>Create trade</button>
                </div>
                    <h3>Trades</h3>
                    <Trades trades={this.state.trades}/>
                </div>

            
            </div>
        );
    }
//Data
    initStocks = () => {
        return [
            new Stock(stockSymbols.TEA, stockTypes.common, null, null, 100),
            new Stock(stockSymbols.POP, stockTypes.common, 8, null, 100),
            new Stock(stockSymbols.ALE, stockTypes.common, 23, null, 60),
            new Stock(stockSymbols.GIN, stockTypes.preferred, 8, 2, 100),
            new Stock(stockSymbols.JOE, stockTypes.common, 13, null, 250)
        ];
    }
/* When the input price value change, stock parameters will update by passing  price value 
 to stock class constructor and calculate the DividendYield and P/E Ratio from the stock class and  return
 the new stock*/
/*Call the method for calculating the GBCE All Share Index using the geometric mean with the new stock*/
    stockPriceChangeHandler = (event, index) => {
        const newPriceValue = event.target.value;
        const oldStock = this.state.stocks[index];
        const updatedStock = new Stock(
            oldStock.symbol,
            oldStock.type,
            oldStock.lastDividend,
            oldStock.fixedDividend,
            oldStock.parValue,
            parseFloat(newPriceValue),
            oldStock.VWSPrice
        );
        const newStocks = [...this.state.stocks];
        newStocks[index] = updatedStock;
         const newGeometricMean = this.calculateGBCEAllShareIndex(newStocks);
        this.setState({stocks: newStocks, geometricMean: newGeometricMean});
     

        
    }
/* Takes event as parameter and changes state for newtrade with input values*/
    inputChangeHandler = event => {
        const {name, value} = event.target
        const newTrade = {...this.state.newTrade, [name]: value};
        this.setState({
            newTrade: newTrade
        }); 

     
    }
/*Record a trade with  stock symbol,quantity, buy or sell indicator,price 
and traded price .Update VWSPrice for the corresponding stock symbol in stock*/
    createTradeHandler = () => {
        if(this.isNewTradeComplete()) {
            const stock = this.state.stocks.filter(stock => stock.symbol === this.state.newTrade.stockSymbol)[0];
            if(stock.price > 0) {
             const trade = new Trade(
                    stock.symbol,
                    this.state.newTrade.quantity,
                    this.state.newTrade.action,
                    stock.price
                );
                this.updateStockVWSPrice(stock, trade);
                this.setState(prevState => ({trades: prevState.trades.concat(trade)}));
            } else {

                      window.alert("Missing price from selected stock for new trade form");
                }
        } else {
                     window.alert("New trade form is not complete");
        }

    }
/*New Trade values*/
    isNewTradeComplete = () => {
        const newTrade = this.state.newTrade;
        return (
            newTrade.quantity &&
            newTrade.action &&
            newTrade.stockSymbol
        );
    }
/* Update all Volume Weighted Stock Price based on trades in past 15 minutes*/
    updateAllVWSPrices = () => {
        const newStocks = [];
         for(let stock of this.state.stocks) {
            const trades = this.getLatestStockTrades(this.state.trades,stock.symbol);
            const newStock = new Stock(
                stock.symbol,
                stock.type,
                stock.lastDividend,
                stock.fixedDividend,
                stock.parValue,
                stock.price,
                stock.VWSPrice
            );
            newStock.calculateVWSPrice(trades);
            newStocks.push(newStock);
        }
        this.setState({stocks: newStocks});
    }
/*Calculate Volume Weighted Stock Price for the new trade */

    updateStockVWSPrice = (stock, trade) => {
        const updatedStock = new Stock(
            stock.symbol,
            stock.type,
            stock.lastDividend,
            stock.fixedDividend,
            stock.parValue,
            stock.price
        );

        const trades = this.getLatestStockTrades(this.state.trades.concat(trade),stock.symbol);
        updatedStock.calculateVWSPrice(trades);
         const newStocks = [...this.state.stocks];
        newStocks[newStocks.indexOf(stock)] = updatedStock;
        this.setState({stocks: newStocks});
    }

    
 /*Calculate the GBCE All Share Index using the geometric mean of prices for all stocks traded price*/

calculateGBCEAllShareIndex = (stocks) => {
       let stocksPrice = null;
      let numberOfTrades = 0;
      if(stocks && stocks.length > 0) {
         
            for(let x=0; x<stocks.length; x++) {
                 if (stocks[x].price) {
                     stocksPrice = stocksPrice ? stocksPrice *= stocks[x].price : stocks[x].price;
                     numberOfTrades++;
                    
                }
            }

        }

        return numberOfTrades > 0 ? Math.pow(stocksPrice, 1/numberOfTrades) : null;
    } 
 /*Calculate latest Trade based on trades in past 15 minutes*/
    getLatestStockTrades = (trades, stockSymbol) => {
        return trades.filter(trade =>
            trade.stockSymbol === stockSymbol &&
            this.getDiferenceInMinutes(trade.timestamp, new Date()) <= 15
             );


    }
/*Calculate difference in minutes*/
    getDiferenceInMinutes = (date1, date2) => {
         const diff = parseInt((date1.getTime() - date2.getTime()) /(1000 * 60) % 60);
          return Math.abs(Math.round(diff));
    }
}

export default App;
