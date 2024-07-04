TPDirect.setupSDK(
    151711,
    "app_4L6D7260cV24Upa7DWKA1jOaIIZ69D4ZF7qCr8SOC1OVDTTf6Rix7qz4liTe",
    "sandbox"
  );
  
  let fields = {
    number: {
      element: ".card_number_input",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      element: ".expiration_input",
      placeholder: "MM / YY",
    },
    ccv: {
      element: ".ccv_input",
      placeholder: "CVV",
    },
  };
  
  TPDirect.card.setup({
    fields: fields,
    styles: {
      // Style card_number field
      ".payment_block .content .card_number_input": {
        "box-sizing":"border-box",
        "display": "flex",
        "align-items": "center",
        "width": "200px",
        "height": "38px",
        "margin-top": "15px",
        "margin-right": "calc(100% - 281px)",
        "border-radius": "5px",
        "border": "solid 1px #E8E8E8",
        "padding": "10px",
        "font-size": "16px",
        "font-weight": "500",
        "text-align": "left", 
        "color": "#000000",  
      },
      // Style expiration field
      ".payment_block .content .expiration_input": {
        "box-sizing": "border-box",
        "display": "flex",
        "align-items": "center",
        "width": "200px",
        "height": "38px",
        "margin-top": "15px",
        "margin-right": "calc(100% - 281px)",
        "border-radius": "5px",
        "border": "solid 1px #E8E8E8",
        "padding": "10px",
        "font-size": "16px",
        "font-weight": "500",
        "text-align": "left", 
        "color": "#000000",    
      },
      // Style cvv field
      ".payment_block .content .ccv_input": {
        "box-sizing": "border-box",
        "display": "flex",
        "align-items": "center",
        "width": "200px",
        "height": "38px",
        "margin-top": "15px",
        "margin-right": "calc(100% - 281px)",
        "border-radius": "5px",
        "border":" solid 1px #E8E8E8",
        "padding": "10px",
        "font-size": "16px",
        "font-weight": "500",
        "text-align": "left", 
        "color": "#000000",   
      },
      // Styling card-number field
    //   "input.card-number": {
    //     "font-size": "16px",
    //   },
      // style focus state
      ":focus": {
        color: "black",
      },
      // style valid state
      ".valid": {
        color: "green",
      },
      // style invalid state
      ".invalid": {
        color: "red",
      },
      // Media queries
      // Note that these apply to the iframe, not the root window.
      "@media screen and (max-width: 400px)": {
        input: {
          color: "orange",
        },
      },
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
  });


  
//實作 TPDirect.card.onUpdate，得知目前卡片資訊的輸入狀態


TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }
                                            
    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
    
    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
    
    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})















  let cardprompt = document.querySelector(".cardprompt");
  function onSubmit(event) {
    // 取得 TapPay Fields 的 status
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let phone = document.querySelector("#phone").value;
    let prompt = document.querySelector(".prompt");
  
    let phoneRegexp = "^(09)[0-9]{8}$";
    let emailRegexp = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";
    if (name == "" || email == "" || phone == "") {
      prompt.textContent = "請輸入完整";
    } else if (!phone.match(phoneRegexp)) {
      prompt.textContent = "手機格式不符合";
    } else if (!email.match(emailRegexp)) {
      prompt.textContent = "Email格式不符合";
    } else {
      prompt.textContent = "";
    }
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    if (tappayStatus.canGetPrime === false) {
      console.log("can not get prime");
      cardprompt.textContent = "信用卡填寫錯誤";
      return;
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        console.log("get prime error " + result.msg);
        cardprompt.textContent = "信用卡填寫錯誤";
        return;
      }
      let prime = result.card.prime;
      cardprompt.textContent = "";
      submitPrime(prime);
      // send prime to your server, to pay with Pay by Prime API .
      // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    });
  }
  function submitPrime(prime) {
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let phone = document.querySelector("#phone").value;
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prime: prime,
        order: {
          price: infos[0],
          trip: {
            attraction: {
              id: infos[1],
              name: infos[2],
              address: infos[3],
              image: infos[4],
            },
            date: infos[5],
            time: infos[6],
          },
          contact: {
            name: name,
            email: email,
            phone: phone,
          },
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data["error"]) {
          cardprompt.textContent = data["message"];
        } else if (data["data"]["payment"]["status"] != 0) {
          cardprompt.textContent =
            data["data"]["payment"]["message"] + "，請再試一次";
        } else {
          window.location.href = `/thankyou?number=${data["data"]["number"]}`;
        }
      });
  }