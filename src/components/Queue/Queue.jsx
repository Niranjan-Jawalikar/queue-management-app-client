import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { use, useState } from "react";
import {
  restrictToHorizontalAxis,
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import "./Queue.scss";
import { Token } from "../Token/Token.jsx";
import { useEffect } from "react";
import axios from "../../axios.js";
import { Modal } from "../Modal/Modal.jsx";

export default function Queue({ queue }) {
  const [tokens, setTokens] = useState([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [hoveredToken, setHoveredToken] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`/queue/${queue._id}/tokens`);
        if (!response.data || response.data.length === 0) {
          setTokens([]);
          return;
        }
        const formattedTokens = response.data.map((token, idx) => ({
          _id: token._id,
          idx: idx,
          number: token.tokenNumber,
          name: token.name,
        }));
        setTokens(formattedTokens);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };
    fetchTokens();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id === over?.id) return;
    const oldIndex = active.id;
    const newIndex = over.id;
    let newTokens = arrayMove(tokens, oldIndex, newIndex);
    newTokens = newTokens.map((token, idx) => ({
      ...token,
      idx: idx,
    }));
    setTokens(newTokens);
    try {
      const response = await axios.put(`/token/${newTokens[newIndex]?._id}`, {
        tokenId: newTokens[newIndex]._id,
        prevTokenId: newTokens[newIndex - 1]?._id || null,
        nextTokenId: newTokens[newIndex + 1]?._id || null,
      });
    } catch (error) {
      console.error("Error updating token order:", error);
    }
  };

  const handleAddToken = async () => {
    if (!newName.trim()) return;

    try {
      const response = await axios.post(`/token`, {
        queueId: queue._id,
        name: newName.trim(),
      });
      const newTokenAdded = response.data;
      const newToken = {
        _id: newTokenAdded._id,
        idx: tokens.length,
        number: newTokenAdded.tokenNumber,
        name: newName.trim(),
      };

      setTokens([...tokens, newToken]);
      setNewName("");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding token:", error);
    }
  };

  const handleNextToken = () => {
    if (tokens.length === 0) return;
    try {
      const nextToken = tokens[0];
      axios.delete(`/token/${nextToken._id}`);
      let newTokens = tokens.slice(1);
      newTokens = newTokens.map((token, idx) => ({
        ...token,
        idx: idx,
      }));
      setTokens(newTokens);
    } catch (error) {
      console.error("Error moving to next token:", error);
    }
  };

  const handleDeleteToken = async (index) => {
    try {
      const deletedToken = tokens[index];
      await axios.delete(`/token/${deletedToken._id}`);
      const updated = [...tokens];
      updated.splice(index, 1);
      updated.forEach((token, idx) => {
        token.idx = idx;
      });
      setTokens(updated);
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[
        restrictToHorizontalAxis,
        restrictToWindowEdges,
        restrictToFirstScrollableAncestor,
      ]}
    >
      <SortableContext
        items={tokens.map((t) => t.idx)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="queue-header">
          <h3 className="queue-name">{queue.name}</h3>
          <span className="queue-created-at">
            {new Date(queue.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="queue-container">
          <div className="queue-button-container">
            <button
              className="add-token-button"
              onClick={() => setShowModal(true)}
            >
              ➕ Add Token
            </button>

            {tokens.length > 0 && (
              <button className="next-token-button" onClick={handleNextToken}>
                ✅ Next
              </button>
            )}
          </div>
          <div className="queue-list">
            {tokens.map((token) => (
              <Token
                className="token"
                key={token.idx}
                token={token}
                hoveredToken={hoveredToken}
                setHoveredToken={setHoveredToken}
                handleDeleteToken={handleDeleteToken}
              />
            ))}
            {tokens.length === 0 && (
              <div className="no-tokens-message">No tokens in this queue</div>
            )}
          </div>
          {showModal && (
            <Modal
              newName={newName}
              setNewName={setNewName}
              setShowModal={setShowModal}
              handleAddToken={handleAddToken}
            />
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
