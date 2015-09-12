
function getCookieExpiration() {

    var today = new Date();
    var expr = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return  expr.toGMTString();

}



function hexToRGB(hex, opacity) {
	hex = String(hex);
	
	return 'rgba(' +
		parseInt(hex.substring(0,2), 16) + ',' +
		parseInt(hex.substring(2,4), 16) + ',' +
		parseInt(hex.substring(4,6), 16) + ',' +
		opacity +
		')';

}

function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function hslaAdj(hue, adjLight, adjSat, alpha) {
	
	switch(hue) {
	
		case "-1": // Gray
			return " hsla(0, 0%, " + adjLight + "%, " + alpha + ") ";
			break;
	
		case "361": // Gray
			return " hsla(0, 0%, " + adjLight + "%, " + alpha + ") ";		
			break;
			
		default: // Hue'd
			return " hsla(" + hue + ", " + adjSat + "%, " + adjLight + "%, " + alpha + ") ";		
			break;	
		
	}	
	
}

function hslAdj(hue, adjLight, adjSat) {
	
	switch(hue) {
	
		case "-1": // Gray
			return " hsl(0, 0%, " + adjLight + "%) ";
			break;
	
		case "361": // Gray
			return " hsl(0, 0%, " + adjLight + "%) ";		
			break;
			
		default: // Hue'd
			return " hsl(" + hue + ", " + adjSat + "%, " + adjLight + "%) ";		
			break;	
		
	}
		
}

function alterColour(hex, adjLight) {
		
	var r = parseInt((cutHex(hex)).substring(0,2),16);
	var g = parseInt((cutHex(hex)).substring(2,4),16);
	var b = parseInt((cutHex(hex)).substring(4,6),16);
	
    r /= 255, g /= 255, b /= 255;
	
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
	
	h *= 3.6;
	h *= 100;
	s *= 100;
	
	l = adjLight;

 	return " hsl(" + h + "," + s + "%," + l + "%) ";

}

function utf8_encode ( argString ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n+1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

function base64_encode (data, unicode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
        
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

	if (unicode == "true") {
    	data = this.utf8_encode(data+'');
	}
    
    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
    
    enc = tmp_arr.join('');
    
    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}