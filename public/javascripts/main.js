/**
	@class rotator
**/

var rotator = function(){
  db = {};
  return{
    /**
  	  Initialize event listeners and load submodules
	    @method init
	    @return null
    **/
    init: function(){
      rotator.tray.init();
      rotator.viewer.init();
      /**
	      Fire to select next object
	      @event next
      **/
      rotator.register("next", [rotator.tray.next]);
      /**
	      Fire to select previous object
	      @event prev
      **/
      rotator.register("prev", [rotator.tray.prev]);
      /**
	      new picture to be loaded
	      @event updateViewer
	      @param {Object} Picture data object
      **/
      rotator.register("updateViewer", [rotator.viewer.updateViewer]);
      /**
	      Fire for tray update
	      @event updateTray
	      @param {Number} Index of new selection
      **/
      rotator.register("updateTray", [rotator.tray.updateFilmStrip, rotator.tray.buttonStatus]);
      /**
	      Change visisble objects in tray
	      @event newPage
	      @param {Number} new Page number
      **/
      rotator.register("newPage", rotator.tray.updatePage);

      //document keypress listeners listeners
      $(document).keydown(function(e) {
        switch (e.keyCode){
          case 37:
          rotator.pub('prev');
          break;
          case 39:
          rotator.pub('next');
          break;
          default: //fallthrough
          break;
        }
      });
      console.log('started');
    },
    /**
	    Register new event listener
	    @method register
	    @param name {String}  Name of event to listen to
	    @param callbacks {Array} Array of callbacks
	    @return null
    **/
    register: function(name, data){
      if(typeof data === "object"){
        $(data).each(function(){
          rotator.register(name, this);
        });
        return;
      }
      db[name] = db[name] || [];
      db[name].push(data);
    },
    /**
	    Publish event to all listeners
	    @method pub
	    @param data {mixed} Data to be passed to listener
	    @return null
    **/
    pub: function(name, data) {
    	console.log('Publishing: ', name, 'Data:', data);
      if(db[name]){
        $( db[name] ).each(function(){
          this.call(this, data);
        });
      }
    }
  };
  }();

$(document).ready(function() {
  rotator.init();
});