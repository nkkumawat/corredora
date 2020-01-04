$(document).ready(function(){
  $('.collapsible').collapsible();
  $('select').formSelect();
  $('.tabs').tabs();
});

function deleteRequest(url){
  $.ajax({
    url: url,
    type: "DELETE",
    success: function(result) {
      location.reload();
    },
    error: function(err) {
      M.toast({html: 'Error'});
    }
  });
};
