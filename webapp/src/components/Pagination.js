import React from 'react';
import './Pagination.css';

export default function (props) {
    const disabledPreBtn = props.current === 1;
    const disabledNextBtn = props.current === props.total;
    return (        
        <ul className="my-pager">
            <li 
                className={disabledPreBtn ? 'disabled' : ''} 
                onClick={() => disabledPreBtn || props.preClick()}>
                previous
            </li>
            <li>{props.current + '/' + props.total}</li>
            <li 
                className={disabledNextBtn ? 'disabled' : ''} 
                onClick={() => disabledNextBtn || props.nextClick()}>
                next
            </li>
        </ul>
    );
}