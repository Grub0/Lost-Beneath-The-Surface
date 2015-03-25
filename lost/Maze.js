var field = new Array();
var Maze = {

	createMaze : function(rows,cols,br,paths){
		paths.length = 0;
		field.length = 0;
		field = new Array();
		this.mazeW = cols;
		this.mazeH = rows;
		for(var i=0; i<rows;i++){
        	var row = new Array();
        	for(var ii=0; ii<cols; ii++){
        		row.push('?');
        	}

        field.push(row);

    	}
	    this.frontier = new Array();

	    var xchoice = Math.floor(Math.random()*cols);
	    var ychoice = Math.floor(Math.random()*rows);

	    this.carve(new Array(ychoice, xchoice));

	    //parameter branchrate:
	    //zero is unbiased, positive will make branches more frequent, negative will cause long passages
	    //this controls the position in the list chosen: positive makes the start of the list more likely,
	    //negative makes the end of the list more likely
	    //large negative values make the original point obvious
	    //try values between -10, 10

	    this.branchrate = br;

	    while(this.frontier.length > 0){
	        var pos = Math.random();
	        pos = Math.pow(pos,Math.pow(Math.E,-this.branchrate));
	        var rpos = Math.floor(pos * this.frontier.length);
	        var choice = this.frontier[rpos];

	        if (this.check(choice)){
	            this.carve(choice);
	        }
	        else {
	            this.harden(choice);
	        }
	        this.frontier.splice(rpos,1);
	    }

	    for(var iy=0; iy<rows; iy++){
	        for(var ix=0; ix<cols; ix++){
	            if(field[iy][ix] != '0'&& field[iy][ix]!='1'){ field[iy][ix] = '0'; }
	            if(field[iy][ix]=='1'){
	            	var t = {iy:iy,ix:ix};
	            	paths.push(t);
	            }
	        }

	    }
	    return field;
	},


	check: function(posi) {

	    var y = posi[0]; var x = posi[1];
		var nodiagonals = 1; //make the default to check for diagonals 
		if(posi[2]){ nodiagonals = posi[2]; }
		

		var edgestate = 0;
	    if (x > 0) {
	        if (field[y][x-1] == '1'){
	            edgestate += 1 ;
			}
		}
	    if (x < this.mazeW-1){
	        if (field[y][x+1] == '1'){
	            edgestate += 2;
			}
		}
	    if (y > 0){
	        if (field[y-1][x] == '1'){
	            edgestate += 4;
			}
		}
	    if (y < this.mazeH-1){
	        if (field[y+1][x] == '1'){
	            edgestate += 8 ;
			}
		}
		
		if(nodiagonals){
			if (edgestate == 1){
	            if (x < this.mazeW-1){
	                if (y > 0){
	                    if (field[y-1][x+1] == '1'){
	                        return 0;
						}
					}
	                if (y < this.mazeH-1){
	                    if (field[y+1][x+1] == '1'){
	                        return 0;
						}
					}
	            return 1;
				}
			}
	        else if ( edgestate == 2){
	            if (x > 0){
	                if (y > 0){
	                    if (field[y-1][x-1] == '1'){
	                        return 0;
						}
					}
	                if (y < this.mazeH-1){
	                    if (field[y+1][x-1] == '1'){
	                        return 0;
						}
					}
	            return 1;
				}
			}
	        else if ( edgestate == 4){
	            if (y < this.mazeH-1){
	                if (x > 0){
	                    if (field[y+1][x-1] == '1'){
	                        return 0;
						}
					}
	                if (x < this.mazeW-1){
	                    if (field[y+1][x+1] == '1'){
	                        return 0;
						}
					}
	            return 1;
				}
			}
	        else if ( edgestate == 8){
	            if (y > 0){
	                if (x > 0){
	                    if (field[y-1][x-1] == '1'){
	                        return 0;
						}
					}
	                if (x < this.mazeW-1){
	                    if (field[y-1][x+1] == '1'){
	                        return 1;
						}
					}
				return 1;
				}
			}
			return 0;
		}
		else {
			var diags = new Array(1,2,4,8);
			if( arrayCount(diags,edgestate) ){
				return 1;
			}
			return 0;
		}
	    

	},

	carve: function(posi) {
		var y = posi[0]; var x = posi[1];
		var extra = new Array();
		field[y][x] = '1' ;
		if (x > 0){
			if (field[y][x-1] == '?') {
				field[y][x-1] = ',';
				extra.push(new Array(y,x-1));
			}
		}
		if (x < this.mazeW - 1){
			if (field[y][x+1] == '?') {
				field[y][x+1] = ',';
				extra.push(new Array(y,x+1));
			}
		}
		if (y>0){
			if (field[y-1][x] == '?') {
				field[y-1][x] = ',';
				extra.push(new Array(y-1,x));
			}
		}
		if (y < this.mazeH - 1){
			if (field[y+1][x] == '?') {
				field[y+1][x] = ',';
				extra.push(new Array(y+1,x));
			}
		}
		extra = this.shuffle(extra);
		this.frontier = this.frontier.concat(extra);
	},

	harden: function(posi) {
		var y = posi[0]; var x = posi[1];
		field[y][x] = '0';
	},

	convertToCSV: function(field){
		var str = "";
		for(var y=0; y<field.length; y+=1){
			var row = field[y];
			for(var x=0; x<row.length; x+=1){
				if(x!=row.length-1){
					str+=row[x]+',';
				}
				else{
					str+=row[x];
				}
			}
			str+="\n";
		}
		return str;
	},

	shuffle : function(o){
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
}