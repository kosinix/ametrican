var style = document.querySelectorAll( 'head' )[0].innerHTML; // Get head HTML

// Conversion runs once only. Must refresh page to run again.
if(!style.match(/ametrican-highlight/g)){ // If we have added the style, we have run already

    // Highlight converted texts
    document.querySelectorAll( 'head' )[0].innerHTML += '<style>.__ametrican-highlight{background-color:rgba(255, 209, 0, 0.21)}</style>'

    convertChildren(document.querySelectorAll( 'body' )[0]);
}


