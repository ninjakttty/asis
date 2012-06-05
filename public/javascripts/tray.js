/**
	Responsible for tray related functions
	@class tray
	@namespace rotator
**/

/**
	Responsible for tray related functions
	@module tray
**/

rotator.tray = function(){
  var itemWidth = 65,
  index = 0,
  tray = 6,
  page = 0,
  listLength = $('#filmstrip li').length;

  /**
	  Gets the index of selected picture
	  @method _getCurrentIndex
	  @protected
	  @return {Number} index
  **/
  function _getCurrentIndex(){
    return index;
  }
  /**
	  Sets the index based on currently selected object in tray
	  @method _setCurrentIndex
	  @protected
	  @return null
  **/
  function _setCurrentIndex(){
    index = $('.selected').index();
  }

  return {
    /**
	    Initialize the tray
	    @method init
	    @return null
    **/
    init: function() {
      index = $('.selected').index();
      _getCurrentIndex();
      $('.arrow:not(.disabled)').live('click', function() {
        rotator.pub( $(this).attr('id') );
      });
      $('#filmstrip ul').click(function(e){
        $el = $( e.target );

        //normalize the event click
        $el = ( $el.parent().is('li' ) )? $el.parent() : $el;
        //don't act on already selected event
        if($el.is("li:not('.selected')")){
	        rotator.pub('updateTray', $el.index() );
        }
      });
    },
    /**
	    Animate hidden tray into view
	    @param index {Number} Page to move to
	    @method updatePage
	    @return null
    **/
    updatePage: function(i) {
      var ease = (typeof $.ui === "undefined") ? 'linear' : 'easeInOutCubic',
      x = (0 - page ) * itemWidth * tray;

      $('li').animate(
        {left: x},
        "slow",
        ease
      );
    },
    /**
	    Check if current index is visible
	    @method inTray
	    @return null
    **/
    inTray: function() {
      var newPage = Math.floor( index / tray );
      if(page !== newPage){
        page = newPage;
        rotator.pub('newPage', page);
      }
    },
    /**
	    Convenience method for updateTray
	    @method next
	    @return null
    **/

    next: function(){
      rotator.pub('updateTray', _getCurrentIndex()+1);
    },
    /**
	    Convenience method for updateTray
	    @method prev
	    @return null
    **/

    prev: function(){
      rotator.pub('updateTray', _getCurrentIndex()-1);
    },
    /**
	    Add / Remove disabled status to buttons
	    @method buttonStatus
	    @return null
    **/
    buttonStatus: function() {
      $('.arrow').removeClass('disabled');

      if( _getCurrentIndex() === 0 ){
        $('#prev').addClass('disabled');
      }
      if( _getCurrentIndex() === listLength -1 ){
        $('#next').addClass('disabled');
      }
    },
    /**
		@method updateFilmStrip
		@param Position {Number}
		@return null
		**/
		updateFilmStrip: function(pos){
		  if( pos === -1 || pos === listLength ){
		    return false;
		  }
		  var $li = $('#filmstrip li'),
		  $sel = $('#filmstrip li.selected');

		  $li.removeClass('selected');
		  var data = $($li[pos]).addClass('selected')
		  											.children('img')
		  											.data('img');
		  rotator.pub('updateViewer', data);
		  _setCurrentIndex();
		  rotator.tray.inTray();
		}
};
}();