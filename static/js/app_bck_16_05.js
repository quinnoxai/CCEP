var ww = $(window).width();
var images = [];
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
    loadFiles();
    
});


function loadFiles() {
    var t = new Date();
    var hr = t.getHours();
    var min = t.getMinutes();
    var sec = t.getSeconds();
    var qVar = hr +"_"+ min +"_"+ sec;
    $("head").append('<link href="css/fonts.css?q='+qVar+'" rel="stylesheet">');
    //$("head").append('<link href="css/style.css?q='+qVar+'" rel="stylesheet">');
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
};


function showWelcomeBotMsg(){
    var options = {
        templateId: '#temp_botText',
        msgContainerId: '#chatContent',
        textMsg: "Hi, Sara.<br> Welcome back to Kaya Buddy."
    };
    showMustacheTemplateText(options);
    //textToSpeech(options.textMsg);
    scrollChatDown();
    setTimeout(function () {
        var options = {
            templateId: '#temp_botTextActions',
            msgContainerId: '#chatContent',
            textMsg: "Your upcoming appointment is in <strong>next 04 days</strong>.<br> Date: <strong>20 Apr 2019</strong><br>Time: <strong>14:00 hrs</strong><br>Location: <strong>Viviana Mall, Thane</strong>"
        };
        showMustacheTemplateText(options);
        scrollChatDown();
    }, 3000);
}





/***show me some footer suugestions */
$(document).on("click",".botFooter .suggestionsList span",function(){
    var suggestionVal = $(this).html();
    var options = {
        templateId: '#temp_usermsg',
        msgContainerId: '#chatContent',
        textMsg:suggestionVal
    };
    showMustacheTemplateText(options);
    scrollChatDown();

    setTimeout(function(){ 
        respnseFromText(suggestionVal);
    }, 3000);
});

function respnseFromText(textVal){
    var stringFound1 = checkString(textVal,'kaya smile');
    var stringFound2 = checkString(textVal,'prescribed medicines');
    var stringFound3 = checkString(textVal.toLowerCase(),'upcoming appointments');
    // console.log(textVal)
   // if(stringFound1){
       // var options = {
           // templateId: '#temp_kayasmiles',
           // msgContainerId: '#chatContent',
           // textMsg: ""
       // };
       // showMustacheTemplate(options);
   // }
   // else if(stringFound2){
       // var options = {
           // templateId: '#temp_chatinProducts',
           // msgContainerId: '#chatContent',
           // textMsg: ""
       // };
       // showMustacheTemplate(options);
   // }
   // else if(stringFound3){
       // var options = {
           // templateId: '#temp_chatProductDescription',
           // msgContainerId: '#chatContent',
           // textMsg: ""
       // };
       // showMustacheTemplate(options);
   // }

    if (stringFound3){
    var options = {
            templateId: '#temp_botTextActions',
            msgContainerId: '#chatContent',
            textMsg: "Your upcoming appointment is in <strong>next 04 days</strong>.<br> Date: <strong>20 Apr 2019</strong><br>Time: <strong>14:00 hrs</strong><br>Location: <strong>Viviana Mall, Thane</strong>"

        };
        showMustacheTemplate(options);
    }
      else
    {
       var data_message={"message":textVal}
       $.ajax({
			url: '/kaya/chat/',
			type: 'POST',
			data: data_message,
			success: function(response){
//			console.log("res: "+JSON.stringify(response.data));
			var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:response.response,category_required:response.category_required,category:response.category,data:response.data,domain_name:response.domain_name};
			if(options.category == "smiles") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_kayasmiles',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",textMsg:response.response};
                        showMustacheTemplate(options);
                        scrollChatDown();
                    }, 500);
                }
            else if(options.category == "medicines") {
            showMustacheTemplateText(options);
			textToSpeech(options.textMsg);
                    setTimeout(function () {
                        var options = {templateId: '#temp_chatinProducts',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",textMsg:response.response};
                        showMustacheTemplate(options);
                        scrollChatDown();
                    }, 500);
                }
             else if(options.category == "referral") {
                    setTimeout(function () {
                        var options = {templateId: '#temp_chatProductDescription',msgContainerId: '#chatContent',type_content: "all",category_required:"no",category:"",textMsg:response.response};
                        showMustacheTemplate(options);
                        scrollChatDown();
                    }, 500);
                }
             else if(options.category == "small_talk") {
showMustacheTemplateText(options);
			textToSpeech(options.textMsg);
                          scrollChatDown();
                }
			
			}
			,error:function(response){
				var options = {templateId: '#temp_botText',msgContainerId: '#chatContent',textMsg:"Limited Demo version"};
				showMustacheTemplateText(options);
				textToSpeech(options.textMsg);
				scrollChatDown();
			}
		});
    }
    textToSpeech(options.textMsg);
    scrollChatDown();
}

/**text to speech */
function textToSpeech(textVal) {
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
}





var voiceAllowed = 1;
$(document).on("click",".iconVoice",function(){
    $(this).toggleClass("iconVoiceBan");
    if(voiceAllowed === 1) {
        voiceAllowed = 0;
    }
    else
    {
        voiceAllowed = 1;
    }
   
});

function changeBgImg() {
    var bgImages = [1,2,3,4,5,6,7,8,9];
    var randomNum = Math.floor(Math.random() * bgImages.length);
    $('span.pagBg').css({'background-image': 'url(images/bgDesk/' + randomNum + '.jpg)'});
}


$(document).on("click",".btnFeeds",function(){
    $(".pgBotContent").toggleClass("pgBotCFeedClosed");
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
        textMsg: "Your appointment has been confirmed."
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
$(document).on("click",".feedBox",function(){
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
    if(ww > 1100) {
        $(".chatMsgProduct.botMsg .text").mCustomScrollbar({
            //scrollInertia: 200,
        });
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
};


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
    var sliderWidth = $(this).find(".sliderDiv").get(0).scrollWidth;
    if(sliderWidth > parentWidth){
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
                $(this).parent().find(".sliderDiv").stop().animate({ "left": "+="+moveDistance+"px" }, 1000 );
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
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });