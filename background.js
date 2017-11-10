browser.contextMenus.create({
  id: "to-metric",
  title: "Convert to metric"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "to-metric") {
    browser.tabs.executeScript({
      file: "convert.js"
    });
  }
});