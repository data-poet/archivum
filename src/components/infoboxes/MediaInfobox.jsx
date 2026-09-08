import { useState } from "react";

/**
 * MediaInfobox.jsx
 *
 * Reusable infobox carousel.
 *
 * @typedef {Object} MediaImage
 * @property {string} src
 * @property {string} [caption]
 * @property {string} [alt]
 * @property {string} [type]
 *
 * @param {{ images?: MediaImage[], title?: string }} props
 */
export default function MediaInfobox({ images = [], title = "" }) {
  const [index, setIndex] = useState(0);

  if (!images?.length) return null;

  const image = images[index];

  const previous = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div style={s.wrapper}>
      <div style={s.imageWrapper}>
        <img
          src={image.src}
          alt={image.alt || title}
          style={s.img}
          loading="lazy"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={previous}
              style={{ ...s.arrow, left: 8 }}
              aria-label="Imagem anterior"
            >
              ‹
            </button>

            <button
              onClick={next}
              style={{ ...s.arrow, right: 8 }}
              aria-label="Próxima imagem"
            >
              ›
            </button>
          </>
        )}
      </div>

      {(image.caption || image.type) && (
        <div style={s.caption}>
          {image.type && <div style={s.type}>{image.type}</div>}

          {image.caption && <div>{image.caption}</div>}
        </div>
      )}

      {images.length > 1 && (
        <div style={s.footer}>
          <div style={s.counter}>
            {index + 1} / {images.length}
          </div>

          <div style={s.dots}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  ...s.dot,
                  opacity: i === index ? 1 : 0.35,
                }}
                aria-label={`Ir para imagem ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  wrapper: {
    borderBottom: "1px solid #c8c0a8",
    backgroundColor: "#e8e0cf",
  },

  imageWrapper: {
    position: "relative",
  },

  img: {
    display: "block",
    width: "100%",
    maxHeight: "260px",
    objectFit: "cover",
  },

  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    fontSize: "1.4rem",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.8)",
    color: "#1a1a1a",
  },

  caption: {
    padding: "6px 10px",
    fontSize: "0.75rem",
    color: "#4a4a4a",
    backgroundColor: "#f0ebe0",
    borderTop: "1px solid #c8c0a8",
    textAlign: "center",
    lineHeight: 1.4,
  },

  type: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "0.65rem",
    letterSpacing: "0.04em",
    marginBottom: "2px",
    opacity: 0.7,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    borderTop: "1px solid #c8c0a8",
    backgroundColor: "#e6dfcf",
  },

  counter: {
    fontSize: "0.7rem",
    color: "#666",
  },

  dots: {
    display: "flex",
    gap: "5px",
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#444",
    cursor: "pointer",
  },
};
