var ww = $(window).width();
var images = [];
var voiceMsg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
var voiceAllowed = 0;
var google_lang = '';
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}
/*preload("images/bg1.jpg"); */
$(window).on("load",function(){
    //$(".botContent").mCustomScrollbar();
    /*$(".preLoader").delay(2000).fadeOut(function(){
        $("body").addClass("loaded");


    });*/
});
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
    //changeBgImg();
    loadHUXDetails();
    loadFiles();
    changeFeed();
    speechSynthesis.cancel();
});

function loadHUXDetails(){

    $.ajax({
        url: '/helpdesk/welcome/',
        type: 'POST',
        success: function(response){
        var username=response.firstname;
        first_name = username;
        var firstAlpha = (username.charAt(0)).toUpperCase();
        $(".profileDiv > a").html(firstAlpha);
        var data = [[0,4, "Good morning, "],[4, 12, "Good morning, "],[12, 16, "Good afternoon, "],[16, 24, "Good evening, "]];
        var hr = new Date().getHours();
        for(var i=0; i<data.length;i++){
            if(hr >= data[i][0] && hr <= data[i][1]){
                $(".time_widget p").html(data[i][2] + "<span>"+first_name+"!</span>");
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
        console.log("welcome details");
        console.dir(response);
        showWelcomeBotMsg(response)

        }
        ,error:function(response){

        }
    });

    $.get("https://ipinfo.io?token=ddac43663aea73", function (response) {
        $(".weather_widget > p").html(response.city);
        $.get("https://api.openweathermap.org/data/2.5/weather?q="+response.city+"&appid=e3635e2e61bb5ed7f5d7b44b68994048", function(resp){
            var temperature = resp.main['temp_max']-273.15;
            $(".weather_widget > span").find(".temperature").html(Math.round(temperature)+"Â°C");
        });
    }, "jsonp")

    startTime();
}
function startTime(){
var d = new Date();
var hr = checkTime(d.getHours());
var min = checkTime(d.getMinutes());
    $(".time_widget > span").html('<i>'+hr +'</i> <i>'+ min+'</i>');
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
    $("head").append('<link href="css/fonts.css?q='+qVar+'" rel="stylesheet">');
    //$("head").append('<link href="css/style.css?q='+qVar+'" rel="stylesheet">');
}
/**get current location */
function getCurrentLoc() {
    $.get("https://ipinfo.io?token=ddac43663aea73", function (response) {
        $(".currLoc").html(response.city);
		$.get("https://api.openweathermap.org/data/2.5/weather?q="+response.city+"&appid=e3635e2e61bb5ed7f5d7b44b68994048", function(resp){
			var temperature = resp.main['temp_max']-273.15;
			$(".wrapper").find("#temperature").html(Math.round(temperature)+"Â°C");
		});
    }, "jsonp");
}






$(document).on("click",".btnGO",function(){
    $(".lScreen1").hide(function(){
        $(".lScreen2").fadeIn();
    })
});

$(document).on("click",".btnSubmit",function(){
    location.href = "index.html";
});



/***scrollDownChatWindow */
function scrollChatDown(){
    $(".botContent").stop().animate({scrollTop: $(".botContent").find('.chatContent')[0].scrollHeight}, 600);
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


/**btn back to post */
$(document).on("click",".btnbackToChat",function(){
    $(this).parents(".postOverlay").fadeOut();
});


$(".btnEnterUserChat").click(function(){
    var textVal = $(".chatInput").val();
    if(textVal != "" || textVal.length != 0) {
        var options = {
            templateId: '#temp_usermsg',
            msgContainerId: '#chatContent',
            textMsg: textVal
        };
        showMustacheTemplateText(options);
        scrollChatDown();

        setTimeout(function(){ 
            respnseFromText(textVal);
         }, 3000);
    }
    
});

$(".chatInput").keyup(function(event) {
    if (event.keyCode === 13) {
        var textVal = $(".chatInput").val();
        if(textVal != "" || textVal.length != 0) {
            var options = {
                templateId: '#temp_usermsg',
                msgContainerId: '#chatContent',
                textMsg: textVal
            };
            showMustacheTemplateText(options);
            scrollChatDown();
            setTimeout(function(){ 
                respnseFromText(textVal);
            }, 3000);
        }
    }
});

function checkString(inputString,keyWord) {
    var a = inputString;
    if (a.indexOf(keyWord) > -1) {
    return true;
    } else {
    return false;
    }
}

showMustacheTemplateText = function (options) {
    var msg = {};
    msg.textMsg = options.textMsg;
    var template = $(options.templateId).html();
    var msgContainer = $(options.msgContainerId);
    Mustache.parse(template);
    var rendered = Mustache.render(template, msg);
    msgContainer.append(rendered); 
    if( options.templateId == "#temp_usermsg") {
        $(".chatInput").val("");
    }
    setTimetoEle();
    changeBotIcon();
};

showMustacheTemplateObj = function (options) {
    var msg = {};
    msg = options.textMsg;
    var template = $(options.templateId).html();
    var msgContainer = $(options.msgContainerId);
    Mustache.parse(template);
    var rendered = Mustache.render(template, msg);
    msgContainer.append(rendered);
    if( options.templateId == "#temp_usermsg") {
        $(".chatInput").val("");
    }
    setTimetoEle();
    changeBotIcon();
};


function showWelcomeBotMsg(response){
    //var loadedLang = response.language;
	lang_array = {'French':'fr','English':'en','German':'de','Portuguese':'pt','Spanish':'es'}
	google_lang = lang_array[response.language]
	//$('.goog-te-combo').find('select').
	
    //googleTranslateElementInit(google_lang);
    //var loadedLang = "fr";
    //$(".goog-te-combo").hide();
	$(".goog-te-combo").val(google_lang);
    $(".goog-te-combo > [value='" + google_lang + "']").attr("selected", "true");
    var options = {
        templateId: '#temp_botText',
        msgContainerId: '#chatContent',
        textMsg: response.response
    };
    showMustacheTemplateText(options);
    textToSpeech(options.textMsg);
    scrollChatDown();
	$.getScript( "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit", function( data, textStatus, jqxhr ) {
		$(".preLoader").delay(2000).fadeOut(function(){
			$("body").addClass("loaded");
			changePlaceHolderText();
		});

	});
	//$(".goog-te-combo option[value='fr']").remove();
	
//    setTimeout(function () {
//        var options = {
//            templateId: '#temp_botTextActions',
//            msgContainerId: '#chatContent',
//            textMsg: ""
//        };
//        showMustacheTemplateText(options);
//        scrollChatDown();
//    }, 3000);
}
function googleTranslateElementInit(){
	document.cookie="googtrans=/en/"+google_lang;
	new google.translate.TranslateElement({defaultLanguage: google_lang,includedLanguages: 'en,fr,de,pt,es'}, 'google_translate_element');
}



/***show me some footer suugestions */
$(document).on("click",".botFooter .suggestionsList span",function(){
    var suggestionVal = $(this).attr("data-val");
    var options = {
        templateId: '#temp_usermsg',
        msgContainerId: '#chatContent',
        textMsg: suggestionVal
    };
    console.log("test:"+suggestionVal);
    showMustacheTemplateText(options);
    scrollChatDown();

    setTimeout(function(){ 
        respnseFromText(suggestionVal);
    }, 3000);
});

$(document).on("click",".chatMsg .suggestionsList span",function(){
	var suggestionVal = $(this).html().toString();
	respnseFromText(suggestionVal);
});

function respnseFromText(textVal){
        var selectedLang = $(".selectValHidden").val();
       var data_message={"message":textVal,"language":selectedLang}
       console.log("In something else")
       $.ajax({
			url: '/helpdesk/chat/',
			type: 'POST',
			data: data_message,
			success: function(response){
			console.log("response: "+response.response);
			console.dir(response);



            if(response.output =="Status"){
            console.log("Here in status");
            console.dir(response);
                 var options = {
                        templateId: '#temp_status',
                        msgContainerId: '#chatContent',
                        textMsg: response
                };
                showMustacheTemplateText(options);
                $(options.msgContainerId).find(".botMsg:last-child .tSuccess").html(options.textMsg);
                scrollChatDown();
            }
            else if(response.output =="quick_menu"){
                 var options = {
                        templateId: '#temp_botText',
                        msgContainerId: '#chatContent',
                        textMsg: response.response
                };
                showMustacheTemplateText(options);
                scrollChatDown();
                setTimeout(function(){
			    var options = {templateId: '#temp_nbContent',msgContainerId: '#chatContent',textMsg:response,category_required:response.category_required,category:response.category,data:response.data,domain_name:response.domain_name};

                showMustacheTemplateText(options);
                scrollChatDown();
			},3000)
            }

            else
            {
            console.log("Here in else of table")
            var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:response.response,category_required:response.category_required,category:response.category,domain_name:response.domain_name};
                var taskType = options.textMsg;
             showMustacheTemplateText(options);
			textToSpeech(options.textMsg);
                          scrollChatDown();
			if(response.output == "table"){
			console.log("here in asbc table")
			setTimeout(function(){
			    var options = {templateId: '#temp_table',msgContainerId: '#chatContent',textMsg:response,category_required:response.category_required,category:response.category,data:response.data,domain_name:response.domain_name};

                showMustacheTemplateText(options);
                $(options.msgContainerId).find(".chatMsg:last-child .text .taskType").val(taskType);
                //taskType
                scrollChatDown();
                 //showGraph();
			},3000)

			}


             else if (response.output =="pdf"){
                        var options = {templateId: '#temp_downloadBtns',msgContainerId: '#chatContent',
                        textMsg:response,category_required:response.category_required,category:response.category,data:response.data,domain_name:response.domain_name};
                 showMustacheBotSuggestions(options);
                $(options.msgContainerId).find(".botMsg:last-child .tSuccess").html(options.textMsg);
                scrollChatDown();


			}

            }
			
			}

			,error:function(response){
				var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:"Limited Demo version"};
				showMustacheTemplateText(options);
				textToSpeech(options.textMsg);
				scrollChatDown();
			}
		});

        //showMustacheTemplateText(options);
        scrollChatDown();
}


/**text to speech */
function textToSpeech(textVal) {
  if ('speechSynthesis' in window) {
      var text = textVal;
      //msg.voice = voices[$('#voices').val()];
      voiceMsg.text = textVal;
      voiceMsg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      if(voiceAllowed === 1) {
        AWS.config.accessKeyId ='AKIAJY5O4CR3LOUOD3DA';
        AWS.config.secretAccessKey = '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';
        AWS.config.region = 'us-east-2';

        var polly = new AWS.Polly();


        var speechParams = {
             OutputFormat: "mp3",
             SampleRate: "16000",
             Text: voiceMsg.text,
             TextType: "text",
             VoiceId: "Salli"
        };

        polly.synthesizeSpeech(speechParams, function(err,data)
        {

                var uInt8Array = new Uint8Array(data.AudioStream);
                var arrayBuffer = uInt8Array.buffer;
                var blob = new Blob([arrayBuffer]);

                var audio = $('audio');
                var url = URL.createObjectURL(blob);
                audio[0].src = url;
                audio[0].play();


        });
      }
      else
      {
        speechSynthesis.cancel();
      }

  }
}


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



$(document).on("click",".iconVoice",function(){
    $(this).toggleClass("iconVoiceBan");
    if(voiceAllowed === 1) {
        voiceAllowed = 0;
        speechSynthesis.cancel();
    }
    else
    {
        voiceAllowed = 1;
    }
   
});

function changeBgImg() {
    var bgImages = [1,2,3,4];
    var randomNum = Math.floor(Math.random() * bgImages.length);
    $('span.pagBg').css({'background-image': 'url(images/bgDesk/' + randomNum + '.png)'});
}


$(document).on("click",".btnFeeds",function(){
    $(".pgBotContent").toggleClass("pgBotCFeedClosed");
    setTimeout(function() {
		sliderReInit();
	}, 1000);
});



function truncateFeedText() {
    var truncateTextLength = 100;
    $(".feedsList .box").each(function() {
    var $feedText = $(this).find(".feedText");
    var text = $feedText.text();

    if(text.length > truncateTextLength) {
        $feedText.text(text.substring(0, (truncateTextLength -4)) + "...");
    }
    });
}






/***show feed suggestions */

// showMustacheTemplateFeedsSuggestions = function (options) {
//     $.getJSON("data/news_feed.json", function (data) {
//         var template = $(options.templateId).html();
//         var msgContainer = $(options.msgContainerId);
//         Mustache.parse(template);
//         var rendered = Mustache.render(template, data);
//         msgContainer.append(rendered);
//         truncateFeedText();
//     });
// };


/**rating stars */

$(document).on("click",".divStars > i",function(){
    $(this).toggleClass("active");
    $(this).prevAll().removeClass("active");
    $(this).nextAll().addClass("active");

});
/**confirm appointment */
$(document).on("click",".botMsg .cActionBtns > .cBtnConfirm",function(){
    var options = {
        templateId: '#temp_botText',
        msgContainerId: '#chatContent',
        textMsg: "Your appointment has been confirmed for the selected date. Thank You!"
    };
    showMustacheTemplateText(options);
    //textToSpeech(options.textMsg);
    scrollChatDown();
});
/**edit details */
$(document).on("click",".botMsg .cActionBtns > .cBtnEdit",function(){
    var options = {
        templateId: '#temp_editAppointmentDetails',
        msgContainerId: '#chatContent',
        textMsg: ""
    };
    showMustacheTemplate(options);
    scrollChatDown();
});
/***edit appointment mustache template ends */

/***show card related info in chatbox */
$(document).on("click",".feedBox.flipBox",function(){
    $(".feedBox").removeClass("active");
    if(ww < 1100) {
        $(this).addClass("active");
    }
    var dataAttr = $(this).attr("data-attr");
    var options = {
        templateId: '#temp_'+dataAttr,
        msgContainerId: '#chatContent',
        textMsg: ""
    };
    showMustacheTemplate(options);
    if (!(navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))){
        if(ww>801){
            $(".chatMsgProduct.botMsg .text").mCustomScrollbar();
        }
        
    }
    scrollChatDown();
});
$(document).on("click",".rateXpBtnsDiv > span",function(){
    var spanText = $(this).html();
    var textVal = "I would like to rate on "+spanText;
    if(textVal != "" || textVal.length != 0) {
        var options = {
            templateId: '#temp_usermsg',
            msgContainerId: '#chatContent',
            textMsg: textVal
        };
        showMustacheTemplateText(options);
        scrollChatDown();

        setTimeout(function(){ 
            var options = {
                templateId: '#temp_giveratings',
                msgContainerId: '#chatContent',
                textMsg: ""
            };
            showMustacheTemplate(options);
            $(options.msgContainerId).find(".chatRatings .text > p").html("Rate your "+spanText+" experience");
            scrollChatDown();
         }, 2000);
    }
    
});
showMustacheTemplate = function (options) {
    var msg = {};
    msg.textMsg = options.textMsg;
    var template = $(options.templateId).html();
    var msgContainer = $(options.msgContainerId);
    Mustache.parse(template);
    var rendered = Mustache.render(template, msg);
    msgContainer.append(rendered);
    setTimetoEle();
    changeBotIcon();
    $('.inputDatepickerDiv .form-control').datepicker({
        minDate: 0
    });
};
$(document).on("change",'.inputDatepickerDiv .form-control',function(){
    var selectedDate = $(this).datepicker('getDate').getUTCDay();
    if(selectedDate == '5' || selectedDate == '6'){
        var options = {
           templateId: '#temp_weekend',
           msgContainerId: '#chatContent',
           textMsg: ""
        };
        showMustacheTemplate(options);
        scrollChatDown();
    }
    else
    {
        var options = {
            templateId: '#temp_botText',
            msgContainerId: '#chatContent',
            textMsg: "Your appointment has been confirmed for the selected date. Thank You!"
        };
        showMustacheTemplateText(options);
        scrollChatDown();
    }

});

$(document).on("click",".bYes",function(){
    var options = {
           templateId: '#temp_editAppointmentDetails',
           msgContainerId: '#chatContent',
           textMsg: ""
    };
    showMustacheTemplate(options);
    scrollChatDown();
})

$(document).on("click",".bNo",function(){
    var options = {
            templateId: '#temp_botText',
            msgContainerId: '#chatContent',
            textMsg: "Your appointment has been confirmed for the selected date. Thank You!"
        };
        showMustacheTemplateText(options);
        scrollChatDown();
})


function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function currentTime() {
    var dt = new Date();
    var time = "<i>"+checkTime(dt.getHours())+"</i>" + " " + "<i>"+checkTime(dt.getMinutes())+"</i>";
    return time;
}
function setTimetoEle(){
    $("#chatContent").find(".chatMsg").last().find(".pTime").html(currentTime());
}


/***slider events**/
function sliderInit(){
var btnNextEle = '<div class="btnNav btnNext"><i class="icon ion-ios-arrow-right" aria-hidden="true"></i></div>';
var btnPrevEle = '<div class="btnNav btnPrev"><i class="icon ion-ios-arrow-left" aria-hidden="true"></i></div>';
$(".sliderContainer").each(function(){
    
    var parentWidth = $(this).width();
    var sliderWidth = $(this).find(".sliderDiv").width();

   if(parentWidth < (sliderWidth - 50)){
        $(this).append(btnNextEle);
        $(this).append(btnPrevEle);
   }
    
    console.log("parentWidth: "+ parentWidth + " sliderWidth: "+sliderWidth);
    var moveDistance = sliderWidth/10;
    var ttd = 0;

    $(this).find(".sliderDiv").on("swipeleft", function(){
        if(ttd < (sliderWidth - parentWidth )) {
            if(!($(this).is(':animated'))){
                ttd = ttd + moveDistance;
                $(this).stop().animate({ "left": "-="+moveDistance+"px" } );
                $(this).parent().find(".btnPrev").fadeIn();
            }
        }
        else
        {
            ttd = sliderWidth - parentWidth;
            $(this).parent().find(".btnNext").hide();
        }
        console.log("ttdnext: "+ttd);
    });
    $(this).find(".btnNext").click(function(){
        if(ttd < (sliderWidth - parentWidth )) {
            if(!($(this).parent().find(".sliderDiv").is(':animated'))){
                ttd = ttd + moveDistance;
                $(this).parent().find(".sliderDiv").stop().animate({ "left": "-="+moveDistance+"px" } );
                $(this).parent().find(".btnPrev").fadeIn();
            }
        }
        else
        {
            ttd = sliderWidth - parentWidth;
            $(this).parent().find(".btnNext").hide();
        }
        console.log("ttdnext: "+ttd);
    });

    $(this).find(".btnPrev").click(function(){
        if(ttd > 0) {
            if(!($(this).parent().find(".sliderDiv").is(':animated'))){
                ttd = ttd - moveDistance;
                $(this).parent().find(".sliderDiv").stop().animate({ "left": "+="+moveDistance+"px" } );
                $(this).parent().find(".btnNext").fadeIn();
            }
        }
        else
        {
            ttd = 0;
            $(this).parent().find(".btnPrev").hide();
        }
        console.log("ttdprev: "+ttd);
    })
     $(this).find(".sliderDiv").on("swiperight", function(){
        if(ttd > 0) {
            if(!($(this).is(':animated'))){
            ttd = ttd - moveDistance;
            $(this).stop().animate({ "left": "+="+moveDistance+"px" } );
            $(this).parent().find(".btnNext").fadeIn();
            }
        }
        else
        {
            ttd = 0;
            $(this).parent().find(".btnPrev").hide();
        }
        console.log("ttdprev: "+ttd);
    })

});
}

function sliderReInit(){
    var btnNextEle = '<div class="btnNav btnNext"><i class="icon ion-ios-arrow-right" aria-hidden="true"></i></div>';
    var btnPrevEle = '<div class="btnNav btnPrev"><i class="icon ion-ios-arrow-left" aria-hidden="true"></i></div>';
    $(".sliderContainer .btnNav").remove();
    $(".sliderContainer").find(".sliderDiv").css("left","0px");
    sliderInit();
}

function changeBotIcon(){
    $(".botImg > img").attr("src","/static/images/botIcon_static.png");
    $(".chatContent").find(".botMsg").last().find(".botImg > img").attr("src","/static/images/botIcon3.gif");
}


/**change div function */
var cTimer = null;
function changeFeed(){
    $(".changeDiv").each(function(){
        var thisElement = $(this);
        var childCount = thisElement.find(".feedBox").length;
        loopFeedImages(thisElement,childCount);
          
    })
}

function loopFeedImages(thisElement,childCount){
    var thisCounter = 1;
    cTimer = setInterval(function () {
        if(!(thisElement.find(".feedBox").hasClass('fixMe'))){
            if (thisCounter > childCount) {
                thisCounter = 1;
            }
            thisElement.find(".feedBox").removeClass("showMe");
            thisElement.find(".feedBox:nth-child(" + thisCounter + ")").addClass("showMe");
            thisCounter++;
        }
    }, 20000); 
}

$(".changeDiv .feedBox").hover(function() {
    $(this).addClass('fixMe');
},function() {
    $(this).removeClass('fixMe');
});

$(document).on("click",".fglist .igAction > span",function(){
    //var inputVal = $(this).closest(".fglist").find(".taskname").val();
    var inputContainer = $(this).closest(".fglist");
    addToList(inputContainer);
});

$(document).on("keyup",'.fglist .igAction > .taskname',function(e){
    if(e.keyCode == 13) {
    alert("11");
        var inputContainer = $(this).closest(".fglist");
        addToList(inputContainer);
    }
});


function addToList(inputContainer){
    var inputVal = inputContainer.find(".taskname").val();
    if(inputVal != "" || inputVal.length != 0){
        inputContainer.find(".taskList").append('<li><span>' + inputVal + '</span><i class="icon ion-android-close"></i>' + '</li>');
        inputContainer.find(".taskname").val("");
    }
}
$(document).on("click",".taskList > li i",function(e){
	$(this).parent().remove();
});

$(document).on("click",".cTaskList table tbody tr td:last-child a",function(e){
    var taskTxt = $(this).closest("tr").find("td:first-child").html();
    var options = {
        templateId: '#temp_botText',
        msgContainerId: '#chatContent',
        textMsg: "<p>Here are the details about the status of task:</p><p> <b>"+taskTxt+":</b> Failure </p><p><b>Reason:</b> API Unavailable</p><p> Contact: <a href='mailto:hr@quinnox.com'>Support Team</a></p>"
    };
    showMustacheTemplateText(options);
    scrollChatDown();
});


$(".bDatePicker").change(function() {
    var sDate = $(this).datepicker({ dateFormat: 'dd-mm-yyyy' }).val();
    if(sDate != "null"){
        var options = {
           templateId: '#temp_scheduleTask',
           msgContainerId: '#chatContent',
           textMsg: ""
        };
        showMustacheTemplate(options);
        scrollChatDown();

        $(".scheduleTaskCalendar.botMsg .text h4 span").html(sDate);
    }
});

/**show graph**/
$(document).on("click",".btGraphLinkTC table tbody tr td a",function(){
    var taskType = $(this).closest(".text").find(".taskType").val();
    var options = {
            templateId: '#temp_graph',
            msgContainerId: '#chatContent',
            textMsg: ""
    };
    showMustacheTemplateText(options);
    scrollChatDown();
    showGraph(taskType);
});



/*
 * jQuery Easing v1.3 - https://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

(function(win) {
  var requestAnimationFrame = win.requestAnimationFrame || win.mozRequestAnimationFrame ||
                              win.webkitRequestAnimationFrame || win.msRequestAnimationFrame;
  win.requestAnimationFrame = requestAnimationFrame;
})(this);

(function(win, doc, $) {

  "use strict"

  function Bubble(ctx, x, y, r) {
    var SWING_LEVEL = 5,
        model = {
          top: y,
          left: x,
          size: 0,
          color: "rgba(255, 255, 255, " +  (0.4 + Math.random() / 4) + ")",
          innerRate: 0.4 + Math.random() / 4,
          param: {
            ctx: ctx,
            x: x,
            y: y,
            r: r
          }
        };

    this.model = model;
    this.$model = $(this.model);
    this.ctx = ctx;
    this.swingLevel = SWING_LEVEL * Math.random();

    this.born();
    this.flow();
    this.draw();
  }

  Bubble.prototype._progress = function(_, per) {
    this.model.left = this.model.left + Math.sin(2 * Math.PI * per * this.swingLevel);
  };

  Bubble.prototype._compleate = function() {
    this.model.size = 0;
    this.model.top = this.model.param.y;

    this.born();
    this.flow();
  };

  Bubble.prototype.draw = function() {
    var ctx = this.ctx;

    ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = this.model.color;
      ctx.beginPath();
        ctx.arc(this.model.left, this.model.top, this.model.size, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.beginPath();
          ctx.arc(this.model.left, this.model.top - (1 - this.model.size) * this.model.innerRate, this.model.size * this.model.innerRate, 0, Math.PI * 2, false);
        ctx.fill();
      ctx.restore();
    ctx.restore();
  };

  Bubble.prototype.born = function() {
    var SINK_DISTANCE = 50,
        DURATION = 500;

    this.$model.animate({
      size: this.model.param.r,
      top: this.model.top + SINK_DISTANCE * Math.random() | 0
    }, DURATION * Math.random() | 0);
  };

  Bubble.prototype.flow = function() {
    var EASING_TYPE = "easeInCubic",
        DURATION = 4000;

    this.$model.animate({
      top: -this.model.param.r
    }, {
      easing: EASING_TYPE,
      progress: this._progress.bind(this),
      complete: this._compleate.bind(this),
      duration: DURATION - (DURATION / 1.5 * Math.random() | 0)
    });
  };

  function BubbleManager(ctx, width, height, bottomLimit, maxSize, length) {
    var bubbles = [];

    for (var i = 0; i < length; ++i) {
      bubbles.push(new Bubble(
        ctx,
        width * Math.random(),
        height - bottomLimit * Math.random(),
        maxSize * Math.random()
      ));
    }

    this.length = length;
    this.bubbles = bubbles;
  }

  BubbleManager.prototype.draw = function() {
    for (var i = 0, length = this.length; i < length; ++i) {
      this.bubbles[i].draw();
    }
  }

  var canvas = doc.getElementById("canvas"),
      ctx = canvas.getContext("2d"),
      canvasWidth = win.innerWidth,
      canvasHeight = win.innerHeight;

  _init();

  function _init() {
    var BOTTOM_LIMIT = canvasHeight,
        BUBBLE_MAX_SIZE = 5,
        BUBBLE_LENGTH = canvasWidth | 0;

    var bubbleManager = new BubbleManager(
          ctx,
          canvasWidth,
          canvasHeight,
          BOTTOM_LIMIT,
          BUBBLE_MAX_SIZE,
          BUBBLE_LENGTH
        );

    _setCnavasSize();
    requestAnimationFrame(_draw);

    function _draw() {
      _setCnavasSize();
      bubbleManager.draw();
      requestAnimationFrame(_draw);
    }
  }

  function _setCnavasSize() {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

})(this, document, $);












