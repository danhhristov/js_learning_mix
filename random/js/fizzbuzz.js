//Sample fizzbuzz challenge
(function() {
    for (let i = 1; i <= 100; i++) {
        let toWrite = "";
        if (i % 3 == 0) toWrite += "fizz";
        if (i % 5 == 0) toWrite += "buzz";
        console.log(`${i} ${toWrite}`);
    }
})();
