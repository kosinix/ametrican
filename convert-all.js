var style = document.querySelectorAll( 'head' )[0].innerHTML; // Get head HTML

// Conversion runs once only. Must refresh page to run again.
if(!style.match(/ametrican-highlight/g)){ // If we have added the style, we have run already

    // Highlight converted texts
    document.querySelectorAll( 'head' )[0].innerHTML += '<style>.__ametrican-highlight{background-color:rgba(255, 209, 0, 0.21)}</style>'

    // Fin all text nodes and remove blank nodes
    var elements = textNodesUnder(document.querySelectorAll( 'body' )[0]);
    elements = elements.filter(function(el){
        return el.nodeValue.trim() !== '';
    });

    // Do conversion on each text node
    elements.forEach(function(el){
        console.log(el);
        var value = el.nodeValue;
        var newValue = '';
        var newUnits = '';
        var newNumero = 0;

        // Isolate parts containing a number and american units of measure. 
        // Example: 
        // If text node contains: Walking 1 mile a day is good for you. 
        // Will return: 1 mile
        var regex = /(\d+(\.\d+)?([\s]+)?)((mile[s]?|mi.|mi)|(pound[s]?|lb[s\.]?))/g;
        while (match = regex.exec(value)) {
            var suspect = value.substr(match.index, regex.lastIndex-match.index); //
            
            // Get the number part
            var regex2 = /(\d+(\.\d+)?)/g;
            while (match2 = regex2.exec(suspect)) {
                var numero = suspect.substr(match2.index, regex2.lastIndex-match2.index);
                newNumero = parseFloat(numero);

                // Get the units part
                var units = suspect.substr(regex2.lastIndex).trim();

                // Identify unit
                if(units.match(/mile[s]?|mi.|mi/)){
                    newUnits = 'kilometer';
                    newNumero *= 1.609344;

                } else if(units.match(/pound[s]?|lb[s\.]?/)){
                    newUnits = 'kilogram';
                    newNumero *= 0.453592;
                } else {
                    newUnits = '[unknown]'
                }

                // Pluralize
                if(newNumero>1){
                    newUnits += 's';
                }

                // Format with max decimal places of 2. Remove if its .00
                newNumero = newNumero.toFixed(2).replace(/\.00$/, '');

                newValue = value.replace(suspect, '<span class="__ametrican-highlight" title="'+suspect+'">'+newNumero+' '+newUnits+'</span>');
                
                console.log('suspect',suspect)
                console.log('newValue',newValue);
 
            }
            // console.log(suspect)
            
        }
    
        // Do nothing if blank
        if(newValue !=''){
            el.parentNode.innerHTML = el.parentNode.innerHTML.replace(/miles/, 'xx');// = newValue;
            console.log(el);
        }
    })
}

// Finds all text nodes
function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}
