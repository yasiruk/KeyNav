function emitMessage(type, message) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            "message": {
                type: type,
                message: message
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var searchtextbar = document.getElementById('searchtext');

    searchtextbar.focus();

    searchtextbar.oninput = function (e) {
        emitMessage("search", e.target.value);
    };
    searchtextbar.addEventListener('keydown', function (e) {
        var tabkey = 9, enterkey = 13;
        if (e.shiftKey) {
            if (e.keyCode == tabkey) {
                emitMessage("prev", "");
                e.preventDefault();
                return false;
            }
        } else if (e.keyCode == tabkey) {
            emitMessage("next", "");
            e.preventDefault();
            return false;
        } else if (e.keyCode == enterkey) {
            emitMessage("navigate", "");
            searchtextbar.setSelectionRange(0, searchtextbar.value.length);
            e.preventDefault();
            return false;
        } else {
            return true;
        }

    }, false);
});

$(document).unload(function () {
    emitMessage("clear", "");
});
document.addEventListener("unload", function (event) {
    emitMessage("clear", "");
}, true);