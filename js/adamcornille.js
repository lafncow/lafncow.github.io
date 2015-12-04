// A/B Testing
if( abTests ){
	// setup variables
    console.log(abTests);
    var abTestVals = [];
    var abTest_gaIndex = 1;
    var hiddenSet = [];

    // loop through active tests
    for( var i=0, ii=abTests.length;i<ii;i++ ){
    	abTestVals[i] = (Math.random() < 0.5 ? 1 : 0);
        console.log('ab-'+abTests[i]+'-'+(abTestVals[i]?0:1));
    	// hide A/B alternative
        hiddenSet = document.getElementsByClassName('ab-'+abTests[i]+'-'+(abTestVals[i]?0:1));
        for( var j=0, jj=hiddenSet.length;j<jj;j++ ){
            hiddenSet[j].style.display = 'none';
        }
    	
    }
}