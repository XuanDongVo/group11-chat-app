import { useState, useEffect } from "react";
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import type { ImageLightboxProps } from "../../types/chat";
import "../../styles/ImageLightbox.css";

export default function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setScale(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setScale(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handlePrevious, handleNext]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="lightbox-overlay" onClick={handleBackdropClick}>
      <button className="lightbox-close" onClick={onClose} title="Đóng (Esc)">
        <X size={24} />
      </button>

      <div className="lightbox-controls">
        <button
          className="lightbox-control-btn"
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
          title="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        <span className="lightbox-zoom-level">{Math.round(scale * 100)}%</span>
        <button
          className="lightbox-control-btn"
          onClick={handleZoomIn}
          disabled={scale >= 3}
          title="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
      </div>

      <div className="lightbox-content">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="lightbox-image"
          style={{ transform: `scale(${scale})` }}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={handlePrevious}
            title="Previous (←)"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={handleNext}
            title="Next (→)"
          >
            <ChevronRight size={32} />
          </button>

          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
