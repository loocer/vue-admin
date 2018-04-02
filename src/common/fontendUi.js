export const fpUi = {
	role:{
		add:{
			id:'68m9jjSAH4P5o0r2dX4VdM==',
			state:false
		}
	},
	award:{
		add:{
			id:'/4PiGuWzzj3Z0mWXZh+OJM==',
			state:false
		}
	}
};
export const  queryUi = function(pageObj,selfArray){
	for(let key1 in pageObj){
		for(let  key2 in selfArray){
			if(pageObj[key1].id === selfArray[key2]){
				pageObj[key1].state = true
			}
		}
	}
	return pageObj
}