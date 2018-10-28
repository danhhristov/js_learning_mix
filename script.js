insert = num => {
    document.form.textview.value = document.form.textview.value + num;
};

clean = () => {
    document.form.textview.value = "";
};

back = () => {
    let exp = document.form.textview.value;
    document.form.textview.value = exp.substring(0, exp.length - 1);
};

equal = () => {
    let exp = document.form.textview.value;
    if (exp) document.form.textview.value = eval(exp);
};

//Sample fizzbuzz challenge
(function() {
    for (let i = 1; i <= 100; i++) {
        let toWrite = "";
        if (i % 3 == 0) toWrite += "fizz";
        if (i % 5 == 0) toWrite += "buzz";
        console.log(`${i} ${toWrite}`);
    }
})();
