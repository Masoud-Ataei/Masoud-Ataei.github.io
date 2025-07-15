<!DOCTYPE html>
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script>
    AOS.init();

    let selected = null;
    let offset = { x: 0, y: 0 };

    const svg = document.getElementById("svgCanvas");
    const circles = [
      document.getElementById("circle1"),
      document.getElementById("circle2"),
      document.getElementById("circle3"),
      document.getElementById("circle4")
    ];

    const path = document.getElementById("newtonPoly");
    const fill = document.getElementById("polyFill");

    function updatePath() {
      const pts = circles.map(c => ({
        x: parseFloat(c.getAttribute("cx")),
        y: parseFloat(c.getAttribute("cy"))
      })).sort((a, b) => a.x - b.x);

      function newtonInterp(pts, x) {
        const n = pts.length;
        const divDiff = new Array(n).fill(0).map(_ => Array(n).fill(0));
        for (let i = 0; i < n; i++) divDiff[i][0] = pts[i].y;
        for (let j = 1; j < n; j++)
          for (let i = 0; i < n - j; i++)
            divDiff[i][j] = (divDiff[i+1][j-1] - divDiff[i][j-1]) / (pts[i+j].x - pts[i].x);

        let result = divDiff[0][0];
        let mult = 1;
        for (let i = 1; i < n; i++) {
          mult *= (x - pts[i - 1].x);
          result += divDiff[0][i] * mult;
        }
        return result;
      }

      let d = "M";
      let f = "M";
      const upper = [], lower = [];
      for (let x = pts[0].x; x <= pts[pts.length - 1].x; x += 1) {
        const y = newtonInterp(pts, x);
        d += `${x},${y} `;
        upper.push([x, y - 20]);
        lower.unshift([x, y + 20]);
      }
      path.setAttribute("d", d);
      f += upper.map(p => `${p[0]},${p[1]}`).join(" ") + " " + lower.map(p => `${p[0]},${p[1]}`).join(" ") + " Z";
      fill.setAttribute("d", f);
    }

    circles.forEach(circle => {
      circle.addEventListener("mousedown", e => {
        selected = e.target;
        offset.x = e.offsetX - parseFloat(selected.getAttribute("cx"));
        offset.y = e.offsetY - parseFloat(selected.getAttribute("cy"));
      });
    });

    svg.addEventListener("mousemove", e => {
      if (selected) {
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const ctm = svg.getScreenCTM().inverse();
        const transformed = pt.matrixTransform(ctm);
        selected.setAttribute("cx", transformed.x - offset.x);
        selected.setAttribute("cy", transformed.y - offset.y);
        updatePath();
      }
    });

    svg.addEventListener("mouseup", () => selected = null);
    svg.addEventListener("mouseleave", () => selected = null);

    updatePath();
  </script>
<html lang="en">