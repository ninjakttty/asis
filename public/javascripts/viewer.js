/**
	Change the pic
	@class viewer
	@namespace rotator
**/
/**
	Picture Changer
	@module viewer
**/
rotator.viewer = function(){
/**
	@method updateViewer
	@return null
**/

return{
	init: function(){
	},
  updateViewer: function(data) {
    var type = (data.height > 300) ? 'portrait': 'landscape';

    $('#viewer img').hide()
								    .attr(data)
								    .parent()
								    .removeClass()
								    .addClass(type)
								    .end()
								    .fadeIn('fast');
		$('#directlink').attr('href', data.src);
  }
};
}();