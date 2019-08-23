var username='';
var greetings;
var first_name = localStorage.getItem("firstname");
var previous_url = '';
var images = [];
var resp={};
var greet_words=["Hi","Sure","Hey","Okay"];
var random_word= greet_words[Math.floor(Math.random() * greet_words.length)];
var startWord = random_word+" " +first_name+ ", ";
var dw = $(document).width();
var play = 1;

function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}
preload("images/bg1.jpg");

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    getCurrentLoc();
	changeBgImg();
	loadFiles();
	startTime();
	setDateTimeName();
	$.ajax({
			url: '/refresh/',
			type: 'POST',
			success: function(response){
			}
			,error:function(response){
			}
		});
});

function loadFiles() {
    var t = new Date();
    var hr = t.getHours();
    var min = t.getMinutes();
    var sec = t.getSeconds();
    var qVar = hr +"_"+ min +"_"+ sec;
    $("head").append('<link href="css/fonts.css?q='+qVar+'" rel="stylesheet">');
    $("head").append('<link href="css/style.css?q='+qVar+'" rel="stylesheet">');
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

function startTime() {
		var d = new Date();
		var n = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });

	document.getElementById('time').innerHTML =n;
	t = setTimeout(function () {
		startTime()
	}, 500);
}

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
}

/**trucate post text */
function truncatePostText() {
    var truncateTextLength = 50;
    $(".replyContent .box").each(function() {
    var $postText = $(this).find(".postText");
    var text = $postText.text();

    if(text.length > truncateTextLength) {
        $postText.text(text.substring(0, (truncateTextLength -4)) + "...");
    }
    });
}


/**show overlay post */
$(document).on("click",".replyContent .box",function(){
	if(!$(this).hasClass("eventBox")) {
		var postId = $(this).find("#postId").val();
		var postCreated_date = $(this).find("#postCreated_date").val();
		var mailer_image = $(this).find("#mailer_image").val();
		var postCreated_ago = $(this).find(".postImg h6").html();
		var postTitle = $(this).find("#postTitle").html();
		var postBody = $(this).find("#postBody").html();
		var postImg = $(this).find(".postImg").css("background-image");
		var fImg = $(this).find("#fImg").val();
		var videoUrl = $(this).find("#videoUrl").val();
		var postId = $(this).find("#postId").val();
		$(".postOverlay").fadeIn(function(){
			
			if(videoUrl.trim() != "") {
				$(document).on("click","#myVideo",function(){
					if(play==1){
						$(".videoContainer").show();
						$(".videoContainer").find("video source").attr("src","images/sefina.mp4");
						$(".videoContainer").find("video")[0].load();
						$(".videoContainer").find("video")[0].play();
						play=0;
					}else{
						$(".postOverlay .videoContainer").find("video")[0].pause();
						play=1;
					}
				});
			}
			else
			{
				$(".videoContainer").hide();
			}
			if(mailer_image == "true") {
				$(this).find(".oPostImg").hide();	
				$(this).find(".oPostBanner").show();
				$(this).find(".oPostBanner img").attr("src",fImg);
				$(this).find(".oPostBanner").css("background-image" , postImg);				
			}else{
				$(this).find(".oPostBanner").hide();	
				$(this).find(".oPostImg").show();	
				$(this).find(".oPostImg").css("background-image" , postImg);
			}
			$(this).attr("id",postId);
			$(this).find(".postOverlayHeader h3").html(postTitle);
			$(this).find(".postOverlayHeader h6 span:first-child").html(postCreated_ago);
			$(this).find(".postOverlayHeader h6 span:last-child").html(postCreated_date);
			$(this).find(".postOverlayText").html(postBody);

			$(this).find(".postOverlayContent").scrollTop(0);
		});
		
	}
});


/**btn back to post */
$(document).on("click",".btnbackToChat",function(){
	$(".postOverlay .videoContainer").find("video")[0].pause();
	$(".postOverlay").find(".videoContainer").find("video source").attr("src","");
    $(this).parents(".postOverlay").fadeOut();
});
$(document).on("click",".btnLogOut",function(){
console.log("here")
$.ajax({
			url: '/logout/',
			type: 'POST',
			success: function(response){
			alert("Successfully logged out")
			location.href="/"
			}
			,error:function(response){
			alert("Logout unsuccessful")
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

/***show me some footer suugestions */
$(document).on("click",".botFooter .suggestionsList span",function(){
	var suggestionVal = $(this).html().toString();
	submitTextInput(suggestionVal);	
});

function submitTextInput(textVal) {
	$(".postOverlay").hide();
	if(textVal != "" || textVal.length != 0) {
		var options = {templateId: '#temp_usermsg',msgContainerId: '#chatContent',textMsg: textVal};
		showMustacheTemplateText(options);
		scrollChatDown();
		var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:"Leave Policy"};
		showMustacheTemplateText(options);
		textToSpeech(options.textMsg);
			setTimeout(function () {
                var options = {templateId: '#temp_nbContent',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:""};
                showMustacheBotSuggestions(options);
                scrollChatDown();
			}, 1000);
			setTimeout(function () {
                var options = {templateId: '#temp_boxSuggestions',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:""};
                showMustacheBotSuggestions(options);
                scrollChatDown();
			}, 2000);
			setTimeout(function () {
                var options = {templateId: '#temp_botrating',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:""};
                showMustacheBotSuggestions(options);
                scrollChatDown();
            }, 3000);
		// $.ajax({
		// 	url: 'data/content.json',
		// 	type: 'POST',
		// 	data: data_message,
		// 	success: function(response){
		// 	//console.log("res: "+JSON.stringify(response));
		// 	var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:response.response,category_required:response.category_required,category:response.category,data:response.data};
		// 	showMustacheTemplateText(options);
		// 	textToSpeech(options.textMsg);
		// 	if(options.category_required == "yes") {
        //         setTimeout(function () {
        //             var options = {templateId: '#temp_nbContent',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
        //             showMustacheBotSuggestions(options);
        //             scrollChatDown();
        //         }, 1000);
        //     }
        //     if(options.category == "table") {
        //         setTimeout(function () {
        //             var options = {templateId: '#temp_nbContentTable',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",data:response.data};
        //             showMustacheBotSuggestionsTable(options);
        //             scrollChatDown();
        //         }, 1000);
        //     }

		// 	}
		// 	,error:function(response){
		// 		var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:"Sorry I could not understand"};
		// 		showMustacheTemplateText(options);
		// 		textToSpeech(options.textMsg);
		// 		scrollChatDown();
		// 	}
		// });
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
	if( options.templateId == "#temp_usermsg") {
		$(".chatInput").val("");
	}
	else if( options.templateId == "#temp_botText") {

	}
};

/*show bot suggestions**/
showMustacheBotSuggestions = function (options){
	var msg = {};
	console.log("res: "+JSON.stringify(msg));
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
	console.log("res: "+JSON.stringify(msg));
	var template = $(options.templateId).html();
	var msgContainer = $(options.msgContainerId);
	Mustache.parse(template);
	var rendered = Mustache.render(template, msg);
	msgContainer.append(rendered);
	truncatePostText();
};

function showWelcomeBotMsg(){
	var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg: greetings+ " "+ first_name +"! "+"I am very excited to share my knowledge with you, click below to find out what you can ask me"};
    showMustacheTemplateText(options);
    textToSpeech(options.textMsg);
    scrollChatDown();

}

showMustacheTemplateNewsSuggestions = function (options){
	url="http://dev-devbasf.pantheonsite.io/content_api/get?type="+options.type_content+"&category="+options.category;
	previous_url = url;
	console.log(url)
    $.getJSON(url, function (data) {
        var template = $(options.templateId).html();
        var msgContainer = $(options.msgContainerId);
        Mustache.parse(template);
        var rendered = Mustache.render(template, data);
        msgContainer.append(rendered);
        truncatePostText();
    });
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

$(document).on("click","#textToSpeechBtn",function(){
	var textVal = $(this).html();
	if ('speechSynthesis' in window) {
		  var text = textVal;
		  var msg = new SpeechSynthesisUtterance();
		  var voices = window.speechSynthesis.getVoices();
		  //msg.voice = voices[$('#voices').val()];
		  msg.text = text;
		  msg.onend = function(e) {
			console.log('Finished in ' + event.elapsedTime + ' seconds.');
		  };
		  if(voiceAllowed === 1) {
			speechSynthesis.speak(msg);
		  }
		  
	  }
});


var voiceAllowed = 1;
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
		$('span.pagBg').css({'background-image':'url(images/' + folderImgName + bgImagesStorage[bgImagesStorage.length - 1] + '.jpg)'});
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
		console.log(user_date)
		$.ajax({
			url: '/authenticate/',
			type: 'POST',
			data: user_date,
			success: function(response){
			localStorage.setItem("firstname",response.firstname);
			setDateTimeName();
			location.href="/homepageview/"
			},
			error:function(response){
			alert("Username or password inncorrect")
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