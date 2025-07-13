// Leave A Follow And Like 
// IG: @ig.madebyakshar — madebyakshar.netlify.app
// Cursed Pupil Tracker
const eyes = document.querySelectorAll(".eye");

document.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  eyes.forEach((eye) => {
    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;

    const angleX = (clientX - eyeX) / 20;
    const angleY = (clientY - eyeY) / 20;

    eye.style.transform = `translate(${angleX}px, ${angleY}px)`;
  });
});
