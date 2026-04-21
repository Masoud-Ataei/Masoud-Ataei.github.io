AOS.init();

document.addEventListener("DOMContentLoaded", () => {

  const svg = document.getElementById("svgCanvasBasis");
  const slider = document.getElementById("degreeSlider");
  const degreeValue = document.getElementById("degreeValue");

  if (!svg || !slider || !degreeValue) {
    console.error("Missing DOM elements");
    return;
  }

  const width = 600, height = 300;
  // const width = svg.clientWidth;
  // const height = svg.clientHeight;
  let degree = 2;

  let knots = [0, 0.16, 0.33, 0.5, 0.67, 0.83, 1.0];

  // Create draggable circles
  let circles = knots.map((k, i) => {
    let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", k * width);
    c.setAttribute("cy", height - 20);
    c.setAttribute("r", 8);
    c.setAttribute("fill", "#3b82f6");
    c.style.cursor = "pointer";
    svg.appendChild(c);

    let dragging = false;

    c.addEventListener("mousedown", () => dragging = true);
    window.addEventListener("mouseup", () => dragging = false);

    window.addEventListener("mousemove", (e) => {
      if (!dragging) return;

      let rect = svg.getBoundingClientRect();
      let x = e.clientX - rect.left;

      x = Math.max(0, Math.min(width, x));
      knots[i] = x / width;

      c.setAttribute("cx", x);
      draw();
    });

    return c;
  });

  function bspline(i, k, t, knots) {
    if (k === 0) {
      return (t >= knots[i] && t < knots[i+1]) ? 1 : 0;
    }

    let denom1 = knots[i+k] - knots[i];
    let denom2 = knots[i+k+1] - knots[i+1];

    let term1 = denom1 === 0 ? 0 :
      ((t - knots[i]) / denom1) * bspline(i, k-1, t, knots);

    let term2 = denom2 === 0 ? 0 :
      ((knots[i+k+1] - t) / denom2) * bspline(i+1, k-1, t, knots);

    return term1 + term2;
  }

  function draw() {
    svg.querySelectorAll("path").forEach(p => p.remove());

    let colors = ["red","blue","green","purple","orange","brown"];
    let n = knots.length - degree - 1;

    for (let i = 0; i < n; i++) {
      let path = "";

      for (let px = 0; px <= width; px++) {
        let t = px / width;
        let y = bspline(i, degree, t, knots);
        let py = height - y * 200 - 30;

        path += (px === 0 ? "M" : "L") + px + "," + py;
      }

      let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", path);
      p.setAttribute("stroke", colors[i % colors.length]);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke-width", 2);

      svg.appendChild(p);
    }
  }

  slider.addEventListener("input", () => {
    degree = parseInt(slider.value);
    degreeValue.textContent = degree;
    draw();
  });

  draw();
});