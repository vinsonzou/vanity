function signup()
{
  var name = $('input[name="name"]').val();
  var pass = $('input[name="pass"]').val();
  if(name == '' || pass == '')
    throw 'error input';
  $.ajax({
    type: 'POST',
    crossDomain: true,
    url: gate,
    data: {name: name, pass: pass},
    success: function(result)
    {
      console.log(JSON.stringify(result));
    },
    error: function(xhr, err)
    {
      alert(err);
    },
    dataType: 'jsonp'
  });
}
