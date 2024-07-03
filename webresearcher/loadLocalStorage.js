// Check if there are any notes already in localstorage and if so load them up
$.notify("WBJS is initializing.", "info",{autoHideDelay: 30000});

if(localStorage.getItem(webPageUrl)!=null){
  var foo_loaded        = JSON.parse(localStorage.getItem(webPageUrl));
  // set tags
  var foo_tags          = foo_loaded['TAGS'] ?? ""; // if tags are not present, set it to empty string
  document.getElementById('tagsWBJS').value = foo_tags;

  var foo_loaded_keys   = Object.keys(foo_loaded['HTML']);
  

  for(k=0;k<foo_loaded_keys.length;k++){
    console.info("WBJS: Adding locally stored notes.");
    
    var newNode1 = document.createElement("div");
    newNode1.classList.add("ui-widget-content");
    document.body.appendChild(newNode1)
    newNode1.setAttribute("style", "display: inline-block; overflow:auto;");

    // allows user to delete the imported annotation by clicking the right click after user confirmation
    newNode1.addEventListener('contextmenu', function(ev) {
    if(confirm("Are you sure you want to delete this note?")){
      ev.preventDefault();
      ev.target.remove();
      return false;
    }}, false);

    /// Make div for note
    newNode1.innerHTML= `
      <div id=`+"tooltip" + note_count + ` class="WBJSNote">` + foo_loaded['HTML'][foo_loaded_keys[k]] + `</div>
      `;


    let notestyleProps = foo_loaded['CSS'][foo_loaded_keys[k]];
    let notestyleEl =   document.getElementById("tooltip"+note_count).style;

    // Tried to set the entire object as CSS. For some reason it fails.
    // Manually set the css elements instead.. yiikkess!!!
    notestyleEl.height            = notestyleProps.height;
    notestyleEl.width             = notestyleProps.width;
    notestyleEl.color             = notestyleProps.color;
    notestyleEl.padding           = notestyleProps.padding;
    notestyleEl.textDecoration    = notestyleProps.textDecoration;
    notestyleEl.display           = notestyleProps.display;
    notestyleEl.overflow          = notestyleProps.overflow;
    notestyleEl.backgroundColor   = notestyleProps.backgroundColor;
    notestyleEl.fontSize          = notestyleProps.fontSize;
    notestyleEl.opacity           = notestyleProps.opacity;
    notestyleEl.position          = notestyleProps.position;
    notestyleEl.inset             = notestyleProps.inset;
    notestyleEl.margin            = notestyleProps.margin;
    notestyleEl.transform         = notestyleProps.transform;
    notestyleEl.resize            = "both";

  
    $('#'+"tooltip"+note_count).mousedown(handle_mousedown); // move popper

    note_count+=1; // update note counter
  }
}

// async function which automatically saves the notes to localstorage every x seconds

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


let showSaveMessage = 0;
async function saved(){
  if(showSaveMessage==0){
    showSaveMessage=1;
    $.notify("WBJS is running", "success");
  }

  console.info("WBJS: saved");
// save all the notes created so far
  for(i=1;i<note_count;i++){
      // console.log("tooltip"+i);
      let notestyleEl = document.getElementById("tooltip"+i).style;
      let notestyleProps = {
        "height"          :notestyleEl.height,
        "width"           :notestyleEl.width,
        "border"          :notestyleEl.border,
        "color"           :notestyleEl.color,
        "padding"         :notestyleEl.padding,
        "textDecoration"  :notestyleEl.textDecoration,
        "display"         :notestyleEl.display,
        "overflow"        :notestyleEl.overflow,
        "resize"          :notestyleEl.resize ,
        "backgroundColor" :notestyleEl.backgroundColor,
        "fontSize"        :notestyleEl.fontSize,
        "opacity"         :notestyleEl.opacity,
        "position"        :notestyleEl.position,
        "inset"           :notestyleEl.inset,
        "margin"          :notestyleEl.margin,
        "transform"       :notestyleEl.transform
      }


      WBJS_JSON[i]    = '';
      WBJS_CSS[i]     = notestyleProps;
      WBJS_HTML[i]    = document.getElementById("tooltip"+i).innerHTML;


  }
  let foo_final ={};
  foo_final['HTML'] = WBJS_HTML;
  foo_final['JSON'] = WBJS_JSON;
  foo_final['CSS']  = WBJS_CSS;
  foo_final['TAGS'] = document.getElementById('tagsWBJS').value;

  console.info("auto saving data");
  localStorage.setItem(webPageUrl,JSON.stringify(foo_final));

}
var intervalId = setInterval(saved,15000); 
