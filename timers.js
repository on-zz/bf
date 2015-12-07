jQuery(function($){

    var faucets = [];
    var addFaucet = function( index, cell, seconds ) {
        faucets[index] = {state: 0, period: seconds, cell: cell};
    };

    var startFaucetTimer = function( index ) {
        var faucet = faucets[index];
        if( faucet.state != 1 ) {
            faucet.state = 1;
            faucet.left = faucet.period;
            refreshCellTimer( index );
            faucet.cell.css('background', '#D49B90');
        }
    };

    var stopFaucetTimer = function( index ) {
        var faucet = faucets[index];
        faucet.state = 0;
        faucet.cell.html( faucet.period / 60 + '&nbsp;мин.' );
        faucet.cell.css('background', '#A7D490');
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
        var link = $(row.find('td').get(0));
        link.find('a');
        link.click(function(){
            startFaucetTimer(index);
        });
    }

    var initFaucets = function(rows) {
        var searchRe = /(\d+)\s+мин/i;

        rows.each(function(i, row){
            row = $(row);
            var cells = row.find('td');
            var periodCell = $(cells.get(2));
            var result = searchRe.exec(periodCell.text());

            if( result != null ) {
                var minutes = result[1];
                addFaucet( i, periodCell, minutes*60 );
                initCellTimer( row, periodCell, i );
            }
        });
    };

    var rows = $('table').find('tr');
    initFaucets( rows );
    startGlobalTimer();
});