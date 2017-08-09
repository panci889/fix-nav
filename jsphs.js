function isNumber(val) {
    val = val + "";
    if (val.length < 1) return false;
    if (isNaN(val)) {
        return false;
    } else {
        return true;
    }
}
function trimAll(sString){while (sString.substring(0,1) == ' '){sString = sString.substring(1, sString.length);}while (sString.substring(sString.length-1, sString.length) == ' '){sString = sString.substring(0,sString.length-1);} return sString;}
function cleanNumberInput(inVal){
	var tempVal	= inVal+"";
	while ((tempVal.indexOf(" ")>-1)||(tempVal.indexOf("	")>-1)||(tempVal.indexOf(",")>-1)){
		tempVal = tempVal.replace(" ", "").replace("	", "").replace(",", "");
	}
	return tempVal;
}
function gnumberFormat(valToBeFormated){
	var gniTotalDigits = 12;
	var gniPareSize = 12;
	var valStr = "" + valToBeFormated;
	if (valStr.indexOf("N")>=0 || (valToBeFormated == 2*valToBeFormated && valToBeFormated == 1+valToBeFormated)) return "Error ";
	var i = valStr.indexOf("e")
	if (i>=0){
		var expStr = valStr.substring(i+1,valStr.length);
		if (i>11) i=11;  // max 11 digits
		valStr = valStr.substring(0,i);
		if (valStr.indexOf(".")<0){
			valStr += ".";
		}else{
			// remove trailing zeros
			j = valStr.length-1;
			while (j>=0 && valStr.charAt(j)=="0") --j;
			valStr = valStr.substring(0,j+1);
		}
		valStr += "E" + expStr;
	}else{
		var valNeg = false;
		if (valToBeFormated < 0){
			valToBeFormated = -valToBeFormated;
			valNeg = true;
		}
		var valInt = Math.floor(valToBeFormated);
		var valFrac = valToBeFormated - valInt;
		var prec = gniTotalDigits - (""+valInt).length - 1;	// how many digits available after period

		var mult = " 1000000000000000000".substring(1,prec+2);
		if ((mult=="")||(mult==" ")){
			mult = 1;
		}else{
			mult = parseInt(mult);
		}
		var frac = Math.floor(valFrac * mult + 0.5);
		valInt = Math.floor(Math.floor(valToBeFormated * mult + .5) / mult);
		if (valNeg)
			valStr = "-" + valInt;
		else
			valStr = "" + valInt;
		var fracStr = "00000000000000"+frac;
		fracStr = fracStr.substring(fracStr.length-prec, fracStr.length);
		i = fracStr.length-1;

		// remove trailing zeros unless fixed during entry.
		while (i>=0 && fracStr.charAt(i)=="0") --i;
		fracStr = fracStr.substring(0,i+1);
		if (i>=0) valStr += "." + fracStr;
	}
	return valStr;
}
function ucParseSelectValue(inStr){
	var tempArray = inStr.split("[");
	var ucOutArray = [];
	ucOutArray.push(trimAll(tempArray[0]));
	ucOutArray.push(trimAll(tempArray[1].replace("]","")));
	if (tempArray.length>2){
		ucOutArray.push(trimAll(tempArray[2].replace("]","")));
	}
	return ucOutArray;
}
function ucCalculateResultNumOnly(inVal, inFrom, inTo){
	var tempResult = 0;
	var tempInVal = inVal;
	var tempInFrom = inFrom+"";
	var tempInTo = inTo+"";
	if ((tempInFrom.indexOf(":")>0)||(tempInTo.indexOf(":")>0)){
		tempArrayFrom = tempInFrom.split(":");
		tempArrayTo = tempInTo.split(":");
		if ((tempArrayFrom.length==3)||(tempArrayTo.length==3)){
			// Temperature
			eval("tempResult = (("+inVal+"-("+tempArrayFrom[2]+"))/(("+tempArrayFrom[1]+")-("+tempArrayFrom[2]+")))*(("+tempArrayTo[1]+")-("+tempArrayTo[2]+"))+(" + tempArrayTo[2] + ");");
		}else{
			if (("3"==tempArrayFrom[0])||("3"==tempArrayTo[0])){
				//Binary
				//alert("tempResult = (parseInt("+inVal+", "+tempArrayFrom[1]+")).toString("+tempArrayTo[1]+");");
				eval("tempResult = (parseInt(\""+inVal+"\", "+tempArrayFrom[1]+")).toString("+tempArrayTo[1]+");");
				return (tempResult+"").toUpperCase();
			}else{
				if (tempInFrom.indexOf(":")>0){
					if (tempInTo.indexOf(":")>0){
						eval("tempResult = " + tempInVal + "*" + tempArrayTo[1] + "/" + tempArrayFrom[1]);
					}else{
						eval("tempResult = 1/" + tempInVal + "*" + tempArrayFrom[1] + "*" + tempInTo);
					}
				}else{
					eval("tempResult = 1/" + tempInVal + "*" + tempInFrom + "*" + tempArrayTo[1]);
				}
			}
		}
	}else{
		eval("tempResult = " + tempInVal + "*" + tempInTo + "/" + tempInFrom);
	}
	return tempResult;
}
function ucCalculateResult(inVal, inFrom, inTo){
	return gnumberFormat(ucCalculateResultNumOnly(inVal, inFrom, inTo));
}
function ucUpdateResult(){
	var ucfromvalue = cleanNumberInput(document.getElementById("ucfrom").value);
	var ucfromunit = document.getElementById("ucfromunit");
	var uctounit = document.getElementById("uctounit");
	var ucfromunitvalue = ucfromunit.value;
	var uctounitvalue = uctounit.value;
	var uctounitID = 0;
	for (var i = 0; i < uctounit.options.length; i++) {
		if(uctounit.options[i].selected) uctounitID = i;
	}
	if (noValidation==1){
		ucfromvalue = trimAll((ucfromvalue+"").toUpperCase());

		var ucfromunitvalueArray = ucParseSelectValue(ucfromunitvalue);
		var uctounitvalueArray = ucParseSelectValue(uctounitvalue);
		tempBaseNum = parseInt((ucfromunitvalueArray[1]).substr(2).replace("]", ""));
		var tempTestStr = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		tempRegStr = "";
		if (tempBaseNum>10){
			tempRegStr = "^[0-9A-"+tempTestStr.substr(tempBaseNum,1)+"]+$";
		}else{
			tempRegStr = "^[0-"+tempTestStr.substr(tempBaseNum,1)+"]+$";
		}
		var reg = new RegExp(tempRegStr);
		if (reg.test(ucfromvalue)){
			var tempResult = 1;
			tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[1], uctounitvalueArray[1]);

			document.getElementById("ucto").value = tempResult;
			document.getElementById("ucresult").innerHTML = "<font color='red'><b>Result:</b></font> " + ucfromvalue + " " + ucfromunitvalueArray[0] + " = " + tempResult + " " + uctounitvalueArray[0] + "";
			document.getElementById("ucresult").style.color = "black";
			document.getElementById("ucresult").style.border = "2px solid #406b04";

			for (var i = 0; i < uctounit.options.length; i++) {
				var tempArray = ucParseSelectValue(uctounit.options[i].value);
				var tempVal = "";
				var tempResult = 0;
				tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[1], tempArray[1]);
				tempVal = tempArray[0] + " (" + tempResult + ")";
				uctounit.options[i] = new Option(tempVal,uctounit.options[i].value);
				if (uctounitID==i){
					uctounit.options[i].selected = true;
				}
			}
		}else{
			if (ucfromvalue.length>0){
				document.getElementById("ucresult").innerHTML = "Please provide a valid number!";
				document.getElementById("ucresult").style.color = "red";
				document.getElementById("ucresult").style.border = "2px solid #406b04";
			}else{
				document.getElementById("ucresult").innerHTML = "";
				document.getElementById("ucresult").style.border = "2px solid #ffffff";
			}
			document.getElementById("ucto").value = "";
			for (var i = 0; i < uctounit.options.length; i++) {
				var tempArray = ucParseSelectValue(uctounit.options[i].value);
				var tempVal = "";
				if (tempArray.length>2){
					tempVal = tempArray[0] + " [" + tempArray[1] + "]";
				}else{
					tempVal = tempArray[0];
				}
				uctounit.options[i] = new Option(tempVal,uctounit.options[i].value);
				if (uctounitID==i){
					uctounit.options[i].selected = true;
				}
			}
		}
	}else{
		if (!isNumber(ucfromvalue)){
			if (ucfromvalue.length>0){
				document.getElementById("ucresult").innerHTML = "Please provide a valid number!";
				document.getElementById("ucresult").style.color = "red";
				document.getElementById("ucresult").style.border = "2px solid #406b04";
			}else{
				document.getElementById("ucresult").innerHTML = "";
				document.getElementById("ucresult").style.border = "2px solid #ffffff";
			}
			document.getElementById("ucto").value = "";
			for (var i = 0; i < uctounit.options.length; i++) {
				var tempArray = ucParseSelectValue(uctounit.options[i].value);
				var tempVal = "";
				if (tempArray.length>2){
					tempVal = tempArray[0] + " [" + tempArray[1] + "]";
				}else{
					tempVal = tempArray[0];
				}
				uctounit.options[i] = new Option(tempVal,uctounit.options[i].value);
				if (uctounitID==i){
					uctounit.options[i].selected = true;
				}
			}
		}else{
			var ucfromunitvalueArray = ucParseSelectValue(ucfromunitvalue);
			var uctounitvalueArray = ucParseSelectValue(uctounitvalue);
			var tempResult = 1;
			if (ucfromunitvalueArray.length>2){
				if (uctounitvalueArray.length>2){
					tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[2], uctounitvalueArray[2]);
				}else{
					tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[2], uctounitvalueArray[1]);
				}
			}else{
				if (uctounitvalueArray.length>2){
					tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[1], uctounitvalueArray[2]);
				}else{
					tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[1], uctounitvalueArray[1]);
				}
			}
			document.getElementById("ucto").value = tempResult;
			document.getElementById("ucresult").innerHTML = "<font color='red'><b>Result:</b></font> " + ucfromvalue + " " + ucfromunitvalueArray[0] + " = " + tempResult + " " + uctounitvalueArray[0] + "";
			document.getElementById("ucresult").style.color = "black";
			document.getElementById("ucresult").style.border = "2px solid #406b04";

			for (var i = 0; i < uctounit.options.length; i++) {
				var tempArray = ucParseSelectValue(uctounit.options[i].value);
				var tempVal = "";
				var tempResult = 0;
				if (tempArray.length>2){
					if (ucfromunitvalueArray.length>2){
						tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[2], tempArray[2]);
					}else{
						tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[1], tempArray[2]);
					}
					tempVal = tempArray[0] + " [" + tempArray[1] + "] (" + tempResult + ")";
				}else{
					if (ucfromunitvalueArray.length>2){
						tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[2], tempArray[1]);
					}else{
						tempResult = ucCalculateResult(ucfromvalue, ucfromunitvalueArray[1], tempArray[1]);
					}
					tempVal = tempArray[0] + " (" + tempResult + ")";
				}
				uctounit.options[i] = new Option(tempVal,uctounit.options[i].value);
				if (uctounitID==i){
					uctounit.options[i].selected = true;
				}
			}
		}
	}
}

function convertFIToFra(inRSNum, inRSUnit){
	var totalInch = inRSNum;
	if (inRSUnit=='foot') totalInch = inRSNum * 12;
	var totalFeet = Math.floor(totalInch/12);
	var subInch = Math.floor(totalInch - (totalFeet*12));
	var inchDigit = totalInch - Math.floor(totalInch);
	totalInch = Math.floor(totalInch);
	var inchFracTop = Math.round(inchDigit*64);
	var inchFracBottom = 64;
	if (inchFracTop==64){
		totalInch = totalInch + 1;
		subInch = subInch + 1;
		if (subInch==12){
			subInch = 0;
			totalFeet = totalFeet + 1;
		}
		inchFracTop = 0;
	}else{
		if ((inchFracTop%32)==0){
			inchFracTop = inchFracTop/32;
			inchFracBottom = 2;
		}else if ((inchFracTop%16)==0){
			inchFracTop = inchFracTop/16;
			inchFracBottom = 4;
		}else if ((inchFracTop%8)==0){
			inchFracTop = inchFracTop/8;
			inchFracBottom = 8;
		}else if ((inchFracTop%4)==0){
			inchFracTop = inchFracTop/4;
			inchFracBottom = 16;
		}else if ((inchFracTop%2)==0){
			inchFracTop = inchFracTop/2;
			inchFracBottom = 32;
		}
	}
	if ((totalInch+inchFracTop)<1) return "";
	var finalResult = "<br>OR<br>";
	if (totalFeet>0){
		if (totalFeet>1){
			finalResult += totalFeet + " feet ";
		}else{
			finalResult += totalFeet + " foot ";
		}
		if (subInch>0){
			if (inchFracTop>0){
				finalResult += subInch + " <sup>" + inchFracTop + "</sup>/<sub>" + inchFracBottom + "</sub> inches ";
			}else{
				if (subInch>1){
					finalResult += subInch + " inches ";
				}else{
					finalResult += subInch + " inch ";
				}
			}
		}else{
			if (inchFracTop>0){
				finalResult += " <sup>" + inchFracTop + "</sup>/<sub>" + inchFracBottom + "</sub> inch ";
			}
		}
		finalResult += "<br>OR<br>";
	}
	if (totalInch>0){
		if (inchFracTop>0){
			finalResult += totalInch + " <sup>" + inchFracTop + "</sup>/<sub>" + inchFracBottom + "</sub> inches ";
		}else{
			if (totalInch>1){
				finalResult += totalInch + " inches ";
			}else{
				finalResult += totalInch + " inch ";
			}
		}
	}else{
		if (inchFracTop>0){
			finalResult += " <sup>" + inchFracTop + "</sup>/<sub>" + inchFracBottom + "</sub> inch ";
		}
	}
	return finalResult;
}

function ucDCUpdateResult(usdcType){
	processingType = usdcType;
	var ucfromvalue = cleanNumberInput(document.getElementById("ucfrom").value);
	var ucfromunit = document.getElementById("ucfromunit");
	var uctounit = document.getElementById("uctounit");
	var uctoid = document.getElementById("ucto");
	if (usdcType==1){
		ucfromvalue = cleanNumberInput(document.getElementById("ucto").value);
		ucfromunit = document.getElementById("uctounit");
		uctounit = document.getElementById("ucfromunit");
		uctoid = document.getElementById("ucfrom");

	}
	var ucfromunitvalue = ucfromunit.value;
	var uctounitvalue = uctounit.value;

	if (noValidation==1){
		ucfromvalue = trimAll((ucfromvalue+"").toUpperCase());

		var ucfromunitvalueArray = ucParseSelectValue(ucfromunitvalue);
		var uctounitvalueArray = ucParseSelectValue(uctounitvalue);
		tempBaseNum = parseInt((ucfromunitvalueArray[1]).substr(2).replace("]", ""));
		var tempTestStr = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		tempRegStr = "";
		if (tempBaseNum>10){
			tempRegStr = "^[0-9A-"+tempTestStr.substr(tempBaseNum,1)+"]+$";
		}else{
			tempRegStr = "^[0-"+tempTestStr.substr(tempBaseNum,1)+"]+$";
		}
		var reg = new RegExp(tempRegStr);
		if (reg.test(ucfromvalue)){
			var tempResult = 1;
			tempResult = ucCalculateResultNumOnly(ucfromvalue, ucfromunitvalueArray[1], uctounitvalueArray[1]);
			tempResult = gnumberFormat(tempResult);
			uctoid.value = tempResult;
			document.getElementById("ucresult").innerHTML = "<font color='red'><b>Result:</b></font> " + ucfromvalue + " " + ucfromunitvalueArray[0] + " = " + tempResult + " " + uctounitvalueArray[0] + "";
			document.getElementById("ucresult").style.color = "black";
			document.getElementById("ucresult").style.border = "2px solid #406b04";
		}else{
			if (ucfromvalue.length>0){
				document.getElementById("ucresult").innerHTML = "Please provide a valid number!";
				document.getElementById("ucresult").style.color = "red";
				document.getElementById("ucresult").style.border = "2px solid #406b04";
			}else{
				document.getElementById("ucresult").innerHTML = "";
				document.getElementById("ucresult").style.border = "2px solid #ffffff";
			}
			uctoid.value = "";
		}
	}else{
		if (!isNumber(ucfromvalue)){
			if (ucfromvalue.length>0){
				document.getElementById("ucresult").innerHTML = "Please provide a valid number!";
				document.getElementById("ucresult").style.color = "red";
				document.getElementById("ucresult").style.border = "2px solid #406b04";
			}else{
				document.getElementById("ucresult").innerHTML = "";
				document.getElementById("ucresult").style.border = "2px solid #ffffff";
			}
			uctoid.value = "";
		}else{
			var ucfromunitvalueArray = ucParseSelectValue(ucfromunitvalue);
			var uctounitvalueArray = ucParseSelectValue(uctounitvalue);
			var tempResult = 1;
			var tempResultMore = "";
			if (ucfromunitvalueArray.length>2){
				if (uctounitvalueArray.length>2){
					tempResult = ucCalculateResultNumOnly(ucfromvalue, ucfromunitvalueArray[2], uctounitvalueArray[2]);
					if ((uctounitvalueArray[0]=='foot')||(uctounitvalueArray[0]=='inch')){
						tempResultMore = convertFIToFra(tempResult, uctounitvalueArray[0]);
					}
				}else{
					tempResult = ucCalculateResultNumOnly(ucfromvalue, ucfromunitvalueArray[2], uctounitvalueArray[1]);
				}
			}else{
				if (uctounitvalueArray.length>2){
					tempResult = ucCalculateResultNumOnly(ucfromvalue, ucfromunitvalueArray[1], uctounitvalueArray[2]);
					if ((uctounitvalueArray[0]=='foot')||(uctounitvalueArray[0]=='inch')){
						tempResultMore = convertFIToFra(tempResult, uctounitvalueArray[0]);
					}
				}else{
					tempResult = ucCalculateResultNumOnly(ucfromvalue, ucfromunitvalueArray[1], uctounitvalueArray[1]);
				}
			}
			tempResult = gnumberFormat(tempResult);
			uctoid.value = tempResult;
			document.getElementById("ucresult").innerHTML = "<font color='red'><b><a href='http://www.transkerja.com'>Hasil:</a></b></font> " + ucfromvalue + " " + ucfromunitvalueArray[0] + " = " + tempResult + " " + uctounitvalueArray[0] + tempResultMore;
			document.getElementById("ucresult").style.color = "black";
			document.getElementById("ucresult").style.border = "2px solid #406b04";
		}
	}
}

// The following is for homepage
function gObj(obj) {var theObj;if(document.all){if(typeof obj=="string"){return document.all(obj);}else{return obj.style;}}if(document.getElementById){if(typeof obj=="string"){return document.getElementById(obj);}else{return obj.style;}}return null;}
function popMenu(inval){
	htmlVal = "";
	for (i = 0; i < allA.length; i++) {
		if (inval == allA[i][0][0]){
			htmlVal = htmlVal + "<li id='menuon'><a href='javascript:popMenu(\"" + allA[i][0][0] + "\");showSel(" + allA[i][0][1] + ");'>" + allA[i][0][0] + "</a></li> ";
		}else{
			htmlVal = htmlVal + "<li><a href='javascript:popMenu(\"" + allA[i][0][0] + "\");showSel(" + allA[i][0][1] + ");'>" + allA[i][0][0] + "</a></li> ";
		}
	}
	htmlVal = "<ul>" + htmlVal + "</ul>";
	gObj("menu").innerHTML = htmlVal;
}

function popMenuSmall(inval){
	tA[0] = new Array("Temp","tA");
	htmlVal = "";
	for (i = 0; i < allA.length; i++) {

		if (inval == allA[i][0][0]){
			htmlVal = htmlVal + "<li id='menuon'><a href='javascript:popMenuSmall(\"" + allA[i][0][0] + "\");showSel(" + allA[i][0][1] + ");'>" + allA[i][0][0] + "</a></li> ";
		}else{
			htmlVal = htmlVal + "<li><a href='javascript:popMenuSmall(\"" + allA[i][0][0] + "\");showSel(" + allA[i][0][1] + ");'>" + allA[i][0][0] + "</a></li> ";
		}
	}
	htmlVal = "<ul>" + htmlVal + "</ul>";
	gObj("menu").innerHTML = htmlVal;
}


var lA = new Array();
lA[0] = new Array("Length","lA");
lA[1] = new Array("Meter","iv","iv");
lA[2] = new Array("Kilometer","iv*1000","iv/1000");
lA[3] = new Array("Centimeter","iv*0.01","iv/0.01");
lA[4] = new Array("Millimeter","iv*0.001","iv/0.001");
lA[5] = new Array("Micrometer","iv*0.000001","iv/0.000001");
lA[6] = new Array("Nanometer","iv*0.000000001","iv/0.000000001");
lA[7] = new Array("Mile","iv*1609.35","iv/1609.35");
lA[8] = new Array("Yard","iv*0.9144","iv/0.9144");
lA[9] = new Array("Foot","iv*0.3048","iv/0.3048");
lA[10] = new Array("Inch","iv*0.0254","iv/0.0254");
lA[11] = new Array("Light Year","iv*9.46066e+15","iv/9.46066e+15");

var tA = new Array();
tA[0] = new Array("Temperature","tA");
tA[1] = new Array("Celsius","iv","iv");
tA[2] = new Array("Kelvin", "iv - 273.15", "iv + 273.15");
tA[3] = new Array("Fahrenheit", "5/9*(iv-32)", "9/5*iv + 32");

var aA = new Array();
aA[0] = new Array("Area","aA");
aA[1] = new Array("Square Meter","iv","iv");
aA[2] = new Array("Square Kilometer", "iv*1000000", "iv/1000000");
aA[3] = new Array("Square Centimeter", "iv*0.0001", "iv/0.0001");
aA[4] = new Array("Square Millimeter", "iv*0.000001", "iv/0.000001");
aA[5] = new Array("Square Micrometer", "iv*0.000000000001", "iv/0.000000000001");
aA[6] = new Array("Hectare", "iv*10000", "iv/10000");
aA[7] = new Array("Square Mile", "iv*2589990", "iv/2589990");
aA[8] = new Array("Square Yard", "iv*0.83612736", "iv/0.83612736");
aA[9] = new Array("Square Foot", "iv*0.09290304", "iv/0.09290304");
aA[10] = new Array("Square Inch", "iv*0.000645160", "iv/0.000645160");
aA[11] = new Array("Acre", "iv*4046.8564224", "iv/4046.8564224");

var vA = new Array();
vA[0] = new Array("Volume","vA");
vA[1] = new Array("Cubic Meter","iv","iv");
vA[2] = new Array("Cubic Kilometer", "iv*1000000000", "iv/1000000000");
vA[3] = new Array("Cubic Centimeter", "iv*0.000001", "iv/0.000001");
vA[4] = new Array("Cubic Millimeter", "iv*1.0e-9", "iv/1.0e-9");
vA[5] = new Array("Liter", "iv*0.001", "iv/0.001");
vA[6] = new Array("Milliliter", "iv*0.000001", "iv/0.000001");
vA[7] = new Array("US Gallon", "iv*0.00378541", "iv/0.00378541");
vA[8] = new Array("US Quart", "iv*0.0009463525", "iv/0.0009463525");
vA[9] = new Array("US Pint", "iv*0.00047317625", "iv/0.00047317625");
vA[10] = new Array("US Cup", "iv*0.000236588125", "iv/0.000236588125");
vA[11] = new Array("US Fluid Ounce", "iv*0.000029573515625", "iv/0.000029573515625");
vA[12] = new Array("US Table Spoon", "iv*0.0000147867578125", "iv/0.0000147867578125");
vA[13] = new Array("US Tea Spoon", "iv*4.9289192708333333333333333333333e-6", "iv/4.9289192708333333333333333333333e-6");
vA[14] = new Array("Imperial Gallon", "iv*0.00454609", "iv/0.00454609");
vA[15] = new Array("Imperial Quart", "iv*0.0011365225", "iv/0.0011365225");
vA[16] = new Array("Imperial Pint", "iv*0.00056826125", "iv/0.00056826125");
vA[17] = new Array("Imperial Fluid Ounce", "iv*0.0000284130625", "iv/0.0000284130625");
vA[18] = new Array("Imperial Table Spoon", "iv*0.0000177581640625", "iv/0.0000177581640625");
vA[19] = new Array("Imperial Tea Spoon", "iv*5.9193880208333333333333333333333e-6", "iv/5.9193880208333333333333333333333e-6");
vA[20] = new Array("Cubic Mile", "iv*4.16818e+9", "iv/4.16818e+9");
vA[21] = new Array("Cubic Yard", "iv*0.764554857984", "iv/0.764554857984");
vA[22] = new Array("Cubic Foot", "iv*0.028316846592", "iv/0.028316846592");
vA[23] = new Array("Cubic Inch", "iv*0.000016387064", "iv/0.000016387064");

var wA = new Array();
wA[0] = new Array("Weight","wA");
wA[1] = new Array("Kilogram","iv","iv");
wA[2] = new Array("Gram", "iv*0.001", "iv/0.001");
wA[3] = new Array("Milligram", "iv*0.000001", "iv/0.000001");
wA[4] = new Array("Metric Ton", "iv*1000", "iv/1000");
wA[5] = new Array("Long Ton", "iv*1016.04608", "iv/1016.04608");
wA[6] = new Array("Short Ton", "iv*907.184", "iv/907.184");
wA[7] = new Array("Pound", "iv*0.453592", "iv/0.453592");
wA[8] = new Array("Ounce", "iv*0.0283495", "iv/0.0283495");
wA[9] = new Array("Carrat", "iv*0.0002", "iv/0.0002");
wA[10] = new Array("Atomic Mass Unit", "iv*1.6605401999104288e-27", "iv/1.6605401999104288e-27");

var mA = new Array();
mA[0] = new Array("Time","mA");
mA[1] = new Array("Second","iv","iv");
mA[2] = new Array("Millisecond", "iv*0.001", "iv/0.001");
mA[3] = new Array("Microsecond", "iv*0.000001", "iv/0.000001");
mA[4] = new Array("Nanosecond", "iv*0.000000001", "iv/0.000000001");
mA[5] = new Array("Picosecond", "iv*0.000000000001", "iv/0.000000000001");
mA[6] = new Array("Minute", "iv*60", "iv/60");
mA[7] = new Array("Hour", "iv*3600", "iv/3600");
mA[8] = new Array("Day", "iv*86400", "iv/86400");
mA[9] = new Array("Week", "iv*604800", "iv/604800");
mA[10] = new Array("Month", "iv*2629800", "iv/2629800");
mA[11] = new Array("Year", "iv*31557600", "iv/31557600");

allA = new Array(lA,tA,aA,vA,wA,mA);

function isNum(sText){
	var ValidChars = "0123456789.-";
	var Char;
	if (sText.length < 1) return false;
	for (i = 0; i < sText.length; i++) {
		Char = sText.charAt(i);
		if (ValidChars.indexOf(Char) == -1) return false;
	}
	return true;
}

function showSel(aName){
	document.calForm.calFrom.length = 0;
	document.calForm.calTo.length = 0;
	for(i=1; i<aName.length; i++){
		document.calForm.calFrom.options[(i-1)] = new Option(aName[i][0],i);
		document.calForm.calTo.options[(i-1)] = new Option(aName[i][0],i);
	}
	document.calForm.calFrom.options[0].selected = true;
	document.calForm.calTo.options[1].selected = true;
	document.calForm.toVal.value = "";
	currentAName = aName;
	calcul();
}

function calVal(id, iv){
	eval("rv = (" + currentAName[id][2] + ");");
	return gnumberFormat(rv);
}
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('G H(){d=6.7.I;3=6.7.t;4=J(6.7.4.e);f=0;j=0;n="";u="";g=0;k(v i=0;i<d.2.8;i++){5(d.2[i].l){f=d.2[i].e;n=d.2[i].w}}k(v i=0;i<3.2.8;i++){5(3.2[i].l){j=3.2[i].e;u=3.2[i].w}}5((f>0)&&(x(4))){K=L(4);g=0;M("g = "+9[f][1]+";");6.7.t.8=0;k(i=1;i<9.8;i++){h=y(i,g);3.2[(i-1)]=z A(9[i][0]+" ("+h+")",i);5(j==i){3.2[(i-1)].l=B;6.7.C.e=h;a("c").o.p="q r #D";a("c").s="<m E=\'F\'><b>N:</b></m> "+4+" "+n+" = "+h+" "+9[i][0]}}}5((!(x(4)))||(f<1)){k(i=1;i<9.8;i++){h=y(i,g);3.2[(i-1)]=z A(9[i][0],i);5(j==i){3.2[(i-1)].l=B;6.7.C.e="";a("c").o.p="q r #O";a("c").s=""}}5((4+"").8>0){a("c").o.p="q r #D";a("c").s="<m E=\'F\'>P Q R S!</m>"}}}',55,55,'||options|selectTo|fromVal|if|document|calForm|length|currentAName|gObj||calResults|selectFrom|value|selectFromID|stdval|tempVal||selectToID|for|selected|font|selectFromVal|style|border|2px|solid|innerHTML|calTo|selectToVal|var|text|isNumber|calVal|new|Option|true|toVal|406b04|color|red|function|calcul|calFrom|cleanNumberInput|iv|parseFloat|eval|Result|fff|Berikan|nomor|yang|valid'.split('|'),0,{}))
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('D E(){F.G("<j>H k\\/s I l\\/s <\\/j><m><c 6=\\"J\\"><n d=\\"o\\" K=\\"5\\"><7><2 4=\\"e\\" d=\\"p\\">L:<\\/2>		<2><8 9=\\"h\\" f=\\"q\\" 4=\\"r\\" 6=\\"q\\" t=\\"i(0);\\"><\\/2><2 4=\\"e\\"><b>k\\/s<\\/b><\\/2><\\/7><7><2 4=\\"e\\" d=\\"p\\">M:<\\/2>		<2><8 9=\\"h\\" f=\\"u\\" 4=\\"r\\" 6=\\"u\\" t=\\"i(1);\\"><\\/2><2 4=\\"e\\"><b>l\\/s<\\/b><\\/2><\\/7><7><2 N=\\"3\\" d=\\"o\\"><c 6=\\"O\\" 4=\\"Q\\"><\\/c><8 9=\\"v\\" f=\\"w\\" 6=\\"w\\" g=\\"R [P] [1.x-15]\\"><8 9=\\"v\\" f=\\"y\\" 6=\\"y\\" g=\\"S [T] [1.x-12]\\">			<8 9=\\"U\\" g=\\"V\\" 4=\\"z\\" W=\\"i(X);Y Z;\\"> &10;<8 9=\\"11\\" g=\\"13\\" 4=\\"z\\"><\\/2><\\/7><\\/n><a 14=\\"16:\\/\\/A.B.C\\" 17=\\"18\\" 19=\\"1a-1b:1c%;h-1d: 1e;\\">A.B.C<\\/a><\\/c><\\/m>")}',62,77,'||td||class||id|tr|input|type|||div|align|bigtext|name|value|text|ucDCUpdateResult|h1|PH|TH|form|table|center|right|ucfrom|ucdcinput||onKeyUp|ucto|hidden|ucfromunit|0E|uctounit|ucdcsubmit|www|transkerja|com|function|wHTMLJSTransKerjaCom|document|write|Konversi|ke|undctable|cellpadding|Dari|Ke|colspan|ucresult||ucresulttext|peta|tera||submit|Submit|onclick|processingType|return|false|nbsp|reset||Clear|href||http|target|_blank|style|font|size|60|decoration|none'.split('|'),0,{}))
