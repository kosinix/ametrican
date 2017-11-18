var head = document.querySelectorAll( 'head' )[0] || null;
var body = document.querySelectorAll( 'body' )[0] || null;

if(head){
  let isConverted = head.getAttribute('page-converted') | false;
  if(!isConverted && body){
    convertChildren(body);
  }
}



