$(document).ready(function(){
  $('.collapsible').collapsible();
  $('select').formSelect();
  $('.tabs').tabs();
  $("#deleteGroup").submit(function(e){
    e.preventDefault();
    var url = $('#deleteGroup').attr('action'); 
    $.ajax({
      url: url,
      type: 'DELETE',
      success: function(result) {
        location.reload();
      },
      error: function(err) {
        location.reload();
      }
  });
  });

});
    