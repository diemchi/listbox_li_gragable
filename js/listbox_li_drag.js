function renderListbox(item) {
    return '<li id="'+ item.id + '" draggable="true" class="draggable">' + item.id + ' - ' + item.title + '</li>';
}

let json = '{"fieldsExport": [{"id" : "2" , "title" : "氏名"},{"id" : "1" , "title" : "社員番号"},{"id" : "3" , "title" : "グループ"},{"id" : "4" , "title" : "グループ"},{"id" : "5" , "title" : "出勤日数"},{"id" : "6" , "title" : "欠勤日数"},{"id" : "7" , "title" : "総労働時間"},{"id" : "8" , "title" : "総労働時間"},{"id" : "9" , "title" : "所定外労働時間"},{"id" : "10" , "title" : "深夜労働時間"},{"id" : "11" , "title" : "早出残業"},{"id" : "12" , "title" : "社員番号"}]}'
let data = JSON.parse(json);

let html = '';
data.fieldsExport.map(function(field){
    html += renderListbox(field);
});
$('#selectable-list').html(html);

var moveSelected = function () {
    let $options = $('#selectable-list li[data-selected="true"]');
    $options.appendTo("#selection-list");
    $('#selection-list li').attr('data-selected', false);
    disabledMove();
}

var moveSelectable = function () {
    let $options = $('#selection-list li[data-selected="true"]');
    $options.appendTo("#selectable-list");
    $('#selectable-list li').attr('data-selected', false);
    sortSelectableList();
    disabledMove();
    checkDisableSort();
}

var addBlank = function () {
    //id = A
    var blank = '<li id="A" draggable="true" class="draggable">Blank</li>';
    $(blank).appendTo('#selection-list');
    $('#selection-list li').attr('data-selected', false);
}

var addZero = function () {
    //id = B
    var zero = '<li id="B" draggable="true" class="draggable">Zero</li>';
    $(zero).appendTo('#selection-list');
    $('#selection-list li').attr('data-selected', false);
}

var changeOrder = function(mode) {
    var option_selection_checked = $('#selection-list li[data-selected="true"]');

    if($('#selection-list li').length > 0) {
      if(mode == "first") {
        option_selection_checked.insertBefore($('#selection-list li:first'));
      }

      if(mode == "up") {
        option_selection_checked.each(function(index,ele) {
          var old_index = $('#selection-list li').index(ele);
          $($('#selection-list li')[old_index - 1]).insertAfter($('#selection-list li')[old_index]);
        });
      }
      
      if(mode == 'down') {
        $(option_selection_checked.get().reverse()).each(function(index, ele) { 
          var old_index = $('#selection-list li').index(ele);
          $($('#selection-list li')[old_index + 1]).insertBefore($('#selection-list li')[old_index]);
        });
      }

      if(mode == "last") {
        option_selection_checked.insertAfter($('#selection-list li:last'));
      }

      checkDisableSort();
    }
}

var getIdArr = function() {
    var idSelection = [];
    if($('#selection-list li').length > 0) {
        $('#selection-list li').each(function (index,opt) {
            idSelection.push(opt.getAttribute('id'));
        })
    }
}

function sortSelectableList() {
    $('#selectable-list li#A, #selectable-list li#B').remove();
    let option_select_default = $('#selectable-list li');
    option_select_default.sort(function(a,b){
        return a.getAttribute('id') - b.getAttribute('id');
    });
    $('#selectable-list').html(option_select_default);
}

function disabledMove() {
    if($('#selectable-list li[data-selected="true"]').length > 0) {
      $('.btn-add').prop('disabled', false);
    } else {
      $('.btn-add').prop('disabled', true);
    }

    if($('#selection-list li[data-selected="true"]').length > 0) {
      $('.btn-remove').prop('disabled', false);
    } else {
      $('.btn-remove').prop('disabled', true);
    }
		return false;
}

function checkDisableSort() {
    var selection = $('#selection-list li');
    var selection_checked = $('#selection-list li[data-selected="true"]');
    
    var isFirst = false;
    var isLast = false;

    if(selection_checked.length > 0) {
      var index_first = selection.index(selection_checked[0]);
      var index_last = selection.index(selection_checked[selection_checked.length - 1]);

      if(index_first == 0) {
        isFirst = true;
      }

      if(index_last == (selection.length - 1)) {
        isLast = true;
      }

      if(isFirst && isLast) {
        $('.btn-last, .btn-down, .btn-first, .btn-up').prop('disabled', true);
      } else if(isFirst) {
        // disable btn
        $('.btn-last, .btn-down').prop('disabled', false);
        $('.btn-first, .btn-up').prop('disabled', true);
      } else if (isLast) {
        $('.btn-first, .btn-up').prop('disabled', false);
        $('.btn-last, .btn-down').prop('disabled', true);
      } else {
        $('.btn-first, .btn-up, .btn-last, .btn-down').prop('disabled', false);
      }
    } else {
      $('.btn-first, .btn-up, .btn-last, .btn-down').prop('disabled', true);
    }
}

// function detectDragging() {
//   $('.draggable').each(function(ind, ele) {
//     $(ele).on('dragstart', function (e) {
//       $(ele).addClass('dragging');
//     });
//     $(ele).on('dragend', function(e) {
//       $(ele).removeClass('dragging');
//     })
//   })
// }

// sortable
function activeSelected(e) {
  if($(e.target).prop("tagName").toLowerCase() === 'li') {
    if($(e.target).attr('data-selected') === 'true') {
      $(e.target).attr('data-selected', false);
    } else {
      $(e.target).attr('data-selected', true);
    }
  }
}

function getDragAfterElement(container,y) {
  let draggableElements = [...container.querySelectorAll('.draggable:not([data-selected="true"])')];
  return draggableElements.reduce(function(closest, child) {
    let box = child.getBoundingClientRect();
    let offset = y - box.top - box.height / 2;
    if(offset < 0 && offset > closest.offset){
      return { offset : offset, element : child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

function reRenderEle(ele, afterEle) {
  let selection = document.querySelector('#selection-list');
  if(ele !== null && afterEle !== null) {
    selection.insertBefore(ele,afterEle);
    ele.setAttribute('data-selected', false) ;
  }
}

function dragAction() {
  let selectable = document.querySelector('#selectable-list');
  let selection = document.querySelector('#selection-list');

  // ondrop="drop(event)" ondragover="allowDrop(event)"
  selectable.addEventListener('dragover',function(e) {
    e.preventDefault();
  })

  selectable.addEventListener('drop',function(e) {
    e.preventDefault();
    let dragging_elements = document.querySelectorAll('.listbox li[data-selected="true"]');
    dragging_elements.forEach(function(dragging_ele) {
      if(dragging_ele !== null) {
        selectable.appendChild(dragging_ele);
        $('#selectable-list li').attr('data-selected', false);
      }
    })
    disabledMove();
    sortSelectableList();
  })

  selection.addEventListener('dragover',function(e) {
    e.preventDefault();
  })

  selection.addEventListener('drop',function(e) {
    e.preventDefault();

    var dragging_able_elements = document.querySelectorAll('#selectable-list li[data-selected="true"]');
    var dragging_ion_elements = document.querySelectorAll('#selection-list li[data-selected="true"]');
    var afterElement;

    if(dragging_ion_elements.length > 0 && dragging_able_elements.length === 0) { //sort in selection
      if (yLastClick < e.clientY)  { //down
        console.log('down');
        var dragging_elements_reverse = Array.from(dragging_ion_elements).reverse();
        if(dragging_elements_reverse.length > 0) {    
          var box_1st_down_selected = dragging_elements_reverse[0].getBoundingClientRect(); //last selected item
          var bottom_1st_down_selected = box_1st_down_selected.bottom;

          if (dragging_elements_reverse[0] === document.querySelector('#selection-list li:last-child')) { 
            // have last item - cancel
            $('.listbox li').attr('data-selected', false);
          } else {
            dragging_elements_reverse.forEach(function(dragging_ele, index) {
              if(e.clientY > bottom_1st_down_selected) { // drag last item
                if(index === 0) {
                  afterElement = getDragAfterElement(selection, e.clientY);
                } else {
                  var diff = e.clientY - bottom_1st_down_selected;
                  afterElement = getDragAfterElement(selection, dragging_ele.getBoundingClientRect().bottom + diff);
                }
              } else { // drag other item
                if(index === dragging_elements_reverse.length - 1) {
                  afterElement = getDragAfterElement(selection, e.clientY);
                } else {
                  var diff = e.clientY - dragging_elements_reverse[dragging_elements_reverse.length - 1].getBoundingClientRect().bottom;
                  afterElement = getDragAfterElement(selection, dragging_ele.getBoundingClientRect().bottom + diff);
                }
              }
              reRenderEle(dragging_ele, afterElement);
            })
          }
        }
      } else if(yLastClick > e.clientY) {  //up
        console.log('up');
        if (dragging_ion_elements[0] === document.querySelector('#selection-list li:first-child')) { 
          // have first item - cancel
          $('.listbox li').attr('data-selected', false);
        } else {
          var top_first_selected = dragging_ion_elements[0].getBoundingClientRect().top;

          dragging_ion_elements.forEach(function(dragging_ele, index) {
            if(e.clientY < top_first_selected) { // drag first item
              if(index === 0) {
                afterElement = getDragAfterElement(selection, e.clientY);
              } else {
                var diff = top_first_selected - e.clientY;
                afterElement = getDragAfterElement(selection, dragging_ele.getBoundingClientRect().top - diff);
              }            
            } else { // drag other item
              if(index === dragging_ion_elements.length - 1) {
                afterElement = getDragAfterElement(selection, e.clientY);
              } else {
                var diff = dragging_ion_elements[dragging_ion_elements.length - 1].getBoundingClientRect().top - e.clientY ;
                afterElement = getDragAfterElement(selection, dragging_ele.getBoundingClientRect().top - diff);
              }
            }
            reRenderEle(dragging_ele, afterElement);
          })
        }
      }

    } else if(dragging_ion_elements.length === 0 && dragging_able_elements.length > 0)  { //drag selectable to selection
      dragging_able_elements.forEach(function(dragging_ele) {
        selection.appendChild(dragging_ele);
        $('#selection-list li').attr('data-selected', false);
      })
    } else { //drag selectable on itself
      $('.listbox li').attr('data-selected', false);
    }

    checkDisableSort();
    disabledMove();
  })
}

var yLastClick = 0;

$(document).ready(function(){  
  sortSelectableList();

  var isDragging = false;
    
  $(".listbox").mousedown(function(e) {
    isDragging = false;
    yLastClick = e.clientY;

    $(this).on('mousemove', function(e) {
      isDragging = true;
      $(e.target).attr('data-selected', true);
      dragAction();
      $(this).off("mousemove");
    });

    // e.preventDefault();

    // $(this).children('li').mouseenter(function(e){
    //   console.log('enter');
    //   if(!$(this).attr('data-selected')) {
    //     $(this).attr('data-selected', true);
    //   }
    // });
  })

  $('#selectable-list').on('mouseup', function(e) {
    // $(this).children('li').off('mouseenter');
    $(this).off("mousemove");
    var wasDragging = isDragging;
    isDragging = false;
    if (!wasDragging) {
      activeSelected(e);
    }

    $(this).focus().blur();
    disabledMove();
  });

  $('#selection-list').on('mouseup', function(e) {
    // $(this).children('li').off('mouseenter');
    $(this).off("mousemove");
    var wasDragging = isDragging;
    isDragging = false;
    if (!wasDragging) {
      activeSelected(e);
    }

    $(this).focus().blur();
    checkDisableSort();
    disabledMove();
  });
})
