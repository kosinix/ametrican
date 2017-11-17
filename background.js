browser.contextMenus.create({
  id: "to-metric",
  title: "Convert to metric"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "to-metric") {
    browser.tabs.executeScript({
      file: "lib-convert.js"
    });
    browser.tabs.executeScript({
      file: "convert.js"
    });
  }
});

browser.browserAction.onClicked.addListener(function() {
  browser.tabs.executeScript({
    file: "lib-convert.js"
  });
  browser.tabs.executeScript({
    file: "convert-all.js"
  });
});
