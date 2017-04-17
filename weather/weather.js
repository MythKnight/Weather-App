const request = require("request");

var getWeather = (lat,lng) => {
	
	return new Promise((resolve,reject)=>{
	
		var url = 'https://api.darksky.net/forecast/91754faf548edb543f350ac4af1430bc/';
		url+=lat+","+lng;
		request({
			url,
			json:true
		},(error,response,body)=>{
			if(error){
				if(error.code==="ENOTFOUND") reject("Page Not Found !!! Please Contact Developer");
				reject("There is Error while processing your Request. Please Contact Developer");
			} else if(response.statusCode===200){
				resolve({
					summary : body.currently.summary,
					icon : body.currently.icon,
					temperature : body.currently.temperature
				})
			} else {
				reject("Error");
			}
		});

	});

}

module.exports = {
	getWeather
}
