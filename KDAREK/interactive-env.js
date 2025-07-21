
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
    // const svg = document.getElementById('svgCanvas');
    const text = document.getElementById('text');
    const rect = svg.getBoundingClientRect();
    const xs = Array.from({ length: rect.width }, (_, i) => i);

    const pathGP = document.getElementById("GP");
    const fillGP = document.getElementById("FillGP");

    // const pathGPub   = document.getElementById("GPub");
    // const pathGPlb   = document.getElementById("GPlb");

    const pathNP = document.getElementById("newtonPoly");
    const fillNP = document.getElementById("polyFill");
    // const text = document.getElementById('temprary');
    const slider = document.getElementById("lipSlider");
    // .textContent = 'New Title Here';

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
            divDiff[i][j] = (divDiff[i + 1][j - 1] - divDiff[i][j - 1]) / (pts[i + j].x - pts[i].x);

        let result = divDiff[0][0];
        let mult = 1;
        for (let i = 1; i < n; i++) {
          mult *= (x - pts[i - 1].x);
          result += divDiff[0][i] * mult;
        }
        return result;
      }

      let Lipschitz = 0.000005; // Adjusted for demo purposes
      let d = "M";
      let f = "M";
      let u = 0;
      // text.textContent = `Lipschitz constant: ${slider.value}`;
      // console.log(`SVG width: ${rect.width}, height: ${rect.height}`);
      const upper = [], lower = [];
      // for (let x = 0; x <= ; x += 1) {
      for (const x of xs) {
        const y = newtonInterp(pts, x);
        d += `${x},${y} `;
        const n = pts.length;
        let mult = 1;
        let fact = 1;
        for (let i = 0; i < n; i++) {
          mult *= (x - pts[i].x);
          fact *= (i + 1);
        }
        u = mult / fact * Lipschitz * slider.value; // Simplified error term
        upper.push([x, y - u]);
        lower.unshift([x, y + u]);
      }
      pathNP.setAttribute("d", d);
      f += upper.map(p => `${p[0]},${p[1]}`).join(" ") + " " + lower.map(p => `${p[0]},${p[1]}`).join(" ") + " Z";
      fillNP.setAttribute("d", f);

      // === GP Kernel (RBF) ===
      function rbf(x1, x2, lengthScale = 70, variance = 1.) {
        const d = x1 - x2;
        return variance * Math.exp(-0.5 * d * d / (lengthScale * lengthScale));
      }

      // === Compute GP Posterior ===
      function computeGP(pts, xs) {
        const n = pts.length;
        const m = xs.length;
        const y_train = pts.map(p => p.y);
        // Build K, K_s, K_ss
        const K = Array.from({ length: n }, (_, i) =>
          Array.from({ length: n }, (_, j) => rbf(pts[i].x, pts[j].x))
        );
        const K_s = Array.from({ length: n }, (_, i) =>
          Array.from({ length: m }, (_, j) => rbf(pts[i].x, xs[j]))
        );
        const K_ss = Array.from({ length: m }, (_, i) =>
          Array.from({ length: m }, (_, j) => rbf(xs[i], xs[j]))
        );

        // text.textContent = `K: ${K.map(row => row.map(v => v.toFixed(2)))}; K_s: ${K_s.map(row => row.map(v => v.toFixed(2)))}`;
        // Add jitter to diagonal
        for (let i = 0; i < n; i++) K[i][i] += 1e-6;

        // Cholesky Decomposition
        function cholesky(A) {
          const L = Array(n).fill().map(() => Array(n).fill(0));
          for (let i = 0; i < n; i++) {
            for (let j = 0; j <= i; j++) {
              let sum = A[i][j];
              for (let k = 0; k < j; k++) sum -= L[i][k] * L[j][k];
              if (i === j) L[i][j] = Math.sqrt(sum);
              else L[i][j] = sum / L[j][j];
            }
          }
          return L;
        }

        const L = cholesky(K);
        // Solve for alpha = K⁻¹ y using Cholesky
        function solveLower(L, b) {
          const y = [];
          for (let i = 0; i < L.length; i++) {
            let sum = b[i];
            for (let j = 0; j < i; j++) sum -= L[i][j] * y[j];
            y[i] = sum / L[i][i];
          }
          return y;
        }

        function solveUpper(L, b) {
          const x = [];
          for (let i = L.length - 1; i >= 0; i--) {
            let sum = b[i];
            for (let j = i + 1; j < L.length; j++) sum -= L[j][i] * x[L.length - 1 - j];
            x.push(sum / L[i][i]);
          }
          return x.reverse();
        }

        const alpha1 = solveLower(L, y_train);
        const alpha = solveUpper(L, alpha1);

        // Mean prediction: μ = K_sᵗ α
        const mean = Array(m).fill(0);
        for (let i = 0; i < m; i++) {
          for (let j = 0; j < n; j++) {
            mean[i] += K_s[j][i] * alpha[j];
          }
        }


        // 2. Solve K⁻¹ K_s using Cholesky: solve L Lᵗ α = K_s
        function solveCholesky(L, K_s) {
          const n = L.length;
          const m = K_s[0].length;
          const Y = Array(n).fill().map(() => Array(m).fill(0));

          // Solve L Y = K_s
          for (let j = 0; j < m; j++) {
            for (let i = 0; i < n; i++) {
              let sum = K_s[i][j];
              for (let k = 0; k < i; k++) sum -= L[i][k] * Y[k][j];
              Y[i][j] = sum / L[i][i];
            }
          }

          // Solve Lᵗ α = Y
          const Alpha = Array(n).fill().map(() => Array(m).fill(0));
          for (let j = 0; j < m; j++) {
            for (let i = n - 1; i >= 0; i--) {
              let sum = Y[i][j];
              for (let k = i + 1; k < n; k++) sum -= L[k][i] * Alpha[k][j];
              Alpha[i][j] = sum / L[i][i];
            }
          }

          return Alpha; // Shape: [n][m]
        }

        // 3. Compute diagonal of K_sᵗ α = (K_sᵗ K⁻¹ K_s)
        function computeVarianceDiag(K_ss, K_s, Alpha) {
          const m = K_ss.length;
          const n = K_s.length;
          const var_diag = [];

          for (let i = 0; i < m; i++) {
            let dot = 0;
            for (let j = 0; j < n; j++) {
              dot += Alpha[j][i] * K_s[j][i];
            }
            var_diag.push(K_ss[i][i] - dot);
          }

          return var_diag;
        }

        // const L = cholesky(K);
        const Alpha = solveCholesky(L, K_s);         // [n][m]
        const var_diag = computeVarianceDiag(K_ss, K_s, Alpha); // [m]
        
        return { mean, std: var_diag.map(Math.sqrt) };
      }

      const { mean, std } = computeGP(pts, xs);

      // === Draw mean line ===
      const dGP = xs.map((x, i) =>
        `${i === 0 ? 'M' : 'L'} ${x},${mean[i]}`
      ).join(" ");

      pathGP.setAttribute("d", dGP);

      // let pathData = "";
      const upperPoints = [];
      const lowerPoints = [];

      // Collect upper and lower points
      for (let i = 0; i < mean.length; i++) {
        upperPoints.push(`${i === 0 ? 'M' : 'L'} ${xs[i]},${mean[i] + std[i] * 100}`);
        lowerPoints.push(`L ${xs[mean.length - 1 - i]},${mean[mean.length - 1 - i] - std[mean.length - 1 - i] * 100}`);
      }

      // Combine into single closed path
      const dGPfill = upperPoints.join(" ") + " " + lowerPoints.join(" ") + " Z";
      fillGP.setAttribute("d", dGPfill.trim());

    }

    circles.forEach(circle => {
      circle.addEventListener("pointerdown", e => {
        selected = e.target;
        offset.x = e.offsetX - parseFloat(selected.getAttribute("cx"));
        offset.y = e.offsetY - parseFloat(selected.getAttribute("cy"));
      });
    });

    svg.addEventListener("pointermove", e => {
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

    svg.addEventListener("pointerup", () => selected = null);
    svg.addEventListener("pointerleave", () => selected = null);

    slider.addEventListener('input', () => {
      updatePath();
    });
    updatePath();