const CSS = '.__ametrican-highlight{background-color:rgba(255, 209, 0, 0.21)}';

browser.contextMenus.create({
  id: "to-metric",
  title: "Convert to metric"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "to-metric") {
    browser.tabs.insertCSS({code: CSS});
    browser.tabs.executeScript({
      file: "lib-convert.js"
    });
    browser.tabs.executeScript({
      file: "convert.js"
    });
  }
});

browser.browserAction.onClicked.addListener(async function() {
  browser.tabs.insertCSS({code: CSS});
  browser.tabs.executeScript({
    file: "lib-convert.js"
  });
  browser.tabs.executeScript({
    file: "convert-all.js"
  });
});
