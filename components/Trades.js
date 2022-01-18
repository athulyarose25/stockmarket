import React from 'react';
/*Trades table*/
const Trades = (props) => {
    const trades = props.trades ? props.trades.map((trade,index) =>
            <tr key={index}>
                <td>{parseTimestamp(trade.timestamp)}</td>
                <td>{trade.stockSymbol}</td>
                <td>{trade.quantity}</td>
                <td>{trade.action}</td>
                <td>{trade.price}</td>
                <td>{trade.price * trade.quantity}</td>
            </tr>
        ): null;
    return (
        <table className='table'>
            <thead>
            <tr>
                <th>Date</th>
                <th>Stock Symbol</th>
                <th>Quantity</th>
                <th>Action</th>
                <th>Price</th>
                <th>Total Price</th>
            </tr>
            </thead>
            <tbody>
            {trades}
            </tbody>
        </table>
    );
};

const parseTimestamp = (timestamp) =>
    timestamp.toLocaleTimeString([],
        {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute:'2-digit'
        });

export default Trades;