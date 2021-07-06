//Seperate .js file for WaitDelay so that it can be used Globally with the need to declare seperate versions in Class files and individual framework files
//WaitDelay function used to enable async functionality in Javascript
function WaitDelay(timeInMs)
{
	return new Promise(resolve => { setTimeout(() => { resolve(2); }, timeInMs); });
}