jQuery(function($){
	var cellActive = function(el) {
		el.parent().css('background-color', '#F772D4');
	};

	var cellInactive = function(el) {
		el.parent().css('background-color', 'rgba(0,0,0,0.02)');
	};


	var faucets = [];

	var addFaucet = function( index, cell, seconds, measure ) {
	    faucets[index] = {state: 0, period: seconds, cell: cell, measure: measure};
	};

	var startFaucetTimer = function( index ) {
	    var faucet = faucets[index];
	    if( faucet.state != 1 ) {
	        faucet.state = 1;
	        faucet.left = faucet.period;
	        refreshCellTimer( index );
	        cellActive(faucet.cell);
	    }
	};

	var stopFaucetTimer = function( index ) {
	    var faucet = faucets[index];
	    faucet.state = 0;

	    if( faucet.measure == 'min' ) {
	    	faucet.cell.html( faucet.period / 60 + '&nbsp;мин' );
	    } else if ( faucet.measure == 'sec' ) {
	    	faucet.cell.html( faucet.period + '&nbsp;сек' );
	    }

	    cellInactive(faucet.cell);
	}

	var refreshCellTimer = function( index ) {
	    var faucet = faucets[index];
	    faucet.cell.html( faucet.left + '&nbsp;с.' );
	};

	var checkFaucets = function() {
	    for( i = 0; i<faucets.length ; i++ ) {
	    	var faucet = faucets[i];
	    	if( !faucet ) continue;
	    	if( faucet.state == null ) {
	    		continue;
	    	} else if( faucet.state == 1 ) {
	    		faucets[i].left--;
	    		refreshCellTimer( i );
	    		if( faucets[i].left == 0 ) {
	    			stopFaucetTimer(i);
	    		}
	    	}
	    }
	};

	var startGlobalTimer = function() {
		setInterval( function(){
			checkFaucets();
		}, 1000);
	};

	var initCellTimer = function( row, cell, index ) {
		var link = $(row.find('td').get(0)).find('a');
		link.click(function(){
			startFaucetTimer(index);
		});
	}

	var initFaucets = function(rows) {
		var searchReMin = /^\s*(\d+)\s+мин/i;
		var searchReSec = /^\s*(\d+)\s+сек/i;

		var counter = 0;
		rows.each(function(i, row){
			counter++;
			row = $(row);
			var cells = row.find('td');
			var periodCell = $(cells.get(2)).find('span');
			var result = searchReMin.exec(periodCell.text());
			if( result != null ) {
				var minutes = result[1];
				addFaucet( i, periodCell, minutes*60, 'min' );
				initCellTimer( row, periodCell, i );
			} else {
				var result = searchReSec.exec(periodCell.text());
				if( result != null ) {
					var seconds = result[1];
					addFaucet( i, periodCell, seconds, 'sec' );
					initCellTimer( row, periodCell, i );
				}
			}
		});

		console.log("Init " + counter + " faucets.")
	};

	var rows = $('table').find('tr');
	initFaucets( rows );
	startGlobalTimer();
});
