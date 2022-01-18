import React from 'react';
/*stocks table*/
const Stocks = (props) => {
    const sampleStocks = props.stocks ?
        props.stocks.map((stock, index) => (
            <tr key={index}>
                <td>{stock.symbol ? stock.symbol : ' '}</td>
                <td>{stock.type ? stock.type : ' '}</td>
                <td>{stock.lastDividend ? stock.lastDividend : ' '}</td>
                <td>{stock.fixedDividend ? stock.fixedDividend : ' '}</td>
                <td>{stock.parValue ? stock.parValue : ' '}</td>
                <td><input type='number' min="0" onChange={(event) => props.onPriceChange(event, index)}/></td>
                <td>{stock.dividendYield ? stock.dividendYield.toFixed(2) : ' '}</td>
                <td>{stock.peRatio ? stock.peRatio.toFixed(2) : ' '}</td>
                <td>{stock.VWSPrice ? stock.VWSPrice.toFixed(2) : ' '}</td>
            </tr>
        )): null;
    return (
        <table className='table'>
            <thead>
            <tr>
                <th>Stock Symbol</th>
                <th>Type</th>
                <th>Last Dividend</th>
                <th>Fixed Dividend</th>
                <th>Par Value</th>
                <th>Price</th>
                <th>Dividend Yield</th>
                <th>P/E Ratio</th>
                <th>Volume Weighted Stock Price</th>
            </tr>
            </thead>
            <tbody>
            {sampleStocks}
            </tbody>
        </table>
    );
}

export default Stocks;