var by;

function nTC(x, y){// numberspace to canvasspace
    return {x: (c.width/2)+((x-cv.xo)/cv.sx),
         y: (c.height/2)-((y-cv.yo)/cv.sy)}
}

function cTN(x, y){// canvasspace to numberspace
    return {
        x:(cv.sx*(x-(c.width/2)))+cv.xo,
        y:(cv.sy*(y-(c.height/2)))+cv.yo
    }
}


function processText(input){// throws some error when doing (2^(-x)), dont care teehee (fixed it, the problem was w parens lmao)

    input=input.replace("sin", "Math.sin").replace("cos", "Math.cos").replace("tan", "Math.tan").replace("log", "Math.log10").replace("abs", "Math.abs")

    for(var i = 0; i < input.length;i++){
        if(input[i]=="^"){
            var max = i;var min = i;
            if(i==0){throw "baseless exponent"}
            if(i+1==input.length){throw "indexless exponent"}
            var base = "";
            if(input[i-1]==")"){
                base = input[i-1];
                var ii = i-1;
                var pc = 1;//parentheses count
                while(pc>0){
                    ii--;if(ii<=-1){break}
                    if(input[ii]==")"){pc++}else if(input[ii]=="("){pc--}
                    base = input[ii]+base;
                }
                min=ii;
            }else if(isDigit(input[i-1])){
                base = input[i-1];
                var ii = i-1;
                while(isDigit(input[ii-1])){
                    ii--;if(ii<=-1){break}
                    base = input[ii]+base;
                }
                min=ii;
            }else if(input[i-1]=="x"){base="x";min=i-1;}
            var index = "";
            if(input[i+1]=="("){
                index = input[i+1];
                var ii = i+1;
                var pc = 1;//pc
                while(pc>0){
                    ii++;if(ii>=input.length){break}
                    if(input[ii]=="("){pc++}else if(input[ii]==")"){pc--}
                    index += input[ii];
                }
                max=ii;
            }else if(isDigit(input[i+1])){
                index = input[i+1];
                var ii = i+1;
                while(isDigit(input[ii+1])){
                    ii++;if(ii>=input.length){break}
                    index+=input[ii];
                }
                max=ii;
            }else if(input[i+1]=="x"){index="x";max=i+1;}
            // console.log(base)
            // console.log(index)
            input = input.substring(0, min) + `Math.pow(${base}, ${index})` + input.substring(max+1);
            i=0;
            // console.log(input);
        }
    }

    return input;
}

function isDigit(s){
    if(s=="0"){return true}
    if(s=="1"){return true}
    if(s=="2"){return true}
    if(s=="3"){return true}
    if(s=="4"){return true}
    if(s=="5"){return true}
    if(s=="6"){return true}
    if(s=="7"){return true}
    if(s=="8"){return true}
    if(s=="9"){return true}
}

function evaluate(eq, at){
    var x = at;
    try{
        return eval(eq);
    }catch(e){console.log("bad eq, " + e)}
}

// const test = "46^3*(25^3+(3+5)^7)"

// const test = "x^2+6*x+12^x"

// const test = "x^2+6*x+3"

// console.log(test)
// console.log(processText(test))
// console.log(evaluate(test, 2))