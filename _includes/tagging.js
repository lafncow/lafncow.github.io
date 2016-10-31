;
var tagging = {};

tagging.getURLtag = function (url) {
	var hash = '';
	if (url === undefined) {
		//If not defined, get from current location
		hash = location.hash;
	} else {
		var hashIndex = url.indexOf('#');
		if (hashIndex !== -1) {
			hash = url.substr(hashIndex);
		}
	}

	return hash.substr(1);
};

tagging.filterElements = function (tag, elements, operator) {
	//tag is String, e.g. 'myTag'
	//elements is list of DOM elements, to be evaluated by class names in sub-elements
	//operator is function (element, match <boolean>) -> <void>
	var filteredElements = [];
	var element;

	//Return if tag not specified
	if ( tag === '' || tag === undefined ) {
		return filteredElements;
	}

	for ( var i=0, ii=elements.length; i<ii; i++ ) {
		element = elements[i];
		//Matches if there is a sub-element with tag as a class name
		if( element.querySelector('.tag-'+tag.toLowerCase()) !== null ){
            // this element matches
            filteredElements.push(element);
            if (operator) {
            	operator(element, true);
            }
        }else{
            // this one doesn't
            if (operator) {
            	operator(element, false);
            }
        }
	}

	return filteredElements;
};

tagging.hideOperator = function (element, isMatch) {
	if (isMatch) {
		//Show it
		element.style.display = '';
	} else {
		//Hide it
		element.style.display = 'none';
	}
};