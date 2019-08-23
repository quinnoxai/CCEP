var username='';
var greetings;
var first_name;
var previous_url = '';
var images = [];
var resp={};
var dw = $(document).width();
var play = 1;

function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}
preload("/static/images/bg1.jpg");

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    changeBgImg();
	loadFiles();
	loadHUXDetails();
	$.ajax({
        url: '/helpdesk/refresh/',
        type: 'POST',
        success: function(response){
        }
        ,error:function(response){
        }
    });

});


function showWelcomeBotMsg(responseMsg){
	var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:responseMsg.response};
    showMustacheTemplateText(options);
    textToSpeech(options.textMsg);
    scrollChatDown();

    setTimeout(function () {
        var options = {templateId: '#temp_nbContent',msgContainerId: '#chatContent',category_required:"yes",category:'',data:responseMsg.data};
        showMustacheBotSuggestionsTable(options);
        scrollChatDown();
    }, 2000);

}

function loadHUXDetails(){
    $.ajax({
        url: '/helpdesk/welcome/',
        type: 'POST',
        success: function(response){
        var username=response.firstName;
        first_name = username;
        var firstAlpha = username.charAt(0);
        $(".usernameTxt").html(username);
        $(".profileDiv > a > span").html(firstAlpha);
        var data = [[0,4, "Good evening. "],[4, 12, "Good morning, "],[12, 16, "Good afternoon, "],[16, 24, "Good evening, "]];
        var hr = new Date().getHours();
        for(var i=0; i<data.length;i++){
            if(hr >= data[i][0] && hr <= data[i][1]){
                $(".greeting_widget").html(data[i][2] + "<span>"+first_name+"</span>");
                break;
            }
        }
        var role=response.role;
        if(role =="admin"){
            $(".rShow").show();
        }
        else
        {
            $(".rShow").hide();
        }

        showWelcomeBotMsg(response)

        }
        ,error:function(response){

        }
    });
    $.get("http://ipinfo.io?token=ddac43663aea73", function (response) {
        $(".place_widget").html(response.city);
        $.get("http://api.openweathermap.org/data/2.5/weather?q="+response.city+"&appid=e3635e2e61bb5ed7f5d7b44b68994048", function(resp){
            var temperature = resp.main['temp_max']-273.15;
            $(".weather_widget").find(".temperature").html(Math.round(temperature)+"°C");
        });
    }, "jsonp");

    startTime();
}
function startTime(){
var d = new Date();
var n = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
    $(".time_widget").html(n);
    t = setTimeout(function () {
        startTime();
    }, 500);
}

function loadFiles() {
    var t = new Date();
    var hr = t.getHours();
    var min = t.getMinutes();
    var sec = t.getSeconds();
    var qVar = hr +"_"+ min +"_"+ sec;
    //$("head").append('<link href="/static/css/fonts.css?q='+qVar+'" rel="stylesheet">');
    //$("head").append('<link href="/static/css/style.css?q='+qVar+'" rel="stylesheet">');
}

/**get current location */
function getCurrentLoc() {
    $.get("http://ipinfo.io?token=ddac43663aea73", function (response) {
        $(".currLoc").html(response.city);
		$.get("http://api.openweathermap.org/data/2.5/weather?q="+response.city+"&appid=e3635e2e61bb5ed7f5d7b44b68994048", function(resp){
			var temperature = resp.main['temp_max']-273.15;
			$(".wrapper").find("#temperature").html(Math.round(temperature)+"°C");
		});
    }, "jsonp");
}


$('.tagGrp input').keyup(function(e){
    if(e.keyCode == 13) {
        displayTags($(this));
    }
});

$(document).on("click",".tagGrp .btnAddInput",function(e){
    displayTags($(this));
});

function displayTags(inputObj) {
	var input = inputObj.parents(".mGrp").find(".form-control").val();
    if(input != "" || input.length != 0){
        inputObj.parents(".tagGrp").find(".interest_list").append('<span class="interest_item">' + input + '<i class="icon ion-android-close"></i>' + '</span>');
        inputObj.parents(".mGrp").find(".form-control").val("");
    }
}

$(document).on("click",".tagGrp .interest_item i",function(e){
	$(this).parent().remove();
});


function setDateTimeName() {
	var data = [[0,4, "Good evening,"],[4, 12, "Good morning,"],[12, 16, "Good afternoon,"],[16, 24, "Good evening,"]];
	var hr = new Date().getHours();

	for(var i=0; i<data.length;i++){
		if(hr >= data[i][0] && hr <= data[i][1]){
			if(first_name==null){
				$(".time_widget p").html(data[i][2]);
			}else{
				$(".time_widget p").html(data[i][2] + " <span>" + first_name+"</span>");
			}
			$(".con_name").html(first_name + "!");
			greetings = data[i][2];
			break;
		}
	}
}

/***scrollDownChatWindow */
function scrollChatDown(){
    $(".botContent").stop().animate({scrollTop: ($(".botContent").find('.chatContent')[0].scrollHeight + 40)}, 1000);
    var botContentHeight = $(".botContent").height();
    var chatContentHeight = $(".chatContent").height();
    if(chatContentHeight >= botContentHeight) {
        $(".botFooter").find(".suggestions").slideDown(function(){
        $(".botFooter").css("height","131px");
        });
    }
    else
    {
        $(".botFooter").find(".suggestions").slideUp(function(){
            $(".botFooter").css("height","auto");
        });
    }
}

/**trucate post text */
function truncatePostText() {
    var truncateTextLength = 90;
    $(".replyContent .box").each(function() {
    var $postText = $(this).find(".postText");
    var text = $postText.text();

    if(text.length > truncateTextLength) {
        $postText.text(text.substring(0, (truncateTextLength -4)) + "...");
    }
    });
}


/**show overlay post */
$(document).on("click",".rc2 .box",function(){
		var postId = $(this).find("#postId").val();
		var postFilePath = $(this).find("#filePath").html();
		var postTitle = $(this).find("#postTitle").html();
		var postBody = $(this).find("#postBody").html();
		var postImg = $(this).find(".postImg img").attr("src");

		$(".postOverlay").fadeIn(function(){
			$(this).attr("id",postId);
			$(this).find(".postImg img").attr("src",postImg);
			$(this).find(".postOverlayHeader h3").html(postTitle);
			$(this).find(".postOverlayText").html(postBody);
            $(this).find(".btnDownload").attr("href",postFilePath);
			$(this).find(".postOverlayContent").scrollTop(0);
		});
});


/**btn back to post */
$(document).on("click",".btnbackToChat",function(){
    $(this).parents(".postOverlay").fadeOut();
});
$(document).on("click",".btnLogOut",function(){

$.ajax({
			url: '/helpdesk/logout/',
			type: 'POST',
			success: function(response){
			alert("Successfully logged out")
			location.href="/helpdesk/"
			}
			,error:function(response){
//			alert("Logout unsuccessful")
			}
		});
});


$(".btnEnterUserChat").click(function(){
	var textVal = $(".chatInput").val().toString();
    submitTextInput(textVal);
});
//chat-message

$(".chatInput").keyup(function(event){
    if (event.keyCode === 13){
		var textVal = $(".chatInput").val().toString();
		submitTextInput(textVal);
    }
});



/***chat uggestions**/
$(document).on("click",".chatMsg .suggestionsList span",function(){
	var suggestionVal = $(this).html().toString();
	submitTextInput(suggestionVal);	
});

$(document).on("click",".rc1 .box",function(){
	var suggestionVal = $(this).find(".postText").html().toString();
	submitTextInput(suggestionVal);
});

/***show me some footer suugestions */
$(document).on("click",".botFooter .suggestionsList span",function(){
    $(".botFooter .suggestionsList span").removeClass("active");
    $(this).addClass("active");
	var suggestionVal = $(this).html().toString();
	submitTextInput(suggestionVal);	
});


/**bot rating **/
$(document).on("click",".rating input[name='rating']",function(){
	var suggestionVal = $(this).val();
	submitTextInput(suggestionVal);
});


function submitTextInput(textVal) {
	$(".postOverlay").hide();
	if(textVal != "" || textVal.length != 0) {
		var options = {templateId: '#temp_usermsg',msgContainerId: '#chatContent',textMsg: textVal};
		showMustacheTemplateText(options);
		scrollChatDown();
		var data_message={"message":textVal}
		$.ajax({
			url: '/helpdesk/chat/',
			type: 'POST',
			data: data_message,
			success: function(response){
//			console.log("res: "+JSON.stringify(response.data));
			var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:response.response,category_required:response.category_required,category:response.category,data:response.data,domain_name:response.domain_name};
			showMustacheTemplateText(options);
			textToSpeech(options.textMsg);

			if(options.category_required == "yes") {

			    if(options.category == "table") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_nbContentTable',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
                        showMustacheBotSuggestionsTable(options);
                        scrollChatDown();
                    }, 1000);
                }
                 else if(options.category == "tableDC") {
                    setTimeout(function () {
//                        console.log("I am here at least")
                        var options = {templateId: '#temp_nbContentTableDCC',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
                        showMustacheBotSuggestions(options);
                        scrollChatDown();
                    }, 1000);
                }
                else if(options.category == "letters") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_boxSuggestions',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
                        showMustacheBotSuggestions(options);
                        scrollChatDown();
                    }, 1000);
                }
                else if(options.category == "forms") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_downloadBtns',msgContainerId: '#chatContent',type_content: "all",category_required:response.category_required,category:"",data:response.data};
                        showMustacheBotSuggestions(options);
                        scrollChatDown();
                    }, 2000);
                }
                  else if(options.category == "table_icc") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_nbContentTableICC',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
                        showMustacheBotSuggestions(options);
                        scrollChatDown();
                    }, 1000);
                }
                 else if (options.category == "table_limit") {
    setTimeout(function () {
        var options = {templateId: '#temp_nbContentTable_Limit',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
        showMustacheBotSuggestionsTable(options);
        scrollChatDown();
    }, 1000);
}

                 else if(options.category == "goodbye") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_botrating',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
                        showMustacheBotSuggestions(options);
                        scrollChatDown();
                    }, 1000);
                }
                else if(options.category == "case_finder") {
                   setTimeout(function () {

						var options = {templateId: '#temp_newsSuggestions',msgContainerId: '#chatContent',type_content:'all',category_required:response.category_required,category:'',data:response.data};
						showMustacheTemplateNewsSuggestions(options);
						scrollChatDown();
					}, 1000);
                }
                else
                {
                    setTimeout(function () {
                        var options = {templateId: '#temp_nbContent',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
                        showMustacheBotSuggestions(options);
                        scrollChatDown();
                    }, 1000);
                }


            }


			}
			,error:function(response){
				var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:"Hey buddy, I'm sorry I didn't get this one. I'm still trying to learn"};
				showMustacheTemplateText(options);
				textToSpeech(options.textMsg);
				scrollChatDown();
			}
		});
	}
}

showMustacheTemplateText = function (options) {
	var msg = {};
	msg.textMsg=options.textMsg;
	var template = $(options.templateId).html();
	var msgContainer = $(options.msgContainerId);
	Mustache.parse(template);
	var rendered = Mustache.render(template, msg);
	msgContainer.append(rendered); 
	scrollChatDown();
	if(options.templateId == "#temp_usermsg") {
		$(".chatInput").val("");
	}
	else if(options.templateId == "#temp_botText") {

	}
	var domain_name = options.domain_name;
	if(domain_name !="undefined") {
	    $(".botFooter .suggestionsList > span").removeClass("active");
	    $(".botFooter .suggestionsList > span[dname='"+domain_name+"']").addClass("active");
	}
};

/*show bot suggestions**/
showMustacheBotSuggestions = function (options){
	var msg = options.data;
	var template = $(options.templateId).html();
	var msgContainer = $(options.msgContainerId);
	Mustache.parse(template);
	var rendered = Mustache.render(template, msg);
	msgContainer.append(rendered);
	truncatePostText();
};

/*show bot suggestions**/
showMustacheBotSuggestionsTable = function (options){
	var msg = options.data;
	var template = $(options.templateId).html();
	var msgContainer = $(options.msgContainerId);
	Mustache.parse(template);
	var rendered = Mustache.render(template, msg);
	msgContainer.append(rendered);
	truncatePostText();
};


showMustacheTemplateNewsSuggestions = function (options){
	var msg = options.data;
        var template = $(options.templateId).html();
        var msgContainer = $(options.msgContainerId);
        Mustache.parse(template);
        var rendered = Mustache.render(template, msg);
        msgContainer.append(rendered);
        truncatePostText();
};




/**events**/
showMustacheTemplateEventsSuggestions = function (options) {
		url="http://dev-devbasf.pantheonsite.io/content_api/get?type="+options.type_content+"&category="+options.category;

    $.getJSON(url, function (data) {
        var template = $(options.templateId).html();
        var msgContainer = $(options.msgContainerId);
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        msgContainer.append(rendered);
        truncatePostText();
    });
};




/**text to speech */
function textToSpeech(textVal) {
	$("#textToSpeechBtn").html(textVal);
	$("#textToSpeechBtn").click();
  
}
var voiceAllowed = 0;
$(document).on("click","#textToSpeechBtn",function(){
	var textVal = $(this).html();
	if ('speechSynthesis' in window) {
		  var text = textVal;
		  var msg = new SpeechSynthesisUtterance();
		  var voices = window.speechSynthesis.getVoices();
		  //msg.voice = voices[$('#voices').val()];
		  msg.text = text;
		  msg.onend = function(e) {
//			console.log('Finished in ' + event.elapsedTime + ' seconds.');
		  };
		  if(voiceAllowed === 1) {
			speechSynthesis.speak(msg);
		  }
		  
	  }
});



$(document).on("click",".iconVoice",function(){
    $(this).toggleClass("iconVoiceBan");
	$(this).find("i").html("Off");
    if(voiceAllowed === 1) {
        voiceAllowed = 0;
    }
    else
    {
		$(this).find("i").html("On");
        voiceAllowed = 1;
    }
   
});

var bgImagesStorage = [];
function changeBgImg() {
	var bgImages = [1,2,3,4,5,6];
	if(bgImages.length == bgImagesStorage.length) {
		bgImagesStorage.length = 0;
	}
	else
	{
		
		var randomNum = Math.floor(Math.random() * bgImages.length);
		if(bgImagesStorage.indexOf(randomNum) == -1) {
			bgImagesStorage.push(randomNum);
		}
		else
		{
			changeBgImg();
		}
		
		
		var folderImgName;
		if(dw > 768) {
			folderImgName = "imgDesk/";
		}
		else
		{
			folderImgName = "imgMob/";
		}
		if(bgImagesStorage[bgImagesStorage.length - 1] ==0) {
			changeBgImg();
		}
		$('span.pagBg').css({'background-image':'url(/static/images/' + folderImgName + bgImagesStorage[bgImagesStorage.length - 1] + '.jpg)'});
	}
	
}


/*login form functions**/
$(document).on("click",".btnSubmit",function(){
	var iUsername=$("#username").val().trim();
	var iPassword=$("#password").val().trim();
	if(iUsername.length == 0 || iUsername ==""){
		var errorText = '<div class="errorMsg"><span>Invalid Username</span></div>';
		$("#username").parent().append(errorText);
		$(".btnSubmit").attr("disabled",true);
	}
	else
	{
		$("#username").parent().find(".errorMsg").remove();
		$(".btnSubmit").removeAttr("disabled");
	}
	if(iPassword.length == 0 || iPassword ==""){
		var errorText = '<div class="errorMsg"><span>Invalid Password</span></div>';
		$("#password").parent().append(errorText);
		$(".btnSubmit").attr("disabled",true);
	}
	else
	{
		$("#password").parent().find(".errorMsg").remove();
		$(".btnSubmit").removeAttr("disabled");
	}
	if(iUsername.length != 0 && iPassword.length != 0) {
		$(this).attr("disabled",true);
		var user_date={"username":iUsername,"password":iPassword}

		$.ajax({
			url: '/authenticate/',
			type: 'POST',
			data: user_date,
			success: function(response){
			localStorage.setItem("firstname",response.firstname);
			localStorage.setItem("initials",response.initials);
			setDateTimeName();
			location.href="/homepageview/"
			},
			error:function(response){
//			alert("Username or password inncorrect")
			location.href="/"
			}
		});
//		window.location.href = "home.html";
	}

	$('.loginContent .form-control').focus(function(e){
		$(".btnSubmit").removeAttr("disabled");
		$(this).parent().find(".errorMsg").remove();
	});
	
});

$('.loginContent .form-control').keyup(function(e){
    if(e.keyCode == 13) {
        $(".btnSubmit").click();
    }
});

/**open pdf in popup*/
$(document).on("click",".btnAttachment > i",function(){
    var dLink = $(this).parent().attr("data-src");
    var dType = $(this).parent().attr("data-type");
    $(".postOverlay").fadeIn(function(){
        $(this).find(".postImg").hide();
        if(dType ==="pdf"){
            var pdfFrame = "<iframe src='"+dLink+"' frameborder='0'></iframe>";
            $(this).find(".postOverlayText").html(pdfFrame);
        }
        else
        {
            $(this).find(".postOverlayText").html("<img src='"+dLink+"'/>");
        }

        $(this).find(".btnDownload").attr("href",dLink);
        $(this).find(".postOverlayContent").scrollTop(0);
    });
});