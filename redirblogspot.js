var str= window.location.href.toString(); if
((str.indexOf('.com/'))=='-1')
{ var str1=str.substring(str.lastIndexOf(".blogspot.")); if
(str1.indexOf('/')=='-1') { var str2=str1; }
else { var str2=str1.substring(0,str1.indexOf('/')+1); }
window.location.href
=window.location.href.toString().replace(str2,'.blogspot.com/ncr/');
}