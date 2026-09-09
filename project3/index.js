
document.addEventListener("DOMContentLoaded", () => {

    // Input fields
    const fullName = document.getElementById("name_field");
    const emailField = document.getElementById("email_field");
    const countryField = document.getElementById("country_field");
    const pinCode = document.getElementById("pincode_field");

    // Payment options
    const payByCard = document.getElementById("credit_card");
    const bankTransfer = document.getElementById("bank_transfer");
    const points = document.getElementById("re_Points");

    // Plans
    const monthlyPlan = document.getElementById("monthlyPlan");
    const annualPlan = document.getElementById("annualPlan");
    const finalAmt = document.getElementById("Amt");
    const monthlyCard = document.querySelector(".plan_1");
    const annualCard = document.querySelector(".plan_2");


    // Buttons
    const cancelBtn = document.getElementById("cancelBtn");
    const subscribeBtn = document.getElementById("subscribeBtn");

// Function to handle payment option highlighting
const selectPaymentOption = (selectedElement) => {
    // Reset background colors for all payment containers
    payByCard.style.backgroundColor = "#ffffff";
    bankTransfer.style.backgroundColor = "#ffffff";
    points.style.backgroundColor = "#ffffff";

    // Highlight the selected container
    selectedElement.style.backgroundColor = "rgb(121, 20, 216)";
};

// Payment option click events
payByCard.addEventListener("click", () => {
    selectedPayment = "Credit Card";
    selectPaymentOption(payByCard);
});

bankTransfer.addEventListener("click", () => {
    selectedPayment = "Bank Transfer";
    selectPaymentOption(bankTransfer);
});

points.addEventListener("click", () => {
    selectedPayment = "Points";
    selectPaymentOption(points);
});

// Function to update final amount and highlight the selected plan
const updatePlanSelection = () => {
    if (monthlyPlan.checked) {
        finalAmt.textContent = "$20/Month";

        // Highlight monthly plan container, reset annual plan
        monthlyCard.style.backgroundColor = "rgb(121, 20, 216)"; // Light accent color
        annualCard.style.backgroundColor = "#ffffff";  // Default color
    } else if (annualPlan.checked) {
        finalAmt.textContent = "$16/Month";

        // Highlight annual plan container, reset monthly plan
        annualCard.style.backgroundColor = "rgb(121, 20, 216)";
        monthlyCard.style.backgroundColor = "#ffffff";
    }
};

// Add change listeners to trigger whenever selection changes
monthlyPlan.addEventListener("change", updatePlanSelection);
annualPlan.addEventListener("change", updatePlanSelection);
   

    // Selected payment method
    let selectedPayment = "";


    // Payment option events
    payByCard.addEventListener("click", () => {
        selectedPayment = "Credit Card";

    });

    bankTransfer.addEventListener("click", () => {
        selectedPayment = "Bank Transfer";
    });

    points.addEventListener("click", () => {
        selectedPayment = "Points";
    });


   
        // Subscribe button
    subscribeBtn.addEventListener("click", () => {

        const name = fullName.value;
        const email = emailField.value;
        const country = countryField.value;
        const pincode = pinCode.value;

        console.log("Full Name:", name);
        console.log("Email:", email);
        console.log("Country:", country);
        console.log("Pincode:", pincode);
        console.log("Payment Method:", selectedPayment);

   

        // Get selected plan
        if (monthlyPlan.checked) {
            console.log("Plan: Monthly");
        } 
        else if (annualPlan.checked) {
            console.log("Plan: Annual");
        } 
        else {
            alert("Please select plan from option")
            console.log("No plan selected");
        }


    });


    // Cancel button
    cancelBtn.addEventListener("click", () => {

        console.log("Subscription cancelled");
    });

});
