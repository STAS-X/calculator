let keyValue,
    cal = '';
    isError=false;

function UserException(message) {
  this.message = message;
  this.name = 'UserException';
}

let displayMathProblem = (cal) => {
  $('div#screen').text(cal).css('color', 'black');
  isError=false;
  //console.log(cal);
};

let displayWarning = (exception) => {
  let err_message=cal.toString();
  console.log(cal);
  
  if (!isError) {
    if (err_message.concat(exception.message).length>33)
       if (exception.message.length<33) 
       		err_message=err_message.slice(0, 33-exception.message.length).concat("... ",exception.message);
       else 
          err_message=exception.message
    else
       err_message=err_message.concat(" ", exception.message);
  	$('div#screen').text(err_message).css('color', 'red');
    }

}

$('div.item').on('click', (event) => {
  keyValue = $(event.target).text();
  console.log(isError);
  if(keyValue === "CE" || keyValue === "Delete" && isError) {
    cal = "";
    displayMathProblem(cal);
  } else if (keyValue === "Delete") {
    cal = cal.slice(0, -1);
    displayMathProblem(cal);
  } else if(keyValue === "=") {
    try {
      cal=cal.replaceAll(/(^|^[+-/*]|[+-/*])(0+(?=\d+))/g,"$1");
      cal = eval(cal);
      if (!Number.isFinite(cal)) {
        if (Number.isNaN(cal)) {
          throw new UserException('Неверный формат числа');
        };
        if (cal === undefined) {
          throw new UserException('Операция не определена');
        }
        throw new UserException('Деление на 0 запрещено');
        
      }
      displayMathProblem(cal); 
    } catch (err) {
      displayWarning(err);
      cal = "";
      isError=true;
    }
  } else {
    cal += keyValue;
    displayMathProblem(cal);
  }
});
