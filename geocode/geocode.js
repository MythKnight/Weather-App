const request = require('request');

var geoLocation = (address) => {

	return new Promise((resolve,reject)=>{

		var url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
		url+=encodeURIComponent(address);
		request({
			url,
			json:true
		},(error,response,body)=>{
				if(error) { 
					if(error.code==="ENOTFOUND") reject("Page Not Found !!! Please Contact Developer");
					reject("There is Error while processing your Request. Please Contact Developer");
				}
				else if(body.status==="ZERO_RESULTS"){
					reject("Address not Found. Please Try with another Address");
				}		
				else if(response.statusCode===200 && body.status=="OK"){ 
					resolve({
						address:body.results[0].formatted_address,
						lat:body.results[0].geometry.location.lat,
						lng:body.results[0].geometry.location.lng
					});
				} else {
					reject("ERROR")
				}
		});

	});
}

module.exports={
	geoLocation
};
