document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.className = "image-lightbox-overlay";

  const img = document.createElement("img");
  overlay.appendChild(img);

  const closeBtn = document.createElement("button");
  closeBtn.className = "image-lightbox-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close image");
  closeBtn.textContent = "×";
  overlay.appendChild(closeBtn);

  document.body.appendChild(overlay);

  const closeLightbox = () => {
    overlay.classList.remove("is-zoomed");
    overlay.style.display = "none";
    img.src = "";
  };

  // Close only when clicking the backdrop, not the image itself.
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeLightbox();
    }
  });

  closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    closeLightbox();
  });

  // Toggle zoom on second click.
  img.addEventListener("click", (event) => {
    event.stopPropagation();
    if (overlay.dataset.dragged === "true") {
      overlay.dataset.dragged = "false";
      return;
    }
    overlay.classList.toggle("is-zoomed");
  });

  let isPanning = false;
  let startX = 0;
  let startY = 0;
  let startScrollLeft = 0;
  let startScrollTop = 0;

  img.addEventListener("pointerdown", (event) => {
    if (!overlay.classList.contains("is-zoomed")) return;
    event.preventDefault();
    isPanning = true;
    overlay.classList.add("is-panning");
    overlay.dataset.dragged = "false";
    startX = event.clientX;
    startY = event.clientY;
    startScrollLeft = overlay.scrollLeft;
    startScrollTop = overlay.scrollTop;
  });

  document.addEventListener("pointermove", (event) => {
    if (!isPanning) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 3) {
      overlay.dataset.dragged = "true";
    }
    overlay.scrollLeft = startScrollLeft - dx;
    overlay.scrollTop = startScrollTop - dy;
  });

  document.addEventListener("pointerup", () => {
    if (!isPanning) return;
    isPanning = false;
    overlay.classList.remove("is-panning");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.style.display === "flex") {
      closeLightbox();
    }
  });

  // Enable fullscreen on any image with .clickable-image
  document.querySelectorAll(".clickable-image").forEach((image) => {
    image.addEventListener("click", () => {
      img.src = image.src;
      overlay.classList.remove("is-zoomed");
      overlay.style.display = "flex";
    });
  });
});
