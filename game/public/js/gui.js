/**
 * Created by Viktor on 02/01/15.
 */

var showChat = false;

var toggle = document.getElementById('chatToggle');
var chat = document.getElementById('chat');

toggle.addEventListener('click', function (event) {

    if(showChat == false)
    {
        chat.style.bottom = '0px';
        toggle.style.bottom = '160px';

        showChat = true;
    }
    else if(showChat == true)
    {
        chat.style.bottom = '-160px';
        toggle.style.bottom = '0px';

        showChat = false;
    }

});