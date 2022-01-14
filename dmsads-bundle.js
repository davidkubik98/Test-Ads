var DMSAds = DMSAds || {};


var DMSAds = (function() {

    return {
        isWindowLoaded: DMSAds.isWindowLoaded || false,
        cmd: DMSAds.cmd || [],
        call: function(command) {
            if (DMSAds.isWindowLoaded) {
                command();
            } else {
                DMSAds.cmd.push(command);
            }
        },

        helpers: (function() {

            var DMSADS_CSS = 'https://cdn.jsdelivr.net/gh/davidkubik98/Test-Ads/style.css'

            var insertedCSS = [];
            var insertedJS = [];

            return {
                requireStyleSheet: function(href) {

                    if (insertedCSS.indexOf(href) > -1) {
                        return;
                    }

                    var fileref = document.createElement("link")
                    fileref.setAttribute("rel", "stylesheet")
                    fileref.setAttribute("type", "text/css")
                    fileref.setAttribute("href", href)
                    document.getElementsByTagName("head")[0].appendChild(fileref)

                    insertedCSS.push(href);

                },
                requireJS: function(src, callback) {

                    if (insertedJS.indexOf(src) > -1) {
                        return;
                    }

                    var fileref = document.createElement('script')
                    fileref.setAttribute("type", "text/javascript")
                    fileref.setAttribute("src", src);
                    document.body.appendChild(fileref);

                    if (fileref.readyState) {
                        fileref.onreadystatechange = function() {
                            if (fileref.readyState == "loaded" ||
                                fileref.readyState == "complete") {
                                fileref.onreadystatechange = null;
                                if (callback) {
                                    callback();
                                }
                            }
                        };
                    } else {
                        fileref.onload = function() {
                            if (callback) {
                                callback();
                            }
                        };
                    }

                    insertedJS.push(src);

                },
                requireIMACSS: function() {
                    DMSAds.helpers.requireStyleSheet(DMSADS_VJS_CONTRIB_ADS_CSS);
                    DMSAds.helpers.requireStyleSheet(DMSADS_VJS_IMA_CSS);
                },
                requireGlobalCSS: function() {
                    DMSAds.helpers.requireStyleSheet(DMSADS_CSS);
                },
                requireVJSCSS: function() {
                    DMSAds.helpers.requireStyleSheet(DMSADS_VJS_CSS);
                },
                requireVJSIMAPlugin: function(callback) {
                    DMSAds.helpers.requireJS(DMSADS_VJS_IMA_PLUGIN, callback);
                },
                requireVJSContribAds: function(callback) {

                    DMSAds.helpers.requireJS(DMSADS_VJS_CONTRIB_ADS, callback);
                },
                requireVJSIMASDK: function(callback) {

                    DMSAds.helpers.requireJS(DMSADS_VJS_IMA_SDK, callback);
                },

                requireVJSScripts: function(callback) {

                    var todo = function() {
                        videojs.options.flash.swf = DMSADS_VJS_FLASH;
                    }

                    var loadVJS = false;
                    var loadFlash = false;

                    DMSAds.helpers.requireJS(DMSADS_VJS_JS, function() {

                        if (callback) {
                            callback();
                        }

                        DMSAds.helpers.requireJS(DMSADS_VJS_FLASH_JS, function() {
                            videojs.options.flash.swf = DMSADS_VJS_FLASH;
                        });
                    });







                },
                requireVJSScriptsWithIMA: function(callback) {
                    DMSAds.helpers.requireJS(DMSADS_VJS_IMA_JS_BUNDLE, function() {

                        if (callback) {
                            callback();
                        }

                        DMSAds.helpers.requireJS(DMSADS_VJS_FLASH_JS, function() {
                            videojs.options.flash.swf = DMSADS_VJS_FLASH;
                        });
                    });
                },

                isAdFilled: function(container) {
                    for (var i = 0; i < container.children.length; i++) {
                        var child = container.children[i];
                        if (child.clientHeight > 10) {
                            return true;
                        }
                    }
                    return false;
                },

                isElementInView: function(container, offset) {
                    var isHidden = document.hidden || document.msHidden || document.webkitHidden || document.mozHidden;
                    if (isHidden) {
                        return false;
                    }
                    var rect = container.getBoundingClientRect();
                    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
                    var checkPoint = rect.top - offset;
                    var windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    return (windowScrollTop + windowHeight > checkPoint)

                },



            }
        })(),

        scrollerAds: (function() {

            var INTERSCROLLER = 1;
            var MIDSCROLLER = 2;

            var DMSADS_INTERSCROLLER_BACKUP = 'https://antteam.com.sg/wp-content/uploads/2018/03/Facebook-Ad-Secrets-Banner.png';

            var DMSADS_IS_LOADED_KEY = 'data-dmsads-is-loaded';
            var DMSADS_MAX_HEIGHT_KEY = 'data-max-height';

            var makeElement = function(tag, id, css) {
                var element = document.createElement(tag);
                element.id = id;
                for (key in css) {
                    element.style[key] = css[key];
                }
                return element;
            }

            var createCaption = function(title, className) {
                var div = document.createElement('DIV');
                div.className = className;
                var p = document.createElement('P');
                p.innerText = title;
                div.appendChild(p);
                return div;
            }

            var containerAdvertisementId = function(containerContentId) {
                return containerContentId + '-advertisement'
            }

            var createContentscroller = function(options) {

                var scrollerElement = createScrollerLayout(options);


                var scrollerContent = makeElement("DIV", options.containerContentId, {
                    width: '100%',
                    height: '100%',
                    left: '0',
                    top: '0'
                });

                var divElement = makeElement("DIV", containerAdvertisementId(options.containerContentId), {
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                });
                scrollerContent.appendChild(divElement);

                scrollerElement.appendChild(scrollerContent);
                bindContentScrollerEvents(options, containerAdvertisementId(options.containerContentId));
                return scrollerElement;



            }

            var createScrollerLayout = function(options) {
                var scrollerElement = makeElement("DIV", options.containerId, {
                    width: document.body.scrollWidth + "px",
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: options.backgroundColor || 'rgb(180, 180, 180)',
                    //left: (document.getElementById(options.targetId).getBoundingClientRect().x * -1) + "px",
                    zIndex: '30000000',
                    height: 0
                });

                scrollerElement.setAttribute(DMSADS_MAX_HEIGHT_KEY, options.height || '100vh');

                scrollerElement.appendChild(createCaption(options.topText, 'dmsads-text-caption dmsads-text-caption-top'));
                scrollerElement.appendChild(createCaption(options.bottomText, 'dmsads-text-caption dmsads-text-caption-bottom'));
                return scrollerElement;
            }


            var createInterscroller = function(options) {

                //interscrollerheight

                var scrollerElement = createScrollerLayout(options);
                var scrollerContent = makeElement("DIV", options.containerContentId, {
                    position: 'absolute',
                    width: '100%',
                    height: '100vh',
                    left: '0',
                    top: '0'
                });
                var divElement = makeElement("DIV", containerAdvertisementId(options.containerContentId), {
                    width: '100%',
                    height: '100%',
                    background: 'url(' + DMSADS_INTERSCROLLER_BACKUP + ') no-repeat center center fixed',
                    webkitBackgroundSize: 'cover',
                    mozBackgroundSize: 'cover',
                    oBackgroundSize: 'cover',
                    backgroundSize: 'cover'
                });
                scrollerContent.appendChild(divElement);
                scrollerElement.appendChild(scrollerContent);
                bindInterScrollerEvents(options.containerId, options.containerContentId);
                bindScrollerObserver(scrollerElement, divElement);


                return scrollerElement;
            }

            var checkScrollerVisibility = function(containerId, containerAdvertisementId, offset, writeAd) {

                var scroller = document.getElementById(containerId);
                var isLoaded = scroller.getAttribute(DMSADS_IS_LOADED_KEY);

                if (!isLoaded) {
                    var rect = scroller.getBoundingClientRect();
                    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
                    var checkPoint = rect.top - offset;
                    var windowScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    if (windowScrollTop + windowHeight > checkPoint) {

                        scroller.setAttribute(DMSADS_IS_LOADED_KEY, "true");

                        if (writeAd) {
                            writeAd(containerAdvertisementId);
                        } else {
                            console.log('DMSAds: no write ad function present');
                        }
                    }
                }
            }

            var bindScrollerAdsEvent = function(containerId, containerContentId, offset, writeAd) {
                checkScrollerVisibility(containerId, containerContentId, offset, writeAd);
                window.top.addEventListener('scroll', function() {
                    checkScrollerVisibility(containerId, containerContentId, offset, writeAd);
                });

            }



            var bindScrollerObserver = function(container, advertisementContainer) {
                var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                if (MutationObserver) {
                    var observer = new MutationObserver(function(mutations) {
                        if (DMSAds.helpers.isAdFilled(advertisementContainer)) {
                            container.style.height = container.getAttribute(DMSADS_MAX_HEIGHT_KEY);
                        }
                    });

                    observer.observe(advertisementContainer, {
                        attributes: true,
                        childList: true,
                        characterData: true
                    });

                } else {
                    advertisementContainer.addEventListener("DOMNodeInserted", function() {
                        if (DMSAds.helpers.isAdFilled(advertisementContainer)) {
                            container.style.height = container.getAttribute(DMSADS_MAX_HEIGHT_KEY);
                        }
                    });
                }



            }


            var bindContentScrollerEvents = function(options, advertisementContainerId) {



                window.top.addEventListener('scroll', function() {




                    var scrollY = window.top.scrollY;
                    var scroller = document.getElementById(options.containerId);
                    var rect = scroller.getBoundingClientRect();

                    var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
                    var pos = (scrollY + rect.top) - windowHeight;


                    var clientHeight = document.getElementById(advertisementContainerId).clientHeight;
                    var maxHeight = clientHeight + DMSAds.scrollerAds.defaultLastVisibleHeight + ((options.adMargin || DMSAds.scrollerAds.defaultMargin) * 2);
                    if (clientHeight < 10) {
                        maxHeight = 0;
                    }
                    var minHeight = options.minHeight || 0;
                    var mayShrink = options.mayShrink;
                    var lastVisibleHeight = DMSAds.scrollerAds.defaultLastVisibleHeight;
                    var marginBottom = options.marginBottom || DMSAds.scrollerAds.defaultMarginBottom;
                    if (scrollY + marginBottom > pos) {
                        var height = scrollY - pos - marginBottom;
                        if (height > maxHeight) {
                            height = maxHeight;
                        }
                        if (height < lastVisibleHeight) {
                            height = minHeight;
                        }

                        if (!mayShrink) {
                            if (scroller.clientHeight < height) {
                                scroller.style.height = height + "px";
                            }
                        } else {
                            scroller.style.height = height + "px";
                        }

                    }
                });
            }

            var bindInterScrollerEvents = function(containerId, containerContentId) {





                window.top.addEventListener('scroll', function() {
                    var containerContent = window.top.document.getElementById(containerContentId);
                    var rect = window.top.document.getElementById(containerId).getBoundingClientRect();
                    containerContent.style.top = (rect.top * -1) + "px";
                });




            }



            return {
                defaultOffset: 500,
                defaultLastVisibleHeight: 40,
                defaultMarginBottom: 200,
                defaultMargin: 5,
                init: function(options) {
                    DMSAds.helpers.requireGlobalCSS();
                    options.containerContentId = options.containerContentId || options.containerId + "-contents";
                    var scroller;
                    switch (options.type) {
                        case INTERSCROLLER:

                            scroller = createInterscroller(options);
                            break;
                        case MIDSCROLLER:
                            scroller = createContentscroller(options);
                            break;

                    }
                    window.top.document.getElementById(options.targetId).appendChild(scroller);
                    window.top.document.getElementById(options.targetId).style.maxWidth = "100%";
                    scroller.style.left = (document.getElementById(options.targetId).getBoundingClientRect().x * -1) + "px";
                    scroller.style.width = document.body.clientWidth + "px";

                    window.top.addEventListener('resize', function() {
                        scroller.style.left = (document.getElementById(options.targetId).getBoundingClientRect().x * -1) + "px";
                        scroller.style.width = document.body.clientWidth + "px";
                    });

                    bindScrollerAdsEvent(options.containerId, containerAdvertisementId(options.containerContentId), options.offset || DMSAds.scrollerAds.defaultOffset, options.writeAd);
                }

            }

        })()
    }


})();


if (document.readyState === "complete" ||
    document.readyState === "loaded" ||
    document.readyState === "interactive") {
    DMSAds.isWindowLoaded = true;
    for (var i = 0; i < DMSAds.cmd.length; i++) {
        var command = DMSAds.cmd[i];
        command();
    }
} else {
    document.addEventListener('DOMContentLoaded', function() {
        DMSAds.isWindowLoaded = true;
        for (var i = 0; i < DMSAds.cmd.length; i++) {
            var command = DMSAds.cmd[i];
            command();
        }
    });
}