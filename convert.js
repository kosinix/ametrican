
var sel = window.getSelection();
var value = sel.toString();

if(value!=''){
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        replaceContent(range, convertToMetric(value));
    }
}

function replaceContent(range, replacement){
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
}
