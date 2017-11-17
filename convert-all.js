var style = document.querySelectorAll( 'head' )[0].innerHTML; // Get head HTML

// Conversion runs once only. Must refresh page to run again.
if(!style.match(/ametrican-highlight/g)){ // If we have added the style, we have run already

    // Highlight converted texts
    document.querySelectorAll( 'head' )[0].innerHTML += '<style>.__ametrican-highlight{background-color:rgba(255, 209, 0, 0.21)}</style>'

    // Find all text nodes and remove blank nodes
    var elements = textNodesUnder(document.querySelectorAll( 'body' )[0]);
    elements = elements.filter(function(el){
        return el.nodeValue.trim() !== '';
    });

    // Do conversion on each text node
    elements.forEach(function(el) {
      console.log(el)
      if (el.parentNode) {
        el.parentNode.innerHTML = convertToMetric(el.nodeValue,
          ((new_, old) => '<span class="__ametrican-highlight" title="' + old + '">' + new_ + '</span>'))
      }
    })
}

// Finds all text nodes
function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
}
