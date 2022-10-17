import { registerApplication, start } from "single-spa";

const app = {
  async mount(props) {
    const domElementContainer = document.getElementById(
      "single-spa-application:vanilla-app"
    );
    const dogImg = document.createElement("img");
    dogImg.id = "dogImg";
    dogImg.src =
      "https://images.dog.ceo/breeds/finnish-lapphund/mochilamvan.jpg";
    domElementContainer.appendChild(dogImg);
  },

  async unmount(props) {
    const dogImg = document.getElementById("dogImg");
    dogImg.remove();
  },
};

registerApplication({
  name: "01-code-exercise",
  app,
  activeWhen: ["/"],
});

start();
