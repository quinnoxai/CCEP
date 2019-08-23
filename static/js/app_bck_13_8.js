var ww = $(window).width();
var images = [];
var voiceMsg = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
var voiceAllowed = 0;
function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}
/*preload("images/bg1.jpg"); */
$(window).on("load",function(){
    //$(".botContent").mCustomScrollbar();
    $(".preLoader").delay(2000).fadeOut(function(){
        $("body").addClass("loaded");


    });
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
var n = d.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
    $(".time_widget > span").html(n);
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

    var options = {
        templateId: '#temp_botText',
        msgContainerId: '#chatContent',
        textMsg: response.response
    };
    console.log("Welcome");

    showMustacheTemplateText(options);
    textToSpeech(options.textMsg);
    scrollChatDown();
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





/***show me some footer suugestions */
$(document).on("click",".botFooter .suggestionsList span",function(){
    var suggestionVal = $(this).html();
    var options = {
        templateId: '#temp_usermsg',
        msgContainerId: '#chatContent',
        textMsg: suggestionVal
    };
    console.log("test:"+options.textMsg);
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

       var data_message={"message":textVal}
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
      voiceMsg.text = text;
      voiceMsg.onend = function(e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
      };
      if(voiceAllowed === 1) {
        speechSynthesis.speak(voiceMsg);
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
    var time = checkTime(dt.getHours()) + ":" + checkTime(dt.getMinutes());
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
















