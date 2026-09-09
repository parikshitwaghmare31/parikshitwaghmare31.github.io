document.addEventListener("DOMContentLoaded", () => {

    // 1. Access elements
    const input = document.getElementById("input");
    const output = document.getElementById("output");

    const inputBase = document.getElementById("inputBase");
    const outputBase = document.getElementById("outputBase");

    // 2. Add event listener
    input.addEventListener("input", () => {

        //3. Get the user's number
        const value = input.value;

        // 4. Get selected number systems
        const from = inputBase.value;
        const to = outputBase.value;

        // 5. Convert...
        // 5.1 Convert number system name to base
        function getBase(system) {
            if(system ==="binary"){
                return 2;
            }
            else if(system ==="octal") {
                return 8;
            }
            else if(system === "decimal"){
                return 10;
            }
            else if(system === "hexadecimal"){
                return 16;
            }
        }

        // Run conversion whenever input changes
        input.addEventListener("input", function() {

            const value = input.value.trim();

            // Don't do anything if input is empty
            if (value === ""){
                output.value = "";
                return;
            }

            const fromBase = getBase(inputBase.value);
            const toBase = getBase(outputBase.value);

            // convert input -> decimal
            const decimalValue = parseInt(value, fromBase);

            // Check invalid input
            if(isNaN(decimalValue)) {
                output.value = "Invalid Number";
                return;
            }

            // convert decimal --> selected output base
            output.value = decimalValue.toString(toBase).toUpperCase();
        })
       
    });
    














})