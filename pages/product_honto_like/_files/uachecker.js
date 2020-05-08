smnLogicadSfManager.isIosSafari=function(){
var u=window.navigator.userAgent.toLowerCase(),
c=function(s){return-1!=u.indexOf(s)},
d=function(s){return!c(s)};
return (c("iphone")||c("ipod")||c("ipad"))
&&d("crios")&&d("opera")&&d("opios")&&d("fxios")
&&d("google")&&d("yahoo")&&d("y!j")&&d("bing")
&&d("bot")&&d("crawl")&&d("spider")};