function setDefault(key, value) {if (!localStorage[key]) localStorage[key] = value;};

function setDefaults() {
		
	// Blackboard Homepage
	setDefault("autoLogin", "false");
	setDefault("autoLoginUser", "");
	setDefault("autoLoginPass", "");
	setDefault("loginCleanup", "true");
	
	// Course Homepage
	setDefault("mainOneColumn", "false");
	setDefault("realOneColumn", "false");
	
	var hiddenSubjects = new Array();
	setDefault("hiddenSubjects", JSON.stringify(hiddenSubjects));
	
	var hiddenModules = new Array();
	setDefault("hiddenModules", JSON.stringify(hiddenModules));
	
	// Header Options
	setDefault("headerUseToolbar", "true");
	setDefault("headerShowWebmail", "true");
	setDefault("headerShowLibrary", "true");
	setDefault("headerShowAllocate", "true");
	setDefault("headerShowMySwin", "false");
	
	// Sidebar Options
	setDefault("sidebarAddSubjectGrades", "true");
	setDefault("sidebarAddTools", "true");
	setDefault("sidebarRemoveSubtables", "true");
	setDefault("sidebarAlphaSort", "true");
	
	// Course Pages
	setDefault("useTransitions", "true");
	setDefault("removeHeaderImages", "true");
	setDefault("removeHeaderBanner", "true");	
	setDefault("substituteHeaderWithSubject", "true");
	setDefault("removeBreadcrumbs", "false");
	
	// Content Pages
	setDefault("contentToNewTab", "true");
	
	// Colour Customization
	setDefault("cEnable", "true");
	
	setDefault("cOne", "0");
	setDefault("cTwo", "-1");
	
	/*
	// - Course Page
	setDefault("cBg", "222222");
	setDefault("cInnerBorder", "999999");
	setDefault("cInnerBorderStyle", "solid");
	setDefault("cInnerBackground", "444444");
	setDefault("cActionBar", "666666");
	setDefault("cModuleHeader", "FF0000");
	setDefault("cModuleBorder", "777777");
	
	// - Course Page Sidebar	
	setDefault("cSidebarHeaderForecolour", "FFFFFFF");
	setDefault("cSidebarHeaderBackgroundGradStart", "464646");
	setDefault("cSidebarHeaderBackgroundGradMid", "787878");
	setDefault("cSidebarHeaderBackgroundGradEnd", "464646");
	setDefault("cSidebarHeaderShadowColour", "000000");
	setDefault("cSidebarHeaderShadowOpacity", "0.75");
	setDefault("cSidebarForecolour", "FFFFFF");
	setDefault("cSidebarBackgroundGradStart", "222222");
	setDefault("cSidebarBackgroundGradEnd", "222222");
	setDefault("cSidebarShadowColour", "000000");
	setDefault("cSidebarShadowOpacity", "0.75");
	*/
		
}

setDefaults();

// UserScript Link
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	switch(request.name) {
		
		case "getStorage":
			sendResponse({"preferences": localStorage});
			break;
			
		case "setAutoLogin":			
			localStorage['autoLogin'] = "true";
			localStorage['autoLoginUser'] = request.user;
			localStorage['autoLoginPass'] = request.pass;		
			sendResponse({});
			break;
			
		case "clearAutoLogin":
			localStorage.removeItem('autoLoginUser');
			localStorage.removeItem('autoLoginPass');	
			sendResponse({});	
			break;
			
		case "hideSubject":
		
			var subjects = JSON.parse(localStorage['hiddenSubjects']);
			subjects.push(request['subj']);

			localStorage['hiddenSubjects'] = JSON.stringify(subjects);
			
			sendResponse({});
			break;
			
		case "showSubjects":
		
			localStorage['hiddenSubjects'] = JSON.stringify(new Array());
			
			sendResponse({});
			break;
			
		case "hideModule":
		
			var modules= JSON.parse(localStorage['hiddenModules']);
			modules.push(request['module']);

			localStorage['hiddenModules'] = JSON.stringify(modules);
			
			sendResponse({});
			break;	
			
		case "showModules":
		
			localStorage['hiddenModules'] = JSON.stringify(new Array());
					
			sendResponse({});
			break;	
			
		case "setDefaults":
			setDefaults();
			sendResponse({});
			break;
			
	}
});