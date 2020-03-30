// import * as math from './math.js';
// import { sum } from './math.js';
import './app.css';
import nyancat from './nyancat.jpg';

document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = `
        <img src='${nyancat}'/>
    `
})

console.log(VERSION) // 'v.1.2.3'
console.log(PRODUCTION) // true
console.log(MAX_COUNT) // 999
console.log(api.domain) // 'http://dev.api.domain.com'

//console.log(math.sum(1, 2));