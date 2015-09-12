
var msgwindow = null;

function saveOptions() {

	$('#bbDusterOptions :input').each(function(i, e) {
		if (e.type == "checkbox")
			localStorage[e.id] = e.checked;
		if (e.type == "radio")
			if (e.checked) localStorage[e.name] = e.value;
		if (e.type == "text")
			localStorage[e.id] = e.value;
		if (e.type == "textarea")
			localStorage[e.id] = e.value;
		if (e.type == "select-one")
			localStorage[e.id] = e.value;
	});
				
	localStorage["cOne"] = $('#cOne').slider("value");
	localStorage["cTwo"] = $('#cTwo').slider("value");
	
}

function loadOptions() {

	$('#bbDusterOptions :input').each(function(i, e) {
		
		$(e).bind("change keypress", saveOptions);
														
		if (e.type == "checkbox") {
						
			if (localStorage[e.id]) {
			
				e.checked = (localStorage[e.id] == "true");
				
				if (e.checked) {
					$(e).removeClass("unchecked");
					$(e).addClass("checked");
				} else {
					$(e).removeClass("checked");
					$(e).addClass("unchecked");
				}						
			
			}								
								
		} else if (e.type == "radio") {
									
			if (e.value == localStorage[e.name]) {
				e.checked = true;
				$(e).removeClass("unselected");
				$(e).addClass("selected");
			}
		
		
		
		} else if (e.type == "text") {
										
			if ($(e).hasClass('color'))	{				
				if (localStorage[e.id]) 
					e.color.fromString(localStorage[e.id]);				
			
			} else {	
				e.value = (localStorage[e.id] ? localStorage[e.id] : "" );
			}
			
		} else if (e.type == "textarea") {
			
			e.value = (localStorage[e.id] ? localStorage[e.id] : "");
	
		} else if (e.type == "select-one") {
			
		
			$(e).val(localStorage[e.id]);
			
		}
				
		
	});
	
	// Hide Colour segment if customizations are turned off
	if (localStorage["cEnable"] == "false") {
		$('#colorCust').hide();			
	}
				
	setPageSample();
				
}


function loadAltUI() {
								
	$( "#cOne" ).slider({change: function() {setSamplePot('#cOne')}, value: localStorage["cOne"] ? localStorage["cOne"] : 0, animate: true, min: -1, max:361});
	$( "#cTwo" ).slider({change: function() {setSamplePot('#cTwo')}, value: localStorage["cTwo"] ? localStorage["cTwo"] : -1, animate: true, min: -1, max:361});
	
}

function setSamplePots() {
	
	setSamplePot("#cOne");
	setSamplePot("#cTwo");		
				
}

function setSamplePot(id) {
	
	var sliderVal = $(id).slider("value");
	
	localStorage[cutHex(id)] = sliderVal;
	
	var hslMin, hslMid, hslMax;
	
	if (sliderVal == -1) {
		hslMin = 'hsl(0, 0%, 0%)'; 
		hslMid = 'hsl(0, 0%, 50%)';
		hslMax = 'hsl(0, 0%, 100%)'; 
		$(id + '-Sample').css('background-color', hslMin);	
		//$(id + '-SampleGrad').css('background', '-webkit-linear-gradient(left, ' + hslMin + ' 0%, ' + hslMax + ' 100%)');
						
	} else if (sliderVal == 361) {
		hslMin = 'hsl(0, 0%, 0%)'; 
		hslMid = 'hsl(0, 0%, 50%)';
		hslMax = 'hsl(0, 0%, 100%)'; 
		$(id + '-Sample').css('background-color', hslMax);
		//$(id + '-SampleGrad').css('background', '-webkit-linear-gradient(left, ' + hslMin + ' 0%, ' + hslMax + ' 100%)');
							
	} else {
		hslMin = 'hsl(' + sliderVal + ', 100%, 0%)'; 
		hslMid = 'hsl(' + sliderVal + ', 100%, 50%)';
		hslMax = 'hsl(' + sliderVal + ', 100%, 100%)'; 
		
		$(id + '-Sample').css('background-color', hslMid);	
		//$(id + '-SampleGrad').css('background', '-webkit-linear-gradient(left, ' + hslMin + ' 0%, ' + hslMax + ' 100%)');

	}
				
}

function setPageSample() {
	
	$('#sample_frame').attr('src', 'http://blackboard.case.edu/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1&sample=true');
					
}

function autoLoginCheck() {
	
	var autoLoginCheck = $('#autoLogin');
	var password = $('#autoLoginPass');
	
	var user = $('#autoLoginUser');
	
	if (autoLoginCheck.attr('checked')) {
		
		$("#dialog-form").dialog('open');
		user.focus();
		
	} else if (! autoLoginCheck.attr('checked')) {
		
		// Auto Login Stopped, remove user and pass details from local storage
		localStorage.removeItem('autoLoginUser');
		localStorage.removeItem('autoLoginPass');
		//localStorage.removeItem('autoLoginPassUnicode');
		
		user.val('');
		password.val('');
		
	}			
	
}

function updateTips(t) {
	$('#validationTips')
		.text(t)
		.addClass('ui-state-highlight');
	setTimeout(function() {
		$('#validationTips').removeClass('ui-state-highlight', 1500);
	}, 500);
}

function checkLength(o,n,min,max) {

	if ( o.val().length < min ) {
		o.addClass('ui-state-error');
		updateTips("You need to enter something into the " + n + " field.");
		o.focus();
		return false;
	} else {
		return true;
	}

}

function autoLoginSetup() {
	
	var password = $('#autoLoginPass');
	var user = $('#autoLoginUser');
				
		$("#dialog-form").dialog({
			autoOpen: false,
			height: 350,
			width: 350,
			modal: true,
			buttons: {
				'Save': function() {
					
					var bValid = true;
					
					$('#dialog-form:input').removeClass('ui-state-error');

					bValid = bValid && checkLength(user, "Username", 1);
					bValid = bValid && checkLength(password, "Password", 1);
							
					if (bValid) {
						
						// Do storage
						localStorage['autoLoginUser'] = user.val();
						localStorage['autoLoginPass'] = base64_encode(password.val(), true); //encode
					//	localStorage['autoLoginPassUnicode'] = base64_encode(password.val(), true); //uni-encode
						
						$(this).dialog('close');
						
					} else {
						
					}
					
				},
				Cancel: function() {
					
					$('#autoLogin').attr('checked', false);

					$(this).dialog('close');
					
				}
			},
			close: function() {
				
				$("#dialog-form:input").val('').removeClass('ui-state-error');
				
			}
		});
	
}

function getVersion() {
	var version = 'NaN';
	var xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL('manifest.json'), false);
	xhr.send(null);
	var manifest = JSON.parse(xhr.responseText);
	return manifest.version;
}

function setWindow() {
				
	var currVersion = getVersion();
	var prevVersion = localStorage['version'];
	
	if (currVersion != prevVersion) {
		localStorage['version'] = currVersion;
	}				
	
	$("#version").html("Version " + localStorage['version']);

	loadAltUI();			
	loadOptions();			
	setSamplePots();								
	autoLoginSetup();
	
};

$(document).ready(function() {
	setWindow();
	
	$('#autoLogin').click(function() {
		autoLoginCheck();
	});
	
	$('#refresh_sample').click(function() {
		setPageSample();
	});
	
	$('#cEnable').change(function() {
		$('#colorCust').slideToggle(this.value);
	});

});

