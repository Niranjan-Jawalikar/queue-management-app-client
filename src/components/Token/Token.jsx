import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Token.scss";

export function Token({
  token,
  hoveredToken,
  setHoveredToken,
  handleDeleteToken,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: token.idx });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      className="token"
      ref={setNodeRef}
      style={style}
      {...attributes}
      onMouseEnter={() => setHoveredToken(token.idx)}
      onMouseLeave={() => setHoveredToken(null)}
    >
      <div className="token-drag-handle" {...listeners}>
        <span className="token-number">{token.number}</span>
        <span className="token-name">{token.name}</span>
      </div>

      {hoveredToken === token.idx && (
        <button
          className="delete-token-button"
          onClick={(e) => {
            console.log("Delete button clicked for token:", token);
            e.stopPropagation();
            e.preventDefault();
            handleDeleteToken(token.idx);
          }}
          title="Delete token"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
