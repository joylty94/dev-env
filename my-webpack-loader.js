module.exports = function myWebpackLoader(content) {
    // console.log('동작');
    return content.replace('console.log(', 'alert(')
}   