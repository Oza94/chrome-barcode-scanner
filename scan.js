const wrapper = document.createElement("div");
wrapper.style.position = "fixed";
wrapper.style.top = "0px";
wrapper.style.bottom = "0px";
wrapper.style.left = "0px";
wrapper.style.right = "0px";
wrapper.style.padding = "16px";
wrapper.style.backgroundColor = "rgba(0, 0, 0, .3)";
wrapper.style.display = "flex";
wrapper.style.alignItems = "center";
wrapper.style.justifyContent = "center";
wrapper.style.zIndex = "10000";
wrapper.style.flexDirection = "column";
document.body.appendChild(wrapper);

function cleanup() {
  Quagga.stop();
  document.body.removeChild(wrapper);
}

const button = document.createElement("button");
button.innerText = "Close";
button.addEventListener("click", cleanup);
wrapper.appendChild(button);

Quagga.init(
  {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: wrapper,
    },
    decoder: {
      readers: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader",
        "upc_reader",
        "upc_e_reader",
        "i2of5_reader",
        "2of5_reader",
        "code_93_reader",
      ],
    },
  },
  function (err) {
    if (err) {
      document.body.removeChild("wrapper");
      console.log(err);
      return;
    }
    wrapper.querySelector("canvas").style.display = "none";
    console.log("Initialization finished. Ready to start");
    Quagga.start();
    Quagga.onDetected((data) => {
      const code = data.codeResult.code;
      console.log("Barcode detected", code);
      if (!document.activeElement) {
        console.log("No input focused, returning...");
        return;
      }
      console.log("Simulate change ...", document.activeElement);

      for (let i = 0; i < code.length; i++) {
        const key = code[i];
        document.activeElement.value = code.slice(0, i + 1);
        const event = new InputEvent("change");
        event.target = document.activeElement;
        document.activeElement.dispatchEvent(event);
      }

      cleanup();
    });
  }
);
