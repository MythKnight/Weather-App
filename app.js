const fs = require('fs');
const geocode = require("./geocode/geocode");
const weather = require("./weather/weather");

const yargs = require('yargs');
var argv = yargs
	.usage('Usage: $0 <w> [address] [options]    ## Get Weather of Address ##\nUsage: $0 <wr>  [options(Unit)]   ## Refresh weather of saved Address ##')
	.command({
		command:"weather [address]",
		aliases: ['w', 'weather'],
		desc:'Get Weather Report of Address',
		builder:(yargs)=>{ yargs.option({
				address:{
					alias:'a',
					desc:"Any Address"
				}		
			});
			yargs.demandOption('address',"Please Provide a Address to Get the Weather");
		}	
	})
	.command({
		command:"weatherRefresh",
		aliases: ['wr',"weatherRefresh"],
		desc:'Refresh weather of saved address'
	})
	.option({
		units:{
			alias:"u",
			default:"f",
			desc:"celsius or fahrenheit",
			choices:["f","c"]
		},
		save:{
			alias:'s',
			desc:"Save this Address",
			boolen:true
		}
	})
	.boolean('save')
	.demandCommand(1, 'You need at least one command before moving on\n<w> [address]  Or  <wr>')
	.help()
	.alias("help","h")
	.argv;


if(argv.s && argv.address){
	//console.log("Saving address")
	fs.writeFile("address.txt",argv.address,(err)=>{
		if(err) throw err;
		console.log('Address saved')
	});
}
if(argv._[0]==="wr" || argv._[0]==="weatherRefresh"){
	try{
		var address = fs.readFileSync("address.txt");
		argv.address=address
	} catch(e){
		console.log("No Address Found, Please save a address")
	}
}
if(argv.address){
	geocode.geoLocation(argv.address)
		.then((result)=>{
			console.log("Formatted Address:",result.address);
			return weather.getWeather(result.lat,result.lng);
		})
		.then((result)=>{
			console.log("=================================");
			console.log(` Summary:- ${result.summary} || ${result.icon}
 Temperature:- ${argv.u==='c'?((result.temperature-32)/1.8).toFixed(2)+" Celsius":result.temperature+" Fahrenheit"}`);
			console.log("=================================");
		})
		.catch((reason)=>{
			console.log(reason)
		});
}

