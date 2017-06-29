const keyboard = {
    shiftKeyDown: false,
    keyIndex: 1,
    getChar:function(){
        return $('.textbox > span:nth-child(' + keyboard.keyIndex + ')');
    },
    markChar:function(){
        keyboard.getChar().addClass('marked')
    },
    unmarkChar:function(){
        keyboard.getChar().removeClass('marked')
    },
    setChar:function($this){
        keyboard.keyIndex = $this.index();
    },
    length(){
        return $('.textbox > span').length;
    },
    nextIndex:function(){
        (keyboard.keyIndex < keyboard.length()) ? keyboard.keyIndex++ : null;
    },
    prevIndex:function(){
        (keyboard.keyIndex > 1) ? keyboard.keyIndex-- : null;
    },
    newChar:function(char, event){
        function charTemplate(char){
            if(event){
                return '<span class="dropped-item tag"><text>#' + char + '</text></span>';
            }

            return '<span>' + char + '</span>';
        }

        keyboard.getChar().after(charTemplate(char));
    },
    removeChar:function(){
        keyboard.getChar().remove();
    },
    allKeys: function(){
        return $('.textbox > span');
    },
    backspace:function(){
        if(keyboard.keyIndex > 1){
            keyboard.removeChar();
            keyboard.prevIndex();
            keyboard.markChar();
        }

    },
    type:function(code){
        let char = String.fromCharCode(code)

        if(!keyboard.shiftKeyDown){
            char = char.toLowerCase();
        }

        keyboard.unmarkChar();
        keyboard.newChar(char);
        keyboard.nextIndex();
        keyboard.markChar();
    },
    shiftUp:function(){
        keyboard.shiftKeyDown = false;
    },
    shiftDown:function(){
        keyboard.shiftKeyDown = true;
    },
    moveLeft:function(){
        keyboard.unmarkChar();
        keyboard.prevIndex();
        keyboard.markChar();
    },
    moveRight:function(){
        keyboard.unmarkChar();
        keyboard.nextIndex();
        keyboard.markChar();
    },
    moveUp:function(){

    },
    moveDown:function(){

    }
}


function generateDragItems(tags){
    const $tagContainer = $('.tag-container');

    function tagTemplate(tag){
        return "<span draggable='true' data-tagNames='" + JSON.stringify({data:tag.tagList}) +"' class='tag drag-item'><text>#" + tag.name +
        "</text></span>";
    }


    tags.map(function(tag){
        $tagContainer.append(tagTemplate(tag));
    })
}



function getAllTags(cb){
  let tags = [];
  $.get("/collectag",
      function(data, status){
        data = JSON.parse(data).data;

        tags = data.filter(function(tag){
          return tag.name
        }).map(function(tag){

          $('.presentTags').append('<span class="tag tag-edit" data-tags="' + tag.tagList + '"><text>' + tag.name + '<br>(edit)</text></span>')

          tag.tagList = tag.tagList.split(',');
          return tag;
        })

        cb(tags)
      });
}

$(document).ready(function(){
    getAllTags(function(tags){
      generateDragItems(tags);


    });


    $('.textbox').bind('keydown', function(event) {
        switch(event.keyCode){
            case 8: keyboard.backspace();
                break;
            case 16: keyboard.shiftDown();
                break;
            case 37: keyboard.moveLeft();
                break;
            case 39: keyboard.moveRight();
                break;
            case 40: keyboard.moveDown();
                break;
            case 38: keyboard.moveUp();
                break;
            case 17: // ctrl
                break;
            case 91: // cmd (chrome)
                break;
            case 224: // cmd (firefox)
                break;
            default: keyboard.type(event.keyCode)
        }

        //event.preventDefault();
    });

    $('.textbox').bind('keyup', function(event) {
        switch(event.keyCode){
            case 16: keyboard.shiftUp();
                break;
        }
    });

})

let globalDragTag = [];
$(document).on('drag', '.drag-item', function(event){
    const tagNames = $(this).data('tagnames');
    globalDragTag = (tagNames).data;
});

$(document).on('click', '.textbox > span', function(){
    keyboard.setChar($(this));
    keyboard.allKeys().removeClass('marked')
	keyboard.markChar();
});

let dragTimer;
$(document).on('dragover', '.textbox > span', function(event){
    const that = this;
    event.preventDefault();
    event.stopPropagation();

    clearTimeout(dragTimer);
    dragTimer = setTimeout(function(){
        keyboard.setChar($(that));
        keyboard.allKeys().removeClass('marked');
        keyboard.markChar();
    }, 10);
});

$(document).on('dragover', '.textbox', function(event){
    const that = this;
    event.preventDefault();
    event.stopPropagation();

    clearTimeout(dragTimer);
    dragTimer = setTimeout(function(){
        keyboard.allKeys().removeClass('marked');
        keyboard.markChar();
    }, 10);
});

function dropEvent(){
    const tagName = globalDragTag;
    $('.textbox').focus();
    globalDragTag.map(function(tagName){
        keyboard.newChar(tagName, true);
    });

}

$(document).on('drop', '.textbox > span', function(event){
    dropEvent();
});

$(document).on('drop', '.textbox ', function(event){

    if(!$(this).is(':focus')){
        dropEvent();
    }

});

$(document).on('click', '.textbox', function(){
	keyboard.markChar();
});


$(document).on('click', '.open-adder', function(){
  $('.adder-bak').show();
  $('.adder-new').show();
})

$(document).on('click', '.add-new-tag', function(){
  $.post("/collectag",
      {
          tagName: $('#tagName').val(),
          tagList: $('#tagList').val().replace(/ /g, '')
      },
      function(data, status){
        location.reload();
      });
})

$(document).on('click', '#sendComment', function(){
  $.post("/addComment",
      {
          comment: $('.textbox').text(),
          mediaId: $('.image').data('mediaid')
      },
      function(data, status){
        location.reload();
      });
})

$(document).on('click', '.tag-edit', function(){
  $('.adder-bak').show();
  $('.adder-old').show();
  $('#tagNameId').text('#' + $(this).text().replace('(edit)', ''));
  $('#tagList').val($(this).data('tags'));
})




$(document).on('click', '.close-adder', function(){
  $('.adder-bak').hide();
  $('.adder-new, .adder-old').hide();
})
