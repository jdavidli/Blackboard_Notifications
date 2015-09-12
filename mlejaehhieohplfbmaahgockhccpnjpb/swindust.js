// /////////////////////////////////
// SwinDust by Shadow Productions
// swindust@shadowsplace.net
//
// Copyright © 2011
// /////////////////////////////////

chrome.extension.sendRequest(
{name: "getStorage"},
	function (result) {
					
		//console.log("SwinDust : Running for '" + document.URL + "'");
			
		var isSample = (document.URL.indexOf("sample=true") != -1);
		var isTopPage = (document.URL.indexOf("/webapps/portal/execute/topframe") != -1);
		var isFramePage = (document.URL.indexOf("/webapps/portal/frameset.jsp") != -1);
		
		SwinDust_preprocess(result.preferences, isSample, isTopPage, isFramePage);
		
		$(document).ready(function() {
			SwinDust_initialize(result.preferences, isSample, isTopPage, isFramePage);
		});
				
		//console.log("SwinDust : Ending for '" + document.URL + "'");			
						
	}
);


function SwinDust_initialize(p, isSample, isTopPage, isFramePage) {		
			
	try {
	
		SwinDust_processURL(p, isSample, isTopPage, isFramePage);
		
	} catch (e) {
		
		console.error("SwinDust : Critical Error : " + e.name + " : " + e.message);
		
	};
		
}


function SwinDust_preprocess(p, isSample, isTopPage, isFramePage) {
						
	if ((document.location.pathname == "/") || (document.URL.indexOf("/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_76_1") != -1)) {
		
		if (p['autoLogin'] == "true" && p['autoLoginUser'] && p['autoLoginPass']) {
			
		// Prevent the redirect
		window.stop();		
		
		// Clear the page
		$('html').html('');		
								
			$('html').html('<br /><div style="font-family: Arial; font-size: 16px; text-align: center;"><img src="' + chrome.extension.getURL("images/load.gif") + '" width="48" height="48" /><br /><br />Logging in... Please wait a moment!</div><br /><br /><div style="font-family: Arial; font-size: 14px; text-align: center;">You can disable this on the <a href="' + chrome.extension.getURL("options.html") + '">options page</a>.</div>');
		
			$('html').prepend('\
				<body>\
				<form id="loginForm" action="/webapps/login/" method="POST">\
					<input type="hidden" name="action" value="login" >\
					<input type="hidden" name="remote-user" value="" >\
					<input type="hidden" name="new_loc" value="" >\
					<input type="hidden" name="auth_type" value="" >\
					<input type="hidden" name="one_time_token" value="" >\
					<input type="hidden" name="user_id" value="' + p['autoLoginUser'] + '" >\
					<input value="' + p['autoLoginPass'] + '" name="encoded_pw" type="hidden" >\
					<input value="' + p['autoLoginPass'] + '" name="encoded_pw_unicode" type="hidden" >\
				</form>\
				</body>\
			');
				
			$('#loginForm').submit();
			
		}	
						
	} else if (isTopPage == false && isFramePage == false) {
	
		if (p['useTransitions'] == "true") {			
			
			$('html')
				.prepend($('<div id="loadingCover" style="z-index:10000; position: fixed; width: 100%; height: 100%;"></div>')
					//.append('<img src="' + chrome.extension.getURL("images/load.gif") + '" width="48" height="48" /><br /><br />Loading Content')
					.css('background', hslAdj(p['cOne'],20,100) + ' url("' + chrome.extension.getURL("bb_img/stripe.png") + '")')
				)	
			
		}
		
	}
	
}

function SwinDust_processURL(p, isSample, isTopPage, isFramePage) {
	
	if (p['useTransitions'] == "true") {		
		if (isTopPage == false && isFramePage == false)
			$('#content').hide();
	}
			
	if (document.location.pathname == "/") {
						
	} else if ((document.URL.indexOf("/webapps/login/") != -1) || (document.URL.indexOf("/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_76_1") != -1)) {
		
		/////////////////////////////
		// Login
				
		document.cookie = "cookies_enabled=yes;" + getCookieExpiration();

		$('script').remove();
		
		var parentObject;
		var loginCheck = '';				
	
		if (p['autoLogin'] == "true") loginCheck = 'checked="checked"'; 
					
		$('#loginFormList > li:nth-child(2)')
			.append($('<li class="clearfix"></li>'))
				.append('<label for="autoLogin">Enable Automatic Login (<a href="#" id="autoHint">?</a>)</label><input type="checkbox" ' + loginCheck + ' id="autoLogin"/>')				
		;
	
		$('#autoHint')
			.click(function() { alert("This feature is provided by SwinDust.\n\nInstead of having to manually press login every time you visit this page, SwinDust will automatically store your details and login for you.\n\nYour username and password is stored locally and is not sent anywhere (extensions are open source, you can check for yourself).\n\nIt is strongly suggested that you don't use this feature on a public computer."); return false; });
		;			
										
		// Override the Swinburne login junk
		$('form[name=login]').removeAttr('onSubmit');
		$('form[name=login]').unbind();				
						
		$('form[name=login]')
			.submit(function() {
				
				if ($('#user_id').val().length <= 0 || $('#password').val().length <= 0 ) {
					alert('Enter a username and password');
					return false;
														
				}
		
				if ($('#autoLogin').attr('checked')) {
					
					chrome.extension.sendRequest({
						name: "setAutoLogin",
						user: $('#user_id').val(),
						pass: base64_encode($('#password').val())
					});
					
				}
				
				// Set the required form attributes for submission
				$('input[name=encoded_pw], input[name=encoded_pw_unicode]')
					.val(base64_encode($('#password').val()));
				
				$('#password').val('');
				
				return true;
		
			});
		;
		
		if (p['loginCleanup'] == "true") {
			
			$('object').remove();
		
			$('#column0')
				.css('min-height', '0')
				.css('width', '100%');
				
			$('#column1')
				.css('width', '100%');
				
			$('#column2')
				.remove();
				
			$('#.containerPortal > div .portlet')
				.css('margin-left', '0px')
				.css('margin-right', '0px');
				
						
			$('.column-1, .column-2, .column-3, .column-4, column-5')
				.css('min-height','0');
			
			
		}
			
	} else if (isFramePage) {
			
		//////////////////////////////
		// Frameset
		
		if (p['headerUseToolbar'] == "true") {
		
			$('frameset')
				.attr('rows', '33,*')
				.attr('frameborder', '1')
				.children('frame:first')
					.attr('scrolling', 'no')
					.css('border-bottom', '1px solid #888888');
			
		}
			
	} else if (
		document.URL.indexOf("/webapps/portal/tab/_1_1/index.jsp") != -1 ||
		document.URL.indexOf("/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1") != -1 ||
		document.URL.indexOf("/webapps/portal/execute/tabs/tabAction?tabId=%20_1_1&tab_tab_group_id=_2_1") != -1 ||
		document.URL.indexOf("/webapps/portal/execute/tabs/tabAction?tabId=%20_657_1&tab_tab_group_id=_28_1") != -1
		) {
		
		//////////////////////////////
		// Main Page
		//////////////////////////////		
				
		// $('head').append('<link rel="stylesheet" href="' + chrome.extension.getURL("css/mainpage.css") + '" type="text/css" />');
	 
	 	//////////////////
		// Module columns
		
	 	if (p['realOneColumn'] == "true") {
			
			$('#column0')
				.css('min-height', '0')
				.css('width', '100%');
				
			$('#column1')
				.css('width', '100%');
				
			$('#column2')
				.css('width', '100%');
			
		} else if (p['mainOneColumn'] == "true") {
												
			$('#column1')
				.css('width', '80%');
				
			$('#column2')
				.css('width', '80%')
				.css('min-height', '0')
				.css('margin-left', '20%');
					
		}
		
		/* TO-FIX
		//////////////////
		// Module Hiding
		
		var hiddenModules = JSON.parse(p['hiddenModules']);
				
		// Add Button to menu for unhiding
		$("#nav")
			.append($('<li class="mainButton"></li>')
				.append($('<a href="#">Unhide Modules</a>')
					.bind("click", function() {
						$(".reorderableModule").slideDown();
						chrome.extension.sendRequest({
							name: 'showModules'
						});						
					})
				)
			);
								
		$(".reorderableModule")		
			.filter(function(index) {
								
				// Remove any modules that already have close buttons
				if ($(this).find(".moduleCloseLink").length > 0) {
					return false;
				} else {
					return true;					
				}
				
			})				
			.each(function(index, value) {
				
				var moduleID = $(value).attr('id');
				
				// Add <X> button to mdoule drag handles
				$(value).children(".edit_controls")
					.append($('<a title="Close Module" class="moduleCloseLink-SwinDust" href="#"></a>')
						.css('content', 'X')
						.css('font', '16px/1 \'Utilicons\'')
						.bind("click", 
								function() {
									chrome.extension.sendRequest({
										name: 'hideModule',
										module: moduleID
									});
									$(value).slideUp();
								})
						.append('<img alt="Close Module" src="/images/ci/ng/close_mini.gif" style="display: block; ">')
				);
				
				// Hide any modules that have previously been marked as hidden									
				for (var i = hiddenModules.length - 1; i >= 0; --i )
					if (moduleID == hiddenModules[i])
						$(value).hide();				
				
			});
		
		$('.edit_controls a::before')
			.css('text-shadow','none');
			
		
		//////////////////
		// Hide Subjects
		$("#div_3_1").bind("DOMSubtreeModified", function() {
		
			var $coll = $("#div_3_1 ul > li");
			
			if ($coll.length > 0) {
					
				$("#div_3_1").unbind("DOMSubtreeModified");
				
				var linkText = "Units in which you are enrolled ";
									
				$('#div_3_1').find("h3")
					.html(linkText + ' (').append(
						$('<a href="#">unhide all</a>')
							.bind("click", 
								function() {
									chrome.extension.sendRequest({
										name: 'showSubjects'
									});
									$("#div_3_1 ul > li").fadeIn();
								})
					).append(')');
									
				$coll.each(function(index, value) {
					
					var name = $(value).children("a").html();
				
					var $newLink = 
					
						$('<a href="#" class="subjectHideLink" onclick="return false;"></a>')
							.bind("click", 
									function() {
										chrome.extension.sendRequest({
											name: 'hideSubject', 
											subj: name
										});
										$(this).parent("li").slideUp();
									})
							.append('<img src="' + chrome.extension.getURL("bb_img/close_mini.gif") + '" alt="Hide Subject" title="Hide Subject"></img>');
					
						//	
					$(value).append($newLink);
					
				});
				
				$coll.filter(function(index) {
					
					var subj = $(this).find("a").html();
					
					if (subj) {
						
						var subjects = JSON.parse(p['hiddenSubjects']);
							
						for (var i = subjects.length - 1; i >= 0; --i )
							if ($.trim(subj).toUpperCase().indexOf($.trim(subjects[i]).toUpperCase()) >= 0)
							return true;
						
					}
					
					return false;
					
				}).hide();
									
			}
			
		});
		
		*/
		
		if (p['cEnable'] == "true") {
						
			// Inner Background color and border
			$('.containerPortal')
				.css('background-image', 
				 '-webkit-gradient(linear, right top, right bottom, color-stop(0, ' + hslAdj(p['cTwo'],35,100) + '), color-stop(1, ' + hslAdj(p['cTwo'],20,100) + '))')
				.css('border', '1px solid ' + hslAdj(p['cTwo'], 50, 40))
				.css('padding', '10px 12px');
						
			// Action Bar Border
			$('#actionbar')
				.css('border-top', '1px solid ' + hslAdj(p['cTwo'], 50, 40))
				.css('border-left', '1px solid ' + hslAdj(p['cTwo'], 50, 40))
				.css('border-right', '1px solid ' + hslAdj(p['cTwo'], 50, 40))
			
				
			/*$('#paneTabs > li.active > a')
				.css('background', 'transparent')
				.css('border', 'none')
				.css('-webkit-border-radius', '0px');*/
			
			$('.paneTabs').hide();
			$('#navsecondary > li:nth-child(1)').hide();
			
			// Module Headers			
			$('.portlet > h2')
				.css('border-bottom', '1px solid ' + hslAdj(p['cOne'],20,100)) 
				.css('background', hslAdj(p['cOne'],37,80));
									
			$('.portlet > h2 > span')
				.css('color', hslAdj(p['cTwo'],100,80))
				.css('text-shadow', '0 1px 0 ' + hslAdj(p['cTwo'],20,20));
			
			// Module Borders
			$('.portlet')
				.css('border', '1px solid ' + hslAdj(p['cOne'],30,100));
				
			$('.portlet > .collapsible')
				.css('background', hslAdj(p['cTwo'],95,100))

		}
		
		// Transparently handle legacy course links
		$('.portletList-img')
			.find('a[href^="/webapps/swin-829ssoc-bb_bb60/SSO?location=%2Fwebapps%2Fportal%2Fframeset.jsp"]').each(function() {
			
			$(this).addClass('courseLink');
			
			var courseID = $(this).attr('href');
			courseID = courseID.substring(courseID.indexOf('id%253D') + 7);
								
			// Replace the hyperlink with the revised URL and alter the target
			$(this)
				.attr('href', 'http://blackboard.swin.edu.au/bin/common/course.pl?course_id=' + courseID)
				.attr('target', 'content');
			
		});					
			
		if (isSample) {
			// Disable all links if it's a sample on the options page
			$('script').remove();
		}	
		
					
	} else if (document.URL.indexOf("/webapps/blackboard/content/listContent.jsp") != -1) {
		
		//////////////////////////////
		// Content lists
		//////////////////////////////
				
		// Change content links into new tab pages
		if (p['contentToNewTab'] == "true") {
			$('ul.attachments > li > a').attr('target', '_newtab');
		}
	
	}
	
	if (isTopPage) {
	
		SwinDust_processTopbar(p, isSample);	
		
	} else {
		
		SwinDust_processOtherPages(p, isSample);
		
	}
	
}

function SwinDust_processOtherPages(p, isSample) {

	//////////////////////////////
	// Main Body

	// Apply background colour on every page, but login.
	//if (document.URL.indexOf("/webapps/login/") == -1) {
	
		if (p['cEnable'] == "true") {
			// Apply colours
			$('body').css('background', hslAdj(p['cOne'],20,100) + ' url("' + chrome.extension.getURL("bb_img/stripe.png") + '")');
			$('body').removeAttr('bgcolor');
		}
		
	//}
	
	// Removing the header banners from course pages
	if (p['removeHeaderBanner']) {						
		$('h1.pageTitle').next('center').remove();		
	}		
	
	if (p['cEnable'] == "true") {
		
		$('#pageTitleDiv')
			.css('background-image', 
		 '-webkit-linear-gradient(' + hslAdj(p['cOne'],30,100) +' 99%,'+ hslAdj(p['cOne'],35,100) + ',' + hslAdj(p['cOne'],33,100) + ')');
								
		$('#pageTitleText')
			.css('color', 'white')		
			.css('text-shadow', '2px 2px 2px #000000');				
								
		$('#pageTitleText > span')
			.css('color', 'white')
			.css('text-shadow', '2px 2px 2px #000000');
		
		$('.helphelp')
			.css('color', '#cccccc');
			
	}
	
	if (p['removeBreadcrumbs'] == "true") {
	
		$('#breadcrumbs').hide();
			
	}
	
	///////////////////////////////
	// Navigation Menu	
	
	// Removing sidebar garbage bits
	if (p['sidebarRemoveSubtables'] == "true") {
		
		$('div.topRound').remove();
		$('div.actionBarMicro').remove();
		
	}
	
	if (($('#courseMenuPalette_contents > li').length > 0) && (!isSample)) {
							
		// Subject Grades Button					
		if ((p['sidebarAddSubjectGrades'] == "true") && 
			($('#courseMenuPalette_contents').find('span[title="Subject Grades"]').length == 0)) {
			
			$('#courseMenuPalette_contents')
				.append($('<li class="clearfix"></li>')
					.append($('<a href="/webapps/gradebook/do/student/viewGrades?callback=portal&course_id=' + $.getUrlVar('course_id') + '" target="content"></a>')
						.append($('<span title="Subject Grades">Subject Grades</span>'))
					)
				);							
		
		}
		
		// Subject Tools Button					
		if ((p['sidebarAddTools'] == "true") && 
			($('#courseMenuPalette_contents').find('span[title="Tools"]').length == 0)) {
							
			$('#courseMenuPalette_contents')
				.append($('<li class="clearfix"></li>')
					.append($('<a href="/webapps/blackboard/content/launchLink.jsp?course_id=' + $.getUrlVar('course_id') + '&tool_id=_11_1&tool_type=TOOL" target="content"></a>')
						.append($('<span title="Tools">Tools</span>'))
					)
				);							
		
		}
	
	}
				
	if (p['cEnable'] == "true") {
	
		$('.comboLink')
			.css('color', 'white');
		
		// Course Menu Title
		$('.navPaletteTitle')
			.css('color', 'white')
			.css('background-image', 
				 '-webkit-linear-gradient(' + hslAdj(p['cOne'],30,100) +' 99%,'+ hslAdj(p['cOne'],35,100) + ',' + hslAdj(p['cOne'],33,100) + ')')
			.css('border-bottom','1px solid ' + hslAdj(p['cOne'],35,100))
			.css('padding-top', '5px')
			.css('padding-bottom', '5px')
			.css('text-shadow', '1px 1px 2px #000000');
			
		// Course Menu Content		
		$('#courseMenuPalette, #myGroups')
			.css('background-image', 
				 '-webkit-gradient(linear, right top, right bottom, color-stop(0, ' + hslAdj(p['cTwo'],35,100) + '), color-stop(1, ' + hslAdj(p['cTwo'],20,100) + '))');
		
		
		$('#pageTitleDiv')		
			.css('border','1px solid ' + hslAdj(p['cOne'],35,100));
					
		$('.navPaletteContent')			
			.css('background', 'transparent')			
			.css('border','1px solid ' + hslAdj(p['cOne'],35,100));
		
		$('#courseMenuPalette_contents > li > a')
			.hover(function () {
					$(this)
						.css('font-weight', 'bold');
				  }, function() {
				 	$(this)
						.css('font-weight', 'normal'); 
			 	 });
						
		// Menu item text-colour	
		$('#courseMenuPalette_contents > li > a > span')
			.css('color','white')
			.css('text-shadow', '1px 1px 2px #050505');
				
		// Action Bar (Disc. Board, Etc)
		$('#actionbar, #nav, #navsecondary')
			.css('background-image', '-webkit-linear-gradient(' + hslAdj(p['cTwo'], 63,40) +', '+ hslAdj(p['cTwo'],60,40) + ',' + hslAdj(p['cTwo'],62,40) + ')');
			
		$("#myGroups").bind("DOMSubtreeModified", function() {
				
			// there is a blank <li> until the content is loaded
			if ($('#myGroups .submenu > li').length > 1) {
				
				$('.tools .submenu')
					.css('background', 'none');
					
				
				$('.tools .submenu a')
					.hover(function () {
								$(this)
									.css('font-weight', 'bold')
									.css('background', 'none');
							  }, function() {
								 $(this)
								 	.css('font-weight', 'normal'); 
								  
							  });
							  
				$('#myGroups_contents .submenu > li > a')
					.css('color','white')
					.css('text-shadow', '1px 1px 2px #050505');
					
				$('#myGroups_contents h4 a.comboLink_active')
					.css('background', 'none');
					
			}
			
			$('myGroups_contents h4 > a')
				.css('background', 'none');
			
			// Title
			
		});
		
	}
	
	if (p['sidebarAlphaSort'] == "true") {
		var mylist = $('#courseMenuPalette_contents');
		var listitems = mylist.children('li');
		listitems.sort(function(a, b) {
		   var compA = $(a).children('a:first').children('span:first').text().toUpperCase();
		   var compB = $(b).children('a:first').children('span:first').text().toUpperCase();
		   return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
		})
		$.each(listitems, function(idx, itm) { mylist.append(itm); });
	}
	
	if (p['cEnable'] == "true") {
		
		// Fixes padding on menu items in navigation pane 
		// during colour customizations
		
		$('#_titlebarExtraContent')
			.css('margin-top', '0px');
			
		$('#menuWrap')
			.css('border', 'none');
			
		$('#contentArea, #schemePreviewBody, .contentBox')
			.css('border', 'none');
			
		$('#pageHeader, #schemePreviewHead, .pageTitle')
			.css('-webkit-box-shadow', 'none')
			.css('-moz-box-shadow', 'none');
		
		$('.buttonCm li')
			.css('margin','0px')
			.css('position','inherit')
			.css('background','none');
			
		$('#courseMenu_link')
			.css('background','none');
		
		$('#courseMenuPalette div.navPaletteContent')
			.css('padding-top', '0px');
			
		$('#courseMenuPalette_contents > li')
			.css('padding', '0px')
			.css('margin', '0px');
		
		$('#courseMenuPalette_contents > li > a')
			.css('padding', '4px')
			.css('margin-left', '10px');
		
		$('.navPaletteContent')
			.css('padding-bottom', '0px');
			
		$('.navPaletteContent .submenu')
			.css('border', 'none');	
		
		$('.navPaletteTitle > h3').each(function(index) {
			
			$(this)
				.css('padding', '5px')
				.css('padding-left', '10px')
				.text($('a', this).text())
				.nextAll('h3')
					.remove(); // Remove any duplicate h3s... origin?
				;
				
				// Remove the background if colours are enabled
				$(this)
					.css('background', 'none');	
			
		});
	
	
	}
										
	$('a#courseMenu_combo').parent('h3').remove();
		
	// Removes the HTML rounded edges from the navigation block		
	$('div.bottomRound')
		.remove();
		
	// Removes funny links from the top right announcements page
	$('#content > div.localViewToggle:first').remove();
	
	// Removes the hide menu button from the navigation pane if it exists	
	if ($("#navigationPane").length > 0) {
		$('#puller').hide();
		//$('#contentPanel').css('margin-left','205px');	
	}
	
	if (p['removeHeaderImages'] == "true") {	
		$('#titleicon').remove();				
	}
	
	if (p['removeHeaderBanner'] == "true") {
		$('#pageBanner').remove();
	}
							
	$('#copyright')
		.hide();		
	
	$('head').append('<link rel="stylesheet" href="' + chrome.extension.getURL("css/allpages.css") + '" type="text/css" />');
	
	// Change document title on all pages
	if (document.title.length > 0) {
		document.title = document.title + ' [Powered with SwinDust]';
	} else {
		document.title = 'Blackboard [Powered with SwinDust]';
	}
	
	if (p['useTransitions'] == "true") {
		$('#loadingCover').fadeOut();
		$('#content').fadeIn();
	}
	
}

function SwinDust_processTopbar(p, isSample) {
	
	//////////////////////////////
	// Top Menu
					
	if (p['headerUseToolbar'] == "true") {
	
		var userName = $('#loggedInUserName').text();					
		
		$('head')
			.html('<link rel="stylesheet" href="' + chrome.extension.getURL("css/topmenu.css") + '" type="text/css" />');
			
		$('body')
			.removeAttr('onLoad')
			.html('<ul id="top_menu"></ul>');				
						
		
		var menu = $('#top_menu');
		
		if (p['autoLogin'] != "true") {
			// Add 'Blackboard Logout' button
			menu
				.append($('<li id="nav_logoutParent" class="button right"></li>)')
					.append($('<a id="nav_logout" class="navLink" href="/webapps/login/?action=logout" target="_top">Logout</a>'))
				
				)
			;
		}
	
		// Add 'Options' button
		menu
			.append($('<li id="nav_extOptionsParent" class="button right"></li>)')
				.append($('<a id="nav_extOptions" class="navLink" href="' + chrome.extension.getURL("options.html") + '" target="_newtab">Options/Colours</a>'))
			
			)
		;
		
		if (p['headerShowAllocate'] == "true") {
									
			// Add 'Allocate+' button
			$('#top_menu')
				.append($('<li id="nav_allocateParent" class="button right"></li>)')
					.append($('<a id="nav_allocte" class="navLink" href="http://allocate.swin.edu.au/aplus/apstudent" target="_newtab">Allocate+</a>'))
				
				)
			;
		
		}
		
		if (p['headerShowLibrary'] == "true") {
			menu.append($('<li id="nav_libraryParent" class="button right"></li>)')
					.append($('<a id="nav_library" class="navLink" href="http://www.swinburne.edu.au/lib/" target="_newtab">Library</a>'))
				);
		}
		
		if (p['headerShowMySwin'] == "true") {
			menu.append($('<li id="nav_myswinParent" class="button right"></li>)')
					.append($('<a id="nav_myswin" class="navLink" href="https://sso.swinburne.edu.au/sso/pages/swin_login.jsp" target="_newtab">My.Swinburne</a>'))
				
				);
		}
		
		if (p['headerShowWebmail'] == "true") {
			menu.append($('<li id="nav_emailParent" class="button right"></li>)')
					.append($('<a id="nav_email" class="navLink" href="http://outlook.com" target="_newtab">Student Webmail</a>'))
				
				);
		}
				

		menu.append($('<li id="nav_unitsParent" class="button right"></li>)')
				.append($('<a id="nav_units" class="navLink" href="/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_2_1" target="content">My Course Units</a>'))
			);		
		
		
		menu
			.append($('<li class="nav_pageTitleParent"></li>)')
				.append('<span id="nav_pageTitle">SwinDust</span>'))
			.append($('<li class="nav_pageTitleParent"></li>)')
				.append('<span id="nav_pageTitleExtra"><em>for Swinburne Blackboard</em></span>'));
				
		if (userName.length > 0) {
			menu
				.append($('<li class="nav_pageTitleParent"></li>)')
					.append('<span id="nav_welcomeDot">&raquo;</span><span id="nav_welcome">Welcome, ' + userName + '</span>'));				
		}
						
			
	}

}