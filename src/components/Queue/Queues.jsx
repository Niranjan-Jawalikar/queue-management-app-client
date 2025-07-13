import Queue from "./Queue";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { Modal } from "../Modal/Modal.jsx";
import "./Queues.scss";

export const Queues = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newQueueName, setNewQueueName] = useState("");

  const handleCreateQueue = async () => {
    if (!newQueueName.trim()) return;

    const response = await axios.post("/queue", {
      name: newQueueName.trim(),
    });

    const newQueue = {
      ...response.data,
    };

    setQueues([...queues, newQueue]);
    setNewQueueName("");
    setShowModal(false);
  };

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get("/queue");

        setQueues(response.data);
      } catch (error) {
        console.error("Error fetching queues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);
  return (
    <div className="queues">
      <div className="queues-header">
        <h2>Queues</h2>
        <button className="new-queue-button" onClick={() => setShowModal(true)}>
          ➕ New Queue
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        queues.map((queue) => <Queue key={queue._id} queue={queue} />)
      )}
      {showModal && (
        <Modal
          newName={newQueueName}
          setNewName={setNewQueueName}
          setShowModal={setShowModal}
          handleAddToken={handleCreateQueue}
        />
      )}
    </div>
  );
};
