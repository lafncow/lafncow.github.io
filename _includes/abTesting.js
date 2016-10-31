;
var abTesting = {};

abTesting.showABtests = function (abTestList) {
	if( abTestList && abTestList.length > 0 ){
		// setup variables
	    var abTestVals = [];
	    var abTest_gaIndex = 1;
	    var hiddenSet = [];

	    // loop through active tests
	    for( var i=0, ii=abTestList.length;i<ii;i++ ){
	    	abTestVals[i] = (Math.random() < 0.5 ? 1 : 0);
	    	// hide A/B alternative
	        hiddenSet = document.getElementsByClassName('ab-'+abTestList[i]+'-'+(abTestVals[i]?0:1));
	        for( var j=0, jj=hiddenSet.length;j<jj;j++ ){
	            hiddenSet[j].style.display = 'none';
	        }
	    }
	}

	return abTestVals;
};