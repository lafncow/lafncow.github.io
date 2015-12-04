// A/B Testing
if( abTests ){
	// setup variables
    console.log(abTests);
    var abTestVals = [];
    var abTest_gaIndex = 1;

    // loop through active tests
    for( i in abTests){
    	abTestVals[i] = (Math.random() < 0.5 ? 1 : 0);
    	// hide A/B alternative
    	document.getElementsByClassName('AB_'+abTests[i]+'_'+(abTestVals[i]?0:1));
    }
}