
function ts2time (ts) {
    if (!ts) return;

    const time = new Date(parseInt(ts, 10));
    const y = time.getFullYear();
    const m = time.getMonth() + 1; // month start from 0
    const d = time.getDate();
    const h = time.getHours();
    const min = time.getMinutes();
    const s = time.getSeconds();
    
    return [y, m, d].join('/') + ' ' + [h, min, s].join(':');
}

function capitalize (input) {
    const str = input || '';
    return str && (str.charAt(0).toUpperCase() + str.slice(1));
}

export {
    ts2time,
    capitalize,
};