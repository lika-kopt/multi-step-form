// Pricing
const pricingColumns = document.querySelectorAll(".pricing-column");
const checkbox = document.getElementById("toggle");
const planPrice = document.querySelectorAll(".plan-price");
const addOnPrice = document.querySelectorAll(".addon-price");
const planOptions = document.querySelectorAll('input[name="plan"]');
const planMonthlyPrice = [9, 12, 15];
const planAnnualPrice = [90, 120, 150];
const addOnMonthlyPrice = [1, 2, 2];
const addOnAnnualPrice = [10, 20, 20];

// Sidebar and Form
const sidebarTargets = document.querySelectorAll(".circle");
const formValues = {};

// Get all the steps in the form
const formSteps = document.querySelectorAll(".step");

// Get the buttons for navigating between steps
const prevBtns = document.querySelectorAll(".prev");
const nextBtns = document.querySelectorAll(".next");
const changePlanBtn = document.getElementById("change-plan");

const selectAddOn = document.getElementById("select-addon");
const displayAddOn = document.getElementById("selected-addon");
let selectedOptions = [];

const planContainer = document.querySelector(".plan-container");
const selectedPlanDiv = document.getElementById("selected-plan");

// Set the current step to the first step
let currentStep = 0;
let selectedPlan = {};

// Hide all steps at the start
formSteps.forEach((step, index) => {
  if (index !== currentStep) {
    step.style.display = "none";
  }
});

// STEP 2 - SELECT PLAN
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const monthlyPlan = document.getElementById("monthly-plan");
const annualPlan = document.getElementById("annual-plan");
const hiddenElements = document.querySelectorAll(".yearly-info");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      checkbox.setAttribute("checked", true);
    } else {
      checkbox.removeAttribute("checked");
    }
  });
});

pricingColumns.forEach((pricingColumn) => {
  pricingColumn.addEventListener("click", function () {
    pricingColumns.forEach((pricingColumn) => {
      pricingColumn.classList.remove("selected");
    });
    this.classList.add("selected");
  });
});

checkbox.addEventListener("change", function () {
  if (this.checked) {
    hiddenElements.forEach(function (element) {
      element.style.display = "block";
      monthlyPlan.style.fontWeight = 400;
      annualPlan.style.fontWeight = 600;
    });
    planPrice.forEach(function (element, i) {
      element.textContent = `$${planAnnualPrice[i]}/yo`;
    });

    addOnPrice.forEach(function (element, i) {
      element.textContent = `+$${addOnAnnualPrice[i]}/yo`;
    });
  } else {
    hiddenElements.forEach(function (element) {
      element.style.display = "none";
    });

    planPrice.forEach(function (element, i) {
      element.textContent = `$${planMonthlyPrice[i]}/mo`;
    });

    addOnPrice.forEach(function (element, i) {
      element.textContent = `$${addOnMonthlyPrice[i]}/mo`;
    });

    monthlyPlan.style.fontWeight = 600;
    annualPlan.style.fontWeight = 400;
  }
});

// STEP 3 - SELECT ADD-ONS

const selectedAddons = document.querySelectorAll(".addon-container");
const addOns = document.querySelectorAll(".addon");

addOns.forEach(function (addOn) {
  addOn.addEventListener("change", function () {
    const addonContainer = this.closest(".addon-container");
    if (this.checked) {
      addonContainer.classList.add("selected-addon");
    } else {
      addonContainer.classList.remove("selected-addon");
    }
  });
});

// STEP 4 - SUMMARY

const form = document.querySelector("form");

function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(form);
  const selectedAddOns = document.getElementById("selected-addons");
  const selectedPlanName = document.getElementById("plan-name");
  const selectedPlanPrice = document.getElementById("display-plan-price");
  const totalPrice = document.getElementById("total-price");

  let totalAmount = 0;

  // Clear the existing output
  selectedAddOns.innerHTML = "";
  selectedPlanName.innerHTML = "";
  totalPrice.innerHTML = "";

  // Display the name of the plan
  const plan = data.get("plan");
  const planDuration = checkbox.checked ? "Yearly" : "Monthly";
  const formattedPlan = `${plan} (${planDuration})`;
  selectedPlanName.textContent = formattedPlan;

  // Display the price of the plan
  const planPrice = document.querySelector(".plan-price").textContent;
  const formattedPlanPrice = `${planPrice}`;
  selectedPlanPrice.textContent = formattedPlanPrice;

  /// Display values of the "addons" input
  const addons = data.getAll("addons");
  for (let i = 0; i < addons.length; i++) {
    const addonName = addons[i];
    const addonPrice = document.querySelectorAll(`.addon[data-addon="${addonName}"].addon-price`).textContent;
    const addonPriceInteger = parseInt(addonPrice.match(/\d+/)[0]);
    const addonNameElement = document.createElement("p");
    const addonPriceElement = document.createElement("p");
    const addonContainer = document.createElement("div");

    addonNameElement.textContent = addonName;
    addonPriceElement.textContent = addonPrice;
    addonContainer.classList.add("selected-addons-container");
    addonContainer.appendChild(addonNameElement);
    addonContainer.appendChild(addonPriceElement);
    selectedAddOns.appendChild(addonContainer);

    totalAmount += addonPriceInteger;
  }

  // Display total price

  const planPriceElement = document.querySelector(".plan-price");
  const planPriceText = planPriceElement.textContent;
  const planPriceInteger = parseInt(planPriceText.match(/\d+/)[0]);
  totalAmount += planPriceInteger;

  const planDurationTotal = checkbox.checked ? "(per year)" : "(per month)";
  const formattedTotalAmount = `${totalAmount}${checkbox.checked ? "/yo" : "/mo"}`;

  const totalAmountElement = document.createElement("p");
  totalAmountElement.textContent = `Total ${planDurationTotal}:`;

  const totalAmountValueElement = document.createElement("p");
  totalAmountValueElement.textContent = `$${formattedTotalAmount}`;

  totalPrice.appendChild(totalAmountElement);
  totalPrice.appendChild(totalAmountValueElement);
}

// Submitting the form
const submitBtn = document.querySelector(".submit");
const buttonContainer = document.querySelector(".button-container");
const thankYouMessage = document.querySelector(".thank-you");
const summaryContainer = document.querySelector(".summary-container");

submitBtn.addEventListener("click", (event) => {
  // Prevent the form from submitting
  event.preventDefault();

  // Hide the button container and show the thank you message
  buttonContainer.classList.add("hide");
  thankYouMessage.style.display = "flex";
  summaryContainer.style.display = "none";
  prevBtn.classList.add("hide");
  submitBtn.classList.add("hide");
});

changePlanBtn.addEventListener("click", function () {
  if (currentStep <= 0) {
    return; // do nothing if already at first step
  }

  formSteps[currentStep].style.display = "none";
  formSteps[currentStep - 2].style.display = "flex";
  currentStep -= 2;

  if (sidebarTargets.length > 0) {
    sidebarTargets[currentStep + 2]?.classList.remove("active");
    sidebarTargets[currentStep]?.classList.add("active");
  }
});

// Hide and show buttons
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const tabTargets = document.querySelectorAll(".tab");

function updateButtonState() {
  // Last step
  if (currentStep === tabTargets.length - 1) {
    nextBtn.classList.add("visibility-hidden");
    prevBtn.classList.remove("visibility-hidden");
    submitBtn.classList.remove("visibility-hidden");
    submitBtn.classList.remove("hide");
  } // First step
  else if (currentStep === 0) {
    nextBtn.classList.remove("visibility-hidden");
    prevBtn.classList.add("visibility-hidden");
    submitBtn.classList.add("visibility-hidden");
  } else {
    nextBtn.classList.remove("visibility-hidden");
    prevBtn.classList.remove("visibility-hidden");
    submitBtn.classList.add("visibility-hidden");
  }
}

// Moving back and forward between steps
nextBtns.forEach(function (nextBtn) {
  nextBtn.addEventListener("click", (event) => {
    if (currentStep < formSteps.length - 1) {
      if (validateFields()) {
        formSteps[currentStep].style.display = "none";
        formSteps[currentStep + 1].style.display = "flex";
        currentStep++;
        sidebarTargets[currentStep - 1].classList.remove("active");
        sidebarTargets[currentStep].classList.add("active");
        handleSubmit(event);
        updateButtonState();
      }
    }
  });
});

prevBtns.forEach(function (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      formSteps[currentStep].style.display = "none";
      formSteps[currentStep - 1].style.display = "flex";
      currentStep--;
      sidebarTargets[currentStep + 1].classList.remove("active");
      sidebarTargets[currentStep].classList.add("active");
      updateButtonState();
    }
  });
});

const formFields = document.querySelectorAll("input[required]");

function validateField(field) {
  let isValid = true;
  if (!field.value) {
    field.style.borderColor = "red";
    const error = field.parentElement.querySelector(".error-message");
    if (error) {
      if (field.type === "email") {
        error.innerText = "Please enter your email address";
        error.style.display = "block";
      } else {
        error.style.display = "block";
      }
    }
    isValid = false;
  } else {
    field.style.borderColor = "";
    const error = field.parentElement.querySelector(".error-message");
    if (error) {
      error.style.display = "none";
    }
    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        field.style.borderColor = "red";
        const error = field.parentElement.querySelector(".error-message");
        if (error) {
          error.style.display = "block";
          error.innerText = "This is not a valid email format";
        }
        isValid = false;
        throw new Error("This is not a valid email format");
      }
    } else if (field.type === "tel") {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(field.value)) {
        field.style.borderColor = "red";
        const error = field.parentElement.querySelector(".error-message");
        if (error) {
          error.style.display = "block";
          error.innerText = "This is not a valid phone format, please use numbers only";
        }
        isValid = false;
        throw new Error("This is not a valid phone format, please use numbers only");
      }
    }
  }
  return isValid;
}

function validateFields() {
  let isValid = true;
  formFields.forEach((field) => {
    if (field.required) {
      isValid = validateField(field) && isValid;
    }
  });
  return isValid;
}

formFields.forEach((field) => {
  if (field.required) {
    if (field.type === "email") {
      field.addEventListener("blur", () => validateField(field));
    } else {
      field.addEventListener("keyup", () => validateField(field));
    }
  }
});
