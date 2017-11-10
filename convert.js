
var sel = window.getSelection();
var value = sel.toString();


if(value!=''){
    
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        
        if(value.match(/(\d+)\s*((mi)|(mi.)|(mile)|(miles))/)){
            var newValue = value.replace(/\s*((mi)|(mi.)|(mile)|(miles))/, '');
            newValue = (parseFloat(newValue) * 1.609344).toFixed(2).replace(/\.00$/, '');;
            var suffix = 'kilometer'
            if(parseInt(newValue)>1){
                suffix += 's';
            }
        
            replaceContent(range, newValue+' '+suffix);
        } else if(value.match(/(\d+)\s*((pound)|(lb)|(lbs)|(lb.)|(lbs.)|(pounds))/)){
            var newValue = value.replace(/\s*((pound)|(lb)|(lbs)|(lb.)|(lbs.)|(pounds))/, '');
            newValue = (parseFloat(newValue) * 0.453592).toFixed(2).replace(/\.00$/, '');;
            var suffix = 'kilogram'
            if(parseInt(newValue)>1){
                suffix += 's';
            }
        
            replaceContent(range, newValue+' '+suffix);
        }
        
    }
}

function replaceContent(range, replacement){
    range.deleteContents();
    range.insertNode(document.createTextNode(replacement));
}
