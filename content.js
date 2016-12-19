// content.js
var anchortags = $('a');
var filteredtags = null;
var selectedidx = 0;
var scrollOffset = {
    left : 0, top : -100
};
console.log(anchortags);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(request.message);
        if (request.message.type == "search") {
            search(request.message.message);
        } else if (request.message.type == "next") {
            next();
        } else if (request.message.type == "prev") {
            prev();
        } else if (request.message.type == "navigate") {
            navigate();
        } else if (request.message.type == "clear") {
            clear();
        }
    }
);
function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}

function clear() {
    anchortags.each(function (idx, tag) {
        $(tag).removeClass("key_nav_marker");
        $(tag).removeClass("key_nav_marker_selected");
    })
}
function search(text) {
    filteredtags = anchortags.filter(function (indx, a) {
        // console.log(a);
        var matches = fuzzysearch(text.toLowerCase(), a.textContent.toLowerCase());
        if (matches) {
            if (!($(a).is(":visible"))) //check to see if the element is visible, if not don't add to the list
                matches = false;
            $(a).addClass("key_nav_marker");
        } else
            $(a).removeClass("key_nav_marker");

        $(a).removeClass("key_nav_marker_selected");
        return matches;
    });
    selectedidx = 0;
    $(filteredtags[0]).addClass("key_nav_marker_selected");
    $(document).scrollTo(filteredtags[selectedidx],200, {
        offset : scrollOffset
    });
}
function next() {
    $(filteredtags[selectedidx]).removeClass("key_nav_marker_selected");

    selectedidx = (selectedidx + 1) % filteredtags.length;
    $(filteredtags[selectedidx]).addClass("key_nav_marker_selected");
    $(document).scrollTo(filteredtags[selectedidx],200, {
        offset : scrollOffset
    });
    console.log(filteredtags[selectedidx]);
}
function prev() {
    $(filteredtags[selectedidx]).removeClass("key_nav_marker_selected");
    selectedidx = selectedidx - 1;
    selectedidx = selectedidx < 0 ? filteredtags.length - 1 : selectedidx;
    $(filteredtags[selectedidx]).addClass("key_nav_marker_selected");
    $(document).scrollTo(filteredtags[selectedidx],200, {
        offset : scrollOffset
    });
    console.log(filteredtags[selectedidx]);
}
function navigate() {
    console.log("Navigating to " + filteredtags[selectedidx]);
    if (filteredtags.length >= 1)
        filteredtags[selectedidx].click();
}
// alert("Content Script is running");